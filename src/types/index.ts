export interface Person {
  id: string;
  name: string;
  color: string;
}

export interface LineItem {
  id: string;
  name: string;
  pricePerUnit: number;
  quantity: number;
  taxExempt?: boolean;
}

export interface ItemAssignment {
  itemId: string;
  sharedPersonIds: string[];        // used when item.quantity === 1
  quantities: Record<string, number>; // personId→qty, used when quantity > 1
}

export type Step = 'people' | 'items' | 'assign' | 'results';

export interface AppState {
  currentStep: Step;
  people: Person[];
  items: LineItem[];
  taxTotal: number;
  tipTotal: number;
  assignments: Record<string, ItemAssignment>;
}

export interface PersonResult {
  person: Person;
  itemLines: { itemName: string; share: number }[];
  subtotal: number;
  taxShare: number;
  tipShare: number;
  total: number;
}
