import React, { useState } from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Filter, 
  ShieldCheck,
  ChevronRight,
  Eye,
  Activity,
  Zap,
  Check,
  RotateCcw
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

export const MaintenanceView: React.FC = () => {
  const { maintenanceTasks, updateMaintenanceTaskStatus, assets, setSelectedAsset, setCameraFocus, setActivePage } = useSolTerraStore();
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  const filteredTasks = maintenanceTasks.filter(task => {
    if (severityFilter !== 'all' && task.severity !== severityFilter) return false;
    return true;
  });

  const handleInspectAsset = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      setSelectedAsset(asset);
      setCameraFocus(asset.coordinates);
      setActivePage('citytwin');
    }
  };

  const openTicketsCount = maintenanceTasks.filter(t => t.status !== 'resolved').length;
  const resolvedTodayCount = maintenanceTasks.filter(t => t.status === 'resolved').length;

  return (
    <div className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-48 px-4 sm:px-8 md:px-14 lg:px-20 max-w-7xl mx-auto scroll-smooth select-none transition-colors duration-300">
      
      {/* ── SECTION 1: HERO & DISPATCH OVERVIEW ──────────────────────────────── */}
      <section className="mb-32 md:mb-44 lg:mb-52">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/5">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-amber-400">
                FIELD FLEET & PREDICTIVE DIAGNOSTICS
              </span>
            </div>

            <h1 
              className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight leading-[1.1]" 
              style={{ color: 'var(--text-1)' }}
            >
              Maintenance Intelligence
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal mt-5 leading-relaxed">
              Automated sensor anomaly triage, predictive inverter degradation monitoring, work order dispatch, and field technician tracking across Kurnool.
            </p>
          </div>

          {/* SLA benchmark tag */}
          <div className="flex items-center gap-3">
            <span className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-300 font-mono font-semibold shadow-md flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>SLA Benchmark: &lt; 4.0 hr Target</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: FLEET RELIABILITY & SLA METRICS ────────────────────────── */}
      <section className="mb-32 md:mb-44 lg:mb-52">
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              SECTION 02 · FLEET RELIABILITY INDICES
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight" style={{ color: 'var(--text-1)' }}>
            Service Level Agreements & Uptime
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-normal">
            Real-time tracking of active maintenance work orders, dispatch turnaround, and overall grid availability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* 1. Open Tickets */}
          <div 
            className="p-7 sm:p-9 md:p-10 rounded-[32px] border shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-amber-500/30"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div className="text-xs uppercase font-mono font-bold tracking-wider text-slate-400 mb-6">
              Open Field Tickets
            </div>
            <div>
              <div className="text-4xl sm:text-5xl md:text-6xl font-black font-heading text-amber-400">
                {openTicketsCount}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-normal mt-3">
                Active work orders pending completion
              </div>
            </div>
          </div>

          {/* 2. Mean Time to Resolve */}
          <div 
            className="p-7 sm:p-9 md:p-10 rounded-[32px] border shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/30"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div className="text-xs uppercase font-mono font-bold tracking-wider text-slate-400 mb-6">
              Mean Time to Resolve
            </div>
            <div>
              <div className="text-4xl sm:text-5xl md:text-6xl font-black font-heading text-emerald-400">
                1.8 <span className="text-xl sm:text-2xl font-normal text-emerald-300/60">hrs</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-normal mt-3">
                Significantly below 4.0 hr municipal SLA
              </div>
            </div>
          </div>

          {/* 3. Grid Availability */}
          <div 
            className="p-7 sm:p-9 md:p-10 rounded-[32px] border shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/30"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div className="text-xs uppercase font-mono font-bold tracking-wider text-slate-400 mb-6">
              City Uptime Rate
            </div>
            <div>
              <div className="text-4xl sm:text-5xl md:text-6xl font-black font-heading text-cyan-400">
                99.4%
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-normal mt-3">
                Optimal distribution availability
              </div>
            </div>
          </div>

          {/* 4. Resolved Today */}
          <div 
            className="p-7 sm:p-9 md:p-10 rounded-[32px] border shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-purple-500/30"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div className="text-xs uppercase font-mono font-bold tracking-wider text-slate-400 mb-6">
              Resolved Today
            </div>
            <div>
              <div className="text-4xl sm:text-5xl md:text-6xl font-black font-heading" style={{ color: 'var(--text-1)' }}>
                {resolvedTodayCount}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-normal mt-3">
                Verified operational by engineering
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: WORK ORDERS & FIELD DISPATCH QUEUE ─────────────────────── */}
      <section className="mb-24">
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              SECTION 03 · WORK ORDERS & DISPATCH LOG
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight" style={{ color: 'var(--text-1)' }}>
                Active Maintenance Tickets
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-normal">
                Inspect sensor alerts, examine recommended mitigation protocols, and verify field technician completion.
              </p>
            </div>

            {/* Severity Filter Pills (Scrollable on mobile) */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/5 overflow-x-auto scrollbar-none max-w-full">
              {(['all', 'critical', 'high', 'medium', 'low'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                    severityFilter === sev 
                      ? 'bg-white text-slate-950 shadow-md font-bold' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Work Orders List */}
        <div className="space-y-6 sm:space-y-8">
          {filteredTasks.map(task => {
            const isCritical = task.severity === 'critical';
            const isHigh = task.severity === 'high';
            const isResolved = task.status === 'resolved';

            return (
              <div
                key={task.id}
                className={`p-7 sm:p-9 md:p-12 rounded-[36px] border transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl ${
                  isResolved 
                    ? 'opacity-60 border-white/5' 
                    : isCritical 
                    ? 'border-rose-500/30' 
                    : isHigh 
                    ? 'border-amber-500/30' 
                    : 'hover:border-white/20'
                }`}
                style={{
                  background: isCritical 
                    ? 'linear-gradient(145deg, rgba(244, 63, 94, 0.08) 0%, var(--bg-card) 100%)' 
                    : 'var(--bg-card)',
                  borderColor: isCritical ? 'rgba(244, 63, 94, 0.3)' : 'var(--border)'
                }}
              >
                <div className="space-y-3.5 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`text-xs font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider border ${
                      isCritical ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                      isHigh ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                      'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                    }`}>
                      {task.severity}
                    </span>

                    <span className="text-lg sm:text-xl font-bold font-mono tracking-tight text-white">
                      #{task.assetId} — {task.assetName}
                    </span>

                    <span className="text-xs text-slate-500 font-mono">• Detected {task.detectedTime}</span>
                  </div>

                  <div className="text-base sm:text-lg font-normal text-slate-200">
                    {task.issue}
                  </div>

                  <div className="text-sm text-emerald-400 flex items-center gap-2">
                    <span className="font-semibold text-slate-400">Action Protocol:</span>
                    <span>{task.recommendedAction}</span>
                  </div>

                  {task.assignedTo && (
                    <div className="text-xs text-slate-400 flex items-center gap-2 pt-1">
                      <UserCheck size={14} className="text-cyan-400" />
                      <span>Assigned Technician: <strong className="text-slate-200">{task.assignedTo}</strong></span>
                    </div>
                  )}
                </div>

                {/* Status and Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 self-stretch sm:self-end md:self-center flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                  <button
                    onClick={() => handleInspectAsset(task.assetId)}
                    className="flex-1 sm:flex-none p-3.5 rounded-2xl bg-white/[0.04] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer border border-white/5 flex items-center justify-center gap-2 text-xs font-semibold"
                    title="Locate Asset in 3D City Twin"
                  >
                    <Eye size={16} />
                    <span>View in 3D</span>
                  </button>

                  {task.status !== 'resolved' ? (
                    <button
                      onClick={() => updateMaintenanceTaskStatus(task.id, 'resolved')}
                      className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <CheckCircle2 size={15} />
                      <span>Mark Resolved</span>
                    </button>
                  ) : (
                    <span className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-white/[0.04] text-slate-400 text-xs font-semibold flex items-center justify-center gap-2 border border-white/5">
                      <Check size={15} className="text-emerald-400" />
                      <span>Resolved</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div 
            className="py-24 text-center rounded-[32px] border border-white/5 p-8 space-y-4"
            style={{ background: 'var(--bg-card)' }}
          >
            <ShieldCheck size={42} className="mx-auto text-emerald-400 opacity-60" />
            <h3 className="text-xl font-bold text-slate-300">No maintenance tickets in this severity filter</h3>
            <button
              onClick={() => setSeverityFilter('all')}
              className="mt-3 px-6 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold cursor-pointer transition-colors"
            >
              Show All Tickets
            </button>
          </div>
        )}
      </section>

    </div>
  );
};

export default MaintenanceView;
