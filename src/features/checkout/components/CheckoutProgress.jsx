// src/features/checkout/components/CheckoutProgress.jsx
import { cn } from '@/lib/utils';

export default function CheckoutProgress({ currentStep = 1, steps = [] }) {
  const totalSteps = steps.length || 1;
  const clampedStep = Math.min(Math.max(currentStep, 1), totalSteps);
  const stepProgress = (clampedStep / totalSteps) * 100;

  return (
    <div className="relative w-full mb-6">
      {/* Progress bar background */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{
            width: `${stepProgress}%`,
            backgroundColor: '#f43f5e', // rose-600
          }}
        />
      </div>

      {/* Step markers */}
      <div className="absolute top-0 left-0 w-full flex justify-between mt-[-0.25rem]">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === clampedStep;
          const isCompleted = stepNumber < clampedStep;

          return (
            <div
              key={step}
              className={cn(
                'w-4 h-4 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all',
                isActive
                  ? 'bg-rose-600 border-rose-600 text-white'
                  : isCompleted
                  ? 'bg-rose-100 border-rose-600 text-rose-600'
                  : 'bg-white border-gray-300 text-gray-400'
              )}
              title={step} // Tooltip for step name
            >
              {stepNumber}
            </div>
          );
        })}
      </div>
    </div>
  );
}
