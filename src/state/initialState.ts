import { AppState } from '../types';

export const initialState: AppState = {
  currentStep: 'people',
  people: [],
  items: [],
  taxTotal: 0,
  tipTotal: 0,
  assignments: {},
};
