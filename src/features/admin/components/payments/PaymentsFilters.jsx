// src/features/admin/components/payments/PaymentsFilters.jsx

export function PaymentsFilters({
  status,
  provider,
  onStatusChange,
  onProviderChange,
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Payments</h1>
        <p className="text-sm text-neutral-500">
          View and monitor payment activity
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">Status</label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-9 rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500">
            Provider
          </label>
          <select
            value={provider}
            onChange={(e) => onProviderChange(e.target.value)}
            className="h-9 rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
          >
            <option value="">All providers</option>
            <option value="stripe">Stripe</option>
            <option value="razorpay">Razorpay</option>
          </select>
        </div>
      </div>
    </div>
  );
}
