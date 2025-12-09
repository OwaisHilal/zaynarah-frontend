export default function CheckoutProgress({ currentStep = 1, steps = [] }) {
  const totalSteps = steps.length || 1;
  const clampedStep = Math.min(Math.max(currentStep, 1), totalSteps);

  const stepProgress = (clampedStep / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-200 h-2 rounded-full mb-6 overflow-hidden">
      <div
        className="h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{
          width: `${stepProgress}%`,
          backgroundColor: '#f43f5e', // rose-600 (brand color)
        }}
      />
    </div>
  );
}
