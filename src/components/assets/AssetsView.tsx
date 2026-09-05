import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  ArrowUpDown, 
  ShieldCheck, 
  Zap, 
  BatteryCharging, 
  Car, 
  Leaf, 
  Droplets, 
  Eye, 
  Activity, 
  Box,
  Sparkles,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { AssetCategory, InfrastructureAsset } from '../../types/solterra';
import { AssetInspector } from '../citytwin/AssetInspector';
import { AssetCardThumbnail } from './AssetCardThumbnail';
import { Asset3DModal } from './Asset3DModal';

export const AssetsView: React.FC = () => {
  const { 
    assets, 
    selectedAsset, 
    setSelectedAsset, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
    setActivePage,
    setCameraFocus
  } = useSolTerraStore();

  const [modalAsset, setModalAsset] = useState<InfrastructureAsset | null>(null);
  const [onlyGlbModels, setOnlyGlbModels] = useState(false);

  const categories: { id: AssetCategory; label: string; icon: any }[] = [
    { id: 'all', label: 'All Assets', icon: Boxes },
    { id: 'solar', label: 'Solar', icon: Zap },
    { id: 'storage', label: 'Storage', icon: BatteryCharging },
    { id: 'mobility', label: 'Mobility', icon: Car },
    { id: 'bio', label: 'Bio & Ecology', icon: Leaf },
    { id: 'water', label: 'Water', icon: Droplets },
    { id: 'smart_poles', label: 'Smart Poles', icon: Activity },
  ];

  // Filtering
  const filteredAssets = assets.filter(asset => {
    if (onlyGlbModels) {
      const isGlb = ['bio_junction', 'solar_flower', 'solar_canopy', 'rooftop_solar'].includes(asset.type);
      if (!isGlb) return false;
    }
    if (selectedCategory !== 'all' && asset.category !== selectedCategory) {
      if (selectedCategory === 'solar' && asset.type === 'wind_turbine') return true;
      return false;
    }
    if (statusFilter !== 'all' && asset.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        asset.id.toLowerCase().includes(q) ||
        asset.name.toLowerCase().includes(q) ||
        asset.zone.toLowerCase().includes(q) ||
        asset.zoneName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Sorting
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    if (sortBy === 'health') return b.health - a.health;
    if (sortBy === 'generation') return b.todayGenerationKwh - a.todayGenerationKwh;
    if (sortBy === 'capacity') return b.capacityKw - a.capacityKw;
    return a.id.localeCompare(b.id);
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 md:p-6 space-y-5 text-left">
      {/* 3D Interactive Model Modal */}
      {modalAsset && (
        <Asset3DModal
          asset={modalAsset}
          onClose={() => setModalAsset(null)}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-white font-heading tracking-tight">
              Kurnool Infrastructure Assets
            </h1>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
              <Sparkles size={11} />
              <span>3D Digital Twin</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Photorealistic 3D models and real-time telemetry across Kurnool city & Ultra Mega Solar Park.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* 3D GLB Models Toggle */}
          <button
            onClick={() => setOnlyGlbModels(!onlyGlbModels)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              onlyGlbModels
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_15px_rgba(0,245,155,0.4)]'
                : 'bg-white/[0.04] text-slate-300 border-white/10 hover:border-emerald-400/40 hover:text-white'
            }`}
          >
            <Box size={13} />
            <span>3D GLB Models Only</span>
          </button>

          {/* Status Filter Dropdown */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-400"
          >
            <option value="all" className="bg-slate-900">All Statuses</option>
            <option value="active" className="bg-slate-900">Active Only</option>
            <option value="warning" className="bg-slate-900">Warning</option>
            <option value="critical" className="bg-slate-900">Critical</option>
            <option value="offline" className="bg-slate-900">Offline</option>
          </select>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-1.5 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-300">
            <ArrowUpDown size={13} className="text-emerald-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none"
            >
              <option value="health" className="bg-slate-900">Sort: Health</option>
              <option value="generation" className="bg-slate-900">Sort: Output</option>
              <option value="capacity" className="bg-slate-900">Sort: Capacity</option>
              <option value="name" className="bg-slate-900">Sort: Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id && !onlyGlbModels;
          return (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setOnlyGlbModels(false); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center space-x-2 transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(0,245,155,0.2)]'
                  : 'bg-white/[0.04] text-slate-400 border border-white/[0.08] hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <Icon size={14} className={isSelected ? 'text-emerald-400' : 'text-slate-500'} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass p-3 rounded-2xl border border-white/10">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">TOTAL ASSETS</div>
          <div className="text-xl font-bold text-white font-mono mt-1">2,349</div>
          <div className="text-[10px] text-slate-500 mt-0.5">100% monitored</div>
        </div>

        <div className="glass p-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03]">
          <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">ACTIVE</div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">2,172</div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5">92.5% online</div>
        </div>

        <div className="glass p-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03]">
          <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">WARNING</div>
          <div className="text-xl font-bold text-amber-400 font-mono mt-1">132</div>
          <div className="text-[10px] text-amber-400/80 mt-0.5">5.6% flagged</div>
        </div>

        <div className="glass p-3 rounded-2xl border border-rose-500/20 bg-rose-500/[0.03]">
          <div className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">CRITICAL</div>
          <div className="text-xl font-bold text-rose-400 font-mono mt-1">27</div>
          <div className="text-[10px] text-rose-400/80 mt-0.5">1.1% urgent</div>
        </div>

        <div className="glass p-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.03]">
          <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">3D GLB MODELS</div>
          <div className="text-xl font-bold text-cyan-300 font-mono mt-1">4 Files</div>
          <div className="text-[10px] text-cyan-400/80 mt-0.5">100% loaded</div>
        </div>

        <div className="glass p-3 rounded-2xl border border-emerald-500/20 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">AVG HEALTH</div>
            <div className="text-xl font-bold text-white font-mono mt-1">94<span className="text-xs text-slate-400">/100</span></div>
            <div className="text-[10px] text-emerald-400 mt-0.5 font-semibold">Nominal state</div>
          </div>
          <ShieldCheck size={28} className="text-emerald-400 opacity-80" />
        </div>
      </div>

      {/* Assets Grid & Inspector Container */}
      <div className="flex-1 flex flex-col lg:flex-row gap-5 items-start">
        {/* Cards Grid */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {sortedAssets.map(asset => {
            const isSelected = selectedAsset?.id === asset.id;
            return (
              <div
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className={`glass p-4 rounded-2xl cursor-pointer border transition-all relative flex flex-col justify-between group ${
                  isSelected
                    ? 'border-emerald-400 bg-emerald-500/[0.08] shadow-[0_0_24px_rgba(0,245,155,0.2)]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Top Card Info */}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-bold font-mono text-white flex items-center space-x-1.5">
                        <span>{asset.id}</span>
                        {asset.isProposed && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                            PROP
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 font-medium">{asset.name}</div>
                    </div>

                    {/* Health Pill */}
                    <div className="flex items-center space-x-1">
                      <span className={`w-2 h-2 rounded-full ${
                        asset.status === 'active' ? 'bg-emerald-400' :
                        asset.status === 'warning' ? 'bg-amber-400' : 'bg-rose-400'
                      }`} />
                      <span className="text-xs font-mono font-bold text-slate-200">
                        {asset.health}%
                      </span>
                    </div>
                  </div>

                  {/* ── Real 3D Preview of the Asset's GLB Model ── */}
                  <AssetCardThumbnail
                    type={asset.type}
                    name={asset.name}
                    onOpen3D={() => setModalAsset(asset)}
                  />

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-1.5 py-2 border-t border-b border-white/[0.06] text-center">
                    <div>
                      <div className="text-[9px] uppercase text-slate-500">Capacity</div>
                      <div className="text-xs font-bold text-white font-mono">
                        {asset.capacityKw} kW
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase text-slate-500">Today</div>
                      <div className="text-xs font-bold text-emerald-400 font-mono">
                        {asset.todayGenerationKwh} kWh
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase text-slate-500">Eff.</div>
                      <div className="text-xs font-bold text-cyan-400 font-mono">
                        {asset.efficiency}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Location & View on Map Button */}
                <div className="mt-3 flex items-center justify-between text-xs pt-1">
                  <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                    {asset.zoneName}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalAsset(asset);
                      }}
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-colors"
                      title="Open 3D Model Studio"
                    >
                      <Box size={13} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAsset(asset);
                        setCameraFocus(asset.coordinates);
                        setActivePage('citytwin');
                      }}
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition-colors"
                      title="View on 3D City Twin Map"
                    >
                      <Eye size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky Inspector Drawer for Selected Asset */}
        {selectedAsset && (
          <div className="w-full lg:w-96 sticky top-4">
            <AssetInspector />
          </div>
        )}
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/[0.08] text-xs text-slate-400">
        <div>Showing {sortedAssets.length} assets across Kurnool City & Mega Solar Park</div>
        <div className="flex items-center space-x-1.5">
          <button className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold">1</button>
          <button className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white">2</button>
          <button className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white">3</button>
        </div>
      </div>
    </div>
  );
};
