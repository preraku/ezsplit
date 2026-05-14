interface Props {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  label?: string;
}

export function QuantitySelector({ value, min = 0, max, onChange, label }: Props) {
  const canDecrement = value > (min ?? 0);
  const canIncrement = max === undefined || value < max;

  return (
    <div className="flex items-center gap-1">
      {label && <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">{label}</span>}
      <button
        type="button"
        onClick={() => canDecrement && onChange(value - 1)}
        disabled={!canDecrement}
        className={`
          w-9 h-9 flex items-center justify-center text-lg font-bold
          transition-colors duration-150
          ${canDecrement
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 active:bg-gray-300 dark:active:bg-gray-600'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'}
        `}
        aria-label="Decrease"
      >
        −
      </button>
      <span className="w-8 text-center font-semibold text-gray-900 dark:text-gray-100 text-base tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => canIncrement && onChange(value + 1)}
        disabled={!canIncrement}
        className={`
          w-9 h-9 flex items-center justify-center text-lg font-bold
          transition-colors duration-150
          ${canIncrement
            ? 'bg-blue-500 text-white active:bg-blue-600'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'}
        `}
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}
