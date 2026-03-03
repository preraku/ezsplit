import { useAppState } from '../../hooks/useAppState';
import { useCalculations } from '../../hooks/useCalculations';
import { PersonResult } from '../results/PersonResult';
import { NavButtons } from '../layout/NavButtons';
import { WarningBanner } from '../common/WarningBanner';
import { formatCurrency } from '../../utils/currency';

export function ResultsStep() {
  const { state } = useAppState();
  const { taxTotal, tipTotal } = state;
  const { results, unassignedSubtotal, unassignedTaxTip } = useCalculations();

  const showTax = taxTotal > 0;
  const showTip = tipTotal > 0;
  const assignedTotal = results.reduce((sum, r) => sum + r.total, 0);
  const unassignedTotal = unassignedSubtotal + unassignedTaxTip;
  const billTotal = assignedTotal + unassignedTotal;

  return (
    <>
      <div className="space-y-4">
        {unassignedSubtotal > 0 && (
          <WarningBanner
            message={`${formatCurrency(unassignedTotal)} is unassigned (${formatCurrency(unassignedSubtotal)} items + ${formatCurrency(unassignedTaxTip)} tax/tip) and not included in anyone's total.`}
            type="warning"
          />
        )}

        {/* Summary banner */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Bill</p>
          <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 tabular-nums">
            {formatCurrency(billTotal)}
          </p>
          {unassignedSubtotal > 0 && (
            <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
              Assigned: {formatCurrency(assignedTotal)}
            </p>
          )}
        </div>

        {/* Per-person results */}
        {results.map((result) => (
          <PersonResult
            key={result.person.id}
            result={result}
            showTax={showTax}
            showTip={showTip}
          />
        ))}
      </div>

      <NavButtons canProceed={true} isLastStep />
    </>
  );
}
