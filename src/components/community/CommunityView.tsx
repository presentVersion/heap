import React, { useState } from 'react';
import { 
  Plus, 
  Wrench, 
  Search, 
  Filter, 
  Bell, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  HeartHandshake,
  Compass,
  Layers,
  MapPin,
  ArrowDown,
  RotateCcw
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { CivicProposal, ProposalCategory, ProjectLifecycleStage } from '../../types/solterra';
import { CivicImpactKPIs } from './CivicImpactKPIs';
import { CivicProposalCard } from './CivicProposalCard';
import { ProposalDetailModal } from './ProposalDetailModal';
import { NewProposalModal } from './NewProposalModal';
import { InfrastructureIssueReportModal } from './InfrastructureIssueReportModal';
import { CommunityFeed } from './CommunityFeed';
import { CommunityChallenges } from './CommunityChallenges';

export const CommunityView: React.FC = () => {
  const { civicProposals, civicNotifications, markNotificationRead } = useSolTerraStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [detailProposal, setDetailProposal] = useState<CivicProposal | null>(null);
  const [isNewProposalOpen, setIsNewProposalOpen] = useState(false);
  const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const categories = [
    'All',
    'Solar Energy',
    'Energy Storage',
    'EV/Mobility',
    'Bio-Junctions',
    'Green Infrastructure',
    'Rainwater',
    'Public Infrastructure',
    'Energy Efficiency'
  ];

  const stages = [
    'All',
    'Proposed',
    'Community Review',
    'Under Evaluation',
    'Approved',
    'Planned',
    'Under Construction',
    'Operational'
  ];

  // Filter proposals
  const filteredProposals = civicProposals.filter(p => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedStage !== 'All' && p.lifecycleStatus !== selectedStage) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadNotifications = civicNotifications.filter(n => !n.read).length;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedStage('All');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedStage !== 'All' || searchQuery.trim() !== '';

  return (
    <div className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden pt-28 sm:pt-36 md:pt-48 lg:pt-56 pb-48 px-4 sm:px-8 md:px-14 lg:px-20 max-w-7xl mx-auto scroll-smooth select-none transition-colors duration-300">
      
      {/* ── SECTION 1: HERO / INTRODUCTION ───────────────────────────────────── */}
      <section className="mb-32 md:mb-44 lg:mb-52">
        <div className="max-w-3xl">
          {/* 1. Small eyebrow / context label */}
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400">
              CIVIC PARTICIPATION & INFRASTRUCTURE CO-CREATION
            </span>
          </div>

          {/* 2. Large page title */}
          <h1 
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-heading tracking-tight leading-[1.08]" 
            style={{ color: 'var(--text-1)' }}
          >
            Civic Sustainability Hub
          </h1>

          {/* 3. Short readable description */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal mt-6 leading-relaxed max-w-3xl">
            Democratic infrastructure development for Kurnool. Propose clean energy microgrids, review municipal engineering feasibility, and track projects from citizen petition to operational grid connection.
          </p>

          {/* 4. Primary actions (Mobile friendly stack & desktop row) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-10">
            {/* New Proposal Button (Primary CTA) */}
            <button
              onClick={() => setIsNewProposalOpen(true)}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-slate-950 flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl cursor-pointer hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #00f59b 0%, #06b6d4 100%)',
                boxShadow: '0 8px 24px rgba(0, 245, 155, 0.35)'
              }}
            >
              <Plus size={18} />
              <span>Propose Project</span>
            </button>

            {/* Report Infrastructure Issue (Maintenance-linked CTA) */}
            <button
              onClick={() => setIsReportIssueOpen(true)}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Wrench size={16} />
              <span>Report Infrastructure Issue</span>
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                style={{ color: 'var(--text-1)' }}
              >
                <Bell size={16} />
                <span>Civic Alerts</span>
                {unreadNotifications > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] font-mono">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div 
                  className="absolute left-0 sm:left-auto sm:right-0 top-16 w-80 max-w-[90vw] p-5 rounded-3xl border shadow-2xl z-50 space-y-3 slide-in"
                  style={{ background: 'var(--bg-2)', borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs font-bold">
                    <span>Municipal Engineering Updates</span>
                    <span className="text-emerald-400 font-mono text-[11px]">{unreadNotifications} unread</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {civicNotifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => markNotificationRead(n.id)}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-1 cursor-pointer hover:bg-white/5 transition-colors"
                      >
                        <div className="font-semibold text-slate-200">{n.title}</div>
                        <div className="text-[11px] text-slate-400">{n.message}</div>
                        <div className="text-[9px] text-slate-500 font-mono">{n.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Page Jump Navigation Pills (Scrollable on mobile) */}
          <div className="flex items-center gap-2 pt-8 mt-10 border-t border-white/5 overflow-x-auto scrollbar-none pb-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mr-2 flex-shrink-0">
              Jump to Section:
            </span>
            <button
              onClick={() => scrollToSection('sec-overview')}
              className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/10 text-xs text-slate-300 font-medium transition-colors cursor-pointer border border-white/5 flex items-center gap-1.5 flex-shrink-0"
            >
              <span>Overview & KPIs</span>
              <ArrowDown size={12} className="text-slate-500" />
            </button>
            <button
              onClick={() => scrollToSection('sec-proposals')}
              className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/10 text-xs text-slate-300 font-medium transition-colors cursor-pointer border border-white/5 flex items-center gap-1.5 flex-shrink-0"
            >
              <span>Proposals & Exploration</span>
              <ArrowDown size={12} className="text-slate-500" />
            </button>
            <button
              onClick={() => scrollToSection('sec-feed')}
              className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/10 text-xs text-slate-300 font-medium transition-colors cursor-pointer border border-white/5 flex items-center gap-1.5 flex-shrink-0"
            >
              <span>Civic Activity Feed</span>
              <ArrowDown size={12} className="text-slate-500" />
            </button>
            <button
              onClick={() => scrollToSection('sec-challenges')}
              className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/10 text-xs text-slate-300 font-medium transition-colors cursor-pointer border border-white/5 flex items-center gap-1.5 flex-shrink-0"
            >
              <span>Sustainability Challenges</span>
              <ArrowDown size={12} className="text-slate-500" />
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: COMMUNITY OVERVIEW / METRIC CARDS ─────────────────────── */}
      <section id="sec-overview" className="mb-32 md:mb-44 lg:mb-52 scroll-mt-28">
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              SECTION 02 · MUNICIPAL OVERVIEW
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight" style={{ color: 'var(--text-1)' }}>
            Collective Civic Impact
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-normal">
            Real-time municipal aggregates of citizen endorsements, approved engineering proposals, and community clean power generation.
          </p>
        </div>

        <CivicImpactKPIs />
      </section>

      {/* ── SECTION 3: SEARCH & FILTERS ──────────────────────────────────────── */}
      <section id="sec-proposals" className="mb-16 sm:mb-20 scroll-mt-28">
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              SECTION 03 & 04 · PROJECT & PROPOSAL EXPLORATION
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight" style={{ color: 'var(--text-1)' }}>
            Explore Civic Proposals & Infrastructure
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-normal">
            Search public infrastructure initiatives, filter by engineering lifecycle stage, or explore by sustainability category.
          </p>
        </div>

        {/* Filter Controls Box */}
        <div 
          className="p-6 sm:p-8 md:p-12 rounded-[32px] border shadow-xl space-y-7"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          {/* Search Bar */}
          <div className="relative w-full max-w-2xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search proposals, zones, categories, or keywords..."
              className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base outline-none transition-all border shadow-inner"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderColor: 'var(--border)',
                color: 'var(--text-1)'
              }}
            />
          </div>

          {/* Lifecycle Stage Pills */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Lifecycle Stage:
              </span>
              {selectedStage !== 'All' && (
                <button 
                  onClick={() => setSelectedStage('All')}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  Clear stage filter
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {stages.map(st => {
                const isSelected = selectedStage === st;
                return (
                  <button
                    key={st}
                    onClick={() => setSelectedStage(st)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm font-bold'
                        : 'bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="space-y-3 pt-5 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Domain Category:
              </span>
              {selectedCategory !== 'All' && (
                <button 
                  onClick={() => setSelectedCategory('All')}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  Clear category filter
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {categories.map(cat => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-white text-slate-950 font-bold shadow-md border-white'
                        : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/5 border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Summary Bar */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">
                Filtered results: <strong className="text-emerald-400">{filteredProposals.length}</strong> matching proposal{filteredProposals.length === 1 ? '' : 's'}
              </span>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white hover:underline cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset all filters</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 4 & 5: PROPOSALS COLLECTION ──────────────────────────────── */}
      <section className="mb-32 md:mb-44 lg:mb-52">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-10 md:gap-14">
          {filteredProposals.map(proposal => (
            <CivicProposalCard
              key={proposal.id}
              proposal={proposal}
              onOpenDetails={p => setDetailProposal(p)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProposals.length === 0 && (
          <div 
            className="py-24 text-center rounded-[32px] border border-white/5 p-8 space-y-4"
            style={{ background: 'var(--bg-card)' }}
          >
            <Compass size={42} className="mx-auto text-slate-500 opacity-60" />
            <h3 className="text-xl font-bold text-slate-300">No proposals match your current filter criteria</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Try adjusting the category or lifecycle stage filter, or search with different keywords.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-3 px-6 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold cursor-pointer transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ── SECTION 6: COMMUNITY ACTIVITY & IMPACT (CIVIC FEED) ──────────────── */}
      <section id="sec-feed" className="mb-32 md:mb-44 lg:mb-52 scroll-mt-28">
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              SECTION 06 · LIVE CIVIC ACTIVITY & IMPACT
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight" style={{ color: 'var(--text-1)' }}>
            Civic Feed & Municipal Updates
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-normal">
            Real-time stream of municipal engineer announcements, citizen dialogue, and infrastructure milestone celebrations.
          </p>
        </div>

        <CommunityFeed />
      </section>

      {/* ── SECTION 7: ADDITIONAL COMMUNITY CONTENT (CHALLENGES) ─────────────── */}
      <section id="sec-challenges" className="mb-20 scroll-mt-28">
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              SECTION 07 · CITIZEN COLLECTIVE ACTION
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight" style={{ color: 'var(--text-1)' }}>
            Citizen Sustainability Challenges & Pledges
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl font-normal">
            Join neighborhood sustainability campaigns, record verified civic pledges, and unlock municipal matching funds for clean energy projects.
          </p>
        </div>

        <CommunityChallenges />
      </section>

      {/* ── MODALS ──────────────────────────────────────────────────────────── */}
      {detailProposal && (
        <ProposalDetailModal
          proposal={detailProposal}
          onClose={() => setDetailProposal(null)}
        />
      )}

      {isNewProposalOpen && (
        <NewProposalModal
          onClose={() => setIsNewProposalOpen(false)}
        />
      )}

      {isReportIssueOpen && (
        <InfrastructureIssueReportModal
          onClose={() => setIsReportIssueOpen(false)}
        />
      )}

    </div>
  );
};

export default CommunityView;
