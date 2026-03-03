import { useAppContext } from '../context/AppContext';

export function useAppState() {
  const { state, dispatch } = useAppContext();
  return { state, dispatch };
}
