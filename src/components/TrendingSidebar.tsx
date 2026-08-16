import React, { useEffect, useState } from 'react';
import { Flame, TrendingUp, Sparkles, ChevronRight, Hash, RefreshCw } from 'lucide-react';
import { HashtagRecord, computeTrendingHashtags } from '../lib/trendingAlgorithm';

interface TrendingSidebarProps {
  onSelectHashtag: (tag: string) => void;
  onOpenArchitectureModal?: () => void;
  className?: string;
}

export const TrendingSidebar: React.FC<TrendingSidebarProps> = ({
  onSelectHashtag,
  onOpenArchitectureModal,
  className = '',
}) => {
  const [trendingTags, setTrendingTags] = useState<HashtagRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  const defaultMockTags: HashtagRecord[] = [
    { id: '1', name: 'potholefix', displayName: 'PotholeFix', usageCount: 64, recentCount: 18, category: 'ROADS_TRAFFIC', createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', name: 'waterleak', displayName: 'WaterLeak', usageCount: 42, recentCount: 14, category: 'WATER_LEAK', createdAt: new Date(Date.now() - 3600000 * 3).toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', name: 'streetlighting', displayName: 'StreetLighting', usageCount: 38, recentCount: 9, category: 'LIGHTING', createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), updatedAt: new Date().toISOString() },
    { id: '4', name: 'cleanstreets', displayName: 'CleanStreets', usageCount: 29, recentCount: 8, category: 'SANITATION', createdAt: new Date(Date.now() - 3600000 * 6).toISOString(), updatedAt: new Date().toISOString() },
    { id: '5', name: 'sf94102', displayName: 'SF94102', usageCount: 52, recentCount: 11, category: 'NEIGHBORHOOD', createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), updatedAt: new Date().toISOString() },
    { id: '6', name: 'parksafety', displayName: 'ParkSafety', usageCount: 21, recentCount: 5, category: 'SAFETY', createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), updatedAt: new Date().toISOString() },
  ];

  const loadTrending = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/hashtags/trending');
      if (res.ok) {
        const data = await res.json();
        if (data.trending && data.trending.length > 0) {
          setTrendingTags(data.trending);
          setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to load trending API, computing fallback:', err);
    }

    // Compute fallback with time-decay formula
    const computed = computeTrendingHashtags(defaultMockTags);
    setTrendingTags(computed);
    setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setIsLoading(false);
  };

  useEffect(() => {
    loadTrending();
    // Refresh interval every 30s
    const interval = setInterval(loadTrending, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`p-3.5 bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-2.5 text-[#111827] dark:text-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b-1.5 border-[#CBD5E1] dark:border-slate-700">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#006D5B] text-white flex items-center justify-center font-bold shadow-xs">
            <Flame className="w-4 h-4 fill-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-xs text-[#111827] dark:text-white uppercase tracking-wider flex items-center gap-1">
              <span>Trending Priorities</span>
              <Sparkles className="w-3.5 h-3.5 text-[#B45309] dark:text-teal-300 animate-pulse" />
            </h3>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold hidden sm:inline">
              • Updated {lastRefreshed}
            </span>
          </div>
        </div>

        <button
          onClick={loadTrending}
          title="Recalculate Time-Decay Score"
          aria-label="Refresh trending topics"
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-[#0A2540] dark:hover:text-white rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-all cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center border border-[#CBD5E1] dark:border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#006D5B]' : ''}`} />
        </button>
      </div>

      {/* Tags List: Accessible Badges */}
      <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1">
        {isLoading && trendingTags.length === 0 ? (
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          trendingTags.slice(0, 6).map((tag, idx) => (
            <button
              key={tag.id || tag.name}
              onClick={() => onSelectHashtag(tag.name)}
              className="group px-3 py-1.5 bg-slate-100 hover:bg-[#0A2540] text-[#111827] hover:text-white dark:bg-[#071B2F] dark:hover:bg-[#006D5B] dark:text-slate-100 rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer min-h-[36px] whitespace-nowrap leading-none shadow-2xs active:scale-95"
            >
              <span className="text-xs text-[#006D5B] dark:text-teal-300 group-hover:text-teal-200 font-bold">#{idx + 1}</span>
              <span>#{tag.displayName}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 group-hover:text-slate-200 font-mono">({tag.usageCount})</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
