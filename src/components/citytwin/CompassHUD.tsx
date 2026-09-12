import React from 'react';

interface CompassHUDProps {
  bearing?: number; // degrees
  onResetNorth?: () => void;
  size?: number;
}

export const CompassHUD: React.FC<CompassHUDProps> = ({
  bearing = -20,
  onResetNorth,
  size = 64
}) => {
  // Convert bearing into cardinal letters
  const normalizedBearing = ((bearing % 360) + 360) % 360;
  const getCardinal = (deg: number) => {
    if (deg >= 337.5 || deg < 22.5) return 'N';
    if (deg >= 22.5 && deg < 67.5) return 'NE';
    if (deg >= 67.5 && deg < 112.5) return 'E';
    if (deg >= 112.5 && deg < 157.5) return 'SE';
    if (deg >= 157.5 && deg < 202.5) return 'S';
    if (deg >= 202.5 && deg < 247.5) return 'SW';
    if (deg >= 247.5 && deg < 292.5) return 'W';
    return 'NW';
  };

  const cardinal = getCardinal(normalizedBearing);

  return (
    <button
      onClick={onResetNorth}
      title="Reset North Orientation"
      className="relative group rounded-full p-1 transition-transform duration-300 hover:scale-105 active:scale-95 focus:outline-none select-none cursor-pointer"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #131722 0%, #202738 50%, #0d1017 100%)',
        border: '1.5px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.4), inset 0 -1px 2px rgba(0, 0, 0, 0.8)'
      }}
    >
      {/* Inner Bezel Ring */}
      <div className="absolute inset-[3px] rounded-full border border-white/10 pointer-events-none flex items-center justify-center">
        {/* Rotating Compass Needle */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: `rotate(${-bearing}deg)` }}
        >
          {/* North Pointer Arrow (Red/Orange) */}
          <div
            className="w-0 h-0 absolute -top-0.5 border-l-[4px] border-r-[4px] border-b-[9px] border-transparent border-b-[#f43f5e] filter drop-shadow-[0_0_4px_rgba(244,63,94,0.8)]"
          />
          {/* South Pointer Arrow (Slate/White) */}
          <div
            className="w-0 h-0 absolute -bottom-0.5 border-l-[4px] border-r-[4px] border-t-[9px] border-transparent border-t-slate-400"
          />
        </div>

        {/* Center Pivot Bezel with Cardinal Readout */}
        <div className="relative z-10 w-8 h-8 rounded-full bg-[#0d1017] border border-white/15 flex items-center justify-center shadow-inner">
          <span className="text-[10px] font-mono font-bold text-white tracking-tighter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {cardinal}
          </span>
        </div>
      </div>
    </button>
  );
};

export default CompassHUD;
