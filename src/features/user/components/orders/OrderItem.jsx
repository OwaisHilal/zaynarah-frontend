// src/features/user/components/orders/OrderItem.jsx
import { Button } from '@/components/ui/button';

const ROSE_GOLD = '#B76E79';
const GOLD = '#D4AF37';

export default function OrderItem({ order, onView }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-xl shadow-sm hover:shadow-md transition">
      <div>
        <p className="font-semibold text-gray-900">Order #{order.id}</p>
        <p className="text-gray-500 text-sm">Date: {order.date}</p>
      </div>

      <div className="text-right mt-2 sm:mt-0">
        <p
          className={`font-semibold ${
            order.status === 'Delivered'
              ? 'text-green-600'
              : order.status === 'Shipped'
              ? 'text-blue-600'
              : 'text-yellow-600'
          }`}
        >
          {order.status}
        </p>
        <p className="text-gray-700 font-medium">₹{order.total}</p>
      </div>

      <Button
        size="sm"
        variant="outline"
        className="mt-2 sm:mt-0 rounded-full px-4 py-1 font-semibold shadow hover:shadow-lg"
        style={{
          border: `2px solid ${ROSE_GOLD}`,
          color: ROSE_GOLD,
        }}
        onClick={() => onView(order)}
      >
        View
      </Button>
    </div>
  );
}
