import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeCustomizerConfig {
  // Brand Color Palette
  primaryColor: string; // Header, dominant branding, primary buttons (Civic Navy default #0A2540)
  secondaryColor: string; // Community badges, success states (#006D5B)
  accentColor: string; // Action Amber CTA (#B45309)
  canvasColor: string; // Neutral Canvas (#FAF6F0 / #F8FAFC)
  cardBgColor: string; // Card Background (#FFFFFF)
  textPrimaryColor: string; // Primary Body Text (#111827)
  textMutedColor: string; // Secondary Text (#475569)
  borderOutlineColor: string; // Outline Stroke (#CBD5E1 / #E3DDD3)

  // Typography & Text Containers
  fontFamily: 'atkinson' | 'inter' | 'system' | 'serif' | 'mono';
  headingScale: number; // 1.0 - 1.4 (scale multiplier)
  bodyScale: number; // 1.0 - 1.3
  lineHeight: 'normal' | 'relaxed' | 'loose';
  letterSpacing: 'tight' | 'normal' | 'wide';

  // Spacing & Layout Tokens (in px or rem multipliers)
  containerPaddingScale: 'compact' | 'standard' | 'spacious';
  baseSpacingUnit: number; // 2 to 8px base grid, default 4px
  containerMaxWidth: number; // in px (1024, 1280, 1440, 1600, default 1280)
  sectionGap: number; // in px (12 to 40, default 24)

  // Card & Container Geometry (Anti-Slop Golden Ratio tokens)
  cardBorderRadius: number; // in px (0 - 24, default 12)
  cardBorderWidth: number; // in px (1 - 4, default 1.5)
  cardShadowIntensity: 'none' | 'subtle' | 'medium' | 'elevated' | 'glass';

  // Asset Elements & Custom Branding
  siteTitle: string;
  siteTagline: string;
  badgeStyle: 'solid' | 'subtle' | 'outline' | 'pill';
  buttonStyle: 'rounded' | 'square' | 'pill' | 'tactile';
  buttonBorderRadius: number; // in px (0 - 24, default 12)
  showLiveLandmarkWatermark: boolean;
  enableHeaderStickyBlur: boolean;
  activePresetName?: string;
}

export const DEFAULT_THEME_CONFIG: ThemeCustomizerConfig = {
  primaryColor: '#0A2540',
  secondaryColor: '#006D5B',
  accentColor: '#B45309',
  canvasColor: '#FAF6F0',
  cardBgColor: '#FFFFFF',
  textPrimaryColor: '#111827',
  textMutedColor: '#475569',
  borderOutlineColor: '#CBD5E1',

  fontFamily: 'atkinson',
  headingScale: 1.0,
  bodyScale: 1.0,
  lineHeight: 'relaxed',
  letterSpacing: 'normal',

  containerPaddingScale: 'standard',
  baseSpacingUnit: 4,
  containerMaxWidth: 1280,
  sectionGap: 24,

  cardBorderRadius: 12,
  cardBorderWidth: 1.5,
  cardShadowIntensity: 'subtle',

  siteTitle: 'Cityscape',
  siteTagline: 'Bridging Citizens & Municipal Public Works',
  badgeStyle: 'solid',
  buttonStyle: 'tactile',
  buttonBorderRadius: 12,
  showLiveLandmarkWatermark: true,
  enableHeaderStickyBlur: true,
  activePresetName: 'Cityscape Classic (WCAG AAA)',
};

export const THEME_PRESETS: { name: string; description: string; config: Partial<ThemeCustomizerConfig> }[] = [
  {
    name: 'Cityscape Classic (WCAG AAA)',
    description: 'The official Atkinson Hyperlegible Civic Navy, Sage Teal, and Action Amber verified palette.',
    config: {
      primaryColor: '#0A2540',
      secondaryColor: '#006D5B',
      accentColor: '#B45309',
      canvasColor: '#FAF6F0',
      cardBgColor: '#FFFFFF',
      textPrimaryColor: '#111827',
      textMutedColor: '#475569',
      borderOutlineColor: '#CBD5E1',
      fontFamily: 'atkinson',
      cardBorderRadius: 12,
      cardBorderWidth: 1.5,
      cardShadowIntensity: 'subtle',
      buttonStyle: 'tactile',
      buttonBorderRadius: 12,
    },
  },
  {
    name: 'Municipal Editorial (Linen & Espresso)',
    description: 'Warm, refined Nordic civic publication aesthetic with high text legibility and deep espresso contrasts.',
    config: {
      primaryColor: '#1F2937',
      secondaryColor: '#0F766E',
      accentColor: '#C2410C',
      canvasColor: '#F4EFE6',
      cardBgColor: '#FFFFFF',
      textPrimaryColor: '#1F2937',
      textMutedColor: '#4B5563',
      borderOutlineColor: '#D1C7B7',
      fontFamily: 'serif',
      cardBorderRadius: 8,
      cardBorderWidth: 1.5,
      cardShadowIntensity: 'subtle',
      buttonStyle: 'rounded',
      buttonBorderRadius: 8,
    },
  },
  {
    name: 'High-Visibility Senior Safety',
    description: 'Maximum contrast, larger typography, and ultra-defined structural borders for elderly community members.',
    config: {
      primaryColor: '#002B49',
      secondaryColor: '#00594C',
      accentColor: '#9A3412',
      canvasColor: '#FFFFFF',
      cardBgColor: '#F8FAFC',
      textPrimaryColor: '#000000',
      textMutedColor: '#1E293B',
      borderOutlineColor: '#64748B',
      fontFamily: 'atkinson',
      headingScale: 1.15,
      bodyScale: 1.1,
      cardBorderRadius: 10,
      cardBorderWidth: 2.5,
      cardShadowIntensity: 'medium',
      buttonStyle: 'pill',
      buttonBorderRadius: 16,
    },
  },
  {
    name: 'Metropolitan Modern Slate',
    description: 'Crisp, contemporary tech-forward municipal design with clean indigo accents and modern sans geometry.',
    config: {
      primaryColor: '#0F172A',
      secondaryColor: '#2563EB',
      accentColor: '#D97706',
      canvasColor: '#F1F5F9',
      cardBgColor: '#FFFFFF',
      textPrimaryColor: '#0F172A',
      textMutedColor: '#64748B',
      borderOutlineColor: '#CBD5E1',
      fontFamily: 'inter',
      cardBorderRadius: 14,
      cardBorderWidth: 1.5,
      cardShadowIntensity: 'elevated',
      buttonStyle: 'tactile',
      buttonBorderRadius: 14,
    },
  },
];

interface ThemeCustomizerContextType {
  config: ThemeCustomizerConfig;
  updateConfig: (partial: Partial<ThemeCustomizerConfig>) => void;
  applyPreset: (presetName: string) => void;
  resetToDefault: () => void;
  generateCustomCssString: () => string;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;
}

const ThemeCustomizerContext = createContext<ThemeCustomizerContextType | undefined>(undefined);

export const ThemeCustomizerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ThemeCustomizerConfig>(() => {
    try {
      const saved = localStorage.getItem('cityscape_admin_theme_customizer');
      if (saved) {
        return { ...DEFAULT_THEME_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse saved theme customizer config', e);
    }
    return DEFAULT_THEME_CONFIG;
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);

  // Apply dynamic CSS Variables to Document Root (Live WordPress-style Customizer)
  useEffect(() => {
    const root = document.documentElement;

    // Color tokens
    root.style.setProperty('--cityscape-navy', config.primaryColor);
    root.style.setProperty('--ui-primary', config.primaryColor);
    root.style.setProperty('--cityscape-teal', config.secondaryColor);
    root.style.setProperty('--ui-primary-hover', config.secondaryColor);
    root.style.setProperty('--cityscape-amber', config.accentColor);
    root.style.setProperty('--cityscape-canvas', config.canvasColor);
    root.style.setProperty('--cityscape-card', config.cardBgColor);
    root.style.setProperty('--cityscape-text', config.textPrimaryColor);
    root.style.setProperty('--cityscape-text-muted', config.textMutedColor);
    root.style.setProperty('--cityscape-border', config.borderOutlineColor);

    // Card & geometry tokens
    root.style.setProperty('--cityscape-card-radius', `${config.cardBorderRadius}px`);
    root.style.setProperty('--cityscape-card-border-width', `${config.cardBorderWidth}px`);
    root.style.setProperty('--cityscape-btn-radius', `${config.buttonBorderRadius}px`);

    // Spacing and container layout tokens
    root.style.setProperty('--cityscape-spacing-base', `${config.baseSpacingUnit}px`);
    root.style.setProperty('--cityscape-container-max-w', `${config.containerMaxWidth}px`);
    root.style.setProperty('--cityscape-section-gap', `${config.sectionGap}px`);
    const containerPad = config.containerPaddingScale === 'compact' ? '12px' : config.containerPaddingScale === 'spacious' ? '32px' : '20px';
    root.style.setProperty('--cityscape-container-padding', containerPad);

    // Dynamic style tag injection for global card override classes
    let dynamicStyleEl = document.getElementById('cityscape-customizer-live-styles');
    if (!dynamicStyleEl) {
      dynamicStyleEl = document.createElement('style');
      dynamicStyleEl.id = 'cityscape-customizer-live-styles';
      document.head.appendChild(dynamicStyleEl);
    }

    const shadowCss =
      config.cardShadowIntensity === 'none'
        ? 'box-shadow: none !important;'
        : config.cardShadowIntensity === 'subtle'
        ? 'box-shadow: 0 4px 12px rgba(10, 37, 64, 0.06) !important;'
        : config.cardShadowIntensity === 'medium'
        ? 'box-shadow: 0 6px 18px rgba(10, 37, 64, 0.12) !important;'
        : config.cardShadowIntensity === 'elevated'
        ? 'box-shadow: 0 12px 30px rgba(10, 37, 64, 0.16) !important;'
        : 'box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15) !important; backdrop-filter: blur(8px);';

    const fontCss =
      config.fontFamily === 'atkinson'
        ? `'Atkinson Hyperlegible', sans-serif`
        : config.fontFamily === 'inter'
        ? `'Inter', sans-serif`
        : config.fontFamily === 'serif'
        ? `Georgia, 'Times New Roman', serif`
        : config.fontFamily === 'mono'
        ? `'JetBrains Mono', monospace`
        : `system-ui, -apple-system, sans-serif`;

    dynamicStyleEl.innerHTML = `
      :root {
        --font-sans: ${fontCss} !important;
        --font-body: ${fontCss} !important;
      }
      .clay-card-lvl1, .clay-card-lvl2, .clay-card-lvl3, article, .ui-kit-card {
        border-radius: ${config.cardBorderRadius}px !important;
        border-width: ${config.cardBorderWidth}px !important;
        border-color: ${config.borderOutlineColor} !important;
        ${shadowCss}
      }
      button, .btn-tactile, .ui-kit-btn-primary {
        border-radius: ${config.buttonBorderRadius}px !important;
      }
      body {
        background-color: ${config.canvasColor} !important;
      }
    `;

    // Persist to local storage
    try {
      localStorage.setItem('cityscape_admin_theme_customizer', JSON.stringify(config));
    } catch (e) {
      console.warn('Could not save theme config', e);
    }
  }, [config]);

  const updateConfig = (partial: Partial<ThemeCustomizerConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const applyPreset = (presetName: string) => {
    const found = THEME_PRESETS.find((p) => p.name === presetName);
    if (found) {
      setConfig((prev) => ({
        ...prev,
        ...found.config,
        activePresetName: presetName,
      }));
    }
  };

  const resetToDefault = () => {
    setConfig(DEFAULT_THEME_CONFIG);
  };

  const generateCustomCssString = (): string => {
    return `/* ==========================================================================
   CITYSCAPE ADMIN CUSTOM THEME STYLESHEET (WordPress & Asset Control Panel)
   Generated for: ${config.siteTitle} (${new Date().toLocaleDateString()})
   ========================================================================== */
:root {
  --cityscape-navy: ${config.primaryColor};
  --cityscape-teal: ${config.secondaryColor};
  --cityscape-amber: ${config.accentColor};
  --cityscape-canvas: ${config.canvasColor};
  --cityscape-card: ${config.cardBgColor};
  --cityscape-text: ${config.textPrimaryColor};
  --cityscape-text-muted: ${config.textMutedColor};
  --cityscape-border: ${config.borderOutlineColor};
  --cityscape-card-radius: ${config.cardBorderRadius}px;
  --cityscape-card-border-width: ${config.cardBorderWidth}px;
  --cityscape-btn-radius: ${config.buttonBorderRadius}px;
}

/* Base Card & Container Elements */
.clay-card-lvl1, .clay-card-lvl2, .clay-card-lvl3, article, .ui-kit-card {
  border-radius: ${config.cardBorderRadius}px;
  border-width: ${config.cardBorderWidth}px;
  border-color: ${config.borderOutlineColor};
  background-color: ${config.cardBgColor};
  color: ${config.textPrimaryColor};
}

/* Interactive Buttons & Asset Elements */
button, .btn-tactile, .ui-kit-btn-primary {
  border-radius: ${config.buttonBorderRadius}px;
}

body {
  background-color: ${config.canvasColor};
  color: ${config.textPrimaryColor};
}`;
  };

  return (
    <ThemeCustomizerContext.Provider
      value={{
        config,
        updateConfig,
        applyPreset,
        resetToDefault,
        generateCustomCssString,
        isCustomizerOpen,
        setIsCustomizerOpen,
      }}
    >
      {children}
    </ThemeCustomizerContext.Provider>
  );
};

export const useThemeCustomizer = () => {
  const ctx = useContext(ThemeCustomizerContext);
  if (!ctx) {
    throw new Error('useThemeCustomizer must be used within ThemeCustomizerProvider');
  }
  return ctx;
};
