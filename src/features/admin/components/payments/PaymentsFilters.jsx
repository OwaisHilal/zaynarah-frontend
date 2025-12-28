export function PaymentsFilters({
  status,
  provider,
  onStatusChange,
  onProviderChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Payments</h1>
        <p className="text-sm text-neutral-500">
          View and monitor payment activity
        </p>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={provider}
          onChange={(e) => onProviderChange(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">All providers</option>
          <option value="stripe">Stripe</option>
          <option value="razorpay">Razorpay</option>
        </select>
      </div>
    </div>
  );
}
