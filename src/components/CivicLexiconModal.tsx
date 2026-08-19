import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Truck,
  Flame,
  Shield,
  Award,
  Scale,
  Eye,
  HeartHandshake,
  Compass,
  Search,
  Volume2,
  VolumeX,
  Globe2,
  Layers,
  ChevronRight,
  Zap,
  Users,
  Check,
  Code,
  Vote,
  Lightbulb,
  FileCheck,
  Droplet,
  Route,
  Lock,
  SunMedium,
  Workflow,
  KeyRound,
  ExternalLink,
  Columns
} from 'lucide-react';
import { CIVIC_LEXICON_CATALOG, CivicLexiconTerm } from '../data/civicLexiconData';

interface CivicLexiconModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_TABS = [
  'ALL',
  'Urban Stewardship',
  'Resolution & Workflow',
  'Community Trust',
  'Infrastructure Resiliency',
  'Civic Tech & Data'
] as const;

export const CivicLexiconModal: React.FC<CivicLexiconModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<CivicLexiconTerm>(CIVIC_LEXICON_CATALOG[0]);
  const [activePerspective, setActivePerspective] = useState<'urbanist' | 'senior' | 'both'>('urbanist');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedTermId, setCopiedTermId] = useState<string | null>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Clean up speech synthesis when unmounting or closing
  useEffect(() => {
    if (!isOpen && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredTerms = CIVIC_LEXICON_CATALOG.filter((item) => {
    const matchesCat = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.modernUrbanistMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.plainSeniorMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.internationalStandard.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badgeCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'Truck': return <Truck className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'Shield': return <Shield className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      case 'Scale': return <Scale className="w-5 h-5" />;
      case 'Eye': return <Eye className="w-5 h-5" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      case 'Code': return <Code className="w-5 h-5" />;
      case 'Vote': return <Vote className="w-5 h-5" />;
      case 'Lightbulb': return <Lightbulb className="w-5 h-5" />;
      case 'FileCheck': return <FileCheck className="w-5 h-5" />;
      case 'Droplet': return <Droplet className="w-5 h-5" />;
      case 'Route': return <Route className="w-5 h-5" />;
      case 'Lock': return <Lock className="w-5 h-5" />;
      case 'SunMedium': return <SunMedium className="w-5 h-5" />;
      case 'Workflow': return <Workflow className="w-5 h-5" />;
      case 'KeyRound': return <KeyRound className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const handleSpeakTerm = (term: CivicLexiconTerm) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();
      let textToSpeak = `${term.term}. International Standard: ${term.internationalStandard}. `;
      if (activePerspective === 'urbanist') {
        textToSpeak += `Urbanist definition: ${term.modernUrbanistMeaning}`;
      } else if (activePerspective === 'senior') {
        textToSpeak += `Plain language explanation: ${term.plainSeniorMeaning}`;
      } else {
        textToSpeak += `Urbanist definition: ${term.modernUrbanistMeaning}. Plain language explanation: ${term.plainSeniorMeaning}`;
      }
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopyTerm = (term: CivicLexiconTerm) => {
    const textToCopy = `Civic Lexicon 3.0: ${term.term}\nStandard: ${term.internationalStandard} [${term.badgeCode}]\nTagline: ${term.tagline}\nUrbanist Framing: ${term.modernUrbanistMeaning}\nPlain Language Translation: ${term.plainSeniorMeaning}\nExample: ${term.cityscapeUsageExample}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedTermId(term.id);
    setTimeout(() => setCopiedTermId(null), 2000);
  };

  const getCategoryCount = (category: string) => {
    if (category === 'ALL') return CIVIC_LEXICON_CATALOG.length;
    return CIVIC_LEXICON_CATALOG.filter(c => c.category === category).length;
  };

  return (
    <AnimatePresence>
      <div
        id="modal-civic-lexicon"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#0A2540]/80 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl bg-[#F8FAFC] dark:bg-[#071B2F] border-2 border-[#CBD5E1] dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header Banner */}
          <div className="p-4 sm:p-6 bg-[#0A2540] text-white border-b-2 border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#006D5B] border-2 border-teal-400/40 flex items-center justify-center text-amber-300 shadow-md shrink-0">
                <Globe2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                    Civic Lexicon 3.0
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#B45309] text-amber-100 border border-amber-400/40 uppercase tracking-wider">
                    International Standard
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Global Urban Governance Terminology & Plain-Language Neighbor Translations
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                id="btn-close-civic-lexicon-modal"
                onClick={onClose}
                aria-label="Close Civic Lexicon Modal"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader Toolbar: Search + Category Filters + View Mode Toggle */}
          <div className="p-3 sm:p-4 bg-white dark:bg-[#0A2540]/60 border-b border-[#CBD5E1] dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="input-search-civic-lexicon"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 24+ global civic terms..."
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border-1.5 border-slate-300 dark:border-slate-700 rounded-xl text-[#111827] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#006D5B] focus:ring-2 focus:ring-[#006D5B]/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Perspective View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 shrink-0 w-full sm:w-auto justify-center gap-1">
              <button
                onClick={() => setActivePerspective('urbanist')}
                aria-pressed={activePerspective === 'urbanist'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activePerspective === 'urbanist'
                    ? 'bg-[#006D5B] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Urbanist</span>
              </button>
              <button
                onClick={() => setActivePerspective('senior')}
                aria-pressed={activePerspective === 'senior'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activePerspective === 'senior'
                    ? 'bg-[#0A2540] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-teal-300" />
                <span>Plain Language</span>
              </button>
              <button
                onClick={() => setActivePerspective('both')}
                aria-pressed={activePerspective === 'both'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activePerspective === 'both'
                    ? 'bg-[#B45309] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Columns className="w-3.5 h-3.5 text-amber-200" />
                <span>Side-by-Side</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills Bar */}
          <div className="px-3 sm:px-4 py-2.5 bg-slate-100 dark:bg-[#061726] border-b border-[#CBD5E1] dark:border-slate-800 overflow-x-auto flex items-center gap-1.5 shrink-0">
            {CATEGORY_TABS.map((cat) => {
              const count = getCategoryCount(cat);
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#006D5B] text-white border-teal-600 shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-[#006D5B]'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Body Content Area: Left Master List + Right Detail Spotlight */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-0">
            {/* Left Column: Terms Directory (5 cols) - Smooth Scrollable */}
            <div className="lg:col-span-5 border-r border-[#CBD5E1] dark:border-slate-800 overflow-y-auto p-3 sm:p-4 space-y-2.5 bg-white dark:bg-[#071B2F]/60 max-h-[60vh] lg:max-h-full">
              <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-white/95 dark:bg-[#071B2F]/95 backdrop-blur-xs py-1 z-10">
                <span>{filteredTerms.length} International Terms</span>
                <span className="text-[11px] text-slate-400 font-medium">Click to inspect</span>
              </div>

              {filteredTerms.map((term) => {
                const isSelected = selectedTerm.id === term.id;
                return (
                  <motion.div
                    key={term.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedTerm(term)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#006D5B]/10 dark:bg-teal-950/40 border-[#006D5B] shadow-sm ring-1 ring-[#006D5B]/30'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs mt-0.5"
                      style={{ backgroundColor: term.colorTone }}
                    >
                      {getIcon(term.iconName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-extrabold text-sm text-[#111827] dark:text-white truncate">
                          {term.term}
                        </h4>
                        <ChevronRight
                          className={`w-4 h-4 shrink-0 transition-transform ${
                            isSelected ? 'text-[#006D5B] rotate-90' : 'text-slate-400'
                          }`}
                        />
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 font-medium mt-0.5">
                        {term.tagline}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                          {term.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-[#B45309] dark:text-amber-300">
                          {term.badgeCode}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {filteredTerms.length === 0 && (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <BookOpen className="w-8 h-8 mx-auto text-slate-400" />
                  <p className="font-bold text-sm">No matching civic terms found.</p>
                  <p className="text-xs">Try searching for a different keyword or choose 'ALL' categories.</p>
                </div>
              )}
            </div>

            {/* Right Column: Deep Inspection Spotlight Card (7 cols) - Independent Scrollable */}
            <div className="lg:col-span-7 p-4 sm:p-6 overflow-y-auto space-y-5 bg-[#F8FAFC] dark:bg-[#071B2F] max-h-[60vh] lg:max-h-full">
              {selectedTerm ? (
                <div className="space-y-5">
                  {/* Top Badge & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-700 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
                        style={{ backgroundColor: selectedTerm.colorTone }}
                      >
                        {getIcon(selectedTerm.iconName)}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#006D5B] dark:text-teal-300">
                          {selectedTerm.category}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-[#111827] dark:text-white leading-tight">
                          {selectedTerm.term}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeakTerm(selectedTerm)}
                        title={isSpeaking ? "Stop audio pronunciation" : "Listen to audio pronunciation & meaning"}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                          isSpeaking
                            ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-[#006D5B] hover:text-white'
                        }`}
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-4 h-4 shrink-0" />
                            <span className="hidden sm:inline">Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4 shrink-0" />
                            <span className="hidden sm:inline">Pronounce</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopyTerm(selectedTerm)}
                        title="Copy full specification"
                        className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 transition-all cursor-pointer text-xs font-bold flex items-center gap-1.5"
                      >
                        {copiedTermId === selectedTerm.id ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="hidden sm:inline text-emerald-700 dark:text-emerald-300">Copied</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="hidden sm:inline">Copy Spec</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* International Standard Badge */}
                  <div className="p-3.5 bg-gradient-to-r from-[#0A2540] to-[#0A335C] text-white rounded-2xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <Globe2 className="w-5 h-5 text-amber-300 shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest block">
                          Official Global Benchmark
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-amber-200">
                          {selectedTerm.internationalStandard}
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-teal-800/80 text-teal-200 text-[10px] font-mono font-bold border border-teal-500/40 shrink-0 self-start sm:self-auto">
                      ISO/UN COMPLIANT
                    </span>
                  </div>

                  {/* Core Tagline Banner */}
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                      Key Essence
                    </span>
                    <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      "{selectedTerm.tagline}"
                    </p>
                  </div>

                  {/* Dynamic Perspective Content Cards */}
                  <div className={`grid gap-4 ${activePerspective === 'both' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                    {/* Perspective 1: Modern Urbanist & Gen Z Framing */}
                    {(activePerspective === 'urbanist' || activePerspective === 'both') && (
                      <div
                        className="p-4 sm:p-5 rounded-2xl border-2 transition-all space-y-2.5 bg-[#006D5B]/10 dark:bg-teal-950/30 border-[#006D5B] ring-1 ring-[#006D5B]/20"
                      >
                        <div className="flex items-center gap-2 text-[#006D5B] dark:text-teal-300">
                          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                          <h4 className="font-black text-xs sm:text-sm uppercase tracking-wider">
                            Urbanist Framing (Global / Gen Z)
                          </h4>
                        </div>
                        <p className="text-xs sm:text-sm text-[#111827] dark:text-slate-100 font-medium leading-relaxed">
                          {selectedTerm.modernUrbanistMeaning}
                        </p>
                      </div>
                    )}

                    {/* Perspective 2: Plain Language & Senior Accessibility Translation */}
                    {(activePerspective === 'senior' || activePerspective === 'both') && (
                      <div
                        className="p-4 sm:p-5 rounded-2xl border-2 transition-all space-y-2.5 bg-[#0A2540]/10 dark:bg-blue-950/30 border-[#0A2540] ring-1 ring-[#0A2540]/20"
                      >
                        <div className="flex items-center gap-2 text-[#0A2540] dark:text-blue-300">
                          <Users className="w-4 h-4 text-teal-500 shrink-0" />
                          <h4 className="font-black text-xs sm:text-sm uppercase tracking-wider">
                            Plain Language (Senior WCAG AAA)
                          </h4>
                        </div>
                        <p className="text-xs sm:text-sm text-[#111827] dark:text-slate-100 font-medium leading-relaxed">
                          {selectedTerm.plainSeniorMeaning}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Real-World Cityscape Implementation Example */}
                  <div className="p-4 sm:p-5 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border-2 border-amber-200 dark:border-amber-900/60 space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-[#B45309] dark:text-amber-300 font-black uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-[#B45309] shrink-0" />
                      <span>Live Cityscape Application Example</span>
                    </div>
                    <blockquote className="italic font-bold text-slate-800 dark:text-amber-100 pl-3 border-l-3 border-[#B45309] leading-relaxed">
                      {selectedTerm.cityscapeUsageExample}
                    </blockquote>
                  </div>

                  {/* System Architecture Badge Tagline */}
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="font-bold text-slate-600 dark:text-slate-300">
                        Official Badge Registry: <code className="text-[#006D5B] dark:text-teal-300 font-mono font-bold">[{selectedTerm.badgeCode}]</code>
                      </span>
                    </div>
                    <span className="text-slate-500 font-medium">
                      Built for multi-generational civic empowerment.
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="p-3 sm:p-4 bg-slate-100 dark:bg-[#0A2540] border-t-2 border-[#CBD5E1] dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#006D5B] dark:text-teal-300" />
              <span>Complies with Cityscape Verbal Identity & WCAG AAA Senior Accessibility</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-[11px] hidden sm:inline">Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-mono text-[10px]">ESC</kbd> to close</span>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#006D5B] hover:bg-[#004D40] text-white font-bold transition-all cursor-pointer shadow-xs active:scale-97"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
