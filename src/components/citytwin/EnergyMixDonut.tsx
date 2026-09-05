import React from 'react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

const SLICES = [
  { label: 'Solar',   pct: 62, color: '#f59e0b' },
  { label: 'Biomass', pct: 14, color: '#10b981' },
  { label: 'Wind',    pct:  9, color: '#38bdf8' },
  { label: 'Hydro',   pct:  6, color: '#06b6d4' },
  { label: 'Grid',    pct:  9, color: '#8b5cf6' },
];

// Simple CSS conic-gradient donut
function buildConic(slices: typeof SLICES) {
  let deg = 0;
  return slices.map(s => {
    const start = deg;
    deg += (s.pct / 100) * 360;
    return `${s.color} ${start}deg ${deg}deg`;
  }).join(', ');
}

export const EnergyMixDonut: React.FC = () => {
  const { telemetry } = useSolTerraStore();

  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-2)' }}>Energy Mix</div>
      <div className="flex items-center gap-3">
        {/* Donut */}
        <div className="relative flex-shrink-0" style={{ width: 64, height: 64 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: `conic-gradient(${buildConic(SLICES)})`,
          }} />
          {/* Hole */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-card, #0c101c)' }}>
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[9px] font-bold mono" style={{ color: 'var(--accent)' }}>
                  {telemetry.totalGenerationMwh.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Legend */}
        <div className="flex flex-col gap-0.5">
          {SLICES.map(s => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
              <span className="text-[10px]" style={{ color: 'var(--text-2)' }}>{s.label}</span>
              <span className="text-[10px] font-semibold mono ml-auto" style={{ color: 'var(--text-1)' }}>{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
