import { Button } from '@/components/ui/button';

export default function CheckoutNavigation({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  checkout,
}) {
  // Disable "Next" if on payment step and payment details are missing
  const isNextDisabled =
    checkout.loading ||
    (currentStep === 5 && checkout.paymentMethod && !checkout.paymentDetails);

  const handlePlaceOrder = async () => {
    if (!checkout.paymentMethod || !checkout.paymentDetails) {
      alert('Please select a payment method and fill payment details');
      return;
    }
    try {
      await checkout.placeOrder(); // use checkout hook's placeOrder
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to place order.');
    }
  };

  return (
    <div className="flex justify-between mt-6">
      {/* Back Button */}
      {currentStep > 1 ? (
        <Button
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={onBack}
          disabled={checkout.loading}
        >
          Back
        </Button>
      ) : (
        <div />
      )}

      {/* Next / Place Order Button */}
      {currentStep < totalSteps ? (
        <Button
          className="bg-rose-600 hover:bg-rose-700 text-white"
          onClick={onNext}
          disabled={isNextDisabled}
        >
          {checkout.loading ? 'Processing...' : 'Next'}
        </Button>
      ) : (
        <Button
          className="bg-rose-600 hover:bg-rose-700 text-white"
          onClick={handlePlaceOrder}
          disabled={checkout.loading}
        >
          {checkout.loading ? 'Processing...' : 'Place Order'}
        </Button>
      )}
    </div>
  );
}
