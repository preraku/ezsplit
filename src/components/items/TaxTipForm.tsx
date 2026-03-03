import { useAppState } from '../../hooks/useAppState';
import { CurrencyInput } from '../common/CurrencyInput';

export function TaxTipForm() {
  const { state, dispatch } = useAppState();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
      <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Tax &amp; Tip</h3>
      <div className="grid grid-cols-2 gap-3">
        <CurrencyInput
          value={state.taxTotal}
          onChange={(v) => dispatch({ type: 'SET_TAX', payload: v })}
          label="Tax"
          id="tax-input"
        />
        <CurrencyInput
          value={state.tipTotal}
          onChange={(v) => dispatch({ type: 'SET_TIP', payload: v })}
          label="Tip"
          id="tip-input"
        />
      </div>
    </div>
  );
}
