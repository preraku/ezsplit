import { useState } from 'react';
import { nanoid } from 'nanoid';
import { useAppState } from '../../hooks/useAppState';
import { pickColor } from '../../utils/colors';

export function PersonInput() {
  const { state, dispatch } = useAppState();
  const [name, setName] = useState('');

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    dispatch({
      type: 'ADD_PERSON',
      payload: {
        id: nanoid(),
        name: trimmed,
        color: pickColor(state.people.length),
      },
    });
    setName('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleAdd();
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a name…"
        maxLength={24}
        className="flex-1 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          bg-white dark:bg-gray-800 text-base"
      />
      <button
        type="button"
        onClick={handleAdd}
        disabled={!name.trim()}
        className={`
          px-4 py-2.5 rounded-lg font-semibold transition-colors
          ${name.trim()
            ? 'bg-blue-500 text-white active:bg-blue-600'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'}
        `}
      >
        Add
      </button>
    </div>
  );
}
