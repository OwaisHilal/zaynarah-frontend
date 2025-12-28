import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderFilters } from '../components/order/OrderFilters';
import { OrderTableRow, OrderSkeleton } from '../components/order/OrderTable';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const PAGE_SIZE = 20;

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    status: '',
    paymentStatus: '',
    from: '',
    to: '',
  });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        limit: PAGE_SIZE,
      });

      const res = await axios.get(`${API_BASE}/orders?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setOrders(res.data || []);
      setHasMore(res.data?.length === PAGE_SIZE);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const clearFilters = () => {
    setFilters({ page: 1, status: '', paymentStatus: '', from: '', to: '' });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Orders</h1>
        <p className="text-sm text-slate-500">
          Review and manage customer orders
        </p>
      </div>

      <OrderFilters
        filters={filters}
        setFilters={setFilters}
        onClear={clearFilters}
      />

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
              {loading ? (
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
                    className="px-6 py-12 text-center text-slate-500 italic"
                  >
                    No orders found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50/50">
          <span className="text-sm text-slate-500">Page {filters.page}</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page === 1 || loading}
              onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasMore || loading}
              onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
