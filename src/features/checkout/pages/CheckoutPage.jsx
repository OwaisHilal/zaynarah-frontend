// src/features/checkout/pages/CheckoutPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCheckout from '../hooks/useCheckout';
import { useCart } from '../hooks/CartContext';
import { useUserStore } from '../../user/hooks/useUser';

import { createOrder } from '../services/ordersApi';
import {
  createStripeSession,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '../services/paymentsApi';

import CheckoutSteps from '../components/CheckoutSteps';
import CheckoutProgress from '../components/CheckoutProgress';
import StepContent from '../components/StepContent';
import CheckoutNavigation from '../components/CheckoutNavigation';

export default function CheckoutPage() {
  const checkout = useCheckout();
  const cart = useCart();
  const navigate = useNavigate();

  const user = useUserStore((s) => s.user);

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = ['Address', 'Payment', 'Review'];

  // Auto-load user data into checkout
  useEffect(() => {
    if (user) checkout.setUser(user);
  }, [user]);

  // Step validation
  const handleNext = () => {
    if (checkout.currentStep === 1 && !checkout.selectedAddress) {
      setError('Please select a delivery address');
      return;
    }
    if (checkout.currentStep === 2 && !checkout.paymentMethod) {
      setError('Please select a payment method');
      return;
    }
    setError('');
    checkout.nextStep();
  };

  const handleBack = () => checkout.prevStep();

  // Place order + payment
  const handlePlaceOrder = async () => {
    if (!checkout.paymentMethod) return;

    setPaymentLoading(true);
    try {
      const token = localStorage.getItem('token');

      const orderPayload = {
        items: cart.cart,
        address: checkout.selectedAddress,
        totalAmount: cart.cartTotal,
        paymentMethod: checkout.paymentMethod,
        user: user?._id,
      };

      const order = await createOrder(orderPayload, token);
      checkout.setOrderData(order);

      if (checkout.paymentMethod === 'stripe') {
        await handleStripePayment(order);
      } else if (checkout.paymentMethod === 'razorpay') {
        await handleRazorpayPayment(order);
      }
    } catch (err) {
      console.error(err);
      setError('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Stripe handler
  const handleStripePayment = async (order) => {
    const { sessionId, publishableKey } = await createStripeSession(order._id);
    const stripe = window.Stripe(publishableKey);
    await stripe.redirectToCheckout({ sessionId });
  };

  // Razorpay handler
  const handleRazorpayPayment = async (order) => {
    const { orderId, key, amount, currency } = await createRazorpayOrder(
      order._id
    );

    const options = {
      key,
      amount,
      currency,
      order_id: orderId,
      name: 'Zaynarah',
      description: 'Order Payment',
      handler: async (response) => {
        await verifyRazorpayPayment({
          orderId: order._id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });
        navigate('/checkout/success', { state: { order } });
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },
      theme: { color: '#f43f5e' },
      method: { upi: true, card: true, netbanking: true, wallet: true },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
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
