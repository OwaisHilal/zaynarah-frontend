// src/features/admin/components/dashboard/SalesHeatmap.jsx
import { Card } from '@/components/ui/card';
import { Activity } from 'lucide-react';

export function SalesHeatmap() {
  // Mock data representing 7 days x 12 blocks (2hr intervals)
  // In a real app, you'd calculate this from order timestamps
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const data = Array.from({ length: 84 }, () => Math.floor(Math.random() * 4));

  const getIntensity = (val) => {
    if (val === 0) return 'bg-slate-50';
    if (val === 1) return 'bg-indigo-100';
    if (val === 2) return 'bg-indigo-300';
    return 'bg-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.4)]';
  };

  return (
    <Card className="p-6 border-none ring-1 ring-slate-200 rounded-[24px] shadow-sm bg-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-indigo-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
            Sales Velocity Heatmap
          </span>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`h-2 w-2 rounded-sm ${getIntensity(i)}`} />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col justify-between py-1">
          {days.map((day, i) => (
            <span
              key={i}
              className="text-[9px] font-black text-slate-300 uppercase"
            >
              {day}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-12 gap-1.5 flex-1">
          {data.map((val, i) => (
            <div
              key={i}
              className={`aspect-square rounded-sm transition-all hover:scale-125 cursor-crosshair ${getIntensity(
                val
              )}`}
              title={`Intensity Level: ${val}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-4">
        <span>00:00</span>
        <span>12:00</span>
        <span>23:59</span>
      </div>
    </Card>
  );
}
