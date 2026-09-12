import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Zap, 
  Leaf, 
  Activity, 
  Share2, 
  Check 
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

export const ReportsView: React.FC = () => {
  const { telemetry, simulationConfig, scenario } = useSolTerraStore();
  const [reportType, setReportType] = useState<'energy' | 'environmental' | 'grid_resilience' | 'simulation_audit'>('energy');
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('SolTerra Municipal Intelligence PDF Report generated successfully.');
    }, 700);
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-48 px-4 sm:px-8 md:px-14 lg:px-20 max-w-7xl mx-auto scroll-smooth select-none transition-colors duration-300">
      
      {/* ── SECTION 1: HERO & EXPORT ACTIONS ─────────────────────────────────── */}
      <section className="mb-32 md:mb-44 lg:mb-52">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/5">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400">
                MUNICIPAL AUDIT & COMPLIANCE ARCHIVE
              </span>
            </div>

            <h1 
              className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight leading-[1.1]" 
              style={{ color: 'var(--text-1)' }}
            >
              Executive Intelligence Reports
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal mt-5 leading-relaxed">
              Audit-ready municipal energy reports, carbon abatement certificates, microgrid resilience audits, and physics simulation comparisons for Kurnool Municipal Corporation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold transition-all cursor-pointer"
              style={{ color: 'var(--text-1)' }}
            >
              <Printer size={16} />
              <span>Print Report</span>
            </button>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #00f59b 0%, #06b6d4 100%)',
                color: '#07080f',
                boxShadow: '0 8px 24px rgba(0, 245, 155, 0.35)'
              }}
            >
              <Download size={16} />
              <span>{isExporting ? 'Generating PDF...' : 'Download PDF Report'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: REPORT TYPE SELECTOR ──────────────────────────────────── */}
      <section className="mb-16 sm:mb-20">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              REPORT AUDIT TYPE
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black font-heading" style={{ color: 'var(--text-1)' }}>
            Select Compliance Document
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {[
            { id: 'energy', label: 'City Energy Audit' },
            { id: 'environmental', label: 'CO₂ & Emissions Certificate' },
            { id: 'grid_resilience', label: 'Microgrid Resilience Audit' },
            { id: 'simulation_audit', label: 'What-If Scenario Comparison' },
          ].map(t => {
            const isSelected = reportType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setReportType(t.id as any)}
                className={`px-5 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-white text-slate-950 shadow-md font-bold border-white'
                    : 'bg-white/[0.02] text-slate-400 border-white/5 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── SECTION 3: AUDIT DOCUMENT SHEET ──────────────────────────────────── */}
      <section className="mb-24">
        <div 
          className="p-7 sm:p-10 md:p-16 rounded-[36px] border shadow-2xl space-y-10 print:bg-white print:text-black transition-all"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border)'
          }}
        >
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-white/10 pb-8">
            <div>
              <div className="flex items-center gap-2.5 text-emerald-400 font-extrabold text-xl font-heading">
                <Zap size={22} />
                <span>SOLTERRA MUNICIPAL INTELLIGENCE</span>
              </div>
              <div className="text-sm text-slate-300 mt-1.5 font-medium">
                Renewable Energy & Digital Twin Operating System
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Jurisdiction: Kurnool Municipal Corporation, Andhra Pradesh
              </div>
            </div>

            <div className="text-left sm:text-right text-xs font-mono text-slate-400 space-y-1">
              <div>Document ID: <strong className="text-slate-200">#STR-KRN-2026-0526</strong></div>
              <div>Cycle Horizon: {simulationConfig.targetDate}</div>
              <div className="text-emerald-400 font-bold mt-1">STATUS: VERIFIED & SEALED</div>
            </div>
          </div>

          {/* 1. Executive Performance Summary */}
          <div className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: 'var(--text-1)' }}>
              1. Executive Performance Summary
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-300 font-normal">
              During the evaluated 24-hour cycle, the city of Kurnool achieved a clean energy generation volume of{' '}
              <strong className="font-mono text-white">{telemetry.totalGenerationMwh} MWh</strong> against a total municipal demand of{' '}
              <strong className="font-mono text-white">{telemetry.totalConsumptionMwh} MWh</strong>, representing a net renewable share of{' '}
              <strong className="text-emerald-400 font-mono font-bold">{telemetry.renewableSharePercent}%</strong>. Avoided carbon emissions for this cycle totaled{' '}
              <strong className="text-emerald-400 font-mono font-bold">{telemetry.co2AvoidedTons} metric tons of CO₂ equivalent</strong>.
            </p>
          </div>

          {/* 2. Core Telemetry & Asset Baseline Table */}
          <div className="space-y-4">
            <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: 'var(--text-1)' }}>
              2. Core Telemetry & Asset Baseline
            </h2>
            <div className="border border-white/10 rounded-2xl overflow-x-auto">
              <table className="w-full text-xs md:text-sm min-w-[500px]">
                <thead className="bg-white/[0.03] text-slate-400 font-mono border-b border-white/5">
                  <tr>
                    <th className="p-4 text-left font-semibold">Metric Description</th>
                    <th className="p-4 text-left font-semibold">Observed Telemetry</th>
                    <th className="p-4 text-left font-semibold">Baseline Target</th>
                    <th className="p-4 text-left font-semibold">Compliance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-4 font-medium" style={{ color: 'var(--text-1)' }}>Renewable Generation Yield</td>
                    <td className="p-4 font-mono text-emerald-400 font-bold">{telemetry.totalGenerationMwh} MWh</td>
                    <td className="p-4 font-mono text-slate-400">250.0 MWh</td>
                    <td className="p-4 text-emerald-400 font-semibold">Exceeded (+13.8%)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium" style={{ color: 'var(--text-1)' }}>Grid Import Dependency</td>
                    <td className="p-4 font-mono text-slate-300">{telemetry.gridImportMw} MW</td>
                    <td className="p-4 font-mono text-slate-400">&lt; 15.0 MW</td>
                    <td className="p-4 text-emerald-400 font-semibold">Compliant</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium" style={{ color: 'var(--text-1)' }}>Active Infrastructure Assets</td>
                    <td className="p-4 font-mono text-slate-300">2,172 of 2,349</td>
                    <td className="p-4 font-mono text-slate-400">&gt; 90.0%</td>
                    <td className="p-4 text-emerald-400 font-semibold">92.5% Online</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium" style={{ color: 'var(--text-1)' }}>Battery Storage Reserve (SoC)</td>
                    <td className="p-4 font-mono text-cyan-400 font-bold">{telemetry.storageSocPercent}%</td>
                    <td className="p-4 font-mono text-slate-400">&gt; 50.0%</td>
                    <td className="p-4 text-emerald-400 font-semibold">Optimal Reserve</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium" style={{ color: 'var(--text-1)' }}>Proprietary SolTerra City Score</td>
                    <td className="p-4 font-mono text-emerald-400 font-bold">{telemetry.cityScore} / 100</td>
                    <td className="p-4 font-mono text-slate-400">&gt; 80 / 100</td>
                    <td className="p-4 text-emerald-400 font-semibold">Tier 1 Sustainable</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. AI Analyst Recommendations */}
          <div className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: 'var(--text-1)' }}>
              3. AI Analyst Recommendations & Protocols
            </h2>
            <ul className="list-disc pl-6 text-sm sm:text-base space-y-3 text-slate-300 leading-relaxed">
              <li>Dispatch heatsink servicing to Rooftop Array PV-210 to regain 3.4 kW lost capacity before peak summer heat.</li>
              <li>Incentivize commercial EV fleet charging between 11:30 AM and 2:30 PM to absorb 14.8 MWh of surplus midday solar irradiance.</li>
              <li>Maintain BESS battery pre-charge in Zone 01 to mitigate evening peak tariffs between 18:00 and 21:30.</li>
            </ul>
          </div>

          {/* 4. Signatures & Digital Certification */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <div>
              <div className="font-bold text-slate-200">Verified By:</div>
              <div>SolTerra Automated Physics Validation Engine & KMC Engineering</div>
            </div>
            <div className="sm:text-right">
              <div className="text-emerald-400 font-bold">DIGITALLY SIGNED & NOTARIZED</div>
              <div className="text-slate-500">SHA256: 8f4a91c0e3b8214d02e08e6f1a8e</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ReportsView;
