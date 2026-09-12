import React from 'react';
import { Award, CheckCircle2, Clock, Users, ArrowRight, Sparkles } from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

export const CommunityChallenges: React.FC = () => {
  const { challenges, toggleJoinChallenge } = useSolTerraStore();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map(chal => {
          const progressPercent = Math.min(100, (chal.currentProgress / chal.targetGoal) * 100);

          return (
            <div
              key={chal.id}
              className="p-6 md:p-8 rounded-[32px] border shadow-xl flex flex-col justify-between transition-all"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
                    {chal.category}
                  </span>

                  <span className="text-xs text-amber-400 font-mono font-bold flex items-center gap-1">
                    <Award size={14} />
                    <span>{chal.rewardBadge}</span>
                  </span>
                </div>

                <h4 className="text-lg md:text-xl font-bold font-heading tracking-tight mb-2" style={{ color: 'var(--text-1)' }}>
                  {chal.title}
                </h4>

                <p className="text-sm text-slate-300 leading-relaxed font-normal mb-5">
                  {chal.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs font-mono">
                    <span style={{ color: 'var(--text-3)' }}>{chal.targetMetric}</span>
                    <span className="text-emerald-400 font-bold">
                      {chal.currentProgress.toLocaleString()} / {chal.targetGoal.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Users size={13} className="text-cyan-400" />
                    <span>{chal.participantsCount.toLocaleString()} Pledged</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-amber-400" />
                    <span>Closes {chal.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={() => toggleJoinChallenge(chal.id)}
                  className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                    chal.userJoined
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-white/10 text-white hover:bg-emerald-500 hover:text-slate-950'
                  }`}
                >
                  {chal.userJoined ? 'Pledge Active ✓' : 'Take the Citizen Pledge'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
