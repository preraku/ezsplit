import { useAppState } from '../../hooks/useAppState';
import { ItemForm } from '../items/ItemForm';
import { ItemCard } from '../items/ItemCard';
import { TaxTipForm } from '../items/TaxTipForm';
import { NavButtons } from '../layout/NavButtons';
import { formatCurrency } from '../../utils/currency';

export function ItemsStep() {
  const { state } = useAppState();
  const { items, taxTotal, tipTotal } = state;

  const subtotal = items.reduce((sum, i) => sum + i.pricePerUnit * i.quantity, 0);
  const grandTotal = subtotal + taxTotal + tipTotal;
  const canProceed = items.length >= 1;

  return (
    <>
      <div className="space-y-4">
        <ItemForm />

        {items.length > 0 && (
          <div className="space-y-2">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {items.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 py-4 text-sm">
            No items added yet
          </p>
        )}

        <TaxTipForm />

        {items.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-1">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatCurrency(subtotal)}</span>
            </div>
            {taxTotal > 0 && (
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Tax</span>
                <span className="tabular-nums">{formatCurrency(taxTotal)}</span>
              </div>
            )}
            {tipTotal > 0 && (
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Tip</span>
                <span className="tabular-nums">{formatCurrency(tipTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-gray-900 dark:text-gray-100 pt-1 border-t border-gray-200 dark:border-gray-600">
              <span>Total</span>
              <span className="tabular-nums">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        )}
      </div>

      <NavButtons
        canProceed={canProceed}
        errorMessage={!canProceed ? 'Add at least one item to continue' : undefined}
      />
    </>
  );
}
