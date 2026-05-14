interface Props {
  message: string;
  type?: 'warning' | 'error' | 'info';
}

export function WarningBanner({ message, type = 'warning' }: Props) {
  const classes = {
    warning: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
    error: 'bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200',
    info: 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200',
  };

  const icons = {
    warning: '⚠️',
    error: '🚫',
    info: 'ℹ️',
  };

  return (
    <div className={`border px-4 py-3 text-sm flex items-start gap-2 ${classes[type]}`}>
      <span className="flex-shrink-0">{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}
