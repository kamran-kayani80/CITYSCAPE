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
import { extractCityFromAddress, getWardsForCity, KNOWN_CITIES, getMunicipalCorporationForCity } from '../lib/geoUtils';

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
      const derivedCity = geotaggedCity || extractCityFromAddress(addressText, latitude, longitude);
      const derivedMuni = getMunicipalCorporationForCity(derivedCity);

      await onSubmitReport({
        title: title.trim(),
        description: description.trim(),
        category,
        severity,
        wardZone,
        latitude,
        longitude,
        addressText,
        cityName: derivedCity,
        municipality: derivedMuni,
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
          className="relative w-full max-w-2xl bg-white dark:bg-[#0A2540] rounded-xl shadow-2xl border-1.5 border-[#CBD5E1] dark:border-slate-700 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
        {/* Modal Header & Step Indicator */}
        <div className="p-5 border-b-1.5 border-[#CBD5E1] dark:border-slate-700 flex items-center justify-between bg-[#0A2540] text-white rounded-t-xl rounded-b-none shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Step {step} of 3 • Guided Civic Request
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
              {step === 1 && '1. Choose Category & Ward'}
              {step === 2 && '2. Pin Location & Neighbor Details'}
              {step === 3 && '3. Details, Photo & Voice Dictation'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
            title="Close modal"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 shrink-0">
          <div
            className="bg-[#006D5B] dark:bg-teal-400 h-2.5 transition-all duration-300 shadow-sm"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Form Container with Scrollable Body & Sticky Footer */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-50/50 dark:bg-[#071B2F]/40">
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 max-h-[calc(92vh-140px)]">
          {/* STEP 1: CATEGORY & WARD SELECTION */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Category Grid */}
              <div>
                <label className="text-base font-bold text-[#111827] dark:text-white block mb-2.5">
                  Select Report Category <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.keys(CATEGORY_CONFIG) as ReportCategory[]).map((catKey) => {
                    const meta = CATEGORY_CONFIG[catKey];
                    const sla = CATEGORY_SLA_HOURS[catKey];
                    const isSelected = category === catKey;
                    return (
                      <button
                        key={catKey}
                        type="button"
                        onClick={() => setCategory(catKey)}
                        className={`p-4 rounded-xl border-1.5 text-left transition-all flex items-start space-x-3.5 cursor-pointer min-h-[64px] ${
                          isSelected
                            ? 'border-[#0A2540] dark:border-teal-400 bg-[#0A2540] text-white ring-2 ring-[#006D5B] shadow-md font-bold'
                            : 'border-[#CBD5E1] dark:border-slate-700 bg-white dark:bg-[#0A2540] text-[#111827] dark:text-white hover:border-slate-400'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-[#006D5B] text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-[#006D5B] dark:text-teal-300'
                        }`}>
                          <CategoryIcon category={catKey} className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-base flex items-center justify-between">
                            <span className="truncate">{meta.label}</span>
                            {isSelected && <CheckCircle className="w-5 h-5 text-teal-300 shrink-0 ml-1" />}
                          </div>
                          <p className={`text-xs line-clamp-1 mt-0.5 ${isSelected ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'}`}>
                            {meta.description}
                          </p>
                          <p className={`text-xs font-mono font-bold mt-1.5 ${isSelected ? 'text-teal-200' : 'text-[#B45309]'}`}>
                            ⏱️ Expected Resolution: {sla?.label || '3 Days'}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ward & Zone Selection */}
              <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0A2540] border-1.5 border-[#CBD5E1] dark:border-slate-700 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <label className="text-base font-bold text-[#111827] dark:text-white flex items-center gap-2">
                    <Building className="w-5 h-5 text-[#006D5B] dark:text-teal-300" />
                    <span>Registered Municipal Ward</span>
                  </label>
                  <span className="text-xs font-bold text-[#006D5B] dark:text-teal-200 bg-[#E6F4F1] dark:bg-[#004D40] px-3 py-1 rounded-xl border border-[#006D5B]/30 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#006D5B] dark:text-teal-200" />
                    <span>Gazette Verified</span>
                  </span>
                </div>
                
                <select
                  value={wardZone}
                  onChange={(e) => setWardZone(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl font-semibold text-base text-[#111827] dark:text-white outline-none focus:border-[#0A2540] cursor-pointer min-h-[56px]"
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
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071B2F] border border-slate-200 dark:border-slate-700 text-xs flex flex-wrap items-center justify-between gap-2 text-[#111827] dark:text-slate-200">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Building className="w-4 h-4 text-[#006D5B] dark:text-teal-300 shrink-0" />
                        <span>Public Team: <strong>{currentWard.govtBody || `${geotaggedCity} Public Works`}</strong></span>
                      </div>
                      {currentWard.ecpCode && (
                        <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#006D5B] dark:text-teal-300 bg-white dark:bg-[#0A2540] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                          Code: {currentWard.ecpCode}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Severity Selection */}
              <div>
                <label className="text-base font-bold text-[#111827] dark:text-white block mb-2.5">
                  Hazard Priority Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(Object.keys(SEVERITY_CONFIG) as SeverityLevel[]).map((sev) => {
                    const conf = SEVERITY_CONFIG[sev];
                    const isSelected = severity === sev;
                    return (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSeverity(sev)}
                        className={`py-3.5 px-3 text-center rounded-xl border-1.5 text-sm font-bold transition-all cursor-pointer min-h-[52px] ${
                          isSelected
                            ? 'bg-[#0A2540] dark:bg-[#006D5B] border-[#0A2540] text-white ring-2 ring-[#006D5B] shadow-sm'
                            : 'bg-white dark:bg-[#0A2540] border-[#CBD5E1] dark:border-slate-700 text-[#111827] dark:text-white hover:border-slate-400'
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
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-[#0A2540] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs text-[#111827] dark:text-white gap-3 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-[#E6F4F1] dark:bg-[#004D40] text-[#006D5B] dark:text-teal-200 rounded-xl shrink-0 border border-[#006D5B]/30">
                    <MapPin className="w-5 h-5 text-[#006D5B] dark:text-teal-200 animate-bounce" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#006D5B] dark:text-teal-300">
                      Report Location
                    </span>
                    <p className="font-bold text-base line-clamp-1 text-[#111827] dark:text-white">{addressText}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      Lat: {latitude.toFixed(5)}, Lng: {longitude.toFixed(5)} {isGeocoding && '• Reverse Geocoding...'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          if (pos && pos.coords && !isNaN(pos.coords.latitude) && !isNaN(pos.coords.longitude) && isFinite(pos.coords.latitude) && isFinite(pos.coords.longitude)) {
                            handleLocationChange(pos.coords.latitude, pos.coords.longitude);
                          }
                        },
                        (err) => {
                          console.warn('Geolocation error in ReportModal:', err);
                        },
                        { enableHighAccuracy: true, timeout: 6000 }
                      );
                    } else {
                      alert('Geolocation is not supported by your browser.');
                    }
                  }}
                  className="px-4 py-2.5 bg-[#006D5B] hover:bg-[#0A2540] text-white rounded-xl text-sm font-bold transition-all cursor-pointer shrink-0 flex items-center space-x-2 min-h-[48px]"
                >
                  <Navigation className="w-4 h-4 text-white" />
                  <span>GPS My Location</span>
                </button>
              </div>

              {/* Interactive Map Picker */}
              <div className="relative h-64 w-full rounded-xl overflow-hidden border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-inner">
                <CommunityMap
                  reports={[]}
                  isPinningLocation={true}
                  pinnedLocation={{ lat: latitude, lng: longitude }}
                  onPinLocationChange={handleLocationChange}
                  onSelectReport={() => {}}
                  onUpvoteReport={() => {}}
                />

                <div className="absolute top-3 left-3 z-20 px-3.5 py-2 bg-[#0A2540]/90 text-white backdrop-blur-md rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-700 shadow-md flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
                  <span>Map Pin Active</span>
                </div>
              </div>

              {/* Proxy Reporting Toggle ("Report for a Senior / Neighbor") */}
              <div className="p-4 sm:p-5 bg-white dark:bg-[#0A2540] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl space-y-3.5 shadow-sm">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isProxyReport}
                    onChange={(e) => setIsProxyReport(e.target.checked)}
                    className="w-5 h-5 text-[#006D5B] rounded border-[#CBD5E1] focus:ring-[#006D5B] cursor-pointer"
                  />
                  <div className="flex items-center space-x-2 font-bold text-[#111827] dark:text-white text-base">
                    <Users className="w-5 h-5 text-[#006D5B] dark:text-teal-300" />
                    <span>Report for a Senior / Neighbor (Proxy Mode)</span>
                  </div>
                </label>

                {isProxyReport && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3 border-t-1.5 border-[#CBD5E1] dark:border-slate-700">
                    <div>
                      <label className="block text-xs font-bold text-[#111827] dark:text-white mb-1.5">
                        Neighbor Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mrs. Eleanor Vance (Apt 4B)"
                        value={proxyResidentName}
                        onChange={(e) => setProxyResidentName(e.target.value)}
                        className="w-full px-3.5 py-3 text-sm bg-white dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 focus:border-[#0A2540] outline-none rounded-xl font-semibold text-[#111827] dark:text-white placeholder-slate-400 min-h-[52px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#111827] dark:text-white mb-1.5">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. (415) 555-0192"
                        value={proxyResidentContact}
                        onChange={(e) => setProxyResidentContact(e.target.value)}
                        className="w-full px-3.5 py-3 text-sm bg-white dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 focus:border-[#0A2540] outline-none rounded-xl font-semibold text-[#111827] dark:text-white placeholder-slate-400 min-h-[52px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS, PHOTO & VOICE DICTATION */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Photo Upload & AI Forensic Scan */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-base font-bold text-[#111827] dark:text-white">
                    Report Photo (Optional)
                  </label>

                  {imagePreview && (
                    <button
                      onClick={handleAnalyzeWithAI}
                      disabled={isAnalyzingAI}
                      className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#006D5B] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#0A2540] transition-all cursor-pointer min-h-[44px]"
                    >
                      {isAnalyzingAI ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-white" />
                      )}
                      <span>AI Auto-Fill</span>
                    </button>
                  )}
                </div>

                {imagePreview ? (
                  <div className="space-y-3">
                    <div className="relative h-48 w-full rounded-xl overflow-hidden border-1.5 border-[#CBD5E1] dark:border-slate-700 group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setForensicResult(null);
                        }}
                        className="absolute top-2.5 right-2.5 p-2 bg-[#0A2540]/90 text-white rounded-xl hover:bg-red-600 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center border border-slate-700"
                        aria-label="Remove photo"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="absolute bottom-2.5 left-2.5 px-3 py-1.5 bg-[#0A2540]/90 backdrop-blur-md rounded-xl text-xs font-mono font-bold text-teal-300 border border-slate-700 flex items-center space-x-2">
                        <Scan className="w-4 h-4 text-teal-300" />
                        <span>AI Forensic Guard Active</span>
                      </div>
                    </div>

                    {isScanningForensics && (
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl flex items-center space-x-3 text-xs text-[#006D5B] dark:text-teal-300 animate-pulse font-bold">
                        <Loader2 className="w-4 h-4 animate-spin text-[#006D5B] dark:text-teal-300 shrink-0" />
                        <span>Scanning photo for synthetic markers...</span>
                      </div>
                    )}

                    {!isScanningForensics && forensicResult && (
                      <div className="p-3.5 rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 bg-white dark:bg-[#0A2540] text-[#111827] dark:text-white text-xs flex items-start space-x-3">
                        {forensicResult.isAiGenerated ? (
                          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <ShieldCheck className="w-5 h-5 text-[#006D5B] dark:text-teal-300 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between font-bold">
                            <span>
                              {forensicResult.isAiGenerated
                                ? '⚠️ AI Synthetic Image Flagged'
                                : '🛡️ Authentic Camera Capture Verified'}
                            </span>
                            <span className="font-mono text-xs uppercase font-bold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[#006D5B] dark:text-teal-300">
                              {forensicResult.aiProbability}% AI Score
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#CBD5E1] dark:border-slate-700 hover:border-[#006D5B] rounded-xl cursor-pointer bg-white dark:bg-[#0A2540] transition-colors min-h-[120px]">
                    <Camera className="w-8 h-8 text-[#006D5B] dark:text-teal-300 mb-1.5" />
                    <span className="text-sm font-bold text-[#111827] dark:text-white">
                      Tap or Drag Photo to Attach
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">PNG or JPG up to 10MB</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* Title Input */}
              <div>
                <label className="text-base font-bold text-[#111827] dark:text-white block mb-1.5">
                  Report Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep pothole near crosswalk"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3.5 text-base bg-white dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl focus:border-[#0A2540] outline-none text-[#111827] dark:text-white font-semibold min-h-[56px]"
                />
              </div>

              {/* Description + Hands-Free Voice Dictation Button */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-base font-bold text-[#111827] dark:text-white">
                    Description
                  </label>

                  {/* Web Speech API Dictation Button */}
                  <button
                    type="button"
                    onClick={handleStartVoiceDictation}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer min-h-[44px] ${
                      isListeningVoice
                        ? 'bg-[#B45309] text-white animate-pulse'
                        : 'bg-[#006D5B] hover:bg-[#0A2540] text-white shadow-sm'
                    }`}
                  >
                    <Mic className="w-4 h-4 text-white" />
                    <span>{isListeningVoice ? 'Listening...' : 'Dictate Voice (Hands-Free)'}</span>
                  </button>
                </div>

                <textarea
                  rows={3}
                  placeholder="Provide details or tap Dictate Voice to speak your description hands-free..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 text-base bg-white dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl focus:border-[#0A2540] outline-none text-[#111827] dark:text-white font-normal"
                />
              </div>

              {/* Expected Resolution Target Banner */}
              <div className="p-4 bg-white dark:bg-[#0A2540] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl flex items-center space-x-3.5 text-xs text-[#111827] dark:text-white shadow-sm">
                <Clock className="w-6 h-6 text-[#B45309] shrink-0" />
                <div>
                  <span className="font-bold uppercase text-xs text-[#B45309] block">
                    Expected Resolution Target
                  </span>
                  <span className="font-semibold text-sm">
                    {CATEGORY_SLA_HOURS[category]?.label || '3 Business Days'} for dispatch & repair.
                  </span>
                </div>
              </div>

              {/* Reporter Identity */}
              <div className="pt-3 border-t-1.5 border-[#CBD5E1] dark:border-slate-700 space-y-3">
                <label className="text-sm font-bold text-[#111827] dark:text-white block">
                  Your Resident Contact
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsGuest(true)}
                    className={`p-3.5 rounded-xl border-1.5 text-left text-sm font-bold transition-all min-h-[52px] ${
                      isGuest
                        ? 'bg-[#0A2540] dark:bg-[#006D5B] border-[#0A2540] text-white ring-2 ring-[#006D5B]'
                        : 'bg-white dark:bg-[#0A2540] border-[#CBD5E1] dark:border-slate-700 text-[#111827] dark:text-white'
                    }`}
                  >
                    <User className="w-4 h-4 mb-1 text-teal-300" />
                    <div>Anonymous Resident</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsGuest(false)}
                    className={`p-3.5 rounded-xl border-1.5 text-left text-sm font-bold transition-all min-h-[52px] ${
                      !isGuest
                        ? 'bg-[#0A2540] dark:bg-[#006D5B] border-[#0A2540] text-white ring-2 ring-[#006D5B]'
                        : 'bg-white dark:bg-[#0A2540] border-[#CBD5E1] dark:border-slate-700 text-[#111827] dark:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mb-1 text-teal-300" />
                    <div>Verified Neighbor</div>
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 text-base bg-white dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl outline-none text-[#111827] dark:text-white min-h-[56px] font-semibold"
                />
              </div>
            </div>
          )}
          </div>

          {/* Modal Footer Controls - Sticky at bottom */}
          <div className="p-4 sm:p-5 border-t-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-b-xl rounded-t-none flex items-center justify-between shrink-0 bg-white dark:bg-[#0A2540] sticky bottom-0 z-20">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="flex items-center space-x-2 px-5 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#111827] dark:text-white border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-sm font-bold cursor-pointer min-h-[56px] transition-all"
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
                className="flex items-center space-x-2 px-6 py-3.5 bg-[#006D5B] hover:bg-[#0A2540] text-white rounded-xl text-base font-bold cursor-pointer min-h-[56px] transition-all shadow-md"
              >
                <span>Next Step</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-7 py-3.5 bg-[#B45309] hover:bg-[#92400E] text-white rounded-xl text-base font-bold cursor-pointer disabled:opacity-50 min-h-[56px] transition-all shadow-md"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-white" />
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
