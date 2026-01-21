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
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onBack();
          }}
        >
          Back
        </Button>
      ) : (
        <div />
      )}

      {currentStep < totalSteps ? (
        <Button
          type="button"
          className="bg-rose-600 hover:bg-rose-700 text-white"
          disabled={loading}
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        >
          {loading ? 'Processing…' : 'Next'}
        </Button>
      ) : (
        <Button
          type="button"
          className="bg-rose-600 hover:bg-rose-700 text-white"
          disabled={loading}
          onClick={(e) => {
            e.stopPropagation();
            onPlaceOrder();
          }}
        >
          {loading ? 'Processing…' : 'Place Order'}
        </Button>
      )}
    </div>
  );
}
