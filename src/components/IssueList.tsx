import React from 'react';
import { motion } from 'motion/react';
import { ThumbsUp, MapPin, MessageSquare, Clock, ArrowUpRight, ShieldCheck, CheckCircle2, Siren, AlertOctagon, ShieldAlert, Navigation, Locate } from 'lucide-react';
import { Report } from '../types';
import { STATUS_CONFIG, CATEGORY_CONFIG, SEVERITY_CONFIG } from '../lib/constants';
import { CategoryIcon } from './CategoryIcon';
import { formatTimeAgo } from '../lib/utils';
import { useUserLocation } from '../hooks/useUserLocation';
import { calculateDistanceKm, formatDistanceTag } from '../lib/geoUtils';

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
  const { userCoords, isLocating, hasPermission, requestLocation } = useUserLocation();

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

        {userCoords ? (
          <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full font-extrabold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 shadow-2xs">
            <Navigation className="w-3 h-3 text-emerald-600 dark:text-emerald-400 fill-current" />
            <span>GPS ACTIVE</span>
          </span>
        ) : isLocating ? (
          <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-full font-extrabold border border-indigo-200 animate-pulse">
            LOCATING GPS...
          </span>
        ) : (
          <button
            onClick={requestLocation}
            className="text-[10px] font-mono text-indigo-700 bg-indigo-100/90 hover:bg-indigo-200 px-2.5 py-0.5 rounded-full font-extrabold border border-indigo-200 flex items-center gap-1 transition-all cursor-pointer"
          >
            <Locate className="w-3 h-3 text-indigo-600" />
            <span>ENABLE DISTANCE</span>
          </button>
        )}
      </div>

      {reports.map((report, idx) => {
        const isSelected = report.id === selectedReportId;
        const statusConf = STATUS_CONFIG[report.status] || STATUS_CONFIG.OPEN;
        const catConf = CATEGORY_CONFIG[report.category] || CATEGORY_CONFIG.OTHER;
        const sevConf = SEVERITY_CONFIG[report.severity] || SEVERITY_CONFIG.MEDIUM;
        const isEmergency = report.category === 'EMERGENCY';

        let distanceTag: string | null = null;
        if (userCoords && report.latitude && report.longitude) {
          const distKm = calculateDistanceKm(
            userCoords.latitude,
            userCoords.longitude,
            report.latitude,
            report.longitude
          );
          distanceTag = formatDistanceTag(distKm);
        }

        return (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: Math.min(idx * 0.04, 0.3), ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onSelectReport(report)}
            className={`group relative soft-card soft-card-hover p-4 transition-all duration-200 cursor-pointer font-['Montserrat'] ${
              isEmergency
                ? 'border-2 border-red-500 bg-red-50/50 dark:bg-red-950/30 shadow-red-100/60 shadow-md'
                : isSelected
                ? 'ring-2 ring-[#008080] bg-white dark:bg-slate-900 shadow-lg border-[#008080]'
                : 'hover:border-[#008080]'
            }`}
          >
            {/* High-Contrast Visual Alert Badge for Emergency Reports */}
            {isEmergency && (
              <div className="mb-3 px-3 py-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-between shadow-md border border-red-400">
                <div className="flex items-center space-x-1.5">
                  <Siren className="w-4 h-4 animate-bounce text-[#CCFF00]" />
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

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs"
                  style={{ backgroundColor: statusConf.pinHex }}
                >
                  {statusConf.label}
                </span>

                {distanceTag && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#008080]/10 text-[#008080] dark:text-[#CCFF00] border border-[#008080]/30 flex items-center gap-1 shadow-2xs">
                    <Navigation className="w-2.5 h-2.5 text-[#008080] dark:text-[#CCFF00]" />
                    <span>{distanceTag}</span>
                  </span>
                )}
              </div>

              <span className="text-xs text-[#008080] dark:text-[#CCFF00] font-mono font-bold">#{report.id}</span>
            </div>

            <div className="flex gap-3 my-2.5">
              <img
                src={report.imageUrls[0]}
                alt={report.title}
                className="w-18 h-18 rounded-2xl object-cover shrink-0 bg-slate-100 border border-slate-200 shadow-xs group-hover:scale-102 transition-transform duration-300"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-['Montserrat'] font-black text-[#1A1A1A] dark:text-white text-sm sm:text-base line-clamp-1 group-hover:text-[#008080] transition-colors">
                  {report.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5 leading-snug font-medium">
                  {report.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium truncate max-w-[180px]">
                <MapPin className="w-3.5 h-3.5 text-[#008080] shrink-0" />
                <span className="truncate">{report.addressText}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 text-[10px] rounded-full font-black uppercase ${sevConf.colorClass}`}>
                  {sevConf.label}
                </span>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={(e) => onUpvoteReport(report.id, e)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                    report.userHasUpvoted
                      ? 'bg-[#008080] text-[#CCFF00] shadow-sm border border-[#CCFF00]/40'
                      : 'soft-pill text-[#1A1A1A] dark:text-white hover:bg-[#008080] hover:text-white'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${report.userHasUpvoted ? 'fill-current text-[#CCFF00]' : ''}`} />
                  <span>{report.upvotesCount}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
