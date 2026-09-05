import React, { useEffect } from 'react';
import { Play, Pause, Sun, Moon } from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

export const TimeSimulationBar: React.FC = () => {
  const { simulationConfig, setSimulatedHour, togglePlaySimulation, setSpeedMultiplier, advanceSimulationTick } = useSolTerraStore();
  const { simulatedHour, isPlaying, speedMultiplier, targetDate } = simulationConfig;

  useEffect(() => {
    if (!isPlaying) return;
    const iv = setInterval(() => advanceSimulationTick(0.2), 200);
    return () => clearInterval(iv);
  }, [isPlaying, advanceSimulationTick]);

  const fmtHour = (h: number) => {
    const m = Math.floor(h * 60);
    const hh = Math.floor(m / 60) % 24;
    const mm = m % 60;
    return `${hh % 12 || 12}:${mm.toString().padStart(2, '0')} ${hh >= 12 ? 'PM' : 'AM'}`;
  };

  const isDay = simulatedHour >= 6 && simulatedHour < 19;
  const ticks = ['00:00', '06:00', '12:00', '18:00', '24:00'];

  return (
    <div className="glass rounded-2xl px-4 py-3 flex items-center gap-4">
      {/* Date + time */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center"
          style={{ background: isDay ? 'rgba(245,158,11,0.12)' : 'rgba(6,182,212,0.12)', border: `1px solid ${isDay ? 'rgba(245,158,11,0.25)' : 'rgba(6,182,212,0.25)'}` }}>
          {isDay ? <Sun size={14} style={{ color: 'var(--accent-amber)' }} /> : <Moon size={14} style={{ color: 'var(--accent-2)' }} />}
        </div>
        <div>
          <div className="text-[13px] font-bold mono leading-none" style={{ color: 'var(--text-1)' }}>{fmtHour(simulatedHour)}</div>
          <div className="text-[9px] leading-none mt-0.5" style={{ color: 'var(--text-3)' }}>{targetDate}</div>
        </div>
      </div>

      {/* Scrubber */}
      <div className="flex-1 flex flex-col gap-1">
        <input
          type="range" min="0" max="24" step="0.05"
          value={simulatedHour}
          onChange={e => setSimulatedHour(parseFloat(e.target.value))}
          className="w-full cursor-pointer"
          style={{ accentColor: 'var(--accent)', height: 3 }}
        />
        <div className="flex justify-between">
          {ticks.map(t => (
            <span key={t} className="text-[9px] mono" style={{ color: 'var(--text-3)' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={togglePlaySimulation}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          style={{
            background: isPlaying ? 'rgba(245,158,11,0.15)' : 'rgba(0,245,155,0.12)',
            border: `1px solid ${isPlaying ? 'rgba(245,158,11,0.35)' : 'rgba(0,245,155,0.3)'}`,
            color: isPlaying ? 'var(--accent-amber)' : 'var(--accent)',
          }}>
          {isPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: 1 }} />}
        </button>

        <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {[1, 2, 5, 10].map(s => (
            <button key={s} onClick={() => setSpeedMultiplier(s)}
              className="px-2.5 py-1.5 text-[10px] font-bold mono transition-all"
              style={{
                background: speedMultiplier === s ? 'var(--accent)' : 'transparent',
                color: speedMultiplier === s ? '#07080f' : 'var(--text-3)',
              }}>
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
