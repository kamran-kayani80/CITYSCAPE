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

      const known = savedCity ? KNOWN_CITIES.find((c) => c.name.toLowerCase() === savedCity.toLowerCase()) : null;
      const parsedLat = savedLat ? parseFloat(savedLat) : NaN;
      const parsedLng = savedLng ? parseFloat(savedLng) : NaN;
      const lat = !isNaN(parsedLat) && isFinite(parsedLat) ? parsedLat : (known ? known.lat : 37.7749);
      const lng = !isNaN(parsedLng) && isFinite(parsedLng) ? parsedLng : (known ? known.lng : -122.4194);
      setLatitude(lat);
      setLongitude(lng);
      if (savedCity) {
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
    if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) return;
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
      } else {
        throw new Error('Offline or invalid response');
      }
    } catch (err) {
      console.warn('AI Scan offline fallback activated:', err);
      const textLower = `${title} ${description}`.toLowerCase();
      let fallbackCat: ReportCategory = category || 'ROADS_TRAFFIC';
      if (textLower.includes('water') || textLower.includes('pipe') || textLower.includes('leak')) fallbackCat = 'WATER_LEAK';
      else if (textLower.includes('light') || textLower.includes('power') || textLower.includes('wire')) fallbackCat = 'LIGHTING';
      else if (textLower.includes('trash') || textLower.includes('waste') || textLower.includes('garbage')) fallbackCat = 'SANITATION';
      else if (textLower.includes('pothole') || textLower.includes('road')) fallbackCat = 'POTHOLE';

      setCategory(fallbackCat);
      setAiAnalysisResult({
        title: title || 'Underground Facility Request',
        category: fallbackCat,
        severity: severity || 'MEDIUM',
        description: description || 'Issue recorded in offline mode.',
        suggestedTags: ['#UndergroundSync', '#SubSurfaceReport'],
      });
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
        <div className="p-4 sm:p-5 border-b border-[#163832] flex items-center justify-between bg-[#051F20] text-[#DAF1DE] rounded-t-3xl rounded-b-none font-['Montserrat'] shadow-md">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#8EB69B]">
              Step {step} of 3 • Guided Civic Wizard
            </span>
            <h2 className="text-xl font-['Montserrat'] font-black text-[#DAF1DE]">
              {step === 1 && '1. Choose Category & Ward'}
              {step === 2 && '2. Pin Location & Proxy Report'}
              {step === 3 && '3. Details, Photo & Voice Dictation'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8EB69B] hover:text-[#DAF1DE] hover:bg-[#0B2B26] rounded-full cursor-pointer transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-[#0B2B26] h-2.5 shrink-0">
          <div
            className="bg-[#8EB69B] h-2.5 transition-all duration-300 shadow-sm"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Form Container with Scrollable Body & Sticky Footer */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden font-['Montserrat'] bg-[#DAF1DE]/20 dark:bg-[#051F20]/40">
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 max-h-[calc(92vh-140px)]">
          {/* STEP 1: CATEGORY & WARD SELECTION */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Category Grid */}
              <div>
                <label className="text-sm font-extrabold text-[#051F20] dark:text-[#DAF1DE] block mb-2">
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
                            ? 'border-[#8EB69B] bg-[#163832] text-[#DAF1DE] ring-2 ring-[#8EB69B] shadow-md font-bold'
                            : 'border-[#235347]/30 dark:border-[#163832] bg-[#DAF1DE] dark:bg-[#0B2B26] text-[#051F20] dark:text-[#DAF1DE] hover:border-[#8EB69B] hover:bg-[#DAF1DE]/90'
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-[#8EB69B] text-[#051F20]'
                            : 'bg-[#235347]/20 dark:bg-[#163832] text-[#235347] dark:text-[#8EB69B]'
                        }`}>
                          <CategoryIcon category={catKey} className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-extrabold text-sm flex items-center justify-between">
                            <span className="truncate">{meta.label}</span>
                            {isSelected && <CheckCircle className="w-4 h-4 text-[#8EB69B] shrink-0 ml-1" />}
                          </div>
                          <p className={`text-[11px] line-clamp-1 mt-0.5 ${isSelected ? 'text-[#8EB69B]' : 'text-[#163832]/80 dark:text-[#8EB69B]/80'}`}>
                            {meta.description}
                          </p>
                          <p className={`text-[10px] font-mono font-bold mt-1 ${isSelected ? 'text-[#DAF1DE]' : 'text-[#235347] dark:text-[#8EB69B]'}`}>
                            ⏱️ SLA Target: {sla?.label || '3 Days'}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ward & Zone Selection (Registered Govt / Election Commission Gazette) */}
              <div className="p-4 rounded-2xl bg-[#DAF1DE]/70 dark:bg-[#0B2B26]/80 border border-[#235347]/30 dark:border-[#163832]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-extrabold text-[#051F20] dark:text-[#DAF1DE] flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-[#235347] dark:text-[#8EB69B]" />
                    <span>Registered Municipal Ward / Election UC</span>
                  </label>
                  <span className="text-[11px] font-bold text-[#DAF1DE] bg-[#163832] px-2.5 py-1 rounded-full border border-[#235347] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8EB69B]" />
                    <span>ECP & Municipal Gazette</span>
                  </span>
                </div>
                
                <select
                  value={wardZone}
                  onChange={(e) => setWardZone(e.target.value)}
                  className="w-full px-3.5 py-3 bg-[#FFFFFF] dark:bg-[#051F20] border border-[#235347] dark:border-[#163832] rounded-2xl font-bold text-xs sm:text-sm text-[#051F20] dark:text-[#DAF1DE] outline-none focus:ring-2 focus:ring-[#8EB69B] cursor-pointer min-h-[48px]"
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
                    <div className="mt-2.5 p-3 rounded-xl bg-[#163832] border border-[#235347] text-xs flex flex-wrap items-center justify-between gap-2 text-[#DAF1DE]">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Building className="w-3.5 h-3.5 text-[#8EB69B] shrink-0" />
                        <span>Reg Body: <strong className="text-[#DAF1DE] font-extrabold">{currentWard.govtBody || `${geotaggedCity} Municipal Authority`}</strong></span>
                      </div>
                      {currentWard.ecpCode && (
                        <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-[#8EB69B] bg-[#051F20] px-2 py-0.5 rounded-md border border-[#235347]">
                          Code: {currentWard.ecpCode}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Severity Selection */}
              <div>
                <label className="text-sm font-extrabold text-[#051F20] dark:text-[#DAF1DE] block mb-2">
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
                            ? 'bg-[#235347] border-[#8EB69B] text-[#DAF1DE] ring-2 ring-[#8EB69B] shadow-sm'
                            : 'bg-[#DAF1DE] dark:bg-[#0B2B26] border-[#235347]/40 dark:border-[#163832] text-[#051F20] dark:text-[#DAF1DE] hover:border-[#8EB69B]'
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-[#163832] border border-[#235347] rounded-2xl text-xs text-[#DAF1DE] gap-3 shadow-sm">
                <div className="flex items-start space-x-2.5">
                  <div className="p-2 bg-[#0B2B26] text-[#8EB69B] rounded-xl shrink-0 border border-[#235347]">
                    <MapPin className="w-4 h-4 text-[#8EB69B] animate-bounce" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#8EB69B]">
                      Issue Location
                    </span>
                    <p className="font-extrabold text-sm line-clamp-1 text-[#DAF1DE]">{addressText}</p>
                    <p className="text-[10px] text-[#8EB69B] font-mono">
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
                  className="px-3.5 py-2 bg-[#235347] hover:bg-[#0B2B26] text-[#DAF1DE] rounded-xl text-xs font-extrabold border border-[#8EB69B]/40 transition-all cursor-pointer shrink-0 flex items-center space-x-1.5 min-h-[40px]"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#8EB69B]" />
                  <span>GPS My Location</span>
                </button>
              </div>

              {/* Interactive Map Picker */}
              <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-[#235347] shadow-inner">
                <CommunityMap
                  reports={[]}
                  isPinningLocation={true}
                  pinnedLocation={{ lat: latitude, lng: longitude }}
                  onPinLocationChange={handleLocationChange}
                  onSelectReport={() => {}}
                  onUpvoteReport={() => {}}
                />

                <div className="absolute top-3 left-3 z-20 px-3 py-1.5 bg-[#051F20]/90 text-[#DAF1DE] backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-wider border border-[#8EB69B]/40 shadow-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8EB69B] animate-ping" />
                  <span>Map Pin Active</span>
                </div>
              </div>

              {/* Proxy Reporting Toggle ("Report for a Senior / Neighbor") */}
              <div className="p-4 bg-[#0B2B26] border border-[#8EB69B]/50 rounded-2xl space-y-3 text-[#DAF1DE] shadow-sm">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isProxyReport}
                    onChange={(e) => setIsProxyReport(e.target.checked)}
                    className="w-5 h-5 text-[#235347] rounded border-[#8EB69B] focus:ring-[#8EB69B] cursor-pointer"
                  />
                  <div className="flex items-center space-x-1.5 font-extrabold text-[#DAF1DE] text-sm">
                    <Users className="w-4 h-4 text-[#8EB69B]" />
                    <span>Report for a Senior / Neighbor (Proxy Mode)</span>
                  </div>
                </label>

                {isProxyReport && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-[#235347] animate-settled-in">
                    <div>
                      <label className="block text-[11px] font-bold text-[#8EB69B] mb-1">
                        Neighbor / Resident Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mrs. Eleanor Vance (Apt 4B)"
                        value={proxyResidentName}
                        onChange={(e) => setProxyResidentName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#051F20] border border-[#235347] focus:border-[#8EB69B] outline-none rounded-xl font-bold text-[#DAF1DE] placeholder-[#8EB69B]/60"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#8EB69B] mb-1">
                        Phone Number or Contact
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. (415) 555-0192"
                        value={proxyResidentContact}
                        onChange={(e) => setProxyResidentContact(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#051F20] border border-[#235347] focus:border-[#8EB69B] outline-none rounded-xl font-bold text-[#DAF1DE] placeholder-[#8EB69B]/60"
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
                  <label className="text-sm font-extrabold text-[#051F20] dark:text-[#DAF1DE]">
                    Issue Photo (Optional)
                  </label>

                  {imagePreview && (
                    <button
                      onClick={handleAnalyzeWithAI}
                      disabled={isAnalyzingAI}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-[#235347] text-[#DAF1DE] border border-[#8EB69B]/40 rounded-lg text-xs font-bold shadow-xs hover:bg-[#163832] transition-all cursor-pointer min-h-[36px]"
                    >
                      {isAnalyzingAI ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8EB69B]" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-[#8EB69B]" />
                      )}
                      <span>AI Auto-Fill</span>
                    </button>
                  )}
                </div>

                {imagePreview ? (
                  <div className="space-y-3">
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-[#235347] group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setForensicResult(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-[#051F20]/90 text-[#DAF1DE] rounded-full hover:bg-red-600 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center border border-[#235347]"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-2 left-2 px-3 py-1 bg-[#051F20]/90 backdrop-blur-md rounded-lg text-[10px] font-mono font-bold text-[#DAF1DE] border border-[#235347] flex items-center space-x-1.5">
                        <Scan className="w-3.5 h-3.5 text-[#8EB69B]" />
                        <span>AI Forensic Guard Active</span>
                      </div>
                    </div>

                    {isScanningForensics && (
                      <div className="p-3 bg-[#163832] border border-[#235347] rounded-xl flex items-center space-x-3 text-xs text-[#8EB69B] animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin text-[#8EB69B] shrink-0" />
                        <span>Scanning photo for AI deepfake/synthetic markers...</span>
                      </div>
                    )}

                    {!isScanningForensics && forensicResult && (
                      <div className="p-3 rounded-xl border border-[#235347] bg-[#0B2B26] text-[#DAF1DE] text-xs flex items-start space-x-3">
                        {forensicResult.isAiGenerated ? (
                          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        ) : (
                          <ShieldCheck className="w-5 h-5 text-[#8EB69B] shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between font-bold">
                            <span>
                              {forensicResult.isAiGenerated
                                ? '⚠️ AI Synthetic Image Flagged'
                                : '🛡️ Authentic Camera Capture Verified'}
                            </span>
                            <span className="font-mono text-[10px] uppercase font-black px-2 py-0.5 rounded bg-[#051F20] text-[#8EB69B]">
                              {forensicResult.aiProbability}% AI Score
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#235347] hover:border-[#8EB69B] rounded-2xl cursor-pointer bg-[#DAF1DE]/70 dark:bg-[#0B2B26]/80 transition-colors min-h-[100px]">
                    <Camera className="w-7 h-7 text-[#163832] dark:text-[#8EB69B] mb-1" />
                    <span className="text-xs font-extrabold text-[#051F20] dark:text-[#DAF1DE]">
                      Tap or Drag Photo
                    </span>
                    <span className="text-[10px] text-[#163832]/80 dark:text-[#8EB69B]">PNG or JPG up to 10MB</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* Title Input */}
              <div>
                <label className="text-sm font-extrabold text-[#051F20] dark:text-[#DAF1DE] block mb-1">
                  Issue Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep pothole right near crosswalk"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-3 text-sm bg-[#DAF1DE]/60 dark:bg-[#0B2B26] border border-[#235347] rounded-xl focus:ring-2 focus:ring-[#8EB69B] focus:border-[#8EB69B] outline-none text-[#051F20] dark:text-[#DAF1DE] font-bold min-h-[48px]"
                />
              </div>

              {/* Description + Hands-Free Voice Dictation Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-extrabold text-[#051F20] dark:text-[#DAF1DE]">
                    Description
                  </label>

                  {/* Web Speech API Dictation Button */}
                  <button
                    type="button"
                    onClick={handleStartVoiceDictation}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer min-h-[38px] ${
                      isListeningVoice
                        ? 'bg-[#051F20] text-[#DAF1DE] ring-2 ring-[#8EB69B] animate-pulse'
                        : 'bg-[#235347] hover:bg-[#163832] text-[#DAF1DE] border border-[#8EB69B]/40'
                    }`}
                  >
                    <Mic className="w-4 h-4 text-[#8EB69B]" />
                    <span>{isListeningVoice ? 'Listening Voice...' : 'Dictate Voice (Hands-Free)'}</span>
                  </button>
                </div>

                <textarea
                  rows={3}
                  placeholder="Provide details or tap Dictate Voice to speak your description hands-free..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#DAF1DE]/60 dark:bg-[#0B2B26] border border-[#235347] rounded-xl focus:ring-2 focus:ring-[#8EB69B] focus:border-[#8EB69B] outline-none text-[#051F20] dark:text-[#DAF1DE]"
                />
              </div>

              {/* SLA Target Banner */}
              <div className="p-3 bg-[#163832] border border-[#235347] rounded-2xl flex items-center space-x-3 text-xs text-[#DAF1DE]">
                <Clock className="w-5 h-5 text-[#8EB69B] shrink-0" />
                <div>
                  <span className="font-extrabold uppercase text-[10px] text-[#8EB69B] block">
                    Automated SLA Response Target
                  </span>
                  <span className="font-bold">
                    {CATEGORY_SLA_HOURS[category]?.label || '3 Business Days'} for dispatch & repair.
                  </span>
                </div>
              </div>

              {/* Reporter Identity */}
              <div className="pt-2 border-t border-[#235347] space-y-3">
                <label className="text-xs font-extrabold text-[#051F20] dark:text-[#DAF1DE] block">
                  Your Reporter Contact
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsGuest(true)}
                    className={`p-3 rounded-2xl border text-left text-xs font-extrabold transition-all min-h-[48px] ${
                      isGuest
                        ? 'bg-[#163832] border-[#8EB69B] text-[#DAF1DE] ring-2 ring-[#8EB69B]'
                        : 'bg-[#DAF1DE] dark:bg-[#0B2B26] border-[#235347]/40 text-[#051F20] dark:text-[#DAF1DE]'
                    }`}
                  >
                    <User className="w-4 h-4 mb-0.5 text-[#8EB69B]" />
                    <div>Anonymous Resident</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsGuest(false)}
                    className={`p-3 rounded-2xl border text-left text-xs font-extrabold transition-all min-h-[48px] ${
                      !isGuest
                        ? 'bg-[#163832] border-[#8EB69B] text-[#DAF1DE] ring-2 ring-[#8EB69B]'
                        : 'bg-[#DAF1DE] dark:bg-[#0B2B26] border-[#235347]/40 text-[#051F20] dark:text-[#DAF1DE]'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mb-0.5 text-[#8EB69B]" />
                    <div>Verified Citizen</div>
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#DAF1DE]/60 dark:bg-[#051F20] border border-[#235347] rounded-xl outline-none text-[#051F20] dark:text-[#DAF1DE] min-h-[44px]"
                />
              </div>
            </div>
          )}
          </div>

          {/* Modal Footer Controls - Sticky at bottom */}
          <div className="p-4 border-t border-[#163832] rounded-b-3xl rounded-t-none flex items-center justify-between shrink-0 bg-[#051F20] backdrop-blur-md sticky bottom-0 z-20">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-[#0B2B26] hover:bg-[#163832] text-[#DAF1DE] border border-[#235347] rounded-xl text-xs font-bold cursor-pointer min-h-[48px] transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-[#8EB69B]" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as any)}
                className="flex items-center space-x-2 px-6 py-3.5 bg-[#235347] hover:bg-[#163832] text-[#DAF1DE] border border-[#8EB69B] rounded-2xl text-xs font-black cursor-pointer min-h-[52px] transition-all shadow-md"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4 text-[#8EB69B]" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-7 py-3.5 bg-[#235347] hover:bg-[#163832] text-[#DAF1DE] border border-[#8EB69B] rounded-2xl text-xs font-black cursor-pointer disabled:opacity-50 min-h-[52px] transition-all shadow-md"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#8EB69B]" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-[#8EB69B]" />
                )}
                <span>Submit Neighborhood Request</span>
              </button>
            )}
          </div>
        </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
