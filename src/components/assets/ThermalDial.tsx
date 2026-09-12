import React, { useState } from 'react';
import { Snowflake, Sun, RefreshCw } from 'lucide-react';

interface ThermalDialProps {
  temperature?: number;
  label?: string;
  onModeChange?: (mode: 'cold' | 'heat' | 'auto') => void;
}

export const ThermalDial: React.FC<ThermalDialProps> = ({
  temperature = 28,
  label = 'Inverter Thermal Loop'
}) => {
  const [activeMode, setActiveMode] = useState<'cold' | 'heat' | 'auto'>('auto');
  const [temp, setTemp] = useState(temperature);

  return (
    <div
      className="p-5 rounded-3xl flex flex-col items-center justify-between transition-all duration-300 shadow-xl border"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)'
      }}
    >
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
          {label}
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {/* Circular Dial (Matching Reference Image 1) */}
      <div className="relative w-36 h-36 flex items-center justify-center my-2">
        {/* Rainbow/Multi-Color Ring Track */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="thermalRainbow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="30%" stopColor="#10b981" />
              <stop offset="65%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
          {/* Background subtle ring */}
          <circle
            cx="60"
            cy="60"
            r="48"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="8"
          />
          {/* Active Gradient Ring */}
          <circle
            cx="60"
            cy="60"
            r="48"
            fill="none"
            stroke="url(#thermalRainbow)"
            strokeWidth="8"
            strokeDasharray="301.6"
            strokeDashoffset="60"
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>

        {/* Center Temp Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
          <div className="text-3xl font-extrabold font-mono tracking-tight" style={{ color: 'var(--text-1)' }}>
            {temp}°C
          </div>
          <div className="text-[10px] font-medium tracking-wider uppercase" style={{ color: 'var(--text-3)' }}>
            Nominal
          </div>
        </div>
      </div>

      {/* Mode Buttons Row: Cold, Heat, Auto (Matching Reference Image 1) */}
      <div className="flex items-center gap-2 w-full mt-3">
        <button
          onClick={() => {
            setActiveMode('cold');
            setTemp(22);
          }}
          className={`flex-1 py-2 px-1 rounded-2xl text-[11px] font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer border ${
            activeMode === 'cold'
              ? 'bg-sky-500/20 text-sky-400 border-sky-500/40 shadow-md'
              : 'hover:bg-white/5 border-transparent'
          }`}
          style={{ color: activeMode === 'cold' ? '#38bdf8' : 'var(--text-2)' }}
        >
          <Snowflake size={14} />
          <span>Cold</span>
        </button>

        <button
          onClick={() => {
            setActiveMode('heat');
            setTemp(35);
          }}
          className={`flex-1 py-2 px-1 rounded-2xl text-[11px] font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer border ${
            activeMode === 'heat'
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-md'
              : 'hover:bg-white/5 border-transparent'
          }`}
          style={{ color: activeMode === 'heat' ? '#f59e0b' : 'var(--text-2)' }}
        >
          <Sun size={14} />
          <span>Heat</span>
        </button>

        <button
          onClick={() => {
            setActiveMode('auto');
            setTemp(28);
          }}
          className={`flex-1 py-2 px-1 rounded-2xl text-[11px] font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer border ${
            activeMode === 'auto'
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-md'
              : 'hover:bg-white/5 border-transparent'
          }`}
          style={{ color: activeMode === 'auto' ? '#10b981' : 'var(--text-2)' }}
        >
          <RefreshCw size={14} />
          <span>Auto</span>
        </button>
      </div>
    </div>
  );
};
