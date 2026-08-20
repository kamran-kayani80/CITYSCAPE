import { ExpandableClayCard } from './ExpandableClayCard';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Palette,
  Type,
  Grid,
  Layers,
  Sparkles,
  Download,
  Copy,
  Check,
  Eye,
  ShieldCheck,
  Building2,
  Users,
  Compass,
  Monitor,
  Smartphone,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Share2,
  Maximize2,
  CheckCircle2,
  HelpCircle,
  Volume2,
  Image as ImageIcon,
  Sun,
  Zap,
  Leaf,
  XCircle,
  CheckCircle,
  Wind,
  Globe,
  Battery,
  Shield,
  MapPin,
  Heart,
  Camera,
  FileText,
  PieChart
} from 'lucide-react';
import { CityscapeLogo } from './CityscapeLogo';

// 60-30-10 Brand Color Rule Token Schema
interface ColorToken {
  name: string;
  role: string;
  hex: string;
  rgb: string;
  cmyk: string;
  wcagContrast: string;
  description: string;
  usage: string;
  ratioTier?: '60_primary' | '30_secondary' | '10_accent';
  category: 'primary' | 'secondary' | 'accent' | 'legacy';
}

// 60% Primary Dominant Palette (Atmosphere, Canvas, Card Shells & Structural Frame)
const PRIMARY_BRAND_COLORS: ColorToken[] = [
  {
    name: 'Civic Navy',
    role: 'Primary Structural Anchor & Header (60% Rule)',
    hex: '#0A2540',
    rgb: 'RGB: 10, 37, 64',
    cmyk: 'CMYK: 84, 42, 0, 75',
    wcagContrast: '16.2:1 (AAA on White)',
    description: 'Deep, authoritative architectural navy serving as the foundational brand anchor, structural headers, and deep-contrast shells.',
    usage: '60% Dominant Foundation: Top navigation bar, structural modal frames, primary branding, and high-contrast dark surfaces.',
    ratioTier: '60_primary',
    category: 'primary'
  },
  {
    name: 'Warm Linen Canvas',
    role: 'Ambient Background Canvas (60% Rule)',
    hex: '#FAF6F0',
    rgb: 'RGB: 250, 246, 240',
    cmyk: 'CMYK: 0, 2, 4, 2',
    wcagContrast: '16.8:1 (AAA vs Charcoal)',
    description: 'Glare-free natural linen canvas engineered specifically for comfortable, long-term multi-generational browsing without eye fatigue.',
    usage: '60% Dominant Foundation: Global application canvas background, modal backdrop surfaces, outer containers, and dashboard sheets.',
    ratioTier: '60_primary',
    category: 'primary'
  },
  {
    name: 'Pure White Surface',
    role: 'Primary Card Background (60% Rule)',
    hex: '#FFFFFF',
    rgb: 'RGB: 255, 255, 255',
    cmyk: 'CMYK: 0, 0, 0, 0',
    wcagContrast: '17.4:1 (AAA vs Charcoal)',
    description: 'Clean, radiant card surface establishing clear visual elevation and pristine negative space for civic data readability.',
    usage: '60% Dominant Foundation: Main report card surfaces, form backgrounds, statistics containers, and content cards.',
    ratioTier: '60_primary',
    category: 'primary'
  },
  {
    name: 'Sage Green Anchor',
    role: 'Organic Brand Identifier (60% Rule)',
    hex: '#8F9E87',
    rgb: 'RGB: 143, 158, 135',
    cmyk: 'CMYK: 10, 0, 15, 38',
    wcagContrast: '7.8:1 (AAA on Charcoal)',
    description: 'Calm, organic sage green reflecting natural harmony, environmental care, and civic sustainability.',
    usage: '60% Dominant Foundation: Architectural identity elements, brand seal backdrops, and calm surface tones.',
    ratioTier: '60_primary',
    category: 'primary'
  }
];

// 30% Secondary Supporting Palette (Community Identity, Navigation, Badges & High-Contrast Typography)
const SECONDARY_BRAND_COLORS: ColorToken[] = [
  {
    name: 'Warm Sage Teal',
    role: 'Community Badge & Active State (30% Rule)',
    hex: '#006D5B',
    rgb: 'RGB: 0, 109, 91',
    cmyk: 'CMYK: 100, 0, 17, 57',
    wcagContrast: '7.5:1 (AAA on Light Surface)',
    description: 'Balanced, community-centric sage teal delivering unmistakable civic trust and environmental vibrancy.',
    usage: '30% Supporting Structure: Ward badges, active filter tabs, verified community stamps, environmental status indicators, secondary buttons.',
    ratioTier: '30_secondary',
    category: 'secondary'
  },
  {
    name: 'Charcoal Dark',
    role: 'Primary Typography & Structural Text (30% Rule)',
    hex: '#111827',
    rgb: 'RGB: 17, 24, 39',
    cmyk: 'CMYK: 56, 38, 0, 85',
    wcagContrast: '16.5:1 (AAA on Canvas)',
    description: 'High-contrast charcoal dark ensuring effortless readability for senior citizens and low-vision community members.',
    usage: '30% Supporting Structure: Primary body copy, article text, card headlines, line icons, and form labels.',
    ratioTier: '30_secondary',
    category: 'secondary'
  },
  {
    name: 'Linen Sand Inset',
    role: 'Tactile Inset & Filter Backdrops (30% Rule)',
    hex: '#EDE5D8',
    rgb: 'RGB: 237, 229, 216',
    cmyk: 'CMYK: 0, 3, 9, 7',
    wcagContrast: '13.4:1 (AAA vs Charcoal)',
    description: 'Tactile linen sand tone providing physical depth for debossed form wells, pressed filter chips, and drawer panels.',
    usage: '30% Supporting Structure: Inactive pill tabs, debossed form fields, drawer headers, card inset wells, and subtle panel dividers.',
    ratioTier: '30_secondary',
    category: 'secondary'
  },
  {
    name: 'Outline Slate',
    role: 'Structural Border Definition (30% Rule)',
    hex: '#CBD5E1',
    rgb: 'RGB: 203, 213, 225',
    cmyk: 'CMYK: 10, 5, 0, 12',
    wcagContrast: '7.1:1 (AAA Boundary Definition)',
    description: 'Explicit 1.5px structural border stroke aiding spatial orientation and card edge distinction for elderly neighbors.',
    usage: '30% Supporting Structure: 1.5px card borders, table dividers, input bounding boxes, and panel separators.',
    ratioTier: '30_secondary',
    category: 'secondary'
  }
];

// 10% Accent High-Impact Action Palette (Primary CTAs, Critical Upvotes & Reward Sparks)
const ACCENT_BRAND_COLORS: ColorToken[] = [
  {
    name: 'Action Amber',
    role: 'Primary Action CTA & Upvote Trigger (10% Rule)',
    hex: '#B45309',
    rgb: 'RGB: 180, 83, 9',
    cmyk: 'CMYK: 0, 54, 95, 29',
    wcagContrast: '7.2:1 (AAA on White)',
    description: 'High-energy terracotta amber strictly reserved for focal points to guide user attention directly to key civic actions.',
    usage: '10% High-Impact Accent: "Submit Report" CTA, "I See This Too" upvote trigger, urgent verification alerts, and +50 Karma reward sparks.',
    ratioTier: '10_accent',
    category: 'accent'
  },
  {
    name: 'Citron Spark',
    role: 'Dark Mode Accent & Dynamic Pulse (10% Rule)',
    hex: '#CCFF00',
    rgb: 'RGB: 204, 255, 0',
    cmyk: 'CMYK: 20, 0, 100, 0',
    wcagContrast: '15.1:1 (AAA on Navy #0A2540)',
    description: 'Electric lime citron spark providing unmistakable high-visibility contrast in dark mode and active real-time indicators.',
    usage: '10% High-Impact Accent: Dark mode active borders, live telemetry pulse dots, urgent alert highlights, and key brand accents.',
    ratioTier: '10_accent',
    category: 'accent'
  }
];

const LEGACY_CIVIC_COLORS: ColorToken[] = [
  {
    name: 'Linen Light Canvas',
    role: 'Soft App Background',
    hex: '#FAF6F0',
    rgb: 'RGB: 250, 246, 240',
    cmyk: 'CMYK: 0, 2, 4, 2',
    wcagContrast: '16.8:1 (AAA)',
    description: 'Natural light linen background canvas for comfortable, long-term browsing.',
    usage: 'Global background canvas, modal backdrop surfaces.',
    ratioTier: '60_primary',
    category: 'legacy'
  },
  {
    name: 'Outline Neutral',
    role: 'Structural Border Stroke',
    hex: '#E3DDD3',
    rgb: 'RGB: 227, 221, 211',
    cmyk: 'CMYK: 0, 3, 7, 11',
    wcagContrast: '7.1:1 (AAA)',
    description: 'Definitive border stroke for spatial orientation and senior accessible card definition.',
    usage: '1.5px card borders, table dividers, input outlines.',
    category: 'legacy'
  }
];

// Photography Style Specs (Page 15)
const PHOTOGRAPHY_MOODBOARD = [
  {
    id: 1,
    title: 'Community Tree Planting & Solar Grid',
    keywords: ['Candid', 'Natural Lighting', 'Expansive'],
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    caption: 'Neighbors installing community solar sensors and planting native trees under natural morning light.'
  },
  {
    id: 2,
    title: 'Green Tech Integration in Parks',
    keywords: ['Authentic Connection', 'Technology', 'Nature'],
    url: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80',
    caption: 'Public works engineer testing environmental monitoring devices in a restored urban wetland.'
  },
  {
    id: 3,
    title: 'Golden Hour Civic Leadership',
    keywords: ['Golden Hour', 'High-Contrast', 'Hopeful'],
    url: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80',
    caption: 'Ward team reviewing interactive map analytics outdoors during golden hour.'
  },
  {
    id: 4,
    title: 'Wind Energy & Clean Horizons',
    keywords: ['Expansive', 'Clean Tech', 'Authentic'],
    url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80',
    caption: 'Expansive horizons illustrating harmony between clean energy infrastructure and community parks.'
  }
];

// Photography DOs & DON'Ts
const PHOTO_DOS = [
  'Show real people interacting with nature and their local environment.',
  'Show technology integrated seamlessly into beautiful natural landscapes.',
  'Use natural light (golden hour and bright daylight work best).'
];

const PHOTO_DONTS = [
  'Use overly staged, artificial corporate stock photography.',
  'Use dark, moody, desaturated, or depressing filters.',
  'Show environmental pollution without clearly highlighting the solution.'
];

// Lexicon Matrix
const LEXICON_MATRIX = [
  { prohibited: 'Ticket / Incident', preferred: 'Report / Neighborhood Request', reason: '"Ticket" sounds bureaucratic; "Report" or "Request" sounds collaborative and constructive.' },
  { prohibited: 'User / Citizen ID', preferred: 'Neighbor / Resident / Community Member', reason: 'Emphasizes humanity, local belonging, and neighborhood solidarity.' },
  { prohibited: 'Complaint', preferred: 'Feedback / Priority Issue', reason: 'Reframes community input from negative complaining to proactive civic care.' },
  { prohibited: 'User Error', preferred: 'Let\'s Try Again / Missing Information', reason: 'Never blame the resident for UI or system input mistakes.' },
  { prohibited: 'Municipal Bureaucracy', preferred: 'City Team / Public Works Crew', reason: 'Personalizes municipal services with human faces and hard-working public servants.' },
  { prohibited: 'SLA Expiry', preferred: 'Expected Resolution Time', reason: 'Replaces internal staff jargon with clear, predictable public expectations.' }
];

export const BrandIdentitySystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ratio603010' | 'clay' | 'poster' | 'pages' | 'colors' | 'typography' | 'imagery' | 'logo' | 'voice'>('ratio603010');
  const [activePageNum, setActivePageNum] = useState<number>(11);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [logoVariant, setLogoVariant] = useState<'full' | 'dark' | 'mono' | 'outline'>('full');
  const [dialValue, setDialValue] = useState<number>(75);
  const [highlightedRatio, setHighlightedRatio] = useState<'all' | '60' | '30' | '10'>('all');

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(label);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-slate-100 pb-20 font-sans">
      {/* Brand Hero Header */}
      <div className="relative overflow-hidden bg-[#1A1A1A] text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-[#CCFF00] shadow-2xl">
        {/* Monoline Geometric Mesh Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="apex-leaf-mesh" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 40 10 C 20 25 20 55 40 70 C 60 55 60 25 40 10 Z" fill="none" stroke="#008080" strokeWidth="1.5" />
                <line x1="40" y1="10" x2="40" y2="70" stroke="#CCFF00" strokeWidth="1" strokeDasharray="2 2" />
                <circle cx="40" cy="40" r="3" fill="#CCFF00" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#apex-leaf-mesh)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-[#008080] text-[#CCFF00] border border-[#CCFF00]/40 shadow-sm">
              <Leaf className="w-4 h-4" />
              <span>Official Brand Style Manual • Section 4 & 5</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-['Montserrat']">
              CITYSCAPE <span className="text-[#CCFF00]">BRAND GUIDE</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              Our colors define our energy. Inspired by the nature we protect and the technology we create. Montserrat Typeface & Apex Leaf Monoline Design System.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const brandTokens = {
                  primary: PRIMARY_BRAND_COLORS,
                  secondary: SECONDARY_BRAND_COLORS,
                  typeface: 'Montserrat',
                  hierarchy: { H1: '32pt Montserrat Bold', H2: '24pt Montserrat Semibold', Body: '12pt/16pt Montserrat Regular' }
                };
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(brandTokens, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", "cityscape-brand-guidelines.json");
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
              }}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white font-extrabold text-xs tracking-wide transition-all shadow-md cursor-pointer border border-[#CCFF00]/30"
            >
              <Download className="w-4 h-4 text-[#CCFF00]" />
              <span>Export Design Tokens (JSON)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Tab Navigation */}
      <div className="sticky top-16 z-20 bg-white dark:bg-[#1A1A1A] border-b-2 border-slate-300 dark:border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 xs:grid-cols-5 lg:grid-cols-9 gap-1.5 sm:gap-2 py-3 text-xs font-bold w-full">
            <button
              onClick={() => setActiveTab('ratio603010')}
              className={`flex items-center justify-center space-x-1.5 px-2 py-2.5 rounded-xl transition-all cursor-pointer text-center font-['Montserrat'] min-h-[44px] w-full ${
                activeTab === 'ratio603010'
                  ? 'bg-gradient-to-r from-[#0A2540] via-[#006D5B] to-[#B45309] text-white shadow-lg font-black ring-2 ring-[#CCFF00]'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <PieChart className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
              <span className="truncate">60-30-10 Rule</span>
            </button>

            <button
              onClick={() => setActiveTab('clay')}
              className={`flex items-center justify-center space-x-1.5 px-2 py-2.5 rounded-xl transition-all cursor-pointer text-center font-['Montserrat'] min-h-[44px] w-full ${
                activeTab === 'clay'
                  ? 'bg-gradient-to-r from-[#8EE0C5] to-[#F5D0C0] text-[#063B2F] shadow-lg font-black border-2 border-[#7CD6B8]'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#063B2F] shrink-0" />
              <span className="truncate">Clay Kit</span>
            </button>

            <button
              onClick={() => setActiveTab('pages')}
              className={`flex items-center justify-center space-x-1.5 px-2 py-2.5 rounded-xl transition-all cursor-pointer text-center font-['Montserrat'] min-h-[44px] w-full ${
                activeTab === 'pages'
                  ? 'bg-[#008080] text-white shadow-md font-black ring-2 ring-[#CCFF00]'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
              <span className="truncate">Brand Book</span>
            </button>

            <button
              onClick={() => setActiveTab('colors')}
              className={`flex items-center justify-center space-x-1.5 px-2 py-2.5 rounded-xl transition-all cursor-pointer text-center font-['Montserrat'] min-h-[44px] w-full ${
                activeTab === 'colors'
                  ? 'bg-[#008080] text-white shadow-md font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
              <span className="truncate">Palettes</span>
            </button>

            <button
              onClick={() => setActiveTab('typography')}
              className={`flex items-center justify-center space-x-1.5 px-2 py-2.5 rounded-xl transition-all cursor-pointer text-center font-['Montserrat'] min-h-[44px] w-full ${
                activeTab === 'typography'
                  ? 'bg-[#008080] text-white shadow-md font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <Type className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
              <span className="truncate">Typography</span>
            </button>

            <button
              onClick={() => setActiveTab('imagery')}
              className={`flex items-center justify-center space-x-1.5 px-2 py-2.5 rounded-xl transition-all cursor-pointer text-center font-['Montserrat'] min-h-[44px] w-full ${
                activeTab === 'imagery'
                  ? 'bg-[#008080] text-white shadow-md font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
              <span className="truncate">Imagery</span>
            </button>

            <button
              onClick={() => setActiveTab('poster')}
              className={`flex items-center justify-center space-x-1.5 px-2 py-2.5 rounded-xl transition-all cursor-pointer text-center font-['Montserrat'] min-h-[44px] w-full ${
                activeTab === 'poster'
                  ? 'bg-[#008080] text-white shadow-md font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Presentation</span>
            </button>

            <button
              onClick={() => setActiveTab('logo')}
              className={`flex items-center justify-center space-x-1.5 px-2 py-2.5 rounded-xl transition-all cursor-pointer text-center font-['Montserrat'] min-h-[44px] w-full ${
                activeTab === 'logo'
                  ? 'bg-[#008080] text-white shadow-md font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
              <span className="truncate">Logo Mark</span>
            </button>

            <button
              onClick={() => setActiveTab('voice')}
              className={`flex items-center justify-center space-x-1.5 px-2 py-2.5 rounded-xl transition-all cursor-pointer text-center font-['Montserrat'] min-h-[44px] w-full ${
                activeTab === 'voice'
                  ? 'bg-[#008080] text-white shadow-md font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
              <span className="truncate">Lexicon</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">

        {/* ========================================================= */}
        {/* TAB 0: 60-30-10 BRAND COLOR RULE ARCHITECTURE ENGINE */}
        {/* ========================================================= */}
        {activeTab === 'ratio603010' && (
          <div className="space-y-10 animate-fadeIn">
            {/* Executive Hero Banner */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border-2 border-slate-300 dark:border-slate-800 shadow-xl space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-[#0A2540] text-[#CCFF00] border border-[#CCFF00]/40">
                    <PieChart className="w-3.5 h-3.5" />
                    <span>Visual Balance Architecture • Golden Ratio System</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black font-['Montserrat'] text-[#0A2540] dark:text-white mt-2">
                    The 60 : 30 : 10 Brand Color Rule
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl mt-1 leading-relaxed">
                    Designed for multi-generational legibility and senior accessibility (WCAG AAA). 
                    The 60-30-10 distribution ensures calm visual harmony, prevents sensory overload, and channels community attention strictly toward key civic actions.
                  </p>
                </div>

                {/* Quick Proportion Badges */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setHighlightedRatio('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold font-mono transition-all cursor-pointer ${
                      highlightedRatio === 'all'
                        ? 'bg-[#0A2540] text-white shadow-md ring-2 ring-[#CCFF00]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    View All
                  </button>
                  <button
                    onClick={() => setHighlightedRatio('60')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold font-mono transition-all cursor-pointer ${
                      highlightedRatio === '60'
                        ? 'bg-[#0A2540] text-[#CCFF00] shadow-md ring-2 ring-[#0A2540]'
                        : 'bg-[#FAF6F0] text-[#0A2540] border border-[#E3DDD3]'
                    }`}
                  >
                    60% Primary
                  </button>
                  <button
                    onClick={() => setHighlightedRatio('30')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold font-mono transition-all cursor-pointer ${
                      highlightedRatio === '30'
                        ? 'bg-[#006D5B] text-white shadow-md ring-2 ring-[#006D5B]'
                        : 'bg-[#E6F4F1] text-[#006D5B] border border-[#006D5B]/30'
                    }`}
                  >
                    30% Secondary
                  </button>
                  <button
                    onClick={() => setHighlightedRatio('10')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold font-mono transition-all cursor-pointer ${
                      highlightedRatio === '10'
                        ? 'bg-[#B45309] text-white shadow-md ring-2 ring-[#B45309]'
                        : 'bg-[#FEF3C7] text-[#B45309] border border-[#B45309]/30'
                    }`}
                  >
                    10% Accent
                  </button>
                </div>
              </div>

              {/* 60-30-10 Visual Proportion Scale Bar */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono font-black text-slate-700 dark:text-slate-300">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#0A2540] inline-block border border-white" />
                    <span>60% Primary Dominant Canvas & Foundation</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#006D5B] inline-block" />
                    <span>30% Secondary Supporting Structure</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#B45309] inline-block" />
                    <span>10% Accent High-Impact Action</span>
                  </span>
                </div>

                {/* High-Impact Segmented Bar */}
                <div className="w-full h-14 rounded-2xl overflow-hidden shadow-inner border-2 border-slate-300 dark:border-slate-700 flex text-white text-xs font-black font-['Montserrat']">
                  {/* 60% Segment */}
                  <div
                    onClick={() => setHighlightedRatio('60')}
                    className="w-[60%] bg-[#0A2540] hover:bg-[#081e33] transition-all p-3 flex flex-col justify-center cursor-pointer border-r-2 border-white/20 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black tracking-wide text-white">60% PRIMARY BASE</span>
                      <span className="text-[10px] font-mono text-[#CCFF00] bg-black/40 px-2 py-0.5 rounded">Canvas & Structure</span>
                    </div>
                    <span className="text-[11px] text-slate-300 font-normal truncate">Civic Navy • Warm Linen Canvas • Pure White Surface</span>
                  </div>

                  {/* 30% Segment */}
                  <div
                    onClick={() => setHighlightedRatio('30')}
                    className="w-[30%] bg-[#006D5B] hover:bg-[#005a4b] transition-all p-3 flex flex-col justify-center cursor-pointer border-r-2 border-white/20 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black tracking-wide text-white">30% SECONDARY</span>
                      <span className="text-[10px] font-mono text-teal-100 bg-black/40 px-2 py-0.5 rounded">Support & Contrast</span>
                    </div>
                    <span className="text-[11px] text-teal-100 font-normal truncate">Warm Sage Teal • Charcoal Dark • Linen Sand</span>
                  </div>

                  {/* 10% Segment */}
                  <div
                    onClick={() => setHighlightedRatio('10')}
                    className="w-[10%] bg-[#B45309] hover:bg-[#964507] transition-all p-2 flex flex-col items-center justify-center cursor-pointer relative group text-center"
                  >
                    <span className="text-xs font-black tracking-wide text-white">10%</span>
                    <span className="text-[9px] font-mono text-amber-200">ACTION</span>
                  </div>
                </div>
              </div>

              {/* Interactive Live Component Simulator */}
              <div className="bg-[#FAF6F0] dark:bg-slate-950 p-6 sm:p-8 rounded-2xl border-1.5 border-[#E3DDD3] dark:border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3DDD3] dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-xl font-black font-['Montserrat'] text-[#0A2540] dark:text-white flex items-center space-x-2">
                      <Layers className="w-5 h-5 text-[#006D5B]" />
                      <span>Live Civic Component 60-30-10 Breakdown</span>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Hover and inspect each layer to observe how the 60-30-10 distribution is applied to real neighborhood cards.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#006D5B] bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-[#E3DDD3] dark:border-slate-800">
                    WCAG AAA Certified (7.8:1)
                  </span>
                </div>

                {/* Simulated Real Civic Report Card */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* The Simulated Card */}
                  <div className="lg:col-span-7">
                    <div className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border-1.5 transition-all shadow-lg space-y-5 relative ${
                      highlightedRatio === '60' ? 'ring-4 ring-[#0A2540] scale-[1.01]' : 'border-[#CBD5E1] dark:border-slate-800'
                    }`}>
                      {/* 60% Indicator Badge */}
                      {highlightedRatio === '60' && (
                        <div className="absolute -top-3 left-6 bg-[#0A2540] text-[#CCFF00] text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full shadow-md">
                          [60% DOMINANT SURFACE & CONTAINER]
                        </div>
                      )}

                      {/* Header Row: 30% Supporting Badges */}
                      <div className="flex items-center justify-between">
                        <div className={`flex items-center space-x-2 ${highlightedRatio === '30' ? 'ring-2 ring-[#006D5B] p-1 rounded-lg bg-[#E6F4F1]' : ''}`}>
                          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#006D5B] text-white flex items-center space-x-1.5 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                            <span>WARD 4 • PUBLIC WORKS</span>
                          </span>
                          <span className="text-xs font-mono font-bold text-[#475569] dark:text-slate-400">
                            Report #8402
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-500">
                          2 hours ago
                        </span>
                      </div>

                      {/* Title & Body: 30% Supporting Typography */}
                      <div className="space-y-2">
                        <h4 className={`text-xl font-black font-['Montserrat'] text-[#111827] dark:text-white leading-snug ${
                          highlightedRatio === '30' ? 'bg-[#EDE5D8] dark:bg-slate-800 px-2 py-1 rounded' : ''
                        }`}>
                          Main Street Water Pipe Repair Scheduled
                        </h4>
                        <p className="text-sm text-[#475569] dark:text-slate-300 leading-relaxed">
                          Our public works crew has inspected the minor pressure loss on 4th & Main. Repair is scheduled for completion by Thursday morning.
                        </p>
                      </div>

                      {/* Inset Well: 30% Supporting Linen Sand */}
                      <div className={`p-4 rounded-xl bg-[#EDE5D8] dark:bg-slate-800/80 border border-[#E3DDD3] dark:border-slate-700 flex items-center justify-between text-xs ${
                        highlightedRatio === '30' ? 'ring-2 ring-[#006D5B]' : ''
                      }`}>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-[#006D5B]" />
                          <span className="font-extrabold text-[#111827] dark:text-white font-['Montserrat']">
                            Crew Assigned: North Sector Team B
                          </span>
                        </div>
                        <span className="font-mono font-bold text-[#006D5B] dark:text-teal-300">
                          Expected: 36 hrs
                        </span>
                      </div>

                      {/* Footer Actions: 10% High-Impact Accent CTAs */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {}}
                            className={`px-4 py-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-black font-['Montserrat'] flex items-center space-x-2 shadow-md transition-transform active:scale-95 cursor-pointer ${
                              highlightedRatio === '10' ? 'ring-4 ring-amber-400 scale-105' : ''
                            }`}
                          >
                            <Heart className="w-4 h-4 fill-white" />
                            <span>I See This Too (142)</span>
                          </button>
                        </div>

                        <span className="text-xs font-mono font-bold text-[#B45309] bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
                          <span>+50 Civic Karma</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Allocation Breakdown Explanations */}
                  <div className="lg:col-span-5 space-y-4 text-xs font-['Montserrat']">
                    {/* 60% Card */}
                    <div
                      onClick={() => setHighlightedRatio('60')}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        highlightedRatio === '60'
                          ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-md'
                          : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-[#0A2540]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-sm uppercase">60% Primary Foundation</span>
                        <span className="font-mono text-[11px] font-bold text-[#CCFF00]">Canvas & Shell</span>
                      </div>
                      <p className="text-[11px] opacity-90 leading-relaxed">
                        Pure White card surface (`#FFFFFF`), Warm Linen background (`#FAF6F0`), and Civic Navy header (`#0A2540`). Provides glare-free visual calm and generous negative space.
                      </p>
                    </div>

                    {/* 30% Card */}
                    <div
                      onClick={() => setHighlightedRatio('30')}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        highlightedRatio === '30'
                          ? 'bg-[#006D5B] text-white border-[#006D5B] shadow-md'
                          : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-[#006D5B]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-sm uppercase">30% Secondary Harmony</span>
                        <span className="font-mono text-[11px] font-bold text-teal-200">Typography & Badges</span>
                      </div>
                      <p className="text-[11px] opacity-90 leading-relaxed">
                        Warm Sage Teal (`#006D5B`) for ward badges, Charcoal Dark (`#111827`) for high-contrast headlines, Linen Sand (`#EDE5D8`) for insets, and Outline Slate (`#CBD5E1`) for 1.5px borders.
                      </p>
                    </div>

                    {/* 10% Card */}
                    <div
                      onClick={() => setHighlightedRatio('10')}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        highlightedRatio === '10'
                          ? 'bg-[#B45309] text-white border-[#B45309] shadow-md'
                          : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-[#B45309]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-sm uppercase">10% Accent Action</span>
                        <span className="font-mono text-[11px] font-bold text-amber-200">Primary CTAs</span>
                      </div>
                      <p className="text-[11px] opacity-90 leading-relaxed">
                        Action Amber (`#B45309`) strictly reserved for "I See This Too" upvote trigger, "Submit Request" buttons, and Civic Karma reward points. Prevents sensory fatigue.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* The 3 Deep-Dive Color Swatch Sections */}
              <div className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                {/* 1. Primary 60% Swatches */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-black font-['Montserrat'] text-[#0A2540] dark:text-white flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#0A2540] text-white text-xs font-mono font-black">60%</span>
                      <span>Primary Dominant Base Tokens (4 Swatches)</span>
                    </h3>
                    <span className="text-xs font-mono font-bold text-slate-500">Atmosphere, Background & Structural Shells</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {PRIMARY_BRAND_COLORS.map(color => (
                      <div key={color.name} className="bg-[#FAF6F0] dark:bg-slate-950 rounded-2xl border-1.5 border-[#E3DDD3] dark:border-slate-800 p-4 space-y-3 shadow-sm hover:shadow-md transition-all">
                        <div
                          className="h-28 rounded-xl border border-[#E3DDD3] p-3 flex flex-col justify-between shadow-inner relative"
                          style={{ backgroundColor: color.hex }}
                        >
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded self-start ${
                            color.hex === '#FFFFFF' || color.hex === '#FAF6F0' ? 'bg-[#0A2540] text-white' : 'bg-black/40 text-white'
                          }`}>
                            60% Primary
                          </span>
                          <div className="flex items-center justify-between">
                            <span className={`font-black text-sm font-['Montserrat'] ${
                              color.hex === '#FFFFFF' || color.hex === '#FAF6F0' ? 'text-[#0A2540]' : 'text-white'
                            }`}>
                              {color.name}
                            </span>
                            <button
                              onClick={() => handleCopy(color.hex, color.name)}
                              className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                                color.hex === '#FFFFFF' || color.hex === '#FAF6F0' ? 'bg-slate-200 text-slate-800' : 'bg-black/30 text-white'
                              }`}
                            >
                              {copiedToken === color.name ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1 text-xs font-mono">
                          <div className="flex justify-between"><span className="text-slate-500">HEX:</span><span className="font-bold text-[#0A2540] dark:text-white">{color.hex}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">CONTRAST:</span><span className="font-bold text-[#006D5B]">{color.wcagContrast}</span></div>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium line-clamp-2">
                          {color.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Secondary 30% Swatches */}
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-black font-['Montserrat'] text-[#006D5B] dark:text-teal-300 flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#006D5B] text-white text-xs font-mono font-black">30%</span>
                      <span>Secondary Supporting Structure Tokens (4 Swatches)</span>
                    </h3>
                    <span className="text-xs font-mono font-bold text-slate-500">Typography, Navigation & Badges</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {SECONDARY_BRAND_COLORS.map(color => (
                      <div key={color.name} className="bg-[#FAF6F0] dark:bg-slate-950 rounded-2xl border-1.5 border-[#E3DDD3] dark:border-slate-800 p-4 space-y-3 shadow-sm hover:shadow-md transition-all">
                        <div
                          className="h-28 rounded-xl border border-[#E3DDD3] p-3 flex flex-col justify-between shadow-inner relative"
                          style={{ backgroundColor: color.hex }}
                        >
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded self-start ${
                            color.hex === '#EDE5D8' || color.hex === '#CBD5E1' ? 'bg-[#0A2540] text-white' : 'bg-black/40 text-white'
                          }`}>
                            30% Secondary
                          </span>
                          <div className="flex items-center justify-between">
                            <span className={`font-black text-sm font-['Montserrat'] ${
                              color.hex === '#EDE5D8' || color.hex === '#CBD5E1' ? 'text-[#0A2540]' : 'text-white'
                            }`}>
                              {color.name}
                            </span>
                            <button
                              onClick={() => handleCopy(color.hex, color.name)}
                              className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                                color.hex === '#EDE5D8' || color.hex === '#CBD5E1' ? 'bg-slate-200 text-slate-800' : 'bg-black/30 text-white'
                              }`}
                            >
                              {copiedToken === color.name ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1 text-xs font-mono">
                          <div className="flex justify-between"><span className="text-slate-500">HEX:</span><span className="font-bold text-[#006D5B] dark:text-teal-300">{color.hex}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">CONTRAST:</span><span className="font-bold text-[#006D5B]">{color.wcagContrast}</span></div>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium line-clamp-2">
                          {color.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Accent 10% Swatches */}
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-black font-['Montserrat'] text-[#B45309] dark:text-amber-400 flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#B45309] text-white text-xs font-mono font-black">10%</span>
                      <span>Accent High-Impact Action Tokens (2 Swatches)</span>
                    </h3>
                    <span className="text-xs font-mono font-bold text-slate-500">Primary Actions, Upvotes & Rewards</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ACCENT_BRAND_COLORS.map(color => (
                      <div key={color.name} className="bg-[#FAF6F0] dark:bg-slate-950 rounded-2xl border-1.5 border-[#E3DDD3] dark:border-slate-800 p-4 space-y-3 shadow-sm hover:shadow-md transition-all">
                        <div
                          className="h-28 rounded-xl border border-[#E3DDD3] p-3 flex flex-col justify-between shadow-inner relative"
                          style={{ backgroundColor: color.hex }}
                        >
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded self-start ${
                            color.hex === '#CCFF00' ? 'bg-[#0A2540] text-[#CCFF00]' : 'bg-black/40 text-white'
                          }`}>
                            10% High-Impact Accent
                          </span>
                          <div className="flex items-center justify-between">
                            <span className={`font-black text-sm font-['Montserrat'] ${
                              color.hex === '#CCFF00' ? 'text-[#0A2540]' : 'text-white'
                            }`}>
                              {color.name}
                            </span>
                            <button
                              onClick={() => handleCopy(color.hex, color.name)}
                              className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                                color.hex === '#CCFF00' ? 'bg-slate-200 text-slate-800' : 'bg-black/30 text-white'
                              }`}
                            >
                              {copiedToken === color.name ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1 text-xs font-mono">
                          <div className="flex justify-between"><span className="text-slate-500">HEX:</span><span className="font-bold text-[#B45309] dark:text-amber-400">{color.hex}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">CONTRAST:</span><span className="font-bold text-[#006D5B]">{color.wcagContrast}</span></div>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                          {color.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Design Rule Mandates for Engineers & Brand Guardians */}
              <div className="bg-[#0A2540] text-white p-6 sm:p-8 rounded-2xl border-2 border-[#CCFF00]/40 space-y-4">
                <div className="flex items-center space-x-2 text-[#CCFF00]">
                  <CheckCircle2 className="w-5 h-5" />
                  <h4 className="text-lg font-black font-['Montserrat']">
                    The 60-30-10 Implementation Mandates
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-['Montserrat'] text-slate-200">
                  <div className="p-4 rounded-xl bg-white/10 space-y-1.5 border border-white/10">
                    <span className="font-black text-[#CCFF00] block text-sm">60% Rule: Serene Canvas</span>
                    <p className="leading-relaxed">
                      Dominant surfaces (`#FAF6F0` / `#FFFFFF` / `#0A2540`) must never compete for attention. They establish spacious, glare-free readability for elderly neighbors.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 space-y-1.5 border border-white/10">
                    <span className="font-black text-teal-300 block text-sm">30% Rule: Clear Structure</span>
                    <p className="leading-relaxed">
                      Secondary tones (`#006D5B` / `#111827` / `#EDE5D8`) provide sharp hierarchy, readable typography, and tactile 1.5px borders aiding spatial vision.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 space-y-1.5 border border-white/10">
                    <span className="font-black text-amber-400 block text-sm">10% Rule: Strict Focal CTAs</span>
                    <p className="leading-relaxed">
                      Accent Amber (`#B45309`) is strictly limited to intentional actions. Never used for large container fills to prevent visual clutter and eye fatigue.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: SOFT SCULPTURAL CLAYMORPHIC DESIGN KIT */}
        {/* ========================================================= */}
        {activeTab === 'clay' && (
          <div className="space-y-10 animate-fadeIn">
            {/* Design Kit Overview Banner */}
            <div className="clay-surface-cream p-8 sm:p-12 relative overflow-hidden border-2 border-[#E4DACB]">
              <div className="max-w-3xl space-y-4 relative z-10">
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#A3E8D5] text-[#063B2F] font-black text-xs border border-[#7CD6B8]">
                  <Sparkles className="w-4 h-4 text-[#063B2F]" />
                  <span>Soft Sculptural Claymorphic UI System</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black font-['Montserrat'] text-[#2C2518]">
                  Organic Clay & Pastel UI Design Kit
                </h2>
                <p className="text-sm sm:text-base text-[#524633] font-medium leading-relaxed">
                  Inspired by soft tactile clay sculptures, biophilic organic curves, and soothing pastel tones. Features dual-directional ambient drop shadows, soft top-left light highlights, concentric ring dials, inset debossed wells, and smooth pill controls.
                </p>
              </div>

              {/* Decorative Clay Rings Background */}
              <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none hidden sm:block">
                <div className="w-80 h-80 rounded-full border-[18px] border-[#A3D5E0] flex items-center justify-center">
                  <div className="w-56 h-56 rounded-full border-[14px] border-[#F5D0C0] flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-[#A3E8D5]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Clay Color Palette Swatches */}
            <div className="space-y-4">
              <h3 className="text-xl font-black font-['Montserrat'] text-[#0F172A] dark:text-white flex items-center space-x-2">
                <Palette className="w-5 h-5 text-[#006D5B]" />
                <span>Tactile Pastel Color Palette</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Soft Mint */}
                <div className="clay-surface-mint p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-[#063B2F] bg-white/60 px-2.5 py-1 rounded-full">
                      Primary Mint
                    </span>
                    <button
                      onClick={() => handleCopy('#A3E8D5', 'Soft Mint')}
                      className="p-1.5 bg-white/40 hover:bg-white/80 rounded-full text-[#063B2F] transition-all cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-2xl font-black font-['Montserrat']">Soft Mint</h4>
                  <p className="text-xs font-mono font-bold">#A3E8D5 • 7.4:1 WCAG AAA</p>
                  <p className="text-xs opacity-90 leading-relaxed font-medium">
                    Primary action surfaces, active toggle states, and soft community highlights.
                  </p>
                </div>

                {/* Warm Pastel Peach */}
                <div className="clay-surface-peach p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-[#5C2718] bg-white/60 px-2.5 py-1 rounded-full">
                      Warm Clay
                    </span>
                    <button
                      onClick={() => handleCopy('#F5D0C0', 'Pastel Peach')}
                      className="p-1.5 bg-white/40 hover:bg-white/80 rounded-full text-[#5C2718] transition-all cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-2xl font-black font-['Montserrat']">Pastel Peach</h4>
                  <p className="text-xs font-mono font-bold">#F5D0C0 • Warm Accent</p>
                  <p className="text-xs opacity-90 leading-relaxed font-medium">
                    Tactile secondary buttons, badge indicators, and warm organic card overlays.
                  </p>
                </div>

                {/* Powder Sky Blue */}
                <div className="clay-surface-blue p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-[#093C47] bg-white/60 px-2.5 py-1 rounded-full">
                      Sky Powder
                    </span>
                    <button
                      onClick={() => handleCopy('#A3D5E0', 'Powder Sky')}
                      className="p-1.5 bg-white/40 hover:bg-white/80 rounded-full text-[#093C47] transition-all cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-2xl font-black font-['Montserrat']">Powder Sky</h4>
                  <p className="text-xs font-mono font-bold">#A3D5E0 • Calm Surface</p>
                  <p className="text-xs opacity-90 leading-relaxed font-medium">
                    Rotatable ring dials, environmental cards, and peaceful status indicators.
                  </p>
                </div>

                {/* Soft Cream Alabaster */}
                <div className="clay-surface-cream p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-[#2C2518] bg-white/60 px-2.5 py-1 rounded-full">
                      Warm Alabaster
                    </span>
                    <button
                      onClick={() => handleCopy('#F7F3EB', 'Soft Cream')}
                      className="p-1.5 bg-white/40 hover:bg-white/80 rounded-full text-[#2C2518] transition-all cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-2xl font-black font-['Montserrat']">Soft Cream</h4>
                  <p className="text-xs font-mono font-bold">#F7F3EB • Neutral Surface</p>
                  <p className="text-xs opacity-90 leading-relaxed font-medium">
                    Gently tinted background canvas for glare-free readability across all screens.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Clay Widgets & Dials Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Concentric Dial & Knob Widget */}
              <div className="clay-card-lvl3 p-8 space-y-6 flex flex-col items-center justify-center text-center">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-extrabold text-[#006D5B] uppercase tracking-wider">
                    Tactile Concentric Ring Control
                  </span>
                  <h4 className="text-xl font-black font-['Montserrat'] text-[#0F172A] dark:text-white">
                    Interactive Clay Dial
                  </h4>
                </div>

                {/* Layered Concentric Rings */}
                <div className="relative w-48 h-48 flex items-center justify-center my-2">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#A3D5E0] to-[#73BCCB] shadow-xl p-4 flex items-center justify-center">
                    <div className="w-36 h-36 rounded-full bg-[#F7F3EB] shadow-inner p-3 flex items-center justify-center">
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#F5D0C0] to-[#E8B29C] shadow-md flex items-center justify-center">
                        <div
                          className="w-20 h-20 clay-dial-ring cursor-pointer transition-transform duration-200"
                          style={{ transform: `rotate(${dialValue * 3.6}deg)` }}
                          onClick={() => setDialValue((prev) => (prev >= 100 ? 10 : prev + 15))}
                        >
                          <div className="w-4 h-4 rounded-full bg-[#063B2F] shadow-sm -mt-10" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 w-full max-w-xs">
                  <div className="flex justify-between text-xs font-extrabold font-mono text-slate-600">
                    <span>MIN: 0%</span>
                    <span className="text-[#006D5B] font-black">{dialValue}% LEVEL</span>
                    <span>MAX: 100%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={dialValue}
                    onChange={(e) => setDialValue(Number(e.target.value))}
                    className="w-full accent-[#006D5B] cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500 font-medium">
                    Tap dial or drag slider to simulate rotatable tactile hardware controls.
                  </p>
                </div>
              </div>

              {/* Raised 3D Pill Controls & Debossed Inputs */}
              <div className="clay-card-lvl3 p-8 space-y-6">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-extrabold text-[#006D5B] uppercase tracking-wider">
                    3D Tactile Form & Action Controls
                  </span>
                  <h4 className="text-xl font-black font-['Montserrat'] text-[#0F172A] dark:text-white">
                    Buttons, Debossed Inputs & Chips
                  </h4>
                </div>

                {/* Soft Action Buttons */}
                <div className="space-y-3">
                  <label className="text-xs font-extrabold text-slate-600 uppercase font-mono">
                    Raised 3D Pill Buttons
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <button className="clay-btn-primary px-6 py-3 text-xs font-black cursor-pointer flex items-center space-x-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Primary Mint Action</span>
                    </button>
                    <button className="clay-surface-peach px-6 py-3 text-xs font-black cursor-pointer flex items-center space-x-2 shadow-md hover:scale-105 transition-all">
                      <Heart className="w-4 h-4 text-[#5C2718]" />
                      <span>Peach Community</span>
                    </button>
                    <button className="clay-surface-blue px-6 py-3 text-xs font-black cursor-pointer flex items-center space-x-2 shadow-md hover:scale-105 transition-all">
                      <Compass className="w-4 h-4 text-[#093C47]" />
                      <span>Sky Explorer</span>
                    </button>
                  </div>
                </div>

                {/* Inset Debossed Input */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-600 uppercase font-mono">
                    Debossed Soft Clay Input
                  </label>
                  <input
                    type="text"
                    placeholder="Search community reports or ward assets..."
                    className="w-full px-5 py-3.5 clay-input text-xs font-bold text-[#0F172A] outline-none"
                  />
                </div>

                {/* Clay Pill Chips */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-600 uppercase font-mono">
                    Rounded Soft Badges & Chips
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <span className="clay-surface-mint px-3.5 py-1.5 text-xs font-extrabold">
                      ✓ Active Status
                    </span>
                    <span className="clay-surface-peach px-3.5 py-1.5 text-xs font-extrabold">
                      ★ Featured Priority
                    </span>
                    <span className="clay-surface-blue px-3.5 py-1.5 text-xs font-extrabold">
                      ● Public Works
                    </span>
                    <span className="clay-surface-cream px-3.5 py-1.5 text-xs font-extrabold border border-[#E4DACB]">
                      Ward 4 WardRep
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5 Levels of Claymorphic Elevation */}
            <div className="space-y-4">
              <h3 className="text-xl font-black font-['Montserrat'] text-[#0F172A] dark:text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-[#006D5B]" />
                <span>5-Level Sculptural Clay Elevation Architecture</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="clay-card-lvl1 p-5 space-y-2 text-center">
                  <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase">LEVEL 1</span>
                  <h4 className="font-extrabold text-xs text-[#0F172A]">Subtle Surface</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">Base card for secondary list items.</p>
                </div>

                <div className="clay-card-lvl2 p-5 space-y-2 text-center">
                  <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase">LEVEL 2</span>
                  <h4 className="font-extrabold text-xs text-[#0F172A]">Standard Clay</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">Default card for neighborhood feeds.</p>
                </div>

                <div className="clay-card-lvl3 p-5 space-y-2 text-center">
                  <span className="text-[10px] font-mono font-extrabold text-[#006D5B] uppercase">LEVEL 3</span>
                  <h4 className="font-extrabold text-xs text-[#0F172A]">Raised Tactile</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">Click below for full expandable audit logs.</p>
                </div>

                <div className="clay-card-lvl4 p-5 space-y-2 text-center">
                  <span className="text-[10px] font-mono font-extrabold text-amber-600 uppercase">LEVEL 4</span>
                  <h4 className="font-extrabold text-xs text-[#0F172A]">Deep Sculpted</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">Featured bulletin cards & modals.</p>
                </div>

                <div className="clay-card-lvl5 p-5 space-y-2 text-center">
                  <span className="text-[10px] font-mono font-extrabold text-emerald-700 uppercase">LEVEL 5</span>
                  <h4 className="font-extrabold text-xs text-[#0F172A]">Floating Clay</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">Overlay dialogs & high priority alerts.</p>
                </div>
              </div>

              {/* Interactive Level 3 Expandable Card Demo */}
              <div className="pt-2">
                <ExpandableClayCard
                  title="Ward 4 Main Street Asphalt Repair Work Order"
                  subtitle="Click anywhere on this Level 3 Claymorphic card to toggle the extra section containing detailed timestamps, internal municipal tags, and history logs."
                  categoryTag="PUBLIC WORKS"
                  statusBadge="DISPATCHED"
                  reportId="MUNI-4091"
                  defaultExpanded={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: PAGE-BY-PAGE BRAND MANUAL VIEWER (PAGES 11 TO 16) */}
        {/* ========================================================= */}
        {activeTab === 'pages' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Pagination Controls */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border-2 border-slate-300 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-extrabold text-[#008080] dark:text-[#CCFF00] uppercase tracking-wider">
                  Official Brand Guide Book • Pages 11 – 16
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-['Montserrat'] text-[#1A1A1A] dark:text-white">
                  Page {activePageNum}: {
                    activePageNum === 11 ? 'PRIMARY COLOR PALETTE' :
                    activePageNum === 12 ? 'SECONDARY COLOR PALETTE' :
                    activePageNum === 13 ? 'TYPOGRAPHY: PRIMARY FONT' :
                    activePageNum === 14 ? 'TYPOGRAPHY: HIERARCHY' :
                    activePageNum === 15 ? 'PHOTOGRAPHY STYLE' : 'ICONOGRAPHY SYSTEM'
                  }
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                {[11, 12, 13, 14, 15, 16].map(pgNum => (
                  <button
                    key={pgNum}
                    onClick={() => setActivePageNum(pgNum)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer font-['Montserrat'] ${
                      activePageNum === pgNum
                        ? 'bg-[#008080] text-[#CCFF00] shadow-md ring-2 ring-[#CCFF00]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    Pg {pgNum}
                  </button>
                ))}
              </div>
            </div>

            {/* Individual Page Spec Renderer */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-12 border-2 border-slate-300 dark:border-slate-800 shadow-2xl relative overflow-hidden min-h-[500px]">

              {/* ---------------- PAGE 11: PRIMARY COLOR PALETTE ---------------- */}
              {activePageNum === 11 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="border-b-2 border-slate-200 dark:border-slate-800 pb-6 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-extrabold text-slate-400 uppercase">PAGE 11</span>
                      <h2 className="text-3xl font-black font-['Montserrat'] text-[#1A1A1A] dark:text-white mt-1">
                        PRIMARY COLOR PALETTE
                      </h2>
                    </div>
                    <span className="text-xs font-bold bg-[#008080]/10 text-[#008080] dark:text-[#CCFF00] px-3 py-1.5 rounded-lg border border-[#008080]/20 font-mono">
                      Design Placement: Large Swatches with Technical Codes
                    </span>
                  </div>

                  <p className="text-base font-medium text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed">
                    Our colors define our energy. Our primary colors are inspired by the nature we protect and the technology we create.
                  </p>

                  {/* Large Swatches Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                    {PRIMARY_BRAND_COLORS.map(color => (
                      <div
                        key={color.name}
                        className="bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-lg overflow-hidden flex flex-col justify-between"
                      >
                        {/* Swatch Head */}
                        <div className="h-44 p-6 flex flex-col justify-between shadow-inner relative" style={{ backgroundColor: color.hex }}>
                          <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-md self-start ${
                            color.hex === '#CCFF00' ? 'bg-[#1A1A1A] text-[#CCFF00]' : 'bg-black/40 text-white'
                          }`}>
                            {color.role}
                          </span>
                          <div className="flex items-center justify-between">
                            <h3 className={`font-black text-xl font-['Montserrat'] ${
                              color.hex === '#CCFF00' ? 'text-[#1A1A1A]' : 'text-white'
                            }`}>
                              {color.name}
                            </h3>
                            <button
                              onClick={() => handleCopy(color.hex, color.name)}
                              className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                                color.hex === '#CCFF00' ? 'bg-[#1A1A1A]/20 text-[#1A1A1A]' : 'bg-white/20 text-white'
                              }`}
                              title="Copy Hex Code"
                            >
                              {copiedToken === color.name ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Technical Codes & Specs */}
                        <div className="p-6 space-y-4 text-xs font-['Montserrat']">
                          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 font-mono">
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-1.5">
                              <span className="font-bold text-slate-500">HEX:</span>
                              <span className="font-black text-[#008080] dark:text-[#CCFF00] text-sm">{color.hex}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-1.5">
                              <span className="font-bold text-slate-500">CMYK:</span>
                              <span className="font-black text-slate-900 dark:text-white">{color.cmyk}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-500">RGB:</span>
                              <span className="font-black text-slate-900 dark:text-white">{color.rgb}</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="font-bold text-slate-500 uppercase text-[10px]">Usage Guideline:</span>
                            <p className="text-slate-800 dark:text-slate-200 font-semibold leading-relaxed bg-slate-100 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                              {color.usage}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ---------------- PAGE 12: SECONDARY COLOR PALETTE: LINEN SURFACE ---------------- */}
              {activePageNum === 12 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="border-b-2 border-slate-200 dark:border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-mono font-extrabold text-[#006D5B] uppercase tracking-wider">PAGE 12 • SECONDARY BRAND SYSTEM</span>
                      <h2 className="text-3xl font-black font-['Montserrat'] text-[#111827] dark:text-white mt-1">
                        LINEN SURFACE PALETTE
                      </h2>
                    </div>
                    <span className="text-xs font-bold bg-[#F5EFE6] dark:bg-[#0A2540] text-[#006D5B] dark:text-teal-300 px-3 py-1.5 rounded-lg border border-[#E3DDD3] dark:border-teal-700/50 font-mono">
                      Secondary Palette: Linen Surfaces & High-Contrast Structure
                    </span>
                  </div>

                  <p className="text-base font-medium text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed">
                    The Linen Surface secondary palette provides warm, glare-free tactical backdrops, tactile insets, and structural outline strokes. It delivers effortless multi-generational readability with certified WCAG AAA contrast ratios.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                    {SECONDARY_BRAND_COLORS.map(color => (
                      <div
                        key={color.name}
                        className="bg-white dark:bg-slate-900 rounded-2xl border-1.5 border-[#E3DDD3] dark:border-slate-800 shadow-md p-5 space-y-5"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-20 h-20 rounded-2xl shadow-inner border border-[#E3DDD3] dark:border-slate-700 flex items-center justify-center shrink-0"
                            style={{ backgroundColor: color.hex }}
                          >
                            <span className={`text-xs font-mono font-black ${
                              ['#F5EFE6', '#FAF6F0', '#EDE5D8', '#E3DDD3'].includes(color.hex) ? 'text-[#2E2A26]' : 'text-white'
                            }`}>
                              {color.hex}
                            </span>
                          </div>

                          <div className="space-y-1 font-['Montserrat'] min-w-0">
                            <span className="text-[11px] font-extrabold text-[#006D5B] dark:text-teal-300 uppercase tracking-wider block truncate">
                              {color.role}
                            </span>
                            <h3 className="text-xl font-extrabold text-[#111827] dark:text-white truncate">
                              {color.name}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-2">
                              {color.description}
                            </p>
                          </div>
                        </div>

                        <div className="bg-[#FAF6F0] dark:bg-slate-950 p-3.5 rounded-xl border border-[#E3DDD3] dark:border-slate-800 space-y-1.5 font-mono text-xs">
                          <div className="flex justify-between border-b border-slate-200/80 dark:border-slate-800 pb-1">
                            <span className="text-slate-500">HEX Code:</span>
                            <span className="font-bold text-[#111827] dark:text-white">{color.hex}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200/80 dark:border-slate-800 pb-1">
                            <span className="text-slate-500">CMYK Values:</span>
                            <span className="font-bold text-slate-800 dark:text-white">{color.cmyk}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">RGB Values:</span>
                            <span className="font-bold text-slate-800 dark:text-white">{color.rgb}</span>
                          </div>
                        </div>

                        {/* Contrast Test Matrix */}
                        <div className="pt-1">
                          <span className="text-[11px] font-bold text-slate-500 uppercase font-mono block mb-1.5">WCAG AAA Certified Contrast:</span>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2.5 rounded-xl bg-[#0A2540] text-white flex items-center justify-between text-[11px] font-bold">
                              <span>On Navy</span>
                              <span className="text-teal-300">AAA Pass</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-[#2E2A26] text-white flex items-center justify-between text-[11px] font-bold">
                              <span>On Charcoal</span>
                              <span className="text-amber-300">AAA Pass</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ---------------- PAGE 13: TYPOGRAPHY: PRIMARY FONT ---------------- */}
              {activePageNum === 13 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="border-b-2 border-slate-200 dark:border-slate-800 pb-6 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-extrabold text-slate-400 uppercase">PAGE 13</span>
                      <h2 className="text-3xl font-black font-['Montserrat'] text-[#1A1A1A] dark:text-white mt-1">
                        TYPOGRAPHY: PRIMARY FONT
                      </h2>
                    </div>
                    <span className="text-xs font-bold bg-[#008080]/10 text-[#008080] dark:text-[#CCFF00] px-3 py-1.5 rounded-lg border border-[#008080]/20 font-mono">
                      Design Placement: Full Alphabet A-Z, 0-9 in Weights
                    </span>
                  </div>

                  <p className="text-base font-medium text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed">
                    Our primary typeface is <strong>Montserrat</strong>. It is modern, geometric, and clean—reflecting our tech-forward yet accessible personality.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#008080] text-white p-6 rounded-2xl shadow-lg space-y-2">
                      <span className="text-xs font-mono font-bold uppercase text-[#CCFF00]">Headlines Standard</span>
                      <h3 className="text-xl font-black font-['Montserrat']">Montserrat Bold</h3>
                      <p className="text-xs opacity-90">We use Montserrat Bold for Headlines.</p>
                    </div>

                    <div className="bg-[#1A1A1A] text-white p-6 rounded-2xl shadow-lg space-y-2 border border-slate-700">
                      <span className="text-xs font-mono font-bold uppercase text-[#CCFF00]">Body Copy Standard</span>
                      <h3 className="text-xl font-normal font-['Montserrat']">Montserrat Regular</h3>
                      <p className="text-xs opacity-90">We use Montserrat Regular for Body Copy.</p>
                    </div>
                  </div>

                  {/* Character Specimen Grid */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-2xl border-2 border-slate-300 dark:border-slate-800 space-y-6">
                    <div>
                      <span className="text-xs font-mono font-extrabold text-[#008080] dark:text-[#CCFF00] uppercase">
                        MONTSERRAT BOLD (700) • HEADLINE SPECIMEN
                      </span>
                      <div className="text-2xl sm:text-3xl font-bold font-['Montserrat'] text-[#1A1A1A] dark:text-white tracking-wider mt-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 leading-loose">
                        ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                        abcdefghijklmnopqrstuvwxyz<br />
                        0123456789 (!@#$%^&*)
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-mono font-extrabold text-slate-500 uppercase">
                        MONTSERRAT REGULAR (400) • BODY SPECIMEN
                      </span>
                      <div className="text-lg font-normal font-['Montserrat'] text-slate-800 dark:text-slate-200 tracking-normal mt-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 leading-loose">
                        ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                        abcdefghijklmnopqrstuvwxyz<br />
                        0123456789 (!@#$%^&*)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- PAGE 14: TYPOGRAPHY: HIERARCHY ---------------- */}
              {activePageNum === 14 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="border-b-2 border-slate-200 dark:border-slate-800 pb-6 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-extrabold text-slate-400 uppercase">PAGE 14</span>
                      <h2 className="text-3xl font-black font-['Montserrat'] text-[#1A1A1A] dark:text-white mt-1">
                        TYPOGRAPHY: HIERARCHY
                      </h2>
                    </div>
                    <span className="text-xs font-bold bg-[#008080]/10 text-[#008080] dark:text-[#CCFF00] px-3 py-1.5 rounded-lg border border-[#008080]/20 font-mono">
                      Design Placement: Example Article Layout (H1, H2, Body)
                    </span>
                  </div>

                  {/* Article Layout Specimen Box */}
                  <div className="bg-[#F2F2F2] dark:bg-slate-950 p-8 sm:p-12 rounded-3xl border-2 border-slate-300 dark:border-slate-800 shadow-xl space-y-8">
                    
                    {/* H1 Specimen */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#008080] dark:text-[#CCFF00] uppercase">
                          Heading 1 • Montserrat Bold (32pt)
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Line-Height: 1.2</span>
                      </div>
                      <h1 className="text-3xl font-bold font-['Montserrat'] text-[#1A1A1A] dark:text-white tracking-tight">
                        Heading 1: The Future is Green
                      </h1>
                    </div>

                    {/* H2 Specimen */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#008080] dark:text-[#CCFF00] uppercase">
                          Headline 2 • Montserrat Semibold (24pt)
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Line-Height: 1.3</span>
                      </div>
                      <h2 className="text-2xl font-semibold font-['Montserrat'] text-[#008080] dark:text-[#CCFF00]">
                        Headline 2: Sub-section heading
                      </h2>
                    </div>

                    {/* Body Specimen */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                          Body copy • Montserrat Regular (12pt / 16pt line height)
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Line-Height: 16pt (1.33)</span>
                      </div>
                      <p className="text-base font-normal font-['Montserrat'] text-[#1A1A1A] dark:text-slate-200 leading-relaxed max-w-3xl">
                        Body copy: This is an example of how our body text should look. It is Montserrat Regular, set at 12pt with 16pt line height for readability. Ensure adequate contrast against the background.
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {/* ---------------- PAGE 15: PHOTOGRAPHY STYLE ---------------- */}
              {activePageNum === 15 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="border-b-2 border-slate-200 dark:border-slate-800 pb-6 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-extrabold text-slate-400 uppercase">SECTION 5 • PAGE 15</span>
                      <h2 className="text-3xl font-black font-['Montserrat'] text-[#1A1A1A] dark:text-white mt-1">
                        PHOTOGRAPHY STYLE
                      </h2>
                    </div>
                    <span className="text-xs font-bold bg-[#008080]/10 text-[#008080] dark:text-[#CCFF00] px-3 py-1.5 rounded-lg border border-[#008080]/20 font-mono">
                      Design Placement: Moodboard of 4-6 Inspiring Images
                    </span>
                  </div>

                  <p className="text-base font-medium text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed">
                    Our photography should feel authentic, bright, and hopeful. It focuses on the harmony between people, technology, and nature.
                  </p>

                  {/* Keywords Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase mr-2">Keywords:</span>
                    {['Candid', 'Natural lighting', 'High-contrast', 'Expansive', 'Authentic connection'].map(kw => (
                      <span key={kw} className="bg-[#008080] text-[#CCFF00] font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                        #{kw}
                      </span>
                    ))}
                  </div>

                  {/* DOs & DON'Ts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 p-6 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800 space-y-3">
                      <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold text-base">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span>DO</span>
                      </div>
                      <ul className="space-y-2 text-xs font-medium text-emerald-950 dark:text-emerald-200">
                        {PHOTO_DOS.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-rose-50 dark:bg-rose-950/40 p-6 rounded-2xl border-2 border-rose-300 dark:border-rose-800 space-y-3">
                      <div className="flex items-center space-x-2 text-rose-800 dark:text-rose-300 font-bold text-base">
                        <XCircle className="w-5 h-5 text-rose-600" />
                        <span>DON'T</span>
                      </div>
                      <ul className="space-y-2 text-xs font-medium text-rose-950 dark:text-rose-200">
                        {PHOTO_DONTS.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-rose-600 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Photography Moodboard Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    {PHOTOGRAPHY_MOODBOARD.map(img => (
                      <div key={img.id} className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-300 dark:border-slate-800 overflow-hidden shadow-md space-y-3 group">
                        <div className="h-56 overflow-hidden relative">
                          <img
                            src={img.url}
                            alt={img.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                          />
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                            {img.keywords.map(k => (
                              <span key={k} className="bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 space-y-1">
                          <h4 className="font-bold font-['Montserrat'] text-slate-900 dark:text-white text-sm">
                            {img.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {img.caption}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ---------------- PAGE 16: ICONOGRAPHY SYSTEM ---------------- */}
              {activePageNum === 16 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="border-b-2 border-slate-200 dark:border-slate-800 pb-6 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-extrabold text-slate-400 uppercase">SECTION 5 • PAGE 16</span>
                      <h2 className="text-3xl font-black font-['Montserrat'] text-[#1A1A1A] dark:text-white mt-1">
                        ICONOGRAPHY SYSTEM
                      </h2>
                    </div>
                    <span className="text-xs font-bold bg-[#008080]/10 text-[#008080] dark:text-[#CCFF00] px-3 py-1.5 rounded-lg border border-[#008080]/20 font-mono">
                      Design Placement: Grid of Custom Apex Monoline Icons
                    </span>
                  </div>

                  <p className="text-base font-medium text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed">
                    Our icons are custom-made to be monoline (single line weight) and geometric, matching the "Apex Leaf" symbol. They should be clear, simple, and functional.
                  </p>

                  <div className="bg-[#008080]/10 border border-[#008080]/30 p-4 rounded-xl text-xs font-bold text-[#008080] dark:text-[#CCFF00] flex items-center space-x-2">
                    <Leaf className="w-5 h-5 shrink-0 text-[#008080] dark:text-[#CCFF00]" />
                    <span>Usage Rule: Use the primary Evergreen Teal (#008080) for icons on white backgrounds, or White on dark backgrounds.</span>
                  </div>

                  {/* Apex Leaf Signature Monoline Symbol */}
                  <div className="bg-white dark:bg-slate-950 p-8 rounded-2xl border-2 border-slate-300 dark:border-slate-800 text-center space-y-4">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase">The "Apex Leaf" Geometric Monoline Core Symbol</span>
                    <div className="w-32 h-32 mx-auto flex items-center justify-center p-4 bg-[#F2F2F2] dark:bg-slate-900 rounded-3xl border-2 border-[#008080] shadow-lg">
                      <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                        <path d="M 50 10 C 25 30 25 70 50 90 C 75 70 75 30 50 10 Z" fill="none" stroke="#008080" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="50" y1="10" x2="50" y2="90" stroke="#008080" strokeWidth="3" />
                        <line x1="50" y1="40" x2="70" y2="28" stroke="#008080" strokeWidth="3" strokeLinecap="round" />
                        <line x1="50" y1="60" x2="30" y2="48" stroke="#008080" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="50" cy="50" r="4" fill="#CCFF00" />
                      </svg>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Single line weight (3px) geometric leaf silhouette symbolizing sustainability & civic tech.</p>
                  </div>

                  {/* Monoline Iconography Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 pt-2">
                    {[
                      { icon: Leaf, label: 'Apex Leaf' },
                      { icon: Sun, label: 'Solar Energy' },
                      { icon: Wind, label: 'Clean Air' },
                      { icon: Battery, label: 'Grid Battery' },
                      { icon: Globe, label: 'Civic Earth' },
                      { icon: Shield, label: 'Data Security' },
                      { icon: MapPin, label: 'Ward Location' },
                      { icon: Heart, label: 'Community' },
                      { icon: Users, label: 'Residents' },
                      { icon: Zap, label: 'Fast Action' },
                      { icon: Camera, label: 'Photo Proof' },
                      { icon: CheckCircle2, label: 'Verified' }
                    ].map((item, idx) => {
                      const IconComp = item.icon;
                      return (
                        <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-sm hover:shadow-md transition-all">
                          <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-xl bg-[#F2F2F2] dark:bg-slate-800">
                            <IconComp className="w-7 h-7 text-[#008080] dark:text-white" strokeWidth={2} />
                          </div>
                          <span className="text-xs font-bold font-['Montserrat'] text-slate-800 dark:text-slate-200 block">
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: COLOR PALETTES DETAILED VIEW (60-30-10 SYSTEM) */}
        {/* ========================================================= */}
        {activeTab === 'colors' && (
          <div className="space-y-10 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border-2 border-slate-300 dark:border-slate-800 shadow-xl space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                  <span className="text-xs font-mono font-extrabold text-[#008080] uppercase tracking-wider">Pages 11 & 12 • 60-30-10 Color Architecture</span>
                  <h2 className="text-3xl font-black font-['Montserrat'] text-[#1A1A1A] dark:text-white mt-1">
                    Brand Color Palettes & Ratio Distribution
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Click any color swatch to copy its Hex, RGB, or CMYK codes directly to your clipboard.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('ratio603010')}
                  className="px-4 py-2 rounded-xl bg-[#0A2540] hover:bg-[#006D5B] text-white text-xs font-mono font-bold flex items-center space-x-2 shadow-md transition-all cursor-pointer border border-[#CCFF00]/40 self-start sm:self-auto"
                >
                  <PieChart className="w-4 h-4 text-[#CCFF00]" />
                  <span>Launch 60-30-10 Engine</span>
                </button>
              </div>

              {/* 1. Primary 60% Palette */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
                  <h3 className="text-xl font-black font-['Montserrat'] text-[#0A2540] dark:text-white flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#0A2540] text-white text-xs font-mono font-black">60%</span>
                    <span>Primary Palette: Dominant Base & Foundation (Page 11)</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-slate-500">4 Swatches</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {PRIMARY_BRAND_COLORS.map(color => (
                    <div key={color.name} className="bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-slate-300 dark:border-slate-800 overflow-hidden shadow-lg space-y-3">
                      <div
                        className="h-32 p-4 flex flex-col justify-between shadow-inner"
                        style={{ backgroundColor: color.hex }}
                      >
                        <span className={`text-xs font-black uppercase px-2 py-0.5 rounded self-start ${
                          color.hex === '#FFFFFF' || color.hex === '#FAF6F0' ? 'bg-[#0A2540] text-white' : 'bg-black/40 text-white'
                        }`}>
                          60% Primary
                        </span>
                        <div className="flex items-center justify-between">
                          <span className={`font-black text-lg font-['Montserrat'] ${
                            color.hex === '#FFFFFF' || color.hex === '#FAF6F0' ? 'text-[#0A2540]' : 'text-white'
                          }`}>{color.name}</span>
                          <button
                            onClick={() => handleCopy(color.hex, color.name)}
                            className={`p-2 rounded-lg cursor-pointer ${
                              color.hex === '#FFFFFF' || color.hex === '#FAF6F0' ? 'bg-slate-200 text-slate-800' : 'bg-black/20 text-white'
                            }`}
                          >
                            {copiedToken === color.name ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="p-4 space-y-2 text-xs font-mono">
                        <div className="flex justify-between font-bold"><span>HEX:</span><span className="text-[#008080]">{color.hex}</span></div>
                        <div className="flex justify-between"><span>RGB:</span><span>{color.rgb}</span></div>
                        <div className="flex justify-between"><span>CMYK:</span><span>{color.cmyk}</span></div>
                        <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-1.5"><span className="text-slate-500">WCAG:</span><span className="text-[#006D5B] font-bold">{color.wcagContrast}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Secondary 30% Palette */}
              <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="text-xl font-black font-['Montserrat'] text-[#006D5B] dark:text-teal-300 flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#006D5B] text-white text-xs font-mono font-black">30%</span>
                    <span>Secondary Palette: Supporting Structure & Contrast (Page 12)</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-slate-500">4 Swatches</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {SECONDARY_BRAND_COLORS.map(color => (
                    <div key={color.name} className="bg-[#FAF6F0] dark:bg-slate-950 rounded-2xl border-1.5 border-[#E3DDD3] dark:border-slate-800 p-5 space-y-4 shadow-md">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-16 h-16 rounded-xl border border-[#E3DDD3] shadow-inner flex items-center justify-center font-mono font-bold text-[11px] shrink-0"
                          style={{ backgroundColor: color.hex }}
                        >
                          <span className={['#F5EFE6', '#FAF6F0', '#EDE5D8', '#CBD5E1', '#E3DDD3'].includes(color.hex) ? 'text-[#2E2A26]' : 'text-white'}>
                            {color.hex}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-base font-['Montserrat'] text-[#111827] dark:text-white truncate">{color.name}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{color.role}</p>
                          <span className="text-[10px] font-mono text-[#006D5B] dark:text-teal-400 font-bold block mt-0.5">{color.wcagContrast}</span>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-[#E3DDD3] dark:border-slate-800 space-y-1 text-xs font-mono">
                        <div className="flex justify-between"><span>RGB:</span><span className="font-bold text-slate-800 dark:text-white">{color.rgb}</span></div>
                        <div className="flex justify-between"><span>CMYK:</span><span className="font-bold text-slate-800 dark:text-white">{color.cmyk}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Accent 10% Palette */}
              <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="text-xl font-black font-['Montserrat'] text-[#B45309] dark:text-amber-400 flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#B45309] text-white text-xs font-mono font-black">10%</span>
                    <span>Accent Palette: High-Impact Action & Focal Points</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-slate-500">2 Swatches</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {ACCENT_BRAND_COLORS.map(color => (
                    <div key={color.name} className="bg-white dark:bg-slate-950 rounded-2xl border-1.5 border-amber-200 dark:border-slate-800 p-5 space-y-4 shadow-md">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-16 h-16 rounded-xl border border-amber-300 shadow-inner flex items-center justify-center font-mono font-bold text-[11px] shrink-0"
                          style={{ backgroundColor: color.hex }}
                        >
                          <span className={color.hex === '#CCFF00' ? 'text-[#1A1A1A]' : 'text-white'}>
                            {color.hex}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-base font-['Montserrat'] text-[#111827] dark:text-white truncate">{color.name}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{color.role}</p>
                          <span className="text-[10px] font-mono text-[#B45309] dark:text-amber-400 font-bold block mt-0.5">{color.wcagContrast}</span>
                        </div>
                      </div>
                      <div className="bg-[#FAF6F0] dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs font-mono">
                        <div className="flex justify-between"><span>RGB:</span><span className="font-bold text-slate-800 dark:text-white">{color.rgb}</span></div>
                        <div className="flex justify-between"><span>CMYK:</span><span className="font-bold text-slate-800 dark:text-white">{color.cmyk}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: TYPOGRAPHY SPECIMEN (MONTSERRAT) */}
        {/* ========================================================= */}
        {activeTab === 'typography' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border-2 border-slate-300 dark:border-slate-800 shadow-xl space-y-8">
              <div>
                <span className="text-xs font-mono font-extrabold text-[#008080] uppercase tracking-wider">Pages 13 & 14 • Primary Typeface</span>
                <h2 className="text-3xl font-black font-['Montserrat'] text-[#1A1A1A] dark:text-white mt-1">
                  Typography & Hierarchy System
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Our primary typeface is Montserrat. It is modern, geometric, and clean—reflecting our tech-forward yet accessible personality.
                </p>
              </div>

              {/* Article Example Layout */}
              <div className="bg-[#F2F2F2] dark:bg-slate-950 p-8 rounded-3xl border-2 border-slate-300 dark:border-slate-800 space-y-6">
                <span className="text-xs font-mono font-bold text-[#008080] uppercase">Page 14 Specimen: Article Layout Example</span>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">Heading 1 • Montserrat Bold (32pt)</span>
                    <h1 className="text-3xl font-bold font-['Montserrat'] text-[#1A1A1A] dark:text-white">
                      The Future is Green
                    </h1>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400">Headline 2 • Montserrat Semibold (24pt)</span>
                    <h2 className="text-2xl font-semibold font-['Montserrat'] text-[#008080] dark:text-[#CCFF00]">
                      Sub-section heading
                    </h2>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400">Body copy • Montserrat Regular (12pt / 16pt line height)</span>
                    <p className="text-base font-normal font-['Montserrat'] text-slate-800 dark:text-slate-200 leading-relaxed">
                      This is an example of how our body text should look. It is Montserrat Regular, set at 12pt with 16pt line height for readability. Ensure adequate contrast against the background.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: IMAGERY & APEX ICONOGRAPHY */}
        {/* ========================================================= */}
        {activeTab === 'imagery' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border-2 border-slate-300 dark:border-slate-800 shadow-xl space-y-8">
              <div>
                <span className="text-xs font-mono font-extrabold text-[#008080] uppercase tracking-wider">Pages 15 & 16 • Assets</span>
                <h2 className="text-3xl font-black font-['Montserrat'] text-[#1A1A1A] dark:text-white mt-1">
                  Photography Style & Apex Leaf Monoline Iconography
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Our photography focuses on the harmony between people, technology, and nature. Our icons match the monoline geometric Apex Leaf symbol.
                </p>
              </div>

              {/* DOs & DON'Ts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-6 rounded-2xl border-2 border-emerald-300 font-['Montserrat'] space-y-3">
                  <h3 className="font-bold text-emerald-800 dark:text-emerald-300 text-lg flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>PHOTOGRAPHY DO</span>
                  </h3>
                  <ul className="space-y-2 text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                    {PHOTO_DOS.map((d, i) => <li key={i}>• {d}</li>)}
                  </ul>
                </div>

                <div className="bg-rose-50 dark:bg-rose-950/40 p-6 rounded-2xl border-2 border-rose-300 font-['Montserrat'] space-y-3">
                  <h3 className="font-bold text-rose-800 dark:text-rose-300 text-lg flex items-center space-x-2">
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>PHOTOGRAPHY DON'T</span>
                  </h3>
                  <ul className="space-y-2 text-xs font-semibold text-rose-900 dark:text-rose-200">
                    {PHOTO_DONTS.map((d, i) => <li key={i}>• {d}</li>)}
                  </ul>
                </div>
              </div>

              {/* Icon Grid */}
              <div className="pt-6 border-t">
                <h3 className="text-xl font-black font-['Montserrat'] text-[#008080] mb-4">
                  Iconography System (Monoline Single Line Weight)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {[Leaf, Sun, Wind, Battery, Globe, Shield, MapPin, Heart, Users, Zap, Camera, CheckCircle2].map((IconC, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border text-center space-y-2">
                      <IconC className="w-8 h-8 mx-auto text-[#008080]" strokeWidth={2} />
                      <span className="text-[11px] font-bold font-['Montserrat'] block">Monoline Icon</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: BRAND POSTER BOARD */}
        {/* ========================================================= */}
        {activeTab === 'poster' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-12 border-2 border-slate-300 dark:border-slate-800 shadow-2xl space-y-10">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-2xl font-black font-['Montserrat']">Brand Identity Presentation Board</h2>
                <span className="bg-[#008080] text-[#CCFF00] font-black text-xs px-3 py-1 rounded-full">Official Spec 1.0</span>
              </div>

              <div className="text-center space-y-6 py-12 bg-[#0A2540] text-white rounded-3xl p-8 border-2 border-[#008080] shadow-2xl flex flex-col items-center justify-center">
                <CityscapeLogo variant="dark" size="xl" showTagline={true} />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: LOGO ARCHITECTURE */}
        {/* ========================================================= */}
        {activeTab === 'logo' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border-2 border-slate-300 dark:border-slate-800 shadow-xl space-y-8">
              <div>
                <span className="text-xs font-mono font-extrabold text-[#008080] uppercase tracking-wider">Page 10 • Core Logo Structure</span>
                <h2 className="text-3xl font-black font-['Montserrat'] text-[#1A1A1A] dark:text-white mt-1">
                  Core Logo Structure & Geometric Specifications
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
                  The dynamic cityscape-network structure fuses an urban skyline icon with a community mesh network, symbolizing how technology and citizens unite for responsive public administration.
                </p>
              </div>

              {/* Light & Dark Logo Variants Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Light Surface Variant */}
                <div className="p-8 bg-[#F8FAFC] rounded-3xl border-2 border-slate-300 flex flex-col items-center justify-center space-y-6 shadow-md">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-mono font-black text-slate-500 uppercase tracking-wider">Light Surface Variant</span>
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">Standard</span>
                  </div>
                  <div className="py-4">
                    <CityscapeLogo variant="full" size="lg" showTagline={true} />
                  </div>
                  <div className="flex items-center gap-3 w-full pt-4 border-t border-slate-200">
                    <a
                      href="/cityscape-logo.svg"
                      download="cityscape-logo-light.svg"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#06182a] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-[#CCFF00]" />
                      <span>Download SVG</span>
                    </a>
                    <button
                      onClick={() => handleCopy('/cityscape-logo.svg', 'Light SVG URL')}
                      className="px-3 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Copy URL"
                    >
                      {copiedToken === 'Light SVG URL' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Dark Surface Variant */}
                <div className="p-8 bg-[#0A2540] rounded-3xl border-2 border-slate-800 flex flex-col items-center justify-center space-y-6 shadow-md">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-mono font-black text-teal-300 uppercase tracking-wider">Dark Surface Variant</span>
                    <span className="text-[11px] font-mono text-teal-200 bg-teal-900/60 px-2.5 py-0.5 rounded-full font-bold">Civic Navy</span>
                  </div>
                  <div className="py-4">
                    <CityscapeLogo variant="dark" size="lg" showTagline={true} />
                  </div>
                  <div className="flex items-center gap-3 w-full pt-4 border-t border-slate-800">
                    <a
                      href="/cityscape-logo-dark.svg"
                      download="cityscape-logo-dark.svg"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#006D5B] hover:bg-[#005244] text-white text-xs font-bold transition-all shadow-sm cursor-pointer border border-teal-400/30"
                    >
                      <Download className="w-4 h-4 text-[#CCFF00]" />
                      <span>Download Dark SVG</span>
                    </a>
                    <button
                      onClick={() => handleCopy('/cityscape-logo-dark.svg', 'Dark SVG URL')}
                      className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Copy URL"
                    >
                      {copiedToken === 'Dark SVG URL' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Action Download Suite */}
              <div className="bg-slate-100 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white font-['Montserrat']">
                    Brand Vector Assets & App Favicon Kit
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Lossless scalable vectors formatted for print, mobile apps, and web headers.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="/favicon.svg"
                    download="cityscape-icon.svg"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-[#008080]" />
                    <span>Download App Icon</span>
                  </a>
                  <a
                    href="/cityscape-logo.svg"
                    download="cityscape-brand-logo.svg"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-black transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-200" />
                    <span>Download Full Logo</span>
                  </a>
                </div>
              </div>

              {/* Logo Structure Color Spec Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-['Montserrat']">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="w-4 h-4 rounded-full bg-[#0052CC]" />
                  <h4 className="font-bold text-slate-900 dark:text-white">Progressive Blue</h4>
                  <p className="text-[11px] text-slate-500">Skyline Outline & Municipal Structure</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="w-4 h-4 rounded-full bg-[#008080]" />
                  <h4 className="font-bold text-slate-900 dark:text-white">Community Teal</h4>
                  <p className="text-[11px] text-slate-500">Citizen Nodes & Mesh Connections</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="w-4 h-4 rounded-full bg-[#FF5A36]" />
                  <h4 className="font-bold text-slate-900 dark:text-white">Engaged Coral</h4>
                  <p className="text-[11px] text-slate-500">Energy & Resident Participation</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="w-4 h-4 rounded-full bg-[#64748B]" />
                  <h4 className="font-bold text-slate-900 dark:text-white">Neutral Gray</h4>
                  <p className="text-[11px] text-slate-500">Tagline & Secondary Copy</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: VERBAL LEXICON */}
        {/* ========================================================= */}
        {activeTab === 'voice' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Showcase: International Civic Jargon 3.0 Engine */}
            <div className="bg-gradient-to-br from-[#0A2540] via-[#0E3357] to-[#0A2540] rounded-3xl p-6 sm:p-10 border-2 border-teal-500/40 text-white shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700 pb-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-[#006D5B] text-teal-200 border border-teal-400/40">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>International Standard Matrix // UN-Habitat & ISO 37120</span>
                  </div>
                  <h2 className="text-3xl font-black font-['Montserrat'] text-white">
                    Civic Lexicon 3.0 Framework
                  </h2>
                  <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Elevating municipal communication to world-class urbanist and Gen Z standards while safeguarding WCAG AAA clarity for senior community members.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('cityscape:open-civic-lexicon'))}
                  className="px-6 py-3 bg-[#B45309] hover:bg-[#92400E] text-white rounded-2xl font-black text-sm transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 active:scale-95 border border-amber-300/40 shrink-0"
                >
                  <Globe className="w-4 h-4 text-amber-200" />
                  <span>Launch Interactive Lexicon Hub</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-['Montserrat']">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
                  <span className="text-[11px] font-mono font-bold text-teal-300 uppercase block">1. Urban Stewardship</span>
                  <h4 className="font-extrabold text-sm text-white">Public Realm Stewardship</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Reframing civic maintenance from complaint-logging to shared leadership of streets and greenways.
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
                  <span className="text-[11px] font-mono font-bold text-amber-300 uppercase block">2. Resolution & Workflow</span>
                  <h4 className="font-extrabold text-sm text-white">Closed-Loop Governance</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    End-to-end accountability guaranteeing verified photo proof and post-completion audit logs.
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
                  <span className="text-[11px] font-mono font-bold text-sky-300 uppercase block">3. Multi-Generational Inclusivity</span>
                  <h4 className="font-extrabold text-sm text-white">Dual Perspective Engine</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Real-time switching between energetic global urbanist framing and plain senior translations.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border-2 border-slate-300 dark:border-slate-800 shadow-xl space-y-6">
              <h2 className="text-2xl font-black font-['Montserrat']">Verbal Lexicon Matrix & Brand Language Engine</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-['Montserrat']">
                  <thead>
                    <tr className="bg-[#1A1A1A] text-white font-black uppercase">
                      <th className="p-4 rounded-tl-xl">Prohibited Term</th>
                      <th className="p-4">Preferred Term</th>
                      <th className="p-4 rounded-tr-xl">Rationale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {LEXICON_MATRIX.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                        <td className="p-4 font-bold text-rose-600 line-through">{item.prohibited}</td>
                        <td className="p-4 font-black text-[#008080] dark:text-[#CCFF00] text-sm">{item.preferred}</td>
                        <td className="p-4 text-slate-600 dark:text-slate-300">{item.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
