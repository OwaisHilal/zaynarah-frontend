// src/features/checkout/components/CheckoutNavigation.jsx
import { Button } from '@/components/ui/button';
import { useCheckoutUIStore } from '@/stores/checkout';

export default function CheckoutNavigation({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onPlaceOrder,
}) {
  const loading = useCheckoutUIStore((s) => s.loading);

  return (
    <div className="mt-6 flex justify-between gap-4">
      {currentStep > 1 ? (
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      ) : (
        <div />
      )}

      {currentStep < totalSteps ? (
        <Button
          className="bg-rose-600 hover:bg-rose-700 text-white"
          disabled={loading}
          onClick={onNext}
        >
          {loading ? 'Processing…' : 'Next'}
        </Button>
      ) : (
        <Button
          className="bg-rose-600 hover:bg-rose-700 text-white"
          disabled={loading}
          onClick={onPlaceOrder}
        >
          {loading ? 'Processing…' : 'Place Order'}
        </Button>
      )}
    </div>
  );
}
