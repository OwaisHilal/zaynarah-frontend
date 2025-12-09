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
  const { cart = [], cartTotal = 0 } = useCart() || {};

  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = ['Address', 'Payment', 'Review'];

  // --------------------------------
  // Load logged-in user into checkout
  // --------------------------------
  useEffect(() => {
    if (user) checkout.setUser(user);
  }, [user]);

  // ---------------------------
  // STEP VALIDATION
  // ---------------------------
  const handleNext = () => {
    if (checkout.currentStep === 1 && !checkout.selectedAddress) {
      return setError('Please select a delivery address');
    }

    if (checkout.currentStep === 2 && !checkout.paymentMethod) {
      return setError('Please select a payment method');
    }

    setError('');
    checkout.nextStep();
  };

  const handleBack = () => {
    setError('');
    checkout.prevStep();
  };

  // ---------------------------
  // PLACE ORDER + PAYMENTS
  // ---------------------------
  const handlePlaceOrder = async () => {
    if (!checkout.paymentMethod) return;

    if (!cart.length) {
      return setError('Your cart is empty');
    }

    setPaymentLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const orderPayload = {
        items: cart,
        address: checkout.selectedAddress,
        totalAmount: cartTotal,
        paymentMethod: checkout.paymentMethod,
        user: user?._id,
      };

      const order = await createOrder(orderPayload, token);

      if (!order?._id) throw new Error('Order creation failed');

      checkout.setOrderData(order);

      // PAYMENT FLOWS
      if (checkout.paymentMethod === 'stripe') {
        await handleStripePayment(order);
      }

      if (checkout.paymentMethod === 'razorpay') {
        await handleRazorpayPayment(order);
      }
    } catch (err) {
      console.error(err);
      setError('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // ---------------------------
  // STRIPE PAYMENT
  // ---------------------------
  const handleStripePayment = async (order) => {
    const session = await createStripeSession(order._id);

    if (!session?.sessionId || !session?.publishableKey) {
      throw new Error('Stripe session creation error');
    }

    const stripe = window.Stripe(session.publishableKey);
    return stripe.redirectToCheckout({ sessionId: session.sessionId });
  };

  // ---------------------------
  // RAZORPAY PAYMENT
  // ---------------------------
  const handleRazorpayPayment = async (order) => {
    const razorData = await createRazorpayOrder(order._id);

    if (!razorData?.orderId) {
      throw new Error('Razorpay order not created');
    }

    const { orderId, key, amount, currency } = razorData;

    const rzp = new window.Razorpay({
      key,
      amount,
      currency,
      order_id: orderId,
      name: 'Zaynarah',
      description: 'Order Payment',

      handler: async (response) => {
        try {
          await verifyRazorpayPayment({
            orderId: order._id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });

          navigate('/checkout/success', { state: { order } });
        } catch (err) {
          console.error(err);
          setError('Payment verification failed.');
        }
      },

      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },

      theme: { color: '#f43f5e' },
      method: { upi: true, card: true, netbanking: true, wallet: true },
    });

    rzp.open();
  };

  // ---------------------------
  // RENDER
  // ---------------------------
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
