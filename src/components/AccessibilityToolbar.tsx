import React, { useState } from 'react';
import { Eye, Type, Volume2, VolumeX, HelpCircle, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { useAccessibility, FontScale } from '../context/AccessibilityContext';

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

  return (
    <>
      {/* Top Fixed Accessibility & Senior Citizen Quick Bar */}
      <div className="w-full bg-[#0A2540] text-white py-2 px-3 sm:px-6 border-b-2 border-[#006D5B] flex items-center justify-between text-xs flex-wrap gap-2 z-40 sticky top-0 shadow-md font-['Montserrat']">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-md bg-[#CCFF00] text-[#0A2540] font-black text-[10px] tracking-wider uppercase">
            WCAG AAA
          </span>
          <span className="font-extrabold text-xs hidden sm:inline text-slate-100">
            Senior & Universal Accessibility Bar
          </span>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-3 text-[10px] sm:text-[11px] flex-nowrap overflow-x-auto no-scrollbar shrink-0 max-w-full py-0.5">
          {/* High Contrast AAA Toggle */}
          <button
            onClick={() => {
              setHighContrast((prev) => !prev);
              if (!highContrast) {
                speakText('High contrast pitch-black mode enabled.');
              } else {
                speakText('Standard color mode restored.');
              }
            }}
            className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl font-black flex items-center space-x-1 sm:space-x-1.5 transition-all cursor-pointer min-h-[32px] sm:min-h-[40px] text-[10px] sm:text-[11px] border-2 shrink-0 ${
              highContrast
                ? 'bg-[#CCFF00] text-[#0A2540] border-[#CCFF00] font-black shadow-md'
                : 'bg-[#006D5B] hover:bg-[#004d40] text-white border-[#006D5B]'
            }`}
            title="Toggle High-Contrast Visual Mode for Low Vision"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#CCFF00]" />
            <span className="hidden sm:inline">{highContrast ? 'High Contrast ON' : 'High Contrast'}</span>
            <span className="sm:hidden">Contrast</span>
          </button>

          {/* Font Scaling Buttons */}
          <div className="flex items-center bg-[#07192c] p-0.5 sm:p-1 rounded-lg sm:rounded-xl border-2 border-[#006D5B] shrink-0">
            <span className="px-1.5 text-slate-100 font-extrabold text-[10px] sm:text-[11px] hidden md:inline">
              <Type className="w-3.5 h-3.5 inline mr-0.5 text-[#CCFF00]" /> Text:
            </span>
            {([100, 125, 150] as FontScale[]).map((scale) => (
              <button
                key={scale}
                onClick={() => {
                  setFontScale(scale);
                  speakText(`Font size set to ${scale} percent.`);
                }}
                className={`px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-black transition-all min-h-[28px] sm:min-h-[36px] cursor-pointer ${
                  fontScale === scale
                    ? 'bg-[#006D5B] text-white shadow-xs font-black border border-[#CCFF00]/40'
                    : 'text-slate-200 hover:text-white hover:bg-[#006D5B]/50'
                }`}
              >
                {scale}%
              </button>
            ))}
          </div>

          {/* Voice Guidance Read Aloud Toggle */}
          <button
            onClick={handleReadScreenAloud}
            className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl font-black flex items-center space-x-1 transition-all cursor-pointer min-h-[32px] sm:min-h-[40px] text-[10px] sm:text-[11px] border-2 shrink-0 ${
              speechEnabled
                ? 'bg-emerald-600 text-white border-emerald-400 font-black animate-pulse'
                : 'bg-[#006D5B] hover:bg-[#004d40] text-white border-[#006D5B]'
            }`}
            title="Toggle Voice Guidance Read Aloud"
          >
            {speechEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#CCFF00]" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#CCFF00]" />}
            <span className="hidden sm:inline">{speechEnabled ? 'Voice ON' : 'Voice Assist'}</span>
            <span className="sm:hidden">Voice</span>
          </button>

          {/* Senior Guide Modal Trigger */}
          <button
            onClick={() => setIsOpenGuide(true)}
            className="px-2 py-1 sm:px-2.5 sm:py-1.5 bg-[#006D5B] hover:bg-[#004d40] text-white rounded-lg sm:rounded-xl font-black flex items-center space-x-1 transition-all min-h-[32px] sm:min-h-[40px] text-[10px] sm:text-[11px] cursor-pointer border-2 border-[#006D5B] shrink-0"
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#CCFF00]" />
            <span className="hidden md:inline">Senior Guide</span>
            <span className="md:hidden">Guide</span>
          </button>
        </div>
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
