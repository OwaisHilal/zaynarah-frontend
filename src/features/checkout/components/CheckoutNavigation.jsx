import { Button } from '@/components/ui/button';

export default function CheckoutNavigation({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  checkout,
}) {
  const {
    loading,
    paymentMethod,
    paymentDetails,
    validatePaymentDetails,
    placeOrder,
  } = checkout;

  // ----------------------------------------------------
  // CONTROL: Disable "Next" on payment step if required fields missing
  // ----------------------------------------------------
  const isPaymentStep = currentStep === totalSteps - 0; // last step = payment review

  const isNextDisabled =
    loading || (isPaymentStep && paymentMethod && !paymentDetails); // minimal check; full validation is in SDK

  // ----------------------------------------------------
  // FINAL PLACE ORDER ACTION
  // ----------------------------------------------------
  const handlePlaceOrder = async () => {
    try {
      // SDK-level validation → throws clean errors
      validatePaymentDetails();
      await placeOrder();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Unable to place order.');
    }
  };

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------
  return (
    <div className="flex justify-between mt-6 gap-4">
      {/* Back Button */}
      {currentStep > 1 ? (
        <Button
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={onBack}
          disabled={loading}
        >
          Back
        </Button>
      ) : (
        <div />
      )}

      {/* Next or Place Order */}
      {currentStep < totalSteps ? (
        <Button
          className="bg-rose-600 hover:bg-rose-700 text-white"
          onClick={onNext}
          disabled={isNextDisabled}
        >
          {loading ? 'Processing...' : 'Next'}
        </Button>
      ) : (
        <Button
          className="bg-rose-600 hover:bg-rose-700 text-white"
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </Button>
      )}
    </div>
  );
}
