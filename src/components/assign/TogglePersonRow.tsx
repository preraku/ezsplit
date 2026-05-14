import { Person, ItemAssignment } from '../../types';
import { useAppState } from '../../hooks/useAppState';
import { PersonCircle } from '../common/PersonCircle';

interface Props {
  itemId: string;
  people: Person[];
  assignment: ItemAssignment | undefined;
}

export function TogglePersonRow({ itemId, people, assignment }: Props) {
  const { dispatch } = useAppState();
  const selected = assignment?.sharedPersonIds ?? [];

  function toggle(personId: string) {
    dispatch({ type: 'TOGGLE_PERSON_ON_ITEM', payload: { itemId, personId } });
  }

  function setAll() {
    dispatch({
      type: 'SET_ALL_PERSONS_ON_ITEM',
      payload: { itemId, personIds: people.map((p) => p.id) },
    });
  }

  function setNone() {
    dispatch({
      type: 'SET_ALL_PERSONS_ON_ITEM',
      payload: { itemId, personIds: [] },
    });
  }

  const isAll = people.length > 0 && selected.length === people.length;
  const isNone = selected.length === 0;

  const activeClass = 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
  const inactiveClass = 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';

  return (
    <div className="space-y-3">
      {/* Quick select */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Quick select</span>
        <button
          type="button"
          onClick={setAll}
          className={`px-3 py-1 text-xs font-semibold ${isAll ? activeClass : inactiveClass} active:bg-blue-200 dark:active:bg-blue-800`}
        >
          All
        </button>
        <button
          type="button"
          onClick={setNone}
          className={`px-3 py-1 text-xs font-semibold ${isNone ? activeClass : inactiveClass} active:bg-blue-200 dark:active:bg-blue-800`}
        >
          None
        </button>
      </div>

      {/* Person circles */}
      <div className="flex flex-wrap gap-4">
        {people.map((p) => {
          const isSelected = selected.includes(p.id);
          return (
            <PersonCircle
              key={p.id}
              person={p}
              selected={isSelected}
              onToggle={() => toggle(p.id)}
              size="md"
              showName
            />
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Split equally among {selected.length} {selected.length === 1 ? 'person' : 'people'}
        </p>
      )}
    </div>
  );
}
