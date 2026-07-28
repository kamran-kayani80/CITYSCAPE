import React from 'react';
import { BarChart3, CheckCircle2, Clock, ThumbsUp, AlertTriangle, ShieldCheck, TrendingUp } from 'lucide-react';
import { CityStats, Report } from '../types';
import { CATEGORY_CONFIG, STATUS_CONFIG } from '../lib/constants';

interface AnalyticsViewProps {
  stats: CityStats | null;
  reports: Report[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats, reports }) => {
  if (!stats) return null;

  const resolutionRate = stats.totalReports > 0 ? Math.round((stats.resolvedCount / stats.totalReports) * 100) : 0;

  // Calculate category distribution
  const categoryCounts: Record<string, number> = {};
  reports.forEach((r) => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="dark-indigo-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-cyan-300 text-xs font-black uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Civic Engagement Metrics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">City Infrastructure Performance</h2>
          <p className="text-xs text-indigo-100/90 font-medium max-w-xl">
            Real-time public transparency dashboard tracking municipal responsiveness and community hazard resolutions.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">{resolutionRate}%</span>
            <p className="text-[10px] text-indigo-200 font-extrabold uppercase">Resolution Rate</p>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 soft-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-indigo-950">Total Reports</span>
            <div className="p-2 icon-tile-sky rounded-xl">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-heading font-black text-[#1c1a3b] font-mono">{stats.totalReports}</p>
          <span className="text-[10px] text-slate-500 font-bold">Filed by residents</span>
        </div>

        <div className="p-5 soft-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-indigo-950">Resolved Issues</span>
            <div className="p-2 icon-tile-emerald rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-heading font-black text-emerald-700 font-mono">{stats.resolvedCount}</p>
          <span className="text-[10px] text-slate-500 font-bold">Fixed & closed</span>
        </div>

        <div className="p-5 soft-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-indigo-950">Avg Resolution</span>
            <div className="p-2 icon-tile-amber rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-heading font-black text-[#1c1a3b] font-mono">{stats.avgResolutionDays} Days</p>
          <span className="text-[10px] text-slate-500 font-bold">From report to repair</span>
        </div>

        <div className="p-5 soft-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-indigo-950">Community Endorsements</span>
            <div className="p-2 icon-tile-violet rounded-xl">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-heading font-black text-purple-800 font-mono">{stats.upvotesTotal}</p>
          <span className="text-[10px] text-slate-500 font-bold">"I see this too" upvotes</span>
        </div>
      </div>

      {/* Breakdown Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="p-6 soft-card space-y-4">
          <h3 className="text-sm font-heading font-black text-[#1c1a3b]">Status Breakdown</h3>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between font-black mb-1">
                <span className="text-red-700">Open / Unresolved</span>
                <span className="font-mono">{stats.openCount}</span>
              </div>
              <div className="w-full bg-[#e2dff4] h-2.5 rounded-full overflow-hidden p-0.5 border border-white">
                <div
                  className="bg-red-500 h-full rounded-full"
                  style={{ width: `${(stats.openCount / (stats.totalReports || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-black mb-1">
                <span className="text-amber-800">In Progress / Crew Dispatched</span>
                <span className="font-mono">{stats.inProgressCount}</span>
              </div>
              <div className="w-full bg-[#e2dff4] h-2.5 rounded-full overflow-hidden p-0.5 border border-white">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${(stats.inProgressCount / (stats.totalReports || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-black mb-1">
                <span className="text-emerald-800">Resolved / Closed</span>
                <span className="font-mono">{stats.resolvedCount}</span>
              </div>
              <div className="w-full bg-[#e2dff4] h-2.5 rounded-full overflow-hidden p-0.5 border border-white">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${(stats.resolvedCount / (stats.totalReports || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-6 soft-card space-y-4">
          <h3 className="text-sm font-heading font-black text-[#1c1a3b]">Category Breakdown</h3>

          <div className="space-y-3 text-xs">
            {Object.keys(CATEGORY_CONFIG).map((catKey) => {
              const label = CATEGORY_CONFIG[catKey as keyof typeof CATEGORY_CONFIG].label;
              const count = categoryCounts[catKey] || 0;
              const pct = stats.totalReports > 0 ? Math.round((count / stats.totalReports) * 100) : 0;

              return (
                <div key={catKey} className="space-y-1">
                  <div className="flex justify-between font-bold text-indigo-950">
                    <span>{label}</span>
                    <span className="font-mono font-black">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-[#e2dff4] h-2.5 rounded-full overflow-hidden p-0.5 border border-white">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
