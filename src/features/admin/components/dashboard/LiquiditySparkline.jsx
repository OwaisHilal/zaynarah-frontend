// Add this as a new component: src/features/admin/components/dashboard/LiquiditySparkline.jsx

import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export function LiquiditySparkline({ data, color = '#6366f1', label, value }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-lg font-black text-slate-900 tracking-tighter">
          {value}
        </p>
      </div>
      <div className="h-10 w-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              animationDuration={2000}
            />
            <YAxis hide domain={['dataMin', 'dataMax']} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
