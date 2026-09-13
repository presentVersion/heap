import React, { useState, useEffect, useRef } from 'react';
import { X, Navigation, Sparkles, ShieldCheck, AlertTriangle, Zap, Layers, GripHorizontal } from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { SpeedometerGauge } from './SpeedometerGauge';
import { LiquidWaveGauge } from './LiquidWaveGauge';
import { SystemHealthTicks } from './SystemHealthTicks';

export const CityTwinHUDCard: React.FC = () => {
  const {
    selectedAsset,
    setSelectedAsset,
    setCameraFocus,
    telemetry,
    simulationConfig,
    setIsCopilotOpen
  } = useSolTerraStore();

  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 24, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Set initial position based on window size
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const defaultX = window.innerWidth < 640 ? 12 : 24;
      const defaultY = window.innerWidth < 768 ? 84 : 110;
      setPosition({ x: defaultX, y: defaultY });
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (!cardRef.current) return;

    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('a')) {
      return;
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}

    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragRef.current || !cardRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    const cardRect = cardRef.current.getBoundingClientRect();
    const maxX = Math.max(10, window.innerWidth - cardRect.width - 10);
    const maxY = Math.max(64, window.innerHeight - cardRect.height - 70);

    const nextX = Math.max(6, Math.min(maxX, dragRef.current.initialX + dx));
    const nextY = Math.max(64, Math.min(maxY, dragRef.current.initialY + dy));

    setPosition({ x: nextX, y: nextY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
      setIsDragging(false);
      dragRef.current = null;
    }
  };

  const totalGenKw = Math.round(telemetry?.energyFlow?.solarKw || (telemetry?.totalGenerationMwh ? telemetry.totalGenerationMwh * 35 : 1284));
  const cleanShare = telemetry?.renewableSharePercent ?? 88.5;
  const gridHealth = telemetry?.avgHealthScore ?? 94;
  const batterySoC = telemetry?.storageSocPercent ?? 82;

  // Render Drag Grip Handle (Sharp Square)
  const renderDragHandle = () => (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`w-full flex items-center justify-between px-4 py-2 mb-3 transition-all select-none border touch-none ${
        isDragging
          ? 'bg-emerald-500/30 border-emerald-400 shadow-[0_0_20px_rgba(0,245,155,0.4)] cursor-grabbing'
          : 'bg-white/5 hover:bg-emerald-500/15 border-white/10 hover:border-emerald-500/30 cursor-grab'
      }`}
      title="Click and drag to reposition HUD window"
    >
      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#00f59b]">
        <GripHorizontal size={16} className={isDragging ? 'text-white' : 'text-[#00f59b]'} />
        <span>CITY TWIN HUD</span>
      </div>
      <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 border border-emerald-500/30">
        {isDragging ? 'DRAGGING' : 'DRAG TO MOVE'}
      </span>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. STATE B: ASSET IS SELECTED
  // ─────────────────────────────────────────────────────────────────────────────
  if (selectedAsset) {
    const assetPower = selectedAsset.currentPowerKw ?? 24;
    const assetMaxPower = selectedAsset.capacityKw ?? Math.max(assetPower * 1.2, 50);
    const assetHealth = selectedAsset.health ?? 96;
    const isWarning = selectedAsset.status === 'warning' || assetHealth < 80;

    return (
      <div
        ref={cardRef}
        className={`w-[calc(100vw-24px)] sm:w-[380px] md:w-[410px] max-w-[420px] p-6 backdrop-blur-2xl border text-left shadow-2xl transition-shadow duration-200 fixed z-40 ${
          isDragging ? 'shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_30px_rgba(0,245,155,0.3)] border-emerald-400' : ''
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          background: 'linear-gradient(145deg, rgba(6, 26, 16, 0.96) 0%, rgba(2, 12, 7, 0.98) 100%)',
          borderColor: 'rgba(16, 185, 129, 0.35)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Grip Handle */}
        {renderDragHandle()}

        {/* Header Row */}
        <div 
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex items-start justify-between gap-3 pb-4 border-b border-white/10 cursor-grab active:cursor-grabbing touch-none"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#00f59b] animate-ping" />
              <span className="text-sm font-mono font-bold uppercase tracking-wider text-[#00f59b]">
                {selectedAsset.id}
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                isWarning ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {selectedAsset.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white font-heading mt-1">
              {selectedAsset.name}
            </h3>
            <div className="text-sm text-emerald-300/90 font-medium mt-0.5">
              {selectedAsset.zoneName ?? 'Kurnool Urban Zone'} · {selectedAsset.type.replace('_', ' ').toUpperCase()}
            </div>
          </div>

          <button
            onClick={() => setSelectedAsset(null)}
            className="w-8 h-8 bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Close asset details"
          >
            <X size={16} />
          </button>
        </div>

        {/* Gauges */}
        <div className="py-4 grid grid-cols-2 gap-4 items-center justify-items-center">
          <SpeedometerGauge
            value={assetPower}
            max={assetMaxPower}
            unit="kW"
            label="Active Gen"
            size={130}
          />
          <LiquidWaveGauge
            value={selectedAsset.efficiency ?? 92}
            label="Efficiency"
            unit="%"
            subValue={`Health: ${assetHealth}%`}
            size={130}
            color={isWarning ? 'amber' : 'emerald'}
          />
        </div>

        {/* System Health */}
        <SystemHealthTicks
          health={assetHealth}
          label="Asset Telemetry Health"
          subLabel={isWarning ? 'Performance variance detected' : 'Inverter and sensors fully synced'}
          className="mb-4"
        />

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setCameraFocus(selectedAsset.coordinates)}
            className="flex-1 py-3 px-4 bg-[#00f59b] hover:bg-[#00f59b]/90 text-slate-950 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <Navigation size={16} />
            <span>Focus 3D View</span>
          </button>
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles size={16} className="text-[#00f59b]" />
            <span>Copilot</span>
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. STATE A: CITY-WIDE OVERVIEW
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={cardRef}
      className={`w-[calc(100vw-24px)] sm:w-[380px] md:w-[410px] max-w-[420px] p-6 backdrop-blur-2xl border text-left shadow-2xl transition-shadow duration-200 fixed z-40 ${
        isDragging ? 'shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_30px_rgba(0,245,155,0.3)] border-emerald-400' : ''
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        background: 'linear-gradient(145deg, rgba(6, 26, 16, 0.96) 0%, rgba(2, 12, 7, 0.98) 100%)',
        borderColor: 'rgba(16, 185, 129, 0.35)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)'
      }}
    >
      {/* Grip Handle */}
      {renderDragHandle()}

      {/* Header Row */}
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="flex items-start justify-between gap-3 pb-4 border-b border-white/10 cursor-grab active:cursor-grabbing touch-none"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#00f59b] animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00f59b]">
              LIVE DIGITAL TWIN
            </span>
            <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-white/10 text-white font-mono">
              KURNOOL
            </span>
          </div>
          <h3 className="text-xl font-bold text-white font-heading mt-1">
            Renewable City Grid Operations
          </h3>
          <div className="text-sm text-emerald-300/90 font-medium mt-0.5">
            Real-Time Telemetry & Microgrid Dispatch
          </div>
        </div>

        <div className="w-9 h-9 bg-white/5 border border-white/10 flex items-center justify-center text-[#00f59b]">
          <Zap size={18} />
        </div>
      </div>

      {/* Gauges */}
      <div className="py-4 grid grid-cols-2 gap-4 items-center justify-items-center">
        <SpeedometerGauge
          value={totalGenKw}
          max={1600}
          unit="kW"
          label="Total Clean Power"
          size={130}
        />
        <LiquidWaveGauge
          value={batterySoC}
          label="Battery Reserve"
          unit="%"
          subValue="10 MWh BESS"
          size={130}
          color="amber"
        />
      </div>

      {/* System Health */}
      <SystemHealthTicks
        health={gridHealth}
        label="City Smart Grid Stability"
        subLabel="All 12 microgrid nodes synced with Ultra Mega Solar Park"
        className="mb-4"
      />

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div className="p-3 bg-white/5 border border-white/10">
          <div className="text-xs uppercase font-mono text-emerald-400">Clean Share</div>
          <div className="text-lg font-black font-mono text-white mt-0.5">{cleanShare}%</div>
        </div>
        <div className="p-3 bg-white/5 border border-white/10">
          <div className="text-xs uppercase font-mono text-emerald-400">CO2 Avoided</div>
          <div className="text-lg font-black font-mono text-cyan-300 mt-0.5">142.5 T</div>
        </div>
        <div className="p-3 bg-white/5 border border-white/10">
          <div className="text-xs uppercase font-mono text-emerald-400">Ambient</div>
          <div className="text-lg font-black font-mono text-amber-300 mt-0.5">{simulationConfig.ambientTemperature}°C</div>
        </div>
      </div>

      {/* Guidance */}
      <div className="p-3 bg-white/5 border border-white/10 flex items-center justify-between text-sm font-semibold text-emerald-200">
        <span className="flex items-center gap-2">
          <Layers size={16} className="text-[#00f59b]" />
          <span>Click any 3D model to inspect</span>
        </span>
        <span className="font-mono text-white">12 Assets</span>
      </div>
    </div>
  );
};

export default CityTwinHUDCard;
