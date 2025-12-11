// src/features/checkout/pages/CheckoutPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useCheckout from '../hooks/useCheckout';
import { useCart } from '../hooks/CartContext';
import { useUserStore } from '../../user/hooks/useUser';

import CheckoutSteps from '../components/CheckoutSteps';
import CheckoutProgress from '../components/CheckoutProgress';
import StepContent from '../components/StepContent';
import CheckoutNavigation from '../components/CheckoutNavigation';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const checkout = useCheckout(); // internal hooks: user, addresses, payment, step

  const { cart = [], cartTotal = 0 } = useCart() || {};
  const user = useUserStore((state) => state.user);

  const [error, setError] = useState('');

  const steps = [
    'Cart Review',
    'Shipping Address',
    'Billing Address',
    'Shipping Method',
    'Payment',
    'Review',
  ];

  // ---------------------------
  // LOAD USER INTO CHECKOUT
  // ---------------------------
  useEffect(() => {
    if (user) checkout.setUser(user);
  }, [user]);

  // ---------------------------
  // STEP NAVIGATION
  // ---------------------------
  const handleNext = () => {
    const validationError = checkout.validateStep(cart);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    checkout.nextStep();
  };

  const handleBack = () => {
    setError('');
    checkout.prevStep();
  };

  // ---------------------------
  // PLACE ORDER
  // ---------------------------
  const handlePlaceOrder = async () => {
    try {
      setError('');
      const order = await checkout.placeOrder({ cart, cartTotal });

      navigate('/checkout/success', { state: { order } });
    } catch (err) {
      console.error('CheckoutPage.placeOrder:', err);
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
