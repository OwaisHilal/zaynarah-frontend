import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

/**
 * Download invoice helper (keeps the same text invoice behavior you had)
 * If you later want PDF, we can swap this for jsPDF or server-side generation.
 */
const downloadInvoice = (order) => {
  if (!order) return;

  const invoice = `
Zaynarah - Order Invoice
-------------------------------------

Order ID: ${order.id}
Order Date: ${order.date}
Status: ${order.status}

Items:
${order.items
  .map((i) => `• ${i.name} | Qty: ${i.qty} | ₹${i.price}`)
  .join('\n')}

-------------------------------------
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order #{order.id} Details</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            <p>Status: {order.status}</p>
            <p>Date: {order.date}</p>
            <p>Total: ₹{order.total}</p>

            {/* Items */}
            <h4 className="font-semibold mt-4">Items:</h4>
            <ul className="list-disc list-inside text-gray-700">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} — Qty: {item.qty} — ₹{item.price}
                </li>
              ))}
            </ul>

            {/* Tracking */}
            {order.status !== 'Delivered' && (
              <div className="mt-6 bg-gray-100 p-4 rounded-lg border">
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

          <DialogFooter className="flex justify-between">
            {/* Download invoice restored here */}
            <Button variant="outline" onClick={() => downloadInvoice(order)}>
              Download Invoice
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                alert('Reorder simulated');
              }}
            >
              Reorder
            </Button>

            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
