import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  ShieldCheck, 
  Zap, 
  BatteryCharging, 
  Car, 
  Leaf, 
  Droplets, 
  Activity, 
  Box,
  MapPin,
  ExternalLink,
  Navigation,
  Sparkles,
  ChevronRight,
  Camera,
  Mic,
  Bike,
  Wifi,
  Bell,
  Sun,
  Plus,
  SlidersHorizontal,
  Layers,
  Settings,
  User,
  Shield,
  LayoutDashboard,
  RotateCcw
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { AssetCategory, InfrastructureAsset } from '../../types/solterra';
import { AssetCardThumbnail } from './AssetCardThumbnail';
import { Asset3DModal } from './Asset3DModal';
import { ThermalDial } from './ThermalDial';
import { WeeklyTrendSparkline } from './WeeklyTrendSparkline';
import { AssetStagePreview } from './AssetStagePreview';
import { TelemetryAudioPlayer } from './TelemetryAudioPlayer';

export const AssetsView: React.FC = () => {
  const { 
    assets, 
    selectedAsset,
    setSelectedAsset, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    setActivePage,
    setCameraFocus,
    simulationConfig
  } = useSolTerraStore();

  const [modalAsset, setModalAsset] = useState<InfrastructureAsset | null>(null);
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [activeSideTab, setActiveSideTab] = useState<'dashboard' | 'profile' | 'security' | 'settings'>('dashboard');
  
  // Local state for asset power toggles (ON / OFF switches)
  const [assetPowerState, setAssetPowerState] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    assets.forEach(a => { init[a.id] = a.status !== 'offline'; });
    return init;
  });

  const toggleAssetPower = (assetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAssetPowerState(prev => ({
      ...prev,
      [assetId]: !prev[assetId]
    }));
  };

  // Currently inspected asset for stage preview
  const inspectedAsset = selectedAsset || assets[0];

  const handleLocateOnMap = (asset: InfrastructureAsset) => {
    setSelectedAsset(asset);
    setCameraFocus(asset.coordinates);
    setActivePage('citytwin');
  };

  const zones = [
    { id: 'All', label: 'All Zones' },
    { id: 'Zone 01', label: 'Zone 01 · Central Hub' },
    { id: 'Zone 02', label: 'Zone 02 · Tungabhadra River' },
    { id: 'Zone 03', label: 'Zone 03 · Industrial Corridor' },
    { id: 'Zone 04', label: 'Zone 04 · Residential Grid' },
    { id: 'Zone 05', label: 'Zone 05 · Educational Campus' },
  ];

  const categories: { id: AssetCategory; label: string }[] = [
    { id: 'all', label: 'All Asset Types' },
    { id: 'solar', label: 'Solar Arrays & Wind' },
    { id: 'storage', label: 'BESS Storage Systems' },
    { id: 'mobility', label: 'EV Mobility Hubs' },
    { id: 'bio', label: 'Bio-Junctions' },
    { id: 'water', label: 'Rainwater Cisterns' },
    { id: 'smart_poles', label: 'Smart Poles & Sensors' },
  ];

  // Filtering
  const filteredAssets = assets.filter(asset => {
    if (selectedCategory !== 'all' && asset.category !== selectedCategory) {
      if (selectedCategory === 'solar' && asset.type === 'wind_turbine') return true;
      return false;
    }
    if (selectedZone !== 'All' && asset.zone !== selectedZone) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        asset.id.toLowerCase().includes(q) ||
        asset.name.toLowerCase().includes(q) ||
        asset.zoneName?.toLowerCase().includes(q) ||
        asset.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeAssetCount = assets.filter(a => assetPowerState[a.id] !== false).length;
  const totalCapacityKw = assets.reduce((sum, a) => sum + (assetPowerState[a.id] !== false ? a.currentPowerKw : 0), 0);

  return (
    <div className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-48 px-4 sm:px-8 md:px-14 lg:px-20 max-w-7xl mx-auto scroll-smooth select-none transition-colors duration-300">
      
      {/* ── SECTION 1: HERO & ASSET FLEET OVERVIEW ────────────────────────────── */}
      <section className="mb-32 md:mb-44 lg:mb-52">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/5">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400">
                DISTRIBUTED ASSET INVENTORY & TELEMETRY
              </span>
            </div>

            <h1 
              className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight leading-[1.1]" 
              style={{ color: 'var(--text-1)' }}
            >
              Infrastructure Assets
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal mt-5 leading-relaxed">
              Comprehensive registry of municipal generation nodes, battery energy storage systems, EV fast-chargers, and ecological rainwater installations across Kurnool.
            </p>
          </div>

          {/* Real-time Fleet Metrics Summary (Mobile Adaptive) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div 
              className="p-5 sm:p-6 rounded-3xl border shadow-xl flex items-center gap-4"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black font-heading" style={{ color: 'var(--text-1)' }}>
                  {totalCapacityKw.toLocaleString()} <span className="text-sm font-normal text-slate-400">kW</span>
                </div>
                <div className="text-xs text-slate-400">Online Fleet Output</div>
              </div>
            </div>

            <div 
              className="p-5 sm:p-6 rounded-3xl border shadow-xl flex items-center gap-4"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <Boxes size={20} />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black font-heading" style={{ color: 'var(--text-1)' }}>
                  {activeAssetCount} <span className="text-sm font-normal text-slate-400">/ {assets.length}</span>
                </div>
                <div className="text-xs text-slate-400">Active Online Nodes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: INSPECTED ASSET DEEP DIVE & TELEMETRY ─────────────────── */}
      <section className="mb-32 md:mb-44 lg:mb-52">
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              SECTION 02 · ACTIVE NODE INSPECTION & STAGE PREVIEW
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight" style={{ color: 'var(--text-1)' }}>
            Node Inspection: {inspectedAsset.name}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-normal">
            Interact with the high-precision 3D digital twin model, check inverter thermal loops, and launch direct camera navigation in City Twin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          {/* Left: 3D Turntable Stage Preview (7 Cols on large screen) */}
          <div 
            className="lg:col-span-7 p-6 sm:p-8 md:p-10 rounded-[36px] border shadow-2xl flex flex-col justify-between"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase">
                    Asset ID: #{inspectedAsset.id}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black font-heading mt-1" style={{ color: 'var(--text-1)' }}>
                    {inspectedAsset.name}
                  </h3>
                </div>
                <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {inspectedAsset.status}
                </span>
              </div>

              {/* 3D WebGL Turntable Preview Stage */}
              <div className="my-4">
                <AssetStagePreview 
                  asset={inspectedAsset} 
                  onOpenFull3D={() => setModalAsset(inspectedAsset)} 
                />
              </div>
            </div>

            {/* Locate Node in City Twin Map Button */}
            <div className="pt-6 border-t border-white/5 mt-4">
              <button
                onClick={() => handleLocateOnMap(inspectedAsset)}
                className="w-full py-4 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer shadow-xl hover:scale-[1.01]"
                style={{
                  background: 'linear-gradient(135deg, #00f59b 0%, #06b6d4 100%)',
                  color: '#07080f',
                  boxShadow: '0 8px 24px rgba(0, 245, 155, 0.35)'
                }}
              >
                <Navigation size={17} className="fill-current" />
                <span>Fly to Asset in 3D City Twin Map</span>
              </button>
            </div>
          </div>

          {/* Right: Thermal Dial, Trend Sparkline, and Audio Telemetry (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8">
            <div 
              className="p-6 sm:p-8 rounded-[32px] border shadow-xl flex flex-col justify-between"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4">
                Thermal Stability Loop
              </div>
              <ThermalDial temperature={simulationConfig.ambientTemperature} label="Inverter Loop" />
            </div>

            <div 
              className="p-6 sm:p-8 rounded-[32px] border shadow-xl flex flex-col justify-between"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4">
                Weekly Energy Performance
              </div>
              <WeeklyTrendSparkline />
            </div>

            <TelemetryAudioPlayer />
          </div>
        </div>
      </section>

      {/* ── SECTION 3: SEARCH, CATEGORIES & ZONE EXPLORATION ─────────────────── */}
      <section className="mb-16 sm:mb-20">
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              SECTION 03 · FLEET SEARCH & ZONE FILTERS
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight" style={{ color: 'var(--text-1)' }}>
            Search & Filter Asset Fleet
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-normal">
            Filter devices by municipal geographic zone, infrastructure category, or keyword search.
          </p>
        </div>

        <div 
          className="p-6 sm:p-8 md:p-12 rounded-[32px] border shadow-xl space-y-7"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          {/* Search Input */}
          <div className="relative w-full max-w-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search assets by ID, name, zone, or equipment type..."
              className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base outline-none transition-all border shadow-inner"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderColor: 'var(--border)',
                color: 'var(--text-1)'
              }}
            />
          </div>

          {/* Category Chips */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Asset Category:
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {categories.map(cat => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-white text-slate-950 font-bold shadow-md border-white'
                        : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/5 border-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zone Chips */}
          <div className="space-y-3 pt-5 border-t border-white/5">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Geographic Zone:
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {zones.map(z => {
                const isSelected = selectedZone === z.id;
                return (
                  <button
                    key={z.id}
                    onClick={() => setSelectedZone(z.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm font-bold'
                        : 'bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                  >
                    {z.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset Action */}
          {(selectedCategory !== 'all' || selectedZone !== 'All' || searchQuery) && (
            <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">
                Found <strong className="text-emerald-400">{filteredAssets.length}</strong> matching assets
              </span>
              <button
                onClick={() => { setSelectedCategory('all'); setSelectedZone('All'); setSearchQuery(''); }}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white hover:underline cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset filters</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 4: ASSET INVENTORY CARDS COLLECTION ─────────────────────── */}
      <section className="mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {filteredAssets.map(asset => {
            const isPowerOn = assetPowerState[asset.id] !== false;
            const isSelected = inspectedAsset.id === asset.id;

            return (
              <div
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className={`p-6 sm:p-8 rounded-[32px] flex flex-col justify-between transition-all duration-300 shadow-xl border cursor-pointer group relative overflow-hidden ${
                  isSelected 
                    ? 'ring-2 ring-emerald-400/60 border-emerald-400/50' 
                    : 'hover:border-white/20'
                }`}
                style={{
                  background: isSelected 
                    ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)' 
                    : 'var(--bg-card)',
                  borderColor: 'var(--border)'
                }}
              >
                {/* Top Row: Asset ID & OFF / ON Toggle Switch */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    #{asset.id}
                  </span>

                  {/* Interactive Toggle Switch */}
                  <div 
                    onClick={(e) => toggleAssetPower(asset.id, e)}
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    <span className="text-xs font-mono font-bold uppercase" style={{ color: isPowerOn ? '#00f59b' : 'var(--text-3)' }}>
                      {isPowerOn ? 'ONLINE' : 'OFFLINE'}
                    </span>
                    <div 
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
                        isPowerOn ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-slate-700'
                      }`}
                    >
                      <div 
                        className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                          isPowerOn ? 'translate-x-5' : 'translate-x-0'
                        }`} 
                      />
                    </div>
                  </div>
                </div>

                {/* Center 3D Thumbnail */}
                <div className="my-4">
                  <AssetCardThumbnail 
                    type={asset.type} 
                    name={asset.name} 
                    onOpen3D={() => setModalAsset(asset)} 
                  />
                </div>

                {/* Asset Metadata & Current Generation */}
                <div className="mt-4 pt-4 border-t border-white/5">
                  <h4 className="text-lg font-bold font-heading truncate group-hover:text-emerald-400 transition-colors" style={{ color: 'var(--text-1)' }}>
                    {asset.name}
                  </h4>
                  <div className="flex items-center justify-between text-xs mt-2 text-slate-400">
                    <span className="flex items-center gap-1 truncate max-w-[60%]">
                      <MapPin size={12} className="text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{asset.zoneName ?? 'Kurnool Urban'}</span>
                    </span>
                    <span className="font-mono font-bold text-sm" style={{ color: isPowerOn ? '#00f59b' : '#f43f5e' }}>
                      {isPowerOn ? `${asset.currentPowerKw} kW` : 'Standby'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAssets.length === 0 && (
          <div 
            className="py-24 text-center rounded-[32px] border border-white/5 p-8 space-y-4"
            style={{ background: 'var(--bg-card)' }}
          >
            <Boxes size={42} className="mx-auto text-slate-500 opacity-60" />
            <h3 className="text-xl font-bold text-slate-300">No assets match your search filter</h3>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedZone('All'); setSearchQuery(''); }}
              className="mt-3 px-6 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold cursor-pointer transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 3D Model Modal */}
      {modalAsset && (
        <Asset3DModal
          asset={modalAsset}
          onClose={() => setModalAsset(null)}
        />
      )}

    </div>
  );
};

export default AssetsView;
