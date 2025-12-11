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
  const checkout = useCheckout();
  const { cart = [], cartTotal = 0 } = useCart() || {};
  const user = useUserStore((s) => s.user);
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const steps = [
    'Cart Review',
    'Shipping Address',
    'Billing Address',
    'Shipping Method',
    'Payment',
    'Review',
  ];

  // Load user into checkout state
  useEffect(() => {
    if (user) checkout.setUser(user);
  }, [user]);

  // ---------------------------
  // STEP VALIDATION
  // ---------------------------
  const handleNext = () => {
    let stepError = null;

    switch (checkout.currentStep) {
      case 1:
        if (!cart.length) stepError = 'Your cart is empty';
        break;
      case 2:
        if (!checkout.shippingAddress)
          stepError = 'Please select a shipping address';
        break;
      case 3:
        if (!checkout.billingAddress)
          stepError = 'Please select a billing address';
        break;
      case 4:
        if (!checkout.shippingMethod)
          stepError = 'Please select a shipping method';
        break;
      case 5:
        if (!checkout.paymentMethod)
          stepError = 'Please select a payment method';
        else if (!checkout.paymentDetails)
          stepError = 'Please fill in your payment details';
        break;
    }

    if (stepError) {
      setError(stepError);
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
  // PLACE ORDER + PAYMENT
  // ---------------------------
  const handlePlaceOrder = async () => {
    try {
      await checkout.placeOrder(cart, cartTotal);
      navigate('/checkout/success', { state: { order: checkout.orderData } });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Payment failed. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <CheckoutProgress currentStep={checkout.currentStep} steps={steps} />
      <CheckoutSteps currentStep={checkout.currentStep} steps={steps} />
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
        loading={checkout.loading}
        disableNext={
          checkout.currentStep === 5 &&
          (!checkout.paymentMethod || !checkout.paymentDetails)
        }
        checkout={checkout}
      />
    </div>
  );
}
