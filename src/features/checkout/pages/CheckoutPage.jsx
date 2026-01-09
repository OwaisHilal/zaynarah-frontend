// src/features/checkout/pages/CheckoutPage.jsx
import { useNavigate } from 'react-router-dom';

import { useUserDomainStore } from '@/stores/user';
import { useCheckoutDomainStore, useCheckoutUIStore } from '@/stores/checkout';

import CheckoutNavigation from '../components/CheckoutNavigation';
import CheckoutProgress from '../components/CheckoutProgress';
import StepContent from '../components/StepContent';

export default function CheckoutPage() {
  const navigate = useNavigate();

  const { isAuthenticated, needsEmailVerification } = useUserDomainStore();

  const { ensureSession, finalizePricing, startPayment } =
    useCheckoutDomainStore();

  const {
    currentStep,
    totalSteps,
    loading,
    error,
    next,
    back,
    setLoading,
    setError,
  } = useCheckoutUIStore();

  const steps = [
    'Shipping Address',
    'Shipping Method',
    'Payment Method',
    'Payment Details',
    'Review Order',
  ];

  const handleNext = async () => {
    try {
      setLoading(true);

      if (currentStep === 1) {
        await ensureSession();
      }

      if (currentStep === 2) {
        const { shippingMethod } = useCheckoutDomainStore.getState();

        if (!shippingMethod) {
          throw new Error('Please select a shipping method');
        }

        await finalizePricing();
      }

      next();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    back();
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login?from=/checkout', { replace: true });
      return;
    }

    if (needsEmailVerification) {
      navigate('/verify-email?from=/checkout', { replace: true });
      return;
    }

    try {
      setLoading(true);
      await startPayment();
      navigate('/checkout/success');
    } catch (e) {
      setError(e.message || 'Order failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <CheckoutProgress currentStep={currentStep} steps={steps} />

      <StepContent currentStep={currentStep} error={error} />

      <CheckoutNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={handleNext}
        onBack={handleBack}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
}
