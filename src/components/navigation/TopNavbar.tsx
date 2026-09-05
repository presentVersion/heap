import React, { useState } from 'react';
import { Zap, MapPin, Bell, Settings, ChevronDown, Palette, Search, X, CloudSun, Wind } from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { ThemeMode } from '../../types/solterra';

interface Props { onToggleMobileMenu?: () => void; isMobileMenuOpen?: boolean; }

const THEMES: { id: ThemeMode; label: string; color: string }[] = [
  { id: 'dark-obsidian',  label: 'Obsidian',  color: '#00f59b' },
  { id: 'midnight-blue',  label: 'Midnight',  color: '#38bdf8' },
  { id: 'emerald-matrix', label: 'Matrix',    color: '#10b981' },
  { id: 'slate-cyber',    label: 'Cyber',     color: '#818cf8' },
];

export const TopNavbar: React.FC<Props> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { alerts, theme, setTheme, simulationConfig, searchQuery, setSearchQuery, setIsSettingsOpen, setActivePage } = useSolTerraStore();
  const [showTheme,  setShowTheme]  = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const unread = alerts.filter(a => !a.acknowledged).length;

  const fmtHour = (h: number) => {
    const m = Math.floor(h * 60);
    const hh = Math.floor(m / 60) % 24;
    const mm = m % 60;
    return `${hh % 12 || 12}:${mm.toString().padStart(2,'0')} ${hh >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <header className="h-14 flex-shrink-0 flex items-center justify-between px-5 border-b"
      style={{ background: 'rgba(7,8,15,0.92)', backdropFilter: 'blur(20px)', borderColor: 'var(--border)' }}>

      {/* Brand */}
      <div className="flex items-center gap-4">
        <button className="md:hidden text-slate-400 hover:text-white" onClick={onToggleMobileMenu}>
          {isMobileMenuOpen ? <X size={20}/> : <Zap size={20}/>}
        </button>
        <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => setActivePage('citytwin')}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(0,245,155,0.12)', border: '1px solid rgba(0,245,155,0.25)' }}>
            <Zap size={17} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <div className="text-[13px] font-bold tracking-widest font-heading" style={{ color: 'var(--text-1)' }}>SOLTERRA</div>
            <div className="text-[9px] tracking-widest uppercase" style={{ color: 'var(--text-3)' }}>Renewable City Twin</div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px]"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
          <MapPin size={11} style={{ color: 'var(--accent)' }} />
          <span>Kurnool, Andhra Pradesh</span>
          <ChevronDown size={10} style={{ color: 'var(--text-3)' }}/>
        </div>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
        <div className="relative w-full">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
          <input
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search assets, zones…"
            className="w-full pl-8 pr-3 py-1.5 rounded-xl text-[12px] outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
              color: 'var(--text-1)', caretColor: 'var(--accent)'
            }}
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] mono px-1 rounded"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>⌘K</span>
        </div>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-2">
        {/* Sim badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
          style={{ background: 'rgba(0,245,155,0.08)', border: '1px solid rgba(0,245,155,0.2)', color: 'var(--accent)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-current pulse-soft" />
          LIVE SIM
        </div>

        {/* Weather */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px]"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
          <CloudSun size={13} style={{ color: 'var(--accent-amber)' }} />
          <span>{simulationConfig.ambientTemperature}°C</span>
          <Wind size={12} style={{ color: 'var(--accent-2)' }} />
          <span className="capitalize">{simulationConfig.weatherScenario}</span>
        </div>

        {/* Time */}
        <div className="hidden sm:block text-right">
          <div className="text-[12px] font-semibold mono" style={{ color: 'var(--text-1)' }}>
            {fmtHour(simulationConfig.simulatedHour)}
          </div>
          <div className="text-[9px]" style={{ color: 'var(--text-3)' }}>{simulationConfig.targetDate}</div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 hidden sm:block" style={{ background: 'var(--border)' }} />

        {/* Theme picker */}
        <div className="relative">
          <button onClick={() => { setShowTheme(s => !s); setShowAlerts(false); }}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:border-opacity-50"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
            <Palette size={14} />
          </button>
          {showTheme && (
            <div className="absolute right-0 top-10 w-40 py-1 z-50 slide-in glass-sm shadow-2xl">
              <p className="px-3 py-1 text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>Theme</p>
              {THEMES.map(t => (
                <button key={t.id} onClick={() => { setTheme(t.id); setShowTheme(false); }}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[12px] transition-all"
                  style={{ color: theme === t.id ? t.color : 'var(--text-2)', background: theme === t.id ? 'rgba(255,255,255,0.05)' : undefined }}>
                  <span>{t.label}</span>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alerts */}
        <div className="relative">
          <button onClick={() => { setShowAlerts(s => !s); setShowTheme(false); }}
            className="w-8 h-8 rounded-xl flex items-center justify-center relative transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
            <Bell size={14} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold text-black flex items-center justify-center pulse-soft"
                style={{ background: 'var(--accent-amber)' }}>{unread}</span>
            )}
          </button>
          {showAlerts && (
            <div className="absolute right-0 top-10 w-72 max-h-80 overflow-y-auto py-1 z-50 slide-in glass-sm shadow-2xl">
              <p className="px-3 py-2 text-[10px] uppercase tracking-widest font-bold flex items-center justify-between"
                style={{ color: 'var(--text-2)', borderBottom: '1px solid var(--border)' }}>
                <span>Alerts</span>
                <span className="px-1.5 py-0.5 rounded-full text-[9px]"
                  style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--accent-amber)' }}>{unread} new</span>
              </p>
              {alerts.map(a => (
                <div key={a.id} className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="text-[11px] font-semibold" style={{
                    color: a.severity === 'critical' ? 'var(--accent-rose)'
                      : a.severity === 'warning' ? 'var(--accent-amber)' : 'var(--accent-2)' }}>
                    {a.title}
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-2)' }}>{a.message}</div>
                  <div className="text-[9px] mt-1 mono" style={{ color: 'var(--text-3)' }}>{a.timestamp}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <button onClick={() => setIsSettingsOpen(true)}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
          <Settings size={14} />
        </button>

        {/* Avatar */}
        <div className="hidden sm:flex items-center gap-2 pl-2" style={{ borderLeft: '1px solid var(--border)' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#07080f' }}>
            AD
          </div>
          <div className="hidden lg:block">
            <div className="text-[11px] font-semibold" style={{ color: 'var(--text-1)' }}>Admin</div>
            <div className="text-[9px]" style={{ color: 'var(--text-3)' }}>City Operator</div>
          </div>
        </div>
      </div>
    </header>
  );
};
