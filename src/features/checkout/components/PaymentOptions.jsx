// src/features/checkout/components/PaymentOptions.jsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const paymentMethods = [
  {
    id: 'stripe',
    label: 'Stripe (Global)',
    description: 'Pay globally with Stripe',
  },
  {
    id: 'razorpay',
    label: 'Razorpay (India)',
    description: 'Pay securely with Razorpay',
  },
];

export default function PaymentOptions({
  selectedPayment,
  setSelectedPayment,
}) {
  return (
    <RadioGroup
      value={selectedPayment}
      onValueChange={setSelectedPayment}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => {
          const isSelected = selectedPayment === method.id;
          return (
            <motion.label
              key={method.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'cursor-pointer border rounded-lg p-4 flex flex-col transition-all',
                isSelected
                  ? 'border-rose-600 bg-rose-50 shadow-md'
                  : 'border-gray-300 hover:shadow-sm'
              )}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value={method.id} className="sr-only" />
                <div
                  className={cn(
                    'w-5 h-5 flex items-center justify-center rounded-full border',
                    isSelected
                      ? 'border-rose-600 bg-rose-600'
                      : 'border-gray-400 bg-white'
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="font-semibold">{method.label}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{method.description}</p>
            </motion.label>
          );
        })}
      </div>
    </RadioGroup>
  );
}
