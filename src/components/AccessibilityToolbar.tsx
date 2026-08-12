import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye,
  Type,
  HelpCircle,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
  Megaphone,
  ChevronRight,
  Volume2,
  VolumeX,
  X,
  Accessibility,
} from 'lucide-react';
import { useAccessibility, FontScale } from '../context/AccessibilityContext';

const DEFAULT_BULLETINS = [
  '🚧 Rawalpindi Public Works: Main Arterial Resurfacing & Pipe Laying Active.',
  '🌳 Ward 2 Community Park cleanup & greening drive scheduled this Saturday.',
  '⚡ Streetlight solar LED maintenance completed across primary avenues.',
  '📢 City Council Civic Infrastructure Town Hall scheduled for Thursday.',
  '💧 Water & Sanitation Agency (WASA) pressure balance & filtration advisory active.',
];

export const AccessibilityToolbar: React.FC = () => {
  const {
    highContrast,
    setHighContrast,
    fontScale,
    setFontScale,
    speechEnabled,
    setSpeechEnabled,
    speakText,
    stopSpeech,
  } = useAccessibility();

  const [isOpenGuide, setIsOpenGuide] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAaaMenuOpen, setIsAaaMenuOpen] = useState(false);
  const [bulletins, setBulletins] = useState<string[]>(DEFAULT_BULLETINS);
  const [bulletinIndex, setBulletinIndex] = useState(0);
  const [isTapePlaying, setIsTapePlaying] = useState(true);
  const [currentCity, setCurrentCity] = useState<string>('Rawalpindi');
  const [isRefreshingNews, setIsRefreshingNews] = useState(false);

  const aaaMenuRef = useRef<HTMLDivElement>(null);

  // Close Aaa menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aaaMenuRef.current && !aaaMenuRef.current.contains(event.target as Node)) {
        setIsAaaMenuOpen(false);
      }
    };
    if (isAaaMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAaaMenuOpen]);

  // Fetch live city bulletins from server
  const fetchLiveNews = async (city: string, force = false) => {
    setIsRefreshingNews(true);
    try {
      const res = await fetch(`/api/bulletins/live?city=${encodeURIComponent(city)}${force ? '&forceRefresh=true' : ''}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.bulletins) && data.bulletins.length > 0) {
          const headlines = data.bulletins.map((b: any) => `${b.title} — (${b.department || b.sourceName})`);
          setBulletins(headlines);
          if (data.cityName) setCurrentCity(data.cityName);
        }
      }
    } catch (e) {
      console.warn("Failed fetching ticker bulletins:", e);
    } finally {
      setIsRefreshingNews(false);
    }
  };

  useEffect(() => {
    const savedCity = localStorage.getItem('cityscape_user_city') || 'Rawalpindi';
    setCurrentCity(savedCity);
    fetchLiveNews(savedCity);

    // Listen for city changes from other components
    const handleCityChange = (e: CustomEvent) => {
      if (e.detail && e.detail.city) {
        setCurrentCity(e.detail.city);
        fetchLiveNews(e.detail.city);
      }
    };
    window.addEventListener('cityscape_city_changed' as any, handleCityChange);
    return () => {
      window.removeEventListener('cityscape_city_changed' as any, handleCityChange);
    };
  }, []);

  // Auto-collapse / slide up bar when scrolling down for maximum screen visibility, slide down when at top
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > 60 && window.scrollY > lastScrollY) {
        setIsCollapsed(true);
        setIsAaaMenuOpen(false);
      } else if (window.scrollY <= 20) {
        setIsCollapsed(false);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // News Bulletin Ticker Tape Rotation
  useEffect(() => {
    if (!isTapePlaying || bulletins.length === 0) return;

    const interval = setInterval(() => {
      setBulletinIndex((prev) => (prev + 1) % bulletins.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [isTapePlaying, bulletins]);

  const handleToggleVoice = () => {
    if (speechEnabled) {
      stopSpeech();
      setSpeechEnabled(false);
    } else {
      setSpeechEnabled(true);
      speakText(
        'Voice Guidance Active. Welcome to Cityscape.'
      );
    }
  };

  const handleSetScale = (scale: FontScale) => {
    setFontScale(scale);
    speakText(`Text size set to ${scale} percent.`);
  };

  return (
    <>
      {/* Top Fixed News Bulletin Tape & Compact Accessibility Bar */}
      <div className="relative z-40 w-full font-['Montserrat']">
        <motion.div
          initial={false}
          animate={{
            y: isCollapsed ? '-100%' : '0%',
            opacity: isCollapsed ? 0 : 1,
          }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#0A2540] text-white py-1.5 px-3 sm:px-6 border-b-2 border-[#006D5B] flex items-center justify-between gap-3 sticky top-0 shadow-md"
        >
          {/* Main Bulletin Area - Maximized Space */}
          <div className="flex items-center space-x-2 flex-1 min-w-0 py-0.5">
            <div className="flex items-center space-x-1.5 shrink-0 bg-[#006D5B] text-white px-2.5 py-1 rounded-md text-[10px] font-black border border-[#CCFF00]/40">
              <Megaphone className="w-3.5 h-3.5 text-[#CCFF00] animate-pulse" />
              <span className="hidden xs:inline uppercase tracking-wider text-[9px] text-[#CCFF00]">
                CITY BULLETIN
              </span>
            </div>

            {/* Play / Pause News Tape Control */}
            <button
              onClick={() => setIsTapePlaying(!isTapePlaying)}
              className="p-1.5 bg-[#07192c] hover:bg-[#006D5B] text-[#CCFF00] rounded-md transition-colors border border-[#006D5B] shrink-0 cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              title={isTapePlaying ? 'Pause News Bulletin Tape' : 'Play News Bulletin Tape'}
            >
              {isTapePlaying ? (
                <Pause className="w-3.5 h-3.5 text-[#CCFF00]" />
              ) : (
                <Play className="w-3.5 h-3.5 text-[#CCFF00] fill-current" />
              )}
            </button>

            {/* Refresh Button */}
            <button
              onClick={() => fetchLiveNews(currentCity, true)}
              disabled={isRefreshingNews}
              className="p-1.5 bg-[#07192c] hover:bg-[#006D5B] text-[#CCFF00] rounded-md transition-colors border border-[#006D5B] shrink-0 cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              title="Refresh City Infrastructure News via Gemini Grounded Search"
            >
              <Sparkles className={`w-3.5 h-3.5 text-[#CCFF00] ${isRefreshingNews ? 'animate-spin' : ''}`} />
            </button>

            {/* TV Channel Scrolling News Tape Content - Continuous Right-to-Left Scroll */}
            <div className="flex-1 overflow-hidden relative h-7 flex items-center text-xs text-slate-100 font-medium min-w-0 bg-[#07192c]/70 rounded-md border border-[#006D5B]/60 px-2">
              <div
                className="animate-ticker-scroll items-center gap-6 py-0.5"
                style={{
                  animationPlayState: isTapePlaying ? 'running' : 'paused',
                  animationDuration: `${Math.max(25, (bulletins.length || 1) * 12)}s`,
                }}
              >
                {[
                  ...(bulletins.length > 0 ? bulletins : ['Loading city infrastructure news...']),
                  ...(bulletins.length > 0 ? bulletins : ['Loading city infrastructure news...']),
                ].map((bulletinText, idx) => (
                  <div key={idx} className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-slate-100 shrink-0">
                    <span className="text-[#CCFF00] font-black text-[10px] uppercase font-mono bg-[#006D5B] px-1.5 py-0.5 rounded border border-[#CCFF00]/40 shrink-0">
                      📍 {currentCity}
                    </span>
                    <span className="whitespace-nowrap font-medium text-slate-100 tracking-wide">{bulletinText}</span>
                    <span className="text-[#CCFF00] font-black font-mono text-xs px-2 opacity-80">✦</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Bulletin Quick Skip */}
            <button
              onClick={() => setBulletinIndex((prev) => (prev + 1) % (bulletins.length || 1))}
              className="p-1.5 bg-[#07192c] hover:bg-[#006D5B] text-[#CCFF00] rounded-md transition-colors border border-[#006D5B]/60 shrink-0 cursor-pointer hidden sm:flex items-center justify-center"
              title="Next Bulletin"
            >
              <ChevronRight className="w-3.5 h-3.5 text-[#CCFF00]" />
            </button>
          </div>

          {/* Right: SINGLE "Aaa" Accessibility Icon Button */}
          <div className="relative shrink-0" ref={aaaMenuRef}>
            <button
              onClick={() => setIsAaaMenuOpen(!isAaaMenuOpen)}
              className={`px-2.5 py-1.5 rounded-lg font-black transition-all cursor-pointer min-h-[34px] flex items-center space-x-1.5 border shadow-sm ${
                isAaaMenuOpen || highContrast || fontScale !== 100 || speechEnabled
                  ? 'bg-[#CCFF00] text-[#0A2540] border-[#CCFF00] ring-2 ring-[#CCFF00]/40'
                  : 'bg-[#006D5B] hover:bg-[#005244] text-white border-[#006D5B]'
              }`}
              title="Accessibility & Display Settings (Aaa)"
            >
              <Accessibility className={`w-4 h-4 ${isAaaMenuOpen || highContrast || fontScale !== 100 || speechEnabled ? 'text-[#0A2540]' : 'text-[#CCFF00]'}`} />
              <span className="text-xs font-black tracking-tight font-mono">Aaa</span>
              {fontScale !== 100 && (
                <span className="text-[9px] px-1 bg-[#0A2540] text-[#CCFF00] rounded font-mono font-bold">
                  {fontScale}%
                </span>
              )}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isAaaMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Accessibility Dropdown Menu Popover */}
            <AnimatePresence>
              {isAaaMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#0A2540] text-white rounded-2xl p-4 shadow-2xl border-2 border-[#006D5B] z-50 space-y-3.5 font-['Montserrat']"
                >
                  <div className="flex items-center justify-between border-b border-[#006D5B]/60 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-[#CCFF00] text-[#0A2540] rounded-lg">
                        <Type className="w-4 h-4 font-black" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#CCFF00] uppercase tracking-wider">
                          Accessibility (Aaa)
                        </h4>
                        <p className="text-[10px] text-slate-300">
                          Senior & visual preferences
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsAaaMenuOpen(false)}
                      className="p-1 hover:bg-[#006D5B] text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 1. Font Scale Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-200 flex items-center justify-between">
                      <span>Text Zoom Level:</span>
                      <span className="font-mono text-[#CCFF00]">{fontScale}%</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {([100, 125, 150] as FontScale[]).map((scale) => (
                        <button
                          key={scale}
                          onClick={() => handleSetScale(scale)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                            fontScale === scale
                              ? 'bg-[#CCFF00] text-[#0A2540] border-[#CCFF00] shadow-sm'
                              : 'bg-[#07192c] hover:bg-[#006D5B] text-slate-200 border-[#006D5B]/60'
                          }`}
                        >
                          {scale}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. High Contrast Toggle */}
                  <div className="flex items-center justify-between p-2.5 bg-[#07192c] rounded-xl border border-[#006D5B]/60">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-[#CCFF00]" />
                      <span className="text-xs font-bold text-slate-100">High Contrast Mode</span>
                    </div>
                    <button
                      onClick={() => {
                        setHighContrast((prev) => !prev);
                        if (!highContrast) {
                          speakText('High contrast pitch-black mode enabled.');
                        } else {
                          speakText('Standard color mode restored.');
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold cursor-pointer transition-colors border ${
                        highContrast
                          ? 'bg-[#CCFF00] text-[#0A2540] border-[#CCFF00]'
                          : 'bg-[#006D5B] text-white border-[#006D5B]'
                      }`}
                    >
                      {highContrast ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* 3. Voice Guidance Read Aloud Toggle */}
                  <div className="flex items-center justify-between p-2.5 bg-[#07192c] rounded-xl border border-[#006D5B]/60">
                    <div className="flex items-center space-x-2">
                      {speechEnabled ? (
                        <Volume2 className="w-4 h-4 text-[#CCFF00] animate-pulse" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="text-xs font-bold text-slate-100">Voice Guidance</span>
                    </div>
                    <button
                      onClick={handleToggleVoice}
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold cursor-pointer transition-colors border ${
                        speechEnabled
                          ? 'bg-[#CCFF00] text-[#0A2540] border-[#CCFF00]'
                          : 'bg-[#006D5B] text-white border-[#006D5B]'
                      }`}
                    >
                      {speechEnabled ? 'ACTIVE' : 'OFF'}
                    </button>
                  </div>

                  {/* 4. Senior & Accessible Guide Trigger */}
                  <button
                    onClick={() => {
                      setIsAaaMenuOpen(false);
                      setIsOpenGuide(true);
                    }}
                    className="w-full py-2 px-3 bg-[#006D5B] hover:bg-[#00584a] text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer border border-[#CCFF00]/30 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-[#CCFF00]" />
                    <span>Senior Accessibility Guide</span>
                  </button>

                  {/* 5. Collapse / Minimize Toolbar */}
                  <button
                    onClick={() => {
                      setIsAaaMenuOpen(false);
                      setIsCollapsed(true);
                    }}
                    className="w-full py-1.5 px-2 bg-[#07192c] hover:bg-[#006D5B] text-slate-300 hover:text-white rounded-xl text-[11px] font-semibold flex items-center justify-center space-x-1.5 cursor-pointer border border-[#006D5B]/40 transition-colors"
                  >
                    <ChevronUp className="w-3.5 h-3.5 text-[#CCFF00]" />
                    <span>Minimize Top Bar</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Senior Citizen & Accessibility Quick Guide Modal */}
      {isOpenGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-[#008080] shadow-2xl space-y-4 animate-settled-in font-['Montserrat']">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-[#CCFF00] text-slate-950 rounded-xl font-black">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-black text-slate-900 dark:text-white">
                    Senior & Accessible Guide
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Designed for maximum clarity & ease of use
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpenGuide(false)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer min-h-[44px]"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <div className="p-3 bg-[#008080]/10 dark:bg-[#008080]/20 rounded-2xl border border-[#008080]/30">
                <p className="font-extrabold text-[#008080] dark:text-[#CCFF00]">
                  📍 Step 1: Guided 3-Step Reporting
                </p>
                <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">
                  Tap "Report Issue", pick a category icon (Potholes, Lights, Trash), verify your address, and submit.
                </p>
              </div>

              <div className="p-3 bg-[#008080]/10 dark:bg-[#008080]/20 rounded-2xl border border-[#008080]/30">
                <p className="font-extrabold text-[#008080] dark:text-[#CCFF00]">
                  🎤 Step 2: Voice Dictation Hands-Free
                </p>
                <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">
                  Don't want to type? Tap the big Microphone button in the report form and simply speak what you see!
                </p>
              </div>

              <div className="p-3 bg-[#008080]/10 dark:bg-[#008080]/20 rounded-2xl border border-[#008080]/30">
                <p className="font-extrabold text-[#008080] dark:text-[#CCFF00]">
                  🤝 Step 3: Report for a Neighbor
                </p>
                <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">
                  Are you helping a senior or family member? Turn on "Report for a Neighbor" to enter their contact details so municipal workers can follow up with them directly.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <p className="font-extrabold text-emerald-900 dark:text-emerald-200">
                  👀 Step 4: "I See This Too" One-Tap Upvoting
                </p>
                <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">
                  If an issue is already reported, tap "I See This Too" to boost its priority without filing duplicates.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpenGuide(false)}
              className="w-full py-3 bg-[#008080] text-white font-extrabold rounded-2xl text-center cursor-pointer min-h-[48px] hover:bg-[#006666] transition-all"
            >
              Got It, Let's Get Started!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
