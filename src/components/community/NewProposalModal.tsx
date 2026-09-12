import React, { useState } from 'react';
import { X, Send, MapPin, Upload, Sparkles, CheckCircle2 } from 'lucide-react';
import { ProposalCategory, CivicProposal } from '../../types/solterra';
import { useSolTerraStore } from '../../store/useSolTerraStore';

interface NewProposalModalProps {
  onClose: () => void;
}

const CATEGORIES: ProposalCategory[] = [
  'Solar Energy',
  'Energy Storage',
  'EV/Mobility',
  'Bio-Junctions',
  'Green Infrastructure',
  'Rainwater',
  'Public Infrastructure',
  'Energy Efficiency'
];

const ZONES = [
  { id: 'Zone 01', label: 'Zone 01 · Kurnool Central & Railway' },
  { id: 'Zone 02', label: 'Zone 02 · Tungabhadra Riverfront' },
  { id: 'Zone 03', label: 'Zone 03 · Industrial & Old Market' },
  { id: 'Zone 04', label: 'Zone 04 · Residential South' },
  { id: 'Zone 05', label: 'Zone 05 · Educational & Medical Enclave' },
];

export const NewProposalModal: React.FC<NewProposalModalProps> = ({ onClose }) => {
  const { addCivicProposal } = useSolTerraStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProposalCategory>('Solar Energy');
  const [zone, setZone] = useState('Zone 04');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [proposedIntervention, setProposedIntervention] = useState('');
  const [cleanEnergyKw, setCleanEnergyKw] = useState('50');
  const [co2AvoidedTons, setCo2AvoidedTons] = useState('35');
  const [benefitedCitizens, setBenefitedCitizens] = useState('400');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('Local Citizen / Neighborhood Representative');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !proposedIntervention) return;

    setIsSubmitting(true);

    setTimeout(() => {
      addCivicProposal({
        title,
        category,
        zone,
        location: locationName || `${zone}, Kurnool`,
        coordinates: [78.0383 + (Math.random() - 0.5) * 0.04, 15.8287 + (Math.random() - 0.5) * 0.04],
        description,
        proposedIntervention,
        expectedBenefit: {
          cleanEnergyKw: parseFloat(cleanEnergyKw) || 25,
          annualGenerationMwh: (parseFloat(cleanEnergyKw) || 25) * 1.5,
          co2AvoidedTons: parseFloat(co2AvoidedTons) || 20,
          benefitedCitizens: parseInt(benefitedCitizens) || 200,
        },
        supportingDocuments: [
          { name: `${title.replace(/\s+/g, '_')}_Proposal_Brief.pdf`, size: '1.8 MB', type: 'application/pdf' }
        ],
        lifecycleStatus: 'Proposed',
        submittedBy: {
          name: authorName || 'Kurnool Citizen',
          role: authorRole
        },
        userVoted: true
      });

      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 900);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[36px] border shadow-2xl p-6 md:p-10 flex flex-col gap-6 text-left"
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

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-lg">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-bold font-heading">Proposal Submitted to Civic Platform!</h3>
            <p className="text-sm text-slate-400 max-w-md">
              Your proposal has been logged with ID #{Date.now().toString().slice(-4)} and is now open for community endorsements and technical review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-400">
                  CIVIC INFRASTRUCTURE INITIATIVE
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold font-heading tracking-tight">
                Submit Sustainable Infrastructure Proposal
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Empower your neighborhood by proposing clean energy, microgrids, EV charging, or water conservation projects for municipal co-funding.
              </p>
            </div>

            {/* Title & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Proposal Title *</label>
                <input
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Zone 04 Solar Microgrid & Water Catchment"
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-emerald-400/60 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#090e1a] border border-white/10 text-xs text-white outline-none focus:border-emerald-400/60 transition-all cursor-pointer"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="bg-[#090e1a] text-white py-1">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Zone & Specific Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Municipal Zone</label>
                <select
                  value={zone}
                  onChange={e => setZone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#090e1a] border border-white/10 text-xs text-white outline-none focus:border-emerald-400/60 transition-all cursor-pointer"
                >
                  {ZONES.map(z => (
                    <option key={z.id} value={z.id} className="bg-[#090e1a] text-white py-1">
                      {z.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Specific Neighborhood / Street</label>
                <input
                  value={locationName}
                  onChange={e => setLocationName(e.target.value)}
                  placeholder="e.g. Near Basaveswara Circle, Krishna Nagar"
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-emerald-400/60 transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Proposal Description & Community Need *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the current infrastructure challenge in your area and why this sustainable project is needed..."
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-emerald-400/60 transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Proposed Intervention */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Proposed Engineering Intervention *</label>
              <textarea
                required
                rows={2}
                value={proposedIntervention}
                onChange={e => setProposedIntervention(e.target.value)}
                placeholder="What specific physical hardware or civil works are requested? (e.g. 50 kW bifacial panels, 100 kWh battery, 4 DC fast chargers)..."
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-emerald-400/60 transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Expected Benefit Readouts */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Target Clean kW</label>
                <input
                  type="number"
                  value={cleanEnergyKw}
                  onChange={e => setCleanEnergyKw(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">CO₂ Avoided (Tons/yr)</label>
                <input
                  type="number"
                  value={co2AvoidedTons}
                  onChange={e => setCo2AvoidedTons(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Citizens Benefited</label>
                <input
                  type="number"
                  value={benefitedCitizens}
                  onChange={e => setBenefitedCitizens(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white outline-none"
                />
              </div>
            </div>

            {/* Author Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <input
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="Your Full Name / RWA Lead"
                className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none"
              />
              <input
                value={authorRole}
                onChange={e => setAuthorRole(e.target.value)}
                placeholder="Role / Organization"
                className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none"
              />
            </div>

            {/* Submit Action */}
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
                  background: 'linear-gradient(135deg, #00f59b 0%, #06b6d4 100%)',
                  boxShadow: '0 8px 20px rgba(0, 245, 155, 0.3)'
                }}
              >
                <Send size={14} />
                <span>{isSubmitting ? 'Registering Proposal...' : 'Publish to Civic Platform'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
