import { useAppState } from '../../hooks/useAppState';
import { AssignItemCard } from '../assign/AssignItemCard';
import { NavButtons } from '../layout/NavButtons';
import { WarningBanner } from '../common/WarningBanner';
import { getAssignedQty } from '../../utils/calculations';

export function AssignStep() {
  const { state } = useAppState();
  const { people, items, assignments } = state;

  const unassignedItems = items.filter((item) => {
    const assignment = assignments[item.id];
    return getAssignedQty(assignment, item.quantity) === 0;
  });

  const partialItems = items.filter((item) => {
    const assignment = assignments[item.id];
    const assignedQty = getAssignedQty(assignment, item.quantity);
    return assignedQty > 0 && assignedQty < item.quantity;
  });

  const hasWarnings = unassignedItems.length > 0 || partialItems.length > 0;

  return (
    <>
      <div className="space-y-3">
        {hasWarnings && (
          <WarningBanner
            message={`${unassignedItems.length > 0 ? `${unassignedItems.length} item(s) unassigned. ` : ''}${partialItems.length > 0 ? `${partialItems.length} item(s) partially assigned.` : ''} You can still continue.`}
            type="warning"
          />
        )}

        {items.map((item) => (
          <AssignItemCard
            key={item.id}
            item={item}
            people={people}
            assignment={assignments[item.id]}
          />
        ))}
      </div>

      <NavButtons canProceed={true} />
    </>
  );
}
