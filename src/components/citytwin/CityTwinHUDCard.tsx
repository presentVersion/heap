import React from 'react';
import { X, Navigation, Sparkles, ShieldCheck, AlertTriangle, Zap, Layers } from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { SpeedometerGauge } from './SpeedometerGauge';
import { LiquidWaveGauge } from './LiquidWaveGauge';
import { SystemHealthTicks } from './SystemHealthTicks';

export const CityTwinHUDCard: React.FC = () => {
  const {
    selectedAsset,
    setSelectedAsset,
    setCameraFocus,
    telemetry,
    simulationConfig,
    setIsCopilotOpen
  } = useSolTerraStore();

  const totalGenKw = Math.round(telemetry?.energyFlow?.solarKw || (telemetry?.totalGenerationMwh ? telemetry.totalGenerationMwh * 35 : 1284));
  const cleanShare = telemetry?.renewableSharePercent ?? 88.5;
  const gridHealth = telemetry?.avgHealthScore ?? 94;
  const batterySoC = telemetry?.storageSocPercent ?? 82;

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. STATE B: ASSET IS SELECTED (Matching Reference Image 1: TX-4821-HX Card)
  // ─────────────────────────────────────────────────────────────────────────────
  if (selectedAsset) {
    const assetPower = selectedAsset.currentPowerKw ?? 24;
    const assetMaxPower = selectedAsset.capacityKw ?? Math.max(assetPower * 1.2, 50);
    const assetHealth = selectedAsset.health ?? 96;
    const isWarning = selectedAsset.status === 'warning' || assetHealth < 80;

    return (
      <div
        className="w-[calc(100vw-32px)] sm:w-[380px] md:w-[410px] max-w-[420px] p-5 rounded-3xl backdrop-blur-2xl border text-left shadow-2xl transition-all duration-300 animate-fadeIn"
        style={{
          background: 'linear-gradient(145deg, rgba(14, 18, 28, 0.92) 0%, rgba(9, 12, 20, 0.96) 100%)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.15)'
        }}
      >
        {/* Header Row: Asset ID, status pill, close button */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00f59b] animate-ping" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00f59b]">
                {selectedAsset.id}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  isWarning ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {selectedAsset.status}
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-heading mt-1 leading-snug">
              {selectedAsset.name}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {selectedAsset.zoneName ?? 'Kurnool Urban Zone'} · {selectedAsset.type.replace('_', ' ').toUpperCase()}
            </p>
          </div>

          <button
            onClick={() => setSelectedAsset(null)}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Close asset details (Return to city overview)"
          >
            <X size={14} />
          </button>
        </div>

        {/* Dual Gauges Row (Reference Image 1: Speedometer + Liquid Tank Circle) */}
        <div className="py-4 grid grid-cols-2 gap-4 items-center justify-items-center">
          <SpeedometerGauge
            value={assetPower}
            max={assetMaxPower}
            unit="kW"
            label="Active Gen"
            size={130}
          />
          <LiquidWaveGauge
            value={selectedAsset.efficiency ?? 92}
            label="Efficiency"
            unit="%"
            subValue={`Health: ${assetHealth}%`}
            size={130}
            color={isWarning ? 'amber' : 'emerald'}
          />
        </div>

        {/* System Health Segmented Ticks */}
        <SystemHealthTicks
          health={assetHealth}
          label="Asset Telemetry Health"
          subLabel={isWarning ? 'Performance variance detected' : 'Inverter and sensors fully synced'}
          className="mb-3"
        />

        {/* Alert / Diagnostic Banner (Reference Image 1: Required Break Banner) */}
        <div
          className={`p-3 rounded-2xl border flex items-center gap-2.5 mb-3 text-[11px] ${
            isWarning
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
              : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200'
          }`}
        >
          {isWarning ? <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" /> : <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0" />}
          <div className="truncate">
            <span className="font-bold">{isWarning ? 'Diagnostics Alert: ' : 'Status Nominal: '}</span>
            <span>{isWarning ? 'Thermal variance detected on heatsink' : 'Operating within peak efficiency envelope'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setCameraFocus(selectedAsset.coordinates)}
            className="flex-1 py-2 px-3 rounded-xl bg-[#00f59b]/15 hover:bg-[#00f59b]/25 border border-[#00f59b]/35 text-[#00f59b] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Navigation size={13} />
            <span>Focus 3D View</span>
          </button>
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles size={13} className="text-cyan-400" />
            <span>Copilot</span>
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. STATE A: BEFORE CLICKING AN ASSET (City-Wide Renewable Grid Overview)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="w-[calc(100vw-32px)] sm:w-[380px] md:w-[410px] max-w-[420px] p-5 rounded-3xl backdrop-blur-2xl border text-left shadow-2xl transition-all duration-300 animate-fadeIn"
      style={{
        background: 'linear-gradient(145deg, rgba(14, 18, 28, 0.92) 0%, rgba(9, 12, 20, 0.96) 100%)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.15)'
      }}
    >
      {/* Header Row: City Operations Title */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f59b] animate-ping" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00f59b]">
              LIVE DIGITAL TWIN
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/10 text-slate-300 font-mono">
              KURNOOL
            </span>
          </div>
          <h3 className="text-base font-bold text-white font-heading mt-1 leading-snug">
            Renewable City Grid Operations
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Real-time Telemetry & Microgrid Dispatch
          </p>
        </div>

        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00f59b]">
          <Zap size={16} />
        </div>
      </div>

      {/* Dual Gauges Row (Reference Image 1: Speedometer + Liquid Tank Circle) */}
      <div className="py-4 grid grid-cols-2 gap-4 items-center justify-items-center">
        <SpeedometerGauge
          value={totalGenKw}
          max={1600}
          unit="kW"
          label="Total Clean Power"
          size={130}
        />
        <LiquidWaveGauge
          value={batterySoC}
          label="Battery Reserve"
          unit="%"
          subValue="10 MWh BESS"
          size={130}
          color="amber"
        />
      </div>

      {/* System Health Segmented Ticks (Reference Image 2) */}
      <SystemHealthTicks
        health={gridHealth}
        label="City Smart Grid Stability"
        subLabel="All 12 microgrid nodes synced with Ultra Mega Solar Park"
        className="mb-3"
      />

      {/* Metric Highlights Strip */}
      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5">
          <div className="text-[9px] uppercase font-mono text-slate-400">Clean Share</div>
          <div className="text-sm font-bold font-mono text-[#00f59b] mt-0.5">{cleanShare}%</div>
        </div>
        <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5">
          <div className="text-[9px] uppercase font-mono text-slate-400">CO2 Avoided</div>
          <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5">142.5 T</div>
        </div>
        <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5">
          <div className="text-[9px] uppercase font-mono text-slate-400">Temp / Amb</div>
          <div className="text-sm font-bold font-mono text-amber-300 mt-0.5">{simulationConfig.ambientTemperature}°C</div>
        </div>
      </div>

      {/* Guidance Banner */}
      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-[11px] text-slate-300">
        <span className="flex items-center gap-1.5">
          <Layers size={13} className="text-[#00f59b]" />
          <span>Click any 3D model on map to inspect</span>
        </span>
        <span className="text-[9px] font-mono text-slate-500">12 Assets</span>
      </div>
    </div>
  );
};

export default CityTwinHUDCard;
