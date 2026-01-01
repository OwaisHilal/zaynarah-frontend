// src/features/admin/components/order/OrderTimeline.jsx

import { Card } from '@/components/ui/card';
import { useMemo } from 'react';

export function OrderTimeline({ events = [] }) {
  const normalizedEvents = useMemo(
    () =>
      events
        .filter((e) => e && e.at)
        .map((e) => {
          const d = new Date(e.at);
          return {
            id: `${e.label}-${e.at}`,
            label: e.label || 'Update',
            note: e.note || '',
            at: Number.isNaN(d.getTime()) ? '—' : d.toLocaleString(),
          };
        }),
    [events]
  );

  return (
    <Card className="border border-slate-200 bg-white p-6">
      <div className="text-sm font-medium text-slate-900 mb-4">
        Order timeline
      </div>

      {normalizedEvents.length === 0 ? (
        <div className="text-sm text-slate-500 py-6 text-center">
          No timeline events available
        </div>
      ) : (
        <ol className="relative border-l border-slate-200 pl-6 space-y-6">
          {normalizedEvents.map((e, idx) => (
            <li key={e.id} className="relative">
              <span
                className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full ${
                  idx === 0 ? 'bg-slate-900' : 'bg-slate-400'
                }`}
              />
              <div className="text-sm font-medium text-slate-900">
                {e.label}
              </div>
              {e.note && (
                <div className="text-xs text-slate-600 mt-0.5">{e.note}</div>
              )}
              <div className="text-xs text-slate-500 mt-0.5">{e.at}</div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
