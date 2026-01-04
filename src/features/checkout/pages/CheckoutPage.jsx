// src/features/checkout/pages/CheckoutPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUserStore } from '../../user/hooks/useUser';
import { useCheckoutStore } from '../store/checkoutStore';

import CheckoutNavigation from '../components/CheckoutNavigation';
import CheckoutProgress from '../components/CheckoutProgress';
import StepContent from '../components/StepContent';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const checkout = useCheckoutStore();

  const { user, needsEmailVerification } = useUserStore();
  const [error, setError] = useState('');

  const steps = [
    'Shipping Address',
    'Shipping Method',
    'Payment Method',
    'Payment Details',
    'Review Order',
  ];

  useEffect(() => {
    if (user && checkout.user?._id !== user._id) {
      checkout.setUser(user);
    }
  }, [user, checkout]);

  const handleNext = async () => {
    const msg = checkout.validateStep(checkout.currentStep);
    if (msg) {
      setError(msg);
      return;
    }

    setError('');
    const res = await checkout.nextStep();
    if (res?.error) setError(res.error);
  };

  const handleBack = () => {
    setError('');
    checkout.prevStep();
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login?from=/checkout', { replace: true });
      return;
    }

    if (needsEmailVerification) {
      navigate('/verify-email?from=/checkout', { replace: true });
      return;
    }

    try {
      setError('');
      await checkout.startPaymentFlow();
      navigate('/checkout/success');
    } catch (err) {
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
