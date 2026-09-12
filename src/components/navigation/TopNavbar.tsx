import React, { useState } from 'react';
import {
  Zap,
  MapPin,
  Bell,
  Settings,
  ChevronDown,
  Palette,
  Search,
  X,
  CloudSun,
  Wind,
  Sun,
  Moon
} from 'lucide-react';
import {
  IoGlobeOutline,
  IoBarChartOutline,
  IoCubeOutline,
  IoFlashOutline,
  IoConstructOutline,
  IoSparklesOutline,
  IoPeopleOutline,
  IoDocumentTextOutline
} from 'react-icons/io5';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { ThemeMode, ActivePage } from '../../types/solterra';
import { GlassSurface } from '../ui/GlassSurface';
import { GradientMenu, MenuItem } from '../ui/gradient-menu';

interface Props {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
  onGoToLanding?: () => void;
}

const THEMES: { id: ThemeMode; label: string; color: string }[] = [
  { id: 'dark-obsidian', label: 'Obsidian', color: '#00f59b' },
  { id: 'midnight-blue', label: 'Midnight', color: '#38bdf8' },
  { id: 'emerald-matrix', label: 'Matrix', color: '#10b981' },
  { id: 'slate-cyber', label: 'Cyber', color: '#818cf8' },
  { id: 'light', label: 'White / Light', color: '#f59e0b' },
];

export const TopNavbar: React.FC<Props> = ({
  onToggleMobileMenu,
  isMobileMenuOpen,
  onGoToLanding
}) => {
  const {
    activePage,
    alerts,
    theme,
    setTheme,
    simulationConfig,
    searchQuery,
    setSearchQuery,
    setIsSettingsOpen,
    setActivePage,
    setIsCopilotOpen
  } = useSolTerraStore();

  const [showTheme, setShowTheme] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const unread = alerts.filter(a => !a.acknowledged).length;

  const fmtHour = (h: number) => {
    const m = Math.floor(h * 60);
    const hh = Math.floor(m / 60) % 24;
    const mm = m % 60;
    return `${hh % 12 || 12}:${mm.toString().padStart(2, '0')} ${hh >= 12 ? 'PM' : 'AM'}`;
  };

  const navMenuItems: MenuItem[] = [
    {
      id: 'citytwin',
      title: 'City Twin',
      icon: <IoGlobeOutline size={18} />,
      active: activePage === 'citytwin',
      onClick: () => setActivePage('citytwin')
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: <IoBarChartOutline size={18} />,
      active: activePage === 'analytics',
      onClick: () => setActivePage('analytics')
    },
    {
      id: 'assets',
      title: 'Assets',
      icon: <IoCubeOutline size={18} />,
      active: activePage === 'assets',
      onClick: () => setActivePage('assets')
    },
    {
      id: 'simulation',
      title: 'Simulate',
      icon: <IoFlashOutline size={18} />,
      active: activePage === 'simulation',
      onClick: () => setActivePage('simulation')
    },
    {
      id: 'maintenance',
      title: 'Maintain',
      icon: <IoConstructOutline size={18} />,
      active: activePage === 'maintenance',
      onClick: () => setActivePage('maintenance'),
      badge: '2'
    },
    {
      id: 'copilot',
      title: 'Copilot',
      icon: <IoSparklesOutline size={18} />,
      active: false,
      onClick: () => setIsCopilotOpen(true)
    },
    {
      id: 'community',
      title: 'Community',
      icon: <IoPeopleOutline size={18} />,
      active: activePage === 'community',
      onClick: () => setActivePage('community')
    },
    {
      id: 'reports',
      title: 'Reports',
      icon: <IoDocumentTextOutline size={18} />,
      active: activePage === 'reports',
      onClick: () => setActivePage('reports')
    }
  ];

  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-7xl pointer-events-auto transition-all duration-300">
      <GlassSurface
        width="100%"
        height="64px"
        borderRadius={32}
        distortionScale={-90}
        redOffset={3}
        greenOffset={8}
        blueOffset={14}
        blur={12}
        backgroundOpacity={0.12}
        saturation={1.5}
        className="w-full px-4 shadow-2xl border border-white/10"
        style={{
          background: theme === 'light' ? 'rgba(255, 255, 255, 0.90)' : 'rgba(9, 12, 22, 0.82)',
          boxShadow: theme === 'light'
            ? '0 16px 40px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 1)'
            : '0 16px 40px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.2)'
        }}
      >
        <div className="w-full flex items-center justify-between gap-2 md:gap-4">
          {/* Brand & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              onClick={onToggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Zap size={20} />}
            </button>

            <div
              className="flex items-center gap-2.5 cursor-pointer select-none group"
              onClick={() => {
                if (onGoToLanding) onGoToLanding();
                else setActivePage('citytwin');
              }}
              title="Click to view Landing Page or Home"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                style={{
                  background: 'rgba(0, 245, 155, 0.12)',
                  border: '1px solid rgba(0, 245, 155, 0.3)',
                  boxShadow: '0 0 15px rgba(0, 245, 155, 0.2)'
                }}
              >
                <Zap size={17} style={{ color: 'var(--accent)' }} />
              </div>
              <div className="hidden sm:block">
                <div className="text-[13px] font-bold tracking-widest font-heading flex items-center gap-1.5" style={{ color: 'var(--text-1)' }}>
                  <span>SOLTERRA</span>
                  <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-white/10 text-emerald-400">TWIN</span>
                </div>
                <div className="text-[9px] tracking-widest uppercase" style={{ color: 'var(--text-3)' }}>
                  Renewable City Twin
                </div>
              </div>
            </div>

            <div
              className="hidden 2xl:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px]"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border)',
                color: 'var(--text-2)'
              }}
            >
              <MapPin size={11} style={{ color: 'var(--accent)' }} />
              <span>Kurnool, Andhra Pradesh</span>
              <ChevronDown size={10} style={{ color: 'var(--text-3)' }} />
            </div>
          </div>

          {/* Center: Liquid Glass Nav Pills Menu (Hover expansion text reveal) */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-3xl px-2">
            <GradientMenu items={navMenuItems} />
          </div>

          {/* Right cluster: Search, telemetry, themes, alerts, settings */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search Input (visible on 2xl) */}
            <div className="hidden 2xl:flex items-center max-w-[170px] relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 rounded-full text-xs outline-none transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-1)',
                }}
              />
            </div>

            {/* Direct White / Dark Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark-obsidian' : 'light')}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 border cursor-pointer shadow-sm flex-shrink-0"
              style={{
                background: theme === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)',
                borderColor: theme === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.18)',
                color: theme === 'light' ? '#d97706' : '#00f59b'
              }}
              title={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to White / Light Theme'}
            >
              {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Theme picker */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowTheme(s => !s);
                  setShowAlerts(false);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:border-opacity-50"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-2)'
                }}
                title="Switch Theme"
              >
                <Palette size={14} />
              </button>
              {showTheme && (
                <div className="absolute right-0 top-10 w-40 py-1 z-50 slide-in glass-sm shadow-2xl">
                  <p className="px-3 py-1 text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>
                    Theme
                  </p>
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setShowTheme(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-[12px] transition-all"
                      style={{
                        color: theme === t.id ? t.color : 'var(--text-2)',
                        background: theme === t.id ? 'rgba(255, 255, 255, 0.05)' : undefined
                      }}
                    >
                      <span>{t.label}</span>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Alerts */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowAlerts(s => !s);
                  setShowTheme(false);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center relative transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-2)'
                }}
                title="System Alerts"
              >
                <Bell size={14} />
                {unread > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold text-black flex items-center justify-center pulse-soft"
                    style={{ background: 'var(--accent-amber)' }}
                  >
                    {unread}
                  </span>
                )}
              </button>
              {showAlerts && (
                <div className="absolute right-0 top-10 w-72 max-h-80 overflow-y-auto py-1 z-50 slide-in glass-sm shadow-2xl">
                  <p
                    className="px-3 py-2 text-[10px] uppercase tracking-widest font-bold flex items-center justify-between"
                    style={{ color: 'var(--text-2)', borderBottom: '1px solid var(--border)' }}
                  >
                    <span>Alerts</span>
                    <span
                      className="px-1.5 py-0.5 rounded-full text-[9px]"
                      style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}
                    >
                      {unread} new
                    </span>
                  </p>
                  {alerts.map(a => (
                    <div key={a.id} className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
                      <div
                        className="text-[11px] font-semibold"
                        style={{
                          color:
                            a.severity === 'critical'
                              ? 'var(--accent-rose)'
                              : a.severity === 'warning'
                              ? 'var(--accent-amber)'
                              : 'var(--accent-2)'
                        }}
                      >
                        {a.title}
                      </div>
                      <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-2)' }}>
                        {a.message}
                      </div>
                      <div className="text-[9px] mt-1 mono" style={{ color: 'var(--text-3)' }}>
                        {a.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/5"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border)',
                color: 'var(--text-2)'
              }}
              title="Settings"
            >
              <Settings size={14} />
            </button>

            {/* Operator Avatar */}
            <div className="hidden sm:flex items-center gap-2 pl-1.5" style={{ borderLeft: '1px solid var(--border)' }}>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shadow-md"
                style={{
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                  color: '#07080f'
                }}
              >
                AD
              </div>
              <div className="hidden xl:block">
                <div className="text-[11px] font-semibold" style={{ color: 'var(--text-1)' }}>
                  Admin
                </div>
                <div className="text-[9px]" style={{ color: 'var(--text-3)' }}>
                  City Operator
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassSurface>

      {/* ── Mobile Navigation Drawer Modal Sheet (Triggered by Hamburger) ────── */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-x-0 top-[76px] z-50 p-4 max-h-[85vh] overflow-y-auto lg:hidden animate-fadeIn"
          onClick={onToggleMobileMenu}
        >
          <div 
            className="w-full rounded-3xl p-5 border shadow-2xl space-y-4 backdrop-blur-2xl"
            style={{ 
              background: theme === 'light' ? 'rgba(255, 255, 255, 0.96)' : 'rgba(10, 14, 26, 0.95)',
              borderColor: 'var(--border)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-wider uppercase" style={{ color: 'var(--text-1)' }}>
                  Navigation Hub
                </span>
              </div>
              <button 
                onClick={onToggleMobileMenu} 
                className="p-1 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Search on Mobile */}
            <div className="relative w-full">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search assets, zones..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl text-xs outline-none transition-all border"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-1)'
                }}
              />
            </div>

            {/* Grid of Navigation Destination Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              {navMenuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    item.onClick?.();
                    if (onToggleMobileMenu) onToggleMobileMenu();
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    item.active
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm font-bold'
                      : 'bg-white/[0.02] text-slate-300 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    item.active ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/5 text-slate-400'
                  }`}>
                    {item.icon}
                  </div>
                  <div className="text-xs font-semibold truncate">
                    {item.title}
                  </div>
                </button>
              ))}
            </div>

            {/* Theme Toggle & Settings Row */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setTheme(theme === 'light' ? 'dark-obsidian' : 'light');
                  if (onToggleMobileMenu) onToggleMobileMenu();
                }}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 text-slate-300"
              >
                {theme === 'light' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-emerald-400" />}
                <span>{theme === 'light' ? 'Light Theme' : 'Dark Theme'}</span>
              </button>

              <button
                onClick={() => {
                  setIsSettingsOpen(true);
                  if (onToggleMobileMenu) onToggleMobileMenu();
                }}
                className="py-2.5 px-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 text-slate-300"
              >
                <Settings size={15} />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom App Dock (Native App Bar for Smartphones) ─────────── */}
      <nav className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md pointer-events-auto">
        <div 
          className="w-full px-2 py-1.5 rounded-full border shadow-2xl flex items-center justify-around backdrop-blur-2xl"
          style={{
            background: theme === 'light' ? 'rgba(255, 255, 255, 0.94)' : 'rgba(10, 14, 26, 0.92)',
            borderColor: 'var(--border)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)'
          }}
        >
          {[
            { id: 'citytwin', label: 'Twin', icon: <IoGlobeOutline size={18} /> },
            { id: 'assets', label: 'Assets', icon: <IoCubeOutline size={18} /> },
            { id: 'simulation', label: 'Sim', icon: <IoFlashOutline size={18} /> },
            { id: 'community', label: 'Civic', icon: <IoPeopleOutline size={18} /> },
          ].map(tab => {
            const isSelected = activePage === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePage(tab.id as any)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
                  isSelected 
                    ? 'text-emerald-400 font-bold scale-105' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className={`p-1 rounded-xl transition-all ${isSelected ? 'bg-emerald-500/15' : ''}`}>
                  {tab.icon}
                </div>
                <span className="text-[10px] tracking-tight">{tab.label}</span>
              </button>
            );
          })}

          {/* More / Menu Drawer Toggle */}
          <button
            onClick={onToggleMobileMenu}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
              isMobileMenuOpen ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isMobileMenuOpen ? 'bg-emerald-500/15' : ''}`}>
              {isMobileMenuOpen ? <X size={18} /> : <Zap size={18} />}
            </div>
            <span className="text-[10px] tracking-tight">More</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default TopNavbar;
