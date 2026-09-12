import React, { useState } from 'react';
import { Heart, MessageSquare, Building2, Sparkles, CheckCircle2, Calendar, Share2 } from 'lucide-react';
import { useSolTerraStore } from '../../store/useSolTerraStore';

export const CommunityFeed: React.FC = () => {
  const { communityFeed, likeFeedPost } = useSolTerraStore();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredFeed = communityFeed.filter(post => {
    if (filterType === 'all') return true;
    return post.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Feed Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Civic Updates' },
          { id: 'announcement', label: 'Official Announcements' },
          { id: 'proposal_milestone', label: 'Proposal Milestones' },
          { id: 'construction_update', label: 'Construction Progress' },
          { id: 'citizen_event', label: 'Civic Events' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              filterType === tab.id
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'bg-white/[0.02] text-slate-400 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed Cards */}
      <div className="space-y-4">
        {filteredFeed.map(post => {
          const isOfficial = post.type === 'announcement' || post.type === 'construction_update';

          return (
            <div
              key={post.id}
              className="p-6 md:p-8 rounded-[32px] border shadow-xl flex flex-col justify-between transition-all"
              style={{
                background: isOfficial ? 'linear-gradient(145deg, rgba(6, 182, 212, 0.04) 0%, var(--bg-card) 100%)' : 'var(--bg-card)',
                borderColor: isOfficial ? 'rgba(6, 182, 212, 0.2)' : 'var(--border)'
              }}
            >
              <div>
                {/* Author & Timestamp */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold text-sm shadow-md">
                      {post.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>
                          {post.author}
                        </span>
                        {post.authorBadge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                            {post.authorBadge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">{post.authorRole}</div>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-500">{post.timestamp}</span>
                </div>

                {/* Title & Body */}
                <h4 className="text-lg md:text-xl font-bold font-heading tracking-tight mb-2" style={{ color: 'var(--text-1)' }}>
                  {post.title}
                </h4>
                <p className="text-sm leading-relaxed text-slate-300 font-normal mb-4">
                  {post.content}
                </p>
              </div>

              {/* Action row: Like / Comments */}
              <div className="pt-4 border-t border-white/5 flex items-center gap-4 text-xs text-slate-400">
                <button
                  onClick={() => likeFeedPost(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    post.userLiked 
                      ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30' 
                      : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Heart size={14} className={post.userLiked ? 'fill-current' : ''} />
                  <span>{post.likesCount}</span>
                </button>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-400">
                  <MessageSquare size={14} />
                  <span>{post.commentsCount} Comments</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
