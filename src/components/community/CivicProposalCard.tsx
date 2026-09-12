import React from 'react';
import { 
  MapPin, 
  ThumbsUp, 
  ArrowRight, 
  Building2, 
  Zap,
  Clock
} from 'lucide-react';
import { CivicProposal, ProjectLifecycleStage } from '../../types/solterra';
import { useSolTerraStore } from '../../store/useSolTerraStore';

interface CivicProposalCardProps {
  proposal: CivicProposal;
  onOpenDetails: (proposal: CivicProposal) => void;
}

const STAGE_CONFIG: Record<ProjectLifecycleStage, { label: string; color: string; bg: string }> = {
  'Proposed':           { label: 'Proposed',           color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)' },
  'Community Review':   { label: 'Community Review',   color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' },
  'Under Evaluation':   { label: 'Under Evaluation',   color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  'Approved':           { label: 'Approved by KMC',    color: '#00f59b', bg: 'rgba(0, 245, 155, 0.15)' },
  'Rejected':           { label: 'Rejected',           color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' },
  'Planned':            { label: 'Engineering Planned', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' },
  'Under Construction': { label: 'Under Construction', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.18)' },
  'Operational':        { label: 'Operational Grid Node', color: '#00f59b', bg: 'rgba(0, 245, 155, 0.2)' },
  'Completed':          { label: 'Completed',          color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
};

export const CivicProposalCard: React.FC<CivicProposalCardProps> = ({ proposal, onOpenDetails }) => {
  const { voteProposal, setSelectedAsset, setCameraFocus, setActivePage, assets } = useSolTerraStore();
  const stage = STAGE_CONFIG[proposal.lifecycleStatus] || STAGE_CONFIG['Proposed'];

  const handleFlyToLinkedAsset = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!proposal.linkedAssetId) return;
    const asset = assets.find(a => a.id === proposal.linkedAssetId);
    if (asset) {
      setSelectedAsset(asset);
      setCameraFocus(asset.coordinates);
      setActivePage('citytwin');
    }
  };

  return (
    <article 
      className="p-7 sm:p-9 md:p-12 rounded-[36px] border shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/40 group relative overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)'
      }}
    >
      <div>
        {/* 1. Category & Proposal ID + 2. Lifecycle Status Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider uppercase bg-white/5 border border-white/10 text-slate-300">
              {proposal.category}
            </span>
            <span className="text-xs text-slate-500 font-mono tracking-wider">
              #{proposal.id}
            </span>
          </div>

          <div 
            className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border flex items-center gap-2"
            style={{ color: stage.color, background: stage.bg, borderColor: `${stage.color}35` }}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span>{stage.label}</span>
          </div>
        </div>

        {/* 3. Project Title (Large, immediately readable) */}
        <h3 
          onClick={() => onOpenDetails(proposal)}
          className="text-xl sm:text-2xl md:text-3xl font-bold font-heading tracking-tight cursor-pointer group-hover:text-emerald-400 transition-colors leading-snug"
          style={{ color: 'var(--text-1)' }}
        >
          {proposal.title}
        </h3>

        {/* 4. Location + Proposer (Secondary metadata) */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400 mt-3.5 mb-6">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <MapPin size={15} className="text-emerald-400 flex-shrink-0" />
            <span>{proposal.location}</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span>Proposed by</span>
            <span className="text-slate-200 font-medium">{proposal.submittedBy.name}</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock size={14} className="text-slate-500" />
            <span className="font-mono text-xs">{proposal.submittedDate}</span>
          </div>
        </div>

        {/* 5. Short Description (Comfortable line-height, non-cramped) */}
        <p className="text-sm sm:text-base leading-relaxed text-slate-300 font-normal mb-8 line-clamp-3">
          {proposal.description}
        </p>

        {/* 6. Key Impact Metrics (Visually grouped, clean discrete tags) */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-8">
          {proposal.expectedBenefit.cleanEnergyKw && (
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <Zap size={14} />
              <span>+{proposal.expectedBenefit.cleanEnergyKw} kW Clean Generation</span>
            </div>
          )}
          {proposal.expectedBenefit.co2AvoidedTons && (
            <div className="px-3.5 py-2 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold">
              {proposal.expectedBenefit.co2AvoidedTons} Tons CO₂ Abated/yr
            </div>
          )}
          {proposal.expectedBenefit.waterSavedLiters && (
            <div className="px-3.5 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
              {(proposal.expectedBenefit.waterSavedLiters / 1000).toLocaleString()}k L Runoff Harvesting
            </div>
          )}
          {proposal.expectedBenefit.benefitedCitizens && (
            <div className="px-3.5 py-2 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
              {proposal.expectedBenefit.benefitedCitizens.toLocaleString()} Residents Served
            </div>
          )}
        </div>

        {/* 7. Authority / Organization Response Box (If present) */}
        {proposal.governmentResponse && (
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 mb-8 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2 text-cyan-400">
                <Building2 size={15} />
                <span>{proposal.governmentResponse.authority}</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Reviewed {proposal.governmentResponse.reviewDate}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
              "{proposal.governmentResponse.officialRemarks}"
            </p>
          </div>
        )}
      </div>

      {/* 8, 9, 10. Actions & Community Support Row */}
      <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
        {/* Left: Support / Endorse Vote & 3D Map Link */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => voteProposal(proposal.id)}
            className={`flex-1 sm:flex-none px-5 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md ${
              proposal.userVoted
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_18px_rgba(0,245,155,0.45)]'
                : 'bg-white/10 text-white hover:bg-emerald-500/20 hover:text-emerald-400 border border-white/10'
            }`}
            title="Community voting indicates citizen demand (does NOT automatically approve projects)"
          >
            <ThumbsUp size={15} className={proposal.userVoted ? 'fill-current' : ''} />
            <span>{proposal.userVoted ? 'Endorsed' : 'Endorse'}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-xs font-mono font-bold">
              {proposal.supportCount}
            </span>
          </button>

          {/* Linked City Twin Asset Link */}
          {proposal.linkedAssetId && (
            <button
              onClick={handleFlyToLinkedAsset}
              className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              title="Fly to active 3D node in City Twin map"
            >
              <Zap size={14} className="text-cyan-400" />
              <span>3D Map</span>
            </button>
          )}
        </div>

        {/* Right: View Full Record & Documents */}
        <button
          onClick={() => onOpenDetails(proposal)}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/5"
        >
          <span>View Record & Docs</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
};

export default CivicProposalCard;
