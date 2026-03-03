import { useState } from 'react';
import { nanoid } from 'nanoid';
import { useAppState } from '../../hooks/useAppState';
import { CurrencyInput } from '../common/CurrencyInput';
import { QuantitySelector } from '../common/QuantitySelector';

export function ItemForm() {
  const { dispatch } = useAppState();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [qty, setQty] = useState(1);

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed || price <= 0) return;
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: nanoid(),
        name: trimmed,
        pricePerUnit: Math.round(price * 100) / 100,
        quantity: qty,
      },
    });
    setName('');
    setPrice(0);
    setQty(1);
  }

  const canAdd = name.trim().length > 0 && price > 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
      <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Add Item</h3>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item name…"
        maxLength={40}
        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          bg-white dark:bg-gray-800 text-base"
      />

      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <CurrencyInput
            value={price}
            onChange={setPrice}
            label="Price per unit"
            id="item-price"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Qty</label>
          <QuantitySelector value={qty} min={1} onChange={setQty} />
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!canAdd}
        className={`
          w-full py-2.5 rounded-lg font-semibold transition-colors
          ${canAdd
            ? 'bg-blue-500 text-white active:bg-blue-600'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'}
        `}
      >
        Add Item
      </button>
    </div>
  );
}
