import { Person } from '../../types';
import { getInitials } from '../../utils/initials';

interface Props {
  person: Person;
  selected?: boolean;
  onToggle?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export function PersonCircle({ person, selected, onToggle, size = 'md', showName }: Props) {
  const sizeClasses = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  const circle = (
    <div
      className={`
        ${sizeClasses[size]} flex items-center justify-center font-bold text-white
        transition-all duration-150 select-none
        ${onToggle ? 'cursor-pointer' : ''}
        ${selected === false ? 'opacity-30' : ''}
        ${selected ? 'ring-4 ring-offset-2 ring-white dark:ring-gray-300 shadow-lg scale-110' : ''}
      `}
      style={{ backgroundColor: person.color }}
      onClick={onToggle}
      role={onToggle ? 'button' : undefined}
      aria-pressed={selected}
      aria-label={person.name}
    >
      {getInitials(person.name)}
    </div>
  );

  if (showName) {
    return (
      <div className="flex flex-col items-center gap-1">
        {circle}
        <span className="text-xs text-gray-600 dark:text-gray-400 max-w-[60px] truncate text-center">
          {person.name}
        </span>
      </div>
    );
  }

  return circle;
}
