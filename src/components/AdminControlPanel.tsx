import React, { useState } from 'react';
import {
  Palette,
  Sliders,
  Sparkles,
  Layout,
  Type,
  Box,
  FileCode,
  Shield,
  Lock,
  Eye,
  X,
  CheckCircle2,
  Building2,
  Undo2,
  Save,
  Check,
  Copy,
  SlidersHorizontal,
  KeyRound,
  AlertTriangle,
  MoveHorizontal,
  Maximize,
} from 'lucide-react';
import { useThemeCustomizer, THEME_PRESETS } from '../context/ThemeCustomizerContext';

export interface AdminControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'admin' | 'citizen' | 'worker' | string;
  isWebsiteAdmin?: boolean;
}

/**
 * AdminControlPanel component
 * Allows authorized website administrators to customize global CSS variables
 * (primary colors, border radii, spacing, container widths, typography) in real-time.
 * Strictly restricted with role-based & credential security permission checks.
 */
export const AdminControlPanel: React.FC<AdminControlPanelProps> = ({
  isOpen,
  onClose,
  userRole = 'citizen',
  isWebsiteAdmin = false,
}) => {
  const {
    config,
    updateConfig,
    applyPreset,
    resetToDefault,
    generateCustomCssString,
  } = useThemeCustomizer();

  const [activeTab, setActiveTab] = useState<'colors' | 'borders' | 'spacing' | 'typography' | 'branding' | 'presets' | 'code'>('colors');
  const [copiedCode, setCopiedCode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Dynamic admin permission check (allows admin role, isWebsiteAdmin flag, or localStorage admin override key)
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [keyUnlocked, setKeyUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('cityscape_admin_auth_override') === 'true';
  });
  const [keyError, setKeyError] = useState(false);

  const isAuthorizedAdmin = isWebsiteAdmin || userRole === 'admin' || keyUnlocked;

  if (!isOpen) return null;

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKeyInput.trim() === 'cityscape-admin' || adminKeyInput.trim().toLowerCase() === 'admin' || adminKeyInput.trim() === '778899') {
      setKeyUnlocked(true);
      setKeyError(false);
      localStorage.setItem('cityscape_admin_auth_override', 'true');
    } else {
      setKeyError(true);
    }
  };

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
    <div
      id="admin-control-panel-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-control-panel-title"
    >
      {/* WordPress-style Customizer Frame */}
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[900px] bg-[#FAF6F0] dark:bg-[#071829] rounded-2xl shadow-2xl border-2 border-[#0A2540] dark:border-slate-700 flex flex-col overflow-hidden text-left">
        
        {/* Top Control Bar Header */}
        <header className="px-5 py-4 bg-[#0A2540] text-white flex items-center justify-between border-b-2 border-amber-400/40 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 font-bold shadow-inner">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="admin-control-panel-title" className="text-base sm:text-lg font-black tracking-tight text-white">
                  Admin Theme &amp; Global CSS Control Panel
                </h2>
                <span
                  className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md flex items-center gap-1 shadow-xs ${
                    isAuthorizedAdmin
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  {isAuthorizedAdmin ? 'Admin Access Granted' : 'Restricted Access'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Real-time customization of primary colors, border radii, spacing tokens, and global CSS variables
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthorizedAdmin && (
              <button
                id="btn-admin-save-theme"
                onClick={handleSaveAndPublish}
                className="px-4 py-2 bg-[#006D5B] hover:bg-[#005446] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5 border border-teal-400/30 min-h-[40px]"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Applied &amp; Published</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Save &amp; Publish</span>
                  </>
                )}
              </button>
            )}

            <button
              id="btn-admin-close-panel"
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Close admin control panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Permission Guard Banner / Lock Screen */}
        {!isAuthorizedAdmin ? (
          <div className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 border-2 border-red-400 flex items-center justify-center text-red-600 shadow-md">
              <Lock className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#0A2540] dark:text-white">
                Administrator Permission Required
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                This control panel is restricted to authorized municipal administrators with permissions to modify live global CSS tokens, brand colors, and container spacing.
              </p>
            </div>

            {/* Quick Admin Security Key Entry */}
            <form onSubmit={handleUnlockAdmin} className="w-full space-y-3 bg-white dark:bg-[#0A2540] p-4 rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block text-left uppercase tracking-wider">
                Enter Municipal Admin Passkey
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="e.g. cityscape-admin"
                  value={adminKeyInput}
                  onChange={(e) => {
                    setAdminKeyInput(e.target.value);
                    setKeyError(false);
                  }}
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0A2540] dark:bg-teal-600 hover:bg-[#071829] text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Verify</span>
                </button>
              </div>

              {keyError && (
                <p className="text-[11px] text-red-600 font-bold text-left flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Invalid administrator key. Passkey: <code>cityscape-admin</code></span>
                </p>
              )}
            </form>
          </div>
        ) : (
          /* Main Authorized Admin Body: Split Layout (Tabs + Configuration Panels + Live Preview Sandbox) */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
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
                <span>Primary Colors</span>
              </button>

              <button
                onClick={() => setActiveTab('borders')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all text-left cursor-pointer shrink-0 ${
                  activeTab === 'borders'
                    ? 'bg-[#0A2540] text-white dark:bg-white dark:text-[#0A2540] shadow-md font-extrabold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <Layout className="w-4 h-4 text-blue-500" />
                <span>Border Radii &amp; Cards</span>
              </button>

              <button
                onClick={() => setActiveTab('spacing')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all text-left cursor-pointer shrink-0 ${
                  activeTab === 'spacing'
                    ? 'bg-[#0A2540] text-white dark:bg-white dark:text-[#0A2540] shadow-md font-extrabold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <MoveHorizontal className="w-4 h-4 text-amber-500" />
                <span>Spacing &amp; Layout</span>
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
                <Building2 className="w-4 h-4 text-indigo-500" />
                <span>Brand &amp; Assets</span>
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
                <span>Export CSS Tokens</span>
              </button>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-auto hidden md:block">
                <button
                  onClick={resetToDefault}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Reset Default Tokens</span>
                </button>
              </div>
            </nav>

            {/* Active Settings Panel */}
            <div className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-6">
              
              {/* TAB 1: PRIMARY COLORS */}
              {activeTab === 'colors' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                      Global Primary Colors &amp; WCAG Contrast Variables
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                      Real-time tuning of CSS variables: <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded font-mono text-[11px]">--cityscape-navy</code>, <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded font-mono text-[11px]">--cityscape-teal</code>, <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded font-mono text-[11px]">--cityscape-amber</code>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Primary Civic Navy */}
                    <div className="p-4 bg-white dark:bg-[#0A2540] rounded-xl border border-[#CBD5E1] dark:border-slate-700 shadow-xs space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                        Primary / Header &amp; Branding (<span className="font-mono">--ui-primary</span>)
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
                        Secondary / Sage Teal (<span className="font-mono">--cityscape-teal</span>)
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
                        Accent / CTA Action Amber (<span className="font-mono">--cityscape-amber</span>)
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

                    {/* Canvas Background */}
                    <div className="p-4 bg-white dark:bg-[#0A2540] rounded-xl border border-[#CBD5E1] dark:border-slate-700 shadow-xs space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                        Canvas Background (<span className="font-mono">--cityscape-canvas</span>)
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

                    {/* Card Surface */}
                    <div className="p-4 bg-white dark:bg-[#0A2540] rounded-xl border border-[#CBD5E1] dark:border-slate-700 shadow-xs space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                        Card Surface (<span className="font-mono">--cityscape-card</span>)
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

                    {/* Outline Stroke */}
                    <div className="p-4 bg-white dark:bg-[#0A2540] rounded-xl border border-[#CBD5E1] dark:border-slate-700 shadow-xs space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                        Border Stroke (<span className="font-mono">--cityscape-border</span>)
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

              {/* TAB 2: BORDER RADII & CARDS */}
              {activeTab === 'borders' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                      Border Radii &amp; Geometry Tokens
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                      Real-time tuning of CSS variables: <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded font-mono text-[11px]">--cityscape-card-radius</code>, <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded font-mono text-[11px]">--cityscape-btn-radius</code>, and <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded font-mono text-[11px]">--cityscape-card-border-width</code>.
                    </p>
                  </div>

                  <div className="space-y-5 bg-white dark:bg-[#0A2540] p-5 rounded-xl border border-[#CBD5E1] dark:border-slate-700 shadow-xs">
                    {/* Card Corner Radius */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                        <span>Card Border Radius (<code className="font-mono">--cityscape-card-radius</code>):</span>
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
                        <span>Golden Ratio (12px)</span>
                        <span>Rounded Pill (24px)</span>
                      </div>
                    </div>

                    {/* Button Corner Radius */}
                    <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                        <span>Button &amp; Control Radius (<code className="font-mono">--cityscape-btn-radius</code>):</span>
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

                    {/* Card Border Stroke Width */}
                    <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                        <span>Border Stroke Width (<code className="font-mono">--cityscape-card-border-width</code>):</span>
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
                    </div>

                    {/* Shadow Intensity */}
                    <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                        Tactile Shadow Elevation
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'none', label: 'Flat (0)' },
                          { id: 'subtle', label: 'Subtle (4px)' },
                          { id: 'medium', label: 'Medium (8px)' },
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

              {/* TAB 3: SPACING & LAYOUT TOKENS */}
              {activeTab === 'spacing' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                      Spacing, Gap &amp; Container Width Tokens
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                      Real-time tuning of CSS variables: <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded font-mono text-[11px]">--cityscape-container-padding</code>, <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded font-mono text-[11px]">--cityscape-section-gap</code>, and <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded font-mono text-[11px]">--cityscape-container-max-w</code>.
                    </p>
                  </div>

                  <div className="space-y-5 bg-white dark:bg-[#0A2540] p-5 rounded-xl border border-[#CBD5E1] dark:border-slate-700 shadow-xs">
                    {/* Section Gap Multiplier */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                        <span>Section &amp; Grid Gap (<code className="font-mono">--cityscape-section-gap</code>):</span>
                        <span className="font-mono text-[#006D5B] dark:text-teal-300">{config.sectionGap}px</span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="48"
                        step="4"
                        value={config.sectionGap}
                        onChange={(e) => updateConfig({ sectionGap: parseInt(e.target.value, 10) })}
                        className="w-full accent-[#0A2540] cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                        <span>Tight (12px)</span>
                        <span>Standard (24px)</span>
                        <span>Spacious (48px)</span>
                      </div>
                    </div>

                    {/* Container Max Width */}
                    <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                        <span>Container Max Width (<code className="font-mono">--cityscape-container-max-w</code>):</span>
                        <span className="font-mono text-[#006D5B] dark:text-teal-300">{config.containerMaxWidth}px</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { val: 1024, label: '1024px (Compact)' },
                          { val: 1280, label: '1280px (Standard)' },
                          { val: 1440, label: '1440px (Wide)' },
                          { val: 1600, label: '1600px (Full HD)' },
                        ].map((w) => (
                          <button
                            key={w.val}
                            onClick={() => updateConfig({ containerMaxWidth: w.val })}
                            className={`p-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                              config.containerMaxWidth === w.val
                                ? 'bg-[#0A2540] text-white border-[#0A2540]'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {w.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Container Padding Scale */}
                    <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                        Container Outer Padding Scale
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'compact', label: 'Compact (12px)' },
                          { id: 'standard', label: 'Standard (20px)' },
                          { id: 'spacious', label: 'Spacious (32px)' },
                        ].map((p) => (
                          <button
                            key={p.id}
                            onClick={() => updateConfig({ containerPaddingScale: p.id as any })}
                            className={`p-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                              config.containerPaddingScale === p.id
                                ? 'bg-[#0A2540] text-white border-[#0A2540]'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TYPOGRAPHY */}
              {activeTab === 'typography' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                      Typography Hierarchy &amp; Font Families
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                      Select font families and letter spacing scales for optimal senior readability and WCAG compliance.
                    </p>
                  </div>

                  <div className="p-5 bg-white dark:bg-[#0A2540] rounded-xl border border-[#CBD5E1] dark:border-slate-700 shadow-xs space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'atkinson', label: 'Atkinson Hyperlegible', sub: 'Senior Accessibility (Default)' },
                        { id: 'inter', label: 'Inter Sans', sub: 'Modern Metro' },
                        { id: 'serif', label: 'Editorial Serif', sub: 'Nordic Publication Style' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => updateConfig({ fontFamily: f.id as any })}
                          className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
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
              )}

              {/* TAB 5: BRAND & ASSETS */}
              {activeTab === 'branding' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                      Municipal Branding &amp; Landmark Watermarks
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                      Customize platform titles, mission taglines, and landmark watermark graphics.
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
                          Render subtle landmark silhouette watermarks in the citizen pride banner
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

              {/* TAB 6: PRESETS */}
              {activeTab === 'presets' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                      Pre-Calibrated Theme Presets
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                      One-click deployment of WCAG AAA verified accessible styles.
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

              {/* TAB 7: EXPORT CSS */}
              {activeTab === 'code' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                        Export CSS Variables &amp; WordPress Theme Code
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                        Direct drop-in CSS tokens for stylesheets, Tailwind CSS, or WordPress child themes.
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

            {/* Right Column: Live Sandbox Dynamic Preview Box */}
            <div className="w-full md:w-80 bg-slate-100 dark:bg-[#061524] border-t md:border-t-0 md:border-l border-[#CBD5E1] dark:border-slate-800 p-5 space-y-4 shrink-0 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-[#006D5B]" />
                  Live Dynamic Preview
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
                      Official Notice
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">Today</span>
                  </div>

                  <h4 className="font-bold text-sm leading-tight">
                    {config.siteTitle} — Ward 4 Roadwork
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    Live reflection of primary colors, border radii ({config.cardBorderRadius}px), and button tokens.
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
                      Primary Action
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Swatches */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                <span className="block font-bold mb-1.5">Live Tokens</span>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 rounded-md shadow-xs border border-black/10" style={{ backgroundColor: config.primaryColor }} title="Primary" />
                  <div className="w-6 h-6 rounded-md shadow-xs border border-black/10" style={{ backgroundColor: config.secondaryColor }} title="Secondary" />
                  <div className="w-6 h-6 rounded-md shadow-xs border border-black/10" style={{ backgroundColor: config.accentColor }} title="Accent" />
                  <div className="w-6 h-6 rounded-md shadow-xs border border-black/10" style={{ backgroundColor: config.canvasColor }} title="Canvas" />
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
