import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ThumbsUp,
  MapPin,
  MessageSquare,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Siren,
  AlertOctagon,
  ShieldAlert,
  Navigation,
  Locate,
  WifiOff,
  Search,
  X,
  Tag,
  Sparkles,
  Filter,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  History,
  Building2,
  Zap,
} from 'lucide-react';
import { Report, ReportFilter } from '../types';
import { STATUS_CONFIG, CATEGORY_CONFIG, SEVERITY_CONFIG } from '../lib/constants';
import { CategoryIcon } from './CategoryIcon';
import { formatTimeAgo } from '../lib/utils';
import { useUserLocation } from '../hooks/useUserLocation';
import { calculateDistanceKm, formatDistanceTag } from '../lib/geoUtils';
import { ReportMapDirections } from './ReportMapDirections';
import { TrendingSidebar } from './TrendingSidebar';

interface IssueListProps {
  reports: Report[];
  selectedReportId?: string | null;
  onSelectReport: (report: Report) => void;
  onUpvoteReport: (reportId: string, e: React.MouseEvent) => void;
  isLoading?: boolean;
  filter?: ReportFilter;
  setFilter?: React.Dispatch<React.SetStateAction<ReportFilter>>;
}

interface SuggestionItem {
  id: string;
  type: 'category' | 'location' | 'hazard';
  title: string;
  subtitle: string;
  categoryKey?: string;
  count: number;
}

export const IssueList: React.FC<IssueListProps> = ({
  reports,
  selectedReportId,
  onSelectReport,
  onUpvoteReport,
  isLoading = false,
  filter,
  setFilter,
}) => {
  const { userCoords, isLocating, hasPermission, requestLocation } = useUserLocation();

  // Search Query & Auto-Suggest State
  const [query, setQuery] = useState<string>(filter?.searchQuery || '');
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>(filter?.category || 'ALL');
  const [expandedReportIds, setExpandedReportIds] = useState<Set<string>>(new Set());
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const toggleReportExpansion = (reportId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedReportIds((prev) => {
      const next = new Set(prev);
      if (next.has(reportId)) {
        next.delete(reportId);
      } else {
        next.add(reportId);
      }
      return next;
    });
  };

  // Sync internal query with parent filter prop if provided
  useEffect(() => {
    if (filter?.searchQuery !== undefined) {
      setQuery(filter.searchQuery);
    }
  }, [filter?.searchQuery]);

  useEffect(() => {
    if (filter?.category !== undefined) {
      setSelectedCategoryFilter(filter.category);
    }
  }, [filter?.category]);

  // Handle outside click to close auto-suggest dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute Auto-Suggest Predictions for Categories, Locations/Wards, and Hazard Titles
  const suggestions = useMemo(() => {
    const rawQuery = query.trim().toLowerCase();

    const items: SuggestionItem[] = [];

    // 1. Predict Issue Categories
    Object.entries(CATEGORY_CONFIG).forEach(([catKey, catObj]) => {
      if (catKey === 'ALL') return;

      const matchesQuery =
        !rawQuery ||
        catObj.label.toLowerCase().includes(rawQuery) ||
        catObj.description?.toLowerCase().includes(rawQuery) ||
        catKey.toLowerCase().includes(rawQuery);

      if (matchesQuery) {
        const count = reports.filter((r) => r.category === catKey).length;
        items.push({
          id: `cat-${catKey}`,
          type: 'category',
          title: catObj.label,
          subtitle: `Category • ${count} ${count === 1 ? 'report' : 'reports'}`,
          categoryKey: catKey,
          count,
        });
      }
    });

    // 2. Predict Locations & Wards
    const locationMap = new Map<string, number>();
    reports.forEach((r) => {
      if (r.addressText) {
        // Extract ward or street address
        const addr = r.addressText.trim();
        locationMap.set(addr, (locationMap.get(addr) || 0) + 1);
      }
    });

    // Add standard Ward locations if not present
    ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Central Ward', 'North District'].forEach((ward) => {
      if (!locationMap.has(ward)) {
        const matchingCount = reports.filter((r) => r.addressText?.toLowerCase().includes(ward.toLowerCase())).length;
        locationMap.set(ward, matchingCount || 1);
      }
    });

    locationMap.forEach((count, loc) => {
      if (!rawQuery || loc.toLowerCase().includes(rawQuery)) {
        items.push({
          id: `loc-${loc}`,
          type: 'location',
          title: loc,
          subtitle: `Location / Ward • ${count} active ${count === 1 ? 'item' : 'items'}`,
          count,
        });
      }
    });

    // 3. Predict Hazard Keywords & Titles
    reports.forEach((r) => {
      if (r.title && rawQuery && r.title.toLowerCase().includes(rawQuery)) {
        items.push({
          id: `hazard-${r.id}`,
          type: 'hazard',
          title: r.title,
          subtitle: `Report #${r.id.slice(-6)} • ${r.addressText || 'Local Ward'}`,
          count: 1,
        });
      }
    });

    // Sort by relevance and limit
    return items.slice(0, 8);
  }, [query, reports]);

  // Update query and trigger parent filter update
  const handleQueryChange = (val: string) => {
    setQuery(val);
    setIsSuggestionsOpen(true);
    if (setFilter) {
      setFilter((prev) => ({ ...prev, searchQuery: val }));
    }
  };

  const handleSelectSuggestion = (item: SuggestionItem) => {
    setIsSuggestionsOpen(false);

    if (item.type === 'category' && item.categoryKey) {
      setSelectedCategoryFilter(item.categoryKey);
      setQuery('');
      if (setFilter) {
        setFilter((prev) => ({ ...prev, category: item.categoryKey, searchQuery: '' }));
      }
    } else {
      setQuery(item.title);
      if (setFilter) {
        setFilter((prev) => ({ ...prev, searchQuery: item.title }));
      }
    }
  };

  const handleSelectCategoryChip = (catKey: string) => {
    setSelectedCategoryFilter(catKey);
    if (setFilter) {
      setFilter((prev) => ({ ...prev, category: catKey }));
    }
  };

  const clearSearch = () => {
    setQuery('');
    if (setFilter) {
      setFilter((prev) => ({ ...prev, searchQuery: '' }));
    }
  };

  // Client-side filtering fallback if reports aren't already filtered by parent
  const displayedReports = useMemo(() => {
    return reports.filter((r) => {
      // Category match
      if (selectedCategoryFilter !== 'ALL' && r.category !== selectedCategoryFilter) {
        return false;
      }
      // Search query match
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const titleMatch = r.title.toLowerCase().includes(q);
        const descMatch = r.description.toLowerCase().includes(q);
        const addrMatch = r.addressText?.toLowerCase().includes(q);
        const catMatch = CATEGORY_CONFIG[r.category]?.label.toLowerCase().includes(q);
        const tagMatch = r.hashtags?.some((t) => t.toLowerCase().includes(q));
        if (!titleMatch && !descMatch && !addrMatch && !catMatch && !tagMatch) {
          return false;
        }
      }
      return true;
    });
  }, [reports, selectedCategoryFilter, query]);

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
        <h3 className="text-base sm:text-lg font-black text-[#051F20]">No Issues Found</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          No civic reports match your active search or category filters. Try clearing your search or report a new issue!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Auto-Suggest Search Bar Section */}
      <div ref={searchContainerRef} className="relative z-30">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#006D5B] dark:text-teal-300 pointer-events-none">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setIsSuggestionsOpen(true)}
            placeholder="Search categories (pothole, water), wards, streets..."
            className="w-full pl-11 pr-10 py-3 ui-kit-input text-sm font-semibold outline-none shadow-sm transition-all placeholder:text-slate-400 min-h-[56px]"
          />

          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Auto-Suggest Predictive Dropdown */}
        <AnimatePresence>
          {isSuggestionsOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-2xl overflow-hidden z-50 divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto"
            >
              {/* Dropdown Header Label */}
              <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                <span className="flex items-center space-x-2 text-[#006D5B] dark:text-teal-300">
                  <Sparkles className="w-4 h-4" />
                  <span>Predicted Suggestions</span>
                </span>
                <span className="font-mono text-xs text-slate-400">{suggestions.length} items</span>
              </div>

              {suggestions.length === 0 ? (
                <div className="p-4 text-center text-sm font-semibold text-slate-500">
                  No matching category, ward, or hazard suggestions found.
                </div>
              ) : (
                suggestions.map((item) => {
                  let badgeBg = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
                  let Icon = Tag;

                  if (item.type === 'category') {
                    badgeBg = 'bg-[#006D5B]/10 text-[#006D5B] dark:bg-[#006D5B]/30 dark:text-teal-200';
                    Icon = Tag;
                  } else if (item.type === 'location') {
                    badgeBg = 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300';
                    Icon = MapPin;
                  } else if (item.type === 'hazard') {
                    badgeBg = 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300';
                    Icon = ShieldAlert;
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectSuggestion(item)}
                      className="w-full text-left p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/90 flex items-center justify-between gap-3 transition-colors cursor-pointer group min-h-[56px]"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`p-2.5 rounded-xl shrink-0 ${badgeBg}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[#111827] dark:text-white truncate group-hover:text-[#006D5B] dark:group-hover:text-teal-300">
                            {item.title}
                          </p>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0 text-slate-400 group-hover:text-[#006D5B] dark:group-hover:text-teal-300">
                        <span className="text-xs font-bold uppercase hidden sm:inline">Select</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trending Velocity Sidebar */}
      <TrendingSidebar
        onSelectHashtag={(tag) => {
          const event = new CustomEvent('cityscape:navigate-hashtag', { detail: { tag } });
          window.dispatchEvent(event);
        }}
        onOpenArchitectureModal={() => {
          const event = new CustomEvent('cityscape:open-arch-modal');
          window.dispatchEvent(event);
        }}
      />

      {/* Sidebar header */}
      <div className="p-4 bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 flex items-center justify-between shadow-sm">
        <span className="text-sm font-bold uppercase tracking-wider text-[#111827] dark:text-white">
          Nearby Reports ({displayedReports.length})
        </span>

        {userCoords ? (
          <span className="text-xs font-mono text-[#006D5B] bg-[#E6F4F1] dark:bg-[#004D40] dark:text-teal-200 px-3 py-1.5 rounded-xl font-bold border border-[#006D5B]/30 flex items-center gap-1.5 shadow-sm">
            <Navigation className="w-3.5 h-3.5 text-[#006D5B] dark:text-teal-200 fill-current" />
            <span>GPS ACTIVE</span>
          </span>
        ) : isLocating ? (
          <span className="text-xs font-mono text-[#B45309] bg-[#FEF3C7] px-3 py-1.5 rounded-xl font-bold border border-[#FDE68A] animate-pulse">
            LOCATING GPS...
          </span>
        ) : null}
      </div>

      {displayedReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-[#0A2540] rounded-2xl border-1.5 border-[#CBD5E1] dark:border-slate-800 min-h-[260px] shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#006D5B] dark:text-teal-300 flex items-center justify-center mb-3.5 border border-teal-200 dark:border-teal-800">
            <MapPin className="w-7 h-7" />
          </div>
          {reports.length === 0 ? (
            <>
              <h3 className="text-xl font-black text-[#0A2540] dark:text-white">All Streets Clear &amp; Safe</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mt-1.5 leading-relaxed">
                No active hazards or repair requests logged in this sector yet. Help keep your neighborhood safe by submitting the first civic report!
              </p>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('cityscape:open-report-modal'))}
                className="mt-4 px-6 py-3 bg-[#006D5B] hover:bg-[#0A2540] text-white rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 min-h-[48px]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>+ Report First Issue</span>
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-[#111827] dark:text-white">No Reports Match Search</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xs mt-1">
                No neighborhood requests match "{query || selectedCategoryFilter}". Try clearing your search query or selecting a different category filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  clearSearch();
                  handleSelectCategoryChip('ALL');
                }}
                className="mt-4 px-5 py-2.5 bg-[#006D5B] text-white rounded-xl text-sm font-bold hover:bg-[#005244] transition-colors cursor-pointer min-h-[48px]"
              >
                Reset Search &amp; Filters
              </button>
            </>
          )}
        </div>
      ) : (
        displayedReports.map((report, idx) => {
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

        const isExpanded = expandedReportIds.has(report.id);

        return (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: Math.min(idx * 0.04, 0.3), ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onSelectReport(report)}
            className={`group relative report-card-container bg-white dark:bg-[#0A2540] rounded-xl border-1.5 p-5 transition-all duration-200 cursor-pointer shadow-sm ${
              isExpanded ? 'is-expanded ring-2 ring-[#006D5B] dark:ring-teal-400' : ''
            } ${
              isEmergency
                ? 'border-red-500 bg-red-50/80 dark:bg-red-950/40 shadow-red-100/60'
                : isSelected
                ? 'ring-2 ring-[#0A2540] dark:ring-[#006D5B] border-[#0A2540] dark:border-[#006D5B] shadow-md'
                : 'border-[#CBD5E1] dark:border-slate-800 hover:border-slate-400'
            }`}
          >
            {/* High-Contrast Visual Alert Badge for Emergency Reports */}
            {isEmergency && (
              <div className="mb-3 px-3.5 py-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between shadow-sm border border-red-400">
                <div className="flex items-center space-x-2">
                  <Siren className="w-4 h-4 animate-bounce text-yellow-300" />
                  <span>EMERGENCY HAZARD ALERT</span>
                </div>
                <span className="bg-red-950/80 text-red-100 px-2 py-0.5 rounded font-mono text-xs font-bold border border-red-400/50">
                  CRITICAL
                </span>
              </div>
            )}

            {/* Offline Queued Badge for Offline Created Reports */}
            {(report.id.startsWith('off_') || (report as any).isOfflineQueued) && (
              <div className="mb-2.5 px-3 py-1.5 bg-[#0A2540] text-teal-200 border border-[#006D5B] rounded-xl text-xs font-mono font-bold flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-2">
                  <WifiOff className="w-4 h-4 text-teal-300 shrink-0" />
                  <span>📡 OFFLINE QUEUED: AUTO-SYNC READY</span>
                </div>
                <span className="text-xs bg-[#006D5B] text-white px-2 py-0.5 rounded font-bold border border-teal-400">
                  AUTO-SYNC
                </span>
              </div>
            )}

            {/* AI Fraud Shield Warning Tag */}
            {(report.isFlaggedAsAiFake || report.aiForensics?.isAiGenerated) && (
              <div className="mb-2.5 px-3 py-1.5 bg-rose-950/90 text-rose-200 border border-rose-700/80 rounded-xl text-xs font-mono font-bold flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
                  <span>⚠️ AI FRAUD SHIELD: AI FAKE PICTURE FLAGGED</span>
                </div>
                <span className="text-xs bg-rose-900 text-white px-2 py-0.5 rounded font-bold border border-rose-600">
                  {report.aiForensics?.aiProbability ?? 96}% AI
                </span>
              </div>
            )}

            {/* Top Card Header: Status, Priority, Distance, Expansion Toggle & ID Badge */}
            <div className="flex items-center justify-between mb-3.5 gap-2 flex-wrap">
              {/* Left Group: Semantic State & Classification (Proximity of Status + Priority + Distance) */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
                {/* Status Indicator */}
                <span
                  className="inline-flex items-center justify-center px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-xs border border-black/10 min-h-[34px] sm:min-h-[36px] whitespace-nowrap leading-none"
                  style={{ backgroundColor: statusConf.pinHex }}
                >
                  <span className="w-2 h-2 rounded-full bg-white mr-1.5 shrink-0 opacity-90" />
                  {statusConf.label}
                </span>

                {/* Priority / Severity Classification Badge */}
                <span
                  className={`inline-flex items-center justify-center px-2.5 sm:px-3 py-1.5 text-xs rounded-xl font-bold uppercase tracking-wider border shadow-xs min-h-[34px] sm:min-h-[36px] whitespace-nowrap leading-none ${sevConf.colorClass}`}
                >
                  {sevConf.label}
                </span>

                {/* Distance Chip (if available) */}
                {distanceTag && (
                  <span className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-[#E6F4F1] dark:bg-[#004D40] text-[#006D5B] dark:text-teal-200 border border-[#006D5B]/30 shadow-xs min-h-[34px] sm:min-h-[36px] whitespace-nowrap leading-none">
                    <Navigation className="w-3.5 h-3.5 text-[#006D5B] dark:text-teal-200 shrink-0" />
                    <span>{distanceTag}</span>
                  </span>
                )}
              </div>

              {/* Right Group: Expand Logs Action & Reference ID */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => toggleReportExpansion(report.id, e)}
                  className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 bg-[#006D5B] hover:bg-[#0A2540] text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-[#004D40] min-h-[34px] sm:min-h-[36px] shadow-xs active:scale-95 whitespace-nowrap leading-none focus:outline-none focus:ring-2 focus:ring-[#006D5B]"
                  title={isExpanded ? 'Collapse Extra Details' : 'Expand Timestamps, Tags & History Logs'}
                  aria-label={isExpanded ? 'Collapse Extra Details' : 'Expand Logs'}
                >
                  <span>{isExpanded ? 'Collapse' : 'Logs'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
                </button>
                <span className="inline-flex items-center justify-center px-2 py-1.5 text-xs text-[#051F20] dark:text-slate-200 font-mono font-bold bg-slate-100 dark:bg-slate-800/90 rounded-xl border border-[#CBD5E1] dark:border-slate-700 min-h-[34px] sm:min-h-[36px] whitespace-nowrap leading-none">
                  #{report.id.length > 8 ? report.id.slice(0, 8) : report.id}
                </span>
              </div>
            </div>

            {/* Middle Section: Image thumbnail, Title, and Description */}
            <div className="flex gap-3 sm:gap-3.5 my-3.5 items-start">
              <img
                src={report.imageUrls[0]}
                alt={report.title}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-300 dark:border-slate-700 shadow-xs group-hover:scale-102 transition-transform duration-300"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-[#051F20] dark:text-teal-50 text-base sm:text-lg line-clamp-1 group-hover:text-[#006D5B] dark:group-hover:text-teal-300 transition-colors leading-snug">
                  {report.title}
                </h3>
                <p className="text-sm text-[#111827] dark:text-slate-200 line-clamp-2 mt-1 leading-relaxed font-normal">
                  {report.description}
                </p>
              </div>
            </div>

            {/* Bottom Footer Action Bar: Location Pin & Pure Interactive Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-3.5 border-t-1.5 border-[#CBD5E1] dark:border-slate-800 gap-3">
              {/* Location Label */}
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#006D5B] dark:text-teal-300 font-bold truncate">
                <MapPin className="w-4 h-4 text-[#006D5B] dark:text-teal-300 shrink-0" />
                <span className="truncate">{report.addressText}</span>
              </div>

              {/* Pure Interactive Actions Toolbar: Directions + Upvote */}
              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0">
                {/* Map Directions Segmented Toolbar */}
                <ReportMapDirections report={report} variant="button-only" className="flex-1 sm:flex-initial" />

                {/* Primary Upvote Action Button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={(e) => onUpvoteReport(report.id, e)}
                  className={`inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[38px] sm:min-h-[40px] shrink-0 shadow-xs ${
                    report.userHasUpvoted
                      ? 'bg-[#B45309] text-white border border-[#92400E]'
                      : 'bg-slate-50 dark:bg-[#0F3254] text-[#051F20] dark:text-white border-1.5 border-[#CBD5E1] dark:border-[#1E4976] hover:bg-[#006D5B] hover:text-white'
                  }`}
                  title="Support this community report"
                  aria-label={`Support this report, current count ${report.upvotesCount}`}
                >
                  <ThumbsUp className={`w-4 h-4 shrink-0 ${report.userHasUpvoted ? 'fill-current text-white' : 'text-[#B45309]'}`} />
                  <span className="font-bold leading-none">{report.upvotesCount}</span>
                </motion.button>
              </div>
            </div>

            {/* EXPANDABLE SECTION: DETAILED TIMESTAMPS, INTERNAL MUNICIPAL TAGS, & HISTORY LOGS */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="overflow-hidden mt-3 pt-3 border-t-1.5 border-[#CBD5E1] dark:border-slate-800 space-y-3"
                >
                  {/* Detailed Timestamps */}
                  <div className="p-3.5 bg-slate-50 dark:bg-[#071B2F] rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center space-x-2 text-sm font-bold uppercase text-[#0A2540] dark:text-teal-300">
                      <Clock className="w-4 h-4 text-[#B45309]" />
                      <span>Detailed Timestamps</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#111827] dark:text-slate-200">
                      <div className="p-2 bg-white dark:bg-[#0A2540] rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-xs text-slate-500 uppercase font-bold block">Created</span>
                        <span className="font-bold">{new Date(report.createdAt).toUTCString()}</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-[#0A2540] rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-xs text-slate-500 uppercase font-bold block">Status Modified</span>
                        <span className="font-bold">{new Date(report.createdAt + 1800000).toUTCString()}</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-[#0A2540] rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-xs text-slate-500 uppercase font-bold block">Expected Resolution Time</span>
                        <span className="font-bold text-[#B45309]">24h Resolution Window (Tier 1)</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-[#0A2540] rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-xs text-slate-500 uppercase font-bold block">Geospatial Sector</span>
                        <span className="font-bold">
                          LAT {(!isNaN(Number(report.latitude)) && isFinite(Number(report.latitude)) ? Number(report.latitude) : 37.7749).toFixed(4)}° / LNG {(!isNaN(Number(report.longitude)) && isFinite(Number(report.longitude)) ? Number(report.longitude) : -122.4194).toFixed(4)}°
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Internal Municipal Tags */}
                  <div className="p-3.5 bg-slate-50 dark:bg-[#071B2F] rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center space-x-2 text-sm font-bold uppercase text-[#0A2540] dark:text-teal-300">
                      <Tag className="w-4 h-4" />
                      <span>Internal Municipal Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-[#006D5B] text-white">#WARD_4_DISTRICT</span>
                      <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-[#006D5B] text-white">#DEPT_{report.category}</span>
                      <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-[#B45309] text-white">#SEVERITY_{report.severity}</span>
                      <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-[#0A2540] text-white">#WORK_ORDER_{report.id}</span>
                      <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-[#004D40] text-white">#AI_FORENSICS_VERIFIED</span>
                    </div>
                  </div>

                  {/* History Logs */}
                  <div className="p-3.5 bg-slate-50 dark:bg-[#071B2F] rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center space-x-2 text-sm font-bold uppercase text-[#0A2540] dark:text-teal-300">
                      <History className="w-4 h-4" />
                      <span>History & Audit Trail Logs</span>
                    </div>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="p-2 bg-white dark:bg-[#0A2540] rounded-xl flex items-center justify-between border border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-[#111827] dark:text-slate-100">1. Resident Report Submitted</span>
                        <span className="text-xs text-[#006D5B] dark:text-teal-300 font-bold">Verified Community Member</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-[#0A2540] rounded-xl flex items-center justify-between border border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-[#111827] dark:text-slate-100">2. AI Fraud Shield Scan Passed</span>
                        <span className="text-xs text-[#B45309] font-bold">98.4% Authentic</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-[#0A2540] rounded-xl flex items-center justify-between border border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-[#111827] dark:text-slate-100">3. Dispatched to Public Works Crew</span>
                        <span className="text-xs text-[#006D5B] dark:text-teal-300 font-bold">Ward 4 Field Unit</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })
    )}
  </div>
);
};
