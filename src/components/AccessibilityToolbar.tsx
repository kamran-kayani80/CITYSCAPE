import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye,
  Type,
  HelpCircle,
  Sparkles,
  ChevronUp,
  Play,
  Pause,
  Megaphone,
  ChevronRight,
} from 'lucide-react';
import { useAccessibility, FontScale } from '../context/AccessibilityContext';

const MUNICIPAL_BULLETINS = [
  '🚧 Public Works crew repair active on 4th Street for water pipe main.',
  '🌳 Ward 2 Community Park cleanup & greening drive this Saturday at 9 AM.',
  '⚡ Streetlight maintenance completed across Elm Street & 8th Avenue.',
  '📢 Town Hall Civic Forum on Neighborhood Improvement scheduled for Thursday at 6 PM.',
  '💧 Seasonal municipal water conservation advisory active across all wards.',
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
  const [bulletinIndex, setBulletinIndex] = useState(0);
  const [isTapePlaying, setIsTapePlaying] = useState(true);

  // Auto-collapse / slide up bar when scrolling down for maximum screen visibility, slide down when at top
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > 60 && window.scrollY > lastScrollY) {
        setIsCollapsed(true);
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
    if (!isTapePlaying) return;

    const interval = setInterval(() => {
      setBulletinIndex((prev) => (prev + 1) % MUNICIPAL_BULLETINS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isTapePlaying]);

  const handleReadScreenAloud = () => {
    if (speechEnabled) {
      stopSpeech();
      setSpeechEnabled(false);
    } else {
      setSpeechEnabled(true);
      speakText(
        'CITYSCAPE Accessibility Voice Guidance Active. Welcome to Cityscape. You can report potholes, streetlights, sanitation, and hazards in 3 easy steps or report on behalf of a senior neighbor.'
      );
    }
  };

  const handleCycleFontScale = () => {
    const scales: FontScale[] = [100, 125, 150];
    const nextIndex = (scales.indexOf(fontScale) + 1) % scales.length;
    const nextScale = scales[nextIndex];
    setFontScale(nextScale);
    speakText(`Text size changed to ${nextScale} percent.`);
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
          {/* Left: News Bulletin Marquee Ticker Tape with Play/Pause */}
          <div className="flex items-center space-x-2 flex-1 min-w-0 overflow-hidden py-0.5">
            <div className="flex items-center space-x-1.5 shrink-0 bg-[#006D5B] text-white px-2 py-1 rounded-md text-[10px] font-black border border-[#CCFF00]/40">
              <Megaphone className="w-3.5 h-3.5 text-[#CCFF00] animate-pulse" />
              <span className="hidden sm:inline uppercase tracking-wider text-[9px] text-[#CCFF00]">
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

            {/* Scrolling / Animated News Tape Content */}
            <div className="flex-1 overflow-hidden relative h-6 flex items-center text-xs text-slate-100 font-medium">
              <AnimatePresence mode="wait">
                <motion.div
                  key={bulletinIndex}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -16, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="whitespace-nowrap truncate text-[11px] sm:text-xs font-semibold text-slate-100 flex items-center gap-1"
                >
                  <span className="text-[#CCFF00] font-black text-[10px] uppercase font-mono">
                    [{bulletinIndex + 1}/{MUNICIPAL_BULLETINS.length}]
                  </span>
                  <span className="truncate">{MUNICIPAL_BULLETINS[bulletinIndex]}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Bulletin Quick Skip */}
            <button
              onClick={() => setBulletinIndex((prev) => (prev + 1) % MUNICIPAL_BULLETINS.length)}
              className="p-1 text-slate-300 hover:text-white shrink-0 cursor-pointer hidden md:block"
              title="Next Bulletin"
            >
              <ChevronRight className="w-4 h-4 text-[#CCFF00]" />
            </button>
          </div>

          {/* Right: Small Icon Accessibility Functions Bar */}
          <div className="flex items-center space-x-1 shrink-0">
            {/* WCAG AAA Badge */}
            <span className="hidden xl:inline-block px-2 py-0.5 rounded bg-[#CCFF00] text-[#0A2540] font-black text-[9px] tracking-wider uppercase mr-1">
              AAA
            </span>

            {/* High Contrast Icon Button */}
            <button
              onClick={() => {
                setHighContrast((prev) => !prev);
                if (!highContrast) {
                  speakText('High contrast pitch-black mode enabled.');
                } else {
                  speakText('Standard color mode restored.');
                }
              }}
              className={`p-1.5 sm:p-2 rounded-lg font-black transition-all cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center border ${
                highContrast
                  ? 'bg-[#CCFF00] text-[#0A2540] border-[#CCFF00] shadow-md'
                  : 'bg-[#006D5B] hover:bg-[#004d40] text-white border-[#006D5B]'
              }`}
              title={highContrast ? 'High Contrast Mode ON (Tap to toggle)' : 'Enable High-Contrast Mode'}
            >
              <Eye className="w-4 h-4 text-[#CCFF00]" />
            </button>

            {/* Font Scale Cycle Icon Button */}
            <button
              onClick={handleCycleFontScale}
              className="p-1.5 sm:p-2 bg-[#07192c] hover:bg-[#006D5B] text-white rounded-lg font-black border border-[#006D5B] transition-all cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center space-x-0.5"
              title={`Text Scale: ${fontScale}% (Tap to cycle)`}
            >
              <Type className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span className="text-[9px] font-mono font-black text-[#CCFF00]">{fontScale}%</span>
            </button>

            {/* Senior Guide Modal Icon Button */}
            <button
              onClick={() => setIsOpenGuide(true)}
              className="p-1.5 sm:p-2 bg-[#006D5B] hover:bg-[#004d40] text-white rounded-lg font-black transition-all min-h-[34px] min-w-[34px] flex items-center justify-center cursor-pointer border border-[#006D5B]"
              title="Open Senior & Accessibility Help Guide"
            >
              <HelpCircle className="w-4 h-4 text-[#CCFF00]" />
            </button>

            {/* Slide Up / Collapse Bar Action Icon Button */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 bg-[#07192c] hover:bg-[#006D5B] text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer border border-[#006D5B]/50 shrink-0 min-h-[34px] min-w-[34px] flex items-center justify-center"
              title="Slide up bar for full screen view"
            >
              <ChevronUp className="w-4 h-4 text-[#CCFF00]" />
            </button>
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
