import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  FastForward, 
  SkipForward, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const WELCOME_VIDEOS = [
  {
    id: 1,
    title: 'SolTerra Energy Systems Genesis',
    subtitle: 'Part 1: Renewable Generation & Ultra Mega Solar Grid',
    src: '/videos/From Klickpin.com- Fresh Face Mask Ideas Worth Trying-pin-id-1102678290074494812.mp4',
    badge: '1 / 2'
  },
  {
    id: 2,
    title: 'Digital Twin & Smart Grid Dispatch',
    subtitle: 'Part 2: Real-time Telemetry, BESS & Municipal EV Network',
    src: '/videos/From Klickpin.com- Fresh Face Mask Ideas Worth Trying-pin-id-1102678290074494882.mp4',
    badge: '2 / 2'
  }
];

export const WelcomeVideoPlayer: React.FC<Props> = ({ onComplete }) => {
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMutePrompt, setShowMutePrompt] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  const activeVideo = WELCOME_VIDEOS[currentVideoIdx];

  // Try unmuted autoplay; if browser blocks, fallback to muted autoplay and prompt user
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setIsTransitioning(false);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay blocked with audio -> start muted and show prompt
          video.muted = true;
          setIsMuted(true);
          setShowMutePrompt(true);
          video.play().then(() => setIsPlaying(true)).catch(e => console.log('Autoplay error', e));
        });
    }
  }, [currentVideoIdx]);

  // Video time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  // Video ended handler: auto-play video 2, or finish
  const handleVideoEnded = () => {
    if (currentVideoIdx < WELCOME_VIDEOS.length - 1) {
      // Transition to next video
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentVideoIdx(prev => prev + 1);
      }, 300);
    } else {
      // All videos ended -> complete welcome experience
      handleFinish();
    }
  };

  const handleNextVideo = () => {
    if (currentVideoIdx < WELCOME_VIDEOS.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentVideoIdx(prev => prev + 1);
      }, 200);
    } else {
      handleFinish();
    }
  };

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => setIsPlaying(true));
    }
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      setShowMutePrompt(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('solterra_first_visit_completed', 'true');
    onComplete();
  };

  // Calculate overall progress across both videos (0% to 100%)
  const segment1Progress = currentVideoIdx === 0 
    ? (duration > 0 ? (currentTime / duration) * 50 : 0)
    : 50;
  const segment2Progress = currentVideoIdx === 1 
    ? (duration > 0 ? (currentTime / duration) * 50 : 0)
    : 0;
  const overallProgress = segment1Progress + segment2Progress;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={playerContainerRef}
      className="fixed inset-0 z-50 w-full h-[100dvh] bg-[#020604] flex flex-col justify-between overflow-hidden select-none animate-fadeIn"
      style={{
        background: 'radial-gradient(120% 120% at 50% 10%, #062414 0%, #030f08 40%, #010603 100%)'
      }}
    >
      {/* ── TOP HEADER / SKIP BAR ─────────────────────────────────────── */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 flex items-center justify-between gap-4">
        {/* Brand Tag & Chapter Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(0,245,155,0.3)] flex-shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase font-heading text-white">
                SolTerra
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                WELCOME INTRO · {activeVideo.badge}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium truncate max-w-[200px] sm:max-w-md">
              {activeVideo.title}
            </p>
          </div>
        </div>

        {/* Global Action: Prominent "Skip Welcome" Button */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {showMutePrompt && (
            <button
              onClick={handleToggleMute}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-xs font-semibold animate-pulse transition-all cursor-pointer shadow-md"
            >
              <VolumeX size={14} />
              <span>Tap to Unmute</span>
            </button>
          )}

          <button
            onClick={handleFinish}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-95 border-2 border-emerald-400/60 hover:border-emerald-300 text-white font-heading font-extrabold text-xs sm:text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(0,245,155,0.35)] cursor-pointer backdrop-blur-2xl"
          >
            <span>Skip Welcome</span>
            <FastForward size={16} className="text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* ── DUAL PROGRESS SEGMENTS (Part 1 & Part 2) ───────────────────── */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-3">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* Segment 1 */}
          <div className="space-y-1">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-200"
                style={{
                  width: currentVideoIdx === 0 
                    ? `${(currentTime / (duration || 1)) * 100}%` 
                    : '100%'
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
              <span className={currentVideoIdx === 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                1. Genesis Video
              </span>
              <span>{currentVideoIdx > 0 ? '✓ Completed' : currentVideoIdx === 0 ? `${Math.round((currentTime / (duration || 1)) * 100)}%` : 'Queued'}</span>
            </div>
          </div>

          {/* Segment 2 */}
          <div className="space-y-1">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-200"
                style={{
                  width: currentVideoIdx === 1 
                    ? `${(currentTime / (duration || 1)) * 100}%` 
                    : '0%'
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
              <span className={currentVideoIdx === 1 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                2. Digital Twin
              </span>
              <span>{currentVideoIdx === 1 ? `${Math.round((currentTime / (duration || 1)) * 100)}%` : 'Up Next'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CINEMATIC VIDEO STAGE ─────────────────────────────────────── */}
      <main className="relative z-20 flex-1 w-full max-w-7xl mx-auto px-2 sm:px-6 md:px-8 py-2 sm:py-4 flex items-center justify-center min-h-0">
        <div 
          className="relative w-full h-full max-h-[75vh] flex items-center justify-center rounded-2xl sm:rounded-3xl overflow-hidden bg-black/90 border border-emerald-500/25 shadow-2xl backdrop-blur-3xl group"
          onClick={handleTogglePlay}
        >
          {/* Ambient Video Backlight Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/10 via-transparent to-cyan-600/10 pointer-events-none" />

          {/* HTML5 Video Element */}
          <video
            ref={videoRef}
            src={activeVideo.src}
            className={`w-full h-full object-contain transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0 scale-98' : 'opacity-100 scale-100'
            }`}
            playsInline
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            onLoadedMetadata={handleTimeUpdate}
          />

          {/* Big Center Play/Pause Indicator on hover or when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-[0_0_40px_rgba(0,245,155,0.6)] transform scale-100 group-hover:scale-110 transition-transform">
                <Play size={32} className="ml-1 fill-current" />
              </div>
            </div>
          )}

          {/* Overlay Audio Unmute Pill if audio is muted */}
          {isMuted && showMutePrompt && (
            <div 
              className="absolute top-4 left-4 z-40 bg-black/80 hover:bg-black/95 border border-emerald-400/50 rounded-2xl p-2.5 sm:px-4 sm:py-2.5 flex items-center gap-2.5 text-xs text-white backdrop-blur-xl shadow-2xl cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleMute();
              }}
            >
              <VolumeX size={16} className="text-emerald-400 animate-pulse" />
              <span className="font-semibold text-xs sm:text-sm">Video is muted · Tap to hear audio</span>
            </div>
          )}
        </div>
      </main>

      {/* ── BOTTOM CONTROLS & TIMELINE DOCK ───────────────────────────── */}
      <footer className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-5 sm:pb-8 pt-2">
        <div className="p-3.5 sm:p-4 rounded-3xl bg-slate-950/80 border border-emerald-500/25 backdrop-blur-2xl shadow-2xl space-y-2.5">
          {/* Scrubber Bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-300 w-12 text-right">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 relative flex items-center">
              <input
                type="range"
                min={0}
                max={duration || 1}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 rounded-full appearance-none bg-slate-800 cursor-pointer accent-emerald-400"
              />
            </div>
            <span className="text-xs font-mono text-slate-400 w-12">
              {formatTime(duration)}
            </span>
          </div>

          {/* Controls Cluster */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Play / Pause */}
              <button
                onClick={handleTogglePlay}
                className="p-2 sm:p-2.5 rounded-2xl bg-white/10 hover:bg-emerald-500/20 text-white hover:text-emerald-300 border border-white/10 transition-all cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="fill-current" />}
              </button>

              {/* Mute / Unmute */}
              <button
                onClick={handleToggleMute}
                className="p-2 sm:p-2.5 rounded-2xl bg-white/10 hover:bg-emerald-500/20 text-white hover:text-emerald-300 border border-white/10 transition-all cursor-pointer"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={18} className="text-rose-400" /> : <Volume2 size={18} />}
              </button>

              {/* Video Title Indicator */}
              <div className="hidden md:block pl-2 border-l border-white/10">
                <div className="text-xs font-bold text-white font-heading">
                  {activeVideo.title}
                </div>
                <div className="text-[11px] text-slate-400 font-sans">
                  {activeVideo.subtitle}
                </div>
              </div>
            </div>

            {/* Right Controls: Next Video / Skip Welcome */}
            <div className="flex items-center gap-2 sm:gap-3">
              {currentVideoIdx < WELCOME_VIDEOS.length - 1 && (
                <button
                  onClick={handleNextVideo}
                  className="flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                >
                  <span>Next Video</span>
                  <SkipForward size={14} />
                </button>
              )}

              <button
                onClick={handleFinish}
                className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
              >
                <span>Enter SolTerra</span>
                <ChevronRight size={16} />
              </button>

              <button
                onClick={handleToggleFullscreen}
                className="p-2 sm:p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer hidden sm:block"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomeVideoPlayer;
