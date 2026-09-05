import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  KeyRound, 
  Palette, 
  Boxes, 
  Check, 
  ExternalLink, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { ThemeMode } from '../../types/solterra';

export const SettingsModal: React.FC = () => {
  const { 
    isSettingsOpen, 
    setIsSettingsOpen, 
    mapboxToken, 
    setMapboxToken, 
    theme, 
    setTheme, 
    resetScenario,
    setSimulatedHour 
  } = useSolTerraStore();

  const [inputToken, setInputToken] = useState(mapboxToken);
  const [tokenSaved, setTokenSaved] = useState(false);

  if (!isSettingsOpen) return null;

  const handleSaveToken = () => {
    setMapboxToken(inputToken.trim());
    setTokenSaved(true);
    setTimeout(() => setTokenSaved(false), 2000);
  };

  const themes: { id: ThemeMode; label: string; desc: string; color: string }[] = [
    { id: 'dark-obsidian', label: 'Obsidian Neon', desc: 'SolTerra deep space dark with electric emerald accents', color: '#00f59b' },
    { id: 'midnight-blue', label: 'Midnight Blue', desc: 'Navy blue ambient atmosphere with cyan energy flows', color: '#38bdf8' },
    { id: 'emerald-matrix', label: 'Emerald Matrix', desc: 'Lush bio-luminescent forest dark mode with mint glow', color: '#10b981' },
    { id: 'slate-cyber', label: 'Slate Cyber', desc: 'Industrial aerospace dark slate with purple grid accents', color: '#818cf8' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-xl glass-panel border border-white/15 shadow-2xl flex flex-col overflow-hidden text-left animate-fadeIn max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-white/[0.05] text-emerald-400">
              <Settings size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-heading">
                SolTerra System Configuration
              </h2>
              <p className="text-[10px] text-slate-400">
                Mapbox tokens, visual theme modes, and 3D asset registry
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Section 1: Mapbox Token Configuration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
                <KeyRound size={15} className="text-amber-400" />
                <span>Mapbox Public Access Token</span>
              </div>
              <a
                href="https://account.mapbox.com/access-tokens/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <span>Get Free Token</span>
                <ExternalLink size={10} />
              </a>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              You can store your Mapbox public token in two ways:
            </p>
            <div className="text-[11px] text-slate-400 space-y-1 bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
              <div><strong>Option 1 (Instant):</strong> Paste your token (<code className="text-emerald-300 font-mono-telemetry">pk.eyJ1...</code>) below and click Save. It takes effect immediately without restarting!</div>
              <div><strong>Option 2 (.env file):</strong> Open <code className="text-cyan-300 font-mono-telemetry">.env</code> in the project folder and set <code className="text-cyan-300 font-mono-telemetry">VITE_MAPBOX_TOKEN=your_token</code>.</div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="pk.eyJ1IjoieW91ci1hY2NvdW50IiwiYSI6ImNs..."
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs font-mono-telemetry text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <button
                onClick={handleSaveToken}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,245,155,0.3)] flex items-center space-x-1.5 flex-shrink-0"
              >
                {tokenSaved ? <Check size={14} /> : <CheckCircle2 size={14} />}
                <span>{tokenSaved ? 'Saved!' : 'Save & Activate'}</span>
              </button>
            </div>
            {mapboxToken && (
              <div className="text-[10px] text-emerald-400 flex items-center space-x-1 font-semibold">
                <CheckCircle2 size={12} />
                <span>Token active • Mapbox GL JS 3D satellite/vector layer enabled</span>
              </div>
            )}
          </div>

          {/* Section 2: Visual Theme Selection */}
          <div className="space-y-3 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
              <Palette size={15} className="text-emerald-400" />
              <span>Theme & Visual Styling</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-3 ${
                    theme === t.id
                      ? 'bg-white/[0.08] border-emerald-400 shadow-[0_0_15px_rgba(0,245,155,0.15)]'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: t.color }} />
                  <div>
                    <div className="text-xs font-bold text-white">{t.label}</div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: 3D Model Registry Status */}
          <div className="space-y-3 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
              <Boxes size={15} className="text-cyan-400" />
              <span>Discovered 3D Asset Registry</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">smartflower_fbx.glb (13.8 MB)</div>
                  <div className="text-[10px] text-slate-400">Mapped to: Solar Flower (SF-042)</div>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10">Loaded</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">soler_panel_setup.glb (383 KB)</div>
                  <div className="text-[10px] text-slate-400">Mapped to: Solar Canopy (SC-021)</div>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10">Loaded</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">solar_panel_1x1.glb (868 KB)</div>
                  <div className="text-[10px] text-slate-400">Mapped to: Rooftop Solar Array (PV-210)</div>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10">Loaded</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">meshy-model.glb (94.4 MB)</div>
                  <div className="text-[10px] text-slate-400">Mapped to: Bio-Junction Roundabout Monument (BJ-07)</div>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10">Active Replacement</span>
              </div>
            </div>
          </div>

          {/* Section 4: Reset Baseline */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Reset Simulation State</div>
              <div className="text-[10px] text-slate-400">Reverts all scenarios, time slider, and weather back to midday baseline.</div>
            </div>
            <button
              onClick={() => {
                resetScenario();
                setSimulatedHour(12.0);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-all"
            >
              <RotateCcw size={13} />
              <span>Reset Baseline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
