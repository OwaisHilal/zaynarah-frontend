import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import AddressSelector from './AddressSelector';
import BillingAddressForm from './BillingAddressForm';
import ShippingMethodForm from './ShippingMethodForm';
import PaymentOptions from './PaymentOptions';
import StripeCardForm from './StripeCardForm';
import RazorpayForm from './RazorpayForm';
import OrderSummary from './OrderSummary';

const motionProps = {
  initial: { x: 40, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
  transition: { duration: 0.25, ease: 'easeOut' },
};

export default function StepContent({ currentStep = 1, checkout, error }) {
  return (
    <div className="mt-6 relative min-h-[300px]">
      <AnimatePresence mode="wait">
        {/* STEP 1 — DELIVERY ADDRESS */}
        {currentStep === 1 && (
          <motion.div key="step1" {...motionProps}>
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <h2 className="text-xl font-semibold text-rose-600">
                  Delivery Address
                </h2>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <AddressSelector
                  selectedAddress={checkout.shippingAddress}
                  setSelectedAddress={checkout.setShippingAddress}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* STEP 2 — BILLING ADDRESS */}
        {currentStep === 2 && (
          <motion.div key="step2" {...motionProps}>
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <h2 className="text-xl font-semibold text-rose-600">
                  Billing Address
                </h2>
              </CardHeader>
              <CardContent>
                <BillingAddressForm
                  billingAddress={checkout.billingAddress}
                  setBillingAddress={checkout.setBillingAddress}
                  shippingAddress={checkout.shippingAddress}
                />
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* STEP 3 — SHIPPING METHOD */}
        {currentStep === 3 && (
          <motion.div key="step3" {...motionProps}>
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <h2 className="text-xl font-semibold text-rose-600">
                  Shipping Method
                </h2>
              </CardHeader>
              <CardContent>
                <ShippingMethodForm
                  shippingMethod={checkout.shippingMethod}
                  setShippingMethod={checkout.setShippingMethod}
                />
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* STEP 4 — PAYMENT GATEWAY */}
        {currentStep === 4 && (
          <motion.div key="step4" {...motionProps}>
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <h2 className="text-xl font-semibold text-rose-600">
                  Payment Method
                </h2>
              </CardHeader>
              <CardContent>
                <PaymentOptions
                  selectedPayment={checkout.paymentMethod}
                  setSelectedPayment={(method) => {
                    checkout.setPaymentMethod(method);
                    checkout.setPaymentDetails(null);
                  }}
                />
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* STEP 5 — PAYMENT DETAILS */}
        {currentStep === 5 && checkout.paymentMethod && (
          <motion.div key="step5" {...motionProps}>
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <h2 className="text-xl font-semibold text-rose-600">
                  Payment Details
                </h2>
              </CardHeader>
              <CardContent>
                {checkout.paymentMethod === 'stripe' && (
                  <StripeCardForm
                    paymentDetails={checkout.paymentDetails}
                    setPaymentDetails={checkout.setPaymentDetails}
                  />
                )}
                {checkout.paymentMethod === 'razorpay' && (
                  <RazorpayForm
                    paymentDetails={checkout.paymentDetails}
                    setPaymentDetails={checkout.setPaymentDetails}
                  />
                )}
                {!checkout.paymentDetails && (
                  <p className="text-sm text-gray-500 mt-2">
                    Enter your payment details above to continue.
                  </p>
                )}
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* STEP 6 — ORDER REVIEW */}
        {currentStep === 6 && (
          <motion.div key="step6" {...motionProps}>
            <OrderSummary checkout={checkout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
