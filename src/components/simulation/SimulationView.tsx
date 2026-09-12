import React, { useState } from 'react';
import { 
  Activity, 
  Play, 
  Pause,
  Calendar, 
  CloudSun, 
  Sliders, 
  ShieldAlert, 
  TrendingDown, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  Check, 
  Send,
  Eye,
  ArrowUpRight,
  Sun,
  Wind,
  CloudRain,
  Zap,
  Maximize2,
  RefreshCw
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { SpeedometerGauge } from '../citytwin/SpeedometerGauge';
import { SystemHealthTicks } from '../citytwin/SystemHealthTicks';
import { RadarTracker } from '../analytics/RadarTracker';
import { EnergyTrendChart } from '../analytics/EnergyTrendChart';

export const SimulationView: React.FC = () => {
  const { 
    simulationConfig, 
    setSimulatedHour, 
    setWeatherScenario, 
    setUrbanGrowth, 
    toggleGridConstraint,
    scenario,
    toggleScenarioActive,
    setActivePage,
    setIsCopilotOpen,
    telemetry
  } = useSolTerraStore();

  const [isRunningSim, setIsRunningSim] = useState(false);

  const handleRunSimulation = () => {
    setIsRunningSim(true);
    setTimeout(() => {
      toggleScenarioActive();
      setIsRunningSim(false);
    }, 800);
  };

  const fmtHour = (h: number) => {
    const m = Math.floor(h * 60);
    const hh = Math.floor(m / 60) % 24;
    const mm = m % 60;
    return `${hh % 12 || 12}:${mm.toString().padStart(2, '0')} ${hh >= 12 ? 'PM' : 'AM'}`;
  };

  const weatherOptions: { id: any; label: string; icon: any; temp: number; cloud: string }[] = [
    { id: 'optimistic', label: 'Solar Peak', icon: Sun, temp: 36, cloud: '5%' },
    { id: 'average', label: 'Normal Clear', icon: CloudSun, temp: 28, cloud: '24%' },
    { id: 'pessimistic', label: 'Monsoon Overcast', icon: CloudRain, temp: 22, cloud: '85%' },
  ];

  return (
    <div className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-48 px-4 sm:px-8 md:px-14 lg:px-20 max-w-7xl mx-auto scroll-smooth select-none transition-colors duration-300">
      
      {/* ── SECTION 1: HERO & SCENARIO EXECUTION ─────────────────────────────── */}
      <section className="mb-32 md:mb-44 lg:mb-52">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/5">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-400">
                PHYSICS & DEMAND SIMULATOR · MODEL V2.6
              </span>
            </div>

            <h1 
              className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight leading-[1.1]" 
              style={{ color: 'var(--text-1)' }}
            >
              Simulation Scenario Builder
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal mt-5 leading-relaxed">
              Model future diurnal solar curves, monsoon cloud cover, 2028 urban population expansion, and microgrid dispatch constraints across Kurnool's twin grid.
            </p>
          </div>

          {/* Action Controls (Mobile Friendly Stack) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            {scenario.isActive && (
              <button
                onClick={() => setActivePage('citytwin')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-cyan-300 text-xs font-bold transition-all shadow-lg cursor-pointer"
              >
                <Eye size={15} />
                <span>View Proposed on Map</span>
              </button>
            )}

            <button
              onClick={handleRunSimulation}
              disabled={isRunningSim}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer hover:scale-105"
              style={{
                background: scenario.isActive 
                  ? 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' 
                  : 'linear-gradient(135deg, #00f59b 0%, #06b6d4 100%)',
                color: '#07080f',
                boxShadow: scenario.isActive 
                  ? '0 8px 24px rgba(245, 158, 11, 0.35)' 
                  : '0 8px 24px rgba(0, 245, 155, 0.35)'
              }}
            >
              {isRunningSim ? (
                <RefreshCw size={15} className="animate-spin" />
              ) : (
                <Play size={15} className="fill-current" />
              )}
              <span>{isRunningSim ? 'Simulating Physics...' : scenario.isActive ? 'Reset Baseline' : 'Execute Scenario'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: 24-HOUR DIURNAL TIME CYCLE ────────────────────────────── */}
      <section className="mb-32 md:mb-44 lg:mb-52">
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              SECTION 02 · DIURNAL SOLAR CYCLE
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight" style={{ color: 'var(--text-1)' }}>
            Simulated Hour & Target Horizon
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-normal">
            Adjust the slider to simulate solar irradiance, evening peak demand spike, and battery storage cycling.
          </p>
        </div>

        <div 
          className="p-7 sm:p-9 md:p-12 rounded-[36px] border shadow-2xl transition-all"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Selected Simulation Time
            </span>
            <span className="px-5 py-2 rounded-full text-base font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {fmtHour(simulationConfig.simulatedHour)}
            </span>
          </div>

          <div className="space-y-5">
            <input
              type="range"
              min="0"
              max="24"
              step="0.25"
              value={simulationConfig.simulatedHour}
              onChange={(e) => setSimulatedHour(parseFloat(e.target.value))}
              className="w-full h-4 rounded-lg appearance-none cursor-pointer accent-emerald-400 bg-white/10"
            />
            <div className="flex justify-between text-xs font-mono text-slate-400 pt-2">
              <span>00:00 (Midnight)</span>
              <span className="hidden sm:inline">06:00 (Dawn)</span>
              <span>12:00 (Zenith)</span>
              <span className="hidden sm:inline">18:00 (Evening)</span>
              <span>24:00</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: WEATHER & ATMOSPHERIC SCENARIOS ───────────────────────── */}
      <section className="mb-32 md:mb-44 lg:mb-52">
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              SECTION 03 · CLIMATE & WEATHER CONDITIONS
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight" style={{ color: 'var(--text-1)' }}>
            Atmospheric & Meteorological Scenarios
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-normal">
            Test photovoltaic yields under clear skies, high ambient heat, or heavy monsoon rainstorms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {weatherOptions.map(w => {
            const Icon = w.icon;
            const isSelected = simulationConfig.weatherScenario === w.id;
            return (
              <button
                key={w.id}
                onClick={() => setWeatherScenario(w.id as any)}
                className={`p-7 sm:p-9 rounded-[32px] border text-left transition-all duration-300 cursor-pointer shadow-xl ${
                  isSelected
                    ? 'bg-white/10 border-emerald-400/50 shadow-emerald-500/10'
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Icon size={24} className={isSelected ? 'text-emerald-400' : 'text-slate-400'} />
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-400">{w.temp}°C</span>
                </div>
                <div className="text-lg sm:text-xl font-bold font-heading" style={{ color: isSelected ? 'var(--text-1)' : 'var(--text-2)' }}>
                  {w.label}
                </div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1.5">
                  Cloud Cover: <strong className="text-slate-200">{w.cloud}</strong>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── SECTION 4: MICROGRID DISPATCH & URBAN GROWTH ──────────────────────── */}
      <section className="mb-32 md:mb-44 lg:mb-52">
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              SECTION 04 · DISPATCH LOGIC & URBAN GROWTH
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight" style={{ color: 'var(--text-1)' }}>
            Grid Constraints & Population Expansion
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-normal">
            Configure automated islanding triggers, battery peak shaving rules, and zone-by-zone urban growth projections by 2028.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {/* Microgrid Dispatch Constraints */}
          <div 
            className="p-7 sm:p-9 md:p-10 rounded-[36px] border shadow-xl flex flex-col justify-between"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-6">
              Microgrid Dispatch Constraints
            </div>

            <div className="space-y-4">
              {[
                { 
                  key: 'microgridIslanding', 
                  title: 'Microgrid Islanding', 
                  desc: 'Autonomous disconnection during high grid vulnerability' 
                },
                { 
                  key: 'peakShaving', 
                  title: 'BESS Peak Shaving', 
                  desc: 'Discharge battery storage during 18:00 - 22:00 peak spike' 
                },
                { 
                  key: 'curtailmentPrevention', 
                  title: 'Curtailment Prevention', 
                  desc: 'Route excess solar power to EV depots & hydrogen tanks' 
                }
              ].map(c => {
                const isOn = Boolean(simulationConfig.gridConstraints[c.key as keyof typeof simulationConfig.gridConstraints]);
                return (
                  <div
                    key={c.key}
                    onClick={() => toggleGridConstraint(c.key as any)}
                    className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between cursor-pointer hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="pr-4">
                      <div className="text-sm sm:text-base font-bold text-slate-100">
                        {c.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {c.desc}
                      </div>
                    </div>

                    <div className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 flex items-center flex-shrink-0 ${
                      isOn ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-slate-700'
                    }`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                        isOn ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Urban Growth by 2028 */}
          <div 
            className="p-7 sm:p-9 md:p-10 rounded-[36px] border shadow-xl flex flex-col justify-between"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-6">
              Projected Urban Growth by 2028
            </div>

            <div className="space-y-6">
              {Object.entries(simulationConfig.urbanGrowth).map(([zone, val]) => (
                <div key={zone} className="space-y-2.5">
                  <div className="flex justify-between text-xs sm:text-sm font-mono">
                    <span className="text-slate-300 font-medium">{zone}</span>
                    <span className="text-cyan-400 font-bold">+{val}% Demand</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={val}
                    onChange={(e) => setUrbanGrowth(zone, parseFloat(e.target.value))}
                    className="w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-cyan-400 bg-white/10"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: SIMULATED IMPACT & TELEMETRY GAUGES ──────────────────── */}
      <section className="mb-32 md:mb-44 lg:mb-52">
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              SECTION 05 · SIMULATED GAUGES & GRID STRESS
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight" style={{ color: 'var(--text-1)' }}>
            Grid Autonomy & Stress Analytics
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-normal">
            Real-time simulated telemetry output, autonomy percentage, and directional radar load.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Autonomy Level */}
          <div 
            className="p-7 sm:p-8 rounded-[32px] border shadow-xl flex flex-col justify-between"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Sparkles size={16} className="text-emerald-400" />
                <span>Autonomy Level</span>
              </div>
            </div>
            <div className="my-3">
              <SpeedometerGauge
                value={scenario.isActive ? scenario.projectedRenewableShare : telemetry.renewableSharePercent}
                max={100}
                unit="%"
                label="Grid Autonomy"
                color="#00f59b"
              />
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs font-mono text-emerald-400 mt-2">
              {scenario.isActive ? 'Target: 93.8% Clean by 2028' : 'Current: 74.2% Self-Reliance'}
            </div>
          </div>

          {/* Radar Stress Tracker */}
          <div 
            className="p-7 sm:p-8 rounded-[32px] border shadow-xl flex flex-col justify-between"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Activity size={16} className="text-cyan-400" />
                <span>Grid Stress Radar</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Peak 18:30
              </span>
            </div>
            <div className="my-3 flex items-center justify-center">
              <RadarTracker />
            </div>
            <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-white/5 text-slate-400">
              <span>Flow: 7.66 MW</span>
              <span className="text-emerald-400 font-bold">Stable</span>
            </div>
          </div>

          {/* Simulated Telemetry Bracket Box */}
          <div 
            className="p-7 sm:p-8 rounded-[32px] border shadow-xl flex flex-col justify-between"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Activity size={16} className="text-amber-400" />
                <span>Simulated Telemetry</span>
              </div>
              <Maximize2 size={14} className="text-slate-400" />
            </div>
            <div className="my-3 h-28 rounded-2xl bg-white/[0.02] border border-white/5 relative flex items-center justify-center p-3">
              <span className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-emerald-400" />
              <span className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-emerald-400" />
              <span className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-emerald-400" />
              <span className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-emerald-400" />
              <div className="text-center">
                <div className="text-sm font-mono font-bold text-emerald-400">
                  {telemetry.totalGenerationMwh.toFixed(1)} MWh Output
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  Demand: {telemetry.totalConsumptionMwh.toFixed(1)} MWh
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5 text-center text-xs font-mono text-slate-400">
              <div>Stability: <strong className="text-emerald-400">99.2%</strong></div>
              <div>Freq: <strong className="text-cyan-400">+0.02 Hz</strong></div>
            </div>
          </div>

          {/* System Health Segmented Bar */}
          <div 
            className="p-7 sm:p-8 rounded-[32px] border shadow-xl flex flex-col justify-between"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <ShieldAlert size={16} className="text-emerald-400" />
                <span>System Health</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {telemetry.avgHealthScore}%
              </span>
            </div>
            <div className="my-3">
              <SystemHealthTicks health={telemetry.avgHealthScore} />
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-slate-400">
              Zero active critical faults
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: DYNAMIC ENERGY GENERATION & DEMAND CHART ──────────────── */}
      <section className="mb-24">
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              SECTION 06 · ENERGY DISPATCH & CURVE FORECAST
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight" style={{ color: 'var(--text-1)' }}>
            24-Hour Generation vs. Demand Curve
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-normal">
            Continuous model comparing solar peak generation against municipal grid demand and battery charge cycles.
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

export default SimulationView;
