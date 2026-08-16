import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Tag,
  History,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Building2,
  Calendar,
  MapPin,
  Sparkles,
  Activity,
  CheckCircle2,
  UserCheck,
  Zap,
} from 'lucide-react';

export interface HistoryLogEntry {
  timestamp: string;
  action: string;
  actor: string;
  badgeType?: 'citizen' | 'ai' | 'crew' | 'admin' | 'system';
}

export interface ExpandableClayCardProps {
  title?: string;
  subtitle?: string;
  categoryTag?: string;
  statusBadge?: string;
  reportId?: string;
  timestamps?: {
    created?: string;
    updated?: string;
    slaDeadline?: string;
    geoEpoch?: string;
  };
  municipalTags?: string[];
  historyLogs?: HistoryLogEntry[];
  children?: React.ReactNode;
  className?: string;
  defaultExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

export const ExpandableClayCard: React.FC<ExpandableClayCardProps> = ({
  title = 'Tactile Level 3 Claymorphic Item',
  subtitle = 'Interactive neighborhood infrastructure record with expanded audit log support.',
  categoryTag = 'INFRASTRUCTURE',
  statusBadge = 'IN_PROGRESS',
  reportId = 'REP-8402',
  timestamps = {
    created: '2026-08-13 04:12:08 UTC',
    updated: '2026-08-13 04:35:12 UTC',
    slaDeadline: '2026-08-14 12:00:00 UTC (SLA Tier 1)',
    geoEpoch: 'GEOHASH-40.7128N-74.0060W-S7',
  },
  municipalTags = [
    '#WARD_4_DISTRICT',
    '#DEPT_PUBLIC_WORKS',
    '#SLA_TIER_1_HAZARD',
    '#PRIORITY_ROADS_GRID',
    '#MUNICIPAL_WORK_ORDER_8402',
    '#AUDIT_VERIFIED_AI',
  ],
  historyLogs = [
    {
      timestamp: '2026-08-13 04:12:08',
      action: 'Neighborhood Report Submitted by Resident',
      actor: 'Community Neighbor',
      badgeType: 'citizen',
    },
    {
      timestamp: '2026-08-13 04:12:10',
      action: 'AI Fraud Shield Verification: 98.4% Authenticity Score',
      actor: 'Cityscape AI Engine',
      badgeType: 'ai',
    },
    {
      timestamp: '2026-08-13 04:20:00',
      action: 'Auto-Classified & Geotagged to Ward 4 Sector 7',
      actor: 'System Router',
      badgeType: 'system',
    },
    {
      timestamp: '2026-08-13 04:35:12',
      action: 'Work Order Created & Dispatched to Public Works Crew B',
      actor: 'Public Works Desk',
      badgeType: 'crew',
    },
  ],
  children,
  className = '',
  defaultExpanded = false,
  onExpandChange,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (onExpandChange) {
      onExpandChange(nextState);
    }
  };

  return (
    <div
      onClick={toggleExpand}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const nextState = !isExpanded;
          setIsExpanded(nextState);
          if (onExpandChange) onExpandChange(nextState);
        }
      }}
      className={`clay-card-lvl3 p-5 sm:p-6 space-y-4 cursor-pointer select-none transition-all duration-300 ${
        isExpanded ? 'is-expanded ring-2 ring-[#006D5B] dark:ring-[#8EB69B]' : ''
      } ${className}`}
    >
      {/* Card Header Content */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-md bg-[#006D5B] text-white shadow-2xs">
              {categoryTag}
            </span>
            <span className="text-[10px] font-mono font-black text-[#051F20] dark:text-[#DAF1DE] bg-[#8EB69B]/30 px-2 py-0.5 rounded border border-[#8EB69B]/50">
              #{reportId}
            </span>
            <span className="text-[10px] font-mono font-bold text-[#B45309] dark:text-[#CCFF00] bg-[#B45309]/10 px-2 py-0.5 rounded border border-[#B45309]/30 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" />
              <span>{statusBadge}</span>
            </span>
          </div>

          <h3 className="font-heading font-black text-base sm:text-lg text-[#051F20] dark:text-[#DAF1DE] leading-snug">
            {title}
          </h3>

          {subtitle && (
            <p className="text-xs font-medium text-[#235347] dark:text-[#8EB69B] line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>

        {/* Expand / Collapse Indicator Button */}
        <button
          onClick={toggleExpand}
          className="px-3 py-2 bg-[#006D5B] hover:bg-[#051F20] text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-md transition-all shrink-0 cursor-pointer border border-[#8EB69B]"
          title={isExpanded ? 'Collapse Extra Municipal Details' : 'Expand Detailed Timestamps & History Logs'}
        >
          <span>{isExpanded ? 'Collapse' : 'Expand Details'}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#CCFF00]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#DAF1DE]" />
          )}
        </button>
      </div>

      {/* Main Children Slot (if passed) */}
      {children}

      {/* Expandable Section: Timestamps, Internal Municipal Tags, & History Logs */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden pt-3 border-t-2 border-[#8EB69B]/40 dark:border-[#235347] space-y-4"
          >
            {/* SECTION 1: DETAILED TIMESTAMPS */}
            <div className="space-y-2 p-3.5 bg-white/70 dark:bg-[#051F20]/70 rounded-2xl border border-[#8EB69B]/50">
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#006D5B] dark:text-[#8EB69B]">
                <Clock className="w-4 h-4 text-[#B45309] dark:text-[#CCFF00]" />
                <span>Detailed Timestamps & Audit Benchmarks</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono font-semibold text-[#051F20] dark:text-[#DAF1DE]">
                <div className="p-2 bg-[#DAF1DE]/50 dark:bg-[#0B2B26]/80 rounded-xl border border-[#8EB69B]/30 flex flex-col">
                  <span className="text-[10px] text-[#235347] dark:text-[#8EB69B] uppercase font-bold">Created Timestamp</span>
                  <span className="font-extrabold">{timestamps.created}</span>
                </div>

                <div className="p-2 bg-[#DAF1DE]/50 dark:bg-[#0B2B26]/80 rounded-xl border border-[#8EB69B]/30 flex flex-col">
                  <span className="text-[10px] text-[#235347] dark:text-[#8EB69B] uppercase font-bold">Last Status Modification</span>
                  <span className="font-extrabold">{timestamps.updated}</span>
                </div>

                <div className="p-2 bg-[#DAF1DE]/50 dark:bg-[#0B2B26]/80 rounded-xl border border-[#8EB69B]/30 flex flex-col">
                  <span className="text-[10px] text-[#235347] dark:text-[#8EB69B] uppercase font-bold">SLA Target Deadline</span>
                  <span className="font-extrabold text-[#B45309] dark:text-[#CCFF00]">{timestamps.slaDeadline}</span>
                </div>

                <div className="p-2 bg-[#DAF1DE]/50 dark:bg-[#0B2B26]/80 rounded-xl border border-[#8EB69B]/30 flex flex-col">
                  <span className="text-[10px] text-[#235347] dark:text-[#8EB69B] uppercase font-bold">Geospatial Sector Hash</span>
                  <span className="font-extrabold">{timestamps.geoEpoch}</span>
                </div>
              </div>
            </div>

            {/* SECTION 2: INTERNAL MUNICIPAL TAGS */}
            <div className="space-y-2 p-3.5 bg-white/70 dark:bg-[#051F20]/70 rounded-2xl border border-[#8EB69B]/50">
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#006D5B] dark:text-[#8EB69B]">
                <Tag className="w-4 h-4 text-[#006D5B] dark:text-[#8EB69B]" />
                <span>Internal Municipal Tags & Classifications</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {municipalTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-[11px] font-mono font-black rounded-lg bg-[#006D5B] text-white dark:bg-[#235347] dark:text-[#DAF1DE] border border-[#8EB69B]/40 shadow-2xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* SECTION 3: HISTORY LOGS */}
            <div className="space-y-2 p-3.5 bg-white/70 dark:bg-[#051F20]/70 rounded-2xl border border-[#8EB69B]/50">
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#006D5B] dark:text-[#8EB69B]">
                <History className="w-4 h-4 text-[#051F20] dark:text-[#DAF1DE]" />
                <span>Chronological History & Audit Trail Logs</span>
              </div>

              <div className="space-y-2 relative pl-2 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#8EB69B]/60">
                {historyLogs.map((log, idx) => {
                  let BadgeIcon = Activity;
                  let iconBg = 'bg-[#006D5B] text-white';
                  if (log.badgeType === 'citizen') {
                    BadgeIcon = UserCheck;
                    iconBg = 'bg-[#0A2540] text-white';
                  } else if (log.badgeType === 'ai') {
                    BadgeIcon = Sparkles;
                    iconBg = 'bg-[#B45309] text-white';
                  } else if (log.badgeType === 'crew') {
                    BadgeIcon = Building2;
                    iconBg = 'bg-[#006D5B] text-white';
                  }

                  return (
                    <div
                      key={idx}
                      className="relative flex items-start space-x-3 p-2 bg-[#DAF1DE]/40 dark:bg-[#0B2B26]/60 rounded-xl border border-[#8EB69B]/30"
                    >
                      <div className={`w-6 h-6 rounded-lg ${iconBg} flex items-center justify-center shrink-0 text-xs font-black z-10`}>
                        <BadgeIcon className="w-3.5 h-3.5" />
                      </div>

                      <div className="flex-1 min-w-0 text-xs">
                        <div className="flex items-center justify-between font-mono text-[10px] text-[#235347] dark:text-[#8EB69B] font-bold">
                          <span>{log.actor}</span>
                          <span>{log.timestamp}</span>
                        </div>
                        <p className="font-extrabold text-[#051F20] dark:text-[#DAF1DE] mt-0.5">
                          {log.action}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
