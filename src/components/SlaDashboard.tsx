import React, { useState } from 'react';
import {
  Clock,
  CheckCircle,
  AlertOctagon,
  ShieldAlert,
  Building,
  TrendingUp,
  UserCheck,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Report, SlaStatus } from '../types';
import { CATEGORY_SLA_HOURS, CATEGORY_CONFIG, MUNICIPAL_WARDS } from '../lib/constants';
import { CategoryIcon } from './CategoryIcon';

interface SlaDashboardProps {
  reports: Report[];
  onConfirmResolution: (reportId: string, confirmed: boolean, disputeReason?: string) => void;
}

export const SlaDashboard: React.FC<SlaDashboardProps> = ({ reports, onConfirmResolution }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [disputeModalReport, setDisputeModalReport] = useState<Report | null>(null);
  const [disputeReason, setDisputeReason] = useState<string>('');

  // SLA Statistics Calculations
  const totalCount = reports.length;
  const resolvedCount = reports.filter((r) => r.status === 'RESOLVED' || r.status === 'CLOSED').length;
  const overdueCount = reports.filter((r) => r.slaStatus === 'OVERDUE' || r.slaStatus === 'DISPUTED').length;
  const approachingCount = reports.filter((r) => r.slaStatus === 'APPROACHING_DUE').length;
  const onTrackRate = totalCount > 0 ? Math.round(((totalCount - overdueCount) / totalCount) * 100) : 100;

  const filteredReports = reports.filter((r) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'OVERDUE') return r.slaStatus === 'OVERDUE' || r.slaStatus === 'DISPUTED';
    if (selectedFilter === 'APPROACHING') return r.slaStatus === 'APPROACHING_DUE';
    if (selectedFilter === 'RESOLVED') return r.status === 'RESOLVED' || r.status === 'CLOSED';
    if (selectedFilter === 'DISPUTED') return r.slaStatus === 'DISPUTED';
    return true;
  });

  const handleDisputeSubmit = () => {
    if (!disputeModalReport) return;
    onConfirmResolution(disputeModalReport.id, false, disputeReason.trim());
    setDisputeModalReport(null);
    setDisputeReason('');
  };

  return (
    <div className="space-y-6">
      {/* SLA Hero Header */}
      <div className="dark-indigo-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg">
                Municipal Accountability
              </span>
              <span className="text-xs font-bold text-indigo-300">Automated SLA SLA Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Service Level Agreement (SLA) Resolution Engine
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 max-w-2xl">
              Track real-time municipal repair targets, ward dispatch metrics, and resident resolution confirmations with dispute escalation guarantees.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="p-3 bg-indigo-900/60 border border-indigo-700/80 rounded-2xl text-center">
              <span className="block text-xl font-black text-emerald-400">{onTrackRate}%</span>
              <span className="text-[10px] font-bold text-indigo-200 uppercase">On-Track Rate</span>
            </div>
            <div className="p-3 bg-indigo-900/60 border border-indigo-700/80 rounded-2xl text-center">
              <span className="block text-xl font-black text-rose-400">{overdueCount}</span>
              <span className="text-[10px] font-bold text-indigo-200 uppercase">Overdue Tickets</span>
            </div>
            <div className="p-3 bg-indigo-900/60 border border-indigo-700/80 rounded-2xl text-center">
              <span className="block text-xl font-black text-amber-400">{approachingCount}</span>
              <span className="text-[10px] font-bold text-indigo-200 uppercase">Approaching SLA</span>
            </div>
            <div className="p-3 bg-indigo-900/60 border border-indigo-700/80 rounded-2xl text-center">
              <span className="block text-xl font-black text-indigo-300">{resolvedCount}</span>
              <span className="text-[10px] font-bold text-indigo-200 uppercase">Resolved Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* SLA Benchmarks Matrix */}
      <div className="soft-card p-5 space-y-3">
        <h3 className="text-sm font-extrabold text-[#1c1a3b] dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>Municipal Service Level Targets by Infrastructure Category</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {(Object.keys(CATEGORY_SLA_HOURS) as Array<keyof typeof CATEGORY_SLA_HOURS>).map((catKey) => {
            const sla = CATEGORY_SLA_HOURS[catKey];
            return (
              <div
                key={catKey}
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-1 text-center"
              >
                <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950 rounded-xl inline-block text-indigo-600">
                  <CategoryIcon category={catKey as any} className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-xs text-slate-800 dark:text-slate-200 line-clamp-1">
                  {catKey.replace('_', ' ')}
                </div>
                <div className="text-[10px] font-mono font-black text-indigo-600 dark:text-indigo-400">
                  {sla.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'ALL', label: `All Tickets (${reports.length})` },
          { id: 'OVERDUE', label: `🚨 Overdue & Escalated (${overdueCount})` },
          { id: 'APPROACHING', label: `⚠️ Approaching Due (${approachingCount})` },
          { id: 'RESOLVED', label: `✅ Resolved (${resolvedCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer min-h-[40px] ${
              selectedFilter === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports SLA List */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="soft-card p-12 text-center space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200">No Tickets in Selection</h4>
            <p className="text-xs text-slate-500">All municipal tickets in this category are operating normally.</p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const catSla = CATEGORY_SLA_HOURS[report.category] || CATEGORY_SLA_HOURS.OTHER;
            const isResolved = report.status === 'RESOLVED' || report.status === 'CLOSED';
            const isOverdue = report.slaStatus === 'OVERDUE';
            const isDisputed = report.slaStatus === 'DISPUTED';

            return (
              <div
                key={report.id}
                className={`soft-card p-5 rounded-3xl border transition-all ${
                  isDisputed
                    ? 'border-purple-400 bg-purple-50/60 dark:bg-purple-950/40'
                    : isOverdue
                    ? 'border-rose-400 bg-rose-50/60 dark:bg-rose-950/40'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-1">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-mono font-black uppercase">
                        {report.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-[10px] font-bold">
                        {report.wardZone || 'Ward 1'}
                      </span>
                      {report.isProxyReport && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-extrabold">
                          🤝 Proxy (Neighbor)
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {report.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      📍 {report.addressText}
                    </p>
                  </div>

                  {/* SLA Countdown Badge */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Target SLA</span>
                      <span
                        className={`text-xs font-mono font-black px-2.5 py-1 rounded-lg inline-block ${
                          isResolved
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : isOverdue
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200'
                        }`}
                      >
                        {isResolved ? '✅ RESOLVED' : isOverdue ? '🚨 OVERDUE' : `⏱️ Target: ${catSla.label}`}
                      </span>
                    </div>

                    {/* Resident Confirmation / Dispute Buttons */}
                    {isResolved && !report.resolutionConfirmedByReporter && (
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => onConfirmResolution(report.id, true)}
                          className="px-3 py-1.5 bg-emerald-600 text-white font-extrabold rounded-xl text-xs hover:bg-emerald-700 transition-all cursor-pointer min-h-[38px] flex items-center space-x-1"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Confirm Fixed</span>
                        </button>

                        <button
                          onClick={() => setDisputeModalReport(report)}
                          className="px-3 py-1.5 bg-rose-600 text-white font-extrabold rounded-xl text-xs hover:bg-rose-700 transition-all cursor-pointer min-h-[38px] flex items-center space-x-1"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          <span>Dispute</span>
                        </button>
                      </div>
                    )}

                    {report.resolutionConfirmedByReporter && (
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-black flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Resident Confirmed</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Dispute Reason Banner if any */}
                {report.resolutionDisputeReason && (
                  <div className="mt-3 p-3 bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 rounded-2xl text-xs text-rose-900 dark:text-rose-200 flex items-start space-x-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold block">Resident Dispute Filed:</span>
                      <p className="text-[11px] opacity-90">{report.resolutionDisputeReason}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Citizen Dispute Modal */}
      {disputeModalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-rose-500 shadow-2xl space-y-4 animate-settled-in">
            <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="p-2 bg-rose-600 text-white rounded-xl">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-black text-slate-900 dark:text-white">
                  Dispute Municipal Resolution
                </h3>
                <p className="text-xs text-slate-500">Ticket: {disputeModalReport.title}</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300">
              Please specify why this repair is incomplete or requires additional municipal attention. Your feedback re-opens the ticket with priority SLA escalation.
            </p>

            <textarea
              rows={3}
              placeholder="e.g. Pothole patch opened back up after rain or streetlight still flickering..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-rose-500"
            />

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDisputeModalReport(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-extrabold cursor-pointer min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleDisputeSubmit}
                disabled={!disputeReason.trim()}
                className="px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-black hover:bg-rose-700 transition-all cursor-pointer min-h-[44px] disabled:opacity-50"
              >
                Submit Dispute & Re-open
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
