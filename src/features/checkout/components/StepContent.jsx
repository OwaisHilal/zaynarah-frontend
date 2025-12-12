// src/features/checkout/components/StepContent.jsx
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import AddressSelector from './AddressSelector';
import BillingAddressForm from './BillingAddressForm';
import ShippingMethodForm from './ShippingMethodForm';
import PaymentOptions from './PaymentOptions';
import RazorpayForm from './RazorpayForm';
import OrderSummary from './OrderSummary';
import { getShippingMethods } from '../services/useCheckoutApi';

const motionProps = {
  initial: { x: 40, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

export default function StepContent({ currentStep = 1, checkout, error }) {
  const [shippingMethods, setShippingMethods] = useState([]);
  const [shippingError, setShippingError] = useState('');
  const [loadingShipping, setLoadingShipping] = useState(false);

  // Load shipping methods when address is selected
  useEffect(() => {
    if (!checkout.shippingAddress) {
      setShippingMethods([]);
      return;
    }

    let mounted = true;

    const load = async () => {
      setLoadingShipping(true);
      setShippingError('');

      try {
        const methods = await getShippingMethods(checkout.shippingAddress);
        if (mounted) setShippingMethods(methods || []);
      } catch (err) {
        if (mounted)
          setShippingError(err.message || 'Could not load shipping options.');
      } finally {
        if (mounted) setLoadingShipping(false);
      }
    };

    load();
    return () => (mounted = false);
  }, [checkout.shippingAddress]);

  return (
    <div className="mt-6 relative min-h-[320px]">
      <AnimatePresence mode="wait">
        {/* STEP 1 — SHIPPING ADDRESS */}
        {currentStep === 1 && (
          <motion.div key="s1" {...motionProps}>
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <h2 className="text-xl font-semibold text-rose-600">
                  Shipping Address
                </h2>
              </CardHeader>

              <CardContent>
                <AddressSelector
                  selectedAddress={checkout.shippingAddress}
                  setSelectedAddress={checkout.setShippingAddress}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* STEP 2 — SHIPPING METHOD */}
        {currentStep === 2 && (
          <motion.div key="s2" {...motionProps}>
            <ShippingMethodForm
              shippingMethod={checkout.shippingMethod}
              setShippingMethod={checkout.setShippingMethod}
              shippingMethods={shippingMethods}
              loading={loadingShipping}
            />

            {(error || shippingError) && (
              <p className="text-sm text-red-500 mt-2">
                {error || shippingError}
              </p>
            )}
          </motion.div>
        )}

        {/* STEP 3 — PAYMENT METHOD */}
        {currentStep === 3 && (
          <motion.div key="s3" {...motionProps}>
            <PaymentOptions
              selectedPayment={checkout.paymentMethod}
              setSelectedPayment={(method) => {
                checkout.setPaymentMethod(method);
                checkout.setPaymentDetails(null);
              }}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </motion.div>
        )}

        {/* STEP 4 — PAYMENT DETAILS */}
        {currentStep === 4 && (
          <motion.div key="s4" {...motionProps}>
            {checkout.paymentMethod === 'razorpay' ? (
              <RazorpayForm
                paymentDetails={checkout.paymentDetails}
                setPaymentDetails={checkout.setPaymentDetails}
              />
            ) : (
              <p className="text-sm text-gray-700">
                Stripe Checkout will securely collect your payment details after
                submitting the order.
              </p>
            )}

            {/* Billing address requirement (only Razorpay needs inline billing) */}
            {checkout.paymentMethod === 'razorpay' && (
              <div className="mt-4">
                <BillingAddressForm
                  billingAddress={checkout.billingAddress}
                  setBillingAddress={checkout.setBillingAddress}
                  shippingAddress={checkout.shippingAddress}
                />
              </div>
            )}

            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </motion.div>
        )}

        {/* STEP 5 — REVIEW */}
        {currentStep === 5 && (
          <motion.div key="s5" {...motionProps}>
            <OrderSummary checkout={checkout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
