import React, { useState } from 'react';
import { 
  Plus, 
  Wrench, 
  Search, 
  Leaf, 
  ThumbsUp, 
  Share2 
} from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';
import { NewProposalModal } from './NewProposalModal';
import { InfrastructureIssueReportModal } from './InfrastructureIssueReportModal';

export const CommunityView: React.FC = () => {
  const { civicProposals, voteProposal } = useSolTerraStore();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'solarpunk' | 'solar' | 'civic'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewProposalOpen, setIsNewProposalOpen] = useState(false);
  const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);

  // Dedicated Solarpunk & Solar Innovations Bento Cards
  const communityBentoCards = [
    {
      id: 'sp-01',
      title: 'Solarpunk Bio-Canopy Towers',
      category: 'solarpunk',
      image: '/images/solar/solarpunk-biocanopy.jpg',
      span: 'col-span-12 lg:col-span-8',
      headline: 'Hexagonal photovoltaic tree canopies integrating vertical hydroponic gardens and LED night lighting.',
      tag: 'SOLARPUNK INNOVATION',
      metric: '94.2 kW Clean Output',
      supporters: 684
    },
    {
      id: 'sp-02',
      title: 'Algae Micro-Bioreactor Facades',
      category: 'solarpunk',
      image: '/images/solar/solarpunk-algae.jpg',
      span: 'col-span-12 lg:col-span-4',
      headline: 'Spiral photobioreactor facade tubes capturing carbon and producing clean biomass alongside solar glass.',
      tag: 'BIO-SOLAR TECH',
      metric: '12.8 T CO₂/yr Captured',
      supporters: 512
    },
    {
      id: 'sp-03',
      title: 'Solar Flower Plaza & Kinetic Pavers',
      category: 'solarpunk',
      image: '/images/solar/solarpunk-plaza.jpg',
      span: 'col-span-12 lg:col-span-4',
      headline: 'Sun-tracking solar flower canopies paired with piezoelectric kinetic pavers for civic gatherings.',
      tag: 'CIVIC PLAZA',
      metric: '4.6 kWh/day Kinetic Yield',
      supporters: 890
    },
    {
      id: 'sp-04',
      title: 'Rooftop Solar Citizen Collective',
      category: 'solar',
      image: '/images/solar/solar-community-18.jpg',
      span: 'col-span-12 lg:col-span-8',
      headline: 'Decentralized residential rooftop solar pooling delivering clean power to 320 neighborhood families.',
      tag: 'COMMUNITY SOLAR',
      metric: '35% Bill Savings',
      supporters: 1420
    },
    {
      id: 'sp-05',
      title: 'Municipal Auto-Rickshaw EV Canopy',
      category: 'civic',
      image: '/images/solar/solar-substation-12.jpg',
      span: 'col-span-12 lg:col-span-6',
      headline: 'Shared high-speed solar charging depot providing clean power for 180 auto-rickshaw drivers.',
      tag: 'CLEAN MOBILITY',
      metric: '45 EV Fast Stalls',
      supporters: 742
    },
    {
      id: 'sp-06',
      title: 'School Microgrid & STEM Academy',
      category: 'civic',
      image: '/images/solar/solar-panels-14.jpg',
      span: 'col-span-12 lg:col-span-6',
      headline: 'Classroom solar array coupled with an interactive student battery laboratory for science education.',
      tag: 'STEM EDUCATION',
      metric: '1,200 Students/Year',
      supporters: 630
    },
    {
      id: 'sp-07',
      title: 'Agrivoltaic Mountain Farm Co-Op',
      category: 'solar',
      image: '/images/solar/solar-mountain-6.jpg',
      span: 'col-span-12 lg:col-span-12',
      headline: 'Dual-use agricultural crops cultivated under high-clearance tracking solar panels for shade preservation.',
      tag: 'AGRIVOLTAICS',
      metric: '+22% Crop Water Retention',
      supporters: 915
    }
  ];

  const filteredCards = communityBentoCards.filter(card => {
    if (selectedFilter !== 'all' && card.category !== selectedFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        card.title.toLowerCase().includes(q) ||
        card.headline.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  const handleVote = (id: string) => {
    setVotedMap(prev => ({ ...prev, [id]: !prev[id] }));
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
                CIVIC CO-CREATION & SOLARPUNK INFRASTRUCTURE
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading tracking-tight text-white leading-none">
              Civic Sustainability Hub
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl text-emerald-300 font-semibold tracking-tight">
              Democratic solarpunk infrastructure, citizen energy petitions, and community microgrid co-creation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 flex-shrink-0">
            <button
              onClick={() => setIsNewProposalOpen(true)}
              className="px-7 py-4 bg-[#00f59b] hover:bg-[#00f59b]/90 text-slate-950 text-sm sm:text-base font-black uppercase tracking-wider flex items-center gap-2 shadow-xl cursor-pointer"
            >
              <Plus size={18} />
              <span>Propose Project</span>
            </button>

            <button
              onClick={() => setIsReportIssueOpen(true)}
              className="px-6 py-4 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-sm sm:text-base font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Wrench size={18} />
              <span>Report Anomaly</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── KEY CIVIC INDICES ────────────────────────────────────────────────── */}
      <section className="mb-16 sm:mb-24 md:mb-32">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-white">
            Community Renewable Energy Yield
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bento-card p-8 sm:p-10 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
            <span className="text-sm uppercase font-mono font-bold text-emerald-400">Citizen Endorsements</span>
            <div className="my-4">
              <div className="text-6xl sm:text-7xl font-black font-heading text-[#00f59b]">4,820</div>
              <div className="text-lg sm:text-xl text-white font-bold mt-2">Verified Resident Signatures</div>
            </div>
            <span className="text-sm font-mono text-emerald-300">+340 Votes Cast This Week</span>
          </div>

          <div className="bento-card p-8 sm:p-10 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
            <span className="text-sm uppercase font-mono font-bold text-emerald-400">Solar Projects Built</span>
            <div className="my-4">
              <div className="text-6xl sm:text-7xl font-black font-heading text-cyan-400">14</div>
              <div className="text-lg sm:text-xl text-white font-bold mt-2">Active Microgrids Live</div>
            </div>
            <span className="text-sm font-mono text-emerald-300">Zero Public Debt Financed</span>
          </div>

          <div className="bento-card p-8 sm:p-10 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
            <span className="text-sm uppercase font-mono font-bold text-emerald-400">Citizen Clean Energy</span>
            <div className="my-4">
              <div className="text-6xl sm:text-7xl font-black font-heading text-white">42.8 <span className="text-2xl font-normal text-emerald-400/70">MWh</span></div>
              <div className="text-lg sm:text-xl text-white font-bold mt-2">Direct Citizen Yield</div>
            </div>
            <span className="text-sm font-mono text-emerald-300">Powers 1,400 Homes Daily</span>
          </div>

          <div className="bento-card p-8 sm:p-10 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
            <span className="text-sm uppercase font-mono font-bold text-emerald-400">Municipal Matching</span>
            <div className="my-4">
              <div className="text-6xl sm:text-7xl font-black font-heading text-amber-400">100%</div>
              <div className="text-lg sm:text-xl text-white font-bold mt-2">KMC Matching Grant Fund</div>
            </div>
            <span className="text-sm font-mono text-emerald-300">₹4.2 Cr Allocated to Citizen Solar</span>
          </div>
        </div>
      </section>

      {/* ── SOLARPUNK & SOLAR BENTO GRID ──────────────────────────────────────── */}
      <section className="mb-16 sm:mb-24 md:mb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-white">
              Active Civic Solarpunk Bento Grid
            </h2>
          </div>

          {/* Search and Category Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="pl-10 pr-4 py-2.5 text-sm bg-emerald-950/60 border border-emerald-500/30 text-white outline-none font-medium"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-emerald-950/60 border border-emerald-500/30">
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'solarpunk', label: 'Solarpunk Tech' },
                { id: 'solar', label: 'Solar Collectives' },
                { id: 'civic', label: 'Civic Mobility' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFilter(cat.id as any)}
                  className={`px-3.5 py-2 text-sm font-bold uppercase transition-all cursor-pointer ${
                    selectedFilter === cat.id
                      ? 'bg-[#00f59b] text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {filteredCards.map(card => {
            const hasVoted = votedMap[card.id];
            const currentSupporters = card.supporters + (hasVoted ? 1 : 0);

            return (
              <div
                key={card.id}
                className={`${card.span} bento-card group flex flex-col justify-between`}
                style={{
                  background: 'linear-gradient(180deg, rgba(8, 32, 19, 0.92) 0%, rgba(2, 12, 7, 0.98) 100%)',
                  borderColor: 'rgba(16, 185, 129, 0.3)'
                }}
              >
                {/* Solarpunk / Solar Image Header */}
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
                      {card.tag}
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
                      onClick={() => handleVote(card.id)}
                      className={`flex-1 py-3.5 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        hasVoted
                          ? 'bg-[#00f59b] text-slate-950 shadow-lg'
                          : 'bg-white/5 hover:bg-emerald-500/20 border border-white/15 text-white hover:text-emerald-300'
                      }`}
                    >
                      <ThumbsUp size={16} className={hasVoted ? 'fill-slate-950' : ''} />
                      <span>{hasVoted ? `Endorsed (${currentSupporters})` : `Endorse (${currentSupporters})`}</span>
                    </button>

                    <button
                      onClick={() => alert(`Project ${card.title} shared to civic forum!`)}
                      className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white transition-all cursor-pointer"
                      title="Share to Forum"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CITIZEN PLEDGE FOOTER ────────────────────────────────────────────── */}
      <section className="mb-16">
        <div className="bento-card p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6" style={{ background: 'linear-gradient(145deg, rgba(6, 28, 16, 0.9) 0%, rgba(2, 14, 8, 0.98) 100%)' }}>
          <div>
            <div className="flex items-center gap-3 text-[#00f59b] font-bold text-xl mb-2">
              <Leaf size={24} />
              <span>Solarpunk Citizen Energy Pledge</span>
            </div>
            <div className="text-base sm:text-lg text-white font-semibold">
              Join 1,200+ Kurnool citizens committing to zero-carbon energy habits and community microgrid pooling.
            </div>
          </div>

          <button
            onClick={() => alert('Thank you! Your civic pledge has been recorded with Kurnool Municipal Corporation.')}
            className="px-7 py-4 bg-[#00f59b] text-slate-950 font-black text-sm uppercase tracking-wider whitespace-nowrap shadow-xl hover:scale-105 transition-all cursor-pointer"
          >
            Take Citizen Pledge
          </button>
        </div>
      </section>

      {/* Modals */}
      {isNewProposalOpen && (
        <NewProposalModal onClose={() => setIsNewProposalOpen(false)} />
      )}

      {isReportIssueOpen && (
        <InfrastructureIssueReportModal onClose={() => setIsReportIssueOpen(false)} />
      )}

    </div>
  );
};

export default CommunityView;
