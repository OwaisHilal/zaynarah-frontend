// src/features/checkout/pages/CheckoutPage.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CheckoutSteps from '../components/CheckoutSteps';
import AddressSelector from '../components/AddressSelector';
import PaymentOptions from '../components/PaymentOptions';
import OrderSummary from '../components/OrderSummary';
import useCheckout from '../hooks/useCheckout';
import usePlaceOrder from '../hooks/usePlaceOrder';

export default function CheckoutPage() {
  const checkout = useCheckout();
  const { placeOrder, error } = usePlaceOrder({ checkout });

  const steps = ['Address', 'Payment', 'Review'];
  const stepProgress = (checkout.currentStep / steps.length) * 100;

  // --- Navigation ---
  const handleNext = () => {
    if (checkout.currentStep === 1 && !checkout.selectedAddress) return;
    checkout.nextStep();
  };

  const handleBack = () => checkout.prevStep();

  // --- Motion for step transitions ---
  const motionProps = {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
    transition: { duration: 0.3 },
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{ width: `${stepProgress}%`, background: '#D4AF37' }}
        />
      </div>

      {/* Step Indicator */}
      <CheckoutSteps currentStep={checkout.currentStep} />

      {/* Step Content */}
      <div className="mt-6 relative min-h-[300px]">
        <AnimatePresence mode="wait">
          {checkout.currentStep === 1 && (
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
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {checkout.currentStep === 2 && (
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
                </CardContent>
              </Card>
            </motion.div>
          )}

          {checkout.currentStep === 3 && (
            <motion.div key="step3" {...motionProps}>
              <OrderSummary />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {checkout.currentStep > 1 ? (
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700"
            onClick={handleBack}
          >
            Back
          </Button>
        ) : (
          <div />
        )}

        {checkout.currentStep < 3 ? (
          <Button
            className="bg-rose-600 hover:bg-rose-700 text-white"
            onClick={handleNext}
          >
            Next
          </Button>
        ) : (
          <Button
            className="bg-rose-600 hover:bg-rose-700 text-white"
            onClick={placeOrder}
            disabled={checkout.loading}
          >
            {checkout.loading ? 'Processing...' : 'Place Order'}
          </Button>
        )}
      </div>
    </div>
  );
}
