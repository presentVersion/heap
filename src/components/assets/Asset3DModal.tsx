import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {
  X, RotateCcw, Box, Eye, Sparkles, Navigation,
  Activity, ShieldCheck, Zap, Layers, Maximize2
} from 'lucide-react';
import { InfrastructureAsset } from '../../types/solterra';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { ASSET_MODEL_PATHS, createProceduralModel } from '../../services/modelRegistry';

interface Asset3DModalProps {
  asset: InfrastructureAsset | null;
  onClose: () => void;
}

const GLB_INFO: Record<string, { fileName: string; size: string; description: string }> = {
  bio_junction: {
    fileName: 'meshy-model.glb',
    size: '94.4 MB',
    description: 'Biometric algae bioreactor monument replacing traffic circle statues in Kurnool.',
  },
  solar_flower: {
    fileName: 'smartflower_fbx.glb',
    size: '13.8 MB',
    description: 'Autonomous dual-axis photovoltaic solar flower with sun tracking petals.',
  },
  solar_canopy: {
    fileName: 'soler_panel_setup.glb',
    size: '383 KB',
    description: 'Commercial elevated solar canopy framework for parking & civic areas.',
  },
  rooftop_solar: {
    fileName: 'solar_panel_1x1.glb',
    size: '868 KB',
    description: 'High-efficiency monocrystalline PV module deployed at Kurnool Mega Solar Park.',
  },
  smart_pole: {
    fileName: 'Procedural High-Poly Mesh',
    size: 'Generated',
    description: 'Multi-sensor IoT urban pole with air quality, lighting, and 5G nodes.',
  },
  ev_station: {
    fileName: 'Procedural High-Poly Mesh',
    size: 'Generated',
    description: 'DC ultra-fast EV charging station with dual CSS2 plugs.',
  },
  battery_system: {
    fileName: 'Procedural High-Poly Mesh',
    size: 'Generated',
    description: 'Lithium Iron Phosphate (LFP) utility-scale energy storage enclosure.',
  },
  wind_turbine: {
    fileName: 'Procedural High-Poly Mesh',
    size: 'Generated',
    description: 'Urban micro-wind generator with active pitch aerodynamic blades.',
  },
};

export const Asset3DModal: React.FC<Asset3DModalProps> = ({ asset, onClose }) => {
  const { setActivePage, setCameraFocus } = useSolTerraStore();
  const mountRef = useRef<HTMLDivElement>(null);

  const [isWireframe, setIsWireframe]   = useState(false);
  const [isRotating, setIsRotating]     = useState(true);
  const [modelLoaded, setModelLoaded]   = useState(false);

  // Three.js interactive scene setup
  useEffect(() => {
    if (!asset || !mountRef.current) return;

    const container = mountRef.current;
    const width  = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(4.2, 3.2, 4.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Illumination
    const amb = new THREE.AmbientLight(0xffffff, 2.2);
    const key = new THREE.DirectionalLight(0xfff8ee, 3.0);
    key.position.set(6, 12, 8);
    const fill = new THREE.DirectionalLight(0x06b6d4, 1.8);
    fill.position.set(-6, 4, -4);
    const rim = new THREE.DirectionalLight(0x00f59b, 1.2);
    rim.position.set(0, -4, 4);
    scene.add(amb, key, fill, rim);

    // Glowing base pedestal & grid
    const grid = new THREE.GridHelper(6, 16, 0x00f59b, 0x1e293b);
    grid.position.y = 0;
    scene.add(grid);

    const ringGeo = new THREE.RingGeometry(2.2, 2.3, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f59b, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.01;
    scene.add(ring);

    let modelGroup: THREE.Group | null = null;
    let animId: number;

    const glbUrl = ASSET_MODEL_PATHS[asset.type];

    const setupModel = (root: THREE.Group) => {
      // Normalize
      const box = new THREE.Box3().setFromObject(root);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);
      const maxDim = Math.max(size.x, size.y, size.z);

      root.position.sub(center);
      root.position.y += size.y / 2;

      if (maxDim > 0) {
        const s = 2.4 / maxDim;
        root.scale.setScalar(s);
        root.position.multiplyScalar(s);
      }

      const box2 = new THREE.Box3().setFromObject(root);
      root.position.y -= box2.min.y;

      root.traverse(c => {
        if ((c as THREE.Mesh).isMesh) {
          const m = c as THREE.Mesh;
          m.castShadow = true;
          m.receiveShadow = true;
          const mats = Array.isArray(m.material) ? m.material : [m.material];
          mats.forEach((mat: any) => {
            mat.side = THREE.DoubleSide;
            if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
            mat.wireframe = isWireframe;
            mat.needsUpdate = true;
          });
        }
      });

      modelGroup = root;
      scene.add(root);
      setModelLoaded(true);
    };

    if (glbUrl) {
      new GLTFLoader().load(
        glbUrl,
        gltf => setupModel(gltf.scene),
        undefined,
        () => setupModel(createProceduralModel(asset.type))
      );
    } else {
      setupModel(createProceduralModel(asset.type));
    }

    // Mouse drag controls for full 360-degree rotation
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let spherical = { radius: 6.5, theta: 0.8, phi: 1.1 };

    const updateCameraFromSpherical = () => {
      spherical.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, spherical.phi));
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi) + 0.8;
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 0.8, 0);
    };
    updateCameraFromSpherical();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMousePos.x;
      const dy = e.clientY - prevMousePos.y;
      prevMousePos = { x: e.clientX, y: e.clientY };

      spherical.theta -= dx * 0.008;
      spherical.phi   -= dy * 0.008;
      updateCameraFromSpherical();
    };

    const onMouseUp = () => { isDragging = false; };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(2.5, Math.min(14, spherical.radius + e.deltaY * 0.005));
      updateCameraFromSpherical();
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Animation loop
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (modelGroup && isRotating && !isDragging) {
        modelGroup.rotation.y += 0.006;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, [asset, isWireframe, isRotating]);

  if (!asset) return null;

  const info = GLB_INFO[asset.type] ?? {
    fileName: '3D Geometry',
    size: 'Standard',
    description: 'Digital twin infrastructure node.',
  };

  const handleLocateOnMap = () => {
    setCameraFocus(asset.coordinates);
    setActivePage('citytwin');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#080d1a] border border-white/15 shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row max-h-[90vh]">

        {/* ── 3D Viewport ──────────────────────────────────────────────────── */}
        <div className="flex-1 relative h-[380px] md:h-auto min-h-[360px] bg-gradient-to-b from-[#050914] to-[#0a1224] flex items-center justify-center select-none overflow-hidden cursor-grab active:cursor-grabbing">
          {/* Three.js mount */}
          <div ref={mountRef} className="absolute inset-0 w-full h-full" />

          {/* Model Loading indicator */}
          {!modelLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#080d1a]/80 backdrop-blur-sm z-10">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
              <span className="text-xs font-mono text-emerald-400">Loading 3D GLB Model...</span>
            </div>
          )}

          {/* 3D Viewport Controls */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <button
              onClick={() => setIsRotating(r => !r)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider border transition-all ${
                isRotating
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-black/50 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              Rotate {isRotating ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setIsWireframe(w => !w)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider border transition-all ${
                isWireframe
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                  : 'bg-black/50 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              Wireframe {isWireframe ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="absolute bottom-3 left-3 text-[10px] text-slate-500 pointer-events-none select-none">
            Click & drag to rotate • Scroll to zoom
          </div>
        </div>

        {/* ── Metadata & Telemetry Sidebar ─────────────────────────────────── */}
        <div className="w-full md:w-84 p-5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 bg-[#070b16] overflow-y-auto">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold text-emerald-400 tracking-wider">
                    {asset.id}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-300 border border-white/10">
                    {asset.type}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white font-heading mt-1">
                  {asset.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* 3D Asset File Specs */}
            <div className="p-3 my-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                <Box size={11} />
                <span>3D GLB Model Asset</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Source File:</span>
                <span className="font-mono text-white font-bold">{info.fileName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">File Size:</span>
                <span className="font-mono text-cyan-300">{info.size}</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 leading-snug">
                {info.description}
              </p>
            </div>

            {/* Real-time Telemetry Metrics */}
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Live Metrics</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-[9px] uppercase text-slate-400">Power Output</div>
                  <div className="text-emerald-300 font-mono font-bold text-sm mt-0.5">
                    {asset.currentPowerKw ? `${asset.currentPowerKw} kW` : 'Nominal'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-[9px] uppercase text-slate-400">System Health</div>
                  <div className="text-cyan-300 font-mono font-bold text-sm mt-0.5">
                    {asset.health}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-[9px] uppercase text-slate-400">Location</div>
                  <div className="text-slate-200 font-medium text-xs mt-0.5 truncate">
                    {asset.zoneName}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-[9px] uppercase text-slate-400">Coordinates</div>
                  <div className="text-slate-300 font-mono text-[10px] mt-0.5">
                    {asset.coordinates[0].toFixed(3)}°, {asset.coordinates[1].toFixed(3)}°
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action: Fly to 3D Map */}
          <div className="pt-4 mt-3 border-t border-white/10 flex gap-2">
            <button
              onClick={handleLocateOnMap}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_16px_rgba(0,245,155,0.3)]"
            >
              <Navigation size={13} />
              <span>Locate on Kurnool Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
