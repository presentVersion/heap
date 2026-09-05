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
  Eye
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

export const MaintenanceView: React.FC = () => {
  const { maintenanceTasks, updateMaintenanceTaskStatus, assets, setSelectedAsset, setActivePage } = useSolTerraStore();
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  const filteredTasks = maintenanceTasks.filter(task => {
    if (severityFilter !== 'all' && task.severity !== severityFilter) return false;
    return true;
  });

  const handleInspectAsset = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      setSelectedAsset(asset);
      setActivePage('citytwin');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 md:p-6 space-y-5 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white font-heading tracking-tight">
            Maintenance Intelligence & Work Orders
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated anomaly detection, predictive diagnostics, and field task dispatch.
          </p>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/[0.08]">
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                severityFilter === sev 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card p-3.5 rounded-xl border border-white/10">
          <div className="text-[10px] uppercase font-bold text-slate-400">Open Tickets</div>
          <div className="text-xl font-bold text-amber-400 font-mono-telemetry mt-1">
            {maintenanceTasks.filter(t => t.status !== 'resolved').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Requires field review</div>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-white/10">
          <div className="text-[10px] uppercase font-bold text-slate-400">Mean Time to Resolve</div>
          <div className="text-xl font-bold text-emerald-400 font-mono-telemetry mt-1">1.8 hrs</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Below 4hr SLA target</div>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-white/10">
          <div className="text-[10px] uppercase font-bold text-slate-400">City Uptime Rate</div>
          <div className="text-xl font-bold text-cyan-400 font-mono-telemetry mt-1">99.4%</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Optimal availability</div>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-white/10">
          <div className="text-[10px] uppercase font-bold text-slate-400">Resolved Today</div>
          <div className="text-xl font-bold text-white font-mono-telemetry mt-1">
            {maintenanceTasks.filter(t => t.status === 'resolved').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Verified clean</div>
        </div>
      </div>

      {/* Work Orders List */}
      <div className="space-y-3">
        {filteredTasks.map(task => {
          const isCritical = task.severity === 'critical';
          const isHigh = task.severity === 'high';
          const isResolved = task.status === 'resolved';

          return (
            <div
              key={task.id}
              className={`glass-panel p-4 border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                isResolved 
                  ? 'border-white/[0.06] opacity-70' 
                  : isCritical 
                  ? 'border-rose-500/30 bg-rose-500/[0.02]' 
                  : isHigh 
                  ? 'border-amber-500/30 bg-amber-500/[0.02]' 
                  : 'border-white/10'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2.5">
                  <span className={`text-xs font-bold font-mono-telemetry px-2 py-0.5 rounded uppercase border ${
                    isCritical ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                    isHigh ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                  }`}>
                    {task.severity}
                  </span>

                  <span className="text-sm font-bold text-white font-mono-telemetry">
                    {task.assetId} — {task.assetName}
                  </span>

                  <span className="text-xs text-slate-500">• {task.detectedTime}</span>
                </div>

                <div className="text-xs text-slate-300 font-medium">{task.issue}</div>

                <div className="text-[11px] text-emerald-400/90 flex items-center space-x-1.5">
                  <span className="font-semibold text-slate-400">Action:</span>
                  <span>{task.recommendedAction}</span>
                </div>

                {task.assignedTo && (
                  <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                    <UserCheck size={12} className="text-cyan-400" />
                    <span>Assigned to: <strong className="text-slate-200">{task.assignedTo}</strong></span>
                  </div>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center space-x-2.5 self-end md:self-center">
                <button
                  onClick={() => handleInspectAsset(task.assetId)}
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 transition-colors"
                  title="Locate Asset on 3D Digital Twin"
                >
                  <Eye size={15} />
                </button>

                {task.status !== 'resolved' ? (
                  <button
                    onClick={() => updateMaintenanceTaskStatus(task.id, 'resolved')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 font-semibold text-xs flex items-center space-x-1.5 transition-all"
                  >
                    <CheckCircle2 size={13} />
                    <span>Mark Resolved</span>
                  </button>
                ) : (
                  <span className="px-3 py-1 rounded-xl bg-white/[0.04] text-slate-500 text-xs font-semibold flex items-center space-x-1">
                    <CheckCircle2 size={13} />
                    <span>Resolved</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
