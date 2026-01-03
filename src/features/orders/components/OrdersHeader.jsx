/* frontend/src/features/orders/components/OrdersHeader.jsx */
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function OrdersHeader() {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900">My Orders</h1>
        <p className="mt-2 text-gray-600 text-lg">
          Track your purchases, view order details, and download invoices
        </p>
      </div>

      <Button asChild variant="outline">
        <Link to="/shop">Continue shopping</Link>
      </Button>
    </div>
  );
}
