import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Radio } from 'lucide-react';

interface RadarNode {
  id: string;
  name: string;
  radius: number; // percentage from center
  angle: number;  // degrees
  status: 'active' | 'warning' | 'standby';
}

const NODES: RadarNode[] = [
  { id: 'BJ-07', name: 'Basaveswara Hub', radius: 42, angle: 45, status: 'active' },
  { id: 'SF-042', name: 'Smartflower Alpha', radius: 68, angle: 130, status: 'warning' },
  { id: 'UMSP-01', name: 'Solar Mega Park', radius: 78, angle: 220, status: 'active' },
  { id: 'BESS-10', name: 'BESS Substation', radius: 35, angle: 310, status: 'active' },
  { id: 'SP-118', name: 'Smart Pole Grid', radius: 88, angle: 95, status: 'warning' }
];

export const RadarTracker: React.FC = () => {
  const [sweepAngle, setSweepAngle] = useState(0);

  useEffect(() => {
    let animId: number;
    const startTime = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      setSweepAngle((elapsed * 60) % 360);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      className="p-6 rounded-3xl backdrop-blur-2xl border text-left shadow-2xl flex flex-col justify-between select-none relative overflow-hidden group"
      style={{
        background: 'linear-gradient(145deg, rgba(14, 18, 28, 0.85) 0%, rgba(9, 12, 20, 0.95) 100%)',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        minHeight: '290px'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Radio size={15} className="text-[#00f59b] animate-pulse" />
          <span className="text-sm font-semibold font-heading tracking-wide text-white">
            Grid Radar Tracker
          </span>
        </div>
        <button className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer">
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Circular Radar Stage */}
      <div className="relative w-48 h-48 mx-auto my-3 flex items-center justify-center">
        {/* Concentric Radar Rings */}
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-6 rounded-full border border-white/10" />
        <div className="absolute inset-12 rounded-full border border-white/15 bg-white/[0.01]" />
        <div className="absolute inset-18 rounded-full border border-white/10" />

        {/* Crosshair Axes */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-px bg-white/10" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-full w-px bg-white/10" />
        </div>

        {/* Rotating Radar Sweep Cone */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none transition-transform"
          style={{
            transform: `rotate(${sweepAngle}deg)`,
            background: 'conic-gradient(from 0deg, rgba(0, 245, 155, 0.35) 0deg, rgba(0, 245, 155, 0.05) 45deg, transparent 60deg)'
          }}
        />

        {/* Center Satellite/Hub Node */}
        <div className="relative z-10 w-8 h-8 rounded-full bg-[#07080f] border border-[#00f59b]/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,245,155,0.4)]">
          <div className="w-3 h-3 rounded-full bg-[#00f59b]" />
        </div>

        {/* Radar Target Nodes */}
        {NODES.map((node) => {
          const rad = (node.angle * Math.PI) / 180;
          const distancePx = (node.radius / 100) * 88;
          const x = Math.cos(rad) * distancePx;
          const y = Math.sin(rad) * distancePx;

          const isWarning = node.status === 'warning';
          const dotColor = isWarning ? '#f59e0b' : '#00f59b';

          return (
            <div
              key={node.id}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              title={`${node.name} (${node.id})`}
              className="absolute z-20 cursor-pointer group/node"
            >
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center border shadow-md transition-transform duration-200 group-hover/node:scale-125"
                style={{
                  background: isWarning ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0, 245, 155, 0.25)',
                  borderColor: dotColor,
                  boxShadow: `0 0 10px ${dotColor}`
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: dotColor }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Metrics */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
        <div>
          <div className="text-[10px] uppercase font-mono text-slate-400">Telemetry Velocity</div>
          <div className="font-mono font-bold text-white text-sm mt-0.5">7.66 km/s</div>
        </div>

        <div className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-semibold">
          Next sync: 03:12
        </div>
      </div>
    </div>
  );
};

export default RadarTracker;
