import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCheckout from '../hooks/useCheckout';
import usePlaceOrder from '../hooks/usePlaceOrder';
import CheckoutSteps from '../components/CheckoutSteps';
import CheckoutProgress from '../components/CheckoutProgress';
import StepContent from '../components/StepContent';
import CheckoutNavigation from '../components/CheckoutNavigation';

export default function CheckoutPage() {
  const checkout = useCheckout();
  const { placeOrder, error } = usePlaceOrder({ checkout });
  const navigate = useNavigate();
  const [paymentLoading, setPaymentLoading] = useState(false);

  const steps = ['Address', 'Payment', 'Review'];

  const handleNext = () => {
    if (checkout.currentStep === 1 && !checkout.selectedAddress) return;
    if (checkout.currentStep === 2 && !checkout.paymentMethod) return;
    checkout.nextStep();
  };

  const handleBack = () => checkout.prevStep();

  const handlePlaceOrder = async () => {
    if (!checkout.paymentMethod) return;
    setPaymentLoading(true);

    try {
      const orderRes = await placeOrder({
        paymentMethod: checkout.paymentMethod,
      });
      const order = orderRes.data;
      checkout.setOrderData(order);

      // Save order locally for OrderSuccess page fallback
      localStorage.setItem('lastOrder', JSON.stringify(order));

      // --- Payment logic ---
      if (checkout.paymentMethod === 'stripe') {
        const sessionRes = await fetch(
          '/api/payments/stripe/checkout-session',
          {
            method: 'POST',
            body: JSON.stringify({ orderId: order._id }),
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const { sessionId, publishableKey } = await sessionRes.json();
        const stripe = window.Stripe(publishableKey);
        await stripe.redirectToCheckout({ sessionId });
      } else if (checkout.paymentMethod === 'razorpay') {
        const rpRes = await fetch('/api/payments/razorpay/order', {
          method: 'POST',
          body: JSON.stringify({ orderId: order._id }),
          headers: { 'Content-Type': 'application/json' },
        });
        const { paymentId, key, amount, currency } = await rpRes.json();

        const options = {
          key,
          amount,
          currency,
          order_id: paymentId,
          name: 'Zaynarah Store',
          description: 'Order Payment',
          handler: async (response) => {
            await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              body: JSON.stringify({
                orderId: order._id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
              headers: { 'Content-Type': 'application/json' },
            });
            navigate('/checkout/success', { state: { order } });
          },
          prefill: {
            name: checkout.selectedAddress?.name,
            email: checkout.user?.email,
          },
          modal: { ondismiss: () => alert('Payment Cancelled') },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      alert('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <CheckoutProgress currentStep={checkout.currentStep} steps={steps} />
      <CheckoutSteps currentStep={checkout.currentStep} />
      <StepContent
        currentStep={checkout.currentStep}
        checkout={checkout}
        error={error}
      />
      <CheckoutNavigation
        currentStep={checkout.currentStep}
        totalSteps={steps.length}
        onNext={handleNext}
        onBack={handleBack}
        onPlaceOrder={handlePlaceOrder}
        loading={checkout.loading || paymentLoading}
      />
    </div>
  );
}
