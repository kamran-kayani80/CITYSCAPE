import React, { useState } from 'react';
import {
  Brain,
  ShieldCheck,
  Scale,
  Eye,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Sparkles,
  Layers,
  BarChart3,
  Users,
  Building2,
  Lock,
  Zap,
  RefreshCw,
  PhoneCall,
  Check,
  ArrowRight,
  ShieldAlert,
  Bot
} from 'lucide-react';
import { CityscapeLogo } from './CityscapeLogo';

export const StrategicArchitectureView: React.FC = () => {
  // --- AI & DATA ENGINE STATES ---
  const [demographicWeightingActive, setDemographicWeightingActive] = useState(true);
  const [districtDensity, setDistrictDensity] = useState(25); // 25% historical density (underrepresented)
  const [rawSeverity, setRawSeverity] = useState<'MEDIUM' | 'HIGH'>('MEDIUM');

  // Vision similarity state
  const [visionScanning, setVisionScanning] = useState(false);
  const [visionScanResult, setVisionScanResult] = useState<{
    similarity: number;
    matchedFeatures: number;
    autoClosed: boolean;
  } | null>(null);

  // Voice/SMS simulator state
  const [smsInput, setSmsInput] = useState('Streetlight at 4th and Elm is broken and flickering');
  const [smsChannel, setSmsChannel] = useState<'SMS' | 'WHATSAPP' | 'VOICE'>('WHATSAPP');
  const [parsedSmsReport, setParsedSmsReport] = useState<{
    title: string;
    category: string;
    ward: string;
    confidence: number;
  } | null>(null);

  // --- GOVERNANCE STATES ---
  const [capacitySanitation, setCapacitySanitation] = useState(92);
  const [capacityRoads, setCapacityRoads] = useState(78);
  const [capacityElectrical, setCapacityElectrical] = useState(64);

  // Anti-brigading state
  const [antiBrigadingActive, setAntiBrigadingActive] = useState(true);
  const [simulatedUpvotes, setSimulatedUpvotes] = useState({
    verifiedResident: 42,
    unverifiedOutside: 128,
  });

  // Calculate weighted priority score
  const baseScore = rawSeverity === 'HIGH' ? 70 : 40;
  // Weighting formula: Boost score inversely proportional to historical reporting density
  const equityMultiplier = demographicWeightingActive ? 1 + (100 - districtDensity) / 100 : 1;
  const finalScore = Math.min(100, Math.round(baseScore * equityMultiplier));

  // Handle Vision AI Simulation Scan
  const handleRunVisionScan = () => {
    setVisionScanning(true);
    setVisionScanResult(null);
    setTimeout(() => {
      setVisionScanning(false);
      setVisionScanResult({
        similarity: 98.4,
        matchedFeatures: 142,
        autoClosed: true,
      });
    }, 1200);
  };

  // Handle SMS Parsing Simulation
  const handleParseSms = () => {
    if (!smsInput.trim()) return;
    setParsedSmsReport({
      title: 'Broken & Flickering Streetlight Hazard',
      category: 'LIGHTING',
      ward: 'Ward 4 (Mission District)',
      confidence: 96.8,
    });
  };

  return (
    <div className="space-y-8 pb-12 font-['Inter']">
      {/* Strategic Header Banner */}
      <div className="dark-indigo-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <CityscapeLogo size="md" showTagline={true} variant="dark" />
            <div className="flex items-center space-x-2 pt-2">
              <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg">
                Strategic Architecture Framework
              </span>
              <span className="text-xs font-bold text-indigo-300">2026 Resilient Civic Roadmap</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Civic AI Deployment & Governance Engine
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
              Operationalizing demographic baseline equity, automated computer-vision closure, multi-channel voice/SMS gateways, public capacity transparency, and verified anti-brigading guardrails.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <div className="p-3 bg-indigo-900/80 border border-indigo-700 rounded-2xl text-center">
              <span className="block text-2xl font-black text-emerald-400">WCAG AAA</span>
              <span className="text-[10px] font-bold text-indigo-200 uppercase">Accessibility Compliant</span>
            </div>
            <div className="p-3 bg-indigo-900/80 border border-indigo-700 rounded-2xl text-center">
              <span className="block text-2xl font-black text-amber-400">Zero Bias</span>
              <span className="text-[10px] font-bold text-indigo-200 uppercase">Equitable Priority System</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: AI & DATA ENGINE (3 Pillars) */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-2xl">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-black text-[#1A1A1A] dark:text-white">
              1. AI & Data Engine Infrastructure
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Algorithmic equity, automated computer vision verification, and accessible multi-channel input.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recommendation 1.1: Demographic Baseline Weighting */}
          <div className="soft-card p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black uppercase text-indigo-600 dark:text-indigo-400 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
                  Recommendation 1.1
                </span>
                <Scale className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-heading font-black text-[#1A1A1A] dark:text-white">
                Demographic Baseline Weighting
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Normalizes filing volumes against historical reporting density and census metrics to counteract selection bias in low-reporting wards.
              </p>

              {/* Interactive Equity Simulator */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Equity Weighting Mode</span>
                  <button
                    onClick={() => setDemographicWeightingActive(!demographicWeightingActive)}
                    className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                      demographicWeightingActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {demographicWeightingActive ? 'ACTIVE ✓' : 'DISABLED'}
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-500">Ward Historical Reporting Density:</span>
                    <span className="text-indigo-600">{districtDensity}% (Underrepresented)</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={districtDensity}
                    onChange={(e) => setDistrictDensity(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Calculated Priority Score:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-mono font-black text-indigo-700 dark:text-indigo-300">
                      {finalScore} / 100
                    </span>
                    {demographicWeightingActive && (
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                        +{Math.round((equityMultiplier - 1) * 100)}% Boost
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-medium italic">
              "Ensures structural faults in historically quiet districts receive immediate dispatch priority."
            </div>
          </div>

          {/* Recommendation 1.2: Computer Vision Closed-Loop Verification */}
          <div className="soft-card p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black uppercase text-indigo-600 dark:text-indigo-400 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
                  Recommendation 1.2
                </span>
                <Eye className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-heading font-black text-[#1A1A1A] dark:text-white">
                Automated Computer Vision Verification
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Deploys a vision AI model to compare original citizen "Before" photos with municipal crew "After" photos to confirm completion before ticket closure.
              </p>

              {/* Computer Vision Simulator */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border text-[10px] font-bold">
                    <span className="block text-slate-400 uppercase">Citizen Photo</span>
                    <span className="text-indigo-600 font-black">Before (Pothole)</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border text-[10px] font-bold">
                    <span className="block text-slate-400 uppercase">Crew Upload</span>
                    <span className="text-emerald-600 font-black">After (Asphalt Patch)</span>
                  </div>
                </div>

                <button
                  onClick={handleRunVisionScan}
                  disabled={visionScanning}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl transition-all cursor-pointer min-h-[40px] flex items-center justify-center space-x-2"
                >
                  {visionScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing Feature Matching...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run Vision AI Verification Scan</span>
                    </>
                  )}
                </button>

                {visionScanResult && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between font-black text-emerald-800 dark:text-emerald-200">
                      <span>Vision Match Result:</span>
                      <span>{visionScanResult.similarity}% Verified</span>
                    </div>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-300">
                      ✓ {visionScanResult.matchedFeatures} ground spatial features aligned. Ticket automatically verified & closed.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-medium italic">
              "Eliminates false resolution claims by validating repair work against physical location features."
            </div>
          </div>

          {/* Recommendation 1.3: Voice-to-Text & WhatsApp/SMS Gateway */}
          <div className="soft-card p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black uppercase text-indigo-600 dark:text-indigo-400 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
                  Recommendation 1.3
                </span>
                <Smartphone className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-heading font-black text-[#1A1A1A] dark:text-white">
                Voice & WhatsApp/SMS Gateway
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Expands input channels beyond mobile apps to lightweight SMS, WhatsApp, and voice hotlines for senior citizens and low-income residents.
              </p>

              {/* SMS Gateway Simulator */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center space-x-1.5 p-1 bg-white dark:bg-slate-800 rounded-xl border text-[11px] font-bold">
                  {(['WHATSAPP', 'SMS', 'VOICE'] as const).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setSmsChannel(ch)}
                      className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
                        smsChannel === ch ? 'bg-indigo-600 text-white font-black' : 'text-slate-600'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 block">Simulated Hotline Input:</label>
                  <input
                    type="text"
                    value={smsInput}
                    onChange={(e) => setSmsInput(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>

                <button
                  onClick={handleParseSms}
                  className="w-full py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-extrabold text-xs rounded-xl cursor-pointer hover:opacity-90 min-h-[38px]"
                >
                  Convert Input to Structured Report →
                </button>

                {parsedSmsReport && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 rounded-xl text-xs space-y-1">
                    <div className="font-extrabold text-amber-900 dark:text-amber-200">
                      Parsed: {parsedSmsReport.title}
                    </div>
                    <div className="text-[10px] text-amber-800 dark:text-amber-300 flex items-center justify-between">
                      <span>Category: {parsedSmsReport.category}</span>
                      <span>Confidence: {parsedSmsReport.confidence}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-medium italic">
              "Ensures zero digital divide — senior neighbors can simply call or text a local hotline."
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: OPERATIONAL & COMMUNITY GOVERNANCE */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="p-2.5 bg-emerald-600 text-white rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-black text-[#1A1A1A] dark:text-white">
              2. Operational & Community Governance
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Transparent capacity metrics, reporter feedback loops, and identity verification guardrails.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recommendation 2.1: Public SLA & Capacity Transparency */}
          <div className="soft-card p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black uppercase text-emerald-600 dark:text-emerald-400 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                  Recommendation 2.1
                </span>
                <BarChart3 className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-heading font-black text-[#1A1A1A] dark:text-white">
                Public SLA & Capacity Transparency
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Displays real-time municipal crew workload capacity alongside filing forms to manage expectations and maintain resident trust.
              </p>

              {/* Workload Capacity Gauges */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-700 dark:text-slate-300">Sanitation & Recycling Crew:</span>
                      <span className="text-rose-600 font-mono font-black">{capacitySanitation}% Capacity</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${capacitySanitation}%` }} />
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 block">Est. Dispatch Window: 3 Days</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-700 dark:text-slate-300">Road & Pothole Repair Crew:</span>
                      <span className="text-amber-600 font-mono font-black">{capacityRoads}% Capacity</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${capacityRoads}%` }} />
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 block">Est. Dispatch Window: 24 Hours</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-700 dark:text-slate-300">Streetlight Electrical Team:</span>
                      <span className="text-emerald-600 font-mono font-black">{capacityElectrical}% Capacity</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${capacityElectrical}%` }} />
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 block">Est. Dispatch Window: 12 Hours</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-medium italic">
              "Managing expectations up front prevents citizen frustration and duplicate ticket submissions."
            </div>
          </div>

          {/* Recommendation 2.2: Impact Verification & Feedback Loops */}
          <div className="soft-card p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black uppercase text-emerald-600 dark:text-emerald-400 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                  Recommendation 2.2
                </span>
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-heading font-black text-[#1A1A1A] dark:text-white">
                Reporter Closed-Loop Confirmation
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Sends automated 1-click confirmation requests to the original reporter when a ticket is marked fixed, awarding Karma upon feedback.
              </p>

              {/* Feedback Loop Simulator */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Incoming Notification</span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    "Municipal Crew completed work on Report #SF-9042 (Pothole Patch on 5th Ave). Is it fixed?"
                  </p>
                  <div className="flex items-center space-x-2 pt-1">
                    <button className="flex-1 py-1.5 bg-emerald-600 text-white font-black text-[11px] rounded-lg hover:bg-emerald-700 cursor-pointer">
                      ✓ Yes, Confirmed Fixed (+50 Karma)
                    </button>
                    <button className="flex-1 py-1.5 bg-rose-600 text-white font-black text-[11px] rounded-lg hover:bg-rose-700 cursor-pointer">
                      ✕ Still Broken (Dispute)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-medium italic">
              "Closes the feedback loop with direct resident empowerment and reward incentives."
            </div>
          </div>

          {/* Recommendation 2.3: Anti-Brigading & Identity Verification */}
          <div className="soft-card p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black uppercase text-emerald-600 dark:text-emerald-400 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                  Recommendation 2.3
                </span>
                <ShieldAlert className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-lg font-heading font-black text-[#1A1A1A] dark:text-white">
                Anti-Brigading & Resident Verification
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Ties upvotes and prioritization weights to verified local ward residence parameters to prevent inorganic reporting spikes.
              </p>

              {/* Anti-Brigading Simulator */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Verified Residence Filter</span>
                  <button
                    onClick={() => setAntiBrigadingActive(!antiBrigadingActive)}
                    className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                      antiBrigadingActive
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {antiBrigadingActive ? 'GUARDRAIL ON' : 'DISABLED'}
                  </button>
                </div>

                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-emerald-600">Verified Ward Residents:</span>
                    <span className="font-mono">{simulatedUpvotes.verifiedResident} upvotes (100% Weight)</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-rose-500">Unverified / Outside Ward:</span>
                    <span className="font-mono">{simulatedUpvotes.unverifiedOutside} upvotes ({antiBrigadingActive ? '0% Weight' : '100% Weight'})</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-medium italic">
              "Prevents organized bot brigading from distorting municipal resource allocation."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
