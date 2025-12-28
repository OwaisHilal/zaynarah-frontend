import { PaymentsTableRow } from './PaymentsTableRow';

export function PaymentsTable({ payments }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 text-neutral-500 border-b">
          <tr>
            <th className="px-4 py-3 text-left">Order</th>
            <th className="px-4 py-3 text-left">User</th>
            <th className="px-4 py-3 text-left">Amount</th>
            <th className="px-4 py-3 text-left">Provider</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Paid At</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {payments.length ? (
            payments.map((p) => (
              <PaymentsTableRow key={p.orderId} payment={p} />
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-10 text-center text-neutral-500"
              >
                No payments found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
