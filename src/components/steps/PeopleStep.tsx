import { useAppState } from '../../hooks/useAppState';
import { PersonInput } from '../people/PersonInput';
import { PersonList } from '../people/PersonList';
import { NavButtons } from '../layout/NavButtons';

export function PeopleStep() {
  const { state } = useAppState();
  const canProceed = state.people.length >= 1;

  return (
    <>
      <div className="space-y-4">
        <PersonInput />
        <PersonList />
      </div>

      <NavButtons
        canProceed={canProceed}
        errorMessage={!canProceed ? 'Add at least one person to continue' : undefined}
      />
    </>
  );
}
