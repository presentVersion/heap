import React from 'react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

export const LayerFilterPills: React.FC = () => {
  const { activeLayers, toggleLayer } = useSolTerraStore();

  const layers = [
    'All Layers',
    'Renewable',
    'Storage',
    'Mobility',
    'Infrastructure',
    'Ecology',
    'Water',
    'Environment'
  ];

  return (
    <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
      {layers.map(layer => {
        const isActive = activeLayers.includes(layer);
        return (
          <button
            key={layer}
            onClick={() => toggleLayer(layer)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              isActive
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(0,245,155,0.15)]'
                : 'bg-white/[0.04] text-slate-400 border border-white/[0.08] hover:text-slate-200 hover:bg-white/[0.08]'
            }`}
          >
            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            <span>{layer}</span>
          </button>
        );
      })}
    </div>
  );
};
