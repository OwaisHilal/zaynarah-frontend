// src/features/admin/components/dashboard/StrategyAssistant.jsx
import {
  TrendingUp,
  ChevronRight,
  Sparkles,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function StrategyAssistant({ category = 'Jewelry' }) {
  return (
    <Card className="relative p-8 bg-slate-950 text-white shadow-2xl rounded-[32px] overflow-hidden border-none group">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-slate-950 to-slate-950" />

      {/* Animated Glow Orb */}
      <div className="absolute -right-16 -top-16 h-64 w-64 bg-indigo-600/20 rounded-full blur-[80px] group-hover:bg-indigo-600/30 transition-all duration-1000 group-hover:scale-125" />
      <div className="absolute -left-20 -bottom-20 h-64 w-64 bg-blue-600/10 rounded-full blur-[80px] opacity-50" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header Icon */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-inner">
            <Sparkles className="text-indigo-400" size={22} strokeWidth={2.5} />
          </div>
          <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
              Live Insight
            </span>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-indigo-400/80 uppercase tracking-[0.3em]">
            Strategic Intelligence
          </h4>

          <h2 className="text-2xl font-black leading-tight tracking-tight text-white">
            Market demand is spiking in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
              {category}
            </span>
            .
          </h2>

          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[240px]">
            Current velocity suggests a{' '}
            <span className="text-white font-bold">20% stock increase</span> is
            required to prevent revenue leakage over the next 14 days.
          </p>
        </div>

        {/* Action Button */}
        <Button
          className={cn(
            'mt-10 w-full bg-white hover:bg-indigo-50 text-slate-950 rounded-2xl font-black text-[11px] tracking-widest uppercase py-6',
            'transition-all duration-300 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 group/btn'
          )}
        >
          Optimize Allocation
          <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </Button>

        {/* Decorative Badge */}
        <div className="mt-6 flex items-center gap-2 text-slate-500">
          <Zap size={12} className="text-indigo-500 fill-indigo-500" />
          <span className="text-[9px] font-bold uppercase tracking-wider">
            AI Recommendation based on last 30d sales
          </span>
        </div>
      </div>
    </Card>
  );
}
