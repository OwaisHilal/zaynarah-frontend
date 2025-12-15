import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCheckoutStore } from '../store/checkoutStore';
import { useCart } from '../../cart/context/useCart';
import { useUserStore } from '../../user/hooks/useUser';

import CheckoutSteps from '../components/CheckoutSteps';
import CheckoutProgress from '../components/CheckoutProgress';
import StepContent from '../components/StepContent';
import CheckoutNavigation from '../components/CheckoutNavigation';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const checkout = useCheckoutStore();
  const { cart = [], cartTotal = {} } = useCart() || {};
  const user = useUserStore((s) => s.user);

  const [error, setError] = useState('');

  const steps = [
    'Shipping Address',
    'Shipping Method',
    'Payment Method',
    'Payment Details',
    'Review Order',
  ];

  useEffect(() => {
    if (user) checkout.setUser(user);
  }, [user]);

  const handleNext = () => {
    const msg = checkout.validateStep(checkout.currentStep);
    if (msg) return setError(msg);
    setError('');
    checkout.nextStep();
  };

  const handleBack = () => {
    setError('');
    checkout.prevStep();
  };

  const handlePlaceOrder = async () => {
    try {
      setError('');
      const order = await checkout.placeOrderAndPay({ cart, cartTotal });
      navigate('/checkout/success', { state: { order } });
    } catch (err) {
      setError(err.message || 'Order failed.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <CheckoutProgress currentStep={checkout.currentStep} steps={steps} />
      <CheckoutSteps currentStep={checkout.currentStep} />

      <StepContent currentStep={checkout.currentStep} error={error} />

      <CheckoutNavigation
        currentStep={checkout.currentStep}
        totalSteps={steps.length}
        onNext={handleNext}
        onBack={handleBack}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
}
