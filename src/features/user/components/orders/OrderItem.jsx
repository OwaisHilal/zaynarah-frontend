import { Button } from '@/components/ui/button';

export default function OrderItem({ order, onView }) {
  return (
    <div className="flex justify-between items-center p-4 border rounded-lg shadow-sm">
      <div>
        <p className="font-semibold">Order #{order.id}</p>
        <p className="text-gray-500 text-sm">Date: {order.date}</p>
      </div>

      <div className="text-right">
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

      {/* VIEW BUTTON */}
      <Button size="sm" variant="outline" onClick={() => onView(order)}>
        View
      </Button>
    </div>
  );
}
