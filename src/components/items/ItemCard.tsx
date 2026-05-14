import { useState } from 'react';
import { LineItem } from '../../types';
import { useAppState } from '../../hooks/useAppState';
import { formatCurrency } from '../../utils/currency';
import { CurrencyInput } from '../common/CurrencyInput';
import { QuantitySelector } from '../common/QuantitySelector';

interface Props {
  item: LineItem;
}

export function ItemCard({ item }: Props) {
  const { dispatch } = useAppState();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.pricePerUnit);
  const [qty, setQty] = useState(item.quantity);
  const [taxExempt, setTaxExempt] = useState(item.taxExempt ?? false);

  function startEdit() {
    setName(item.name);
    setPrice(item.pricePerUnit);
    setQty(item.quantity);
    setTaxExempt(item.taxExempt ?? false);
    setEditing(true);
  }

  function save() {
    const trimmed = name.trim();
    if (!trimmed || price <= 0) return;
    dispatch({
      type: 'UPDATE_ITEM',
      payload: {
        id: item.id,
        name: trimmed,
        pricePerUnit: Math.round(price * 100) / 100,
        quantity: qty,
        taxExempt,
      },
    });
    setEditing(false);
  }

  function cancel() {
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="bg-white dark:bg-gray-900 border-2 border-blue-300 dark:border-blue-600 p-4 space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            bg-white dark:bg-gray-800 text-base"
          autoFocus
        />
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <CurrencyInput
              value={price}
              onChange={setPrice}
              label="Price per unit"
              id={`edit-price-${item.id}`}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Qty</label>
            <QuantitySelector value={qty} min={1} onChange={setQty} />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={taxExempt}
            onChange={() => setTaxExempt(!taxExempt)}
            className="w-4 h-4 rounded accent-blue-500"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">Tax exempt</span>
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={cancel}
            className="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold
              active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!name.trim() || price <= 0}
            className={`flex-1 py-2 font-semibold transition-colors
              ${name.trim() && price > 0
                ? 'bg-blue-500 text-white active:bg-blue-600'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'}`}
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
      <div className="flex-1 min-w-0 cursor-pointer" onClick={startEdit}>
        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-mono tabular-nums">{formatCurrency(item.pricePerUnit)}</span>
          {item.quantity > 1 && (
            <span> × {item.quantity} = <span className="font-mono tabular-nums">{formatCurrency(item.pricePerUnit * item.quantity)}</span></span>
          )}
          {item.taxExempt && (
            <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400">Tax exempt</span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-2 ml-3 flex-shrink-0">
        <button
          type="button"
          onClick={startEdit}
          className="w-8 h-8 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center
            text-sm active:bg-gray-200 dark:active:bg-gray-700 transition-colors"
          aria-label={`Edit ${item.name}`}
        >
          ✎
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })}
          className="w-8 h-8 bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400 flex items-center justify-center
            font-bold text-lg active:bg-red-200 dark:active:bg-red-800 transition-colors"
          aria-label={`Remove ${item.name}`}
        >
          ×
        </button>
      </div>
    </div>
  );
}
