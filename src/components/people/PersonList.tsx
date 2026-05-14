import { useAppState } from '../../hooks/useAppState';
import { PersonCircle } from '../common/PersonCircle';

export function PersonList() {
  const { state, dispatch } = useAppState();
  const { people } = state;

  if (people.length === 0) {
    return (
      <p className="text-center text-gray-400 dark:text-gray-500 py-8 text-sm">
        Add people to get started
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 py-2">
      {people.map((person) => (
        <div key={person.id} className="relative flex flex-col items-center gap-1">
          <div className="relative">
            <PersonCircle person={person} size="lg" />
            <button
              type="button"
              onClick={() => dispatch({ type: 'REMOVE_PERSON', payload: { id: person.id } })}
              className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 text-white
                flex items-center justify-center text-xs font-bold leading-none
                active:bg-gray-900 transition-colors"
              aria-label={`Remove ${person.name}`}
            >
              ×
            </button>
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 max-w-[60px] truncate text-center">
            {person.name}
          </span>
        </div>
      ))}
    </div>
  );
}
