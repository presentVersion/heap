import React from 'react';
import { 
  Users, 
  Leaf, 
  Zap, 
  Droplets, 
  Award, 
  Calendar, 
  MapPin, 
  HeartHandshake, 
  Check, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

export const CommunityView: React.FC = () => {
  const { communityProjects, joinCommunityProject } = useSolTerraStore();

  const totalMembers = communityProjects.reduce((acc, p) => acc + p.membersCount, 0);
  const totalCleanMwh = communityProjects.reduce((acc, p) => acc + p.energyGeneratedMwh, 0);
  const totalWaterSaved = communityProjects.reduce((acc, p) => acc + p.waterSavedLiters, 0);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 md:p-6 space-y-6 text-left">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white font-heading tracking-tight">
          Community Sustainability Hub
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Empowering Kurnool citizens through neighborhood renewable energy cooperatives, green mobility, and water stewardship.
        </p>
      </div>

      {/* Collective Impact KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="glass-card p-4 rounded-xl border border-white/10">
          <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <Users size={14} className="text-emerald-400" />
            <span>Active Citizen Members</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono-telemetry mt-1">
            {totalMembers.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp size={11} /> +184 joined this month
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-white/10">
          <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <Zap size={14} className="text-amber-400" />
            <span>Community Clean Power</span>
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono-telemetry mt-1">
            {totalCleanMwh.toFixed(1)} MWh
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Modeled rooftop & micro-solar yield
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-white/10">
          <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <Droplets size={14} className="text-cyan-400" />
            <span>Water Conserved & Filtered</span>
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-mono-telemetry mt-1">
            {(totalWaterSaved / 1000).toFixed(0)}k Liters
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Through urban catchment basins
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-white/10">
          <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <Leaf size={14} className="text-emerald-400" />
            <span>Avoided Carbon</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono-telemetry mt-1">
            {(totalCleanMwh * 0.442).toFixed(1)} Tons
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">
            Clean air dividend for Kurnool
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <HeartHandshake size={16} className="text-emerald-400" />
          <span>Active Neighborhood Sustainability Projects</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communityProjects.map(project => (
            <div
              key={project.id}
              className="glass-panel p-5 border border-white/10 shadow-xl flex flex-col justify-between space-y-4 hover:border-emerald-400/30 transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {project.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{project.name}</h3>
                  </div>

                  <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    {project.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-3">
                  <MapPin size={12} className="text-slate-500" />
                  <span>{project.location}</span>
                </div>
              </div>

              {/* Progress & Metrics */}
              <div className="space-y-2 pt-3 border-t border-white/[0.06]">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Target Progress</span>
                  <span className="font-mono-telemetry text-emerald-400 font-bold">{project.progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${project.progressPercent}%` }} />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">
                    <strong className="text-white font-mono-telemetry">{project.membersCount}</strong> members participating
                  </span>

                  <button
                    onClick={() => joinCommunityProject(project.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 font-semibold text-xs flex items-center space-x-1.5 transition-all shadow-[0_0_10px_rgba(0,245,155,0.15)]"
                  >
                    <span>Join Cooperative</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Workshops Calendar */}
      <div className="glass-panel p-5 border border-white/10 shadow-xl space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <Calendar size={15} className="text-emerald-400" />
          <span>Upcoming Citizen Clean Energy Workshops</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-[10px] text-amber-400 font-bold font-mono-telemetry">Saturday, May 30 • 10:00 AM</div>
            <div className="text-sm font-bold text-white mt-1">Rooftop Solar Subsidy & Metering Clinic</div>
            <p className="text-[11px] text-slate-400 mt-1">Learn net-metering interconnection procedures with Andhra Pradesh DISCOM officials.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-[10px] text-cyan-400 font-bold font-mono-telemetry">Wednesday, June 3 • 4:30 PM</div>
            <div className="text-sm font-bold text-white mt-1">Riverfront Bio-Junction Tour</div>
            <p className="text-[11px] text-slate-400 mt-1">Hands-on inspection of the BJ-07 roundabout algae bioreactor monument and carbon capture loops.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-[10px] text-emerald-400 font-bold font-mono-telemetry">Saturday, June 6 • 11:00 AM</div>
            <div className="text-sm font-bold text-white mt-1">Youth Microgrid Hackathon</div>
            <p className="text-[11px] text-slate-400 mt-1">High school students build miniature IoT telemetry smart poles at Kurnool STEM Center.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
