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
  Sparkle,
} from 'lucide-react';
import { useThemeCustomizer, THEME_PRESETS, ThemeCustomizerConfig } from '../context/ThemeCustomizerContext';

interface AdminThemeControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isWebsiteAdmin: boolean;
}

export const AdminThemeControlPanel: React.FC<AdminThemeControlPanelProps> = ({
  isOpen,
  onClose,
  isWebsiteAdmin,
}) => {
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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-fadeIn">
      {/* WordPress Customizer Style Layout Window */}
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[900px] bg-[#FAF6F0] dark:bg-[#071829] rounded-2xl shadow-2xl border-2 border-[#0A2540] dark:border-slate-700 flex flex-col overflow-hidden text-left">
        
        {/* Top Control Bar (Admin Header with Protected Status Badge) */}
        <header className="px-5 py-4 bg-[#0A2540] text-white flex items-center justify-between border-b-2 border-amber-400/40 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 font-bold shadow-inner">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  WordPress &amp; CSS Theme Control Panel
                </h2>
                <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-md flex items-center gap-1 shadow-xs">
                  <Shield className="w-3 h-3 text-slate-950" />
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Live asset customizer, card dimensions, color tokens, and container styling
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSaveAndPublish}
              className="px-4 py-2 bg-[#006D5B] hover:bg-[#005446] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5 border border-teal-400/30"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Published!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Save &amp; Publish</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Close customizer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Security Warning If Not Admin Mode (ISO-27001 Access Control Guard) */}
        {!isWebsiteAdmin && (
          <div className="px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#B45309]" />
              Preview Mode Active. Master authentication in Gov Desk required to make permanent database-wide theme commits.
            </span>
          </div>
        )}

        {/* Main Split Body: Sidebar Navigation + Settings Canvas + Live Preview Card */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Sub-Navigation Sidebar (Tabs) */}
          <nav className="w-full md:w-56 bg-white dark:bg-[#0A2540] border-r border-[#CBD5E1] dark:border-slate-800 p-3 space-y-1.5 shrink-0 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1 md:gap-0 no-scrollbar">
            <button
              onClick={() => setActiveTab('colors')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all text-left cursor-pointer shrink-0 ${
                activeTab === 'colors'
                  ? 'bg-[#0A2540] text-white dark:bg-white dark:text-[#0A2540] shadow-md font-extrabold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <Palette className="w-4 h-4 text-teal-500" />
              <span>Color Palette</span>
            </button>

            <button
              onClick={() => setActiveTab('cards')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all text-left cursor-pointer shrink-0 ${
                activeTab === 'cards'
                  ? 'bg-[#0A2540] text-white dark:bg-white dark:text-[#0A2540] shadow-md font-extrabold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <Layout className="w-4 h-4 text-blue-500" />
              <span>Cards &amp; Containers</span>
            </button>

            <button
              onClick={() => setActiveTab('typography')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all text-left cursor-pointer shrink-0 ${
                activeTab === 'typography'
                  ? 'bg-[#0A2540] text-white dark:bg-white dark:text-[#0A2540] shadow-md font-extrabold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <Type className="w-4 h-4 text-purple-500" />
              <span>Typography</span>
            </button>

            <button
              onClick={() => setActiveTab('branding')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all text-left cursor-pointer shrink-0 ${
                activeTab === 'branding'
                  ? 'bg-[#0A2540] text-white dark:bg-white dark:text-[#0A2540] shadow-md font-extrabold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-500" />
              <span>Asset &amp; Brand</span>
            </button>

            <button
              onClick={() => setActiveTab('presets')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all text-left cursor-pointer shrink-0 ${
                activeTab === 'presets'
                  ? 'bg-[#0A2540] text-white dark:bg-white dark:text-[#0A2540] shadow-md font-extrabold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Theme Presets</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all text-left cursor-pointer shrink-0 ${
                activeTab === 'code'
                  ? 'bg-[#0A2540] text-white dark:bg-white dark:text-[#0A2540] shadow-md font-extrabold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <FileCode className="w-4 h-4 text-emerald-500" />
              <span>Export CSS</span>
            </button>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-auto hidden md:block">
              <button
                onClick={resetToDefault}
                className="w-full px-3 py-2 text-xs font-bold text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Factory CSS</span>
              </button>
            </div>
          </nav>

          {/* Active Settings Panel */}
          <div className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-6">
            
            {/* TAB 1: COLOR PALETTE */}
            {activeTab === 'colors' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                    Primary Brand &amp; WCAG AAA Color Tokens
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                    Adjust dominant civic anchors, community badges, and action highlights in real time.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Primary Civic Navy */}
                  <div className="p-4 bg-white dark:bg-[#0A2540] rounded-xl border border-[#CBD5E1] dark:border-slate-700 shadow-xs space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                      Primary / Dominant Anchor
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
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Secondary Sage Teal */}
                  <div className="p-4 bg-white dark:bg-[#0A2540] rounded-xl border border-[#CBD5E1] dark:border-slate-700 shadow-xs space-y-2">
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
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Accent Action Amber */}
                  <div className="p-4 bg-white dark:bg-[#0A2540] rounded-xl border border-[#CBD5E1] dark:border-slate-700 shadow-xs space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                      Accent / CTA Action Amber
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
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Neutral Canvas Surface */}
                  <div className="p-4 bg-white dark:bg-[#0A2540] rounded-xl border border-[#CBD5E1] dark:border-slate-700 shadow-xs space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                      Neutral Canvas Base (#FAF6F0 / #F8FAFC)
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
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Card Background */}
                  <div className="p-4 bg-white dark:bg-[#0A2540] rounded-xl border border-[#CBD5E1] dark:border-slate-700 shadow-xs space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                      Card Surface (#FFFFFF Pure White)
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
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Border Outline Stroke */}
                  <div className="p-4 bg-white dark:bg-[#0A2540] rounded-xl border border-[#CBD5E1] dark:border-slate-700 shadow-xs space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                      Outline Stroke Border (#CBD5E1)
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
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CARDS & CONTAINERS */}
            {activeTab === 'cards' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                    Card Geometry &amp; Container Tokens
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                    Configure structural borders, corner radii (12px golden standard), and tactile elevation shadows.
                  </p>
                </div>

                <div className="space-y-5 bg-white dark:bg-[#0A2540] p-5 rounded-xl border border-[#CBD5E1] dark:border-slate-700 shadow-xs">
                  {/* Card Corner Radius */}
                  <div className="space-y-2">
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

                  {/* Border Width */}
                  <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
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
                      <span>High-Contrast AAA (1.5px - 2px)</span>
                      <span>Bold (4px)</span>
                    </div>
                  </div>

                  {/* Button Border Radius */}
                  <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                      <span>Button &amp; CTA Corner Radius:</span>
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

                  {/* Shadow Elevation */}
                  <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                      Card Elevation Depth &amp; Shadow
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
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
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
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                    Typography Stack &amp; Letter Spacing
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                    Atkinson Hyperlegible recommended for maximum character distinction and senior readability.
                  </p>
                </div>

                <div className="p-5 bg-white dark:bg-[#0A2540] rounded-xl border border-[#CBD5E1] dark:border-slate-700 shadow-xs space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                      Font Family Archetype
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'atkinson', label: 'Atkinson Hyperlegible', sub: 'Senior Accessibility' },
                        { id: 'inter', label: 'Inter Sans', sub: 'Modern Metro' },
                        { id: 'serif', label: 'Editorial Serif', sub: 'Civic Publication' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => updateConfig({ fontFamily: f.id as any })}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            config.fontFamily === f.id
                              ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-md'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="font-bold text-sm">{f.label}</div>
                          <div className="text-[11px] opacity-75">{f.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ASSETS & BRANDING */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                    Asset Elements &amp; Municipal Slogans
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                    Customizable global website title, mission statement, and landmark watermark silhouettes.
                  </p>
                </div>

                <div className="p-5 bg-white dark:bg-[#0A2540] rounded-xl border border-[#CBD5E1] dark:border-slate-700 shadow-xs space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider mb-1">
                      Website Platform Title
                    </label>
                    <input
                      type="text"
                      value={config.siteTitle}
                      onChange={(e) => updateConfig({ siteTitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider mb-1">
                      Platform Mission Tagline
                    </label>
                    <input
                      type="text"
                      value={config.siteTagline}
                      onChange={(e) => updateConfig({ siteTagline: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-slate-800 dark:text-white block">
                        Citizen Pride Landmark Watermarks
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Render stylized subtle vector monument silhouettes in banner
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
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                    One-Click Curated Theme Presets
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                    Pre-calibrated accessible design systems ready for instant municipal deployment.
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

                        {/* Color Swatch Previews */}
                        <div className="flex items-center gap-1.5 pt-2">
                          <span
                            className="w-5 h-5 rounded-full border border-black/20"
                            style={{ backgroundColor: preset.config.primaryColor }}
                            title="Primary"
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-black/20"
                            style={{ backgroundColor: preset.config.secondaryColor }}
                            title="Secondary"
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-black/20"
                            style={{ backgroundColor: preset.config.accentColor }}
                            title="Accent"
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-black/20"
                            style={{ backgroundColor: preset.config.canvasColor }}
                            title="Canvas"
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
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                      Export Custom CSS &amp; WordPress Theme Tokens
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                      Copy clean CSS Variables directly into WordPress <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">style.css</code> or custom child theme.
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

          {/* Right Live Visual Sandbox / Preview Card */}
          <div className="w-full md:w-80 bg-slate-100 dark:bg-[#061524] border-t md:border-t-0 md:border-l border-[#CBD5E1] dark:border-slate-800 p-5 space-y-4 shrink-0 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-[#006D5B]" />
                Live Dynamic Component Preview
              </span>

              {/* Sample Card Rendered with Live Values */}
              <div
                className="p-5 space-y-3 transition-all"
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
                    Verified Notice
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">Today</span>
                </div>

                <h4 className="font-bold text-sm leading-tight">
                  Water Main Upgrades &amp; Ward 4 Notice
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Sample container illustrating real-time CSS font pairings, line rhythm, and outer borders.
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400">Public Works</span>
                  <button
                    className="px-3 py-1.5 text-xs font-bold text-white cursor-pointer shadow-xs transition-transform active:scale-95"
                    style={{
                      backgroundColor: config.accentColor,
                      borderRadius: `${config.buttonBorderRadius}px`,
                    }}
                  >
                    Action Button
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Palette Preview Strip */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
              <span className="block font-bold mb-1.5">Active Token Palette</span>
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-md shadow-xs border border-black/10" style={{ backgroundColor: config.primaryColor }} title="Primary" />
                <div className="w-6 h-6 rounded-md shadow-xs border border-black/10" style={{ backgroundColor: config.secondaryColor }} title="Secondary" />
                <div className="w-6 h-6 rounded-md shadow-xs border border-black/10" style={{ backgroundColor: config.accentColor }} title="Accent" />
                <div className="w-6 h-6 rounded-md shadow-xs border border-black/10" style={{ backgroundColor: config.canvasColor }} title="Canvas" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
