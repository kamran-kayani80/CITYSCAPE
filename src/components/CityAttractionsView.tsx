import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Landmark,
  ThumbsUp,
  MapPin,
  History,
  Info,
  Clock,
  Sparkles,
  Search,
  Volume2,
  VolumeX,
  Bookmark,
  CheckCircle2,
  Navigation,
  Calendar,
  Layers,
  Award,
  Loader2,
  Building2,
  Trees,
  Scroll,
  ShoppingBag,
  Send,
  MessageSquare,
  Compass,
  ArrowUpDown,
  Share2,
  X,
  HelpCircle,
} from 'lucide-react';
import {
  CITY_ATTRACTIONS_DATA,
  CityAttraction,
  CityAttractionGroup,
  getAttractionsForCity,
} from '../data/cityAttractionsData';
import { CityHistoryCultureHub } from './CityHistoryCultureHub';

interface CityAttractionsViewProps {
  initialCityName?: string;
  onAwardKarma?: (amount: number, reason: string) => void;
  onNavigateToMap?: () => void;
}

type SortOption = 'upvotes' | 'rating' | 'name' | 'heritage';

export const CityAttractionsView: React.FC<CityAttractionsViewProps> = ({
  initialCityName = 'Rawalpindi',
  onAwardKarma,
  onNavigateToMap,
}) => {
  // Active city selection
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    const saved = localStorage.getItem('cityscape_active_city');
    if (saved && CITY_ATTRACTIONS_DATA[saved.toLowerCase()]) {
      return saved.toLowerCase();
    }
    return initialCityName.toLowerCase();
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('upvotes');
  const [selectedAttraction, setSelectedAttraction] = useState<CityAttraction | null>(null);

  // Persistent Upvotes State (Map of attractionId -> boolean)
  const [userUpvotes, setUserUpvotes] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('cityscape_attraction_upvotes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Upvote count offsets (for dynamic local increment)
  const [upvoteCounts, setUpvoteCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('cityscape_attraction_upvote_counts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Audio Guide Narration State
  const [isNarrating, setIsNarrating] = useState<string | null>(null);

  // Check-in & Itinerary Bookmarks in LocalStorage
  const [checkedInAttractions, setCheckedInAttractions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cityscape_visited_attractions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedItinerary, setSavedItinerary] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cityscape_saved_itinerary');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // GPS Auto-detect state
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationToast, setLocationToast] = useState<string | null>(null);

  // AI Civic Historian Chat State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const cityData: CityAttractionGroup = useMemo(() => {
    const data = getAttractionsForCity(selectedCityId);
    return data || CITY_ATTRACTIONS_DATA['rawalpindi'];
  }, [selectedCityId]);

  // Set default selected attraction when city changes
  useEffect(() => {
    if (cityData.attractions.length > 0) {
      setSelectedAttraction(cityData.attractions[0]);
    }
    localStorage.setItem('cityscape_active_city', selectedCityId);
  }, [selectedCityId, cityData]);

  // Handle Neighbor Upvoting
  const handleToggleUpvote = (attraction: CityAttraction, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const currentStatus = !!userUpvotes[attraction.id];
    const newStatus = !currentStatus;

    const updatedUserUpvotes = { ...userUpvotes, [attraction.id]: newStatus };
    setUserUpvotes(updatedUserUpvotes);
    localStorage.setItem('cityscape_attraction_upvotes', JSON.stringify(updatedUserUpvotes));

    const currentOffset = upvoteCounts[attraction.id] || 0;
    const newOffset = newStatus ? currentOffset + 1 : Math.max(0, currentOffset - 1);
    const updatedCounts = { ...upvoteCounts, [attraction.id]: newOffset };
    setUpvoteCounts(updatedCounts);
    localStorage.setItem('cityscape_attraction_upvote_counts', JSON.stringify(updatedCounts));

    if (newStatus && onAwardKarma) {
      onAwardKarma(15, `Recommended ${attraction.name}! Thank you for guiding fellow neighbors.`);
    }
  };

  const getEffectiveUpvotes = (attraction: CityAttraction) => {
    const userOffset = upvoteCounts[attraction.id] || 0;
    return (attraction.upvotes || 0) + userOffset;
  };

  // Audio narration handler using Web Speech API
  const handleToggleNarration = (attraction: CityAttraction) => {
    if (typeof window === 'undefined') return;

    if (isNarrating === attraction.id) {
      window.speechSynthesis?.cancel();
      setIsNarrating(null);
    } else {
      window.speechSynthesis?.cancel();
      const narrativeText = `${attraction.name}. ${attraction.shortSummary} Historical background: ${attraction.historicalBrief} Community significance: ${attraction.generalSignificance}`;
      const utterance = new SpeechSynthesisUtterance(narrativeText);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsNarrating(null);
      utterance.onerror = () => setIsNarrating(null);
      window.speechSynthesis?.speak(utterance);
      setIsNarrating(attraction.id);
    }
  };

  // Stop speech when unmounting or switching
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  // Filtered & Sorted attractions
  const filteredAndSortedAttractions = useMemo(() => {
    let list = cityData.attractions.filter((att) => {
      const matchesSearch =
        searchQuery === '' ||
        att.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (att.localName && att.localName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        att.shortSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        att.historicalBrief.toLowerCase().includes(searchQuery.toLowerCase()) ||
        att.generalSignificance.toLowerCase().includes(searchQuery.toLowerCase()) ||
        att.era.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'ALL' || att.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    return list.sort((a, b) => {
      if (sortBy === 'upvotes') {
        return getEffectiveUpvotes(b) - getEffectiveUpvotes(a);
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'heritage') {
        return a.heritageStatus.localeCompare(b.heritageStatus);
      }
      return 0;
    });
  }, [cityData, searchQuery, selectedCategory, sortBy, upvoteCounts]);

  // GPS Auto-detect Location
  const handleAutoDetectGPS = () => {
    if (!navigator.geolocation) {
      setLocationToast('Geolocation is not supported on this browser.');
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=10`
          );
          if (res.ok) {
            const data = await res.json();
            const rawCity =
              data.address?.city ||
              data.address?.town ||
              data.address?.county ||
              'Rawalpindi';
            const clean = rawCity.toLowerCase();
            if (CITY_ATTRACTIONS_DATA[clean]) {
              setSelectedCityId(clean);
              setLocationToast(`Located in ${rawCity}! Showing local destinations.`);
            } else {
              const matchedKey = Object.keys(CITY_ATTRACTIONS_DATA).find((k) =>
                clean.includes(k) || k.includes(clean)
              );
              if (matchedKey) {
                setSelectedCityId(matchedKey);
                setLocationToast(`Located in ${rawCity}! Loaded ${CITY_ATTRACTIONS_DATA[matchedKey].cityName} guide.`);
              } else {
                setSelectedCityId('rawalpindi');
                setLocationToast(`Detected ${rawCity}. Showing regional heritage destinations.`);
              }
            }
          }
        } catch {
          setLocationToast('Location detected. Loaded regional destinations.');
        } finally {
          setIsDetectingLocation(false);
          setTimeout(() => setLocationToast(null), 4500);
        }
      },
      () => {
        setIsDetectingLocation(false);
        setLocationToast('GPS permission not granted. Please pick a city manually.');
        setTimeout(() => setLocationToast(null), 4000);
      },
      { timeout: 5000 }
    );
  };

  // Toggle Check-in / Visit
  const handleToggleVisited = (attractionId: string, attractionName: string) => {
    const isVisited = checkedInAttractions.includes(attractionId);
    let updated: string[];
    if (isVisited) {
      updated = checkedInAttractions.filter((id) => id !== attractionId);
    } else {
      updated = [...checkedInAttractions, attractionId];
      if (onAwardKarma) {
        onAwardKarma(25, `Checked in at ${attractionName}! Civic explorer badge progress.`);
      }
    }
    setCheckedInAttractions(updated);
    localStorage.setItem('cityscape_visited_attractions', JSON.stringify(updated));
  };

  // Toggle Saved Itinerary
  const handleToggleItinerary = (attractionId: string) => {
    const isSaved = savedItinerary.includes(attractionId);
    const updated = isSaved
      ? savedItinerary.filter((id) => id !== attractionId)
      : [...savedItinerary, attractionId];
    setSavedItinerary(updated);
    localStorage.setItem('cityscape_saved_itinerary', JSON.stringify(updated));
  };

  // AI Historian Query
  const handleAskHistorian = async () => {
    if (!aiQuestion.trim()) return;
    setIsAiLoading(true);
    setAiAnswer(null);

    try {
      const activeAttraction = selectedAttraction || cityData.attractions[0];
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are the Lead Cityscape Civic Historian for ${cityData.cityName} (${cityData.country}). Answer the resident's question clearly, warmly, respectfully, and with rich historical depth.
          
Current City: ${cityData.cityName}
Current Focus Destination: ${activeAttraction.name} (${activeAttraction.era}, Built: ${activeAttraction.builtYear})
Summary: ${activeAttraction.shortSummary}
Historical Brief: ${activeAttraction.historicalBrief}
Resident's Question: "${aiQuestion}"`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiAnswer(data.text || data.response || 'Historical archives consulted.');
      } else {
        const activeAttraction = selectedAttraction || cityData.attractions[0];
        setAiAnswer(
          `${activeAttraction.name} is one of the most valued civic landmarks in ${cityData.cityName}. Originating from the ${activeAttraction.era} (${activeAttraction.builtYear}), it embodies the enduring architectural tradition and community pride of ${cityData.demonym}s.`
        );
      }
    } catch {
      const activeAttraction = selectedAttraction || cityData.attractions[0];
      setAiAnswer(
        `${activeAttraction.name} stands as an enduring symbol of ${cityData.cityName}'s heritage. Completed in ${activeAttraction.builtYear}, it connects modern residents with centuries of local history and architectural excellence.`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div id="city-destinations-hub" className="space-y-6 pb-12">
      {/* Top Header & City Selector Bar */}
      <section className="bg-white dark:bg-[#0A2540] rounded-3xl p-5 sm:p-7 border-2 border-[#CBD5E1] dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="space-y-5">
          {/* Title, Badge & Slogan */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#006D5B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs">
                  <Landmark className="w-4 h-4 text-amber-300" />
                  <span>Neighborhood Heritage & Tourist Briefs</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-950/60 text-[#B45309] dark:text-amber-300 text-xs font-bold rounded-xl border border-amber-300/40">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Resident-Voted & Ranked</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
                {cityData.cityName} Tourist Destinations & Heritage Briefs
              </h1>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 mt-1 max-w-3xl leading-relaxed">
                {cityData.description}
              </p>
            </div>

            {/* GPS Auto-Detect Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                id="btn-autodetect-city"
                type="button"
                onClick={handleAutoDetectGPS}
                disabled={isDetectingLocation}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#006D5B] hover:bg-[#005244] text-white text-sm font-bold rounded-2xl shadow-sm transition-all cursor-pointer min-h-[56px]"
              >
                {isDetectingLocation ? (
                  <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
                ) : (
                  <MapPin className="w-5 h-5 text-amber-300" />
                )}
                <span>{isDetectingLocation ? 'Locating...' : 'Auto-Detect My City'}</span>
              </button>
            </div>
          </div>

          {/* Location Toast Notification */}
          <AnimatePresence>
            {locationToast && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -6 }}
                className="py-3 px-4 rounded-2xl bg-[#006D5B] text-white text-sm font-bold flex items-center gap-2 shadow-sm border border-teal-300/40"
              >
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{locationToast}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* City Selection Carousel */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Explore Destinations by City ({Object.keys(CITY_ATTRACTIONS_DATA).length} Cities Available):
              </span>
            </div>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
              {Object.values(CITY_ATTRACTIONS_DATA).map((group) => {
                const isActive = group.cityId === selectedCityId;
                return (
                  <button
                    key={group.cityId}
                    id={`city-tab-${group.cityId}`}
                    type="button"
                    onClick={() => {
                      setSelectedCityId(group.cityId);
                      setSelectedCategory('ALL');
                    }}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer min-h-[48px] shrink-0 border-2 ${
                      isActive
                        ? 'bg-[#0A2540] dark:bg-[#006D5B] text-white border-[#006D5B] dark:border-teal-300 shadow-md scale-102'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700 hover:border-[#006D5B]'
                    }`}
                  >
                    <Building2 className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-[#006D5B]'}`} />
                    <span>{group.cityName}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-lg font-extrabold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {group.attractions.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive City Genesis History, Famous Luminaries & Cultural Dossier */}
      <CityHistoryCultureHub cityData={cityData} />

      {/* Search, Filter & Upvote Sort Toolbar */}
      <section className="bg-white dark:bg-[#0A2540] rounded-3xl p-4 sm:p-5 border-2 border-[#CBD5E1] dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Field */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="attraction-search-input"
              type="text"
              placeholder={`Search ${cityData.cityName} destinations, historical periods, monuments...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-9 py-3 bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 focus:border-[#0A2540] dark:focus:border-teal-400 rounded-2xl outline-none text-sm font-semibold text-[#111827] dark:text-white min-h-[50px] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Upvote & Sort Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden sm:inline-flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort By:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'upvotes', label: 'Top Neighbor Votes', icon: ThumbsUp },
                { id: 'rating', label: 'Rating', icon: Award },
                { id: 'name', label: 'A to Z', icon: Building2 },
                { id: 'heritage', label: 'Heritage Tier', icon: Landmark },
              ].map((opt) => {
                const isSelected = sortBy === opt.id;
                const IconComp = opt.icon;
                return (
                  <button
                    key={opt.id}
                    id={`sort-btn-${opt.id}`}
                    onClick={() => setSortBy(opt.id as SortOption)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[40px] border ${
                      isSelected
                        ? 'bg-[#B45309] text-white border-[#B45309] shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-200' : 'text-[#B45309]'}`} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-thin border-t border-slate-100 dark:border-slate-800">
          {[
            { id: 'ALL', label: 'All Destinations', icon: Layers },
            { id: 'MONUMENT', label: 'Historic Forts & Monuments', icon: Landmark },
            { id: 'RELIGIOUS', label: 'Mosques, Shrines & Temples', icon: Scroll },
            { id: 'NATURE', label: 'Parks & Eco Sanctuaries', icon: Trees },
            { id: 'MUSEUM', label: 'Museums & Antiquities', icon: Award },
            { id: 'BAZAAR', label: 'Historic Bazaars & Markets', icon: ShoppingBag },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const IconComp = cat.icon;
            return (
              <button
                key={cat.id}
                id={`filter-cat-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer min-h-[40px] shrink-0 border ${
                  isSelected
                    ? 'bg-[#006D5B] text-white border-[#006D5B] shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-[#006D5B]'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Grid: Destinations List (Left) & Full Structured Brief Showcase (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Destination Brief Cards with Upvoting Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Showing {filteredAndSortedAttractions.length} Destination{filteredAndSortedAttractions.length !== 1 ? 's' : ''} in {cityData.cityName}
            </span>
            {savedItinerary.length > 0 && (
              <span className="text-xs font-bold text-[#B45309] bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-800">
                {savedItinerary.length} Saved in Itinerary
              </span>
            )}
          </div>

          {filteredAndSortedAttractions.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#0A2540] rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 space-y-3">
              <Landmark className="w-10 h-10 mx-auto text-slate-400" />
              <p className="text-base font-bold text-slate-700 dark:text-slate-200">
                No tourist destinations matched your criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
                className="px-5 py-2.5 bg-[#006D5B] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer min-h-[44px]"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredAndSortedAttractions.map((attraction, rankIndex) => {
              const isSelected = selectedAttraction?.id === attraction.id;
              const isVisited = checkedInAttractions.includes(attraction.id);
              const isSaved = savedItinerary.includes(attraction.id);
              const hasUpvoted = !!userUpvotes[attraction.id];
              const totalVotes = getEffectiveUpvotes(attraction);

              return (
                <motion.div
                  key={attraction.id}
                  layout
                  id={`attraction-card-${attraction.id}`}
                  onClick={() => setSelectedAttraction(attraction)}
                  className={`group rounded-3xl p-5 border-2 transition-all cursor-pointer relative bg-white dark:bg-[#0A2540] ${
                    isSelected
                      ? 'border-[#006D5B] dark:border-teal-400 ring-2 ring-[#006D5B]/30 shadow-lg'
                      : 'border-[#CBD5E1] dark:border-slate-800 hover:border-teal-600 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Active Indicator Strip */}
                  {isSelected && (
                    <div className="absolute top-0 left-0 bottom-0 w-2 bg-[#006D5B] dark:bg-teal-400 rounded-l-3xl" />
                  )}

                  <div className="space-y-3">
                    {/* Header Row: Rank Badge, Category, Built Year & Upvote Trigger */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Rank Badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black ${
                            rankIndex === 0
                              ? 'bg-amber-500 text-white shadow-xs'
                              : rankIndex === 1
                              ? 'bg-slate-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          #{rankIndex + 1}
                        </span>

                        <span className="text-xs font-extrabold uppercase tracking-wider text-[#006D5B] dark:text-teal-300">
                          {attraction.categoryLabel}
                        </span>
                      </div>

                      {/* Interactive Neighbor Upvote Button */}
                      <button
                        id={`upvote-btn-${attraction.id}`}
                        type="button"
                        onClick={(e) => handleToggleUpvote(attraction, e)}
                        title={hasUpvoted ? 'Remove your neighbor upvote' : 'Recommend this destination to neighbors'}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer min-h-[44px] shrink-0 border ${
                          hasUpvoted
                            ? 'bg-[#B45309] text-white border-[#B45309] shadow-md scale-105'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-[#B45309] dark:text-amber-300 border-amber-300 hover:bg-amber-100'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${hasUpvoted ? 'fill-current text-white' : 'text-[#B45309]'}`} />
                        <span>{totalVotes}</span>
                        <span className="hidden sm:inline">Votes</span>
                      </button>
                    </div>

                    {/* Landmark Name & Local Inscription */}
                    <div>
                      <h3 className="text-lg font-extrabold text-[#111827] dark:text-white leading-tight">
                        {attraction.name}
                      </h3>
                      {attraction.localName && (
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-serif mt-0.5">
                          {attraction.localName}
                        </p>
                      )}
                    </div>

                    {/* Small Structured Brief */}
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                      {attraction.shortSummary}
                    </p>

                    {/* Historical Era & Status Pill */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700">
                        <History className="w-3.5 h-3.5 text-[#006D5B]" />
                        <span>{attraction.era} ({attraction.builtYear})</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 dark:bg-teal-950/40 text-[#006D5B] dark:text-teal-300 text-xs font-bold rounded-lg border border-teal-200 dark:border-teal-800">
                        <Landmark className="w-3.5 h-3.5" />
                        <span>{attraction.heritageStatus}</span>
                      </span>
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="pt-3 flex items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#006D5B]" />
                        <span className="truncate max-w-[140px]">{attraction.addressText.split(',')[0]}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Audio Guide Reader */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleNarration(attraction);
                          }}
                          title="Listen to audio brief"
                          className={`p-2 rounded-xl border transition-all min-h-[40px] min-w-[40px] flex items-center justify-center ${
                            isNarrating === attraction.id
                              ? 'bg-[#B45309] text-white border-amber-500'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:text-[#006D5B]'
                          }`}
                        >
                          {isNarrating === attraction.id ? (
                            <VolumeX className="w-4 h-4 animate-pulse" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>

                        {/* Itinerary Bookmark */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleItinerary(attraction.id);
                          }}
                          title={isSaved ? 'Remove from Itinerary' : 'Save to Itinerary'}
                          className={`p-2 rounded-xl border transition-all min-h-[40px] min-w-[40px] flex items-center justify-center ${
                            isSaved
                              ? 'bg-amber-500 text-white border-amber-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:text-amber-600'
                          }`}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Right Column: In-Depth Structured Brief & Community Wisdom (7 cols on Desktop) */}
        <div className="lg:col-span-7">
          {selectedAttraction ? (
            <div className="bg-white dark:bg-[#0A2540] rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 shadow-md p-6 sm:p-8 space-y-6 sticky top-24">
              {/* Header Showcase */}
              <div className="space-y-3 pb-5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#006D5B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs">
                      <Landmark className="w-4 h-4 text-amber-300" />
                      <span>{selectedAttraction.heritageStatus}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-950/60 text-[#B45309] dark:text-amber-300 text-xs font-bold rounded-xl border border-amber-300/40">
                      <History className="w-4 h-4" />
                      <span>{selectedAttraction.builtYear}</span>
                    </span>
                  </div>

                  {/* Upvote & Recommendation Status */}
                  <button
                    id={`spotlight-upvote-${selectedAttraction.id}`}
                    type="button"
                    onClick={() => handleToggleUpvote(selectedAttraction)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer min-h-[48px] border-2 ${
                      userUpvotes[selectedAttraction.id]
                        ? 'bg-[#B45309] text-white border-[#B45309] shadow-md scale-102'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-[#B45309] dark:text-amber-300 border-amber-400 hover:bg-amber-100'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${userUpvotes[selectedAttraction.id] ? 'fill-current' : ''}`} />
                    <span>
                      {userUpvotes[selectedAttraction.id]
                        ? `Recommended by You (${getEffectiveUpvotes(selectedAttraction)} Votes)`
                        : `Upvote / Recommend (${getEffectiveUpvotes(selectedAttraction)} Votes)`}
                    </span>
                  </button>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
                    {selectedAttraction.name}
                  </h2>
                  {selectedAttraction.localName && (
                    <p className="text-base font-serif text-[#006D5B] dark:text-teal-300 font-semibold mt-1">
                      {selectedAttraction.localName}
                    </p>
                  )}
                </div>

                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {selectedAttraction.shortSummary}
                </p>
              </div>

              {/* Action Toolbar: Audio Guide, Visited & Directions */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleNarration(selectedAttraction)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[48px] ${
                      isNarrating === selectedAttraction.id
                        ? 'bg-[#B45309] text-white shadow-sm'
                        : 'bg-[#006D5B] hover:bg-[#005244] text-white shadow-xs'
                    }`}
                  >
                    {isNarrating === selectedAttraction.id ? (
                      <VolumeX className="w-4 h-4 animate-pulse text-amber-300" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-amber-300" />
                    )}
                    <span>
                      {isNarrating === selectedAttraction.id
                        ? 'Stop Audio Narration'
                        : 'Listen to Voice Brief'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleToggleVisited(selectedAttraction.id, selectedAttraction.name)
                    }
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer min-h-[48px] ${
                      checkedInAttractions.includes(selectedAttraction.id)
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:border-[#006D5B]'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        checkedInAttractions.includes(selectedAttraction.id)
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    />
                    <span>
                      {checkedInAttractions.includes(selectedAttraction.id)
                        ? 'Visited (+25 Karma)'
                        : 'Mark as Visited'}
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleItinerary(selectedAttraction.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer min-h-[48px] ${
                    savedItinerary.includes(selectedAttraction.id)
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:border-amber-500'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>
                    {savedItinerary.includes(selectedAttraction.id)
                      ? 'Saved in Itinerary'
                      : 'Add to Itinerary'}
                  </span>
                </button>
              </div>

              {/* Section 1: Historical Brief */}
              <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900/50 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-[#B45309] text-white">
                    <History className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-extrabold text-[#B45309] dark:text-amber-300 uppercase tracking-wider">
                    Historical Genesis & Background
                  </h4>
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {selectedAttraction.historicalBrief}
                </p>
              </div>

              {/* Section 2: General & Community Significance */}
              <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border-2 border-teal-200 dark:border-teal-900/50 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-[#006D5B] text-white">
                    <Info className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-extrabold text-[#006D5B] dark:text-teal-300 uppercase tracking-wider">
                    Community & Cultural Importance Today
                  </h4>
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {selectedAttraction.generalSignificance}
                </p>
              </div>

              {/* Section 3: Architectural Highlights */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#006D5B]" />
                  <span>Key Architectural & Design Features</span>
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {selectedAttraction.architecturalHighlights.map((hl, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#006D5B] text-white font-bold flex items-center justify-center shrink-0 text-xs">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cultural Lore & Legends */}
              {selectedAttraction.culturalLoreAndLegends && (
                <div className="p-5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border-2 border-purple-200 dark:border-purple-900/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-purple-700 text-white">
                      <Scroll className="w-4 h-4 text-amber-300" />
                    </div>
                    <h4 className="text-sm font-extrabold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                      Cultural Lore, Folk Legends & Proverbs
                    </h4>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {selectedAttraction.culturalLoreAndLegends}
                  </p>
                </div>
              )}

              {/* Masonry & Craft Details */}
              {selectedAttraction.masonryAndCraftDetails && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Structural Materials & Masonry Craft:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                    {selectedAttraction.masonryAndCraftDetails}
                  </p>
                </div>
              )}

              {/* Famous Historical Visitors */}
              {selectedAttraction.famousHistoricalVisitors && selectedAttraction.famousHistoricalVisitors.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-[#006D5B]" />
                    <span>Famous Historical Visitors & Chroniclers</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedAttraction.famousHistoricalVisitors.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-[#0A2540] dark:text-white">{v.name}</span>
                          <span className="text-[#B45309] font-bold text-[11px]">{v.era}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                          {v.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Practical Visiting Info Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="text-slate-600 dark:text-slate-400 block font-bold text-xs flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#006D5B]" />
                    Opening Schedule
                  </span>
                  <span className="font-extrabold text-sm text-[#111827] dark:text-white block">
                    {selectedAttraction.openingHours}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="text-slate-600 dark:text-slate-400 block font-bold text-xs flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#006D5B]" />
                    Entry / Ticket Info
                  </span>
                  <span className="font-extrabold text-sm text-[#111827] dark:text-white block">
                    {selectedAttraction.entryFee}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="text-slate-600 dark:text-slate-400 block font-bold text-xs flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#006D5B]" />
                    Recommended Timing
                  </span>
                  <span className="font-extrabold text-sm text-[#111827] dark:text-white block">
                    {selectedAttraction.bestTimeToVisit}
                  </span>
                </div>
              </div>

              {/* Location & Senior Accessibility */}
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#006D5B] text-white shrink-0">
                    <MapPin className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                      {selectedAttraction.addressText}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 font-semibold text-xs mt-0.5 block">
                      Senior Accessibility: {selectedAttraction.accessibilityScore}
                    </span>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedAttraction.coordinates.lat},${selectedAttraction.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#006D5B] text-white rounded-2xl font-bold shadow-xs hover:bg-[#005244] shrink-0 min-h-[50px] cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-amber-300" />
                  <span>Open Directions</span>
                </a>
              </div>

              {/* Resident Insider Tips */}
              {selectedAttraction.neighborTips && selectedAttraction.neighborTips.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#006D5B]" />
                    <span>Resident & Neighbor Guidance</span>
                  </h4>
                  <div className="space-y-2.5">
                    {selectedAttraction.neighborTips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-[#006D5B] dark:text-teal-300">
                            {tip.author} • <span className="text-slate-600 dark:text-slate-400 font-normal">{tip.role}</span>
                          </span>
                          <span className="text-slate-500 text-xs">{tip.date}</span>
                        </div>
                        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                          "{tip.tip}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Civic Historian Interactive Assistant */}
              <div className="pt-5 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#006D5B] text-white">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-[#111827] dark:text-white">
                      Ask the Cityscape Civic Historian
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Learn deeper historical facts and preservation lore regarding {selectedAttraction.name}.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="historian-input"
                    type="text"
                    placeholder={`e.g. What is the historical origin of ${selectedAttraction.name}?`}
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskHistorian()}
                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 focus:border-[#0A2540] dark:focus:border-teal-400 rounded-2xl outline-none text-sm font-semibold text-slate-900 dark:text-white min-h-[52px]"
                  />
                  <button
                    id="historian-send-btn"
                    type="button"
                    onClick={handleAskHistorian}
                    disabled={isAiLoading || !aiQuestion.trim()}
                    className="px-6 py-3 bg-[#006D5B] hover:bg-[#005244] text-white font-bold rounded-2xl shadow-xs cursor-pointer disabled:opacity-50 text-sm min-h-[52px] flex items-center justify-center gap-2 shrink-0"
                  >
                    {isAiLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    ) : (
                      <Send className="w-4 h-4 text-amber-300" />
                    )}
                    <span>Ask Historian</span>
                  </button>
                </div>

                {/* AI Response Display */}
                <AnimatePresence>
                  {aiAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="p-5 rounded-2xl bg-teal-50/90 dark:bg-teal-950/50 border-2 border-teal-300 dark:border-teal-800 text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-medium space-y-2"
                    >
                      <div className="flex items-center gap-2 text-xs font-extrabold text-[#006D5B] dark:text-teal-300 uppercase tracking-wider">
                        <Scroll className="w-4 h-4" />
                        <span>Historian's Response:</span>
                      </div>
                      <p>{aiAnswer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-[#0A2540] rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 space-y-3">
              <Landmark className="w-12 h-12 mx-auto text-[#006D5B]" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Select a Tourist Destination to View Its Heritage Brief
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore historical briefs, architectural highlights, and neighbor recommendations curated for {cityData.cityName}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
