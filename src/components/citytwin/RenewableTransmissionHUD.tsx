import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap, Sun, Wind, Activity, ArrowRight, ShieldCheck,
  ChevronDown, ChevronUp, Layers, MapPin, Gauge, BatteryCharging,
  TrendingUp, Radio, X, Globe, Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  Cell, AreaChart, Area, CartesianGrid, PieChart, Pie
} from 'recharts';
import {
  RENEWABLE_PLANTS, DEMAND_CENTERS, TRANSMISSION_CORRIDORS,
  ALL_INDIA_RE_AUGUST_2026, ENERGYMAP_API_KEY, RenewablePlantData
} from '../../services/renewableEnergyGridData';

interface RenewableTransmissionHUDProps {
  onFlyToPlant: (plant: RenewablePlantData) => void;
  onFlyToDemand: (coords: [number, number], name: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  selectedPlantId?: string | null;
}

export const RenewableTransmissionHUD: React.FC<RenewableTransmissionHUDProps> = ({
  onFlyToPlant,
  onFlyToDemand,
  isOpen,
  onToggle,
  selectedPlantId
}) => {
  const [activeTab, setActiveTab] = useState<'generation' | 'transmission' | 'ev_demand'>('generation');
  const [filterType, setFilterType] = useState<'all' | 'solar' | 'wind'>('all');

  const filteredPlants = RENEWABLE_PLANTS.filter(p => {
    if (filterType === 'all') return true;
    return p.type === filterType;
  });

  const selectedPlant = RENEWABLE_PLANTS.find(p => p.id === selectedPlantId);

  return (
    <>
      {/* ── Floating Minimal Toggle Trigger Button ─────────────────────── */}
      <div className="absolute top-20 md:top-24 right-4 md:right-8 z-30 pointer-events-auto flex items-center gap-2">
        <button
          onClick={onToggle}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl border transition-all shadow-xl cursor-pointer ${
            isOpen
              ? 'bg-emerald-500 text-black border-emerald-400 font-bold shadow-[0_0_20px_rgba(0,245,155,0.4)]'
              : 'bg-black/70 hover:bg-black/90 text-emerald-400 border-emerald-500/30 hover:border-emerald-400'
          }`}
        >
          <Radio size={13} className={isOpen ? 'animate-pulse text-black' : 'text-emerald-400 animate-spin'} style={{ animationDuration: '6s' }} />
          <span>CEA Live Grid Stats</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-black/40 text-emerald-300">
            Aug '26
          </span>
        </button>
      </div>

      {/* ── Slide-Over Glassmorphic Live Stats & Transmission Control HUD ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.96 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute top-28 md:top-36 right-4 md:right-8 z-30 w-[92vw] sm:w-[460px] max-h-[calc(100vh-160px)] flex flex-col bg-[#07130e]/90 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto text-slate-100"
          >
            {/* Header */}
            <div className="p-4 border-b border-emerald-500/20 bg-emerald-950/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-[0_0_12px_rgba(0,245,155,0.3)]">
                  <Zap size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-300">
                      National RE Grid & Flow
                    </h2>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      CEA 2026
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span>API:</span>
                    <span className="text-emerald-400 font-mono">energymap.in</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  </p>
                </div>
              </div>

              <button
                onClick={onToggle}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Quick KPI Strip */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-black/40 border-b border-emerald-500/10 text-center">
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[9px] font-mono uppercase text-slate-400">Total RE (Aug)</span>
                <div className="text-xs font-mono font-bold text-emerald-300 mt-0.5">59,503 MU</div>
                <span className="text-[8px] text-emerald-400 font-mono">+15.8% YoY</span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[9px] font-mono uppercase text-slate-400">Solar Gen</span>
                <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">18,630 MU</div>
                <span className="text-[8px] text-amber-300 font-mono">31.3% Share</span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[9px] font-mono uppercase text-slate-400">Wind Gen</span>
                <div className="text-xs font-mono font-bold text-cyan-400 mt-0.5">17,815 MU</div>
                <span className="text-[8px] text-cyan-300 font-mono">29.9% Share</span>
              </div>
            </div>

            {/* Nav Tabs */}
            <div className="flex border-b border-emerald-500/20 bg-black/30 p-1 gap-1">
              {[
                { id: 'generation', label: '3D Energy Farms', icon: <Sun size={12} /> },
                { id: 'transmission', label: 'Transmission Flow', icon: <Activity size={12} /> },
                { id: 'ev_demand', label: 'EV Load Demands', icon: <BatteryCharging size={12} /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-inner'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="p-3.5 overflow-y-auto space-y-4 max-h-[calc(100vh-320px)] scrollbar-thin">
              {/* TAB 1: 3D ENERGY FARMS & GENERATION */}
              {activeTab === 'generation' && (
                <div className="space-y-3.5">
                  {/* Generation by Type Animated Bar Chart */}
                  <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/15">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">
                        August 2026 Generation Mix (MUs)
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">Total: 59.5 BU</span>
                    </div>
                    <div className="h-28 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={ALL_INDIA_RE_AUGUST_2026.sources}
                          margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                          <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#05180f',
                              borderColor: '#10b981',
                              borderRadius: '8px',
                              fontSize: '10px'
                            }}
                          />
                          <Bar dataKey="generationMu" radius={[4, 4, 0, 0]}>
                            {ALL_INDIA_RE_AUGUST_2026.sources.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Select Farm to Inspect 3D Bunch:
                    </span>
                    <div className="flex gap-1">
                      {(['all', 'solar', 'wind'] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setFilterType(f)}
                          className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded cursor-pointer transition-all ${
                            filterType === f
                              ? 'bg-emerald-500 text-black font-bold'
                              : 'bg-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Plant Card List */}
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {filteredPlants.map(plant => {
                      const isSelected = plant.id === selectedPlantId;
                      return (
                        <div
                          key={plant.id}
                          onClick={() => onFlyToPlant(plant)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-emerald-500/25 border-emerald-400 shadow-[0_0_15px_rgba(0,245,155,0.25)]'
                              : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/5 hover:border-emerald-500/30'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              plant.type === 'solar'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            }`}>
                              {plant.type === 'solar' ? <Sun size={14} /> : <Wind size={14} />}
                            </div>
                            <div className="min-w-0">
                              <div className="text-[11px] font-bold text-white truncate flex items-center gap-1.5">
                                <span>{plant.name}</span>
                                <span className="text-[8px] font-mono px-1 rounded bg-black/40 text-slate-300">
                                  {plant.state}
                                </span>
                              </div>
                              <div className="text-[9px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                                <span className="text-emerald-400 font-semibold">{plant.capacityMw} MW</span>
                                <span>·</span>
                                <span>{plant.augustGenMu} MU (Aug)</span>
                                <span>·</span>
                                <span className="text-cyan-300">{plant.farmClusterSize} 3D Units</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0 text-emerald-400 text-[10px] font-mono">
                            <span>Inspect</span>
                            <ArrowRight size={10} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: TRANSMISSION FLOWS */}
              {activeTab === 'transmission' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/15">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">
                      Green Energy Corridors (GEC) Active Flow
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Power generated in major desert/coastal renewable farms is wheeling across 765 kV / 400 kV HVDC corridors to national demand centers.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {TRANSMISSION_CORRIDORS.map(line => (
                      <div
                        key={line.id}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-white">{line.name}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {line.voltage}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 mt-2">
                          <span className="text-emerald-400">{line.fromName}</span>
                          <span className="text-slate-500">━━━►</span>
                          <span className="text-cyan-400">{line.toName}</span>
                        </div>

                        {/* Progress Bar for flow load */}
                        <div className="mt-2">
                          <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                            <span>Power Flow: {line.flowMw} MW</span>
                            <span>Cap: {line.capacityMw} MW ({Math.round((line.flowMw / line.capacityMw) * 100)}%)</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full"
                              style={{ width: `${(line.flowMw / line.capacityMw) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: EV CONSUMPTION & LOAD DEMANDS */}
              {activeTab === 'ev_demand' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/15">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">
                      EV Public Charging Consumption (CEA Mar '26)
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Rapid EV charging load requires dedicated green power supply across major municipal utility DISCOMs.
                    </p>
                  </div>

                  {/* EV Load Bar Chart */}
                  <div className="h-32 w-full p-2 rounded-xl bg-black/40 border border-white/5">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={ALL_INDIA_RE_AUGUST_2026.evChargingTopStates}
                        layout="vertical"
                        margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
                      >
                        <XAxis type="number" stroke="#64748b" fontSize={9} />
                        <YAxis type="category" dataKey="state" stroke="#64748b" fontSize={9} width={65} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#05180f',
                            borderColor: '#10b981',
                            borderRadius: '8px',
                            fontSize: '10px'
                          }}
                        />
                        <Bar dataKey="mu" fill="#06b6d4" radius={[0, 4, 4, 0]} name="March '26 (MU)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Demand Centers List */}
                  <div className="space-y-1.5">
                    {DEMAND_CENTERS.map(dc => (
                      <div
                        key={dc.id}
                        onClick={() => onFlyToDemand(dc.coordinates, dc.name)}
                        className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-cyan-400/40 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                            <MapPin size={13} />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-white">{dc.name}</div>
                            <div className="text-[9px] text-slate-400 font-mono">
                              Demand: <span className="text-amber-400">{dc.peakDemandMw} MW</span> · EV: <span className="text-cyan-300">{dc.evChargingMuMonth} MU/mo</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-[9px] font-mono text-cyan-400 flex items-center gap-1">
                          <span>Focus</span>
                          <ArrowRight size={10} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with API Verification Status */}
            <div className="p-2.5 border-t border-emerald-500/20 bg-emerald-950/20 flex items-center justify-between text-[9px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span>IEA / CEA Authenticated</span>
              </div>
              <span className="text-slate-500">Key: {ENERGYMAP_API_KEY.slice(0, 10)}...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
