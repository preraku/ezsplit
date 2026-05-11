import { useState, useEffect } from 'react';

interface Props {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

export function CurrencyInput({ value, onChange, placeholder = '0.00', label, id }: Props) {
  const [raw, setRaw] = useState(value === 0 ? '' : value.toFixed(2));
  const [focused, setFocused] = useState(false);

  // Only sync external value changes when the input isn't focused
  useEffect(() => {
    if (!focused) {
      setRaw(value === 0 ? '' : value.toFixed(2));
    }
  }, [value, focused]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let input = e.target.value;

    // Allow only digits and a single decimal point
    input = input.replace(/[^0-9.]/g, '');
    const parts = input.split('.');
    if (parts.length > 2) input = parts[0] + '.' + parts.slice(1).join('');

    // Limit to 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      input = parts[0] + '.' + parts[1].slice(0, 2);
    }

    setRaw(input);
    const parsed = parseFloat(input);
    onChange(isNaN(parsed) ? 0 : parsed);
  }

  function handleBlur() {
    setFocused(false);
    if (raw === '' || raw === '.') {
      setRaw('');
      onChange(0);
    } else {
      const parsed = parseFloat(raw);
      if (!isNaN(parsed)) {
        setRaw(parsed.toFixed(2));
        onChange(parsed);
      }
    }
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
          inputMode="decimal"
          value={raw}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full pl-7 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            bg-white dark:bg-gray-800 text-base tabular-nums"
        />
      </div>
    </div>
  );
}
