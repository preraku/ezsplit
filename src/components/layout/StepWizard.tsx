import { useAppState } from '../../hooks/useAppState';
import { StepHeader } from './StepHeader';
import { PeopleStep } from '../steps/PeopleStep';
import { ItemsStep } from '../steps/ItemsStep';
import { AssignStep } from '../steps/AssignStep';
import { ResultsStep } from '../steps/ResultsStep';

export function StepWizard() {
  const { state } = useAppState();
  const { currentStep } = state;

  const renderStep = () => {
    switch (currentStep) {
      case 'people': return <PeopleStep />;
      case 'items': return <ItemsStep />;
      case 'assign': return <AssignStep />;
      case 'results': return <ResultsStep />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <StepHeader currentStep={currentStep} />
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-28">
        <div className="max-w-md mx-auto">
          {renderStep()}
        </div>
      </main>
    </div>
  );
}
