// src/features/checkout/pages/CheckoutPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useCheckout from '../hooks/useCheckout';
import { useCart } from '../../cart/context/CartContext';
import { useUserStore } from '../../user/hooks/useUser';

import CheckoutSteps from '../components/CheckoutSteps';
import CheckoutProgress from '../components/CheckoutProgress';
import StepContent from '../components/StepContent';
import CheckoutNavigation from '../components/CheckoutNavigation';

export default function CheckoutPage() {
  const navigate = useNavigate();

  const checkout = useCheckout();
  const { cart = [], cartTotal = 0 } = useCart() || {};
  const user = useUserStore((state) => state.user);

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
    if (msg) {
      setError(msg);
      return;
    }
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
      const order = await checkout.placeOrder({ cart, cartTotal });
      navigate('/checkout/success', { state: { order } });
    } catch (err) {
      setError(err.message || 'Order could not be completed.');
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
        checkout={checkout}
      />
    </div>
  );
}
