import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Activity } from 'lucide-react';

export const TelemetryAudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(45);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className="p-4 rounded-3xl flex flex-col justify-between transition-all duration-300 shadow-xl border w-full select-none"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)'
      }}
    >
      {/* Top Track & Info (Matching Billie Jean in Reference Image 1) */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold truncate" style={{ color: 'var(--text-1)' }}>
            Grid Harmonic Resonance
          </div>
          <div className="text-[10px] truncate" style={{ color: 'var(--text-3)' }}>
            Phase A/B/C · 50.02 Hz Stable
          </div>
        </div>

        {/* Square Album/Node Art Thumbnail */}
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-md flex-shrink-0">
          <Activity size={18} className="text-white animate-pulse" />
        </div>
      </div>

      {/* Scrubber Bar */}
      <div className="space-y-1 mb-2">
        <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #a855f7 0%, #00f59b 100%)'
            }}
          />
        </div>
        <div className="flex justify-between text-[9px] font-mono" style={{ color: 'var(--text-3)' }}>
          <span>3:30</span>
          <span>4:20</span>
        </div>
      </div>

      {/* Playback Controls Row: Prev, Play/Pause, Next, Volume */}
      <div className="flex items-center justify-between pt-1">
        <button className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1">
          <SkipBack size={14} />
        </button>

        <button
          onClick={togglePlay}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform hover:scale-105 cursor-pointer shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
            boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)'
          }}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
        </button>

        <button className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1">
          <SkipForward size={14} />
        </button>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>
    </div>
  );
};
