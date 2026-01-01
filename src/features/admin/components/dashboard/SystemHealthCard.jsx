// src/features/admin/components/dashboard/SystemHealthCard.jsx
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function SystemHealthCard() {
  const metrics = [
    {
      label: 'API Latency',
      value: '42ms',
      progress: '95%',
      color: 'bg-green-500',
    },
    {
      label: 'Database Load',
      value: '12%',
      progress: '12%',
      color: 'bg-indigo-500',
    },
  ];

  return (
    <Card className="p-8 border-none ring-1 ring-slate-200 rounded-3xl bg-white shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-sm font-bold text-slate-900">System Health</h4>
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 rounded-lg font-bold text-[10px]">
          OPTIMAL
        </Badge>
      </div>
      <div className="space-y-4">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500 font-medium">
                {m.label}
              </span>
              <span className="text-xs font-bold text-slate-900">
                {m.value}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full">
              <div
                className={`h-full ${m.color} rounded-full`}
                style={{ width: m.progress }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
