import React, { useState } from 'react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { CityTwinMap } from './CityTwinMap';
import { CityTwinHUDCard } from './CityTwinHUDCard';
import { CompassHUD } from './CompassHUD';
import { SolarpunkWelcomeModal } from './SolarpunkWelcomeModal';
import { RenewableTransmissionHUD } from './RenewableTransmissionHUD';
import { RenewablePlantData, EVChargingStationItem } from '../../services/renewableEnergyGridData';
import { CloudRain, Sun, Building2, Layers, RotateCcw, Plus, Minus, Zap } from 'lucide-react';

export const CityTwinView: React.FC = () => {
  const { assets, statusFilter, setStatusFilter, setCameraFocus } = useSolTerraStore();
  const [showBuildings, setShowBuildings] = useState(true);
  const [isRaining, setIsRaining] = useState(false);
  const [bearing, setBearing] = useState(-20);
  
  // State for Renewable Transmission & Stats HUD
  const [isReHudOpen, setIsReHudOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<RenewablePlantData | null>(null);
  const [selectedEvStation, setSelectedEvStation] = useState<EVChargingStationItem | null>(null);
  const [focusedCoords, setFocusedCoords] = useState<[number, number] | null>(null);

  const activeCount = assets.filter(a => a.status === 'active').length;
  const warningCount = assets.filter(a => a.status === 'warning').length;
  const offlineCount = assets.filter(a => a.status === 'critical' || a.status === 'offline').length;

  const handleFlyToPlant = (plant: RenewablePlantData) => {
    setSelectedPlant(plant);
    setSelectedEvStation(null);
    setFocusedCoords(plant.coordinates);
  };

  const handleFlyToDemand = (coords: [number, number], _name: string) => {
    setSelectedEvStation(null);
    setFocusedCoords(coords);
  };

  const handleSelectEvStation = (station: EVChargingStationItem | null) => {
    setSelectedEvStation(station);
    if (station) {
      setSelectedPlant(null);
      setFocusedCoords(station.coordinates);
    }
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden select-none"
      style={{
        background: 'radial-gradient(130% 120% at 50% 0%, #0c2b18 0%, #05180f 45%, #020905 100%)'
      }}
    >
      {/* ── Solarpunk Welcome Modal (Only Pops Up On First Visit) ─────────────── */}
      <SolarpunkWelcomeModal />

      {/* ── 90% Screen Full-Bleed Mapbox View ─────────────────────────────────── */}
      <div className="absolute inset-0 w-full h-full">
        <CityTwinMap
          isRainingProp={isRaining}
          onBearingChange={setBearing}
          selectedPlantId={selectedPlant?.id}
          onSelectPlant={setSelectedPlant}
          selectedEvStationId={selectedEvStation?.id}
          onSelectEvStation={handleSelectEvStation}
          focusedCoordinates={focusedCoords}
        />
      </div>

      {/* ── Top Secondary Floating Pill Bar (Cleanly docked below permanent navbar) ────── */}
      <div className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-2.5 pointer-events-auto px-4 max-w-5xl">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-black/75 backdrop-blur-xl border border-white/15 shadow-2xl">
          {[
            { id: 'all', label: 'All Assets', count: assets.length },
            { id: 'active', label: 'Active', count: activeCount },
            { id: 'warning', label: 'Warning', count: warningCount },
            { id: 'offline', label: 'Offline', count: offlineCount }
          ].map(pill => {
            const isSelected = statusFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setStatusFilter(pill.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/25 text-white font-bold border border-emerald-400/50 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
              >
                <span>{pill.label}</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-black/60 text-emerald-300">
                  {pill.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feature Toggles */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-black/75 backdrop-blur-xl border border-white/15 shadow-2xl">
          <button
            onClick={() => setIsRaining(r => !r)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              isRaining
                ? 'bg-cyan-500/25 border border-cyan-400/50 text-cyan-200 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            {isRaining ? <CloudRain size={14} className="text-cyan-400" /> : <Sun size={14} className="text-amber-400" />}
            <span>Rain Sim</span>
          </button>

          <button
            onClick={() => setShowBuildings(b => !b)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              showBuildings
                ? 'bg-emerald-500/25 border border-emerald-400/50 text-emerald-200 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            <Building2 size={14} />
            <span>3D Buildings</span>
          </button>

          {/* Quick Toggle to open CEA Grid Stats HUD */}
          <button
            onClick={() => setIsReHudOpen(o => !o)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              isReHudOpen
                ? 'bg-amber-500/35 border border-amber-400/60 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.4)] font-bold'
                : 'text-amber-400 hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            <Zap size={14} className="text-amber-400 animate-pulse" />
            <span>RE Live Stats</span>
          </button>
        </div>
      </div>

      {/* ── Draggable Floating Dual-Mode HUD Card ─────────────────────────── */}
      <CityTwinHUDCard />

      {/* ── CEA Renewable Energy Grid & Transmission HUD ──────────────────── */}
      <RenewableTransmissionHUD
        isOpen={isReHudOpen}
        onToggle={() => setIsReHudOpen(o => !o)}
        onFlyToPlant={handleFlyToPlant}
        onFlyToDemand={handleFlyToDemand}
        selectedPlantId={selectedPlant?.id}
      />

      {/* ── 3D EV Charging Station Floating Inspection Card ──────────────── */}
      {selectedEvStation && (
        <div className="absolute bottom-20 left-4 sm:left-8 z-30 w-80 sm:w-96 bg-[#07130e]/95 backdrop-blur-2xl border border-emerald-500/40 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] p-4 text-white pointer-events-auto">
          <div className="flex items-start justify-between border-b border-emerald-500/20 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-bold">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold">
                    ⛽ {selectedEvStation.petrolBunkBrand}
                  </span>
                </div>
                <h3 className="text-xs font-bold font-mono text-white leading-tight">{selectedEvStation.name}</h3>
                <p className="text-[10px] text-emerald-400 font-mono">{selectedEvStation.location}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedEvStation(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[9px] font-mono text-slate-400 uppercase">Available Bays</span>
              <div className="text-sm font-mono font-bold text-emerald-300 mt-0.5">
                {selectedEvStation.plugsAvailable} / {selectedEvStation.plugsTotal} Free
              </div>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[9px] font-mono text-slate-400 uppercase">Fast DC Power</span>
              <div className="text-sm font-mono font-bold text-amber-400 mt-0.5">
                {selectedEvStation.fastDcKw} kW Max
              </div>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[9px] font-mono text-slate-400 uppercase">Current Draw</span>
              <div className="text-sm font-mono font-bold text-cyan-300 mt-0.5">
                {selectedEvStation.currentDrawKw} kW
              </div>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[9px] font-mono text-slate-400 uppercase">Green Tariff</span>
              <div className="text-sm font-mono font-bold text-white mt-0.5">
                {selectedEvStation.pricePerKwh}
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-300 bg-emerald-950/40 border border-emerald-500/20 p-2 rounded-xl flex items-center justify-between">
            <span className="text-slate-400">Power Source:</span>
            <span className="text-emerald-300 font-bold truncate max-w-[180px]">{selectedEvStation.renewableSource}</span>
          </div>
        </div>
      )}

      {/* ── Floating Compass Widget (Responsive Position) ───────────────────── */}
      <div className="absolute bottom-24 md:bottom-auto md:top-36 right-4 md:right-8 z-20 pointer-events-auto flex flex-col items-end gap-3">
        <CompassHUD
          bearing={bearing}
          onResetNorth={() => setCameraFocus([78.0383, 15.8287])}
        />
      </div>
    </div>
  );
};

export default CityTwinView;
