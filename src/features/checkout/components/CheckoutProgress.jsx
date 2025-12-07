// src/features/checkout/components/CheckoutProgress.jsx
export default function CheckoutProgress({ currentStep, steps }) {
  const stepProgress = (currentStep / steps.length) * 100;

  return (
    <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
      <div
        className="h-2 rounded-full transition-all duration-300"
        style={{ width: `${stepProgress}%`, background: '#D4AF37' }}
      />
    </div>
  );
}
