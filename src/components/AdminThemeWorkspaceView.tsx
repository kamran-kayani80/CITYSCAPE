import React, { useState } from 'react';
import {
  Palette,
  Sliders,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Layout,
  Type,
  Maximize2,
  Box,
  Layers,
  FileCode,
  Shield,
  Lock,
  Eye,
  SlidersHorizontal,
  X,
  Download,
  Flame,
  CheckCircle2,
  Building2,
  Undo2,
  Save,
  CheckCheck,
} from 'lucide-react';
import { useThemeCustomizer, THEME_PRESETS } from '../context/ThemeCustomizerContext';

export const AdminThemeWorkspaceView: React.FC = () => {
  const {
    config,
    updateConfig,
    applyPreset,
    resetToDefault,
    generateCustomCssString,
  } = useThemeCustomizer();

  const [activeTab, setActiveTab] = useState<'colors' | 'cards' | 'typography' | 'branding' | 'presets' | 'code'>('colors');
  const [copiedCode, setCopiedCode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCopyCss = () => {
    const css = generateCustomCssString();
    navigator.clipboard.writeText(css);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSaveAndPublish = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner Control Strip */}
      <div className="p-5 sm:p-6 bg-[#0A2540] text-white rounded-2xl border-2 border-amber-400/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 font-bold shadow-inner shrink-0">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                Website Theme &amp; Asset Control Panel
              </h2>
              <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-md flex items-center gap-1 shadow-xs">
                <Shield className="w-3.5 h-3.5 text-slate-950" />
                Website Admin Only
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
              Live WordPress-style customizer for global colors, cards, typography, and UI assets
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={resetToDefault}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-white/20 min-h-[44px]"
          >
            <Undo2 className="w-4 h-4" />
            <span>Reset Factory Default</span>
          </button>

          <button
            onClick={handleSaveAndPublish}
            className="px-5 py-2.5 bg-[#006D5B] hover:bg-[#005446] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2 border border-teal-400/30 min-h-[44px]"
          >
            {saveSuccess ? (
              <>
                <CheckCheck className="w-4 h-4 text-emerald-300" />
                <span>Theme Published!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-amber-300" />
                <span>Save &amp; Publish Site</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Controls + Right Live Dynamic Preview Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sub-Tab Controls + Options (7 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Sub Navigation Bar */}
          <div className="bg-white dark:bg-[#0A2540] p-1.5 rounded-xl border border-[#CBD5E1] dark:border-slate-700 shadow-xs flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'colors', label: 'Color Palette', icon: Palette, color: 'text-teal-500' },
              { id: 'cards', label: 'Cards & Radius', icon: Layout, color: 'text-blue-500' },
              { id: 'typography', label: 'Typography', icon: Type, color: 'text-purple-500' },
              { id: 'branding', label: 'Brand & Title', icon: Building2, color: 'text-amber-500' },
              { id: 'presets', label: 'Theme Presets', icon: Sparkles, color: 'text-amber-400' },
              { id: 'code', label: 'Export CSS', icon: FileCode, color: 'text-emerald-500' },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 min-h-[40px] ${
                    isActive
                      ? 'bg-[#0A2540] text-white dark:bg-white dark:text-[#0A2540] shadow-sm font-extrabold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300 dark:text-[#0A2540]' : t.color}`} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: COLOR PALETTE */}
          {activeTab === 'colors' && (
            <div className="bg-white dark:bg-[#0A2540] p-6 rounded-2xl border border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-5">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0A2540] dark:text-white">
                  Color Tokens &amp; WCAG AAA Surface Contrast
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  Modify the foundational color scheme. Changes automatically apply across the app and canvas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Primary Civic Navy */}
                <div className="p-4 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                    Primary / Civic Dominant
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={config.primaryColor}
                      onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white dark:bg-[#0A2540] border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Secondary Sage Teal */}
                <div className="p-4 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                    Secondary / Community Sage Teal
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={config.secondaryColor}
                      onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white dark:bg-[#0A2540] border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Accent Action Amber */}
                <div className="p-4 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                    Accent / Action Amber (CTA)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={config.accentColor}
                      onChange={(e) => updateConfig({ accentColor: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={config.accentColor}
                      onChange={(e) => updateConfig({ accentColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white dark:bg-[#0A2540] border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Canvas Base */}
                <div className="p-4 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                    Neutral Canvas Base
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={config.canvasColor}
                      onChange={(e) => updateConfig({ canvasColor: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={config.canvasColor}
                      onChange={(e) => updateConfig({ canvasColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white dark:bg-[#0A2540] border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Card Surface */}
                <div className="p-4 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                    Card Background (#FFFFFF)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={config.cardBgColor}
                      onChange={(e) => updateConfig({ cardBgColor: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={config.cardBgColor}
                      onChange={(e) => updateConfig({ cardBgColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white dark:bg-[#0A2540] border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Outline Stroke */}
                <div className="p-4 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                    Card Border Stroke (#CBD5E1)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={config.borderOutlineColor}
                      onChange={(e) => updateConfig({ borderOutlineColor: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={config.borderOutlineColor}
                      onChange={(e) => updateConfig({ borderOutlineColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white dark:bg-[#0A2540] border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CARDS & CONTAINERS */}
          {activeTab === 'cards' && (
            <div className="bg-white dark:bg-[#0A2540] p-6 rounded-2xl border border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0A2540] dark:text-white">
                  Card Geometry &amp; Container Tokens
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  Customization of card radiuses, border weights, tactile elevations, and button geometry.
                </p>
              </div>

              <div className="space-y-5">
                {/* Card Border Radius */}
                <div className="p-4 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                    <span>Card Border Radius:</span>
                    <span className="font-mono text-[#006D5B] dark:text-teal-300">{config.cardBorderRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="2"
                    value={config.cardBorderRadius}
                    onChange={(e) => updateConfig({ cardBorderRadius: parseInt(e.target.value, 10) })}
                    className="w-full accent-[#0A2540] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Sharp (0px)</span>
                    <span>Golden Standard (12px)</span>
                    <span>Ultra Rounded (24px)</span>
                  </div>
                </div>

                {/* Border Stroke Width */}
                <div className="p-4 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                    <span>Card Border Stroke Width:</span>
                    <span className="font-mono text-[#006D5B] dark:text-teal-300">{config.cardBorderWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.5"
                    value={config.cardBorderWidth}
                    onChange={(e) => updateConfig({ cardBorderWidth: parseFloat(e.target.value) })}
                    className="w-full accent-[#0A2540] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Hairline (1px)</span>
                    <span>WCAG AAA Defined (1.5px - 2px)</span>
                    <span>Bold (4px)</span>
                  </div>
                </div>

                {/* Button Radius */}
                <div className="p-4 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                    <span>Button &amp; Interactive Element Radius:</span>
                    <span className="font-mono text-[#006D5B] dark:text-teal-300">{config.buttonBorderRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="28"
                    step="2"
                    value={config.buttonBorderRadius}
                    onChange={(e) => updateConfig({ buttonBorderRadius: parseInt(e.target.value, 10) })}
                    className="w-full accent-[#0A2540] cursor-pointer"
                  />
                </div>

                {/* Shadow Intensity */}
                <div className="p-4 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                    Elevation Shadow Intensity
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'none', label: 'Flat (0)' },
                      { id: 'subtle', label: 'Subtle (4px)' },
                      { id: 'medium', label: 'Tactile (8px)' },
                      { id: 'elevated', label: 'Elevated (16px)' },
                    ].map((sh) => (
                      <button
                        key={sh.id}
                        onClick={() => updateConfig({ cardShadowIntensity: sh.id as any })}
                        className={`p-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          config.cardShadowIntensity === sh.id
                            ? 'bg-[#0A2540] text-white border-[#0A2540]'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {sh.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TYPOGRAPHY */}
          {activeTab === 'typography' && (
            <div className="bg-white dark:bg-[#0A2540] p-6 rounded-2xl border border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0A2540] dark:text-white">
                  Typography System &amp; Font Archetype
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  Select senior-accessible or editorial font stacks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'atkinson', label: 'Atkinson Hyperlegible', sub: 'Senior Accessibility (Default)' },
                  { id: 'inter', label: 'Inter Sans', sub: 'Modern Metropolitan' },
                  { id: 'serif', label: 'Editorial Serif', sub: 'Nordic Publication Style' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => updateConfig({ fontFamily: f.id as any })}
                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      config.fontFamily === f.id
                        ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div className="font-bold text-sm">{f.label}</div>
                    <div className="text-xs opacity-75 mt-1">{f.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ASSETS & BRANDING */}
          {activeTab === 'branding' && (
            <div className="bg-white dark:bg-[#0A2540] p-6 rounded-2xl border border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0A2540] dark:text-white">
                  Brand Assets &amp; Global Slogan Elements
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  Customizable global website title, mission statement, and landmark watermark silhouettes.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider mb-1.5">
                    Website Platform Title
                  </label>
                  <input
                    type="text"
                    value={config.siteTitle}
                    onChange={(e) => updateConfig({ siteTitle: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider mb-1.5">
                    Platform Mission Tagline
                  </label>
                  <input
                    type="text"
                    value={config.siteTagline}
                    onChange={(e) => updateConfig({ siteTagline: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold min-h-[48px]"
                  />
                </div>

                <div className="p-4 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-slate-800 dark:text-white block">
                      Citizen Pride Landmark Watermarks
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Show stylized monochrome landmark silhouettes in banner
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.showLiveLandmarkWatermark}
                    onChange={(e) => updateConfig({ showLiveLandmarkWatermark: e.target.checked })}
                    className="w-5 h-5 accent-[#0A2540] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: THEME PRESETS */}
          {activeTab === 'presets' && (
            <div className="bg-white dark:bg-[#0A2540] p-6 rounded-2xl border border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0A2540] dark:text-white">
                  Curated Accessible Theme Presets
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  Select a pre-configured theme package to instantly transform the entire municipal visual identity.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {THEME_PRESETS.map((preset) => {
                  const isSelected = config.activePresetName === preset.name;
                  return (
                    <article
                      key={preset.name}
                      onClick={() => applyPreset(preset.name)}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                        isSelected
                          ? 'bg-white dark:bg-[#0A2540] border-[#006D5B] ring-2 ring-[#006D5B]/30 shadow-md'
                          : 'bg-white dark:bg-[#0A2540] border-slate-200 dark:border-slate-700 hover:border-slate-400 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-base text-[#0A2540] dark:text-white">
                          {preset.name}
                        </h4>
                        {isSelected && (
                          <span className="px-2 py-0.5 bg-[#006D5B] text-white text-[10px] font-black rounded-md uppercase">
                            Active
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        {preset.description}
                      </p>

                      {/* Swatches */}
                      <div className="flex items-center gap-1.5 pt-2">
                        <span
                          className="w-5 h-5 rounded-full border border-black/20"
                          style={{ backgroundColor: preset.config.primaryColor }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-black/20"
                          style={{ backgroundColor: preset.config.secondaryColor }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-black/20"
                          style={{ backgroundColor: preset.config.accentColor }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-black/20"
                          style={{ backgroundColor: preset.config.canvasColor }}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: EXPORT CSS */}
          {activeTab === 'code' && (
            <div className="bg-white dark:bg-[#0A2540] p-6 rounded-2xl border border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0A2540] dark:text-white">
                    Export CSS &amp; WordPress Tokens
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                    Copy variables directly into WordPress child themes or stylesheets.
                  </p>
                </div>

                <button
                  onClick={handleCopyCss}
                  className="px-4 py-2 bg-[#0A2540] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#071829] cursor-pointer shadow-xs"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'CSS Copied!' : 'Copy CSS'}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto border border-slate-700 shadow-inner">
                <pre>{generateCustomCssString()}</pre>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Live Dynamic Sandbox Preview Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-[#0A2540] p-5 rounded-2xl border border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-4 sticky top-6">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#006D5B]" />
              Live Interactive Element Preview
            </span>

            {/* Dynamic Card */}
            <div
              className="p-5 space-y-3.5 transition-all shadow-sm"
              style={{
                backgroundColor: config.cardBgColor,
                borderRadius: `${config.cardBorderRadius}px`,
                border: `${config.cardBorderWidth}px solid ${config.borderOutlineColor}`,
                color: config.textPrimaryColor,
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="px-2.5 py-1 text-[11px] font-bold text-white uppercase tracking-wider"
                  style={{
                    backgroundColor: config.secondaryColor,
                    borderRadius: `${Math.max(4, config.cardBorderRadius - 4)}px`,
                  }}
                >
                  Verified Advisory
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">Today</span>
              </div>

              <h4 className="font-bold text-base leading-snug">
                {config.siteTitle} — Streetlights &amp; Ward 4
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Real-time preview of container radiuses, border weights, typography, and action colors.
              </p>

              <div className="pt-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-400">Public Works</span>
                <button
                  className="px-3.5 py-2 text-xs font-bold text-white cursor-pointer shadow-xs transition-transform active:scale-95"
                  style={{
                    backgroundColor: config.accentColor,
                    borderRadius: `${config.buttonBorderRadius}px`,
                  }}
                >
                  Primary CTA
                </button>
              </div>
            </div>

            {/* Color Swatch Bar */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 space-y-2">
              <span className="block font-bold text-slate-700 dark:text-slate-300">Live Active Palette</span>
              <div className="flex items-center justify-center gap-2">
                <div className="w-7 h-7 rounded-lg shadow-xs border border-black/10" style={{ backgroundColor: config.primaryColor }} title="Primary" />
                <div className="w-7 h-7 rounded-lg shadow-xs border border-black/10" style={{ backgroundColor: config.secondaryColor }} title="Secondary" />
                <div className="w-7 h-7 rounded-lg shadow-xs border border-black/10" style={{ backgroundColor: config.accentColor }} title="Accent" />
                <div className="w-7 h-7 rounded-lg shadow-xs border border-black/10" style={{ backgroundColor: config.canvasColor }} title="Canvas" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
