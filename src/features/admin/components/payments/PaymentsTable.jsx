// src/features/admin/components/payments/PaymentsTable.jsx

import { PaymentsTableRow } from './PaymentsTableRow';

export function PaymentsTable({ payments }) {
  const hasPayments = Array.isArray(payments) && payments.length > 0;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="px-6 py-4 text-left">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Transaction ID
              </span>
            </th>
            <th className="px-6 py-4 text-left">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Customer
              </span>
            </th>
            <th className="px-6 py-4 text-left">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Amount
              </span>
            </th>
            <th className="px-6 py-4 text-left">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Gateway
              </span>
            </th>
            <th className="px-6 py-4 text-left">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Status
              </span>
            </th>
            <th className="px-6 py-4 text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Timestamp
              </span>
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {hasPayments ? (
            payments.map((payment) => (
              <PaymentsTableRow
                key={payment.orderId || payment._id}
                payment={payment}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6}>
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full border-2 border-dashed border-slate-200" />
                  </div>
                  <p className="text-sm font-bold text-slate-400 italic">
                    No transactions found in this ledger
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
