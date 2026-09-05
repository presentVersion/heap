import React from 'react';
import { Sun, Zap, Battery, Leaf, Boxes } from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

const fmt = (n: number, dec = 1) => n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const KPI = ({ icon: Icon, color, label, value, unit, delta, deltaUp }:
  { icon: any; color: string; label: string; value: string; unit: string; delta: string; deltaUp: boolean }) => (
  <div className="glass flex items-center gap-3.5 px-4 py-3 rounded-2xl" style={{ flex: '1 1 0', minWidth: 0 }}>
    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
      <Icon size={17} style={{ color }} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[10px] uppercase tracking-widest font-semibold truncate" style={{ color: 'var(--text-3)' }}>{label}</div>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <span className="text-[20px] font-bold leading-none mono" style={{ color: 'var(--text-1)' }}>{value}</span>
        <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>{unit}</span>
      </div>
      <div className="text-[10px] font-semibold mt-0.5" style={{ color: deltaUp ? 'var(--accent)' : 'var(--accent-rose)' }}>
        {deltaUp ? '↑' : '↓'} {delta}
      </div>
    </div>
  </div>
);

export const OverviewStatsBar: React.FC = () => {
  const { telemetry } = useSolTerraStore();

  return (
    <div className="flex gap-3" style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
      <KPI icon={Sun}   color="#f59e0b" label="Total Generation"  value={fmt(telemetry.totalGenerationMwh)} unit="MWh" delta="+12.4% vs yesterday" deltaUp />
      <KPI icon={Zap}   color="#06b6d4" label="Renewable Share"   value={fmt(telemetry.renewableSharePercent, 1)} unit="%" delta="+8.7%" deltaUp />
      <KPI icon={Zap}   color="#8b5cf6" label="Total Consumption" value={fmt(telemetry.totalConsumptionMwh)} unit="MWh" delta="+6.3% vs yesterday" deltaUp={false} />
      <KPI icon={Battery} color="#00f59b" label="Storage Level"   value={fmt(telemetry.storageLevelMwh)} unit="MWh" delta={`${telemetry.storageSocPercent?.toFixed(0) ?? 78}% capacity`} deltaUp />
      <KPI icon={Leaf}  color="#10b981" label="CO₂ Avoided"       value={fmt(telemetry.co2AvoidedTons)} unit="t" delta="+15.8% vs yesterday" deltaUp />
      <KPI icon={Boxes} color="#f43f5e" label="Active Assets"     value={String(telemetry.activeAssetsCount ?? 2172)} unit="" delta="92% online" deltaUp />
    </div>
  );
};
