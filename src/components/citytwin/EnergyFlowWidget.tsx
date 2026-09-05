import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

const Node = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
      <div className="w-2 h-2 rounded-full pulse-soft" style={{ background: color }} />
    </div>
    <div className="text-[9px] uppercase tracking-wider font-semibold text-center" style={{ color: 'var(--text-3)' }}>{label}</div>
    <div className="text-[11px] font-bold mono" style={{ color }}>{value}</div>
  </div>
);

const Flow = ({ color }: { color: string }) => (
  <div className="flex items-center" style={{ flex: 1 }}>
    <div className="h-px flex-1 relative overflow-hidden" style={{ background: `${color}25` }}>
      <div className="absolute inset-0 shimmer" style={{ '--shimmer-color': color } as any} />
    </div>
    <ArrowRight size={10} style={{ color, flexShrink: 0 }} />
  </div>
);

export const EnergyFlowWidget: React.FC = () => {
  const { telemetry } = useSolTerraStore();
  const gen  = telemetry.totalGenerationMwh;
  const stor = telemetry.storageLevelMwh;
  const cons = telemetry.totalConsumptionMwh;

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-2)' }}>Energy Flow</span>
        <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(0,245,155,0.1)', color: 'var(--accent)' }}>Live</span>
      </div>
      <div className="flex items-center gap-1">
        <Node label="Solar"    value={`${gen.toFixed(0)}`}  color="#f59e0b" />
        <Flow color="#f59e0b" />
        <Node label="Battery"  value={`${stor.toFixed(0)}`} color="#00f59b" />
        <Flow color="#00f59b" />
        <Node label="City"     value={`${cons.toFixed(0)}`} color="#06b6d4" />
        <Flow color="#06b6d4" />
        <Node label="Grid"     value="18.7"                  color="#8b5cf6" />
      </div>
    </div>
  );
};
