/* frontend/src/features/orders/components/OrderDetailsDrawer.jsx */
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function OrderDetailsDrawer({ open, onClose, order }) {
  if (!order) return null;

  const items = order.items || order.orderItems || [];
  const total = order.cartTotal?.grand || order.total || 0;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">
            Order #{order._id || order.id}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Order status</p>
            <p className="font-semibold capitalize">{order.status}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500">Order date</p>
            <p className="font-medium">
              {new Date(order.createdAt || order.date).toLocaleDateString()}
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Items</h3>

            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-medium">{item.name || item.title}</p>
                  <p className="text-gray-500">Qty {item.qty}</p>
                </div>
                <p className="font-medium">₹{item.price * item.qty}</p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Payment method</p>
              <p className="font-medium uppercase">
                {order.paymentMethod || '—'}
              </p>
            </div>

            <div className="flex items-center justify-between text-lg font-semibold">
              <p>Total</p>
              <p>₹{total}</p>
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              Download invoice
            </Button>
            <Button className="flex-1" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
