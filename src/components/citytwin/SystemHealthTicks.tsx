import React from 'react';

interface SystemHealthTicksProps {
  health: number; // 0 to 100
  label?: string;
  subLabel?: string;
  totalTicks?: number;
  className?: string;
}

export const SystemHealthTicks: React.FC<SystemHealthTicksProps> = ({
  health,
  label = 'System Health',
  subLabel = 'All nodes operational',
  totalTicks = 28,
  className = ''
}) => {
  const activeCount = Math.round((Math.min(100, Math.max(0, health)) / 100) * totalTicks);

  return (
    <div className={`p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 select-none ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f59b] animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 font-heading">
            {label}
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-white">{Math.round(health)}%</span>
      </div>

      {subLabel && (
        <div className="text-[10px] text-slate-400 mb-2.5 truncate">
          {subLabel}
        </div>
      )}

      {/* Segmented Ticks */}
      <div className="flex items-center justify-between gap-1 w-full h-4">
        {Array.from({ length: totalTicks }).map((_, i) => {
          const isActive = i < activeCount;
          // Gradient from emerald into amber for upper or critical levels
          const tickColor = i < totalTicks * 0.75 ? '#00f59b' : '#f59e0b';

          return (
            <div
              key={i}
              className="flex-1 h-full rounded-full transition-all duration-300"
              style={{
                background: isActive ? tickColor : 'rgba(255, 255, 255, 0.12)',
                boxShadow: isActive ? `0 0 6px ${tickColor}40` : 'none'
              }}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 mt-1.5">
        <span>0</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default SystemHealthTicks;
