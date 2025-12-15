import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCheckoutStore } from '../store/checkoutStore';

export default function RazorpayForm() {
  const { paymentDetails, setPaymentDetails } = useCheckoutStore();

  return (
    <div className="space-y-3">
      <div>
        <Label>Name</Label>
        <Input
          value={paymentDetails?.name || ''}
          onChange={(e) =>
            setPaymentDetails({ ...paymentDetails, name: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Phone</Label>
        <Input
          value={paymentDetails?.phone || ''}
          onChange={(e) =>
            setPaymentDetails({ ...paymentDetails, phone: e.target.value })
          }
        />
      </div>
    </div>
  );
}
