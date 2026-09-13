import React, { useState } from 'react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { CityTwinMap } from './CityTwinMap';
import { CityTwinHUDCard } from './CityTwinHUDCard';
import { CompassHUD } from './CompassHUD';
import { SolarpunkWelcomeModal } from './SolarpunkWelcomeModal';
import { CloudRain, Sun, Building2, Layers, RotateCcw, Plus, Minus } from 'lucide-react';

export const CityTwinView: React.FC = () => {
  const { assets, statusFilter, setStatusFilter, setCameraFocus } = useSolTerraStore();
  const [showBuildings, setShowBuildings] = useState(true);
  const [isRaining, setIsRaining] = useState(false);
  const [bearing, setBearing] = useState(-20);

  const activeCount = assets.filter(a => a.status === 'active').length;
  const warningCount = assets.filter(a => a.status === 'warning').length;
  const offlineCount = assets.filter(a => a.status === 'critical' || a.status === 'offline').length;

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
        />
      </div>

      {/* ── Top Secondary Floating Pill Bar (Matching Reference Image 1) ────── */}
      <div className="absolute top-20 md:top-24 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-2 pointer-events-auto px-4 max-w-5xl">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-xl">
          {[
            { id: 'all', label: 'All', count: assets.length },
            { id: 'active', label: 'Active', count: activeCount },
            { id: 'warning', label: 'Warning', count: warningCount },
            { id: 'offline', label: 'Offline', count: offlineCount }
          ].map(pill => {
            const isSelected = statusFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setStatusFilter(pill.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white/20 text-white font-bold border border-white/25 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{pill.label}</span>
                <span className="text-[9px] font-mono px-1 rounded bg-black/40 text-slate-300">
                  {pill.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feature Toggles */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-xl">
          <button
            onClick={() => setIsRaining(r => !r)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
              isRaining
                ? 'bg-cyan-500/25 border border-cyan-400/50 text-cyan-200'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {isRaining ? <CloudRain size={12} className="text-cyan-400" /> : <Sun size={12} className="text-amber-400" />}
            <span>Rain Sim</span>
          </button>

          <button
            onClick={() => setShowBuildings(b => !b)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
              showBuildings
                ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Building2 size={12} />
            <span>3D Buildings</span>
          </button>
        </div>
      </div>

      {/* ── Draggable Floating Dual-Mode HUD Card ─────────────────────────── */}
      <CityTwinHUDCard />


      {/* ── Floating Compass Widget (Responsive Position) ───────────────────── */}
      <div className="absolute bottom-24 md:bottom-auto md:top-36 right-4 md:right-8 z-30 pointer-events-auto flex flex-col items-end gap-3">
        <CompassHUD
          bearing={bearing}
          onResetNorth={() => setCameraFocus([78.0383, 15.8287])}
        />
      </div>
    </div>
  );
};

export default CityTwinView;
