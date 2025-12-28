export function PaymentsTableRow({ payment }) {
  return (
    <tr className="hover:bg-neutral-50">
      <td className="px-4 py-3 font-mono text-xs">{payment.orderId}</td>

      <td className="px-4 py-3">{payment.user?.email || '—'}</td>

      <td className="px-4 py-3">₹{payment.amount}</td>

      <td className="px-4 py-3 capitalize">{payment.paymentProvider}</td>

      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            payment.paymentStatus === 'paid'
              ? 'bg-emerald-50 text-emerald-700'
              : payment.paymentStatus === 'failed'
              ? 'bg-rose-50 text-rose-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {payment.paymentStatus}
        </span>
      </td>

      <td className="px-4 py-3 text-sm text-neutral-500">
        {payment.paidAt ? new Date(payment.paidAt).toLocaleString() : '—'}
      </td>
    </tr>
  );
}
