import React, { useState } from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  Activity, 
  Zap, 
  Cpu, 
  Search 
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

export const MaintenanceView: React.FC = () => {
  const { maintenanceTasks, updateMaintenanceTaskStatus, assets, setSelectedAsset, setCameraFocus, setActivePage } = useSolTerraStore();
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const solarCards = [
    {
      id: 'maint-101',
      assetId: 'PV-210',
      assetName: 'Rooftop Solar Array',
      image: '/images/solar/solar-tech-4.jpg',
      span: 'col-span-12 lg:col-span-8',
      severity: 'high',
      status: 'in_progress',
      issue: 'Inverter thermal throttling triggered by dust accumulation on primary heatsink.',
      metric: '+3.8 kW Capacity Recovery'
    },
    {
      id: 'maint-102',
      assetId: 'SF-042',
      assetName: 'Solar Flower Cluster',
      image: '/images/solar/solar-rows-2.jpg',
      span: 'col-span-12 lg:col-span-4',
      severity: 'medium',
      status: 'assigned',
      issue: 'Azimuth dual-axis tracker servo calibration offset by +3.5 degrees.',
      metric: '99.1% Sun Tracking'
    },
    {
      id: 'maint-103',
      assetId: 'SP-118',
      assetName: 'Smart Pole Storage',
      image: '/images/solar/solar-storage-17.jpg',
      span: 'col-span-12 lg:col-span-4',
      severity: 'critical',
      status: 'pending',
      issue: 'LiFePO4 battery cell balance deviation exceeding 0.45V threshold.',
      metric: '84% Reserve Health'
    },
    {
      id: 'maint-104',
      assetId: 'DRN-003',
      assetName: 'Aerial Thermography Drone',
      image: '/images/solar/solar-drone-9.jpg',
      span: 'col-span-12 lg:col-span-8',
      severity: 'high',
      status: 'in_progress',
      issue: 'Thermal infrared aerial scan detected 4 hot-spot cells in Sector 07.',
      metric: '14,000 Panels Scanned'
    },
    {
      id: 'maint-105',
      assetId: 'SUB-132KV',
      assetName: 'Ultra Mega Substation',
      image: '/images/solar/solar-substation-12.jpg',
      span: 'col-span-12 lg:col-span-6',
      severity: 'medium',
      status: 'assigned',
      issue: 'Step-up transmission transformer oil dielectric verification scheduled.',
      metric: '132 kV Grid Synced'
    },
    {
      id: 'maint-106',
      assetId: 'CLN-ROBOT',
      assetName: 'Waterless Cleaning Fleet',
      image: '/images/solar/solar-clean-16.jpg',
      span: 'col-span-12 lg:col-span-6',
      severity: 'low',
      status: 'resolved',
      issue: 'Nightly dust scrubbing cycle executed across 32 tracker strings.',
      metric: '+4.2% Irradiance Gain'
    },
    {
      id: 'maint-107',
      assetId: 'SEN-MTN',
      assetName: 'Mountain Ridge PV Array',
      image: '/images/solar/solar-mountain-6.jpg',
      span: 'col-span-12 lg:col-span-8',
      severity: 'medium',
      status: 'assigned',
      issue: 'High-altitude optical pyranometer sensor solar drift recalibration.',
      metric: '99.8% Sensor Accuracy'
    },
    {
      id: 'maint-108',
      assetId: 'ENG-CREW',
      assetName: 'Mobile Field Engineering',
      image: '/images/solar/solar-engineer-11.jpg',
      span: 'col-span-12 lg:col-span-4',
      severity: 'low',
      status: 'resolved',
      issue: 'Quarterly technician safety certification and high-voltage gear review.',
      metric: 'Zero Incidents: 412 Days'
    }
  ];

  const filteredSolarCards = solarCards.filter(card => {
    if (severityFilter !== 'all' && card.severity !== severityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        card.assetName.toLowerCase().includes(q) ||
        card.assetId.toLowerCase().includes(q) ||
        card.issue.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleInspectAsset = (assetId: string) => {
    const asset = assets.find(a => a.id.includes(assetId) || assetId.includes(a.id));
    if (asset) {
      setSelectedAsset(asset);
      setCameraFocus(asset.coordinates);
    }
    setActivePage('citytwin');
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden pt-24 sm:pt-32 md:pt-36 pb-36 px-4 sm:px-6 md:px-10 lg:px-12 max-w-7xl mx-auto scroll-smooth select-none">
      
      {/* ── HERO SECTION: Sharp Square & Large Bold Typography ──────────────── */}
      <section className="mb-16 sm:mb-24 md:mb-32">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-emerald-500/30">
          <div className="max-w-4xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-[#00f59b] animate-ping" />
              <span className="text-sm font-mono font-bold tracking-widest uppercase text-[#00f59b]">
                SOLAR FLEET DIAGNOSTICS & FIELD DISPATCH
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading tracking-tight text-white leading-none">
              Solar Maintenance Hub
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl text-emerald-300 font-semibold tracking-tight">
              Real-time solar farm diagnostics, automated drone thermography, and rapid field technician dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="px-6 py-4 bg-emerald-950/80 border border-emerald-500/40 text-sm sm:text-base text-emerald-200 font-mono font-bold flex items-center gap-3 shadow-xl">
              <ShieldCheck size={22} className="text-[#00f59b]" />
              <span>SLA Target: &lt; 2.0 hr Turnaround</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── KEY METRIC BENTO CARDS ───────────────────────────────────────────── */}
      <section className="mb-16 sm:mb-24 md:mb-32">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-white">
            Fleet Reliability Indices
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bento-card p-8 sm:p-10 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
            <span className="text-sm uppercase font-mono font-bold text-emerald-400">Open Tickets</span>
            <div className="my-4">
              <div className="text-6xl sm:text-7xl font-black font-heading text-amber-400">03</div>
              <div className="text-lg sm:text-xl text-white font-bold mt-2">Active Field Work Orders</div>
            </div>
            <span className="text-sm font-mono text-emerald-300">All Dispatched to Technicians</span>
          </div>

          <div className="bento-card p-8 sm:p-10 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
            <span className="text-sm uppercase font-mono font-bold text-emerald-400">Mean Resolution Time</span>
            <div className="my-4">
              <div className="text-6xl sm:text-7xl font-black font-heading text-[#00f59b]">1.4 <span className="text-3xl font-normal text-emerald-400/70">hrs</span></div>
              <div className="text-lg sm:text-xl text-white font-bold mt-2">Average Dispatch Speed</div>
            </div>
            <span className="text-sm font-mono text-emerald-300">65% Faster Than Target</span>
          </div>

          <div className="bento-card p-8 sm:p-10 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
            <span className="text-sm uppercase font-mono font-bold text-emerald-400">Solar Park Uptime</span>
            <div className="my-4">
              <div className="text-6xl sm:text-7xl font-black font-heading text-cyan-400">99.7%</div>
              <div className="text-lg sm:text-xl text-white font-bold mt-2">Photovoltaic Grid Availability</div>
            </div>
            <span className="text-sm font-mono text-emerald-300">Kurnool Ultra Mega Solar Zone</span>
          </div>

          <div className="bento-card p-8 sm:p-10 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
            <span className="text-sm uppercase font-mono font-bold text-emerald-400">Resolved Today</span>
            <div className="my-4">
              <div className="text-6xl sm:text-7xl font-black font-heading text-white">08</div>
              <div className="text-lg sm:text-xl text-white font-bold mt-2">Verified Operations</div>
            </div>
            <span className="text-sm font-mono text-emerald-300">Zero Critical Alerts Remaining</span>
          </div>
        </div>
      </section>

      {/* ── SOLAR FARM BENTO GRID (Sharp Square, Large Text, Strictly One-Line) ── */}
      <section className="mb-16 sm:mb-24 md:mb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-white">
              Active Solar Farm Maintenance Bento
            </h2>
          </div>

          {/* Search & Severity Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search solar tickets..."
                className="pl-10 pr-4 py-2.5 text-sm bg-emerald-950/60 border border-emerald-500/30 text-white outline-none font-medium"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-emerald-950/60 border border-emerald-500/30">
              {(['all', 'critical', 'high', 'medium', 'low'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-3.5 py-2 text-sm font-bold uppercase transition-all cursor-pointer ${
                    severityFilter === sev
                      ? 'bg-[#00f59b] text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {filteredSolarCards.map(card => {
            const isCritical = card.severity === 'critical';
            const isHigh = card.severity === 'high';
            const isResolved = card.status === 'resolved';

            return (
              <div
                key={card.id}
                className={`${card.span} bento-card group flex flex-col justify-between`}
                style={{
                  background: 'linear-gradient(180deg, rgba(8, 32, 19, 0.92) 0%, rgba(2, 12, 7, 0.98) 100%)',
                  borderColor: isCritical ? 'rgba(244, 63, 94, 0.5)' : isHigh ? 'rgba(245, 158, 11, 0.5)' : 'rgba(16, 185, 129, 0.3)'
                }}
              >
                {/* Solar Farm Image Header */}
                <div className="relative w-full h-56 sm:h-64 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.assetName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-95"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020c07] via-transparent to-black/40" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className={`px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider ${
                      isCritical ? 'bg-rose-500 text-white' :
                      isHigh ? 'bg-amber-500 text-slate-950' :
                      'bg-emerald-500 text-slate-950'
                    }`}>
                      {card.severity} TICKET
                    </span>

                    <span className="px-4 py-1.5 bg-black/80 border border-white/20 text-xs font-mono font-bold text-[#00f59b]">
                      {card.metric}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl sm:text-3xl font-black font-heading text-white">
                      #{card.assetId} · {card.assetName}
                    </h3>
                  </div>
                </div>

                {/* Body: Single Large Clear Line */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="text-lg sm:text-xl font-bold text-emerald-100 leading-snug">
                    {card.issue}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => handleInspectAsset(card.assetId)}
                      className="flex-1 py-3.5 px-4 bg-white/5 hover:bg-emerald-500/20 border border-white/15 text-sm font-bold text-white hover:text-emerald-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Eye size={16} />
                      <span>View in 3D</span>
                    </button>

                    <button
                      onClick={() => updateMaintenanceTaskStatus(card.id, 'resolved')}
                      className={`flex-1 py-3.5 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isResolved
                          ? 'bg-white/10 text-slate-400 border border-white/15'
                          : 'bg-[#00f59b] hover:bg-[#00f59b]/90 text-slate-950 shadow-lg'
                      }`}
                    >
                      <CheckCircle2 size={16} />
                      <span>{isResolved ? 'Resolved' : 'Resolve Ticket'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── AUTOMATED PROTOCOLS SECTION ──────────────────────────────────────── */}
      <section className="mb-16">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-white">
            Autonomous Drone & Robot Fleet Schedule
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bento-card p-8 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg mb-3">
              <Zap size={20} />
              <span>Drone Pyranometer Calibration</span>
            </div>
            <div className="text-base text-white font-semibold">Daily sunrise flight scans all 1,200 trackers for astronomical alignment.</div>
            <div className="text-sm font-mono text-emerald-300 font-bold mt-6">Next Flight: 05:45 AM Midday Window</div>
          </div>

          <div className="bento-card p-8 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
            <div className="flex items-center gap-2 text-[#00f59b] font-bold text-lg mb-3">
              <Cpu size={20} />
              <span>Waterless Robot Dust Sweeper</span>
            </div>
            <div className="text-base text-white font-semibold">Overnight electrostatic microfiber wiper clears desert sand without water.</div>
            <div className="text-sm font-mono text-emerald-300 font-bold mt-6">Status: Active on String 14-B</div>
          </div>

          <div className="bento-card p-8 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-lg mb-3">
              <Activity size={20} />
              <span>Inverter Thermography Profiling</span>
            </div>
            <div className="text-base text-white font-semibold">Predictive machine-learning sensor flags temperature spikes 48h prior.</div>
            <div className="text-sm font-mono text-emerald-300 font-bold mt-6">Confidence: 98.4% AI Verification</div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default MaintenanceView;
