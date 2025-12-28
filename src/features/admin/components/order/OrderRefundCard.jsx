import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export function OrderRefundCard({ order, onRefunded }) {
  const [amount, setAmount] = useState(order.cartTotal.grand);
  const [loading, setLoading] = useState(false);

  if (order.paymentStatus !== 'paid') return null;

  const submitRefund = async () => {
    if (!confirm(`Refund ₹${amount}?`)) return;

    setLoading(true);
    try {
      await axios.post(
        `${API_BASE}/payments/refund`,
        { orderId: order.id, amount },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      onRefunded();
    } catch {
      alert('Refund failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-rose-200 bg-rose-50 p-5">
      <h3 className="font-medium text-rose-800 mb-2">Refund</h3>

      <div className="flex items-center gap-3">
        <input
          type="number"
          value={amount}
          max={order.cartTotal.grand}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border rounded-md px-3 py-2 w-32"
        />

        <Button variant="destructive" disabled={loading} onClick={submitRefund}>
          {loading ? 'Processing…' : 'Refund'}
        </Button>
      </div>
    </Card>
  );
}
