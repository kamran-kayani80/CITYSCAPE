import React from 'react';
import { ThumbsUp, MapPin, MessageSquare, Clock, ArrowUpRight, ShieldCheck, CheckCircle2, Siren, AlertOctagon, ShieldAlert } from 'lucide-react';
import { Report } from '../types';
import { STATUS_CONFIG, CATEGORY_CONFIG, SEVERITY_CONFIG } from '../lib/constants';
import { CategoryIcon } from './CategoryIcon';
import { formatTimeAgo } from '../lib/utils';

interface IssueListProps {
  reports: Report[];
  selectedReportId?: string | null;
  onSelectReport: (report: Report) => void;
  onUpvoteReport: (reportId: string, e: React.MouseEvent) => void;
  isLoading?: boolean;
}

export const IssueList: React.FC<IssueListProps> = ({
  reports,
  selectedReportId,
  onSelectReport,
  onUpvoteReport,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4 p-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
            <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[300px]">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
          <MapPin className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No Issues Found</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          No civic reports match your active search or category filters. Try clearing your search or report a new issue!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Sidebar header */}
      <div className="p-3.5 soft-card flex items-center justify-between mb-3 shadow-sm">
        <span className="text-xs font-black uppercase tracking-widest text-[#242242]">
          Nearby Reports ({reports.length})
        </span>
        <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-full font-extrabold border border-indigo-200">
          LIVE FEED
        </span>
      </div>

      {reports.map((report) => {
        const isSelected = report.id === selectedReportId;
        const statusConf = STATUS_CONFIG[report.status] || STATUS_CONFIG.OPEN;
        const catConf = CATEGORY_CONFIG[report.category] || CATEGORY_CONFIG.OTHER;
        const sevConf = SEVERITY_CONFIG[report.severity] || SEVERITY_CONFIG.MEDIUM;
        const isEmergency = report.category === 'EMERGENCY';

        return (
          <div
            key={report.id}
            onClick={() => onSelectReport(report)}
            className={`group relative soft-card soft-card-hover p-4 transition-all duration-200 cursor-pointer active:scale-[0.985] ${
              isEmergency
                ? 'border-2 border-red-500 bg-red-50/50 dark:bg-red-950/30 shadow-red-100/60 shadow-md'
                : isSelected
                ? 'ring-2 ring-indigo-500 bg-[#f8f7fe] shadow-lg'
                : 'hover:border-indigo-200'
            }`}
          >
            {/* High-Contrast Visual Alert Badge for Emergency Reports */}
            {isEmergency && (
              <div className="mb-3 px-3 py-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-between shadow-md border border-red-400">
                <div className="flex items-center space-x-1.5">
                  <Siren className="w-4 h-4 animate-bounce text-yellow-300" />
                  <span>EMERGENCY HAZARD ALERT</span>
                </div>
                <span className="bg-red-950/80 text-red-100 px-2 py-0.5 rounded font-mono text-[9px] font-extrabold border border-red-400/50">
                  CRITICAL
                </span>
              </div>
            )}

            {/* AI Fraud Shield Warning Tag */}
            {(report.isFlaggedAsAiFake || report.aiForensics?.isAiGenerated) && (
              <div className="mb-2 px-2.5 py-1 bg-rose-950/90 text-rose-200 border border-rose-700/80 rounded-xl text-[10px] font-mono font-bold flex items-center justify-between shadow-xs">
                <div className="flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse shrink-0" />
                  <span>⚠️ AI FRAUD SHIELD: AI FAKE PICTURE FLAGGED</span>
                </div>
                <span className="text-[9px] bg-rose-900 text-white px-1.5 py-0.5 rounded font-black border border-rose-600">
                  {report.aiForensics?.aiProbability ?? 96}% AI
                </span>
              </div>
            )}

            <div className="flex justify-between items-start mb-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs"
                style={{ backgroundColor: statusConf.pinHex }}
              >
                {statusConf.label}
              </span>
              <span className="text-xs text-indigo-400 font-mono font-bold">#{report.id}</span>
            </div>

            <div className="flex gap-3 my-2.5">
              <img
                src={report.imageUrls[0]}
                alt={report.title}
                className="w-18 h-18 rounded-2xl object-cover shrink-0 bg-indigo-50 border border-white/80 shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-heading font-black text-[#1c1a3b] dark:text-white text-sm sm:text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {report.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5 leading-snug font-medium">
                  {report.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/60">
              <div className="flex items-center gap-1.5 text-xs text-indigo-900/80 font-medium truncate max-w-[180px]">
                <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">{report.addressText}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 text-[10px] rounded-full font-black uppercase ${sevConf.colorClass}`}>
                  {sevConf.label}
                </span>

                <button
                  onClick={(e) => onUpvoteReport(report.id, e)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                    report.userHasUpvoted
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                      : 'soft-pill text-indigo-800 hover:bg-white'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${report.userHasUpvoted ? 'fill-current' : ''}`} />
                  <span>{report.upvotesCount}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
