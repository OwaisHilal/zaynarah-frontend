// src/features/admin/components/dashboard/PaymentsBreakdownCharts.jsx

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  PolarAngleAxis,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { ShieldCheck, Zap, CreditCard, Activity } from 'lucide-react';

const COLORS = {
  stripe: '#6366f1', // Indigo 500
  razorpay: '#0ea5e9', // Sky 500
  paid: '#10b981', // Emerald 500
  pending: '#f59e0b', // Amber 500
  failed: '#f43f5e', // Rose 500
  base: '#f1f5f9', // Slate 100
};

export default function PaymentsBreakdownCharts({ raw = [] }) {
  const stats = useMemo(() => {
    const data = {
      stripe: 0,
      razorpay: 0,
      paid: 0,
      pending: 0,
      failed: 0,
      total: 0,
    };

    raw.forEach((row) => {
      const provider = row?._id?.provider;
      const status = row?._id?.status;
      const count = Number(row?.count) || 0;

      if (provider) data[provider] = (data[provider] || 0) + count;
      if (status) data[status] = (data[status] || 0) + count;
      data.total += count;
    });

    return data;
  }, [raw]);

  // Data for the "Fintech Radial" - showing Gateway split
  const radialData = [
    {
      name: 'Stripe',
      value: (stats.stripe / stats.total) * 100,
      fill: COLORS.stripe,
    },
    {
      name: 'Razorpay',
      value: (stats.razorpay / stats.total) * 100,
      fill: COLORS.razorpay,
    },
  ];

  return (
    <Card className="p-0 border-none ring-1 ring-slate-200 rounded-[32px] bg-white shadow-xl shadow-slate-200/40 overflow-hidden">
      <div className="p-8 pb-0 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Settlement Health
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Gateway Integrity
          </h3>
        </div>
        <div className="flex -space-x-2">
          <div className="h-8 w-8 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Zap size={14} fill="currentColor" />
          </div>
          <div className="h-8 w-8 rounded-full border-2 border-white bg-sky-50 flex items-center justify-center text-sky-600">
            <CreditCard size={14} fill="currentColor" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 p-8 gap-8">
        {/* The Radial Visualization */}
        <div className="relative h-[220px] flex items-center justify-center bg-slate-50/50 rounded-[24px]">
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-black text-slate-900 tracking-tighter">
              {stats.total}
            </span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              TX Volume
            </span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="100%"
              barSize={12}
              data={radialData}
              startAngle={90}
              endAngle={450}
            >
              <RadialBar
                minAngle={15}
                background={{ fill: '#f1f5f9' }}
                clockWise
                dataKey="value"
                cornerRadius={10}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* The Fintech Data Grid */}
        <div className="flex flex-col justify-between py-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-tight">
                  Stripe Payments
                </span>
              </div>
              <span className="text-sm font-black text-slate-900">
                {stats.stripe}
              </span>
            </div>
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-tight">
                  Razorpay Total
                </span>
              </div>
              <span className="text-sm font-black text-slate-900">
                {stats.razorpay}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-2">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">
                Success
              </span>
              <div className="flex items-center gap-1.5 text-emerald-600">
                <Activity size={12} />
                <span className="text-sm font-black">{stats.paid}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">
                Pending
              </span>
              <div className="flex items-center gap-1.5 text-amber-500">
                <Activity size={12} />
                <span className="text-sm font-black">{stats.pending}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">
                Failed
              </span>
              <div className="flex items-center gap-1.5 text-rose-500">
                <Activity size={12} />
                <span className="text-sm font-black">{stats.failed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-slate-50 px-8 py-4 flex justify-between items-center">
        <span className="text-[10px] font-bold text-slate-400 italic">
          Data synchronized 2m ago
        </span>
        <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700">
          Gateway Settings →
        </button>
      </div>
    </Card>
  );
}
