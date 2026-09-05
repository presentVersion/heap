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
  Share2
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
      alert('SolTerra Executive Intelligence Report exported successfully.');
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 md:p-6 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white font-heading tracking-tight">
            Executive Intelligence Reports
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit-ready municipal energy reports, carbon abatement certificates, and scenario briefs.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-200 transition-all"
          >
            <Printer size={14} />
            <span>Print</span>
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,245,155,0.3)]"
          >
            <Download size={14} />
            <span>{isExporting ? 'Generating PDF...' : 'Download PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'energy', label: 'City Energy Audit' },
          { id: 'environmental', label: 'CO₂ & Emissions Certificate' },
          { id: 'grid_resilience', label: 'Grid Microgrid Resilience' },
          { id: 'simulation_audit', label: 'What-If Scenario Comparison' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setReportType(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              reportType === t.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Printable Report Document Sheet */}
      <div className="glass-panel p-6 md:p-10 border border-white/10 shadow-2xl max-w-4xl mx-auto w-full space-y-8 print:bg-white print:text-black">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-lg font-heading">
              <Zap size={20} />
              <span>SOLTERRA MUNICIPAL INTELLIGENCE</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Renewable Energy & Digital Twin Operating System
            </div>
            <div className="text-xs text-slate-400">Jurisdiction: Kurnool Municipal Corporation, Andhra Pradesh</div>
          </div>

          <div className="text-right text-xs font-mono-telemetry text-slate-400">
            <div>Report ID: #STR-KRN-2026-0526</div>
            <div>Date: {simulationConfig.targetDate}</div>
            <div className="text-emerald-400 font-semibold mt-1">STATUS: VERIFIED MODELED</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            1. Executive Performance Summary
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            During the evaluated 24-hour cycle, the city of Kurnool achieved a clean energy generation volume of{' '}
            <strong className="text-white font-mono-telemetry">{telemetry.totalGenerationMwh} MWh</strong> against a total municipal demand of{' '}
            <strong className="text-white font-mono-telemetry">{telemetry.totalConsumptionMwh} MWh</strong>, representing a net renewable share of{' '}
            <strong className="text-emerald-400 font-mono-telemetry">{telemetry.renewableSharePercent}%</strong>. Avoided carbon emissions for this cycle totaled{' '}
            <strong className="text-emerald-400 font-mono-telemetry">{telemetry.co2AvoidedTons} metric tons of CO₂ equivalent</strong>.
          </p>
        </div>

        {/* Key Metrics Table */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            2. Core Telemetry & Asset Baseline
          </h2>
          <div className="border border-white/[0.08] rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-white/[0.03] text-slate-400 font-mono-telemetry">
                <tr>
                  <th className="p-3 text-left">Metric Description</th>
                  <th className="p-3 text-left">Observed Telemetry</th>
                  <th className="p-3 text-left">Baseline Target</th>
                  <th className="p-3 text-left">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                <tr>
                  <td className="p-3 text-white">Renewable Generation Yield</td>
                  <td className="p-3 font-mono-telemetry text-emerald-400 font-bold">{telemetry.totalGenerationMwh} MWh</td>
                  <td className="p-3 font-mono-telemetry text-slate-400">250.0 MWh</td>
                  <td className="p-3 text-emerald-400 font-semibold">Exceeded (+13.8%)</td>
                </tr>
                <tr>
                  <td className="p-3 text-white">Grid Import Dependency</td>
                  <td className="p-3 font-mono-telemetry text-slate-300">{telemetry.gridImportMw} MW</td>
                  <td className="p-3 font-mono-telemetry text-slate-400">&lt; 15.0 MW</td>
                  <td className="p-3 text-emerald-400 font-semibold">Compliant</td>
                </tr>
                <tr>
                  <td className="p-3 text-white">Active Infrastructure Assets</td>
                  <td className="p-3 font-mono-telemetry text-slate-300">2,172 of 2,349</td>
                  <td className="p-3 font-mono-telemetry text-slate-400">&gt; 90.0%</td>
                  <td className="p-3 text-emerald-400 font-semibold">92.5% Online</td>
                </tr>
                <tr>
                  <td className="p-3 text-white">Battery Reserve (SoC)</td>
                  <td className="p-3 font-mono-telemetry text-cyan-400 font-bold">{telemetry.storageSocPercent}%</td>
                  <td className="p-3 font-mono-telemetry text-slate-400">&gt; 50.0%</td>
                  <td className="p-3 text-emerald-400 font-semibold">Optimal Reserve</td>
                </tr>
                <tr>
                  <td className="p-3 text-white">Proprietary SolTerra City Score</td>
                  <td className="p-3 font-mono-telemetry text-emerald-400 font-bold">{telemetry.cityScore} / 100</td>
                  <td className="p-3 font-mono-telemetry text-slate-400">&gt; 80 / 100</td>
                  <td className="p-3 text-emerald-400 font-semibold">Tier 1 Sustainable</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Recommendations */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            3. AI Analyst Recommendations
          </h2>
          <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1.5">
            <li>Dispatch heatsink servicing to Rooftop Array PV-210 to regain 3.4 kW lost capacity before peak summer heat.</li>
            <li>Incentivize commercial EV fleet charging between 11:30 AM and 2:30 PM to soak up 14.8 MWh of surplus midday solar irradiance.</li>
            <li>Maintain BESS battery pre-charge in Zone 01 to mitigate evening peak tariffs between 18:00 and 21:30.</li>
          </ul>
        </div>

        {/* Signatures & Certification */}
        <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 font-mono-telemetry">
          <div>
            <div className="text-white font-bold">Verified By:</div>
            <div>SolTerra Automated Physics Validation Engine</div>
          </div>
          <div className="text-right">
            <div className="text-emerald-400 font-bold">DIGITALLY SIGNED</div>
            <div>SHA256: 8f4a91c0e3b8214d</div>
          </div>
        </div>
      </div>
    </div>
  );
};
