/* frontend/src/features/orders/components/OrdersEmpty.jsx */
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OrdersEmpty() {
  return (
    <Card className="rounded-3xl p-12 text-center flex flex-col items-center justify-center">
      <div className="max-w-md space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">No orders yet</h2>
        <p className="text-gray-600">
          You haven’t placed any orders yet. Explore our handcrafted collections
          and find something timeless.
        </p>
        <Button asChild className="mt-4">
          <Link to="/shop">Start shopping</Link>
        </Button>
      </div>
    </Card>
  );
}
