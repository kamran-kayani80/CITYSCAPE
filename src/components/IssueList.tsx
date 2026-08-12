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
} from 'lucide-react';
import { Report, ReportFilter } from '../types';
import { STATUS_CONFIG, CATEGORY_CONFIG, SEVERITY_CONFIG } from '../lib/constants';
import { CategoryIcon } from './CategoryIcon';
import { formatTimeAgo } from '../lib/utils';
import { useUserLocation } from '../hooks/useUserLocation';
import { calculateDistanceKm, formatDistanceTag } from '../lib/geoUtils';
import { ReportMapDirections } from './ReportMapDirections';

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
  const searchContainerRef = useRef<HTMLDivElement>(null);

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
    <div className="space-y-3 font-['Montserrat']">
      {/* Auto-Suggest Search Bar Section */}
      <div ref={searchContainerRef} className="relative z-30">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#006D5B] dark:text-[#CCFF00] pointer-events-none">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setIsSuggestionsOpen(true)}
            placeholder="Search categories (pothole, water), wards, streets..."
            className="w-full pl-10 pr-9 py-2.5 ui-kit-input text-xs font-bold outline-none shadow-xs transition-all placeholder:text-slate-400 min-h-[48px]"
          />

          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
              className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#006D5B] dark:border-slate-700 shadow-2xl overflow-hidden z-50 divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto"
            >
              {/* Dropdown Header Label */}
              <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <span className="flex items-center space-x-1.5 text-[#006D5B] dark:text-[#CCFF00]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Predicted Suggestions</span>
                </span>
                <span className="font-mono text-[9px] text-slate-400">{suggestions.length} items</span>
              </div>

              {suggestions.length === 0 ? (
                <div className="p-4 text-center text-xs font-bold text-slate-500">
                  No matching category, ward, or hazard suggestions found.
                </div>
              ) : (
                suggestions.map((item) => {
                  let badgeBg = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
                  let Icon = Tag;

                  if (item.type === 'category') {
                    badgeBg = 'bg-[#006D5B]/10 text-[#006D5B] dark:bg-[#006D5B]/30 dark:text-[#CCFF00]';
                    Icon = Tag;
                  } else if (item.type === 'location') {
                    badgeBg = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
                    Icon = MapPin;
                  } else if (item.type === 'hazard') {
                    badgeBg = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
                    Icon = ShieldAlert;
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectSuggestion(item)}
                      className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800/90 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`p-2 rounded-xl shrink-0 ${badgeBg}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-[#051F20] dark:text-[#DAF1DE] truncate group-hover:text-[#163832] dark:group-hover:text-[#8EB69B]">
                            {item.title}
                          </p>
                          <p className="text-[10px] font-semibold text-[#235347] dark:text-slate-400 truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0 text-slate-400 group-hover:text-[#006D5B] dark:group-hover:text-[#CCFF00]">
                        <span className="text-[10px] font-extrabold uppercase hidden sm:inline">Select</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
          const isActive = selectedCategoryFilter === key;
          return (
            <button
              key={key}
              onClick={() => handleSelectCategoryChip(key)}
              className={`px-3.5 py-1.5 text-[11px] uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 border min-h-[36px] ${
                isActive
                  ? 'ui-kit-chip-active'
                  : 'ui-kit-chip-default'
              }`}
            >
              <span>{config.label}</span>
              {isActive && <Check className="w-3 h-3 text-[#063B2F]" />}
            </button>
          );
        })}
      </div>

      {/* Sidebar header */}
      <div className="p-3.5 clay-card-lvl2 flex items-center justify-between shadow-sm">
        <span className="text-xs font-black uppercase tracking-widest text-[#051F20]">
          Nearby Reports ({displayedReports.length})
        </span>

        {userCoords ? (
          <span className="text-[10px] font-mono text-[#063B2F] bg-[#A3E8D5] px-2.5 py-1 rounded-full font-extrabold border border-[#7CD6B8] flex items-center gap-1 shadow-2xs">
            <Navigation className="w-3 h-3 text-[#063B2F] fill-current" />
            <span>GPS ACTIVE</span>
          </span>
        ) : isLocating ? (
          <span className="text-[10px] font-mono text-[#5C2718] bg-[#F5D0C0] px-2.5 py-1 rounded-full font-extrabold border border-[#E5B3A3] animate-pulse">
            LOCATING GPS...
          </span>
        ) : (
          <button
            onClick={requestLocation}
            className="text-[10px] font-mono text-[#063B2F] bg-[#A3D5E0] hover:bg-[#8ACCD8] px-2.5 py-1 rounded-full font-extrabold border border-[#7BC3CF] flex items-center gap-1 transition-all cursor-pointer"
          >
            <Locate className="w-3 h-3 text-[#093C47]" />
            <span>ENABLE DISTANCE</span>
          </button>
        )}
      </div>

      {displayedReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[220px]">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-[#051F20]">No Issues Match Search</h3>
          <p className="text-xs text-slate-500 max-w-xs mt-1">
            No civic reports match "{query || selectedCategoryFilter}". Try clearing your search query or selecting a different category filter!
          </p>
          {(query || selectedCategoryFilter !== 'ALL') && (
            <button
              onClick={() => {
                clearSearch();
                handleSelectCategoryChip('ALL');
              }}
              className="mt-3 px-4 py-2 bg-[#006D5B] text-white rounded-xl text-xs font-black hover:bg-[#005244] transition-colors cursor-pointer"
            >
              Reset Search & Filters
            </button>
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

        return (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: Math.min(idx * 0.04, 0.3), ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onSelectReport(report)}
            className={`group relative report-card-container p-5 transition-all duration-200 cursor-pointer font-['Montserrat'] ${
              isEmergency
                ? 'border-2 border-red-500 bg-red-50/80 dark:bg-red-950/40 shadow-red-100/60 shadow-md'
                : isSelected
                ? 'ring-3 ring-[#163832] bg-[#DAF1DE] shadow-xl border-[#163832]'
                : 'hover:border-[#235347]'
            }`}
          >
            {/* High-Contrast Visual Alert Badge for Emergency Reports */}
            {isEmergency && (
              <div className="mb-3 px-3 py-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-between shadow-md border border-red-400">
                <div className="flex items-center space-x-1.5">
                  <Siren className="w-4 h-4 animate-bounce text-[#DAF1DE]" />
                  <span>EMERGENCY HAZARD ALERT</span>
                </div>
                <span className="bg-red-950/80 text-red-100 px-2 py-0.5 rounded font-mono text-[9px] font-extrabold border border-red-400/50">
                  CRITICAL
                </span>
              </div>
            )}

            {/* Offline Queued Badge for Underground Created Reports */}
            {(report.id.startsWith('off_') || (report as any).isOfflineQueued) && (
              <div className="mb-2 px-2.5 py-1 bg-[#051F20] text-[#DAF1DE] border border-[#8EB69B] rounded-xl text-[10px] font-mono font-bold flex items-center justify-between shadow-xs">
                <div className="flex items-center space-x-1.5">
                  <WifiOff className="w-3.5 h-3.5 text-[#8EB69B] shrink-0" />
                  <span>📡 OFFLINE QUEUED: SUB-SURFACE SYNC READY</span>
                </div>
                <span className="text-[9px] bg-[#235347] text-[#DAF1DE] px-1.5 py-0.5 rounded font-black border border-[#8EB69B]">
                  AUTO-SYNC
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
                  className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-xs border border-black/30"
                  style={{ backgroundColor: statusConf.pinHex }}
                >
                  {statusConf.label}
                </span>

                {distanceTag && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#235347] text-[#DAF1DE] border border-[#8EB69B] flex items-center gap-1 shadow-2xs">
                    <Navigation className="w-2.5 h-2.5 text-[#8EB69B]" />
                    <span>{distanceTag}</span>
                  </span>
                )}
              </div>

              <span className="text-xs text-[#051F20] dark:text-[#051F20] font-mono font-black px-2.5 py-0.5 bg-[#8EB69B]/40 dark:bg-[#8EB69B]/30 rounded-lg border border-[#8EB69B]/60">#{report.id}</span>
            </div>

            <div className="flex gap-3 my-2.5">
              <img
                src={report.imageUrls[0]}
                alt={report.title}
                className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-[#051F20] border-2 border-[#8EB69B] shadow-xs group-hover:scale-102 transition-transform duration-300"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-['Montserrat'] font-black text-[#051F20] dark:text-[#051F20] text-base sm:text-lg line-clamp-1 group-hover:text-[#163832] dark:group-hover:text-[#163832] transition-colors">
                  {report.title}
                </h3>
                <p className="text-xs text-[#0B2B26] dark:text-[#0B2B26] line-clamp-2 mt-1 leading-relaxed font-bold">
                  {report.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t-2 border-[#8EB69B]/50 dark:border-[#235347] gap-2 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-1.5 text-xs text-[#051F20] dark:text-[#051F20] font-extrabold truncate max-w-[220px]">
                <MapPin className="w-4 h-4 text-[#163832] dark:text-[#163832] shrink-0" />
                <span className="truncate">{report.addressText}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <ReportMapDirections report={report} variant="button-only" />

                <span className={`px-2.5 py-1 text-[10px] rounded-full font-black uppercase tracking-wider border shadow-2xs ${sevConf.colorClass}`}>
                  {sevConf.label}
                </span>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={(e) => onUpvoteReport(report.id, e)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-black transition-all cursor-pointer min-h-[48px] min-w-[48px] justify-center ${
                    report.userHasUpvoted
                      ? 'bg-[#051F20] text-[#DAF1DE] shadow-md border-2 border-[#8EB69B]'
                      : 'bg-[#163832] text-[#DAF1DE] border-2 border-[#8EB69B] hover:bg-[#051F20] hover:text-white'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${report.userHasUpvoted ? 'fill-current text-[#DAF1DE]' : 'text-[#DAF1DE]'}`} />
                  <span className="font-extrabold">{report.upvotesCount}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        );
      })
    )}
  </div>
);
};
