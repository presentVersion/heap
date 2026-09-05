import React from 'react';
import { Globe2, BarChart3, Boxes, Activity, Wrench, Sparkles, FileText, Users, Settings, ChevronLeft, ChevronRight, ShieldCheck, X } from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { ActivePage } from '../../types/solterra';

interface Props { isCollapsed: boolean; setIsCollapsed: (v: boolean) => void; isMobileOpen?: boolean; onCloseMobile?: () => void; }

const NAV: { id: ActivePage; label: string; icon: any; badge?: string }[] = [
  { id: 'citytwin',    label: 'City Twin',   icon: Globe2    },
  { id: 'analytics',   label: 'Analytics',   icon: BarChart3 },
  { id: 'assets',      label: 'Assets',      icon: Boxes     },
  { id: 'simulation',  label: 'Simulation',  icon: Activity  },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, badge: '2' },
  { id: 'copilot',     label: 'AI Copilot',  icon: Sparkles  },
  { id: 'community',   label: 'Community',   icon: Users     },
  { id: 'reports',     label: 'Reports',     icon: FileText  },
];

export const Sidebar: React.FC<Props> = ({ isCollapsed, setIsCollapsed, isMobileOpen, onCloseMobile }) => {
  const { activePage, setActivePage, setIsSettingsOpen, setIsCopilotOpen } = useSolTerraStore();

  const handleClick = (id: ActivePage) => {
    if (id === 'copilot') setIsCopilotOpen(true);
    else setActivePage(id);
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ background: 'rgba(0,0,0,0.65)' }} onClick={onCloseMobile} />
      )}

      <aside
        style={{
          width: isCollapsed ? 64 : 200,
          background: 'rgba(7,8,15,0.95)',
          borderRight: '1px solid var(--border)',
          backdropFilter: 'blur(20px)',
        }}
        className={`
          fixed md:static inset-y-0 left-0 z-50 flex flex-col
          transition-all duration-300 ease-in-out flex-shrink-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Mobile close */}
        {isMobileOpen && (
          <button onClick={onCloseMobile} className="md:hidden absolute top-3 right-3 p-1 rounded-lg" style={{ color: 'var(--text-3)' }}>
            <X size={16} />
          </button>
        )}

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                className="w-full flex items-center rounded-xl text-[13px] font-medium transition-all duration-150 relative group"
                style={{
                  padding: isCollapsed ? '10px 14px' : '9px 12px',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  gap: isCollapsed ? 0 : 10,
                  color: active ? 'var(--accent)' : 'var(--text-2)',
                  background: active ? 'rgba(0,245,155,0.08)' : 'transparent',
                  border: active ? '1px solid rgba(0,245,155,0.18)' : '1px solid transparent',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                {/* Active bar */}
                {active && <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full" style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />}
                <Icon size={16} style={{ flexShrink: 0 }} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {!isCollapsed && item.badge && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--accent-amber)' }}>
                    {item.badge}
                  </span>
                )}
                {/* Tooltip when collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none slide-in"
                    style={{ background: 'var(--bg-2, #0b0e1a)', border: '1px solid var(--border)', color: 'var(--text-1)' }}>
                    {item.label}
                    {item.badge && <span className="ml-1.5 text-[9px] font-bold" style={{ color: 'var(--accent-amber)' }}>({item.badge})</span>}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 py-3 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
          {/* City status */}
          {!isCollapsed && (
            <div className="px-3 py-2.5 rounded-xl" style={{ background: 'rgba(0,245,155,0.05)', border: '1px solid rgba(0,245,155,0.12)' }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-3)' }}>City Status</span>
                <span className="w-2 h-2 rounded-full pulse-soft" style={{ background: 'var(--accent)' }} />
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>
                <ShieldCheck size={12} /> All systems normal
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center">
              <span className="w-2.5 h-2.5 rounded-full pulse-soft" style={{ background: 'var(--accent)' }} title="All systems normal" />
            </div>
          )}

          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex w-full items-center justify-center py-2 rounded-xl text-[11px] transition-all"
            style={{ color: 'var(--text-3)', gap: isCollapsed ? 0 : 6 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'; }}
          >
            {isCollapsed ? <ChevronRight size={14}/> : <><ChevronLeft size={14}/><span>Collapse</span></>}
          </button>

          {/* Settings shortcut */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center rounded-xl py-2 text-[12px] transition-all"
            style={{
              padding: isCollapsed ? '8px 14px' : '8px 12px',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: isCollapsed ? 0 : 8,
              color: 'var(--text-3)',
            }}
            title={isCollapsed ? 'Settings' : undefined}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'; }}
          >
            <Settings size={14} style={{ flexShrink: 0 }} />
            {!isCollapsed && <span>Settings</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
