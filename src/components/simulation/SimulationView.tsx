import React, { useState } from 'react';
import { 
  Activity, 
  Play, 
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
  Eye
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

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
    setIsCopilotOpen
  } = useSolTerraStore();

  const [copilotInput, setCopilotInput] = useState('');
  const [isRunningSim, setIsRunningSim] = useState(false);

  const handleRunSimulation = () => {
    setIsRunningSim(true);
    setTimeout(() => {
      toggleScenarioActive();
      setIsRunningSim(false);
    }, 900);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 md:p-6 space-y-5 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl md:text-2xl font-bold text-white font-heading tracking-tight">
              Simulation Scenario Builder
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono-telemetry border ${
              scenario.isActive 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}>
              {scenario.isActive ? 'Active Scenario' : 'Baseline Mode'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Model future weather, population growth, and grid microgrid constraints.
          </p>
        </div>

        {/* View Proposed on Map Button */}
        {scenario.isActive && (
          <button
            onClick={() => setActivePage('citytwin')}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <Eye size={14} />
            <span>View Proposed Assets on Map</span>
          </button>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Configure Simulation Scenario */}
        <div className="space-y-4">
          <div className="glass-panel p-5 border border-white/10 shadow-xl space-y-5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Sliders size={15} className="text-emerald-400" />
              <span>Configure Simulation Scenario</span>
            </h2>

            {/* Time Horizon Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Time Horizon</span>
                <span className="text-[11px] font-mono-telemetry text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  Target: {scenario.targetDate}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="0.5"
                value={simulationConfig.simulatedHour}
                onChange={(e) => setSimulatedHour(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] font-mono-telemetry text-slate-500">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>24:00</span>
              </div>
            </div>

            {/* Weather Scenario Options with Curve */}
            <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Weather Scenario</span>
                <span className="text-[11px] text-slate-400">Cloud Cover %</span>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'optimistic', label: 'Optimistic: 300+ sunny days', desc: 'Minimal cloud cover, peak solar PV yield' },
                  { id: 'average', label: 'Average (Historical Baseline)', desc: 'Standard Kurnool semi-arid climate' },
                  { id: 'pessimistic', label: 'Pessimistic: Increased Storms', desc: 'High cloud cover, monsoonal fluctuations' },
                ].map(w => (
                  <label
                    key={w.id}
                    className={`flex items-start space-x-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      simulationConfig.weatherScenario === w.id
                        ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-[0_0_10px_rgba(0,245,155,0.1)]'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.05]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="weather"
                      checked={simulationConfig.weatherScenario === w.id}
                      onChange={() => setWeatherScenario(w.id as any)}
                      className="mt-0.5 accent-emerald-400"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{w.label}</div>
                      <div className="text-[11px] text-slate-500">{w.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Urban Growth Population Density Sliders */}
            <div className="space-y-3 pt-2 border-t border-white/[0.06]">
              <div className="text-xs font-semibold text-slate-300">Urban Growth Projection (Density)</div>
              
              {Object.entries(simulationConfig.urbanGrowth).map(([zone, val]) => (
                <div key={zone} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">{zone} Density Factor</span>
                    <span className="font-mono-telemetry text-emerald-400 font-bold">{val}k / km²</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="30"
                    step="0.5"
                    value={val}
                    onChange={(e) => setUrbanGrowth(zone, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                </div>
              ))}
            </div>

            {/* Grid Constraint Simulation Switches */}
            <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
              <div className="text-xs font-semibold text-slate-300">Grid Constraint Simulation</div>
              
              <div className="space-y-2">
                {[
                  { id: 'microgridIslanding' as const, label: 'Microgrid Islanding Test', desc: 'Simulate 100% autonomous operation isolated from regional grid' },
                  { id: 'peakShaving' as const, label: 'Battery Peak Shaving Dispatch', desc: 'Discharge BESS to cap industrial demand above 35 MW' },
                  { id: 'curtailmentPrevention' as const, label: 'Solar Curtailment Prevention', desc: 'Divert excess midday solar into green hydrogen & water storage' },
                ].map(c => (
                  <div key={c.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div>
                      <div className="text-xs font-medium text-slate-200">{c.label}</div>
                      <div className="text-[10px] text-slate-500">{c.desc}</div>
                    </div>
                    <button
                      onClick={() => toggleGridConstraint(c.id)}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                        simulationConfig.gridConstraints[c.id] ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        simulationConfig.gridConstraints[c.id] ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Simulated Outcomes (Projected) */}
        <div className="space-y-4">
          <div className="glass-panel p-5 border border-white/10 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Activity size={15} className="text-emerald-400" />
                <span>Simulated Outcomes (Projected)</span>
              </h2>
              <span className="text-[10px] font-mono-telemetry text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {scenario.isActive ? 'Scenario Enabled' : 'Current Baseline'}
              </span>
            </div>

            {/* Impact Metric Cards matching Screenshot 0 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Predicted CO₂ Reductions</div>
                  <div className="text-base font-bold text-emerald-400 font-mono-telemetry mt-0.5">
                    -3.6 kg/m³
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-0.5">
                    <TrendingDown size={11} /> -32.7 tons / mo
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Average Energy Cost</div>
                  <div className="text-base font-bold text-white font-mono-telemetry mt-0.5">
                    $3.80 / kWh
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-0.5">
                    <TrendingDown size={11} /> -24.78% vs baseline
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Projected City Score</div>
                  <div className="text-base font-bold text-emerald-400 font-mono-telemetry mt-0.5">
                    {scenario.isActive ? '94 / 100' : '87 / 100'}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5 font-semibold">
                    Top Tier Resilience
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">System Weaknesses</div>
                  <div className="text-base font-bold text-amber-400 font-mono-telemetry mt-0.5">
                    14.2 MWh
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-0.5">
                    <TrendingDown size={11} /> Reduced by 41%
                  </div>
                </div>
              </div>
            </div>

            {/* System Weakness Heatmap across Zones matching Screenshot 0 */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">System Weakness Heatmap</span>
                <span className="text-[10px] text-slate-400">Stress Index (0-10)</span>
              </div>

              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {[
                  { zone: 'Zone 01', score: 2.1, status: 'Optimal', bg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' },
                  { zone: 'Zone 02', score: 3.4, status: 'Stable', bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' },
                  { zone: 'Zone 03', score: scenario.isActive ? 3.8 : 6.8, status: scenario.isActive ? 'Resolved' : 'Stress Alert', bg: scenario.isActive ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-rose-500/20 border-rose-500/40 text-rose-400' },
                  { zone: 'Zone 04', score: 4.5, status: 'Moderate', bg: 'bg-amber-500/20 border-amber-500/40 text-amber-400' },
                  { zone: 'Zone 05', score: 2.8, status: 'Good', bg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' },
                ].map(h => (
                  <div key={h.zone} className={`p-2.5 rounded-xl border ${h.bg}`}>
                    <div className="font-bold">{h.zone}</div>
                    <div className="text-sm font-mono-telemetry font-bold my-0.5">{h.score}</div>
                    <div className="text-[9px] font-medium">{h.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions: Run High-Fidelity Simulation */}
            <div className="pt-2">
              <button
                onClick={handleRunSimulation}
                disabled={isRunningSim}
                className={`w-full py-3.5 px-5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-xl ${
                  scenario.isActive
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_25px_rgba(0,245,155,0.4)]'
                }`}
              >
                {isRunningSim ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Processing High-Fidelity Physics Engine...</span>
                  </span>
                ) : scenario.isActive ? (
                  <span>Revert to Baseline Scenario</span>
                ) : (
                  <span>Run High-Fidelity Simulation & Project Scenario</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom AI Query & Alerts Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="md:col-span-2 glass-panel p-3.5 border border-white/10 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Sparkles size={16} />
          </div>
          <input
            type="text"
            placeholder="Ask AI Copilot: How can I optimize grid stability for the next 24 hours?"
            value={copilotInput}
            onChange={(e) => setCopilotInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setIsCopilotOpen(true);
            }}
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-colors"
          >
            <Send size={14} />
          </button>
        </div>

        <div className="glass-panel p-3.5 border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <ShieldAlert size={16} className="text-amber-400" />
            <span className="text-slate-300">Islanded Microgrid Mode Ready</span>
          </div>
          <span className="text-emerald-400 font-mono-telemetry font-bold">100% Secure</span>
        </div>
      </div>
    </div>
  );
};
