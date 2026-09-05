import React, { useEffect, useState } from 'react';
import { Box, Eye, Sparkles } from 'lucide-react';
import { AssetType } from '../../types/solterra';
import { getAssetThumbnail } from '../../services/modelThumbnails';

interface AssetCardThumbnailProps {
  type: AssetType;
  name: string;
  onOpen3D: () => void;
}

const GLB_TAGS: Record<string, string> = {
  bio_junction:  'meshy-model.glb (94MB)',
  solar_flower:  'smartflower_fbx.glb (14MB)',
  solar_canopy:  'soler_panel_setup.glb',
  rooftop_solar: 'solar_panel_1x1.glb',
  smart_pole:    'Smart Sensor Mesh',
  ev_station:    'Fast DC Mesh',
  battery_system:'BESS Storage Mesh',
  wind_turbine:  'Turbine Mesh',
};

export const AssetCardThumbnail: React.FC<AssetCardThumbnailProps> = ({ type, name, onOpen3D }) => {
  const [thumbUrl, setThumbUrl] = useState<string>('');
  const isGLB = Boolean(GLB_TAGS[type]?.includes('.glb'));

  useEffect(() => {
    let active = true;
    getAssetThumbnail(type).then((url) => {
      if (active && url) {
        setThumbUrl(url);
      }
    });
    return () => { active = false; };
  }, [type]);

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onOpen3D(); }}
      className="w-full h-32 my-3 rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.07] border border-white/10 hover:border-emerald-400/50 flex items-center justify-center relative overflow-hidden group cursor-pointer transition-all shadow-inner"
    >
      {/* Background glow circle */}
      <div className="w-24 h-24 rounded-full bg-emerald-500/10 blur-xl absolute -bottom-4 group-hover:bg-emerald-500/20 transition-all" />

      {/* Rendered 3D Image Snapshot */}
      {thumbUrl ? (
        <img
          src={thumbUrl}
          alt={name}
          className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
        />
      ) : (
        <div className="flex flex-col items-center gap-1 text-slate-500 animate-pulse">
          <Box size={24} className="text-emerald-400/60" />
          <span className="text-[9px] font-mono">Rendering 3D preview...</span>
        </div>
      )}

      {/* 3D Model Badge */}
      <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono font-semibold">
        {isGLB ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-300">3D GLB</span>
          </>
        ) : (
          <span className="text-slate-400">Mesh</span>
        )}
      </div>

      {/* Hover "Inspect in 3D" Overlay Button */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black text-[11px] font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,245,155,0.5)] transform translate-y-1 group-hover:translate-y-0 transition-transform">
          <Eye size={12} />
          <span>Interactive 3D</span>
        </button>
      </div>
    </div>
  );
};
