interface Props {
  assignedQty: number;
  totalQty: number;
}

export function UnassignedBadge({ assignedQty, totalQty }: Props) {
  if (assignedQty >= totalQty) return null;

  const isNone = assignedQty === 0;
  const remaining = totalQty - assignedQty;

  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 text-xs font-semibold
        ${isNone ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'}
      `}
    >
      {isNone ? 'Unassigned' : `${remaining} unassigned`}
    </span>
  );
}
