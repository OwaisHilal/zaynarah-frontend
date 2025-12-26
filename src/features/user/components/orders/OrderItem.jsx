// src/features/user/components/orders/OrderItem.jsx
import { Button } from '@/components/ui/button';

export default function OrderItem({ order, onView }) {
  return (
    <div className="flex justify-between items-center p-4 border rounded-xl">
      <div>
        <p className="font-semibold">Order #{order.id}</p>
        <p className="text-sm text-gray-500">{order.date}</p>
      </div>

      <div className="text-right">
        <p className="font-semibold">{order.status}</p>
        <p>₹{order.total}</p>
      </div>

      <Button size="sm" variant="outline" onClick={() => onView(order)}>
        View
      </Button>
    </div>
  );
}
