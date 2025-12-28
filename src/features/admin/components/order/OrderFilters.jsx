import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function OrderFilters({ filters, setFilters, onClear }) {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <Card className="border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500 font-medium">
            Order status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-slate-200 outline-none"
          >
            <option value="">All</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500 font-medium">Payment</label>
          <select
            value={filters.paymentStatus}
            onChange={(e) => handleChange('paymentStatus', e.target.value)}
            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-slate-200 outline-none"
          >
            <option value="">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500 font-medium">From</label>
          <Input
            type="date"
            className="h-9"
            value={filters.from}
            onChange={(e) => handleChange('from', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500 font-medium">To</label>
          <Input
            type="date"
            className="h-9"
            value={filters.to}
            onChange={(e) => handleChange('to', e.target.value)}
          />
        </div>

        <Button variant="outline" size="sm" onClick={onClear} className="h-9">
          Clear Filters
        </Button>
      </div>
    </Card>
  );
}
