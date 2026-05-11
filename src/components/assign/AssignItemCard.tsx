import { LineItem, Person, ItemAssignment } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { getAssignedQty } from '../../utils/calculations';
import { TogglePersonRow } from './TogglePersonRow';
import { PerPersonQtyRow } from './PerPersonQtyRow';
import { UnassignedBadge } from './UnassignedBadge';

interface Props {
  item: LineItem;
  people: Person[];
  assignment: ItemAssignment | undefined;
}

export function AssignItemCard({ item, people, assignment }: Props) {
  const assignedQty = getAssignedQty(assignment, item.quantity);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono tabular-nums">
            {formatCurrency(item.pricePerUnit)}
            {item.quantity > 1 && ` × ${item.quantity}`}
          </p>
        </div>
        <div className="ml-2 flex-shrink-0">
          <UnassignedBadge assignedQty={assignedQty} totalQty={item.quantity} />
        </div>
      </div>

      {/* Assignment UI */}
      <div className="px-4 py-3">
        {item.quantity === 1 ? (
          <TogglePersonRow itemId={item.id} people={people} assignment={assignment} />
        ) : (
          <PerPersonQtyRow item={item} people={people} assignment={assignment} />
        )}
      </div>
    </div>
  );
}
