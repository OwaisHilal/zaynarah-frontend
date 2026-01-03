/* frontend/src/features/orders/components/OrdersList.jsx */
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOrdersQuery } from '../hooks/useOrdersQuery';
import OrdersEmpty from './OrdersEmpty';
import OrderRow from './OrderRow';

export default function OrdersList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useOrdersQuery({ page, limit: 10 });

  if (isLoading) {
    return (
      <Card className="rounded-3xl p-10 text-center">
        <p className="text-gray-600 text-lg">Loading your orders…</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="rounded-3xl p-10 text-center">
        <p className="text-red-600 text-lg">
          Failed to load orders. Please try again.
        </p>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return <OrdersEmpty />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.map((order) => (
          <OrderRow key={order._id || order.id} order={order} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 pt-6">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </Button>

        <span className="text-sm text-gray-600">Page {page}</span>

        <Button
          variant="outline"
          disabled={data.length < 10}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
