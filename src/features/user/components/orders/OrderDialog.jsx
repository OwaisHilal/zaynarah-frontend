// src/features/user/components/orders/OrderDialog.jsx
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ROSE_GOLD = '#B76E79';
const GOLD = '#D4AF37';

const downloadInvoice = (order) => {
  if (!order) return;

  const invoice = `
Zaynarah - Order Invoice
--------------------------

Order ID: ${order.id}
Order Date: ${order.date}
Status: ${order.status}

Items:
${order.items
  .map((i) => `• ${i.name} | Qty: ${i.qty} | ₹${i.price}`)
  .join('\n')}

--------------------------
TOTAL: ₹${order.total}

Thank you for shopping with Zaynarah!
`;

  const blob = new Blob([invoice], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice-${order.id}.txt`;
  a.click();

  URL.revokeObjectURL(url);
};

export default function OrderDialog({ order, onClose }) {
  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      {order && (
        <DialogContent className="sm:max-w-lg bg-white rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Order #{order.id} Details
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="text-gray-700 space-y-2">
            <p>Status: {order.status}</p>
            <p>Date: {order.date}</p>
            <p>Total: ₹{order.total}</p>

            <h4 className="font-semibold mt-4">Items:</h4>
            <ul className="list-disc list-inside">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} — Qty: {item.qty} — ₹{item.price}
                </li>
              ))}
            </ul>

            {order.status !== 'Delivered' && (
              <div className="mt-4 bg-gray-100 p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">Shipment Tracking</h4>
                <div className="space-y-2 text-sm">
                  <p>📦 Order Placed — {order.date}</p>
                  <p>
                    🚚 Shipped —{' '}
                    {['Shipped', 'Delivered'].includes(order.status)
                      ? 'Your item is on the way'
                      : 'Waiting for dispatch'}
                  </p>
                  <p>
                    🎯 Out for Delivery —{' '}
                    {order.status === 'Delivered' ? 'Completed' : 'Pending'}
                  </p>
                  {order.status === 'Delivered' && (
                    <p>✔️ Delivered — {order.date}</p>
                  )}
                </div>
              </div>
            )}
          </DialogDescription>

          <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
            <Button
              variant="outline"
              className="rounded-full px-4 py-2 font-semibold"
              style={{ border: `2px solid ${ROSE_GOLD}`, color: ROSE_GOLD }}
              onClick={() => downloadInvoice(order)}
            >
              Download Invoice
            </Button>

            <Button
              variant="secondary"
              className="rounded-full px-4 py-2 font-semibold"
              style={{
                background: `linear-gradient(90deg, ${ROSE_GOLD}, ${GOLD})`,
                color: '#fff',
              }}
              onClick={() => alert('Reorder simulated')}
            >
              Reorder
            </Button>

            <Button
              className="rounded-full px-4 py-2 font-semibold"
              onClick={onClose}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
