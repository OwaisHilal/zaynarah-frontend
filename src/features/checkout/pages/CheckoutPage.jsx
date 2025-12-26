// src/features/checkout/pages/CheckoutPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCart } from '../../cart/context/useCart';
import { useUserStore } from '../../user/hooks/useUser';
import { useCheckoutStore } from '../store/checkoutStore';

import CheckoutNavigation from '../components/CheckoutNavigation';
import CheckoutProgress from '../components/CheckoutProgress';
import StepContent from '../components/StepContent';

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
    if (!user) {
      navigate('/login?from=/checkout', { replace: true });
      return;
    }

    if (!user.emailVerified) {
      navigate('/verify-email', { replace: true });
      return;
    }

    checkout.setUser(user);
  }, [user, checkout, navigate]);

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
    if (!user?.emailVerified) {
      setError('Please verify your email before placing an order.');
      return;
    }

    try {
      setError('');
      const order = await checkout.placeOrderAndPay({ cart, cartTotal });
      navigate('/checkout/success', { state: { order } });
    } catch (err) {
      if (err?.message?.includes('verify')) {
        navigate('/verify-email');
        return;
      }
      setError(err.message || 'Order failed.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <CheckoutProgress currentStep={checkout.currentStep} steps={steps} />

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
