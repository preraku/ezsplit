interface Props {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

export function CurrencyInput({ value, onChange, placeholder = '0.00', label, id }: Props) {
  // value is stored as dollars (e.g. 2.5 means $2.50)
  // We track cents internally for the integer-entry UX
  const cents = Math.round(value * 100);
  const displayValue = cents === 0 ? '' : (cents / 100).toFixed(2);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/[^0-9]/g, '');
    const newCents = parseInt(digits, 10);
    onChange(isNaN(newCents) ? 0 : newCents / 100);
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <span className="absolute left-3 text-gray-500 dark:text-gray-400 font-medium select-none">$</span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-7 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            bg-white dark:bg-gray-800 text-base tabular-nums"
        />
      </div>
    </div>
  );
}
