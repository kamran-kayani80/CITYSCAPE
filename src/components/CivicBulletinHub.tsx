import React, { useState, useEffect } from 'react';
import {
  Bell,
  Megaphone,
  AlertTriangle,
  Info,
  Building,
  Calendar,
  Search,
  Filter,
  Share2,
  Volume2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Clock,
  ShieldCheck,
  Globe,
  MapPin,
} from 'lucide-react';
import { CivicAnnouncement } from '../types';
import { MOCK_ANNOUNCEMENTS } from '../lib/constants';
import { useAccessibility } from '../context/AccessibilityContext';
import { ShareModal } from './ShareModal';
import { getShareableUrl, ShareDataPayload } from '../lib/shareUtils';

interface LiveBulletin {
  id: string;
  category: string;
  priority: 'CRITICAL' | 'URGENT' | 'REGULAR';
  title: string;
  description: string;
  department: string;
  sourceName: string;
  sourceUrl?: string;
  publishedAt: string;
  wardZone?: string;
  verifiedBy: string;
}

const POPULAR_CITIES = [
  'Rawalpindi',
  'San Francisco',
  'London',
  'New York',
  'Tokyo',
  'Lahore',
  'Islamabad',
];

export const CivicBulletinHub: React.FC = () => {
  const { speakText } = useAccessibility();
  const [cityName, setCityName] = useState<string>(() => {
    return localStorage.getItem('cityscape_user_city') || 'Rawalpindi';
  });
  const [customCityInput, setCustomCityInput] = useState<string>('');
  const [liveBulletins, setLiveBulletins] = useState<LiveBulletin[]>([]);
  const [refreshedAt, setRefreshedAt] = useState<string>('');
  const [nextRefreshAt, setNextRefreshAt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [fromCache, setFromCache] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [shareData, setShareData] = useState<ShareDataPayload | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Load live bulletins from server
  const fetchCityBulletins = async (cityToFetch: string, forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const res = await fetch(`/api/bulletins/live?city=${encodeURIComponent(cityToFetch)}${forceRefresh ? '&forceRefresh=true' : ''}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.bulletins)) {
          setLiveBulletins(data.bulletins);
          setRefreshedAt(data.refreshedAt || new Date().toISOString());
          setNextRefreshAt(data.nextRefreshAt || new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString());
          setFromCache(!!data.fromCache);
          
          // Broadcast city change event so top header/ticker update too
          localStorage.setItem('cityscape_user_city', cityToFetch);
          window.dispatchEvent(
            new CustomEvent('cityscape_city_changed', { detail: { city: cityToFetch } })
          );
        }
      }
    } catch (err) {
      console.error("[Bulletin Hub] Error fetching live bulletins:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCityBulletins(cityName);
  }, [cityName]);

  const handleCitySelect = (newCity: string) => {
    setCityName(newCity);
    setCustomCityInput('');
  };

  const handleCustomCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCityInput.trim()) {
      setCityName(customCityInput.trim());
      setCustomCityInput('');
    }
  };

  const filteredBulletins = liveBulletins.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.sourceName.toLowerCase().includes(q) ||
        (item.wardZone && item.wardZone.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-['Montserrat']">
      {/* Header Banner */}
      <div className="bg-[#051F20] text-[#DAF1DE] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border-2 border-[#235347]">
        <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-[#235347]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 text-left flex-1 min-w-0">
            <div className="flex items-center space-x-2 flex-wrap gap-1.5 text-left">
              <span className="px-3 py-1 bg-[#163832] text-[#DAF1DE] font-black text-xs uppercase tracking-wider rounded-lg flex items-center gap-1 shadow-xs border border-[#8EB69B]/50">
                <Globe className="w-3.5 h-3.5 text-[#8EB69B]" />
                Live City Intelligence
              </span>
              <span className="text-xs font-extrabold text-[#DAF1DE] bg-[#0B2B26] px-2.5 py-1 rounded-md border border-[#235347] flex items-center gap-1 shadow-xs">
                <Clock className="w-3.5 h-3.5 text-[#8EB69B]" />
                Twice-Daily Auto Extraction
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-['Montserrat'] font-black text-[#DAF1DE] text-left leading-tight tracking-tight">
              Civic Infrastructure Bulletins & News — <span className="text-[#8EB69B] underline decoration-[#235347]">{cityName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#DAF1DE] max-w-2xl font-bold leading-relaxed bg-[#0B2B26]/90 p-3 rounded-xl border border-[#235347] shadow-xs text-left">
              Real-time, authentic city news extracted twice daily from official municipal portals, city councils, public works, WASAs, and verified news websites.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="p-4 bg-[#0B2B26] border border-[#235347] rounded-2xl text-center min-w-[120px] shadow-md backdrop-blur-md">
              <span className="block text-3xl font-black text-[#DAF1DE]">{liveBulletins.length}</span>
              <span className="text-[10px] font-black text-[#8EB69B] uppercase tracking-wider">Extracted News</span>
            </div>
          </div>
        </div>

        {/* City Selector Bar */}
        <div className="relative z-10 mt-6 pt-4 border-t border-[#235347] space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-[#DAF1DE] font-black flex items-center gap-1">
              <MapPin className="w-4 h-4 text-[#8EB69B]" />
              Select Geotagged City for News Extraction:
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap sm:flex-nowrap">
            {POPULAR_CITIES.map((c) => (
              <button
                key={c}
                onClick={() => handleCitySelect(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 border min-h-[36px] ${
                  cityName.toLowerCase() === c.toLowerCase()
                    ? 'bg-[#235347] text-[#DAF1DE] border-[#8EB69B] shadow-md font-black'
                    : 'bg-[#051F20] hover:bg-[#163832] text-[#DAF1DE] border-[#235347]'
                }`}
              >
                📍 {c}
              </button>
            ))}

            {/* Custom City Form */}
            <form onSubmit={handleCustomCitySubmit} className="flex items-center gap-1 shrink-0">
              <input
                type="text"
                placeholder="Other City Name..."
                value={customCityInput}
                onChange={(e) => setCustomCityInput(e.target.value)}
                className="px-3 py-1.5 bg-[#051F20] border border-[#235347] text-[#DAF1DE] rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#8EB69B] min-h-[36px] w-36 placeholder:text-[#8EB69B]/60"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#235347] text-[#DAF1DE] border border-[#8EB69B] font-black rounded-xl text-xs hover:bg-[#163832] min-h-[36px] cursor-pointer shadow-xs"
              >
                Extract
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Twice-Daily Auto-Refresh Status Card */}
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border-2 border-[#235347] bg-[#0B2B26] text-[#DAF1DE] shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#8EB69B] animate-ping" />
            <span className="text-xs font-black uppercase text-[#DAF1DE]">
              Twice-Daily Extraction Engine Active
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#051F20] text-[#8EB69B] border border-[#235347] font-bold">
              {fromCache ? 'Latest Cached Cycle' : 'Live Ground Search Refreshed'}
            </span>
          </div>
          <p className="text-xs text-[#DAF1DE]/90 font-medium">
            <strong className="text-[#8EB69B]">Last Refreshed:</strong> {refreshedAt ? new Date(refreshedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (' + new Date(refreshedAt).toLocaleDateString() + ')' : 'Just Now'} • <strong className="text-[#8EB69B]">Next Auto-Refresh:</strong> {nextRefreshAt ? new Date(nextRefreshAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'In 12 Hours'}
          </p>
          <p className="text-[11px] text-[#8EB69B] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8EB69B]" />
            Scans official council portals, WASA water notices, transit authorities & verified local news outlets.
          </p>
        </div>

        <button
          onClick={() => fetchCityBulletins(cityName, true)}
          disabled={isRefreshing}
          className="px-4 py-2.5 bg-[#163832] hover:bg-[#235347] text-[#DAF1DE] font-extrabold text-xs rounded-2xl shadow-sm transition-all cursor-pointer min-h-[44px] flex items-center justify-center space-x-2 shrink-0 border border-[#8EB69B] disabled:opacity-60"
        >
          <Sparkles className={`w-4 h-4 text-[#8EB69B] ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Extracting Ground News...' : '⚡ Refresh News Now (Gemini Ground Search)'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl border-2 border-[#235347] bg-[#0B2B26] text-[#DAF1DE] shadow-xl space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8EB69B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${cityName} advisories, roadworks, or sources...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#051F20] border border-[#235347] rounded-xl text-xs font-bold text-[#DAF1DE] outline-none min-h-[44px] placeholder:text-[#8EB69B]/60 focus:border-[#8EB69B]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Notices' },
            { id: 'ROADWORK', label: '🚧 Roadworks' },
            { id: 'UTILITY', label: '💧 Utilities' },
            { id: 'EMERGENCY', label: '🚨 Emergencies' },
            { id: 'SENIOR_SERVICES', label: '👵 Senior Mobility' },
            { id: 'PUBLIC_HEARING', label: '🏛️ Town Halls' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 text-xs font-black rounded-xl shrink-0 transition-all cursor-pointer min-h-[40px] border ${
                selectedCategory === cat.id
                  ? 'bg-[#8EB69B] text-[#051F20] border-[#DAF1DE] shadow-md'
                  : 'bg-[#163832] text-[#DAF1DE] hover:bg-[#235347] border-[#235347]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulletins Feed List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-[#0B2B26] border-2 border-[#235347] rounded-3xl p-12 text-center space-y-3 text-[#DAF1DE]">
            <RefreshCw className="w-8 h-8 text-[#8EB69B] animate-spin mx-auto" />
            <h3 className="text-base font-extrabold text-[#DAF1DE]">
              Extracting City Infrastructure Bulletins for {cityName}...
            </h3>
            <p className="text-xs text-[#8EB69B] max-w-sm mx-auto">
              Querying municipal government information departments, city councils, and local authentic press via grounded search.
            </p>
          </div>
        ) : filteredBulletins.length === 0 ? (
          <div className="bg-[#0B2B26] border-2 border-[#235347] rounded-3xl p-12 text-center space-y-3 text-[#DAF1DE]">
            <Megaphone className="w-10 h-10 text-[#8EB69B] mx-auto" />
            <h3 className="text-base font-extrabold text-[#DAF1DE]">No Bulletins Match Filter</h3>
            <p className="text-xs text-[#8EB69B] max-w-sm mx-auto">
              No municipal advisories found for "{searchQuery}" in {cityName}. Try clearing the search query or tapping "Refresh News Now".
            </p>
          </div>
        ) : (
          filteredBulletins.map((item) => {
            const isCritical = item.priority === 'CRITICAL';
            const isUrgent = item.priority === 'URGENT';

            return (
              <div
                key={item.id}
                className={`rounded-3xl border-2 transition-all p-5 sm:p-6 space-y-3.5 shadow-xl ${
                  isCritical
                    ? 'bulletin-card-critical'
                    : isUrgent
                    ? 'bulletin-card-urgent'
                    : 'bulletin-card-dark'
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 text-left">
                  <div className="flex items-start space-x-3 flex-1 min-w-0 text-left">
                    <div
                      className={`p-3 rounded-2xl shrink-0 font-black ${
                        isCritical
                          ? 'bg-rose-600 text-white shadow-xs'
                          : isUrgent
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-[#163832] text-[#DAF1DE] border border-[#8EB69B]'
                      }`}
                    >
                      {isCritical ? (
                        <AlertTriangle className="w-5 h-5 animate-pulse" />
                      ) : isUrgent ? (
                        <Bell className="w-5 h-5" />
                      ) : (
                        <Info className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0 text-left">
                      <div className="flex items-center space-x-2 flex-wrap gap-1.5 text-left">
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#051F20] text-[#DAF1DE] border border-[#235347]">
                          🏛️ {item.department}
                        </span>
                        {item.wardZone && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#163832] text-[#8EB69B] border border-[#235347]">
                            📍 {item.wardZone}
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#235347] text-[#DAF1DE] border border-[#8EB69B] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#8EB69B]" />
                          {item.verifiedBy || 'Verified Source'}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-xl font-['Montserrat'] font-black text-[#DAF1DE] pt-1 leading-snug text-left tracking-tight">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => speakText(`${item.title}. Published by ${item.department}. ${item.description}`)}
                    className="p-2.5 bg-[#163832] hover:bg-[#235347] text-[#DAF1DE] border border-[#8EB69B] rounded-xl transition-all cursor-pointer min-h-[42px] min-w-[42px] flex items-center justify-center shrink-0"
                    title="Read bulletin aloud"
                  >
                    <Volume2 className="w-4.5 h-4.5 text-[#DAF1DE]" />
                  </button>
                </div>

                {/* Description Body */}
                <p className="text-xs sm:text-sm text-[#DAF1DE]/95 font-medium leading-relaxed">
                  {item.description}
                </p>

                {/* Source & Actions Footer Bar */}
                <div className="flex items-center justify-between text-xs pt-3 border-t border-[#235347] flex-wrap gap-2">
                  <div className="flex items-center space-x-2 text-[11px] text-[#8EB69B] font-semibold">
                    <Globe className="w-3.5 h-3.5 text-[#8EB69B]" />
                    <span>Source: <strong className="text-[#DAF1DE]">{item.sourceName}</strong></span>
                    <span className="text-[#235347]">•</span>
                    <span>{item.publishedAt}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#163832] text-[#DAF1DE] border border-[#8EB69B] rounded-xl text-xs font-extrabold hover:bg-[#235347] cursor-pointer min-h-[38px] flex items-center space-x-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#8EB69B]" />
                        <span>Official Source</span>
                      </a>
                    )}

                    <button
                      onClick={() => {
                        setShareData({
                          type: 'bulletin',
                          title: item.title,
                          text: `${item.department} Notice: ${item.description}`,
                          url: getShareableUrl('bulletin', item.id),
                          idOrTag: item.id,
                          address: item.wardZone ? `Ward/Zone: ${item.wardZone}` : undefined,
                          category: item.department,
                        });
                        setIsShareModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-[#163832] text-[#DAF1DE] border border-[#8EB69B] rounded-xl text-xs font-bold hover:bg-[#235347] cursor-pointer min-h-[38px] flex items-center space-x-1"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#8EB69B]" />
                      <span>Share Advisory</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={shareData}
      />
    </div>
  );
};
