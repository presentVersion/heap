import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  X, 
  Star, 
  Activity, 
  ShieldCheck, 
  Thermometer, 
  Compass, 
  Sun, 
  Zap, 
  Battery, 
  Wrench, 
  ChevronRight,
  Focus,
  Terminal,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { getModelInstance } from '../../services/modelRegistry';

export const AssetInspector: React.FC = () => {
  const { selectedAsset, setSelectedAsset, setCameraFocus, setActivePage, simulationConfig } = useSolTerraStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'health' | 'maintenance'>('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);

  // Dynamic Sun Tracking Calculation based on simulated hour (0-24)
  const hour = simulationConfig.simulatedHour;
  const azimuthDeg = Math.round(90 + (hour / 24) * 180); // 90° East to 270° West
  const elevationDeg = Math.max(0, Math.round(Math.sin(((hour - 6) / 12) * Math.PI) * 72)); // 0° to 72° midday altitude

  // Embedded 3D Inspection Model Canvas
  useEffect(() => {
    if (!selectedAsset || !mountRef.current) return;

    const width = mountRef.current.clientWidth || 320;
    const height = 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4, 3.2, 4.5);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f59b, 2.0);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    rimLight.position.set(-5, -2, -5);
    scene.add(rimLight);

    // Glowing base pedestal ring
    const gridGeo = new THREE.RingGeometry(1.6, 1.7, 48);
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x00f59b, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = Math.PI / 2;
    scene.add(grid);

    let modelGroup: THREE.Group | null = null;
    let animationId: number;

    getModelInstance(selectedAsset.type, selectedAsset.isProposed).then((loadedGroup) => {
      modelGroup = loadedGroup;
      scene.add(modelGroup);
    });

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (modelGroup) {
        modelGroup.rotation.y += 0.009; // slow inspection rotation
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
    };
  }, [selectedAsset]);

  if (!selectedAsset) return null;

  const handleFocusCamera = () => {
    setCameraFocus(selectedAsset.coordinates);
  };

  return (
    <div className="w-full sm:w-[380px] glass-panel border border-white/15 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto animate-fadeIn">
      {/* Header matching screenshot input_file_0.png */}
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[#070a12]/90 backdrop-blur-md z-10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <h2 className="text-sm font-bold text-white font-mono-telemetry tracking-wide uppercase">
              {selectedAsset.name} {selectedAsset.id}
            </h2>
          </div>
          <div className="flex items-center space-x-1.5 mt-0.5">
            <span className="text-[10px] font-bold font-mono-telemetry text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {selectedAsset.health}% HEALTH
            </span>
            <span className="text-[10px] text-slate-400">• {selectedAsset.zone}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors"
          >
            <Star size={16} className={isFavorite ? "fill-amber-400 text-amber-400" : ""} />
          </button>
          <button 
            onClick={() => setSelectedAsset(null)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Sub-Tabs: Overview, Performance, Health, Maintenance */}
      <div className="flex items-center border-b border-white/[0.08] px-3 pt-2 text-xs bg-white/[0.01]">
        {(['overview', 'performance', 'health', 'maintenance'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 font-medium capitalize border-b-2 transition-all ${
              activeTab === tab 
                ? 'border-cyan-400 text-cyan-400 font-semibold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content Body */}
      <div className="p-4 space-y-4 text-left">
        {activeTab === 'overview' && (
          <>
            {/* Primary KPI Grid (Rated Capacity, Realtime Output, Generation, Conversion Eff.) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[9px] uppercase font-bold tracking-wider text-slate-400">RATED CAPACITY</div>
                <div className="text-sm font-bold text-white font-mono-telemetry mt-0.5">
                  {selectedAsset.capacityKw.toFixed(2)} kW
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[9px] uppercase font-bold tracking-wider text-cyan-400">● REALTIME OUTPUT</div>
                <div className="text-sm font-bold text-cyan-400 font-mono-telemetry mt-0.5">
                  {selectedAsset.currentPowerKw.toFixed(2)} kW
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[9px] uppercase font-bold tracking-wider text-slate-400">TODAY'S GENERATION</div>
                <div className="text-sm font-bold text-amber-400 font-mono-telemetry mt-0.5">
                  {selectedAsset.todayGenerationKwh.toFixed(2)} kWh
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[9px] uppercase font-bold tracking-wider text-slate-400">CONVERSION EFF.</div>
                <div className="text-sm font-bold text-emerald-400 font-mono-telemetry mt-0.5">
                  {selectedAsset.efficiency.toFixed(1)} %
                </div>
              </div>
            </div>

            {/* Operating Temp & Avoided Emissions */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[9px] uppercase text-slate-400 flex items-center gap-1">
                  <Thermometer size={11} className="text-amber-400" /> OPERATING TEMP
                </div>
                <div className="text-xs font-bold text-slate-200 font-mono-telemetry mt-0.5">
                  {selectedAsset.panelTemperature ? `${selectedAsset.panelTemperature} °C` : '38.6 °C'}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[9px] uppercase text-slate-400 flex items-center gap-1">
                  <Zap size={11} className="text-emerald-400" /> CO₂ AVOIDED
                </div>
                <div className="text-xs font-bold text-emerald-400 font-mono-telemetry mt-0.5">
                  {selectedAsset.co2AvoidedKg.toFixed(2)} kg
                </div>
              </div>
            </div>

            {/* Diurnal Generation Curve (24H) - Peak 12:45 IST matching screenshot */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-200">DIURNAL GENERATION CURVE (24H)</span>
                <span className="text-[10px] font-mono-telemetry text-amber-400">
                  PEAK 12:45 IST
                </span>
              </div>

              <div className="relative w-full h-20">
                <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="inspCurveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00f59b" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#00f59b" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Area */}
                  <path
                    d="M 10,75 C 60,75 100,55 140,20 C 180,20 220,60 290,75 L 290,75 L 10,75 Z"
                    fill="url(#inspCurveGrad)"
                  />
                  {/* Generation Line */}
                  <path
                    d="M 10,75 C 60,75 100,55 140,20 C 180,20 220,60 290,75"
                    fill="none"
                    stroke="#00f59b"
                    strokeWidth="2.5"
                  />

                  {/* NOW marker dot matching screenshot */}
                  <line x1="150" y1="15" x2="150" y2="75" stroke="#38bdf8" strokeDasharray="2 2" strokeWidth="1.5" />
                  <circle cx="150" cy="22" r="4.5" fill="#38bdf8" className="animate-ping" />
                  <circle cx="150" cy="22" r="3.5" fill="#ffffff" />
                </svg>
              </div>

              <div className="flex justify-between text-[9px] font-mono-telemetry text-slate-500 mt-1">
                <span>06:00</span>
                <span>09:00</span>
                <span className="text-cyan-400 font-bold">12:44 (NOW)</span>
                <span>15:00</span>
                <span>18:00</span>
              </div>
            </div>

            {/* Bi-Axial Sun Tracking Section matching screenshot */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">BI-AXIAL SUN TRACKING</span>
                <span className="text-[10px] font-mono-telemetry text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  LOCKED TO SUN
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center space-x-2">
                  <Compass size={16} className="text-cyan-400" />
                  <div>
                    <div className="text-[9px] text-slate-400">AZIMUTH</div>
                    <div className="font-mono-telemetry font-bold text-white">{azimuthDeg}.4° SE</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Sun size={16} className="text-amber-400" />
                  <div>
                    <div className="text-[9px] text-slate-400">ELEVATION</div>
                    <div className="font-mono-telemetry font-bold text-white">{elevationDeg}.2° ALT</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Optical Camera / 3D Live Feed View matching screenshot */}
            <div className="relative w-full h-36 rounded-xl bg-black/50 border border-white/10 overflow-hidden">
              <div ref={mountRef} className="w-full h-full" />
              
              <div className="absolute top-2 left-2 flex items-center space-x-1.5 px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-mono-telemetry text-slate-300">
                <Camera size={10} className="text-emerald-400 animate-pulse" />
                <span>OPTICAL CAM 02</span>
              </div>

              <div className="absolute bottom-2 right-2 text-[9px] font-mono-telemetry text-slate-400 bg-black/60 px-2 py-0.5 rounded">
                5.2 FPS // LATENCY 42ms
              </div>
            </div>

            {/* Focus Orbital Camera (Cyan Button matching screenshot) */}
            <button
              onClick={handleFocusCamera}
              className="w-full py-3 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs flex items-center justify-center space-x-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              <Focus size={15} />
              <span>Focus Orbital Camera</span>
            </button>

            {/* Diagnostics & Telemetry Log action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setActivePage('maintenance')}
                className="py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
              >
                <Wrench size={13} />
                <span>Diagnostics</span>
              </button>

              <button
                onClick={() => setActivePage('analytics')}
                className="py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
              >
                <Terminal size={13} />
                <span>Telemetry Log</span>
              </button>
            </div>
          </>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <div className="flex justify-between font-medium text-slate-300">
                <span>Direct Normal Irradiance (DNI)</span>
                <span className="font-mono-telemetry text-amber-400">890 W/m²</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '89%' }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <div className="flex justify-between font-medium text-slate-300">
                <span>Inverter Conversion Efficiency</span>
                <span className="font-mono-telemetry text-emerald-400">97.8%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '97.8%' }} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
              <div className="flex items-center gap-2 font-bold mb-1">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Overall System Health: {selectedAsset.health}%</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Photovoltaic cells, tracking motors, and grid inverters running within nominal operating parameters.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white">Next Preventative Service</span>
                <span className="text-[10px] text-amber-400 font-mono-telemetry">In 18 days</span>
              </div>
              <p className="text-[11px] text-slate-400">Lubrication of altitude tracking gears and optical sensor calibration.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
