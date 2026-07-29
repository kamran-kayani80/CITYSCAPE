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
      <div className="w-full bg-[#1b1938] text-white py-1.5 px-3 sm:px-6 border-b border-indigo-900/60 flex items-center justify-between text-xs flex-wrap gap-2 z-40 sticky top-0 shadow-md">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded-md bg-yellow-400 text-slate-950 font-black text-[10px] tracking-wider uppercase">
            WCAG AAA
          </span>
          <span className="font-bold text-[11px] hidden sm:inline text-indigo-200">
            Senior & Universal Accessibility Bar
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] flex-wrap">
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
            className={`px-2.5 py-1 rounded-lg font-extrabold flex items-center space-x-1.5 transition-all cursor-pointer min-h-[36px] ${
              highContrast
                ? 'bg-yellow-400 text-slate-950 ring-2 ring-yellow-300 font-black'
                : 'bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 border border-indigo-700/60'
            }`}
            title="Toggle High-Contrast Visual Mode for Low Vision"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{highContrast ? 'High Contrast ON' : 'High Contrast'}</span>
          </button>

          {/* Font Scaling Buttons */}
          <div className="flex items-center bg-indigo-950/80 p-0.5 rounded-lg border border-indigo-800/80">
            <span className="px-1.5 text-indigo-300 font-bold text-[10px] hidden md:inline">
              <Type className="w-3 h-3 inline mr-0.5" /> Text:
            </span>
            {([100, 125, 150] as FontScale[]).map((scale) => (
              <button
                key={scale}
                onClick={() => {
                  setFontScale(scale);
                  speakText(`Font size set to ${scale} percent.`);
                }}
                className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold transition-all min-h-[32px] cursor-pointer ${
                  fontScale === scale
                    ? 'bg-indigo-500 text-white shadow-xs font-black'
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-900'
                }`}
              >
                {scale}%
              </button>
            ))}
          </div>

          {/* Voice Guidance Read Aloud Toggle */}
          <button
            onClick={handleReadScreenAloud}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 transition-all cursor-pointer min-h-[36px] ${
              speechEnabled
                ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 font-black animate-pulse'
                : 'bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 border border-indigo-700/60'
            }`}
            title="Toggle Voice Guidance Read Aloud"
          >
            {speechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{speechEnabled ? 'Voice ON' : 'Voice Assist'}</span>
          </button>

          {/* Senior Guide Modal Trigger */}
          <button
            onClick={() => setIsOpenGuide(true)}
            className="px-2 py-1 bg-indigo-800/60 hover:bg-indigo-700 text-indigo-200 rounded-lg font-bold flex items-center space-x-1 transition-all min-h-[36px] cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-yellow-300" />
            <span className="hidden md:inline">Senior Guide</span>
          </button>
        </div>
      </div>

      {/* Senior Citizen & Accessibility Quick Guide Modal */}
      {isOpenGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-indigo-500 shadow-2xl space-y-4 animate-settled-in">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-yellow-400 text-slate-950 rounded-xl font-black">
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
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl border border-indigo-200 dark:border-indigo-800">
                <p className="font-extrabold text-indigo-900 dark:text-indigo-200">
                  📍 Step 1: Guided 3-Step Reporting
                </p>
                <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">
                  Tap "Report Issue", pick a category icon (Potholes, Lights, Trash), verify your address, and submit.
                </p>
              </div>

              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl border border-indigo-200 dark:border-indigo-800">
                <p className="font-extrabold text-indigo-900 dark:text-indigo-200">
                  🎤 Step 2: Voice Dictation Hands-Free
                </p>
                <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">
                  Don't want to type? Tap the big Microphone button in the report form and simply speak what you see!
                </p>
              </div>

              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl border border-indigo-200 dark:border-indigo-800">
                <p className="font-extrabold text-indigo-900 dark:text-indigo-200">
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
              className="w-full py-3 bg-indigo-600 text-white font-extrabold rounded-2xl text-center cursor-pointer min-h-[48px] hover:bg-indigo-700 transition-all"
            >
              Got It, Let's Get Started!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
