// src/features/checkout/components/OrderSuccess.jsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';

export default function OrderSuccess({ order }) {
  const navigate = useNavigate();

  if (!order) return null;

  const downloadInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Invoice', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 20, 40);
    doc.text(`Total Amount: ₹${order.totalAmount}`, 20, 50);
    doc.text(
      `Delivery Address: ${order.address?.street}, ${order.address?.city}, ${order.address?.state} - ${order.address?.zip}`,
      20,
      60
    );

    doc.text('Items:', 20, 80);
    order.items.forEach((item, idx) => {
      doc.text(
        `${idx + 1}. ${item.name} - Qty: ${item.qty} - Price: ₹${item.price}`,
        25,
        90 + idx * 10
      );
    });

    doc.save(`Invoice_${order._id}.pdf`);
  };

  return (
    <Card className="shadow-lg border border-green-500 mt-4">
      <CardHeader>
        <h2 className="text-2xl font-bold text-green-600">
          Order Placed Successfully!
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-gray-700">
          Thank you for your purchase. Your order ID is{' '}
          <strong>{order._id}</strong>.
        </p>
        <div className="flex flex-col md:flex-row gap-4 mt-2">
          <Button
            onClick={downloadInvoice}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            Download Invoice
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Go to Home
          </Button>
          <Button
            onClick={() => navigate('/shop')}
            className="bg-rose-500 hover:bg-rose-600 text-white"
          >
            Continue Shopping
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
