import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import AddressSelector from './AddressSelector';
import BillingAddressForm from './BillingAddressForm';
import ShippingMethodForm from './ShippingMethodForm';
import PaymentOptions from './PaymentOptions';
import RazorpayForm from './RazorpayForm';
import OrderSummary from './OrderSummary';
import { useCheckoutStore } from '../store/checkoutStore';

const motionProps = {
  initial: { x: 40, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

export default function StepContent({ currentStep = 1, error }) {
  const {
    shippingAddress,
    shippingMethod,
    shippingMethods,
    shippingLoading,
    shippingError,
    paymentMethod,
    paymentDetails,
    billingAddress,
    setShippingMethod,
    setBillingAddress,
    setPaymentMethod,
    setPaymentDetails,
    loadShippingMethods,
  } = useCheckoutStore();

  useEffect(() => {
    if (!shippingAddress) return;

    loadShippingMethods().then((methods) => {
      if (methods?.length === 1 && !shippingMethod) {
        setShippingMethod(methods[0]);
      }
    });
  }, [shippingAddress]);

  return (
    <div className="mt-6 relative min-h-[320px]">
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div key="s1" {...motionProps}>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-rose-600">
                  Shipping Address
                </h2>
              </CardHeader>
              <CardContent>
                <AddressSelector />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div key="s2" {...motionProps}>
            <ShippingMethodForm
              shippingMethod={shippingMethod}
              setShippingMethod={setShippingMethod}
              shippingMethods={shippingMethods}
              loading={shippingLoading}
            />
            {(error || shippingError) && (
              <p className="text-sm text-red-500 mt-2">
                {error || shippingError}
              </p>
            )}
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div key="s3" {...motionProps}>
            <PaymentOptions
              selectedPayment={paymentMethod}
              setSelectedPayment={(m) => {
                setPaymentMethod(m);
                setPaymentDetails(null);
              }}
            />
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div key="s4" {...motionProps}>
            {paymentMethod === 'razorpay' ? (
              <RazorpayForm
                paymentDetails={paymentDetails}
                setPaymentDetails={setPaymentDetails}
              />
            ) : (
              <p className="text-sm text-gray-700">
                Stripe Checkout will open after placing the order.
              </p>
            )}

            {paymentMethod === 'razorpay' && (
              <BillingAddressForm
                billingAddress={billingAddress}
                setBillingAddress={setBillingAddress}
                shippingAddress={shippingAddress}
              />
            )}
          </motion.div>
        )}

        {currentStep === 5 && (
          <motion.div key="s5" {...motionProps}>
            <OrderSummary />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
