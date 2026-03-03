import { Step } from '../../types';

interface Props {
  currentStep: Step;
}

const STEPS: { key: Step; label: string }[] = [
  { key: 'people', label: 'People' },
  { key: 'items', label: 'Items' },
  { key: 'assign', label: 'Assign' },
  { key: 'results', label: 'Results' },
];

const STEP_TITLES: Record<Step, string> = {
  people: 'Who\'s splitting?',
  items: 'What did you order?',
  assign: 'Who had what?',
  results: 'Here\'s the bill',
};

export function StepHeader({ currentStep }: Props) {
  const currentIdx = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 pt-4 pb-3">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-3">
        {STEPS.map((step, idx) => (
          <div key={step.key} className="flex items-center gap-2">
            <div
              className={`
                h-2 rounded-full transition-all duration-300
                ${idx === currentIdx
                  ? 'bg-blue-500 w-8'
                  : idx < currentIdx
                  ? 'bg-blue-200 dark:bg-blue-800 w-2'
                  : 'bg-gray-200 dark:bg-gray-700 w-2'}
              `}
            />
          </div>
        ))}
      </div>

      {/* Step label + title */}
      <div className="text-center">
        <p className="text-xs font-medium text-blue-500 uppercase tracking-wide mb-0.5">
          Step {currentIdx + 1} of {STEPS.length} — {STEPS[currentIdx].label}
        </p>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{STEP_TITLES[currentStep]}</h1>
      </div>
    </div>
  );
}
