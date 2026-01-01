// src/features/admin/pages/Orders.jsx

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderFilters } from '../components/order/OrderFilters';
import { OrderTableRow, OrderSkeleton } from '../components/order/OrderTable';
import { useOrdersQuery } from '../hooks/useOrdersQuery';
import { useOrdersFiltersStore } from '../stores/ordersFiltersStore';

export default function Orders() {
  const navigate = useNavigate();

  const { page, status, paymentStatus, from, to, setPage, resetFilters } =
    useOrdersFiltersStore();

  const { queryKey, queryFn, keepPreviousData } = useOrdersQuery({
    page,
    status,
    paymentStatus,
    from,
    to,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn,
    keepPreviousData,
  });

  const orders = data?.orders || [];
  const hasMore = data?.hasMore;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Orders</h1>
          <p className="text-sm text-slate-500">
            Review and manage customer orders
          </p>
        </div>
        {isFetching && (
          <span className="text-xs text-slate-400">Updating…</span>
        )}
      </div>

      <OrderFilters onClear={resetFilters} />

      <Card className="border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Order</th>
                <th className="px-6 py-3 text-left font-medium">Customer</th>
                <th className="px-6 py-3 text-left font-medium">Total</th>
                <th className="px-6 py-3 text-left font-medium">Payment</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Date</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <OrderSkeleton />
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <OrderTableRow
                    key={order._id}
                    order={order}
                    onView={(id) => navigate(`/admin/orders/${id}`)}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-16 text-center text-slate-500"
                  >
                    No orders found for the selected filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50/50">
          <span className="text-sm text-slate-500">Page {page}</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || isFetching}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasMore || isFetching}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
