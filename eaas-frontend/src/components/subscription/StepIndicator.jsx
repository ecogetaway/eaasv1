import { Check } from 'lucide-react';
import { cn } from '../../utils/cn.js';

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold',
                  isCompleted && 'bg-green-500 text-white',
                  isCurrent && 'bg-primary-600 text-white',
                  !isCompleted && !isCurrent && 'bg-gray-200 text-gray-600'
                )}
              >
                {isCompleted ? <Check className="w-6 h-6" /> : step}
              </div>
              <span className="mt-2 text-sm text-gray-600">Step {step}</span>
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  'w-24 h-1 mx-4',
                  isCompleted ? 'bg-green-500' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;

