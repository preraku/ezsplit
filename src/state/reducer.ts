import { AppState, ItemAssignment, Step } from '../types';
import { Action } from './actions';
import { initialState } from './initialState';

const STEPS: Step[] = ['people', 'items', 'assign', 'results'];

function nextStep(current: Step): Step {
  const idx = STEPS.indexOf(current);
  return idx < STEPS.length - 1 ? STEPS[idx + 1] : current;
}

function prevStep(current: Step): Step {
  const idx = STEPS.indexOf(current);
  return idx > 0 ? STEPS[idx - 1] : current;
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_PERSON':
      return { ...state, people: [...state.people, action.payload] };

    case 'REMOVE_PERSON': {
      const { id } = action.payload;
      const newPeople = state.people.filter((p) => p.id !== id);
      // Clean up assignments
      const newAssignments = { ...state.assignments };
      for (const itemId in newAssignments) {
        const a = newAssignments[itemId];
        const newShared = a.sharedPersonIds.filter((pid) => pid !== id);
        const newQtys = { ...a.quantities };
        delete newQtys[id];
        newAssignments[itemId] = { ...a, sharedPersonIds: newShared, quantities: newQtys };
      }
      return { ...state, people: newPeople, assignments: newAssignments };
    }

    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };

    case 'REMOVE_ITEM': {
      const { id } = action.payload;
      const newItems = state.items.filter((i) => i.id !== id);
      const newAssignments = { ...state.assignments };
      delete newAssignments[id];
      return { ...state, items: newItems, assignments: newAssignments };
    }

    case 'UPDATE_ITEM': {
      const updatedItem = action.payload;
      const newItems = state.items.map((i) => (i.id === updatedItem.id ? updatedItem : i));
      const oldItem = state.items.find((i) => i.id === updatedItem.id);

      let newAssignments = { ...state.assignments };

      // Reset assignment when quantity changes — avoids invalid states
      if (oldItem && oldItem.quantity !== updatedItem.quantity) {
        delete newAssignments[updatedItem.id];
      }

      return { ...state, items: newItems, assignments: newAssignments };
    }

    case 'SET_TAX':
      return { ...state, taxTotal: action.payload };

    case 'SET_TIP':
      return { ...state, tipTotal: action.payload };

    case 'TOGGLE_PERSON_ON_ITEM': {
      const { itemId, personId } = action.payload;
      const existing: ItemAssignment = state.assignments[itemId] ?? {
        itemId,
        sharedPersonIds: [],
        quantities: {},
      };
      const isSelected = existing.sharedPersonIds.includes(personId);
      const newShared = isSelected
        ? existing.sharedPersonIds.filter((pid) => pid !== personId)
        : [...existing.sharedPersonIds, personId];
      return {
        ...state,
        assignments: {
          ...state.assignments,
          [itemId]: { ...existing, sharedPersonIds: newShared },
        },
      };
    }

    case 'SET_ALL_PERSONS_ON_ITEM': {
      const { itemId, personIds } = action.payload;
      const existing: ItemAssignment = state.assignments[itemId] ?? {
        itemId,
        sharedPersonIds: [],
        quantities: {},
      };
      return {
        ...state,
        assignments: {
          ...state.assignments,
          [itemId]: { ...existing, sharedPersonIds: personIds },
        },
      };
    }

    case 'SET_PERSON_QTY_ON_ITEM': {
      const { itemId, personId, qty } = action.payload;
      const existing: ItemAssignment = state.assignments[itemId] ?? {
        itemId,
        sharedPersonIds: [],
        quantities: {},
      };
      const newQtys = { ...existing.quantities, [personId]: qty };
      if (qty === 0) delete newQtys[personId];
      return {
        ...state,
        assignments: {
          ...state.assignments,
          [itemId]: { ...existing, quantities: newQtys },
        },
      };
    }

    case 'RESET_ITEM_ASSIGNMENT': {
      const { itemId } = action.payload;
      const newAssignments = { ...state.assignments };
      delete newAssignments[itemId];
      return { ...state, assignments: newAssignments };
    }

    case 'NEXT_STEP':
      return { ...state, currentStep: nextStep(state.currentStep) };

    case 'PREV_STEP':
      return { ...state, currentStep: prevStep(state.currentStep) };

    case 'RESET_ALL':
      return initialState;

    default:
      return state;
  }
}
