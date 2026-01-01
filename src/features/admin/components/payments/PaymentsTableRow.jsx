// src/features/admin/components/payments/PaymentsTableRow.jsx

export function PaymentsTableRow({ payment }) {
  const orderId = payment?.orderId || payment?._id || '—';
  const email = payment?.user?.email || 'Guest';

  const amount =
    typeof payment?.amount === 'number'
      ? new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: payment?.currency || 'INR',
          maximumFractionDigits: 2,
        }).format(payment.amount)
      : '—';

  const provider = payment?.paymentProvider || '—';
  const status = payment?.paymentStatus || 'pending';
  const paidAt = payment?.paidAt
    ? new Date(payment.paidAt).toLocaleString()
    : '—';

  const statusClasses =
    status === 'paid'
      ? 'bg-emerald-50 text-emerald-700'
      : status === 'failed'
      ? 'bg-rose-50 text-rose-700'
      : 'bg-amber-50 text-amber-700';

  return (
    <tr className="hover:bg-neutral-50 transition-colors">
      <td className="px-4 py-3 font-mono text-xs text-neutral-700 truncate max-w-[140px]">
        {orderId}
      </td>

      <td className="px-4 py-3 text-neutral-800 truncate max-w-[200px]">
        {email}
      </td>

      <td className="px-4 py-3 text-neutral-900 font-medium whitespace-nowrap">
        {amount}
      </td>

      <td className="px-4 py-3 capitalize text-neutral-700">{provider}</td>

      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses}`}
        >
          {status}
        </span>
      </td>

      <td className="px-4 py-3 text-sm text-neutral-500">{paidAt}</td>
    </tr>
  );
}
