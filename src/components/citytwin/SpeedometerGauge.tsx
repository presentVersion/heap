import React from 'react';

interface SpeedometerGaugeProps {
  value: number; // Current value (e.g. kW)
  max?: number; // Maximum scale (e.g. kW)
  unit?: string;
  label?: string;
  size?: number;
  color?: string;
}

export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({
  value,
  max = 150,
  unit = 'kW',
  label = 'Power Output',
  size = 130,
  color = '#00f59b'
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // Angle range: -130 deg to +130 deg (260 deg total arc)
  const startAngle = -130;
  const endAngle = 130;
  const totalAngle = endAngle - startAngle;
  const currentAngle = startAngle + (percentage / 100) * totalAngle;

  const radius = size * 0.38;
  const cx = size / 2;
  const cy = size / 2 + 6;

  // Generate SVG arc path
  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians)
    };
  };

  const describeArc = (x: number, y: number, r: number, startA: number, endA: number) => {
    const start = polarToCartesian(x, y, r, endA);
    const end = polarToCartesian(x, y, r, startA);
    const largeArcFlag = endA - startA <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  const backgroundArc = describeArc(cx, cy, radius, startAngle, endAngle);
  const activeArc = describeArc(cx, cy, radius, startAngle, currentAngle);

  // Calibrated tick lines
  const tickCount = 9;
  const ticks = Array.from({ length: tickCount }).map((_, i) => {
    const angle = startAngle + (i / (tickCount - 1)) * totalAngle;
    const p1 = polarToCartesian(cx, cy, radius + 4, angle);
    const p2 = polarToCartesian(cx, cy, radius + (i % 2 === 0 ? 9 : 6), angle);
    return { p1, p2, isMajor: i % 2 === 0 };
  });

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f59b" />
            <stop offset="60%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ticks */}
        {ticks.map((t, idx) => (
          <line
            key={idx}
            x1={t.p1.x}
            y1={t.p1.y}
            x2={t.p2.x}
            y2={t.p2.y}
            stroke={t.isMajor ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.2)'}
            strokeWidth={t.isMajor ? 1.5 : 1}
            strokeLinecap="round"
          />
        ))}

        {/* Background Arc */}
        <path
          d={backgroundArc}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Active Value Arc */}
        {percentage > 1 && (
          <path
            d={activeArc}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#gaugeGlow)"
            className="transition-all duration-500 ease-out"
          />
        )}

        {/* Needle Line */}
        <g transform={`rotate(${currentAngle}, ${cx}, ${cy})`} className="transition-transform duration-500 ease-out">
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - radius + 5}
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            filter="drop-shadow(0 0 4px rgba(255,255,255,0.8))"
          />
          <circle cx={cx} cy={cy} r="4" fill="#ffffff" />
          <circle cx={cx} cy={cy} r="2" fill="#07080f" />
        </g>
      </svg>

      {/* Center Digital Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 pointer-events-none">
        <div className="flex items-baseline gap-0.5">
          <span className="text-sm md:text-base font-bold font-mono tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {Math.round(value)}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{unit}</span>
        </div>
        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium -mt-0.5 truncate max-w-[85px]">
          {label}
        </span>
      </div>
    </div>
  );
};

export default SpeedometerGauge;
