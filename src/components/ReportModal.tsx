import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  MapPin,
  Sparkles,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader2,
  Navigation,
  ShieldCheck,
  User,
  Mail,
  ArrowRight,
  ArrowLeft,
  Mic,
  Users,
  Building,
  Clock,
  ShieldAlert,
  Scan,
} from 'lucide-react';
import { ReportCategory, SeverityLevel, AIAnalysisResult, AiForensicResult } from '../types';
import { CATEGORY_CONFIG, SEVERITY_CONFIG, CATEGORY_SLA_HOURS } from '../lib/constants';
import { CategoryIcon } from './CategoryIcon';
import { CommunityMap } from './CommunityMap';
import { readFileAsBase64, reverseGeocode } from '../lib/utils';
import { GoogleAuthButton } from './GoogleAuthButton';
import { extractCityFromAddress, getWardsForCity, KNOWN_CITIES } from '../lib/geoUtils';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (newReportData: any) => Promise<void>;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmitReport }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [latitude, setLatitude] = useState<number>(37.7749);
  const [longitude, setLongitude] = useState<number>(-122.4194);
  const [addressText, setAddressText] = useState<string>('San Francisco, CA');
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<ReportCategory>('POTHOLE');
  const [severity, setSeverity] = useState<SeverityLevel>('MEDIUM');
  const [wardZone, setWardZone] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Dynamic geotagged city and administrative ward derivation
  const geotaggedCity = extractCityFromAddress(addressText, latitude, longitude);
  const availableWards = getWardsForCity(geotaggedCity);

  // Sync initial location with current geotagged city when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedCity = localStorage.getItem('cityscape_user_city');
      const savedLat = localStorage.getItem('cityscape_user_lat');
      const savedLng = localStorage.getItem('cityscape_user_lng');

      if (savedCity) {
        const known = KNOWN_CITIES.find((c) => c.name.toLowerCase() === savedCity.toLowerCase());
        const lat = savedLat ? parseFloat(savedLat) : (known ? known.lat : 33.5970);
        const lng = savedLng ? parseFloat(savedLng) : (known ? known.lng : 73.0449);
        setLatitude(lat);
        setLongitude(lng);
        setAddressText(`${savedCity}, Municipal Center`);
      }
    }
  }, [isOpen]);

  // Automatically keep wardZone in sync with the current geotagged city
  useEffect(() => {
    if (availableWards.length > 0) {
      const isCurrentWardValid = availableWards.some((w) => w.name === wardZone);
      if (!isCurrentWardValid) {
        setWardZone(availableWards[0].name);
      }
    }
  }, [addressText, geotaggedCity, latitude, longitude]);

  // Proxy Reporting for Seniors / Neighbors
  const [isProxyReport, setIsProxyReport] = useState<boolean>(false);
  const [proxyResidentName, setProxyResidentName] = useState<string>('');
  const [proxyResidentContact, setProxyResidentContact] = useState<string>('');

  // Voice Dictation State
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);

  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isGuest, setIsGuest] = useState<boolean>(true);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState<boolean>(false);
  const [isScanningForensics, setIsScanningForensics] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [forensicResult, setForensicResult] = useState<AiForensicResult | null>(null);

  if (!isOpen) return null;

  // Run live AI Forensic inspection on selected photo
  const runForensicCheck = async (imgData: string) => {
    setIsScanningForensics(true);
    try {
      const res = await fetch('/api/detect-ai-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imgData,
        }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data && data.result) {
          setForensicResult(data.result);
        }
      }
    } catch (err) {
      console.error('Forensic scan error:', err);
    } finally {
      setIsScanningForensics(false);
    }
  };

  // Handle location pin change on Step 1
  const handleLocationChange = async (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    setIsGeocoding(true);
    const addr = await reverseGeocode(lat, lng);
    setAddressText(addr);
    setIsGeocoding(false);
  };

  // Image File Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await readFileAsBase64(file);
      setImagePreview(base64);
      runForensicCheck(base64);
    } catch (err) {
      console.error('Image read failed', err);
    }
  };

  // Trigger Gemini AI photo / text auto-classification
  const handleAnalyzeWithAI = async () => {
    if (!imagePreview && !description && !title) {
      alert('Please upload a photo or write a short description first so AI can analyze it.');
      return;
    }

    setIsAnalyzingAI(true);
    try {
      const res = await fetch('/api/analyze-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          draftText: `${title} ${description}`.trim(),
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data && data.result) {
          const result: AIAnalysisResult = data.result;
          setAiAnalysisResult(result);
          if (result.title) setTitle(result.title);
          if (result.category) setCategory(result.category);
          if (result.severity) setSeverity(result.severity);
          if (result.description) setDescription(result.description);
        }
      }
    } catch (err) {
      console.error('AI Scan Error:', err);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  // Voice Dictation Handler
  const handleStartVoiceDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice dictation speech recognition is not supported in this browser. You can type directly in the box.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListeningVoice(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListeningVoice(false);
      };

      recognition.onerror = () => {
        setIsListeningVoice(false);
      };

      recognition.onend = () => {
        setIsListeningVoice(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition', err);
      setIsListeningVoice(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter an issue title.');
      return;
    }

    setIsSubmitting(true);
    try {
      const slaInfo = CATEGORY_SLA_HOURS[category] || CATEGORY_SLA_HOURS.OTHER;
      const targetHours = slaInfo.hours;
      const dueDate = new Date(Date.now() + targetHours * 3600 * 1000).toISOString();

      await onSubmitReport({
        title: title.trim(),
        description: description.trim(),
        category,
        severity,
        wardZone,
        latitude,
        longitude,
        addressText,
        imageUrls: imagePreview ? [imagePreview] : [],
        userName: userName.trim() || (isGuest ? 'Anonymous Resident' : 'Community Member'),
        userEmail: userEmail.trim(),
        isGuest,
        isProxyReport,
        proxyResidentName: isProxyReport ? proxyResidentName.trim() : undefined,
        proxyResidentContact: isProxyReport ? proxyResidentContact.trim() : undefined,
        slaHoursTarget: targetHours,
        slaDueDate: dueDate,
        slaStatus: 'ON_TRACK',
        aiForensics: forensicResult || undefined,
        isFlaggedAsAiFake: forensicResult?.isAiGenerated || false,
      });

      // Reset modal state
      setStep(1);
      setTitle('');
      setDescription('');
      setImagePreview(null);
      setAiAnalysisResult(null);
      setIsProxyReport(false);
      setProxyResidentName('');
      setProxyResidentContact('');
      onClose();
    } catch (err) {
      console.error('Submit report failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
        {/* Modal Header & Step Indicator */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between soft-card rounded-t-3xl rounded-b-none font-['Montserrat']">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#008080] dark:text-[#CCFF00]">
              Step {step} of 3 • Guided Civic Wizard
            </span>
            <h2 className="text-xl font-['Montserrat'] font-black text-[#1A1A1A] dark:text-white">
              {step === 1 && '1. Choose Category & Ward'}
              {step === 2 && '2. Pin Location & Proxy Report'}
              {step === 3 && '3. Details, Photo & Voice Dictation'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-full soft-pill cursor-pointer transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2">
          <div
            className="bg-[#008080] h-2 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Modal Body Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 font-['Montserrat']">
          {/* STEP 1: CATEGORY & WARD SELECTION */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Category Grid */}
              <div>
                <label className="text-sm font-extrabold text-slate-900 dark:text-white block mb-2">
                  Select Issue Category <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(Object.keys(CATEGORY_CONFIG) as ReportCategory[]).map((catKey) => {
                    const meta = CATEGORY_CONFIG[catKey];
                    const sla = CATEGORY_SLA_HOURS[catKey];
                    const isSelected = category === catKey;
                    return (
                      <button
                        key={catKey}
                        type="button"
                        onClick={() => setCategory(catKey)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex items-start space-x-3 cursor-pointer min-h-[58px] ${
                          isSelected
                            ? 'border-[#008080] bg-[#008080]/10 dark:bg-[#008080]/20 text-slate-900 dark:text-white ring-2 ring-[#008080] shadow-sm font-bold'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-[#008080]/50'
                        }`}
                      >
                        <div className="p-2 rounded-xl bg-[#008080]/20 dark:bg-[#008080]/30 text-[#008080] dark:text-[#CCFF00] shrink-0 mt-0.5">
                          <CategoryIcon category={catKey} className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-extrabold text-sm flex items-center justify-between">
                            <span className="truncate">{meta.label}</span>
                            {isSelected && <CheckCircle className="w-4 h-4 text-[#008080] shrink-0 ml-1" />}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {meta.description}
                          </p>
                          <p className="text-[10px] text-[#008080] dark:text-[#CCFF00] font-mono font-bold mt-1">
                            ⏱️ SLA Target: {sla?.label || '3 Days'}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ward & Zone Selection (Registered Govt / Election Commission Gazette) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-[#008080]" />
                    <span>Registered Municipal Ward / Election UC</span>
                  </label>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ECP & Municipal Gazette</span>
                  </span>
                </div>
                
                <select
                  value={wardZone}
                  onChange={(e) => setWardZone(e.target.value)}
                  className="w-full px-3.5 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#008080] cursor-pointer min-h-[48px]"
                >
                  {availableWards.map((w) => (
                    <option key={w.id} value={w.name}>
                      {w.name} {w.ecpCode ? `[${w.ecpCode}]` : ''} — (Officer: {w.officer})
                    </option>
                  ))}
                </select>

                {/* Registered Govt Authority Details */}
                {(() => {
                  const currentWard = availableWards.find((w) => w.name === wardZone) || availableWards[0];
                  if (!currentWard) return null;
                  return (
                    <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Building className="w-3.5 h-3.5 text-[#008080] shrink-0" />
                        <span>Reg Body: <strong className="text-slate-900 dark:text-white font-extrabold">{currentWard.govtBody || `${geotaggedCity} Municipal Authority`}</strong></span>
                      </div>
                      {currentWard.ecpCode && (
                        <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-[#008080] dark:text-[#CCFF00] bg-[#008080]/10 dark:bg-[#008080]/20 px-2 py-0.5 rounded-md border border-[#008080]/30">
                          Code: {currentWard.ecpCode}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Severity Selection */}
              <div>
                <label className="text-sm font-extrabold text-slate-900 dark:text-white block mb-2">
                  Hazard Severity Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(SEVERITY_CONFIG) as SeverityLevel[]).map((sev) => {
                    const conf = SEVERITY_CONFIG[sev];
                    const isSelected = severity === sev;
                    return (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSeverity(sev)}
                        className={`py-3 px-2 text-center rounded-2xl border text-xs font-black transition-all cursor-pointer min-h-[48px] ${
                          isSelected
                            ? `${conf.colorClass} ring-2 ring-[#008080] shadow-xs`
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {conf.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION PINPOINT & PROXY NEIGHBOR REPORTING */}
          {step === 2 && (
            <div className="space-y-4 font-['Montserrat']">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-[#008080]/10 dark:bg-[#008080]/20 border border-[#008080]/30 rounded-2xl text-xs text-[#1A1A1A] dark:text-[#f2f2f2] gap-3">
                <div className="flex items-start space-x-2.5">
                  <div className="p-2 bg-[#008080] text-white rounded-xl shrink-0 shadow-xs">
                    <MapPin className="w-4 h-4 text-[#CCFF00] animate-bounce" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#008080] dark:text-[#CCFF00]">
                      Issue Location
                    </span>
                    <p className="font-extrabold text-sm line-clamp-1">{addressText}</p>
                    <p className="text-[10px] opacity-75 font-mono">
                      Lat: {latitude.toFixed(5)}, Lng: {longitude.toFixed(5)} {isGeocoding && '• Reverse Geocoding...'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition((pos) => {
                        handleLocationChange(pos.coords.latitude, pos.coords.longitude);
                      });
                    } else {
                      alert('Geolocation is not supported by your browser.');
                    }
                  }}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 text-[#008080] dark:text-[#CCFF00] rounded-xl text-xs font-extrabold border border-[#008080]/30 hover:bg-[#008080]/10 transition-all cursor-pointer shrink-0 flex items-center space-x-1.5 min-h-[40px]"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#008080] dark:text-[#CCFF00]" />
                  <span>GPS My Location</span>
                </button>
              </div>

              {/* Interactive Map Picker */}
              <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
                <CommunityMap
                  reports={[]}
                  isPinningLocation={true}
                  pinnedLocation={{ lat: latitude, lng: longitude }}
                  onPinLocationChange={handleLocationChange}
                  onSelectReport={() => {}}
                  onUpvoteReport={() => {}}
                />

                <div className="absolute top-3 left-3 z-20 px-3 py-1.5 bg-slate-900/85 text-white backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-wider border border-white/20 shadow-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Map Pin Active</span>
                </div>
              </div>

              {/* Proxy Reporting Toggle ("Report for a Neighbor / Senior") */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl space-y-3">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isProxyReport}
                    onChange={(e) => setIsProxyReport(e.target.checked)}
                    className="w-5 h-5 text-[#008080] rounded border-amber-300 focus:ring-[#008080] cursor-pointer"
                  />
                  <div className="flex items-center space-x-1.5 font-extrabold text-amber-900 dark:text-amber-200 text-sm">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span>Report for a Senior / Neighbor (Proxy Mode)</span>
                  </div>
                </label>

                {isProxyReport && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200 dark:border-amber-800/60 animate-settled-in">
                    <div>
                      <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-1">
                        Neighbor / Resident Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mrs. Eleanor Vance (Apt 4B)"
                        value={proxyResidentName}
                        onChange={(e) => setProxyResidentName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-xl font-bold text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-1">
                        Phone Number or Contact
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. (415) 555-0192"
                        value={proxyResidentContact}
                        onChange={(e) => setProxyResidentContact(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-xl font-bold text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS, PHOTO & VOICE DICTATION */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Photo Upload & AI Forensic Scan */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Issue Photo (Optional)
                  </label>

                  {imagePreview && (
                    <button
                      onClick={handleAnalyzeWithAI}
                      disabled={isAnalyzingAI}
                      className="flex items-center space-x-1 px-2.5 py-1 bg-[#008080] text-[#CCFF00] rounded-lg text-xs font-bold shadow-xs hover:bg-[#006666] transition-all cursor-pointer min-h-[36px]"
                    >
                      {isAnalyzingAI ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-[#CCFF00]" />
                      )}
                      <span>AI Auto-Fill</span>
                    </button>
                  )}
                </div>

                {imagePreview ? (
                  <div className="space-y-3">
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setForensicResult(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-2 left-2 px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg text-[10px] font-mono font-bold text-white border border-slate-700 flex items-center space-x-1.5">
                        <Scan className="w-3.5 h-3.5 text-[#CCFF00]" />
                        <span>AI Forensic Guard Active</span>
                      </div>
                    </div>

                    {isScanningForensics && (
                      <div className="p-3 bg-[#008080]/20 border border-[#008080]/40 rounded-xl flex items-center space-x-3 text-xs text-[#008080] dark:text-[#CCFF00] animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin text-[#008080] dark:text-[#CCFF00] shrink-0" />
                        <span>Scanning photo for AI deepfake/synthetic markers...</span>
                      </div>
                    )}

                    {!isScanningForensics && forensicResult && (
                      <div className={`p-3 rounded-xl border text-xs flex items-start space-x-3 ${
                        forensicResult.isAiGenerated
                          ? 'bg-rose-950/60 border-rose-800 text-rose-200'
                          : 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                      }`}>
                        {forensicResult.isAiGenerated ? (
                          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        ) : (
                          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between font-bold">
                            <span>
                              {forensicResult.isAiGenerated
                                ? '⚠️ AI Synthetic Image Flagged'
                                : '🛡️ Authentic Camera Capture Verified'}
                            </span>
                            <span className="font-mono text-[10px] uppercase font-black px-2 py-0.5 rounded bg-slate-900/80">
                              {forensicResult.aiProbability}% AI Score
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#008080] rounded-2xl cursor-pointer bg-slate-50/50 dark:bg-slate-800/50 transition-colors min-h-[100px]">
                    <Camera className="w-7 h-7 text-[#008080] mb-1" />
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      Tap or Drag Photo
                    </span>
                    <span className="text-[10px] text-slate-400">PNG or JPG up to 10MB</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* Title Input */}
              <div>
                <label className="text-sm font-extrabold text-slate-900 dark:text-white block mb-1">
                  Issue Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep pothole right near crosswalk"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-3 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#008080] outline-none text-slate-900 dark:text-slate-100 font-bold min-h-[48px]"
                />
              </div>

              {/* Description + Hands-Free Voice Dictation Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Description
                  </label>

                  {/* Web Speech API Dictation Button */}
                  <button
                    type="button"
                    onClick={handleStartVoiceDictation}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer min-h-[38px] ${
                      isListeningVoice
                        ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400'
                        : 'bg-[#008080]/10 dark:bg-[#008080]/20 text-[#008080] dark:text-[#CCFF00] border border-[#008080]/30 hover:bg-[#008080]/20'
                    }`}
                  >
                    <Mic className="w-4 h-4 text-[#008080] dark:text-[#CCFF00]" />
                    <span>{isListeningVoice ? 'Listening Voice...' : 'Dictate Voice (Hands-Free)'}</span>
                  </button>
                </div>

                <textarea
                  rows={3}
                  placeholder="Provide details or tap Dictate Voice to speak your description hands-free..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#008080] outline-none text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* SLA Target Banner */}
              <div className="p-3 bg-[#008080]/10 dark:bg-[#008080]/20 border border-[#008080]/30 rounded-2xl flex items-center space-x-3 text-xs text-[#1A1A1A] dark:text-white">
                <Clock className="w-5 h-5 text-[#008080] shrink-0" />
                <div>
                  <span className="font-extrabold uppercase text-[10px] text-[#008080] dark:text-[#CCFF00] block">
                    Automated SLA Response Target
                  </span>
                  <span className="font-bold">
                    {CATEGORY_SLA_HOURS[category]?.label || '3 Business Days'} for dispatch & repair.
                  </span>
                </div>
              </div>

              {/* Reporter Identity */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <label className="text-xs font-extrabold text-slate-900 dark:text-white block">
                  Your Reporter Contact
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsGuest(true)}
                    className={`p-3 rounded-2xl border text-left text-xs font-extrabold transition-all min-h-[48px] ${
                      isGuest
                        ? 'border-[#008080] bg-[#008080]/10 dark:bg-[#008080]/20 text-[#008080] dark:text-[#CCFF00] ring-2 ring-[#008080]'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600'
                    }`}
                  >
                    <User className="w-4 h-4 mb-0.5 text-[#008080]" />
                    <div>Anonymous Resident</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsGuest(false)}
                    className={`p-3 rounded-2xl border text-left text-xs font-extrabold transition-all min-h-[48px] ${
                      !isGuest
                        ? 'border-[#008080] bg-[#008080]/10 dark:bg-[#008080]/20 text-[#008080] dark:text-[#CCFF00] ring-2 ring-[#008080]'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mb-0.5 text-[#008080]" />
                    <div>Verified Citizen</div>
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none min-h-[44px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 soft-card rounded-b-3xl rounded-t-none flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="btn-soft-tactile flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer min-h-[48px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as any)}
              className="btn-primary-designer flex items-center space-x-2 px-6 py-3 rounded-2xl text-xs font-black cursor-pointer min-h-[48px]"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-primary-designer flex items-center space-x-2 px-7 py-3 rounded-2xl text-xs font-black cursor-pointer disabled:opacity-50 min-h-[48px]"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>Submit Issue Ticket</span>
            </button>
          )}
        </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
