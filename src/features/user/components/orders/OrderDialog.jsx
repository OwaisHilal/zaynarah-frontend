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

const downloadInvoice = (order) => {
  if (!order) return;

  const invoice = `
Zaynarah - Order Invoice
--------------------------

Order ID: ${order.id}
Date: ${order.date}
Status: ${order.status}
Payment: ${order.paymentMethod?.toUpperCase()}

Items:
${order.items
  .map((i) => `• ${i.name} | Qty: ${i.qty} | ₹${i.price}`)
  .join('\n')}

--------------------------
TOTAL: ₹${order.total}
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
            <DialogTitle>Order #{order.id}</DialogTitle>
          </DialogHeader>

          <DialogDescription className="space-y-2">
            <p>Status: {order.status}</p>
            <p>Date: {order.date}</p>
            <p>Total: ₹{order.total}</p>

            <h4 className="font-semibold mt-4">Items</h4>
            <ul className="list-disc list-inside">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} × {item.qty} — ₹{item.price}
                </li>
              ))}
            </ul>
          </DialogDescription>

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => downloadInvoice(order)}>
              Download Invoice
            </Button>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
