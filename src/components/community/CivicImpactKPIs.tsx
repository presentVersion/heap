import React from 'react';
import { Users, FileCheck, Zap, Building2, TrendingUp } from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

export const CivicImpactKPIs: React.FC = () => {
  const { civicProposals } = useSolTerraStore();

  const totalVotes = civicProposals.reduce((sum, p) => sum + p.supportCount, 0);
  const approvedCount = civicProposals.filter(p => ['Approved', 'Planned', 'Under Construction', 'Operational', 'Completed'].includes(p.lifecycleStatus)).length;
  const totalMwhDemanded = civicProposals.reduce((sum, p) => sum + (p.expectedBenefit.annualGenerationMwh || 0), 0);
  const totalBenefited = civicProposals.reduce((sum, p) => sum + (p.expectedBenefit.benefitedCitizens || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      {/* 1. Citizen Supporters */}
      <div 
        className="p-7 sm:p-9 md:p-10 rounded-[32px] border shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/30"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Citizen Endorsements</span>
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Users size={20} />
          </div>
        </div>
        <div>
          <div className="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight" style={{ color: 'var(--text-1)' }}>
            {totalVotes.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-slate-400 font-normal mt-3 flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-400 flex-shrink-0" />
            <span>Verified public citizen petitions</span>
          </div>
        </div>
      </div>

      {/* 2. Proposals Sanctioned */}
      <div 
        className="p-7 sm:p-9 md:p-10 rounded-[32px] border shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/30"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Municipal Sanctions</span>
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Building2 size={20} />
          </div>
        </div>
        <div>
          <div className="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight" style={{ color: 'var(--text-1)' }}>
            {approvedCount} <span className="text-xl sm:text-2xl font-normal text-slate-500">/ {civicProposals.length}</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-400 font-normal mt-3">
            Approved or under construction
          </div>
        </div>
      </div>

      {/* 3. Community Clean MWh Demanded */}
      <div 
        className="p-7 sm:p-9 md:p-10 rounded-[32px] border shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-amber-500/30"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Clean Power Demanded</span>
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Zap size={20} />
          </div>
        </div>
        <div>
          <div className="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-amber-400">
            {totalMwhDemanded.toFixed(0)} <span className="text-xl sm:text-2xl font-normal text-amber-300/60">MWh/yr</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-400 font-normal mt-3">
            Citizen-requested clean generation
          </div>
        </div>
      </div>

      {/* 4. Citizens Impacted */}
      <div 
        className="p-7 sm:p-9 md:p-10 rounded-[32px] border shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-purple-500/30"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Direct Beneficiaries</span>
          <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <FileCheck size={20} />
          </div>
        </div>
        <div>
          <div className="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight" style={{ color: 'var(--text-1)' }}>
            {totalBenefited.toLocaleString()}+
          </div>
          <div className="text-xs sm:text-sm text-slate-400 font-normal mt-3">
            Kurnool citizens served across zones
          </div>
        </div>
      </div>
    </div>
  );
};

export default CivicImpactKPIs;
