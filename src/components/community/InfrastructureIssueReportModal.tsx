import React, { useState } from 'react';
import { X, Wrench, AlertTriangle, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

interface InfrastructureIssueReportModalProps {
  onClose: () => void;
}

export const InfrastructureIssueReportModal: React.FC<InfrastructureIssueReportModalProps> = ({ onClose }) => {
  const { assets, reportInfrastructureIssue } = useSolTerraStore();

  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || 'PV-210');
  const [issueTitle, setIssueTitle] = useState('');
  const [severity, setSeverity] = useState<'critical' | 'high' | 'medium' | 'low'>('high');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle) return;

    setIsSubmitting(true);

    setTimeout(() => {
      reportInfrastructureIssue({
        assetId: selectedAsset.id,
        assetName: selectedAsset.name,
        issue: issueTitle,
        severity,
        notes
      });

      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl rounded-[36px] border shadow-2xl p-6 md:p-10 flex flex-col gap-6 text-left"
        style={{
          background: 'var(--bg-2)',
          borderColor: 'var(--border)',
          color: 'var(--text-1)'
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/5"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-lg">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-bold font-heading">Maintenance Dispatch Ticket Dispatched!</h3>
            <p className="text-sm text-slate-400 max-w-md">
              Your field issue has been logged directly into the SolTerra Maintenance intelligence system and assigned for inspection.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-400">
                  CIVIC INCIDENT REPORTING
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold font-heading tracking-tight">
                Report Infrastructure Issue
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Connect directly to the municipal maintenance workflow. Field teams prioritize citizen-reported anomalies.
              </p>
            </div>

            {/* Select Asset */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Target Infrastructure Asset *</label>
              <select
                value={selectedAssetId}
                onChange={e => setSelectedAssetId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#090e1a] border border-white/10 text-xs text-white outline-none focus:border-amber-400/60 transition-all cursor-pointer"
              >
                {assets.map(a => (
                  <option key={a.id} value={a.id} className="bg-[#090e1a] text-white py-1">
                    [{a.id}] {a.name} — {a.zoneName}
                  </option>
                ))}
              </select>
            </div>

            {/* Issue Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Detected Malfunction / Issue *</label>
              <input
                required
                value={issueTitle}
                onChange={e => setIssueTitle(e.target.value)}
                placeholder="e.g. Inverter overheat error or cable damage at charging plug"
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-amber-400/60 transition-all"
              />
            </div>

            {/* Severity Radio/Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Severity Assessment</label>
              <div className="grid grid-cols-4 gap-2.5">
                {(['low', 'medium', 'high', 'critical'] as const).map(sev => {
                  const isSelected = severity === sev;
                  return (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverity(sev)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold capitalize transition-all border cursor-pointer ${
                        isSelected
                          ? (sev === 'critical' ? 'bg-rose-500 text-black border-rose-400 font-extrabold' : 'bg-amber-400 text-black border-amber-300 font-extrabold')
                          : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {sev}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Citizen Notes / Context */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Additional Field Observations</label>
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Describe physical signs, sounds, or visual damage seen on site..."
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-amber-400/60 transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-slate-950 flex items-center gap-2 transition-all duration-300 shadow-xl cursor-pointer hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                  boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)'
                }}
              >
                <Wrench size={14} />
                <span>{isSubmitting ? 'Dispatching Work Order...' : 'Dispatch Maintenance Ticket'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
