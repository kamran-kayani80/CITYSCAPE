import React, { useEffect, useState } from 'react';
import { Flame, TrendingUp, Sparkles, ChevronRight, Hash, Database, RefreshCw } from 'lucide-react';
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
    <div className={`p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-indigo-100 dark:border-slate-800 shadow-xl space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
            <Flame className="w-4 h-4 fill-slate-950" />
          </div>
          <div>
            <h3 className="font-heading font-black text-sm text-[#1c1a3b] dark:text-white uppercase tracking-tight flex items-center gap-1.5">
              <span>What's Happening</span>
              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
            </h3>
            <p className="text-[10px] font-mono text-slate-400">
              Velocity Engine • Updated {lastRefreshed}
            </p>
          </div>
        </div>

        <button
          onClick={loadTrending}
          title="Recalculate Time-Decay Score"
          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
        </button>
      </div>

      {/* Tags List */}
      <div className="space-y-2">
        {isLoading && trendingTags.length === 0 ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          trendingTags.slice(0, 6).map((tag, idx) => (
            <div
              key={tag.id || tag.name}
              onClick={() => onSelectHashtag(tag.name)}
              className="group p-3 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-indigo-600 dark:hover:bg-indigo-600 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-500 transition-all duration-200 cursor-pointer flex items-center justify-between active:scale-[0.98]"
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 group-hover:bg-indigo-500 text-indigo-700 dark:text-indigo-300 group-hover:text-amber-300 font-mono font-black text-xs flex items-center justify-center shrink-0">
                  #{idx + 1}
                </div>

                <div>
                  <div className="font-mono font-black text-xs text-slate-900 dark:text-white group-hover:text-white flex items-center gap-1">
                    <span>#{tag.displayName}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 group-hover:text-indigo-100 flex items-center gap-2">
                    <span>{tag.usageCount} total reports</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 group-hover:text-amber-300 font-bold flex items-center gap-0.5">
                      <TrendingUp className="w-2.5 h-2.5" />
                      +{tag.recentCount} past 4h
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 group-hover:bg-amber-400 text-amber-900 dark:text-amber-200 group-hover:text-slate-950 font-mono font-black text-[9px] uppercase border border-amber-300/40">
                  {tag.trendingScore ? `${tag.trendingScore} pts` : 'Hot'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* SQL Architecture / Time-decay algorithm banner */}
      {onOpenArchitectureModal && (
        <button
          onClick={onOpenArchitectureModal}
          className="w-full py-2.5 px-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl text-[11px] font-mono font-bold flex items-center justify-between border border-indigo-800/80 hover:border-amber-400/80 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>SQL Schema & Velocity Algorithm</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
};
