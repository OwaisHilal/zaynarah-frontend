// src/features/admin/components/payments/PaymentsTable.jsx

import { PaymentsTableRow } from './PaymentsTableRow';

export function PaymentsTable({ payments }) {
  const hasPayments = Array.isArray(payments) && payments.length > 0;

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Order</th>
            <th className="px-4 py-3 text-left font-medium">User</th>
            <th className="px-4 py-3 text-left font-medium">Amount</th>
            <th className="px-4 py-3 text-left font-medium">Provider</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Paid At</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-neutral-100">
          {hasPayments ? (
            payments.map((payment) => (
              <PaymentsTableRow
                key={payment.orderId || payment._id}
                payment={payment}
              />
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-14 text-center text-sm text-neutral-500"
              >
                No payments found matching your filters
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
