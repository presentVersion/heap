import React from 'react';
import { Layers, CheckSquare, Square } from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

const LAYERS = [
  { id: 'Renewable',      label: 'Renewable Energy',   color: '#00f59b' },
  { id: 'Storage',        label: 'BESS & Storage',      color: '#06b6d4' },
  { id: 'Mobility',       label: 'EV Mobility',         color: '#f59e0b' },
  { id: 'Ecology',        label: 'Bio-Junctions',       color: '#10b981' },
  { id: 'Water',          label: 'Water & Retention',   color: '#38bdf8' },
  { id: 'Infrastructure', label: 'Smart Infrastructure',color: '#8b5cf6' },
];

export const DigitalTwinLayersCard: React.FC = () => {
  const { activeLayers, toggleLayer } = useSolTerraStore();
  const allOn = LAYERS.every(l => activeLayers.includes(l.id) || activeLayers.includes('All Layers'));

  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers size={14} style={{ color: 'var(--accent-2)' }} />
          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-2)' }}>Layers</span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded-full mono font-semibold"
          style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--accent-2)' }}>
          {activeLayers.includes('All Layers') ? LAYERS.length : activeLayers.length} ON
        </span>
      </div>

      <div className="flex flex-col gap-0.5 flex-1">
        {LAYERS.map(layer => {
          const on = activeLayers.includes(layer.id) || activeLayers.includes('All Layers');
          return (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className="flex items-center justify-between px-2.5 py-2 rounded-xl transition-all w-full text-left"
              style={{
                background: on ? `${layer.color}10` : 'transparent',
                border: `1px solid ${on ? layer.color + '30' : 'transparent'}`,
              }}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0 transition-all"
                  style={{ background: on ? layer.color : 'rgba(255,255,255,0.1)', boxShadow: on ? `0 0 6px ${layer.color}` : 'none' }} />
                <span className="text-[11px] font-medium truncate" style={{ color: on ? 'var(--text-1)' : 'var(--text-3)' }}>
                  {layer.label}
                </span>
              </div>
              {on
                ? <CheckSquare size={13} style={{ color: layer.color, flexShrink: 0 }} />
                : <Square size={13} style={{ color: 'var(--text-3)', flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => { LAYERS.forEach(l => { if (!activeLayers.includes(l.id)) toggleLayer(l.id); }); }}
          className="flex-1 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all"
          style={{ background: 'rgba(0,245,155,0.08)', border: '1px solid rgba(0,245,155,0.2)', color: 'var(--accent)' }}>
          All On
        </button>
        <button
          onClick={() => { LAYERS.forEach(l => { if (activeLayers.includes(l.id)) toggleLayer(l.id); }); }}
          className="flex-1 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-3)' }}>
          Reset
        </button>
      </div>
    </div>
  );
};
