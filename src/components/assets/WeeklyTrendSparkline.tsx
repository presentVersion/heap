import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface DayPoint {
  day: string;
  val: number;
  label: string;
}

const DEFAULT_DAYS: DayPoint[] = [
  { day: 'Mon', val: 45, label: '45 kWh' },
  { day: 'Tue', val: 62, label: '62 kWh' },
  { day: 'Wed', val: 90, label: '90 kWh' },
  { day: 'Thu', val: 58, label: '58 kWh' },
  { day: 'Fri', val: 72, label: '72 kWh' },
  { day: 'Sat', val: 68, label: '68 kWh' },
  { day: 'Sun', val: 50, label: '50 kWh' }
];

export const WeeklyTrendSparkline: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('Wed');
  const [isRotating, setIsRotating] = useState(false);

  const handleRefresh = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 600);
  };

  const activePoint = DEFAULT_DAYS.find(d => d.day === selectedDay) || DEFAULT_DAYS[2];

  // Generate SVG path for sparkline curve
  // Points mapped to SVG coordinates (width 400, height 70)
  const width = 440;
  const height = 70;
  const points = DEFAULT_DAYS.map((d, i) => {
    const x = 30 + i * ((width - 60) / (DEFAULT_DAYS.length - 1));
    const y = height - 15 - (d.val / 100) * (height - 30);
    return { x, y, day: d.day, val: d.val, label: d.label };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    // Bezier control curve
    const prev = points[idx - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y}`;
  }, '');

  const activeCoord = points.find(p => p.day === selectedDay) || points[2];

  return (
    <div
      className="p-5 rounded-3xl flex flex-col justify-between transition-all duration-300 shadow-xl border w-full relative overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)'
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
          Weekly Yield Wave
        </span>
        <button
          onClick={handleRefresh}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
          title="Refresh telemetry"
        >
          <RefreshCw size={13} className={isRotating ? 'animate-spin text-emerald-400' : ''} />
        </button>
      </div>

      {/* Sparkline Canvas Area */}
      <div className="relative w-full h-24 my-1">
        <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id="purpleBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#c084fc" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Highlighted vertical band for selected day (Matching reference purple column) */}
          <rect
            x={activeCoord.x - 14}
            y={activeCoord.y}
            width={28}
            height={height - activeCoord.y}
            rx={8}
            fill="url(#purpleBarGrad)"
            stroke="rgba(192, 132, 252, 0.4)"
            strokeWidth="1"
            className="transition-all duration-300"
          />

          {/* Sparkline curve stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Sparkline node points */}
          {points.map((pt) => {
            const isSelected = pt.day === selectedDay;
            return (
              <circle
                key={pt.day}
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? 5 : 3}
                fill={isSelected ? '#c084fc' : 'rgba(255, 255, 255, 0.5)'}
                filter={isSelected ? 'url(#glowFilter)' : undefined}
                className="transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedDay(pt.day)}
              />
            );
          })}
        </svg>

        {/* Floating Tooltip Pill (Matching "90kWh" in reference image) */}
        <div
          className="absolute -top-2 transform -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono text-white shadow-lg pointer-events-none transition-all duration-300"
          style={{
            left: `${(activeCoord.x / width) * 100}%`,
            background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
            boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)'
          }}
        >
          {activePoint.label}
        </div>
      </div>

      {/* Days Row: Mon Tue Wed Thu Fri Sat Sun */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
        {DEFAULT_DAYS.map((d) => {
          const isSelected = d.day === selectedDay;
          return (
            <button
              key={d.day}
              onClick={() => setSelectedDay(d.day)}
              className={`font-semibold transition-colors cursor-pointer ${
                isSelected
                  ? 'text-purple-300 font-bold underline underline-offset-4 decoration-purple-400'
                  : 'hover:text-slate-200'
              }`}
            >
              {d.day}
            </button>
          );
        })}
      </div>
    </div>
  );
};
