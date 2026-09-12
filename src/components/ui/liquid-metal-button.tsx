import React, { useState, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export interface LiquidMetalButtonProps {
  label?: string;
  viewMode?: 'text' | 'icon' | 'both';
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const LiquidMetalButton: React.FC<LiquidMetalButtonProps> = ({
  label = 'Get Started',
  viewMode = 'text',
  icon,
  onClick,
  className = '',
  children,
  disabled = false,
  style = {}
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const defaultIcon = icon || (viewMode === 'icon' ? <Sparkles size={18} /> : <ArrowRight size={17} />);

  if (viewMode === 'icon') {
    return (
      <button
        ref={buttonRef}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        className={`relative group inline-flex items-center justify-center w-12 h-12 rounded-full overflow-hidden transition-all duration-300 transform active:scale-95 select-none ${className}`}
        style={{
          background: 'linear-gradient(135deg, #181b26 0%, #2a2e3d 40%, #0d0f17 100%)',
          boxShadow: isHovered
            ? '0 0 25px rgba(0, 245, 155, 0.4), 0 8px 20px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.8), inset 0 -1px 2px rgba(0,0,0,0.8)'
            : '0 4px 15px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.7)',
          border: '1px solid rgba(255,255,255,0.22)',
          ...style
        }}
        aria-label={label || 'Action'}
      >
        {/* Dynamic Liquid Reflection Layer */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-70 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle 45px at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.45) 0%, rgba(0,245,155,0.25) 35%, transparent 70%)`
          }}
        />

        {/* Chrome Sheen Streak */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-70 transition-all duration-700"
          style={{
            background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.6) 45%, rgba(0,245,155,0.5) 55%, transparent 80%)',
            transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)'
          }}
        />

        {/* Metallic Bevel Ring */}
        <div className="absolute inset-[1.5px] rounded-full border border-white/20 pointer-events-none" />

        {/* Center Icon */}
        <span className="relative z-10 text-white group-hover:text-[#00f59b] transition-colors duration-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {defaultIcon}
        </span>
      </button>
    );
  }

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`relative group inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full overflow-hidden transition-all duration-300 transform active:scale-98 select-none font-medium tracking-wide ${className}`}
      style={{
        background: 'linear-gradient(135deg, #131622 0%, #252b3d 40%, #151926 70%, #0d0f17 100%)',
        boxShadow: isHovered
          ? '0 0 30px rgba(0, 245, 155, 0.45), 0 10px 25px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(0,0,0,0.8)'
          : '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -1px 2px rgba(0,0,0,0.7)',
        border: '1px solid rgba(255,255,255,0.22)',
        ...style
      }}
    >
      {/* Liquid Chrome Ripple / Specular highlight following cursor */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle 80px at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.4) 0%, rgba(0,245,155,0.25) 40%, transparent 75%)`
        }}
      />

      {/* Shimmering Metallic Reflection Wave */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 group-hover:opacity-60 transition-transform duration-1000 ease-out"
        style={{
          background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.5) 50%, rgba(0,245,155,0.4) 60%, transparent 80%)',
          transform: isHovered ? 'translateX(120%)' : 'translateX(-120%)'
        }}
      />

      {/* Inner Metallic Bevel */}
      <div className="absolute inset-[1.5px] rounded-full border border-white/15 pointer-events-none" />

      {/* Label Content */}
      <span className="relative z-10 text-[14px] font-semibold text-white group-hover:text-white transition-colors tracking-wider drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
        {children || label}
      </span>

      {/* Icon */}
      <span className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full bg-white/10 group-hover:bg-[#00f59b]/25 text-white group-hover:text-[#00f59b] transition-all duration-300 group-hover:translate-x-1">
        {defaultIcon}
      </span>
    </button>
  );
};

export default LiquidMetalButton;
