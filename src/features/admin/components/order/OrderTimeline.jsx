import { Card } from '@/components/ui/card';

export function OrderTimeline({ events }) {
  return (
    <Card className="border border-slate-200 bg-white p-6">
      <div className="text-sm font-medium text-slate-900 mb-4">
        Order timeline
      </div>
      <ol className="relative border-l border-slate-200 pl-6 space-y-6">
        {events.map((e, idx) => (
          <li key={idx} className="relative">
            <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-slate-400" />
            <div className="text-sm text-slate-900">{e.label}</div>
            {e.note && (
              <div className="text-xs text-slate-600 mt-0.5">{e.note}</div>
            )}
            <div className="text-xs text-slate-500">
              {new Date(e.at).toLocaleString()}
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
