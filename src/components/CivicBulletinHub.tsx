import React, { useState, useEffect } from 'react';
import {
  Bell,
  Megaphone,
  AlertTriangle,
  Info,
  Search,
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
  Building2,
  Award,
  Layers,
  Radio,
  Zap,
  Check,
  ShieldAlert,
  Wrench,
  Droplets,
  Bus,
  Siren,
  Landmark,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { ShareModal } from './ShareModal';
import { getShareableUrl, ShareDataPayload } from '../lib/shareUtils';
import { LiveBulletin, CurrencyGrade, MunicipalDepartmentCode } from '../types';
import { MUNICIPAL_DEPARTMENTS } from '../data/departmentConfig';

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
  const [currencyGradeFilter, setCurrencyGradeFilter] = useState<string>('ALL');

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
      const res = await fetch(
        `/api/bulletins/live?city=${encodeURIComponent(cityToFetch)}${
          forceRefresh ? '&forceRefresh=true' : ''
        }`
      );
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.bulletins)) {
          setLiveBulletins(data.bulletins);
          setRefreshedAt(data.refreshedAt || new Date().toISOString());
          setNextRefreshAt(
            data.nextRefreshAt || new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
          );
          setFromCache(!!data.fromCache);

          localStorage.setItem('cityscape_user_city', cityToFetch);
          window.dispatchEvent(
            new CustomEvent('cityscape_city_changed', { detail: { city: cityToFetch } })
          );
        }
      }
    } catch (err) {
      console.error('[Bulletin Hub] Error fetching live bulletins:', err);
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

  const navigateToStaffPublisher = () => {
    window.dispatchEvent(
      new CustomEvent('cityscape:navigate-tab', {
        detail: { tab: 'municipal', subTab: 'deptnews' },
      })
    );
  };

  const filteredBulletins = liveBulletins.filter((item) => {
    if (selectedCategory !== 'ALL') {
      if (selectedCategory === 'STAFF_ONLY' && !item.isCustomStaffBulletin) return false;
      if (selectedCategory === 'BREAKING_ONLY' && item.currencyGrade !== 'BREAKING') return false;
      if (selectedCategory === 'ROADWORK' && item.category !== 'ROADWORK') return false;
      if (selectedCategory === 'UTILITY' && item.category !== 'UTILITY') return false;
      if (selectedCategory === 'TRAFFIC_TRANSIT' && item.category !== 'TRAFFIC_TRANSIT') return false;
      if (selectedCategory === 'EMERGENCY' && item.category !== 'EMERGENCY') return false;
      if (selectedCategory === 'PUBLIC_HEARING' && item.category !== 'PUBLIC_HEARING') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.sourceName.toLowerCase().includes(q) ||
        (item.wardZone && item.wardZone.toLowerCase().includes(q)) ||
        (item.authorOfficerName && item.authorOfficerName.toLowerCase().includes(q)) ||
        (item.officialGazetteNumber && item.officialGazetteNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getCurrencyGradeBadge = (grade?: CurrencyGrade) => {
    switch (grade) {
      case 'BREAKING':
        return (
          <span className="px-2.5 py-1 bg-rose-600 text-white rounded-md text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-xs animate-pulse">
            <Zap className="w-3.5 h-3.5" />
            ⚡ Breaking (&lt; 2h)
          </span>
        );
      case 'TODAY_DISPATCH':
        return (
          <span className="px-2.5 py-1 bg-amber-500 text-white rounded-md text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
            <Clock className="w-3.5 h-3.5" />
            🔴 Today's Dispatch
          </span>
        );
      case 'ACTIVE_24H':
        return (
          <span className="px-2.5 py-1 bg-[#006D5B] text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            🟡 Active 24H
          </span>
        );
      case 'SCHEDULED_CYCLE':
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-700 text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
            <Clock className="w-3.5 h-3.5" />
            🟢 3-Day Planned
          </span>
        );
    }
  };

  const getDeptEmblem = (deptCode?: MunicipalDepartmentCode, category?: string) => {
    if (deptCode === 'DPW' || category === 'ROADWORK') {
      return <Wrench className="w-5 h-5" />;
    }
    if (deptCode === 'WASA' || category === 'UTILITY') {
      return <Droplets className="w-5 h-5" />;
    }
    if (deptCode === 'TRANSIT' || category === 'TRAFFIC_TRANSIT') {
      return <Bus className="w-5 h-5" />;
    }
    if (deptCode === 'RESCUE' || category === 'EMERGENCY') {
      return <Siren className="w-5 h-5" />;
    }
    if (deptCode === 'COUNCIL' || category === 'PUBLIC_HEARING') {
      return <Landmark className="w-5 h-5" />;
    }
    return <Building2 className="w-5 h-5" />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 py-2 px-3 sm:px-6">
      {/* 
        ====================================================================
        CITYSCAPE BRAND GUIDE HEADER: CIVIC BULLETINS & NEIGHBORHOOD ADVISORIES
        WCAG AAA Compliant • Civic Navy (#0A2540) • Warm Sage Teal (#006D5B)
        ====================================================================
      */}
      <section className="bg-white dark:bg-[#0E2841] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-[#006D5B] text-white font-bold text-xs uppercase tracking-wider rounded-lg inline-flex items-center gap-1.5 shadow-xs">
                <Globe className="w-4 h-4 text-white" />
                Verified Municipal Bulletin
              </span>
              <span className="px-3 py-1.5 bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold text-xs rounded-lg border border-amber-500/30 inline-flex items-center gap-1.5 shadow-xs">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                ISO 37120 Currency Framework Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A2540] dark:text-white leading-tight tracking-tight">
              Community Bulletins & Public Notices — <span className="text-[#006D5B] underline decoration-[#B45309]">{cityName}</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-3xl font-medium leading-relaxed">
              Official public safety announcements, planned water & electrical service notices, roadworks, and council advisories verified with real-time freshness scoring for <strong className="text-[#0A2540] dark:text-white">{cityName}</strong> residents.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="p-4 sm:p-5 bg-[#F8FAFC] dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-center min-w-[140px] shadow-xs">
              <span className="block text-3xl sm:text-4xl font-black text-[#0A2540] dark:text-white">{liveBulletins.length}</span>
              <span className="text-xs font-bold text-[#006D5B] uppercase tracking-wider block mt-1">Live Notices</span>
            </div>

            {/* Direct Link to Municipal Staff Publisher */}
            <button
              onClick={navigateToStaffPublisher}
              type="button"
              className="p-4 bg-[#0A2540] hover:bg-[#081c30] text-white border-2 border-amber-500 rounded-xl text-left shadow-md flex flex-col justify-center transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-2 text-xs font-bold text-amber-400 uppercase tracking-wide">
                <span className="flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  Staff Broadcast Desk
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <span className="text-sm font-extrabold text-white mt-0.5">
                5 Depts Dispatch Portal
              </span>
              <span className="text-[11px] text-slate-300 font-medium">
                DPW, WASA, Transit, Rescue, Council
              </span>
            </button>
          </div>
        </div>

        {/* City Selector Buttons with WCAG AAA Contrast */}
        <div className="pt-4 border-t border-[#CBD5E1] dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5 text-sm">
              <MapPin className="w-4 h-4 text-[#006D5B]" />
              Select Municipal Ward / City:
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-wrap sm:flex-nowrap">
            {POPULAR_CITIES.map((c) => (
              <button
                key={c}
                onClick={() => handleCitySelect(c)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 border-1.5 min-h-[44px] flex items-center gap-1.5 ${
                  cityName.toLowerCase() === c.toLowerCase()
                    ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-sm font-extrabold'
                    : 'bg-white dark:bg-[#071B2F] hover:bg-slate-100 dark:hover:bg-slate-800 text-[#0A2540] dark:text-slate-200 border-[#CBD5E1] dark:border-slate-700'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
                <span>{c}</span>
              </button>
            ))}

            {/* Custom City Form */}
            <form onSubmit={handleCustomCitySubmit} className="flex items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder="Other City Name..."
                value={customCityInput}
                onChange={(e) => setCustomCityInput(e.target.value)}
                className="px-3.5 py-2 bg-white dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 text-[#0A2540] dark:text-white rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#0A2540] min-h-[44px] w-40 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#B45309] hover:bg-[#92400E] text-white font-bold rounded-xl text-xs sm:text-sm min-h-[44px] cursor-pointer shadow-xs border-1.5 border-[#B45309] inline-flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5 text-white" />
                <span>Load</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Synchronized Extraction Status & Action Amber Trigger */}
      <section className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 bg-white dark:bg-[#0E2841] shadow-xs">
        <div className="space-y-1 text-left">
          <div className="flex items-center space-x-2 flex-wrap gap-1">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#006D5B] animate-pulse" />
            <span className="text-xs sm:text-sm font-black uppercase text-[#0A2540] dark:text-white">
              Public Extraction & Currency Engine
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#006D5B]/10 text-[#006D5B] dark:text-teal-300 font-bold border border-[#006D5B]/20">
              {fromCache ? 'Real-Time Currency Stream' : 'Live Ground Sync'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <strong>Last Checked:</strong>{' '}
            {refreshedAt
              ? new Date(refreshedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
                ' (' +
                new Date(refreshedAt).toLocaleDateString() +
                ')'
              : 'Recently'}{' '}
            • <strong>Next Scheduled Check:</strong>{' '}
            {nextRefreshAt
              ? new Date(nextRefreshAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'In 12 Hours'}
          </p>
        </div>

        <button
          onClick={() => fetchCityBulletins(cityName, true)}
          disabled={isRefreshing}
          className="px-5 py-2.5 bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer min-h-[48px] flex items-center justify-center space-x-2 shrink-0 border-1.5 border-[#B45309] disabled:opacity-60"
        >
          <Sparkles className={`w-4 h-4 text-white ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Extracting Ground News...' : 'Refresh Bulletins Now'}</span>
        </button>
      </section>

      {/* Filter & Search Controls */}
      <section className="p-4 rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 bg-white dark:bg-[#0E2841] shadow-xs space-y-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${cityName} notices, gazette numbers, roadworks, or public works departments...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-[#0A2540] dark:text-white outline-none min-h-[44px] placeholder:text-slate-400 focus:border-[#0A2540]"
          />
        </div>

        {/* Currency & Department Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar flex-wrap gap-y-2">
          {[
            { id: 'ALL', label: 'All Bulletins' },
            { id: 'STAFF_ONLY', label: '🏛️ Staff Broadcasts' },
            { id: 'BREAKING_ONLY', label: '⚡ Breaking Alerts' },
            { id: 'ROADWORK', label: 'Roadworks (DPW)' },
            { id: 'UTILITY', label: 'Water & Utilities (WASA)' },
            { id: 'TRAFFIC_TRANSIT', label: 'Traffic & Transit' },
            { id: 'EMERGENCY', label: 'Rescue & Emergencies' },
            { id: 'PUBLIC_HEARING', label: 'Council & Town Halls' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl shrink-0 transition-all cursor-pointer min-h-[40px] border-1.5 flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-xs'
                  : 'bg-white dark:bg-[#071B2F] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-[#CBD5E1] dark:border-slate-700'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/*
        ====================================================================
        BULLETIN CARDS FEED (STRICT CITYSCAPE BRAND GUIDE TOKENS)
        Pure White Card, 1.5px Slate Border, 12px Radius, WCAG AAA Contrast
        ====================================================================
      */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white dark:bg-[#0E2841] text-[#0A2540] dark:text-white border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl p-12 text-center space-y-4 shadow-xs">
            <RefreshCw className="w-10 h-10 text-[#006D5B] animate-spin mx-auto" />
            <h3 className="text-xl font-bold">
              Extracting Community Bulletins for {cityName}...
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto font-medium">
              Checking public municipal announcements, water authority schedules, and traffic management updates with Currency Framework grading.
            </p>
          </div>
        ) : filteredBulletins.length === 0 ? (
          <div className="bg-white dark:bg-[#0E2841] text-[#0A2540] dark:text-white border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl p-12 text-center space-y-4 shadow-xs">
            <Megaphone className="w-12 h-12 text-[#006D5B] mx-auto" />
            <h3 className="text-xl font-bold">No Active Bulletins Found</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto font-medium">
              No matching advisories found for "{searchQuery}" in {cityName}. You can clear the search or tap "Refresh Bulletins Now" to poll live notices.
            </p>
          </div>
        ) : (
          filteredBulletins.map((item) => {
            const isCritical = item.priority === 'CRITICAL';
            const isUrgent = item.priority === 'URGENT';
            const isCustom = !!item.isCustomStaffBulletin;
            const deptConfig = item.departmentCode ? MUNICIPAL_DEPARTMENTS[item.departmentCode] : undefined;

            return (
              <article
                key={item.id}
                className={`bg-white dark:bg-[#0E2841] text-[#111827] dark:text-slate-100 rounded-xl p-6 sm:p-7 space-y-4 border-2 transition-all text-left ${
                  isCustom
                    ? 'border-amber-400 dark:border-amber-600 shadow-md ring-1 ring-amber-400/30'
                    : 'border-[#CBD5E1] dark:border-slate-700 shadow-xs hover:border-[#0A2540] dark:hover:border-slate-500'
                }`}
              >
                {/* Top Row: Department Emblem + Department Name + Currency Grade */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shrink-0 shadow-sm border ${
                        deptConfig
                          ? `${deptConfig.badgeBg} ${deptConfig.badgeText} ${deptConfig.borderColor}`
                          : isCritical
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-300'
                          : isUrgent
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300'
                          : 'bg-[#006D5B]/10 text-[#006D5B] dark:bg-teal-900/40 dark:text-teal-300 border-[#006D5B]/20'
                      }`}
                    >
                      {getDeptEmblem(item.departmentCode, item.category)}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <h4 className="text-base sm:text-lg font-black text-[#0A2540] dark:text-white truncate">
                          {item.department}
                        </h4>

                        {isCustom ? (
                          <span className="inline-flex items-center gap-1 text-xs font-black text-amber-950 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-md border border-amber-300 dark:border-amber-800">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                            [🏛️ OFFICIAL STAFF BROADCAST]
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#006D5B] bg-[#006D5B]/10 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified Gazette</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 flex-wrap gap-y-1">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-0.5 rounded-md font-bold text-[11px]">
                          {item.sourceName}
                        </span>
                        {item.wardZone && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
                            <span>{item.wardZone}</span>
                          </span>
                        )}
                        {item.officialGazetteNumber && (
                          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            {item.officialGazetteNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Currency Badge */}
                  <div className="flex items-center gap-2">
                    {getCurrencyGradeBadge(item.currencyGrade)}
                    <button
                      onClick={() =>
                        speakText(`${item.title}. Issued by ${item.department}. ${item.description}`)
                      }
                      className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0A2540] dark:text-slate-200 rounded-xl transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 border border-[#CBD5E1] dark:border-slate-700"
                      title="Read advisory aloud"
                      aria-label="Read advisory aloud"
                    >
                      <Volume2 className="w-5 h-5 text-[#006D5B]" />
                    </button>
                  </div>
                </div>

                {/* Priority Status Badge */}
                {(isCritical || isUrgent) && (
                  <div
                    className={`px-3 py-1.5 rounded-md text-xs font-black inline-flex items-center gap-1.5 uppercase tracking-wide ${
                      isCritical
                        ? 'bg-rose-700 text-white'
                        : 'bg-[#B45309] text-white'
                    }`}
                  >
                    {isCritical ? <AlertTriangle className="w-3.5 h-3.5 text-white" /> : <Bell className="w-3.5 h-3.5 text-white" />}
                    <span>{isCritical ? 'Critical Municipal Alert' : 'Urgent Community Advisory'}</span>
                  </div>
                )}

                {/* Bulletin Title */}
                <h3 className="text-lg sm:text-xl font-black text-[#0A2540] dark:text-white leading-snug tracking-tight">
                  {item.title}
                </h3>

                {/* Bulletin Description Content */}
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {item.description}
                </p>

                {/* Resident Action Advice (If Provided by Department) */}
                {item.actionAdvice && (
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border-1.5 border-amber-300 dark:border-amber-800/80 text-xs sm:text-sm text-amber-950 dark:text-amber-200 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-300 uppercase tracking-wide text-xs">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      Advice for Neighbors:
                    </span>
                    <p className="font-semibold leading-relaxed">
                      {item.actionAdvice}
                    </p>
                  </div>
                )}

                {/* Footer Bar: Verification Info, Currency Score & Sharing */}
                <div className="flex items-center justify-between text-xs pt-4 border-t border-[#CBD5E1] dark:border-slate-700 flex-wrap gap-3">
                  <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-semibold flex-wrap gap-y-1">
                    <ShieldCheck className="w-4 h-4 text-[#006D5B]" />
                    <span>{item.authorOfficerName || item.verifiedBy || 'City Public Information Officer'}</span>
                    {item.authorBadgeId && (
                      <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        Badge: {item.authorBadgeId}
                      </span>
                    )}
                    <span>•</span>
                    <span>{item.publishedAt}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                      [Currency Score: {item.currencyScore || 98}%]
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0A2540] dark:text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer min-h-[44px] flex items-center space-x-1.5 border border-[#CBD5E1] dark:border-slate-700"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#006D5B]" />
                        <span>View Gazette</span>
                      </a>
                    )}

                    <button
                      onClick={() => {
                        setShareData({
                          type: 'bulletin',
                          title: item.title,
                          text: `${item.department} Public Advisory: ${item.description}`,
                          url: getShareableUrl('bulletin', item.id),
                          idOrTag: item.id,
                          address: item.wardZone ? `Ward: ${item.wardZone}` : undefined,
                          category: item.department,
                        });
                        setIsShareModalOpen(true);
                      }}
                      className="px-4 py-2 bg-[#006D5B] hover:bg-[#005244] text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer min-h-[44px] flex items-center space-x-1.5 shadow-xs"
                    >
                      <Share2 className="w-3.5 h-3.5 text-white" />
                      <span>Share Notice</span>
                    </button>
                  </div>
                </div>
              </article>
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
