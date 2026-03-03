import { formatCurrency } from '../../utils/currency';

interface Props {
  label: string;
  amount: number;
  dimmed?: boolean;
  bold?: boolean;
  borderTop?: boolean;
}

export function ShareLine({ label, amount, dimmed, bold, borderTop }: Props) {
  return (
    <div
      className={`
        flex justify-between items-center py-1
        ${borderTop ? 'border-t border-gray-200 dark:border-gray-700 mt-1 pt-2' : ''}
      `}
    >
      <span
        className={`text-sm ${bold ? 'font-semibold text-gray-900 dark:text-gray-100' : dimmed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}
      >
        {label}
      </span>
      <span
        className={`text-sm tabular-nums ${bold ? 'font-bold text-gray-900 dark:text-gray-100' : dimmed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}
      >
        {formatCurrency(amount)}
      </span>
    </div>
  );
}
