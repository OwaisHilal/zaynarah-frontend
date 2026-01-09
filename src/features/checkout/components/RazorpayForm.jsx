// src/features/checkout/components/RazorpayForm.jsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCheckoutDomainStore } from '@/stores/checkout';

export default function RazorpayForm() {
  const paymentDetails = useCheckoutDomainStore((s) => s.paymentDetails);
  const setPaymentDetails = useCheckoutDomainStore((s) => s.setPaymentDetails);

  return (
    <div className="space-y-3">
      <div>
        <Label>Name</Label>
        <Input
          value={paymentDetails?.name || ''}
          onChange={(e) =>
            setPaymentDetails({
              ...paymentDetails,
              name: e.target.value,
            })
          }
        />
      </div>

      <div>
        <Label>Phone</Label>
        <Input
          value={paymentDetails?.phone || ''}
          onChange={(e) =>
            setPaymentDetails({
              ...paymentDetails,
              phone: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}
