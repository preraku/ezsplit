import { useAppState } from '../../hooks/useAppState';

interface Props {
  canProceed: boolean;
  errorMessage?: string;
  onNext?: () => void;
  isLastStep?: boolean;
}

export function NavButtons({ canProceed, errorMessage, onNext, isLastStep }: Props) {
  const { state, dispatch } = useAppState();
  const isPeopleStep = state.currentStep === 'people';

  function handleNext() {
    if (!canProceed) return;
    if (onNext) onNext();
    else dispatch({ type: 'NEXT_STEP' });
  }

  function handleBack() {
    dispatch({ type: 'PREV_STEP' });
  }

  function handleReset() {
    dispatch({ type: 'RESET_ALL' });
  }

  const nextLabel = isLastStep ? 'Start Over' : 'Next →';

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 pt-3"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)' }}
    >
      <div className="max-w-md mx-auto flex flex-col gap-2">
        {errorMessage && (
          <p className="text-sm text-red-600 text-center">{errorMessage}</p>
        )}
        <div className="flex gap-3">
          {!isPeopleStep && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold
                active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
            >
              ← Back
            </button>
          )}
          {isLastStep ? (
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-3 bg-gray-800 text-white font-semibold
                active:bg-gray-900 transition-colors"
            >
              Start Over
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed}
              className={`
                flex-1 py-3 font-semibold transition-colors
                ${canProceed
                  ? 'bg-blue-500 text-white active:bg-blue-600'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'}
              `}
            >
              {nextLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
