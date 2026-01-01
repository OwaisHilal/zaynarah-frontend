// src/features/admin/components/dashboard/OrdersTrendChart.jsx

import {
  ResponsiveContainer,
  AreaChart, // Upgraded from LineChart
  Area, // Upgraded from Line
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { TrendingUp, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });
}

// Custom Tooltip component for a premium look
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
          {formatDate(label)}
        </p>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-indigo-500" />
          <p className="text-sm font-bold text-white">
            Orders:{' '}
            <span className="text-indigo-300 font-black">
              {payload[0].value}
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function OrdersTrendChart({ data = [], onExport }) {
  const normalizedData = useMemo(
    () =>
      data.map((d) => ({
        date: d._id,
        count: Number(d.count) || 0,
      })),
    [data]
  );

  if (normalizedData.length === 0) {
    return (
      <div className="h-80 flex flex-col items-center justify-center text-sm text-slate-400 bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200 m-8">
        <TrendingUp className="mb-2 opacity-20" size={32} />
        <p className="font-bold uppercase tracking-widest text-[10px]">
          No transaction flow detected
        </p>
      </div>
    );
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="flex flex-row items-center justify-between p-8 pb-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600">
            <TrendingUp size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Growth Analytics
            </span>
          </div>
          <CardTitle className="text-xl font-black text-slate-900">
            Orders Trend
          </CardTitle>
          <CardDescription className="font-medium">
            Monitoring sales velocity and peak performance.
          </CardDescription>
        </div>
        {onExport && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            className="h-9 rounded-xl font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all"
          >
            <Download size={16} className="mr-2" />
            CSV
          </Button>
        )}
      </CardHeader>

      <div className="h-72 w-full p-6 pt-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={normalizedData}
            margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Cleaner Grid: Only horizontal lines */}
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#f1f5f9"
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickFormatter={formatDate}
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#orderGradient)"
              animationDuration={2000}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
