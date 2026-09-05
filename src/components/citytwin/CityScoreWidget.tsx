import React from 'react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

export const CityScoreWidget: React.FC = () => {
  const { telemetry } = useSolTerraStore();
  const score = telemetry.cityScore ?? 87;
  const pct   = (score / 100) * 251.2; // circumference of r=40

  return (
    <div className="glass rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
      <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-2)' }}>City Score</div>

      {/* SVG ring gauge */}
      <div className="relative" style={{ width: 72, height: 72 }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx="50" cy="50" r="40" fill="none" strokeWidth="8"
            stroke="rgba(255,255,255,0.06)" />
          {/* Progress */}
          <circle cx="50" cy="50" r="40" fill="none" strokeWidth="8"
            stroke="var(--accent)"
            strokeLinecap="round"
            strokeDasharray={`${pct} 251.2`}
            style={{ filter: 'drop-shadow(0 0 6px var(--accent))' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[22px] font-bold leading-none mono" style={{ color: 'var(--text-1)' }}>{score}</span>
          <span className="text-[9px] font-semibold" style={{ color: 'var(--accent)' }}>/100</span>
        </div>
      </div>

      <div className="text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>
        {score >= 90 ? '🌿 Excellent' : score >= 75 ? '✅ Sustainable' : '⚠ Improving'}
      </div>
    </div>
  );
};
