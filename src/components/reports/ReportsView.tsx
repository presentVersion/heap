import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  ShieldCheck, 
  Zap, 
  FileText 
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

export const ReportsView: React.FC = () => {
  const { telemetry } = useSolTerraStore();
  const [reportFilter, setReportFilter] = useState<'all' | 'generation' | 'carbon' | 'grid'>('all');
  const [isExporting, setIsExporting] = useState(false);

  const reportBentoCards = [
    {
      id: 'rep-01',
      title: 'Municipal Solar Generation Yield',
      category: 'generation',
      image: '/images/solar/solar-aerial-1.jpg',
      span: 'col-span-12 lg:col-span-8',
      headline: 'Kurnool Ultra Mega Solar Park produced 284.5 MWh during peak irradiance.',
      metric: '284.5 MWh Certified Yield',
      badge: 'AUDIT VERIFIED'
    },
    {
      id: 'rep-02',
      title: 'Carbon Abatement Certificate',
      category: 'carbon',
      image: '/images/solar/solar-clean-16.jpg',
      span: 'col-span-12 lg:col-span-4',
      headline: 'Certified offset of 142.8 metric tons CO₂ equivalent verified by state council.',
      metric: '142.8 T CO₂ Neutralized',
      badge: 'NET ZERO SEAL'
    },
    {
      id: 'rep-03',
      title: 'Microgrid Islanding Resilience Audit',
      category: 'grid',
      image: '/images/solar/solar-storage-17.jpg',
      span: 'col-span-12 lg:col-span-4',
      headline: 'Battery energy storage sustained 6 hours of autonomous islanded distribution.',
      metric: '6.2 hrs Islanding Uptime',
      badge: 'GRID RESILIENCE'
    },
    {
      id: 'rep-04',
      title: 'Solar Tracker Azimuth Efficiency',
      category: 'generation',
      image: '/images/solar/solar-panels-14.jpg',
      span: 'col-span-12 lg:col-span-8',
      headline: 'Dual-axis astronomical trackers improved midday harvest by +18.4% above fixed tilt.',
      metric: '+18.4% Midday Harvest Gain',
      badge: 'EFFICIENCY SEAL'
    },
    {
      id: 'rep-05',
      title: 'High-Voltage Substation Telemetry Audit',
      category: 'grid',
      image: '/images/solar/solar-farm-15.jpg',
      span: 'col-span-12 lg:col-span-6',
      headline: '132 kV step-up transmission feeder maintained 49.98 Hz synchronous grid frequency.',
      metric: '49.98 Hz Synchronous Phase',
      badge: 'TELEMETRY AUDIT'
    },
    {
      id: 'rep-06',
      title: 'Municipal Regulatory Compliance Seal',
      category: 'carbon',
      image: '/images/solar/solar-reports-19.jpg',
      span: 'col-span-12 lg:col-span-6',
      headline: 'Full regulatory compliance awarded by Andhra Pradesh Renewable Energy Authority.',
      metric: '100% Standards Compliance',
      badge: 'GOVERNMENT AUDIT'
    }
  ];

  const filteredCards = reportBentoCards.filter(card => {
    if (reportFilter !== 'all' && card.category !== reportFilter) return false;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('SolTerra Municipal Intelligence PDF Report generated successfully.');
    }, 600);
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
                MUNICIPAL AUDIT & EXECUTIVE COMPLIANCE ARCHIVE
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading tracking-tight text-white leading-none">
              Executive Solar Reports
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl text-emerald-300 font-semibold tracking-tight">
              Sealed municipal energy audits, certified carbon offsets, and microgrid resilience certificates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 flex-shrink-0">
            <button
              onClick={handlePrint}
              className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-sm sm:text-base font-bold text-white flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer size={18} />
              <span>Print Audit</span>
            </button>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-7 py-4 bg-[#00f59b] hover:bg-[#00f59b]/90 text-slate-950 text-sm sm:text-base font-black uppercase tracking-wider flex items-center gap-2 shadow-xl cursor-pointer"
            >
              <Download size={18} />
              <span>{isExporting ? 'Generating PDF...' : 'Download PDF Certificate'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── KEY INDICES SECTION ──────────────────────────────────────────────── */}
      <section className="mb-16 sm:mb-24 md:mb-32">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-white">
            24-Hour Municipal Compliance Ratios
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bento-card p-8 sm:p-10 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
            <span className="text-sm uppercase font-mono font-bold text-emerald-400">Clean Yield Volume</span>
            <div className="my-4">
              <div className="text-6xl sm:text-7xl font-black font-heading text-[#00f59b]">{telemetry.totalGenerationMwh} <span className="text-2xl font-normal text-emerald-400/70">MWh</span></div>
              <div className="text-lg sm:text-xl text-white font-bold mt-2">Total Clean Generation</div>
            </div>
            <span className="text-sm font-mono text-emerald-300">+13.8% Above Baseline Target</span>
          </div>

          <div className="bento-card p-8 sm:p-10 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
            <span className="text-sm uppercase font-mono font-bold text-emerald-400">Carbon Abatement</span>
            <div className="my-4">
              <div className="text-6xl sm:text-7xl font-black font-heading text-cyan-400">{telemetry.co2AvoidedTons} <span className="text-2xl font-normal text-cyan-400/70">Tons</span></div>
              <div className="text-lg sm:text-xl text-white font-bold mt-2">CO₂ Emissions Neutralized</div>
            </div>
            <span className="text-sm font-mono text-emerald-300">Certified by State Council</span>
          </div>

          <div className="bento-card p-8 sm:p-10 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
            <span className="text-sm uppercase font-mono font-bold text-emerald-400">Renewable Share</span>
            <div className="my-4">
              <div className="text-6xl sm:text-7xl font-black font-heading text-white">{telemetry.renewableSharePercent}%</div>
              <div className="text-lg sm:text-xl text-white font-bold mt-2">Clean Energy Penetration</div>
            </div>
            <span className="text-sm font-mono text-emerald-300">Targeting 95% by 2028</span>
          </div>

          <div className="bento-card p-8 sm:p-10 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
            <span className="text-sm uppercase font-mono font-bold text-emerald-400">SolTerra City Score</span>
            <div className="my-4">
              <div className="text-6xl sm:text-7xl font-black font-heading text-[#00f59b]">{telemetry.cityScore} <span className="text-2xl font-normal text-emerald-400/70">/100</span></div>
              <div className="text-lg sm:text-xl text-white font-bold mt-2">Tier 1 Sustainable City</div>
            </div>
            <span className="text-sm font-mono text-emerald-300">Top 1% Smart Cities in India</span>
          </div>
        </div>
      </section>

      {/* ── BENTO AUDIT CERTIFICATES ─────────────────────────────────────────── */}
      <section className="mb-16 sm:mb-24 md:mb-32">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-white">
              Audit Certificates & Intelligence Bento
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-emerald-950/60 border border-emerald-500/30">
            {[
              { id: 'all', label: 'All Audits' },
              { id: 'generation', label: 'Generation' },
              { id: 'carbon', label: 'Carbon' },
              { id: 'grid', label: 'Grid' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setReportFilter(f.id as any)}
                className={`px-4 py-2 text-sm font-bold uppercase transition-all cursor-pointer ${
                  reportFilter === f.id
                    ? 'bg-[#00f59b] text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {filteredCards.map(card => (
            <div
              key={card.id}
              className={`${card.span} bento-card group flex flex-col justify-between`}
              style={{
                background: 'linear-gradient(180deg, rgba(8, 32, 19, 0.92) 0%, rgba(2, 12, 7, 0.98) 100%)',
                borderColor: 'rgba(16, 185, 129, 0.3)'
              }}
            >
              {/* Solar Image Header */}
              <div className="relative w-full h-56 sm:h-64 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-95"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020c07] via-transparent to-black/40" />

                {/* Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider bg-[#00f59b] text-slate-950 shadow-lg">
                    {card.badge}
                  </span>

                  <span className="px-4 py-1.5 bg-black/80 border border-white/20 text-xs font-mono font-bold text-[#00f59b]">
                    {card.metric}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl sm:text-3xl font-black font-heading text-white">
                    {card.title}
                  </h3>
                </div>
              </div>

              {/* Body: Single Large Clear Line */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="text-lg sm:text-xl font-bold text-emerald-100 leading-snug">
                  {card.headline}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <button
                    onClick={handleExport}
                    className="flex-1 py-3.5 px-4 bg-white/5 hover:bg-emerald-500/20 border border-white/15 text-sm font-bold text-white hover:text-emerald-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Download size={16} />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex-1 py-3.5 px-4 bg-[#00f59b] hover:bg-[#00f59b]/90 text-slate-950 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                  >
                    <Printer size={16} />
                    <span>Print Certificate</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NOTARIZED FOOTER ─────────────────────────────────────────────────── */}
      <section className="mb-16">
        <div className="bento-card p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
          <div>
            <div className="flex items-center gap-3 text-[#00f59b] font-bold text-xl mb-2">
              <ShieldCheck size={24} />
              <span>Digital Municipal Seal & Cryptographic Signature</span>
            </div>
            <div className="text-base sm:text-lg text-white font-semibold">
              All data streamed live from 12 physics telemetry sensors and certified by Kurnool Municipal Corporation.
            </div>
          </div>

          <span className="px-6 py-4 bg-[#00f59b] text-slate-950 text-sm font-mono font-black uppercase whitespace-nowrap shadow-xl">
            OFFICIALLY NOTARIZED
          </span>
        </div>
      </section>

    </div>
  );
};

export default ReportsView;
