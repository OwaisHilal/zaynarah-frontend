/* frontend/src/features/orders/components/OrderRow.jsx */
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import OrderDetailsDrawer from './OrderDetailsDrawer';

const STATUS_STYLES = {
  placed: 'bg-gray-100 text-gray-800',
  paid: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderRow({ order }) {
  const [open, setOpen] = useState(false);

  const status = STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-800';

  return (
    <>
      <Card className="rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Order</p>
          <p className="font-semibold text-gray-900">
            #{order._id || order.id}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt || order.date).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${status}`}
          >
            {order.status}
          </span>

          <p className="font-semibold text-gray-900">
            ₹{order.cartTotal?.grand || order.total}
          </p>

          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            View details
          </Button>
        </div>
      </Card>

      <OrderDetailsDrawer
        open={open}
        onClose={() => setOpen(false)}
        order={order}
      />
    </>
  );
}
