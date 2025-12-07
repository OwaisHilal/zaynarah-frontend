// src/features/checkout/components/CheckoutNavigation.jsx
import { Button } from '@/components/ui/button';

export default function CheckoutNavigation({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onPlaceOrder,
  loading,
}) {
  return (
    <div className="flex justify-between mt-6">
      {currentStep > 1 ? (
        <Button
          variant="outline"
          className="border-gray-300 text-gray-700"
          onClick={onBack}
        >
          Back
        </Button>
      ) : (
        <div />
      )}

      {currentStep < totalSteps ? (
        <Button
          className="bg-rose-600 hover:bg-rose-700 text-white"
          onClick={onNext}
        >
          Next
        </Button>
      ) : (
        <Button
          className="bg-rose-600 hover:bg-rose-700 text-white"
          onClick={onPlaceOrder}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </Button>
      )}
    </div>
  );
}
