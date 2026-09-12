import React, { useEffect, useRef, useState, useCallback } from 'react';
import { WarpText } from '../ui/WarpText';
import { BlurText } from '../ui/BlurText';
import { LiquidMetalButton } from '../ui/liquid-metal-button';
import { ChevronDown, Sparkles, Compass, ShieldCheck } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

const TOTAL_FRAMES = 100;

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(100); // Start from 100th frame
  const targetFrameRef = useRef<number>(100);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFrameDisplay, setActiveFrameDisplay] = useState(100);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  // Preload all 100 frames into memory
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(3, '0');
      img.src = `/landing-frames/ezgif-frame-${paddedIndex}.jpg`;

      img.onload = () => {
        loadedCount++;
        const pct = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
        setLoadProgress(pct);
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      images[i] = img; // 1-indexed to match frame numbers 1 to 100
    }

    imagesRef.current = images;
  }, []);

  // Draw a specific frame index to the canvas maintaining aspect-ratio cover
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Aspect-ratio cover math
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasAspect > imgAspect) {
      drawHeight = canvasWidth / imgAspect;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasHeight * imgAspect;
      offsetX = (canvasWidth - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    // Subtle dark vignette overlay for typography legibility
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, 'rgba(7, 8, 15, 0.7)');
    gradient.addColorStop(0.35, 'rgba(7, 8, 15, 0.3)');
    gradient.addColorStop(0.7, 'rgba(7, 8, 15, 0.4)');
    gradient.addColorStop(1, 'rgba(7, 8, 15, 0.85)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }, []);

  // Handle canvas sizing with high-DPI
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  // Scroll listener: map scroll progress (0 to 1) to frames (100 down to 1)
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = Math.max(0, -rect.top);
      const progress = Math.min(1, Math.max(0, currentScroll / totalScrollable));
      setScrollPercentage(Math.round(progress * 100));

      // Key requirement: Frame 100 is first frame (at progress 0), Frame 1 is last frame (at progress 1)
      const targetFrame = 100 - Math.round(progress * 99);
      targetFrameRef.current = Math.min(100, Math.max(1, targetFrame));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation frame loop for smooth frame interpolation
  useEffect(() => {
    let animId: number;

    const renderLoop = () => {
      // Lerp current frame towards target frame for fluid motion
      const current = currentFrameRef.current;
      const target = targetFrameRef.current;

      if (Math.abs(target - current) > 0.05) {
        // Fast responsive easing
        const step = (target - current) * 0.25;
        currentFrameRef.current = current + step;
      } else {
        currentFrameRef.current = target;
      }

      const roundedFrame = Math.round(currentFrameRef.current);
      drawFrame(roundedFrame);
      setActiveFrameDisplay(roundedFrame);

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [drawFrame]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#07080f] text-white"
      style={{ height: '350vh' }}
    >
      {/* Loading Screen with high-tech progress */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080f]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#00f59b]/15 border border-[#00f59b]/30 animate-pulse">
              <Sparkles className="text-[#00f59b]" size={22} />
            </div>
            <span className="font-heading font-bold text-2xl tracking-widest text-[#f0f4ff]">SOLTERRA</span>
          </div>

          <div className="w-72 h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-[#00f59b] to-[#06b6d4] transition-all duration-200"
              style={{ width: `${loadProgress}%` }}
            />
          </div>

          <div className="text-xs text-slate-400 font-mono tracking-wider">
            SYNCHRONIZING DIGITAL TWIN SENSORS... {loadProgress}%
          </div>
        </div>
      )}

      {/* Sticky Fullscreen Canvas and UI Stage */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col justify-between p-5 sm:p-6 md:p-12 select-none">
        {/* Background Rendered Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Ambient Glows */}
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[#00f59b]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#06b6d4]/10 blur-[130px] pointer-events-none" />

        {/* Top Header Row */}
        <header className="relative z-20 flex items-center justify-between w-full">
          {/* Top-Right Quick Jump */}
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#00f59b] animate-ping" />
              <span>LIVE FRAME: {activeFrameDisplay} / 100</span>
            </div>

            <button
              onClick={onEnterApp}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/15 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-lg"
            >
              <Compass size={14} className="text-[#00f59b]" />
              <span>Enter City Twin</span>
            </button>
          </div>
        </header>

        {/* Hero Content in Top-Left Corner as requested */}
        <div className="relative z-20 max-w-2xl mt-4 md:mt-8">
          {/* SolTerra WarpText Component */}
          <div className="w-full max-w-lg -ml-4" style={{ height: '150px' }}>
            <WarpText
              text="SolTerra"
              color="#f8f5ff"
              warpStrength={0.07}
              warpScale={1.8}
              speed={0.5}
              pointerInfluence={0.45}
              pointerStrength={0.35}
              refraction={0.02}
              ripple={true}
              fontSize="clamp(3.5rem, 8vw, 6.5rem)"
              fontWeight={900}
              letterSpacing="-0.04em"
              style={{ height: '100%' }}
            />
          </div>

          {/* Subheading revealed with BlurText */}
          <div className="mt-2 space-y-1.5">
            <BlurText
              text="Renewable City Twin"
              delay={140}
              animateBy="words"
              direction="top"
              className="text-xl md:text-2xl font-bold tracking-widest text-[#00f59b] uppercase font-heading"
            />
            <BlurText
              text="Observe. Predict. Simulate. Decide."
              delay={120}
              animateBy="words"
              direction="top"
              className="text-base md:text-lg font-medium text-slate-300 tracking-wider"
            />
          </div>

          {/* Buttons: LiquidMetalButton with "Get Started" and icon mode */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <LiquidMetalButton
              label="Get Started"
              onClick={onEnterApp}
            />
            <LiquidMetalButton
              viewMode="icon"
              onClick={onEnterApp}
            />
          </div>

          {/* Micro telemetry badges */}
          <div className="mt-8 flex items-center gap-4 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#00f59b]" />
              <span>Physics-based 3D Grid</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600" />
            <div>Scroll to scrub 100 cinematic frames</div>
          </div>
        </div>

        {/* Bottom Footer: Scroll indicator & scrubbing status */}
        <footer className="relative z-20 flex items-center justify-between w-full mt-auto pt-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00f59b] transition-all duration-150"
                style={{ width: `${scrollPercentage}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400 tracking-wider">
              {scrollPercentage}% EXPLORED
            </span>
          </div>

          {/* Animated Scroll Down Indicator */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs text-slate-300 animate-bounce">
            <span>Scroll down</span>
            <ChevronDown size={14} className="text-[#00f59b]" />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
