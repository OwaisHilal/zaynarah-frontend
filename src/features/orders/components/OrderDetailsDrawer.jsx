// frontend/src/features/orders/components/OrderDetailsDrawer.jsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useOrdersDomainStore, useOrdersUIStore } from '@/stores/orders';
import { downloadOrderInvoice } from '../services/ordersApi';

export default function OrderDetailsDrawer() {
  const orderId = useOrdersUIStore((s) => s.selectedOrderId);
  const clear = useOrdersUIStore((s) => s.clearSelection);
  const order = useOrdersDomainStore((s) =>
    orderId ? s.getById(orderId) : null
  );

  if (!order) return null;

  const items = order.items || [];
  const total = order.cartTotal?.grand || order.total || 0;

  const handleDownloadInvoice = async () => {
    const html = await downloadOrderInvoice(order.id);
    if (!html) return;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Sheet open onOpenChange={clear}>
      <SheetContent side="right" className="w-full max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">
            Order #{order.id}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-semibold capitalize">{order.status}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">Qty {item.qty}</p>
                </div>
                <p className="font-medium">₹{item.price * item.qty}</p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDownloadInvoice}
            >
              Download invoice
            </Button>
            <Button className="flex-1" onClick={clear}>
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
