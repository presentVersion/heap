import React from 'react';
import { 
  ArrowUpRight, 
  Maximize2, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Radio, 
  Activity, 
  Zap, 
  Cpu
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { SpeedometerGauge } from '../citytwin/SpeedometerGauge';
import { SystemHealthTicks } from '../citytwin/SystemHealthTicks';
import { RadarTracker } from './RadarTracker';
import { EnergyTrendChart } from './EnergyTrendChart';

export const AnalyticsView: React.FC = () => {
  const { telemetry } = useSolTerraStore();

  const cleanShare = telemetry?.renewableSharePercent ?? 76;
  const gridHealth = telemetry?.avgHealthScore ?? 78;

  return (
    <div className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-48 px-4 sm:px-8 md:px-14 lg:px-20 max-w-7xl mx-auto scroll-smooth select-none transition-colors duration-300">
      
      {/* ── SECTION 1: HERO HEADER ───────────────────────────────────────────── */}
      <section className="mb-32 md:mb-44 lg:mb-52">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/5">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400">
                TELEMETRY INTELLIGENCE · ORBIT & GRID
              </span>
            </div>

            <h1 
              className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight leading-[1.1]" 
              style={{ color: 'var(--text-1)' }}
            >
              Telemetry & Analytics
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal mt-5 leading-relaxed">
              Autonomous grid stability analytics, distributed generation performance telemetry, real-time nodal synchronization, and municipal energy abatement indices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-emerald-300 font-mono font-semibold shadow-md flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Synchronized · 12 Digital Twin Nodes</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: GRID AUTONOMY & SYSTEM HEALTH ─────────────────────────── */}
      <section className="mb-32 md:mb-44 lg:mb-52">
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              SECTION 02 · AUTONOMY & SYSTEM HEALTH
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight" style={{ color: 'var(--text-1)' }}>
            Grid Autonomy & Operational Resilience
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-normal">
            Real-time renewable clean energy penetration ratio and automated voltage stability diagnostics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {/* Card 1: Autonomy Level */}
          <div
            className="p-7 sm:p-9 md:p-12 rounded-[36px] border shadow-2xl flex flex-col justify-between select-none relative overflow-hidden group"
            style={{
              background: 'linear-gradient(145deg, rgba(14, 18, 28, 0.85) 0%, rgba(9, 12, 20, 0.95) 100%)',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <Sparkles size={18} className="text-[#00f59b]" />
                <span className="text-base sm:text-lg font-bold font-heading tracking-wide text-white">
                  Grid Autonomy Ratio
                </span>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                Self-Sustaining
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-5xl sm:text-6xl md:text-7xl font-black font-mono text-white tracking-tight mb-3">
                {cleanShare}%
              </div>
              <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs sm:text-sm text-slate-200 font-medium mb-8">
                Semi-autonomous dispatch mode
              </div>

              {/* Glowing Curved Arc Meter */}
              <div className="w-56 h-30 overflow-hidden relative flex items-center justify-center -mb-4">
                <div
                  className="w-52 h-52 rounded-full border-[14px] border-transparent"
                  style={{
                    borderTopColor: '#00f59b',
                    borderRightColor: '#06b6d4',
                    borderLeftColor: '#f59e0b',
                    boxShadow: '0 0 35px rgba(0, 245, 155, 0.45)',
                    transform: 'rotate(-45deg)'
                  }}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 text-xs sm:text-sm text-slate-400 text-center">
              Targeting 90% clean autonomous self-reliance by 2028
            </div>
          </div>

          {/* Card 2: System Health Ticks */}
          <div
            className="p-7 sm:p-9 md:p-12 rounded-[36px] border shadow-2xl flex flex-col justify-between select-none"
            style={{
              background: 'linear-gradient(145deg, rgba(14, 18, 28, 0.85) 0%, rgba(9, 12, 20, 0.95) 100%)',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-cyan-400" />
                <span className="text-base sm:text-lg font-bold font-heading tracking-wide text-white">
                  Operational Health Score
                </span>
              </div>
              <span className="text-xl font-mono font-bold text-emerald-400">
                {gridHealth} / 100
              </span>
            </div>

            <div className="my-8">
              <SystemHealthTicks
                health={gridHealth}
                label="System Health Index"
                subLabel="Minor thermal deviation in Zone 03 · Voltage self-stabilized via BESS reserve"
                totalTicks={32}
              />
            </div>

            <div className="pt-6 border-t border-white/5 text-xs sm:text-sm text-slate-400 flex items-center justify-between">
              <span>All 12 microgrids connected</span>
              <span className="text-emerald-400 font-bold">Optimal state</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: RADAR STRESS & SENSOR TELEMETRY FEED ──────────────────── */}
      <section className="mb-32 md:mb-44 lg:mb-52">
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              SECTION 03 · STRESS RADAR & TELEMETRY STREAM
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight" style={{ color: 'var(--text-1)' }}>
            Grid Stress Radar & Sensor Telemetry Feed
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-normal">
            Directional power flow vectors, sensor latency streams, and signal stability tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {/* Card 3: Radar Tracker */}
          <div 
            className="p-7 sm:p-9 md:p-12 rounded-[36px] border shadow-2xl flex flex-col justify-between"
            style={{
              background: 'linear-gradient(145deg, rgba(14, 18, 28, 0.85) 0%, rgba(9, 12, 20, 0.95) 100%)',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <Activity size={18} className="text-cyan-400" />
                <span className="text-base sm:text-lg font-bold font-heading text-white">Directional Stress Radar</span>
              </div>
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Peak Window: 18:30
              </span>
            </div>

            <div className="my-8 flex items-center justify-center">
              <RadarTracker />
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs sm:text-sm font-mono text-slate-400">
              <span>Main Feeder Flow: 7.66 MW</span>
              <span className="text-emerald-400 font-bold">Stable Synchronous Phase</span>
            </div>
          </div>

          {/* Card 4: Bracketed Telemetry Feed */}
          <div
            className="p-7 sm:p-9 md:p-12 rounded-[36px] border shadow-2xl flex flex-col justify-between select-none"
            style={{
              background: 'linear-gradient(145deg, rgba(14, 18, 28, 0.85) 0%, rgba(9, 12, 20, 0.95) 100%)',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <Cpu size={18} className="text-cyan-400" />
                <span className="text-base sm:text-lg font-bold font-heading text-white">
                  Real-Time Sensor Telemetry
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">Live 10 Hz Stream</span>
            </div>

            {/* Bracketed 3D Model Stage */}
            <div className="relative w-full h-52 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center my-6 overflow-hidden">
              <div className="absolute top-3 left-3 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-3 right-3 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-400" />

              <div className="relative flex flex-col items-center justify-center animate-pulse">
                <div className="w-18 h-18 rounded-2xl border border-cyan-400/50 bg-cyan-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                  <Activity size={36} className="text-cyan-300" />
                </div>
                <span className="text-xs font-mono text-cyan-200 mt-3 tracking-wider font-semibold">
                  PV-210 KURNOOL SOLAR ARRAY SENSOR
                </span>
              </div>
            </div>

            {/* Metrics Strip */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5 text-center">
              <div>
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                  <span>Latency</span>
                </div>
                <div className="text-base font-bold font-mono text-white mt-1">120 ms</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-[#00f59b]" />
                  <span>Signal</span>
                </div>
                <div className="text-base font-bold font-mono text-white mt-1">45%</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-[#f43f5e]" />
                  <span>Drift</span>
                </div>
                <div className="text-base font-bold font-mono text-white mt-1">+2.3°</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: ENERGY OUTPUT & LOAD TREND ────────────────────────────── */}
      <section className="mb-24">
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              SECTION 04 · GENERATION & DEMAND CURVE
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight" style={{ color: 'var(--text-1)' }}>
            24-Hour Energy Generation & Consumption Curve
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-normal">
            Aggregate generation across solar, wind, BESS discharge, and municipal load draw.
          </p>
        </div>

        <div 
          className="p-6 sm:p-9 md:p-12 rounded-[36px] border shadow-2xl"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <EnergyTrendChart />
        </div>
      </section>

    </div>
  );
};

export default AnalyticsView;
