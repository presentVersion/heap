import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, Eye, Sparkles, RotateCcw } from 'lucide-react';
import { InfrastructureAsset } from '../../types/solterra';
import { ASSET_MODEL_PATHS, loadGltfModel, createProceduralModel } from '../../services/modelRegistry';

interface AssetStagePreviewProps {
  asset: InfrastructureAsset | null;
  onOpenFull3D?: () => void;
}

export const AssetStagePreview: React.FC<AssetStagePreviewProps> = ({ asset, onOpenFull3D }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!asset || !mountRef.current) return;

    let isMounted = true;
    const container = mountRef.current;
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 240;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(3.5, 2.5, 4.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Illumination
    const amb = new THREE.AmbientLight(0xffffff, 2.0);
    const key = new THREE.DirectionalLight(0xfff8ee, 3.2);
    key.position.set(5, 10, 6);
    const fill = new THREE.DirectionalLight(0x38bdf8, 1.8);
    fill.position.set(-5, 4, -4);
    const rim = new THREE.DirectionalLight(0x00f59b, 1.2);
    rim.position.set(0, -3, 3);
    scene.add(amb, key, fill, rim);

    // Glowing base pedestal
    const grid = new THREE.GridHelper(5, 12, 0x00f59b, 0x334155);
    grid.position.y = 0;
    scene.add(grid);

    let modelRoot: THREE.Object3D | null = null;
    let animId = 0;

    // Mouse drag rotation
    let isDragging = false;
    let prevMouseX = 0;
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging && modelRoot) {
        const delta = e.clientX - prevMouseX;
        modelRoot.rotation.y += delta * 0.015;
        prevMouseX = e.clientX;
      }
    };
    const onMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Load Model
    setLoading(true);
    setHasError(false);

    const modelPath = ASSET_MODEL_PATHS[asset.type];

    const attachModel = (m: THREE.Object3D) => {
      if (!isMounted) return;
      modelRoot = m;
      scene.add(m);
      setLoading(false);

      // Camera look at center of model
      camera.lookAt(0, 0.8, 0);

      // Render loop with slow auto-rotation
      const animate = () => {
        animId = requestAnimationFrame(animate);
        if (modelRoot && !isDragging) {
          modelRoot.rotation.y += 0.008;
        }
        renderer.render(scene, camera);
      };
      animate();
    };

    if (modelPath) {
      loadGltfModel(modelPath, 1.2)
        .then((gltfGroup) => {
          attachModel(gltfGroup);
        })
        .catch(() => {
          // Fallback to procedural high-poly
          const procedural = createProceduralModel(asset.type);
          attachModel(procedural);
        });
    } else {
      const procedural = createProceduralModel(asset.type);
      attachModel(procedural);
    }

    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [asset?.id, asset?.type]);

  if (!asset) {
    return (
      <div className="w-full h-56 rounded-2xl flex flex-col items-center justify-center text-slate-500 bg-white/[0.02] border border-white/5">
        <Box size={32} className="mb-2 opacity-50" />
        <span className="text-xs font-mono">Select an asset to inspect</span>
      </div>
    );
  }

  const isGlb = ['bio_junction', 'solar_flower', 'solar_canopy', 'rooftop_solar'].includes(asset.type);

  return (
    <div className="relative w-full h-64 rounded-3xl overflow-hidden bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/10 shadow-inner group">
      {/* 3D WebGL Canvas container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm gap-2">
          <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-mono text-emerald-300">Synthesizing 3D Mesh...</span>
        </div>
      )}

      {/* Badges Top Left & Right */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono">
        {isGlb ? (
          <>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-300 font-bold">GLB Digital Twin</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-emerald-300 font-bold">High-Poly Mesh</span>
          </>
        )}
      </div>

      {onOpenFull3D && (
        <button
          onClick={onOpenFull3D}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-white/10 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
          title="Open Fullscreen 3D Inspector"
        >
          <Eye size={13} />
        </button>
      )}

      {/* Drag instruction overlay footer */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/5 text-[9px] font-mono text-slate-400 pointer-events-none select-none">
        Drag to rotate turntable 360°
      </div>
    </div>
  );
};
