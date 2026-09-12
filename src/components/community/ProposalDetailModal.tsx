import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  ThumbsUp, 
  FileText, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Building2, 
  AlertTriangle,
  Flag,
  Share2,
  Calendar,
  Zap,
  ArrowRight
} from 'lucide-react';
import { CivicProposal, ProjectLifecycleStage } from '../../types/solterra';
import { useSolTerraStore } from '../../store/useSolTerraStore';

interface ProposalDetailModalProps {
  proposal: CivicProposal | null;
  onClose: () => void;
}

const ALL_STAGES: ProjectLifecycleStage[] = [
  'Proposed',
  'Community Review',
  'Under Evaluation',
  'Approved',
  'Planned',
  'Under Construction',
  'Operational',
  'Completed'
];

export const ProposalDetailModal: React.FC<ProposalDetailModalProps> = ({ proposal, onClose }) => {
  const { voteProposal, setSelectedAsset, setCameraFocus, setActivePage, assets } = useSolTerraStore();
  const [reported, setReported] = useState(false);

  if (!proposal) return null;

  const currentStageIndex = ALL_STAGES.indexOf(proposal.lifecycleStatus);

  const handleFlyToMap = () => {
    if (proposal.linkedAssetId) {
      const asset = assets.find(a => a.id === proposal.linkedAssetId);
      if (asset) {
        setSelectedAsset(asset);
        setCameraFocus(asset.coordinates);
        setActivePage('citytwin');
        onClose();
        return;
      }
    }
    setCameraFocus(proposal.coordinates);
    setActivePage('citytwin');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[36px] border shadow-2xl p-6 md:p-10 flex flex-col gap-6 text-left"
        style={{
          background: 'var(--bg-2)',
          borderColor: 'var(--border)',
          color: 'var(--text-1)'
        }}
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/5"
        >
          <X size={18} />
        </button>

        {/* ── Modal Header ─────────────────────────────────────────────────── */}
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-200">
              {proposal.category}
            </span>
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Status: {proposal.lifecycleStatus}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ID: #{proposal.id} · Filed {proposal.submittedDate}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold font-heading tracking-tight leading-snug">
            {proposal.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2.5">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin size={15} className="text-emerald-400" />
              <span>{proposal.location}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span>Submitted by:</span>
              <strong className="text-slate-200 font-medium">{proposal.submittedBy.name}</strong> ({proposal.submittedBy.role})
            </div>
          </div>
        </div>

        {/* ── Lifecycle Stepper Progress Bar ───────────────────────────────── */}
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span>Project Lifecycle Tracking</span>
            <span className="text-emerald-400 font-mono">
              Stage {Math.max(1, currentStageIndex + 1)} of {ALL_STAGES.length}
            </span>
          </div>

          {/* Stepper Pipeline */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {ALL_STAGES.map((st, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div key={st} className="flex flex-col items-center text-center gap-1.5">
                  <div className={`w-full h-1.5 rounded-full transition-all ${
                    isPast ? 'bg-emerald-400' : (isCurrent ? 'bg-cyan-400 animate-pulse' : 'bg-white/10')
                  }`} />
                  <span className={`text-[10px] font-semibold leading-tight line-clamp-2 ${
                    isCurrent ? 'text-cyan-300 font-bold' : (isPast ? 'text-emerald-400' : 'text-slate-500')
                  }`}>
                    {st}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 italic pt-1">
            * Note: Community endorsements indicate demand and public consensus. Statutory approvals require municipal engineering clearance.
          </p>
        </div>

        {/* ── Project Description & Proposed Intervention ───────────────────── */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Executive Proposal Description
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {proposal.description}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              Proposed Engineering Intervention Scope
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {proposal.proposedIntervention}
            </p>
          </div>
        </div>

        {/* ── Expected Environmental & Community Benefits ───────────────────── */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
            Expected Community & Grid Benefits
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {proposal.expectedBenefit.cleanEnergyKw && (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="text-slate-500 font-mono text-[10px] uppercase">Clean Power Yield</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                  +{proposal.expectedBenefit.cleanEnergyKw} kW
                </div>
              </div>
            )}
            {proposal.expectedBenefit.annualGenerationMwh && (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="text-slate-500 font-mono text-[10px] uppercase">Annual Generation</div>
                <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                  {proposal.expectedBenefit.annualGenerationMwh} MWh
                </div>
              </div>
            )}
            {proposal.expectedBenefit.co2AvoidedTons && (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="text-slate-500 font-mono text-[10px] uppercase">Avoided CO₂ Emission</div>
                <div className="text-xl font-bold font-mono text-teal-300 mt-1">
                  {proposal.expectedBenefit.co2AvoidedTons} Tons/yr
                </div>
              </div>
            )}
            {proposal.expectedBenefit.waterSavedLiters && (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="text-slate-500 font-mono text-[10px] uppercase">Runoff Water Filtered</div>
                <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
                  {(proposal.expectedBenefit.waterSavedLiters / 1000).toLocaleString()}k Liters
                </div>
              </div>
            )}
            {proposal.expectedBenefit.benefitedCitizens && (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="text-slate-500 font-mono text-[10px] uppercase">Direct Beneficiaries</div>
                <div className="text-xl font-bold font-mono text-purple-400 mt-1">
                  {proposal.expectedBenefit.benefitedCitizens.toLocaleString()} Citizens
                </div>
              </div>
            )}
            {proposal.expectedBenefit.estimatedCostLakhs && (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="text-slate-500 font-mono text-[10px] uppercase">Estimated Budget</div>
                <div className="text-xl font-bold font-mono text-slate-200 mt-1">
                  ₹{proposal.expectedBenefit.estimatedCostLakhs} Lakhs
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Government / Authority Response Record ────────────────────────── */}
        {proposal.governmentResponse && (
          <div className="p-5 rounded-3xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-cyan-300">
              <div className="flex items-center gap-2">
                <Building2 size={16} />
                <span>Official Municipal Authority Response: {proposal.governmentResponse.authority}</span>
              </div>
              <span className="font-mono text-slate-400">{proposal.governmentResponse.reviewDate}</span>
            </div>
            <div className="text-xs text-slate-400">
              Reviewing Officer: <strong className="text-slate-200">{proposal.governmentResponse.officialName}</strong>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed pt-1">
              "{proposal.governmentResponse.officialRemarks}"
            </p>
          </div>
        )}

        {/* ── Supporting Documents & Media ─────────────────────────────────── */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <FileText size={15} />
            <span>Supporting Documents & Engineering Blueprints</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {proposal.supportingDocuments.map((doc, i) => (
              <div 
                key={i} 
                className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <FileText size={16} className="text-emerald-400 flex-shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-semibold truncate text-slate-200">{doc.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{doc.size}</div>
                  </div>
                </div>
                <button 
                  onClick={() => alert(`Downloading document: ${doc.name}`)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Download Document"
                >
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom Actions & Endorsements ────────────────────────────────── */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => voteProposal(proposal.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                proposal.userVoted
                  ? 'bg-emerald-500 text-slate-950 font-extrabold'
                  : 'bg-white/10 text-white hover:bg-emerald-500/20 hover:text-emerald-400 border border-white/10'
              }`}
            >
              <ThumbsUp size={15} className={proposal.userVoted ? 'fill-current' : ''} />
              <span>{proposal.userVoted ? 'Endorsed Proposal' : 'Endorse This Proposal'}</span>
              <span className="px-2 py-0.5 rounded-full bg-black/20 text-xs font-mono">
                {proposal.supportCount}
              </span>
            </button>

            <button
              onClick={handleFlyToMap}
              className="px-4 py-2.5 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/35 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <MapPin size={14} />
              <span>View Location on Map</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setReported(true);
                setTimeout(() => alert('Proposal reported to community moderators for review.'), 200);
              }}
              className="px-3.5 py-2 rounded-2xl bg-white/[0.02] hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Flag size={13} />
              <span>{reported ? 'Reported' : 'Report'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
