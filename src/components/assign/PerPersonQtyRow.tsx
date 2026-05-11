import { Person, LineItem, ItemAssignment } from '../../types';
import { useAppState } from '../../hooks/useAppState';
import { PersonCircle } from '../common/PersonCircle';
import { QuantitySelector } from '../common/QuantitySelector';
import { formatCurrency } from '../../utils/currency';

interface Props {
  item: LineItem;
  people: Person[];
  assignment: ItemAssignment | undefined;
}

export function PerPersonQtyRow({ item, people, assignment }: Props) {
  const { dispatch } = useAppState();
  const qtys = assignment?.quantities ?? {};

  const assignedTotal = Object.values(qtys).reduce((a, b) => a + b, 0);
  const remaining = item.quantity - assignedTotal;

  function setQty(personId: string, qty: number) {
    dispatch({
      type: 'SET_PERSON_QTY_ON_ITEM',
      payload: { itemId: item.id, personId, qty },
    });
  }

  return (
    <div className="space-y-2">
      <div
        className={`
          text-xs font-semibold px-2 py-1 rounded-full inline-flex
          ${remaining === 0
            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
            : remaining > 0
            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
            : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}
        `}
      >
        {remaining === 0 ? 'All assigned' : `${remaining} remaining`}
      </div>

      <div className="space-y-2">
        {people.map((p) => {
          const personQty = qtys[p.id] ?? 0;
          const personMax = personQty + remaining;
          const personShare = personQty * item.pricePerUnit;

          return (
            <div key={p.id} className="flex items-center gap-3">
              <PersonCircle person={p} size="sm" />
              <span className="flex-1 text-sm text-gray-800 dark:text-gray-200 truncate">{p.name}</span>
              {personQty > 0 && (
                <span className="text-xs font-mono tabular-nums text-gray-500 dark:text-gray-400">
                  {formatCurrency(personShare)}
                </span>
              )}
              <QuantitySelector
                value={personQty}
                min={0}
                max={personMax}
                onChange={(v) => setQty(p.id, v)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
