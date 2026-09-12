import React, { useState } from 'react';
import { Zap, ChevronDown, X } from 'lucide-react';

interface DayData {
  day: string;
  dots: number; // 1 to 8
  value: number;
  highlight?: boolean;
  dateStr?: string;
  deltaStr?: string;
}

const WEEK_DATA: DayData[] = [
  { day: 'Mon', dots: 4, value: 18.2 },
  { day: 'Tue', dots: 6, value: 22.4 },
  { day: 'Wed', dots: 5, value: 20.1 },
  { day: 'Thu', dots: 8, value: 27.8, highlight: true, dateStr: '17 July', deltaStr: '+5.31%' },
  { day: 'Fri', dots: 4, value: 17.5 },
  { day: 'Sat', dots: 3, value: 14.2 },
  { day: 'Sun', dots: 5, value: 19.8 },
];

export const EnergyTrendChart: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<DayData>(WEEK_DATA[3]);

  return (
    <div
      className="p-6 md:p-8 rounded-3xl backdrop-blur-2xl border text-left shadow-2xl relative select-none"
      style={{
        background: 'linear-gradient(145deg, rgba(14, 18, 28, 0.85) 0%, rgba(9, 12, 20, 0.95) 100%)',
        borderColor: 'rgba(255, 255, 255, 0.08)'
      }}
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Zap size={15} className="text-[#f59e0b]" />
            <span>Energy Output Trend</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl md:text-4xl font-extrabold font-mono text-white tracking-tight">
              {selectedDay.value}
            </span>
            <span className="text-sm font-medium text-slate-400">kWh of clean energy</span>
          </div>
        </div>

        {/* Date Filter Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 shadow-md">
          <span>08-12 Apr</span>
          <ChevronDown size={13} className="text-slate-400" />
          <X size={12} className="text-slate-500 hover:text-white cursor-pointer ml-1" />
        </div>
      </div>

      {/* Dotted Bar Chart Stage */}
      <div className="relative pt-12 pb-4">
        {/* Floating Tooltip Pill (Positioned above Thursday / Selected Day) */}
        <div
          className="absolute top-0 z-20 transition-all duration-300 pointer-events-none"
          style={{
            left: '48%',
            transform: 'translateX(-50%)'
          }}
        >
          <div className="px-3 py-2 rounded-xl bg-white text-slate-900 shadow-[0_10px_25px_rgba(0,0,0,0.5)] border border-slate-200 text-left animate-fadeIn">
            <div className="text-[10px] text-slate-500 font-mono">{selectedDay.dateStr || 'Today'}</div>
            <div className="text-xs font-extrabold text-slate-900 font-mono">
              {selectedDay.value} kWh today
            </div>
            <div className="text-[9px] font-bold text-emerald-600 font-mono">
              {selectedDay.deltaStr || '+5.31%'}
            </div>
          </div>
        </div>

        {/* 7-Day Dotted Bar Columns */}
        <div className="grid grid-cols-7 gap-2 md:gap-6 items-end h-36">
          {WEEK_DATA.map((col, idx) => {
            const isHighlight = col.highlight || col.day === selectedDay.day;
            const dotCount = col.dots;

            return (
              <div
                key={col.day}
                onClick={() => setSelectedDay(col)}
                className="flex flex-col items-center gap-1.5 cursor-pointer group/col"
              >
                {/* Vertical Stack of Rounded Dots / Pills */}
                <div className="flex flex-col-reverse items-center gap-1.5 w-full">
                  {Array.from({ length: 8 }).map((_, dotIdx) => {
                    const isDotActive = dotIdx < dotCount;

                    return (
                      <div
                        key={dotIdx}
                        className="w-2.5 md:w-3.5 h-2 rounded-full transition-all duration-300"
                        style={{
                          background: !isDotActive
                            ? 'transparent'
                            : isHighlight
                            ? '#f59e0b'
                            : 'rgba(255, 255, 255, 0.25)',
                          boxShadow: isHighlight && isDotActive ? '0 0 8px rgba(245, 158, 11, 0.6)' : 'none'
                        }}
                      />
                    );
                  })}
                </div>

                {/* Day Label */}
                <span
                  className={`text-xs font-mono tracking-wider mt-2 transition-colors ${
                    isHighlight ? 'text-[#f59e0b] font-bold' : 'text-slate-500 group-hover/col:text-slate-300'
                  }`}
                >
                  {col.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EnergyTrendChart;
