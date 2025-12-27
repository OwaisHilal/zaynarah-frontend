//src/features/checkout/components/CheckoutNavigation.jsx

import { Button } from '@/components/ui/button';
import { useCheckoutStore } from '../store/checkoutStore';

export default function CheckoutNavigation({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onPlaceOrder,
}) {
  const loading = useCheckoutStore((s) => s.loading);
  const isNextDisabled = useCheckoutStore((s) => s.isNextDisabled);

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
          disabled={loading || isNextDisabled}
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
