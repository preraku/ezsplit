import { PersonResult as PersonResultType } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { getInitials } from '../../utils/initials';
import { ShareLine } from './ShareLine';

interface Props {
  result: PersonResultType;
  showTax: boolean;
  showTip: boolean;
}

export function PersonResult({ result, showTax, showTip }: Props) {
  const { person, itemLines, subtotal, taxShare, tipShare, total } = result;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Person header */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: person.color + '18' }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
          style={{ backgroundColor: person.color }}
        >
          {getInitials(person.name)}
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-900 dark:text-gray-100">{person.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold" style={{ color: person.color }}>
            {formatCurrency(total)}
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="px-4 py-3">
        {itemLines.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">No items assigned</p>
        ) : (
          <>
            {itemLines.map((line, i) => (
              <ShareLine key={i} label={line.itemName} amount={line.share} />
            ))}
            {(showTax || showTip) && (
              <>
                <div className="border-t border-gray-100 dark:border-gray-800 my-1" />
                <ShareLine label="Subtotal" amount={subtotal} dimmed />
                {showTax && <ShareLine label="Tax" amount={taxShare} dimmed />}
                {showTip && <ShareLine label="Tip" amount={tipShare} dimmed />}
              </>
            )}
            <ShareLine label="Total" amount={total} bold borderTop />
          </>
        )}
      </div>
    </div>
  );
}
