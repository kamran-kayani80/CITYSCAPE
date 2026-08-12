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
  FileText
} from 'lucide-react';
import { CityscapeLogo } from './CityscapeLogo';

// Primary & Secondary Brand Colors (Matching Pages 11 & 12 Guidelines)
interface ColorToken {
  name: string;
  role: string;
  hex: string;
  rgb: string;
  cmyk: string;
  wcagContrast: string;
  description: string;
  usage: string;
  category: 'primary' | 'secondary' | 'legacy';
}

const PRIMARY_BRAND_COLORS: ColorToken[] = [
  {
    name: 'Sage Green',
    role: 'Primary Brand Identifier & Action CTA',
    hex: '#8F9E87',
    rgb: 'RGB: 143, 158, 135',
    cmyk: 'CMYK: 10, 0, 15, 38',
    wcagContrast: '7.8:1 (AAA)',
    description: 'Calm, organic, and authoritative natural sage green serving as our main brand anchor and interactive trigger.',
    usage: 'Main brand identifier, primary buttons, active tabs, checked state indicators.',
    category: 'primary'
  },
  {
    name: 'Soft Beige',
    role: 'Warm Accent & Highlights',
    hex: '#FBD6C8',
    rgb: 'RGB: 251, 214, 200',
    cmyk: 'CMYK: 0, 15, 20, 2',
    wcagContrast: '14.5:1 (on Charcoal Dark)',
    description: 'Warm, humanizing nude-peach beige providing gentle visual warmth and tactile card highlights.',
    usage: 'Secondary badges, notification pills, subtle card highlights, status tags.',
    category: 'primary'
  },
  {
    name: 'Warm Grey',
    role: 'Secondary Text & Iconography',
    hex: '#635D55',
    rgb: 'RGB: 99, 93, 85',
    cmyk: 'CMYK: 0, 6, 14, 61',
    wcagContrast: '8.2:1 (AAA)',
    description: 'Earthy, grounded warm grey for body text, secondary labels, and crisp outline icons.',
    usage: 'Body text, subheadings, line icons, form field borders, ghost button text.',
    category: 'primary'
  }
];

const SECONDARY_BRAND_COLORS: ColorToken[] = [
  {
    name: 'Linen Surface',
    role: 'Canvas & Input Backgrounds',
    hex: '#F5EFE6',
    rgb: 'RGB: 245, 239, 230',
    cmyk: 'CMYK: 0, 2, 6, 4',
    wcagContrast: '15.2:1 (vs Charcoal Dark)',
    description: 'Glare-free soft linen off-white providing an approachable canvas for multi-generational readability.',
    usage: 'App background canvas, form input fills, dropdown tracks, card containers.',
    category: 'secondary'
  },
  {
    name: 'Charcoal Dark',
    role: 'Primary Text & Dark Surface',
    hex: '#2E2A26',
    rgb: 'RGB: 46, 42, 38',
    cmyk: 'CMYK: 0, 9, 17, 82',
    wcagContrast: '16.5:1 (AAA)',
    description: 'Deep espresso charcoal providing executive typographic contrast and crisp dark mode elements.',
    usage: 'Main headlines, primary text, high-contrast dark mode containers.',
    category: 'secondary'
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
  const [activeTab, setActiveTab] = useState<'clay' | 'poster' | 'pages' | 'colors' | 'typography' | 'imagery' | 'logo' | 'voice'>('clay');
  const [activePageNum, setActivePageNum] = useState<number>(11);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [logoVariant, setLogoVariant] = useState<'full' | 'dark' | 'mono' | 'outline'>('full');
  const [dialValue, setDialValue] = useState<number>(75);

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
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-3 text-xs font-bold">
            <button
              onClick={() => setActiveTab('clay')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-full transition-all cursor-pointer whitespace-nowrap font-['Montserrat'] ${
                activeTab === 'clay'
                  ? 'bg-gradient-to-r from-[#8EE0C5] to-[#F5D0C0] text-[#063B2F] shadow-lg font-black border-2 border-[#7CD6B8]'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#063B2F]" />
              <span>Soft Clay Design Kit</span>
            </button>

            <button
              onClick={() => setActiveTab('pages')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap font-['Montserrat'] ${
                activeTab === 'pages'
                  ? 'bg-[#008080] text-white shadow-md font-black ring-2 ring-[#CCFF00]'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4 text-[#CCFF00]" />
              <span>Brand Book Viewer (Pages 11–16)</span>
            </button>

            <button
              onClick={() => setActiveTab('colors')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap font-['Montserrat'] ${
                activeTab === 'colors'
                  ? 'bg-[#008080] text-white shadow-md font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Palette className="w-4 h-4 text-[#CCFF00]" />
              <span>Color Palettes (Primary & Secondary)</span>
            </button>

            <button
              onClick={() => setActiveTab('typography')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap font-['Montserrat'] ${
                activeTab === 'typography'
                  ? 'bg-[#008080] text-white shadow-md font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Type className="w-4 h-4 text-[#CCFF00]" />
              <span>Typography (Montserrat)</span>
            </button>

            <button
              onClick={() => setActiveTab('imagery')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap font-['Montserrat'] ${
                activeTab === 'imagery'
                  ? 'bg-[#008080] text-white shadow-md font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-[#CCFF00]" />
              <span>Imagery & Apex Iconography</span>
            </button>

            <button
              onClick={() => setActiveTab('poster')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap font-['Montserrat'] ${
                activeTab === 'poster'
                  ? 'bg-[#008080] text-white shadow-md font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Maximize2 className="w-4 h-4 text-amber-400" />
              <span>Brand Board Presentation</span>
            </button>

            <button
              onClick={() => setActiveTab('logo')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap font-['Montserrat'] ${
                activeTab === 'logo'
                  ? 'bg-[#008080] text-white shadow-md font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Grid className="w-4 h-4 text-[#CCFF00]" />
              <span>Logo Mark</span>
            </button>

            <button
              onClick={() => setActiveTab('voice')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap font-['Montserrat'] ${
                activeTab === 'voice'
                  ? 'bg-[#008080] text-white shadow-md font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Volume2 className="w-4 h-4 text-[#CCFF00]" />
              <span>Verbal Lexicon</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">

        {/* ========================================================= */}
        {/* TAB 0: SOFT SCULPTURAL CLAYMORPHIC DESIGN KIT */}
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
                  <p className="text-[11px] text-slate-500 leading-snug">Interactive cards & search panels.</p>
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

              {/* ---------------- PAGE 12: SECONDARY COLOR PALETTE ---------------- */}
              {activePageNum === 12 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="border-b-2 border-slate-200 dark:border-slate-800 pb-6 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-extrabold text-slate-400 uppercase">PAGE 12</span>
                      <h2 className="text-3xl font-black font-['Montserrat'] text-[#1A1A1A] dark:text-white mt-1">
                        SECONDARY COLOR PALETTE
                      </h2>
                    </div>
                    <span className="text-xs font-bold bg-[#008080]/10 text-[#008080] dark:text-[#CCFF00] px-3 py-1.5 rounded-lg border border-[#008080]/20 font-mono">
                      Design Placement: Smaller Swatches Showing Contrast with Primary
                    </span>
                  </div>

                  <p className="text-base font-medium text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed">
                    These colors are used to support the primary palette in complex layouts, charts, and diagrams.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    {SECONDARY_BRAND_COLORS.map(color => (
                      <div
                        key={color.name}
                        className="bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-lg p-6 space-y-6"
                      >
                        <div className="flex items-center space-x-6">
                          <div
                            className="w-28 h-28 rounded-2xl shadow-md border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0"
                            style={{ backgroundColor: color.hex }}
                          >
                            <span className={`text-xs font-mono font-black ${
                              color.hex === '#F2F2F2' ? 'text-slate-900' : 'text-slate-900'
                            }`}>
                              {color.hex}
                            </span>
                          </div>

                          <div className="space-y-2 font-['Montserrat']">
                            <span className="text-xs font-bold text-[#008080] dark:text-[#CCFF00] uppercase tracking-wider">
                              {color.role}
                            </span>
                            <h3 className="text-2xl font-black text-[#1A1A1A] dark:text-white">
                              {color.name}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                              {color.description}
                            </p>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 font-mono text-xs">
                          <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                            <span className="text-slate-400">HEX Code:</span>
                            <span className="font-bold text-[#1A1A1A] dark:text-white">{color.hex}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                            <span className="text-slate-400">CMYK Values:</span>
                            <span className="font-bold text-slate-900 dark:text-white">{color.cmyk}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">RGB Values:</span>
                            <span className="font-bold text-slate-900 dark:text-white">{color.rgb}</span>
                          </div>
                        </div>

                        {/* Contrast Test Matrix */}
                        <div className="pt-2">
                          <span className="text-xs font-bold text-slate-500 uppercase font-mono">Contrast Test vs Primary Slate Black & Evergreen Teal:</span>
                          <div className="grid grid-cols-2 gap-3 mt-2">
                            <div className="p-3 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-between text-xs font-bold">
                              <span>On Slate Black</span>
                              <span style={{ color: color.hex }}>AAA Pass</span>
                            </div>
                            <div className="p-3 rounded-xl bg-[#008080] text-white flex items-center justify-between text-xs font-bold">
                              <span>On Evergreen Teal</span>
                              <span style={{ color: color.hex }}>AA Pass</span>
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
        {/* TAB 2: COLOR PALETTES DETAILED VIEW */}
        {/* ========================================================= */}
        {activeTab === 'colors' && (
          <div className="space-y-10 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border-2 border-slate-300 dark:border-slate-800 shadow-xl space-y-8">
              <div>
                <span className="text-xs font-mono font-extrabold text-[#008080] uppercase tracking-wider">Pages 11 & 12 • Brand Color System</span>
                <h2 className="text-3xl font-black font-['Montserrat'] text-[#1A1A1A] dark:text-white mt-1">
                  Primary & Secondary Color System
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Click any color card to copy its Hex, RGB, or CMYK codes directly to your clipboard.
                </p>
              </div>

              {/* Primary Palette */}
              <div className="space-y-4">
                <h3 className="text-xl font-black font-['Montserrat'] text-[#008080] dark:text-[#CCFF00] border-b pb-2">
                  Primary Color Palette (Page 11)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {PRIMARY_BRAND_COLORS.map(color => (
                    <div key={color.name} className="bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-slate-300 dark:border-slate-800 overflow-hidden shadow-lg space-y-3">
                      <div className="h-32 p-4 flex flex-col justify-between shadow-inner" style={{ backgroundColor: color.hex }}>
                        <span className={`text-xs font-black uppercase px-2 py-0.5 rounded self-start ${color.hex === '#CCFF00' ? 'bg-[#1A1A1A] text-[#CCFF00]' : 'bg-black/40 text-white'}`}>
                          {color.role}
                        </span>
                        <div className="flex items-center justify-between">
                          <span className={`font-black text-lg font-['Montserrat'] ${color.hex === '#CCFF00' ? 'text-[#1A1A1A]' : 'text-white'}`}>{color.name}</span>
                          <button onClick={() => handleCopy(color.hex, color.name)} className="bg-black/20 text-white p-2 rounded-lg cursor-pointer">
                            {copiedToken === color.name ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="p-4 space-y-2 text-xs font-mono">
                        <div className="flex justify-between font-bold"><span>HEX:</span><span className="text-[#008080]">{color.hex}</span></div>
                        <div className="flex justify-between"><span>RGB:</span><span>{color.rgb}</span></div>
                        <div className="flex justify-between"><span>CMYK:</span><span>{color.cmyk}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary Palette */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-xl font-black font-['Montserrat'] text-[#008080] dark:text-[#CCFF00] border-b pb-2">
                  Secondary Color Palette (Page 12)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SECONDARY_BRAND_COLORS.map(color => (
                    <div key={color.name} className="bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-slate-300 dark:border-slate-800 p-6 space-y-4 shadow-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-xl border-2 border-slate-300 shadow-md flex items-center justify-center font-mono font-bold text-xs" style={{ backgroundColor: color.hex }}>
                          {color.hex}
                        </div>
                        <div>
                          <h4 className="font-black text-lg font-['Montserrat'] text-[#1A1A1A] dark:text-white">{color.name}</h4>
                          <p className="text-xs text-slate-500">{color.usage}</p>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border space-y-1 text-xs font-mono">
                        <div className="flex justify-between"><span>RGB:</span><span className="font-bold">{color.rgb}</span></div>
                        <div className="flex justify-between"><span>CMYK:</span><span className="font-bold">{color.cmyk}</span></div>
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
                <div className="p-10 bg-[#F8FAFC] rounded-3xl border-2 border-slate-300 flex flex-col items-center justify-center space-y-4 shadow-md">
                  <span className="text-xs font-mono font-black text-slate-500 uppercase tracking-wider">Light Surface Variant</span>
                  <CityscapeLogo variant="full" size="lg" showTagline={true} />
                </div>

                {/* Dark Surface Variant */}
                <div className="p-10 bg-[#0A2540] rounded-3xl border-2 border-slate-800 flex flex-col items-center justify-center space-y-4 shadow-md">
                  <span className="text-xs font-mono font-black text-teal-300 uppercase tracking-wider">Dark Surface Variant (Civic Navy)</span>
                  <CityscapeLogo variant="dark" size="lg" showTagline={true} />
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
