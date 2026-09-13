import React from 'react';
import { 
  Activity, 
  Zap, 
  Cpu 
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { SystemHealthTicks } from '../citytwin/SystemHealthTicks';
import { RadarTracker } from './RadarTracker';
import { EnergyTrendChart } from './EnergyTrendChart';

export const AnalyticsView: React.FC = () => {
  const { telemetry } = useSolTerraStore();

  const cleanShare = telemetry?.renewableSharePercent ?? 88.5;
  const gridHealth = telemetry?.avgHealthScore ?? 94;

  return (
    <div className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden pt-24 sm:pt-32 md:pt-36 pb-36 px-4 sm:px-6 md:px-10 lg:px-12 max-w-7xl mx-auto scroll-smooth select-none">
      
      {/* ── HERO SECTION: Sharp Square & Large Bold Typography ──────────────── */}
      <section className="mb-16 sm:mb-24 md:mb-32">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-emerald-500/30">
          <div className="max-w-4xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-[#00f59b] animate-ping" />
              <span className="text-sm font-mono font-bold tracking-widest uppercase text-[#00f59b]">
                TELEMETRY & SOLAR PARK GRID INTELLIGENCE
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading tracking-tight text-white leading-none">
              Telemetry & Analytics
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl text-emerald-300 font-semibold tracking-tight">
              Real-time solar irradiance tracking, directional power flow radar, and nodal synchronization.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="px-6 py-4 bg-emerald-950/80 border border-emerald-500/40 text-sm sm:text-base text-emerald-200 font-mono font-bold flex items-center gap-3 shadow-xl">
              <span className="w-3 h-3 bg-[#00f59b] animate-ping" />
              <span>Synced · 12 Digital Twin Sensor Hubs</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── KEY TELEMETRY INDICES ────────────────────────────────────────────── */}
      <section className="mb-16 sm:mb-24 md:mb-32">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-white">
            Real-Time Grid Telemetry Metrics
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bento-card p-8 sm:p-10 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
            <span className="text-sm uppercase font-mono font-bold text-emerald-400">Active Solar Flow</span>
            <div className="my-4">
              <div className="text-6xl sm:text-7xl font-black font-heading text-[#00f59b]">1,284 <span className="text-2xl font-normal text-emerald-400/70">kW</span></div>
              <div className="text-lg sm:text-xl text-white font-bold mt-2">Instantaneous Clean Output</div>
            </div>
            <span className="text-sm font-mono text-emerald-300">Harvesting Midday Peak Sun</span>
          </div>

          <div className="bento-card p-8 sm:p-10 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
            <span className="text-sm uppercase font-mono font-bold text-emerald-400">Autonomy Ratio</span>
            <div className="my-4">
              <div className="text-6xl sm:text-7xl font-black font-heading text-cyan-400">{cleanShare}%</div>
              <div className="text-lg sm:text-xl text-white font-bold mt-2">Self-Sufficient Renewable Share</div>
            </div>
            <span className="text-sm font-mono text-emerald-300">Semi-Autonomous Dispatch Mode</span>
          </div>

          <div className="bento-card p-8 sm:p-10 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
            <span className="text-sm uppercase font-mono font-bold text-emerald-400">Nodal Synchronicity</span>
            <div className="my-4">
              <div className="text-6xl sm:text-7xl font-black font-heading text-white">49.98 <span className="text-2xl font-normal text-slate-400">Hz</span></div>
              <div className="text-lg sm:text-xl text-white font-bold mt-2">Synchronous Busbar Frequency</div>
            </div>
            <span className="text-sm font-mono text-emerald-300">Zero Voltage Sag Detected</span>
          </div>

          <div className="bento-card p-8 sm:p-10 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
            <span className="text-sm uppercase font-mono font-bold text-emerald-400">Health Index</span>
            <div className="my-4">
              <div className="text-6xl sm:text-7xl font-black font-heading text-[#00f59b]">{gridHealth} <span className="text-2xl font-normal text-emerald-400/70">/100</span></div>
              <div className="text-lg sm:text-xl text-white font-bold mt-2">Composite System Health</div>
            </div>
            <span className="text-sm font-mono text-emerald-300">All 12 Microgrids Synced</span>
          </div>
        </div>
      </section>

      {/* ── BENTO TELEMETRY GRID ─────────────────────────────────────────────── */}
      <section className="mb-16 sm:mb-24 md:mb-32">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-white">
            Visual Grid Stress & Sensor Bento Grid
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-8">
          
          {/* Card 1: Directional Stress Radar (Span 8) */}
          <div 
            className="col-span-12 lg:col-span-8 bento-card p-8 sm:p-10 flex flex-col justify-between"
            style={{
              background: 'linear-gradient(180deg, rgba(8, 32, 19, 0.92) 0%, rgba(2, 12, 7, 0.98) 100%)',
              borderColor: 'rgba(16, 185, 129, 0.3)'
            }}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3 text-white font-bold font-heading text-2xl">
                <Activity size={24} className="text-[#00f59b]" />
                <span>Directional Grid Stress Radar</span>
              </div>
              <span className="px-4 py-1.5 text-xs font-mono font-bold bg-[#00f59b] text-slate-950 uppercase">
                Peak Window: 18:30 PM
              </span>
            </div>

            <div className="my-8 flex items-center justify-center">
              <RadarTracker />
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-base sm:text-lg text-white font-semibold">Main feeder flow dispatch operating at 7.66 MW synchronous phase.</span>
              <span className="text-sm font-mono text-[#00f59b] font-bold">STABLE PHASE</span>
            </div>
          </div>

          {/* Card 2: Solar Pyranometer Sensor (Span 4) */}
          <div 
            className="col-span-12 lg:col-span-4 bento-card flex flex-col justify-between"
            style={{
              background: 'linear-gradient(180deg, rgba(8, 32, 19, 0.92) 0%, rgba(2, 12, 7, 0.98) 100%)',
              borderColor: 'rgba(16, 185, 129, 0.3)'
            }}
          >
            <div className="relative w-full h-52 overflow-hidden">
              <img
                src="/images/solar/solar-close-7.jpg"
                alt="Solar Panel Sensors"
                className="w-full h-full object-cover filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020c07] via-transparent to-black/30" />
              <div className="absolute top-4 left-4">
                <span className="px-4 py-1.5 text-xs font-mono font-bold uppercase bg-emerald-500 text-slate-950">
                  SENSOR PV-210
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <h3 className="text-2xl font-black font-heading text-white">
                Rooftop Pyranometer
              </h3>
              <div className="text-base font-semibold text-emerald-100">
                Live 10 Hz telemetry tracking solar irradiance at 942 W/m².
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                <div className="p-3 bg-white/5 border border-white/10">
                  <div className="text-xs text-slate-300 font-mono">Latency</div>
                  <div className="text-lg font-black font-mono text-amber-400 mt-1">12 ms</div>
                </div>
                <div className="p-3 bg-white/5 border border-white/10">
                  <div className="text-xs text-slate-300 font-mono">Signal</div>
                  <div className="text-lg font-black font-mono text-[#00f59b] mt-1">99.8%</div>
                </div>
                <div className="p-3 bg-white/5 border border-white/10">
                  <div className="text-xs text-slate-300 font-mono">Drift</div>
                  <div className="text-lg font-black font-mono text-cyan-300 mt-1">&lt;0.1°</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: System Health Ticks (Span 6) */}
          <div 
            className="col-span-12 lg:col-span-6 bento-card flex flex-col justify-between"
            style={{
              background: 'linear-gradient(180deg, rgba(8, 32, 19, 0.92) 0%, rgba(2, 12, 7, 0.98) 100%)',
              borderColor: 'rgba(16, 185, 129, 0.3)'
            }}
          >
            <div className="relative w-full h-52 overflow-hidden">
              <img
                src="/images/solar/solar-aerial-1.jpg"
                alt="Solar Park"
                className="w-full h-full object-cover filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020c07] via-transparent to-black/30" />
              <div className="absolute top-4 left-4">
                <span className="px-4 py-1.5 text-xs font-mono font-bold uppercase bg-[#00f59b] text-slate-950">
                  HEALTH MONITOR
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black font-heading text-white">Operational Health Score</h3>
                <span className="text-2xl font-bold font-mono text-[#00f59b]">{gridHealth} / 100</span>
              </div>

              <SystemHealthTicks
                health={gridHealth}
                label="System Health Index"
                subLabel="Minor thermal variance in Sector 03 · Voltage self-stabilized via BESS reserve"
                totalTicks={32}
              />
            </div>
          </div>

          {/* Card 4: Battery Storage System (Span 6) */}
          <div 
            className="col-span-12 lg:col-span-6 bento-card flex flex-col justify-between"
            style={{
              background: 'linear-gradient(180deg, rgba(8, 32, 19, 0.92) 0%, rgba(2, 12, 7, 0.98) 100%)',
              borderColor: 'rgba(16, 185, 129, 0.3)'
            }}
          >
            <div className="relative w-full h-52 overflow-hidden">
              <img
                src="/images/solar/solar-storage-17.jpg"
                alt="Battery Storage System"
                className="w-full h-full object-cover filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020c07] via-transparent to-black/30" />
              <div className="absolute top-4 left-4">
                <span className="px-4 py-1.5 text-xs font-mono font-bold uppercase bg-cyan-400 text-slate-950">
                  10 MWH BESS SUBSTATION
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black font-heading text-white">LiFePO4 Storage Buffer</h3>
                <span className="text-2xl font-bold font-mono text-cyan-300">82% SoC</span>
              </div>

              <div className="text-base font-semibold text-emerald-100">
                Autonomous charging from surplus midday solar generation with zero curtailment loss.
              </div>

              <div className="pt-2 flex items-center justify-between text-sm font-mono text-emerald-300 font-bold">
                <span>Charge Rate: +140 kW Inflow</span>
                <span>Round-Trip Efficiency: 94.8%</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 24-HOUR GENERATION CURVE SECTION ─────────────────────────────────── */}
      <section className="mb-16">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-white">
            Diurnal Solar Generation & Municipal Load Trend
          </h2>
        </div>

        <div 
          className="bento-card p-6 sm:p-10"
          style={{
            background: 'linear-gradient(180deg, rgba(8, 32, 19, 0.92) 0%, rgba(2, 12, 7, 0.98) 100%)',
            borderColor: 'rgba(16, 185, 129, 0.3)'
          }}
        >
          <EnergyTrendChart />
        </div>
      </section>

    </div>
  );
};

export default AnalyticsView;
