// src/features/admin/components/order/OrderFilters.jsx

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOrdersFiltersStore } from '../../stores/ordersFiltersStore';

export function OrderFilters() {
  const {
    status,
    paymentStatus,
    from,
    to,
    setStatus,
    setPaymentStatus,
    setFrom,
    setTo,
    resetFilters,
  } = useOrdersFiltersStore();

  return (
    <Card className="border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-xs font-medium text-slate-500">
            Order status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-slate-200 outline-none"
          >
            <option value="">All</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[140px]">
          <label className="text-xs font-medium text-slate-500">Payment</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-slate-200 outline-none"
          >
            <option value="">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">From</label>
          <Input
            type="date"
            className="h-9"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">To</label>
          <Input
            type="date"
            className="h-9"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="h-9"
          >
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
}
