import React, { useEffect, useState } from 'react';

interface LiquidWaveGaugeProps {
  value: number; // 0 to 100
  label?: string;
  unit?: string;
  subValue?: string;
  size?: number;
  color?: string; // 'amber' | 'emerald' | 'cyan'
}

export const LiquidWaveGauge: React.FC<LiquidWaveGaugeProps> = ({
  value,
  label = 'Storage SoC',
  unit = '%',
  subValue = 'Reserve OK',
  size = 130,
  color = 'amber'
}) => {
  const [phase, setPhase] = useState(0);

  // Animate wave phase smoothly
  useEffect(() => {
    let animId: number;
    let startTime = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - startTime) * 0.002;
      setPhase(elapsed);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const percentage = Math.min(100, Math.max(0, value));
  const r = size * 0.42;
  const cx = size / 2;
  const cy = size / 2;

  // Calculate liquid surface Y (from bottom to top)
  const liquidY = cy + r - (percentage / 100) * (2 * r);

  // Generate sine wave path across the circle
  const wavePoints: string[] = [];
  const steps = 30;
  const amplitude = 3.5;
  const frequency = 0.07;

  for (let i = 0; i <= steps; i++) {
    const x = cx - r + (i / steps) * (2 * r);
    const yOffset = Math.sin((x + phase * 60) * frequency) * amplitude;
    const y = liquidY + yOffset;
    wavePoints.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
  }

  // Close the wave path around the bottom of the circle
  const wavePath = [
    ...wavePoints,
    `L ${cx + r} ${cy + r}`,
    `L ${cx - r} ${cy + r}`,
    'Z'
  ].join(' ');

  const colorConfig = {
    amber: {
      gradientStart: '#f59e0b',
      gradientEnd: '#d97706',
      crest: 'rgba(251, 191, 36, 0.7)',
      glow: 'rgba(245, 158, 11, 0.4)'
    },
    emerald: {
      gradientStart: '#00f59b',
      gradientEnd: '#059669',
      crest: 'rgba(110, 231, 183, 0.7)',
      glow: 'rgba(0, 245, 155, 0.4)'
    },
    cyan: {
      gradientStart: '#06b6d4',
      gradientEnd: '#0284c7',
      crest: 'rgba(125, 211, 252, 0.7)',
      glow: 'rgba(6, 182, 212, 0.4)'
    }
  }[color] || {
    gradientStart: '#f59e0b',
    gradientEnd: '#d97706',
    crest: 'rgba(251, 191, 36, 0.7)',
    glow: 'rgba(245, 158, 11, 0.4)'
  };

  const clipId = `circle-clip-${Math.round(size)}-${label.replace(/\s+/g, '')}`;

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>

          <linearGradient id={`liquidGrad-${clipId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colorConfig.gradientStart} stopOpacity="0.85" />
            <stop offset="100%" stopColor={colorConfig.gradientEnd} stopOpacity="0.95" />
          </linearGradient>

          <filter id={`liquidGlow-${clipId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Rim */}
        <circle
          cx={cx}
          cy={cy}
          r={r + 3}
          fill="none"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1.5"
        />

        {/* Tank Dark Background */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="rgba(12, 16, 28, 0.85)"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />

        {/* Liquid Layer with Clipping */}
        <g clipPath={`url(#${clipId})`}>
          {/* Background secondary wave */}
          <path
            d={wavePath}
            fill={colorConfig.gradientStart}
            opacity="0.3"
            transform="scale(1.02) translate(-2, -3)"
          />
          {/* Main primary wave */}
          <path
            d={wavePath}
            fill={`url(#liquidGrad-${clipId})`}
            filter={`url(#liquidGlow-${clipId})`}
            className="transition-all duration-300"
          />
          {/* Crest Highlight Line */}
          <line
            x1={cx - r}
            y1={liquidY}
            x2={cx + r}
            y2={liquidY}
            stroke={colorConfig.crest}
            strokeWidth="1.5"
            opacity="0.8"
          />
        </g>
      </svg>

      {/* Center Digital Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <div className="flex items-baseline gap-0.5">
          <span className="text-base md:text-lg font-bold font-mono tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {Math.round(value)}
          </span>
          <span className="text-[10px] text-slate-300 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{unit}</span>
        </div>
        <span className="text-[9px] uppercase tracking-wider text-slate-200 font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] truncate max-w-[85px]">
          {label}
        </span>
        {subValue && (
          <span className="text-[8px] font-mono text-slate-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
};

export default LiquidWaveGauge;
