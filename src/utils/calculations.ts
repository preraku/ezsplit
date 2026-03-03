import { Person, LineItem, ItemAssignment, PersonResult } from '../types';

export function calculateResults(
  people: Person[],
  items: LineItem[],
  assignments: Record<string, ItemAssignment>,
  taxTotal: number,
  tipTotal: number
): { results: PersonResult[]; unassignedSubtotal: number; unassignedTaxTip: number } {
  // Step 1: Calculate each person's share per item
  const personSubtotals: Record<string, number> = {};
  const personItemLines: Record<string, { itemName: string; share: number }[]> = {};

  for (const p of people) {
    personSubtotals[p.id] = 0;
    personItemLines[p.id] = [];
  }

  let totalAssignedSubtotal = 0;
  let unassignedSubtotal = 0;

  for (const item of items) {
    const assignment = assignments[item.id];
    const itemTotal = item.pricePerUnit * item.quantity;

    if (!assignment) {
      unassignedSubtotal += itemTotal;
      continue;
    }

    if (item.quantity === 1) {
      // Split equally among sharedPersonIds
      const shared = assignment.sharedPersonIds.filter((pid) =>
        people.some((p) => p.id === pid)
      );
      if (shared.length === 0) {
        unassignedSubtotal += itemTotal;
        continue;
      }
      const share = itemTotal / shared.length;
      for (const pid of shared) {
        personSubtotals[pid] = (personSubtotals[pid] ?? 0) + share;
        personItemLines[pid] = [
          ...(personItemLines[pid] ?? []),
          { itemName: item.name, share },
        ];
      }
      totalAssignedSubtotal += itemTotal;
    } else {
      // qty > 1: use quantities map
      const qtys = assignment.quantities;
      let assignedQty = 0;
      for (const pid in qtys) {
        if (!people.some((p) => p.id === pid)) continue;
        const qty = qtys[pid] ?? 0;
        assignedQty += qty;
        const share = qty * item.pricePerUnit;
        personSubtotals[pid] = (personSubtotals[pid] ?? 0) + share;
        if (qty > 0) {
          personItemLines[pid] = [
            ...(personItemLines[pid] ?? []),
            { itemName: item.name, share },
          ];
        }
      }
      const assigned = assignedQty * item.pricePerUnit;
      totalAssignedSubtotal += assigned;
      const unassigned = (item.quantity - assignedQty) * item.pricePerUnit;
      if (unassigned > 0) unassignedSubtotal += unassigned;
    }
  }

  // Step 2: Prorate tax and tip — only the assigned fraction
  const totalBillSubtotal = totalAssignedSubtotal + unassignedSubtotal;
  const assignedFraction = totalBillSubtotal > 0 ? totalAssignedSubtotal / totalBillSubtotal : 0;
  const assignedTax = taxTotal * assignedFraction;
  const assignedTip = tipTotal * assignedFraction;
  const assignedTaxTip = assignedTax + assignedTip;
  const results: PersonResult[] = [];

  // If totalAssignedSubtotal is 0, split equally among all people
  const splitEqually = totalAssignedSubtotal === 0;
  const equalShare = people.length > 0 ? 1 / people.length : 0;

  let taxTipSum = 0;
  let maxSubtotalPerson: Person | null = null;
  let maxSubtotal = -1;

  for (const p of people) {
    const subtotal = personSubtotals[p.id] ?? 0;
    const fraction = splitEqually
      ? equalShare
      : totalAssignedSubtotal > 0
      ? subtotal / totalAssignedSubtotal
      : 0;

    const taxShare = Math.round(assignedTax * fraction * 100) / 100;
    const tipShare = Math.round(assignedTip * fraction * 100) / 100;
    taxTipSum += taxShare + tipShare;

    if (subtotal > maxSubtotal) {
      maxSubtotal = subtotal;
      maxSubtotalPerson = p;
    }

    results.push({
      person: p,
      itemLines: personItemLines[p.id] ?? [],
      subtotal,
      taxShare,
      tipShare,
      total: subtotal + taxShare + tipShare,
    });
  }

  // Penny correction: adjust the person with highest subtotal
  const rounding = Math.round((assignedTaxTip - taxTipSum) * 100) / 100;
  if (rounding !== 0 && maxSubtotalPerson) {
    const idx = results.findIndex((r) => r.person.id === maxSubtotalPerson!.id);
    if (idx >= 0) {
      const r = results[idx];
      const correctedTaxShare = Math.round((r.taxShare + rounding) * 100) / 100;
      results[idx] = {
        ...r,
        taxShare: correctedTaxShare,
        total: r.subtotal + correctedTaxShare + r.tipShare,
      };
    }
  }

  const unassignedTaxTip = Math.round((taxTotal + tipTotal - assignedTaxTip) * 100) / 100;
  return { results, unassignedSubtotal, unassignedTaxTip };
}

export function getAssignedQty(
  assignment: ItemAssignment | undefined,
  itemQty: number
): number {
  if (!assignment) return 0;
  if (itemQty === 1) return assignment.sharedPersonIds.length > 0 ? 1 : 0;
  return Object.values(assignment.quantities).reduce((a, b) => a + b, 0);
}
