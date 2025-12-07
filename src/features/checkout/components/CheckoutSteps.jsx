// src/features/checkout/components/CheckoutSteps.jsx
import { cn } from '@/lib/utils';

export default function CheckoutSteps({ currentStep = 1 }) {
  const steps = ['Address', 'Payment', 'Review'];

  return (
    <div className="flex justify-between mb-6 relative">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div
            key={step}
            className="flex-1 flex flex-col items-center relative"
          >
            <div
              className={cn(
                'w-10 h-10 flex items-center justify-center rounded-full border-2 font-semibold text-lg transition-all',
                isActive
                  ? 'bg-rose-600 border-rose-600 text-white'
                  : isCompleted
                  ? 'bg-rose-100 border-rose-600 text-rose-600'
                  : 'border-gray-300 text-gray-400'
              )}
            >
              {stepNumber}
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700">
              {step}
            </span>

            {index !== steps.length - 1 && (
              <div className="absolute top-5 left-full w-full h-0.5 bg-gray-300"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
