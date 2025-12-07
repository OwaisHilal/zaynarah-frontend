// src/features/checkout/pages/CheckoutPage.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import AddressSelector from '../components/AddressSelector';
import PaymentOptions from '../components/PaymentOptions';
import OrderSummary from '../components/OrderSummary';
import useCheckout from '../hooks/useCheckout';
import usePlaceOrder from '../hooks/usePlaceOrder';
import { jsPDF } from 'jspdf';

export default function CheckoutPage() {
  const checkout = useCheckout();
  const { placeOrder, error } = usePlaceOrder({ checkout });
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const steps = ['Address', 'Payment', 'Review'];
  const stepProgress = (checkout.currentStep / steps.length) * 100;

  const handleNext = () => {
    if (checkout.currentStep === 1 && !checkout.selectedAddress) return;
    checkout.nextStep();
  };

  const handleBack = () => checkout.prevStep();

  // --- Handle order with success state ---
  const handlePlaceOrder = async () => {
    await placeOrder();
    if (checkout.orderData) setSuccess(true);
  };

  // --- Invoice Download ---
  const downloadInvoice = () => {
    if (!checkout.orderData) return;
    const order = checkout.orderData;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Invoice', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 20, 40);
    doc.text(`Total Amount: ₹${order.totalAmount}`, 20, 50);
    doc.text(
      `Delivery Address: ${order.address?.street}, ${order.address?.city}, ${order.address?.state} - ${order.address?.zip}`,
      20,
      60
    );

    doc.text('Items:', 20, 80);
    order.items.forEach((item, idx) => {
      doc.text(
        `${idx + 1}. ${item.name} - Qty: ${item.qty} - Price: ₹${item.price}`,
        25,
        90 + idx * 10
      );
    });

    doc.save(`Invoice_${order._id}.pdf`);
  };

  // --- Motion for step transitions ---
  const motionProps = {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
    transition: { duration: 0.3 },
  };

  // --- Render success screen if order completed ---
  if (success && checkout.orderData) {
    const order = checkout.orderData;

    return (
      <Card className="shadow-lg border border-green-500 mt-4 max-w-3xl mx-auto">
        <CardHeader>
          <h2 className="text-2xl font-bold text-green-600">
            Order Placed Successfully!
          </h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-gray-700">
            Thank you for your purchase. Your order ID is{' '}
            <strong>{order._id}</strong>.
          </p>

          {/* Ordered Items Table */}
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Item</th>
                  <th className="px-4 py-2 border">Quantity</th>
                  <th className="px-4 py-2 border">Price</th>
                  <th className="px-4 py-2 border">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item._id || item.name}>
                    <td className="px-4 py-2 border">{item.name}</td>
                    <td className="px-4 py-2 border text-center">{item.qty}</td>
                    <td className="px-4 py-2 border text-right">
                      ₹{item.price}
                    </td>
                    <td className="px-4 py-2 border text-right">
                      ₹{item.qty * item.price}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold bg-gray-50">
                  <td colSpan={3} className="px-4 py-2 text-right border">
                    Total
                  </td>
                  <td className="px-4 py-2 text-right border">
                    ₹{order.totalAmount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <Button
              onClick={downloadInvoice}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              Download Invoice
            </Button>
            <Button
              onClick={() => navigate('/')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Go to Home
            </Button>
            <Button
              onClick={() => navigate('/shop')}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // --- Default checkout flow ---
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
            onClick={handlePlaceOrder}
            disabled={checkout.loading}
          >
            {checkout.loading ? 'Processing...' : 'Place Order'}
          </Button>
        )}
      </div>
    </div>
  );
}
