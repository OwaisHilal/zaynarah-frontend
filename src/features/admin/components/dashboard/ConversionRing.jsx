// src/features/admin/components/dashboard/ConversionRing.jsx
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { Target } from 'lucide-react';

export function ConversionRing({ completed = 85, abandoned = 15 }) {
  const data = [
    { name: 'Completed', value: completed, fill: '#6366f1' },
    { name: 'Abandoned', value: abandoned, fill: '#f1f5f9' },
  ];

  return (
    <Card className="p-6 border-none ring-1 ring-slate-200 rounded-[24px] shadow-sm bg-white">
      <div className="flex items-center gap-2 mb-6">
        <Target size={14} className="text-indigo-600" />
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
          Checkout Efficiency
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="h-24 w-24 shrink-0 relative">
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-lg font-black text-slate-900 leading-none">
              {completed}%
            </span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={35}
                outerRadius={45}
                startAngle={90}
                endAngle={450}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    cornerRadius={index === 0 ? 10 : 0}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
              Conversion
            </p>
            <p className="text-sm font-black text-slate-900 leading-none">
              Healthy
            </p>
          </div>
          <div className="h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[85%]" />
          </div>
          <p className="text-[10px] font-bold text-slate-500 leading-tight">
            +2.4% from <br />
            last period
          </p>
        </div>
      </div>
    </Card>
  );
}
