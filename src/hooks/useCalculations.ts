import { useMemo } from 'react';
import { useAppState } from './useAppState';
import { calculateResults } from '../utils/calculations';

export function useCalculations() {
  const { state } = useAppState();
  const { people, items, assignments, taxTotal, tipTotal } = state;

  return useMemo(
    () => calculateResults(people, items, assignments, taxTotal, tipTotal),
    [people, items, assignments, taxTotal, tipTotal]
  );
}
