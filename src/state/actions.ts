import { Person, LineItem } from '../types';

export type Action =
  | { type: 'ADD_PERSON'; payload: Person }
  | { type: 'REMOVE_PERSON'; payload: { id: string } }
  | { type: 'ADD_ITEM'; payload: LineItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_ITEM'; payload: LineItem }
  | { type: 'SET_TAX'; payload: number }
  | { type: 'SET_TIP'; payload: number }
  | { type: 'TOGGLE_PERSON_ON_ITEM'; payload: { itemId: string; personId: string } }
  | { type: 'SET_ALL_PERSONS_ON_ITEM'; payload: { itemId: string; personIds: string[] } }
  | { type: 'SET_PERSON_QTY_ON_ITEM'; payload: { itemId: string; personId: string; qty: number } }
  | { type: 'RESET_ITEM_ASSIGNMENT'; payload: { itemId: string } }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET_ALL' };
