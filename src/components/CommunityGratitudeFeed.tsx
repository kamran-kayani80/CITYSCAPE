import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, Heart, ShieldCheck, Sparkles, ThumbsUp, ArrowRight, UserCheck, Flame, MapPin } from 'lucide-react';
import { Report, IssueVerification } from '../types';

interface GratitudeFeedProps {
  onSelectReport: (report: Report) => void;
  onOpenVerificationModal: (report: Report) => void;
}

interface Contributor {
  name: string;
  title: string;
  karma: number;
  avatar: string;
  verifiedFixes: number;
}

export const CommunityGratitudeFeed: React.FC<GratitudeFeedProps> = ({
  onSelectReport,
  onOpenVerificationModal,
}) => {
  const [resolvedReports, setResolvedReports] = useState<(Report & { verifications?: IssueVerification[] })[]>([]);
  const [topContributors, setTopContributors] = useState<Contributor[]>([]);
  const [totalKarma, setTotalKarma] = useState(14850);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGratitudeData();
  }, []);

  const fetchGratitudeData = async () => {
    try {
      const res = await fetch('/api/gratitude-feed');
      if (res.ok) {
        const data = await res.json();
        setResolvedReports(data.resolvedReports || []);
        setTopContributors(data.topContributors || []);
        setTotalKarma(data.totalCommunityKarma || 14850);
      }
    } catch (err) {
      console.error('Failed to load gratitude feed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Hero Wall of Fame Banner */}
      <div className="dark-indigo-card p-6 sm:p-10 relative overflow-hidden">
        {/* Subtle background glow decorative shapes */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 text-cyan-300 border border-white/20 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Community Wall of Fame & Impact</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Celebrating Neighbor Action & Closed Loop Fixes
          </h1>

          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed font-medium">
            Real civic power happens when residents report issues, municipal crews fix them, and local citizens verify the result. Every closed loop earns Karma and builds neighborhood trust.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs sm:text-sm font-semibold text-indigo-100">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span>Closed Loop Rate: <strong className="text-white font-mono font-bold">94.2%</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Total Community Karma: <strong className="text-amber-300 font-mono font-black text-base">{totalKarma.toLocaleString()} pts</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Resolved Wall & Gratitude Showcase */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#1c1a3b] dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Recently Resolved & Citizen Verified</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Honoring the original reporters and citizen inspectors who verified the ground work.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400 text-sm font-bold">Loading community wall...</div>
          ) : resolvedReports.length === 0 ? (
            <div className="soft-card p-8 text-center text-slate-500 text-sm font-medium">
              No resolved reports verified yet. Be the first!
            </div>
          ) : (
            <div className="space-y-6">
              {resolvedReports.map((report) => (
                <div
                  key={report.id}
                  className="soft-card p-5 space-y-4 hover:shadow-md transition-all"
                >
                  {/* Top Bar: Reporter & Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/60">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl icon-tile-indigo flex items-center justify-center font-black text-sm shrink-0">
                        {report.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#1c1a3b] dark:text-white">{report.userName}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full font-bold">
                            Original Reporter
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Reported on {new Date(report.createdAt).toLocaleDateString()} • {report.addressText}
                        </span>
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-[10px] uppercase tracking-wider rounded-full shadow-xs">
                      RESOLVED & VERIFIED
                    </span>
                  </div>

                  {/* Issue Info */}
                  <div>
                    <h3 className="text-base font-extrabold text-[#1c1a3b] dark:text-white mb-1">
                      {report.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 font-medium">
                      {report.description}
                    </p>
                  </div>

                  {/* Before & After Photo Comparison */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative rounded-2xl overflow-hidden h-36 bg-slate-100 border border-white">
                      <img
                        src={report.imageUrls[0]}
                        alt="Original issue"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-black rounded-lg">
                        BEFORE
                      </span>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden h-36 bg-emerald-950/20 border-2 border-emerald-400">
                      <img
                        src={report.resolutionImageUrl || report.imageUrls[0]}
                        alt="Resolved condition"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-lg shadow-xs">
                        AFTER
                      </span>
                    </div>
                  </div>

                  {/* Verification & Citizen Shoutouts */}
                  {report.verifications && report.verifications.length > 0 && (
                    <div className="soft-inset p-3 border border-white/60 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-1.5 text-indigo-700">
                          <UserCheck className="w-4 h-4 text-emerald-600" />
                          <span>Citizen Ground Verifiers ({report.verifications.length})</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Loop Verified</span>
                      </div>

                      <div className="space-y-1.5">
                        {report.verifications.slice(0, 2).map((v) => (
                          <div key={v.id} className="text-xs text-slate-600 flex items-start gap-2">
                            <span className="font-extrabold text-[#1c1a3b] shrink-0">@{v.userName}:</span>
                            <span className="italic text-slate-600 font-medium">"{v.notes || 'Fix confirmed on site.'}"</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => onSelectReport(report)}
                      className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inspect Full History</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOpenVerificationModal(report)}
                      className="flex items-center gap-1.5 px-3 py-1.5 soft-pill text-xs font-black text-indigo-900 transition-colors cursor-pointer hover:bg-white"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Add Ground Check</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Leaderboard & Nudges */}
        <div className="space-y-6">
          {/* Top Karma Leaderboard */}
          <div className="soft-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/60">
              <div className="flex items-center space-x-2">
                <div className="p-2 icon-tile-amber rounded-2xl">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#1c1a3b] dark:text-white">Top Civic Guardians</h3>
                  <p className="text-[11px] text-slate-500 font-medium">San Francisco Ward Leaders</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-amber-700 font-black bg-amber-100 px-2 py-0.5 rounded-full">
                THIS MONTH
              </span>
            </div>

            <div className="space-y-3">
              {topContributors.map((c, idx) => (
                <div
                  key={c.name}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                    idx === 0
                      ? 'soft-card border-amber-300 ring-2 ring-amber-300/40'
                      : 'soft-inset'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="relative shrink-0">
                      <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-white" />
                      <span className="absolute -top-1 -left-1 w-5 h-5 rounded-lg bg-indigo-900 text-white font-mono font-black text-[10px] flex items-center justify-center shadow-xs">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="font-extrabold text-xs text-[#1c1a3b] dark:text-white truncate">{c.name}</div>
                      <div className="text-[10px] text-indigo-600 font-black">{c.title}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-black text-xs text-amber-600">
                      {c.karma} pts
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold">
                      {c.verifiedFixes} verified
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Civic Nudge / Action Prompt Box */}
          <div className="p-5 dark-indigo-card text-white space-y-3">
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-cyan-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Civic Nudge</span>
            </div>

            <h4 className="text-base font-black text-white">Have you walked by a recent repair?</h4>

            <p className="text-xs text-indigo-100/90 leading-relaxed font-medium">
              Verifying whether municipal repairs are fixed properly earns you +15 to +25 Civic Karma and updates neighborhood trust metrics in real-time!
            </p>

            <button
              onClick={() => {
                const el = document.getElementById('discovery-tab-btn');
                if (el) el.click();
              }}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:opacity-90 rounded-2xl text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Explore Nearby Issues to Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
