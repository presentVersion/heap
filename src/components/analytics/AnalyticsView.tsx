import React, { useState } from 'react';
import { 
  Zap, 
  Leaf, 
  Droplets, 
  Car, 
  DollarSign, 
  Building2, 
  TrendingUp, 
  Download, 
  Info,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { CITY_ZONES } from '../../services/simulationEngine';

export const AnalyticsView: React.FC = () => {
  const { telemetry, setActivePage } = useSolTerraStore();
  const [activeTab, setActiveTab] = useState<'energy' | 'environment' | 'water' | 'mobility' | 'economics' | 'infrastructure'>('energy');
  const [loadUnit, setLoadUnit] = useState<'MW' | 'MWh'>('MW');

  const tabs = [
    { id: 'energy', label: 'Energy', icon: Zap },
    { id: 'environment', label: 'Environment', icon: Leaf },
    { id: 'water', label: 'Water', icon: Droplets },
    { id: 'mobility', label: 'Mobility', icon: Car },
    { id: 'economics', label: 'Economics', icon: DollarSign },
    { id: 'infrastructure', label: 'Infrastructure', icon: Building2 },
  ];

  const topCards = [
    { label: 'TOTAL GENERATION', val: `${telemetry.totalGenerationMwh} MWh`, delta: '+12.4% vs yesterday', color: 'text-amber-400', positive: true },
    { label: 'TOTAL CONSUMPTION', val: `${telemetry.totalConsumptionMwh} MWh`, delta: '+6.3% vs yesterday', color: 'text-amber-500', positive: false },
    { label: 'RENEWABLE SHARE', val: `${telemetry.renewableSharePercent} %`, delta: '+8.7% vs yesterday', color: 'text-emerald-400', positive: true },
    { label: 'STORAGE LEVEL', val: `${telemetry.storageLevelMwh} MWh`, delta: `${telemetry.storageSocPercent}% capacity`, color: 'text-cyan-400', positive: true },
    { label: 'CO₂ AVOIDED', val: `${telemetry.co2AvoidedTons} t`, delta: '+15.8% vs yesterday', color: 'text-emerald-400', positive: true },
    { label: 'PEAK DEMAND', val: '42.8 MW', delta: '2:15 PM peak', color: 'text-purple-400', positive: false },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 md:p-6 space-y-5 text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white font-heading tracking-tight">
            Analytics Overview
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Comprehensive insights into city energy, environment and infrastructure performance.
          </p>
        </div>

        {/* Export Report Action */}
        <button 
          onClick={() => setActivePage('reports')}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-slate-200 font-semibold transition-all w-fit"
        >
          <Download size={14} className="text-emerald-400" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* Domain Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(0,245,155,0.15)]'
                  : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Top 6 KPI Metric Cards with Sparkline Charts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {topCards.map((card, i) => (
          <div key={i} className="glass-card p-3 rounded-xl border border-white/10 flex flex-col justify-between">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</div>
            <div className="text-lg font-bold text-white font-mono-telemetry mt-1">{card.val}</div>
            
            {/* Sparkline SVG */}
            <svg viewBox="0 0 100 24" className="w-full h-6 my-1">
              <path
                d={i % 2 === 0 ? "M 0,20 Q 25,5 50,15 T 100,2" : "M 0,15 Q 35,2 70,18 T 100,8"}
                fill="none"
                stroke={card.color.includes('emerald') ? '#00f59b' : card.color.includes('cyan') ? '#06b6d4' : '#f59e0b'}
                strokeWidth="2"
              />
            </svg>

            <div className="flex items-center space-x-1 text-[10px]">
              <TrendingUp size={11} className={card.positive ? 'text-emerald-400' : 'text-slate-400'} />
              <span className={card.positive ? 'text-emerald-400' : 'text-slate-400'}>{card.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Row 1: Generation vs Consumption Area Chart & Energy Mix Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Generation vs Consumption 24h Area Chart (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-5 border border-white/10 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Generation vs Consumption</h3>
              <p className="text-[11px] text-slate-400">24-hour diurnal energy profile (MWh)</p>
            </div>
            
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-slate-300">Generation</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-slate-300">Consumption</span>
              </div>
            </div>
          </div>

          {/* Area Chart SVG */}
          <div className="relative w-full h-56 flex items-end">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="genGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f59b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00f59b" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="consGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="160" x2="600" y2="160" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

              {/* Generation Area & Path */}
              <path
                d="M 0,190 C 120,190 180,160 220,110 C 270,40 330,40 380,110 C 430,170 500,190 600,190 L 600,200 L 0,200 Z"
                fill="url(#genGrad)"
              />
              <path
                d="M 0,190 C 120,190 180,160 220,110 C 270,40 330,40 380,110 C 430,170 500,190 600,190"
                fill="none"
                stroke="#00f59b"
                strokeWidth="3"
              />

              {/* Consumption Area & Path */}
              <path
                d="M 0,160 C 100,150 180,140 240,120 C 300,100 360,110 420,80 C 480,60 540,110 600,140 L 600,200 L 0,200 Z"
                fill="url(#consGrad)"
              />
              <path
                d="M 0,160 C 100,150 180,140 240,120 C 300,100 360,110 420,80 C 480,60 540,110 600,140"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
              />

              {/* Tooltip Pin at 12:00 PM */}
              <line x1="300" y1="30" x2="300" y2="200" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="300" cy="52" r="5" fill="#00f59b" />
              <circle cx="300" cy="105" r="5" fill="#f59e0b" />
            </svg>

            {/* Tooltip Overlay */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-panel px-3 py-1.5 border border-white/20 shadow-2xl text-[11px] font-mono-telemetry space-y-0.5">
              <div className="font-bold text-white">12:00 PM Midday</div>
              <div className="text-emerald-400">● Generation: 78.4 MWh</div>
              <div className="text-amber-400">● Consumption: 62.1 MWh</div>
            </div>
          </div>

          <div className="flex justify-between text-[11px] font-mono-telemetry text-slate-500 pt-3 border-t border-white/[0.06]">
            <span>00:00</span>
            <span>04:00</span>
            <span>08:00</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
            <span>24:00</span>
          </div>
        </div>

        {/* Energy Mix Donut (1 Col) */}
        <div className="glass-panel p-5 border border-white/10 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Energy Mix (Today)</h3>
            <p className="text-[11px] text-slate-400">Generation source breakdown</p>
          </div>

          <div className="flex flex-col items-center justify-center my-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4.5" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray="54 88" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="4.5" strokeDasharray="12 88" strokeDashoffset="-54" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#06b6d4" strokeWidth="4.5" strokeDasharray="12 88" strokeDashoffset="-66" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#38bdf8" strokeWidth="4.5" strokeDasharray="8 88" strokeDashoffset="-78" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#8b5cf6" strokeWidth="4.5" strokeDasharray="8 88" strokeDashoffset="-86" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-base font-bold text-white font-mono-telemetry leading-none">{telemetry.totalGenerationMwh}</span>
                <span className="text-[10px] text-slate-400 leading-none mt-1">MWh Total</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Solar PV</span>
              <span className="font-mono-telemetry font-bold">176.4 MWh (62%)</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Biomass</span>
              <span className="font-mono-telemetry font-bold">39.8 MWh (14%)</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Wind</span>
              <span className="font-mono-telemetry font-bold">25.6 MWh (9%)</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Hydro</span>
              <span className="font-mono-telemetry font-bold">17.0 MWh (6%)</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Grid Import</span>
              <span className="font-mono-telemetry font-bold">25.8 MWh (9%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Storage Trend (7 Days) & Zone Performance Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Storage 7-Day Trend */}
        <div className="glass-panel p-5 border border-white/10 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Storage Trend (7 Days)</h3>
              <p className="text-[11px] text-slate-400">Battery energy storage charge/discharge cycles</p>
            </div>
            <span className="text-xs font-mono-telemetry text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
              92.4 MWh (78% SoC)
            </span>
          </div>

          <div className="w-full h-44 flex items-end">
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="storageGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,100 Q 40,40 80,75 T 160,50 T 240,85 T 320,45 T 400,70 T 500,55 L 500,150 L 0,150 Z"
                fill="url(#storageGrad)"
              />
              <path
                d="M 0,100 Q 40,40 80,75 T 160,50 T 240,85 T 320,45 T 400,70 T 500,55"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
              />
              <circle cx="500" cy="55" r="4" fill="#06b6d4" />
            </svg>
          </div>

          <div className="flex justify-between text-[11px] font-mono-telemetry text-slate-500 pt-2 border-t border-white/[0.06]">
            <span>May 20</span>
            <span>May 21</span>
            <span>May 22</span>
            <span>May 23</span>
            <span>May 24</span>
            <span>May 25</span>
            <span>May 26</span>
          </div>
        </div>

        {/* Zone Performance Breakdown */}
        <div className="glass-panel p-5 border border-white/10 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Zone Performance Breakdown</h3>
              <p className="text-[11px] text-slate-400">Renewable concentration across Kurnool sectors</p>
            </div>
            <button 
              onClick={() => setActivePage('citytwin')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>View On Map</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-slate-500 border-b border-white/[0.06] pb-2 font-mono-telemetry">
                  <th className="pb-2">Zone</th>
                  <th className="pb-2">Renewable %</th>
                  <th className="pb-2">Generation</th>
                  <th className="pb-2">Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {CITY_ZONES.map(z => (
                  <tr key={z.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 font-medium text-white">{z.name}</td>
                    <td className="py-2.5 font-mono-telemetry font-bold text-emerald-400">{z.renewablePercent}%</td>
                    <td className="py-2.5 font-mono-telemetry text-slate-300">{z.generationMwh} MWh</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono-telemetry font-semibold border border-emerald-500/20">
                        {z.health}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 3: Load Profile & Top Contributors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Load Profile */}
        <div className="glass-panel p-5 border border-white/10 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Load Profile (Today)</h3>
              <p className="text-[11px] text-slate-400">Peak, average, and base demand</p>
            </div>
            <div className="flex items-center space-x-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.08]">
              <button 
                onClick={() => setLoadUnit('MW')} 
                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono-telemetry ${loadUnit === 'MW' ? 'bg-emerald-400 text-black' : 'text-slate-400'}`}
              >
                MW
              </button>
              <button 
                onClick={() => setLoadUnit('MWh')} 
                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono-telemetry ${loadUnit === 'MWh' ? 'bg-emerald-400 text-black' : 'text-slate-400'}`}
              >
                MWh
              </button>
            </div>
          </div>

          <div className="w-full h-36 flex items-end">
            <svg viewBox="0 0 500 120" className="w-full h-full overflow-visible">
              <path
                d="M 0,90 Q 60,95 120,70 T 240,40 T 360,50 T 440,30 T 500,70"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.06] text-center">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Peak Demand</div>
              <div className="text-sm font-bold text-purple-400 font-mono-telemetry mt-0.5">42.8 MW</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Avg Demand</div>
              <div className="text-sm font-bold text-slate-200 font-mono-telemetry mt-0.5">28.6 MW</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Min Demand</div>
              <div className="text-sm font-bold text-slate-400 font-mono-telemetry mt-0.5">14.2 MW</div>
            </div>
          </div>
        </div>

        {/* Top Contributors Breakdown */}
        <div className="glass-panel p-5 border border-white/10 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Top Generation Contributors</h3>
              <p className="text-[11px] text-slate-400">Ranking by total clean MWh supplied</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-200">Solar Flower Clusters</span>
                <span className="font-mono-telemetry text-emerald-400 font-bold">104.2 MWh (36.6%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '36.6%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-200">Rooftop Commercial Solar</span>
                <span className="font-mono-telemetry text-amber-400 font-bold">62.6 MWh (22.0%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '22.0%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-200">Solar Carport Canopies</span>
                <span className="font-mono-telemetry text-cyan-400 font-bold">42.1 MWh (14.8%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '14.8%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-200">Smart Luminaire IoT Poles</span>
                <span className="font-mono-telemetry text-sky-400 font-bold">28.4 MWh (10.0%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full" style={{ width: '10.0%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-200">Riverfront Bio-Junctions</span>
                <span className="font-mono-telemetry text-purple-400 font-bold">22.3 MWh (7.8%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full" style={{ width: '7.8%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assumptions & Methodology Transparency Notice */}
      <div className="glass-panel p-3.5 border border-white/10 flex items-center space-x-3 text-xs text-slate-400">
        <Info size={18} className="text-emerald-400 flex-shrink-0" />
        <p>
          <span className="font-bold text-slate-200">Methodology & Assumptions Disclosure:</span> All economic ($0.082/kWh displaced) and CO₂ emissions avoidance factors (0.442 kg CO₂/kWh) are calibrated against Andhra Pradesh regional baseline grid emissions and transparent deterministic simulation models.
        </p>
      </div>
    </div>
  );
};
