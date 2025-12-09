import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AddressSelector from './AddressSelector';
import PaymentOptions from './PaymentOptions';
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
        {/* STEP 1 — ADDRESS */}
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
                  selectedAddress={checkout.selectedAddress}
                  setSelectedAddress={checkout.setSelectedAddress}
                />

                {error && (
                  <p className="text-sm font-medium text-red-500">{error}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* STEP 2 — PAYMENT */}
        {currentStep === 2 && (
          <motion.div key="step2" {...motionProps}>
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <h2 className="text-xl font-semibold text-rose-600">
                  Payment Method
                </h2>
              </CardHeader>

              <CardContent>
                <PaymentOptions
                  selectedPayment={checkout.paymentMethod}
                  setSelectedPayment={checkout.setPaymentMethod}
                />

                {error && (
                  <p className="text-sm font-medium text-red-500 mt-2">
                    {error}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* STEP 3 — REVIEW */}
        {currentStep === 3 && (
          <motion.div key="step3" {...motionProps}>
            <OrderSummary />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
