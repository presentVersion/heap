import React from 'react';
import { Sparkles } from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

const INSIGHTS = [
  "Solar generation is peaking above baseline. Optimal window to charge BESS storage 11:30 AM – 2:30 PM.",
  "EV charging demand forecast: +28% between 5–8 PM. Recommend pre-charging battery reserves now.",
  "Zone 05 renewable share at 87% — consider shifting rooftop solar surplus to Zone 04 grid.",
  "Current cloud cover at 24% — solar flower trackers are operating at optimal 87° elevation angle.",
];

export const AiInsightWidget: React.FC = () => {
  const { simulationConfig } = useSolTerraStore();
  const idx = Math.floor(simulationConfig.simulatedHour / 6) % INSIGHTS.length;

  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} style={{ color: 'var(--accent-purple)' }} />
          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-2)' }}>AI Insight</span>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,92,246,0.12)', color: 'var(--accent-purple)' }}>Live</span>
      </div>

      <p className="text-[11px] leading-relaxed flex-1" style={{ color: 'var(--text-2)' }}>
        {INSIGHTS[idx]}
      </p>

      <div className="flex gap-1 mt-auto">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-0.5 rounded-full flex-1 transition-all duration-500"
            style={{ background: i === idx ? 'var(--accent-purple)' : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
    </div>
  );
};
