import React, { createContext, useContext, useState, useEffect } from 'react';

export type FontScale = 100 | 125 | 150;

interface AccessibilityContextType {
  highContrast: boolean;
  setHighContrast: (val: boolean | ((prev: boolean) => boolean)) => void;
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
  speechEnabled: boolean;
  setSpeechEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
  speakText: (text: string) => void;
  stopSpeech: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('cityscape_high_contrast') === 'true';
  });

  const [fontScale, setFontScale] = useState<FontScale>(() => {
    const saved = localStorage.getItem('cityscape_font_scale');
    return saved ? (parseInt(saved, 10) as FontScale) : 100;
  });

  const [speechEnabled, setSpeechEnabled] = useState<boolean>(() => {
    return localStorage.getItem('cityscape_speech_enabled') === 'true';
  });

  // Apply high contrast CSS class to html document
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('wcag-high-contrast');
      localStorage.setItem('cityscape_high_contrast', 'true');
    } else {
      document.documentElement.classList.remove('wcag-high-contrast');
      localStorage.setItem('cityscape_high_contrast', 'false');
    }
  }, [highContrast]);

  // Apply font scale CSS root style
  useEffect(() => {
    document.documentElement.style.fontSize = `${(fontScale / 100) * 16}px`;
    localStorage.setItem('cityscape_font_scale', fontScale.toString());
  }, [fontScale]);

  useEffect(() => {
    localStorage.setItem('cityscape_speech_enabled', speechEnabled.toString());
  }, [speechEnabled]);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // cancel previous
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clear accessibility comprehension
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        setHighContrast,
        fontScale,
        setFontScale,
        speechEnabled,
        setSpeechEnabled,
        speakText,
        stopSpeech,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
