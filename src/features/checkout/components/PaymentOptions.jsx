// src/features/checkout/components/PaymentOptions.jsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useCheckoutDomainStore } from '@/stores/checkout';

const paymentMethods = [
  {
    id: 'stripe',
    label: 'Stripe (Global)',
    description: 'Pay internationally using cards / wallets',
  },
  {
    id: 'razorpay',
    label: 'Razorpay (India)',
    description: 'Pay using UPI, Netbanking, Wallets (Indian users)',
  },
];

export default function PaymentOptions() {
  const paymentMethod = useCheckoutDomainStore((s) => s.paymentMethod);
  const setPaymentMethod = useCheckoutDomainStore((s) => s.setPaymentMethod);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold text-gray-900 text-lg">
        Select Payment Method
      </h3>

      <RadioGroup
        value={paymentMethod}
        onValueChange={setPaymentMethod}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {paymentMethods.map((method) => {
          const isSelected = paymentMethod === method.id;

          return (
            <motion.label
              key={method.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                'cursor-pointer border rounded-xl p-4 flex flex-col gap-2 transition-all',
                isSelected
                  ? 'border-rose-600 bg-rose-50 shadow-sm'
                  : 'border-gray-300 hover:shadow'
              )}
            >
              <RadioGroupItem value={method.id} className="sr-only" />

              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center border transition-colors',
                    isSelected
                      ? 'border-rose-600 bg-rose-600'
                      : 'border-gray-400 bg-white'
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>

                <span className="font-medium text-gray-900">
                  {method.label}
                </span>
              </div>

              <p className="text-sm text-gray-500">{method.description}</p>
            </motion.label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
