import React, { useState } from 'react';
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
} from 'lucide-react';
import { ReportCategory, SeverityLevel, AIAnalysisResult, AiForensicResult } from '../types';
import { CATEGORY_CONFIG, SEVERITY_CONFIG } from '../lib/constants';
import { CategoryIcon } from './CategoryIcon';
import { CommunityMap } from './CommunityMap';
import { readFileAsBase64, reverseGeocode } from '../lib/utils';
import { GoogleAuthButton } from './GoogleAuthButton';
import { ShieldAlert, Scan } from 'lucide-react';

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      const data = await res.json();
      if (data.result) {
        setForensicResult(data.result);
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

      const data = await res.json();
      if (data.result) {
        const result: AIAnalysisResult = data.result;
        setAiAnalysisResult(result);
        if (result.title) setTitle(result.title);
        if (result.category) setCategory(result.category);
        if (result.severity) setSeverity(result.severity);
        if (result.description) setDescription(result.description);
      }
    } catch (err) {
      console.error('AI Scan Error:', err);
    } finally {
      setIsAnalyzingAI(false);
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
      await onSubmitReport({
        title: title.trim(),
        description: description.trim(),
        category,
        severity,
        latitude,
        longitude,
        addressText,
        imageUrls: imagePreview ? [imagePreview] : [],
        userName: userName.trim() || (isGuest ? 'Anonymous Resident' : 'Community Member'),
        userEmail: userEmail.trim(),
        isGuest,
        aiForensics: forensicResult || undefined,
        isFlaggedAsAiFake: forensicResult?.isAiGenerated || false,
      });

      // Reset modal state
      setStep(1);
      setTitle('');
      setDescription('');
      setImagePreview(null);
      setAiAnalysisResult(null);
      onClose();
    } catch (err) {
      console.error('Submit report failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-settled-in">
        {/* Modal Header & Step Indicator */}
        <div className="p-4 sm:p-5 border-b border-white/60 flex items-center justify-between soft-card rounded-t-3xl rounded-b-none">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
              Step {step} of 3
            </span>
            <h2 className="text-xl font-heading font-black text-[#1c1a3b] dark:text-white">
              {step === 1 && 'Pin Issue Location'}
              {step === 2 && 'Media & Details'}
              {step === 3 && 'Submit & Verify'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-full soft-pill cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5">
          <div
            className="bg-blue-600 h-1.5 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Modal Body Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: LOCATION PINPOINT */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-900 rounded-2xl text-xs text-indigo-950 dark:text-indigo-200 gap-3">
                <div className="flex items-start space-x-2.5">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl shrink-0 shadow-xs">
                    <MapPin className="w-4 h-4 animate-bounce text-yellow-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Exact Pin Drop Location
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
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer shrink-0 flex items-center space-x-1"
                >
                  <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                  <span>GPS My Location</span>
                </button>
              </div>

              {/* Interactive map location picker */}
              <div className="relative h-72 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
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
                  <span>Interactive Location Pin Active</span>
                </div>
              </div>

              {/* Precise Lat/Lng Input Controls */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    Latitude Coordinates
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) handleLocationChange(val, longitude);
                    }}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    Longitude Coordinates
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) handleLocationChange(latitude, val);
                    }}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <p className="text-xs text-slate-500 text-center">
                Click or drag the animated pin on the map to drop the exact location of the infrastructure issue.
              </p>
            </div>
          )}

          {/* STEP 2: MEDIA & DETAILS */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Image Upload Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Upload Photo (Optional but Recommended)
                  </label>

                  {imagePreview && (
                    <button
                      onClick={handleAnalyzeWithAI}
                      disabled={isAnalyzingAI}
                      className="flex items-center space-x-1 px-2.5 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-xs font-bold shadow-xs hover:opacity-90 transition-all cursor-pointer"
                    >
                      {isAnalyzingAI ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      )}
                      <span>AI Auto-Classify</span>
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
                        className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Floating Scan Badge */}
                      <div className="absolute bottom-2 left-2 px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg text-[10px] font-mono font-bold text-white border border-slate-700 flex items-center space-x-1.5">
                        <Scan className="w-3.5 h-3.5 text-indigo-400" />
                        <span>AI Fraud Shield Active</span>
                      </div>
                    </div>

                    {/* Live Forensic Scanning Banner */}
                    {isScanningForensics && (
                      <div className="p-3 bg-indigo-950/50 border border-indigo-800 rounded-xl flex items-center space-x-3 text-xs text-indigo-300 animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-400 shrink-0" />
                        <span>Performing Multi-modal AI Forensic Scan for synthetic picture markers...</span>
                      </div>
                    )}

                    {/* Scan Result Alert */}
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
                                ? '⚠️ AI-Generated Picture Flagged'
                                : '🛡️ Authentic Camera Capture Verified'}
                            </span>
                            <span className="font-mono text-[10px] uppercase font-black px-2 py-0.5 rounded bg-slate-900/80">
                              {forensicResult.aiProbability}% AI Probability
                            </span>
                          </div>
                          <p className="text-[11px] opacity-90 mt-1">
                            {forensicResult.forensicAnalysis}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 rounded-2xl cursor-pointer bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                    <Camera className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Click or drag photo here
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG up to 10MB</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* AI Analysis Confirmation Banner */}
              {aiAnalysisResult && (
                <div className="p-3 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-2xl text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-purple-900 dark:text-purple-200">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Gemini AI Auto-Detected Issue</span>
                  </div>
                  <p className="text-purple-700 dark:text-purple-300 text-[11px]">
                    Recommended Category: <strong>{aiAnalysisResult.category}</strong> | Severity:{' '}
                    <strong>{aiAnalysisResult.severity}</strong>
                  </p>
                </div>
              )}

              {/* Category Selection Grid */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(CATEGORY_CONFIG) as ReportCategory[]).map((catKey) => {
                    const meta = CATEGORY_CONFIG[catKey];
                    const isSelected = category === catKey;
                    return (
                      <button
                        key={catKey}
                        type="button"
                        onClick={() => setCategory(catKey)}
                        className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left text-xs transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 font-bold shadow-xs ring-1 ring-blue-500'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <CategoryIcon category={catKey} className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate">{meta.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Severity Level */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Hazard Severity
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
                        className={`py-2 px-2 text-center rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? `${conf.colorClass} ring-2 ring-blue-500`
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600'
                        }`}
                      >
                        {conf.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Issue Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deep pothole right near bike lane"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details such as size, hazard impact, or best times to observe..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SUBMIT & VERIFY */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Report Summary</h4>
                <p>
                  <strong>Title:</strong> {title || 'Untitled Issue'}
                </p>
                <p>
                  <strong>Category:</strong> {CATEGORY_CONFIG[category].label}
                </p>
                <p>
                  <strong>Location:</strong> {addressText}
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Reporting As
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsGuest(true)}
                    className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all ${
                      isGuest
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600'
                    }`}
                  >
                    <User className="w-4 h-4 mb-1 text-blue-600" />
                    <div>Guest Resident</div>
                    <p className="text-[10px] font-normal opacity-70">Submit anonymously</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsGuest(false)}
                    className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all ${
                      !isGuest
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mb-1 text-blue-600" />
                    <div>Verified Citizen</div>
                    <p className="text-[10px] font-normal opacity-70">Receive municipal status updates</p>
                  </button>
                </div>

                {/* Google Sign In option */}
                <div className="pt-1">
                  <GoogleAuthButton
                    variant="modal"
                    onAuthChange={(profile) => {
                      if (profile.fullName) setUserName(profile.fullName);
                      if (profile.email) setUserEmail(profile.email);
                      setIsGuest(false);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  />

                  {!isGuest && (
                    <input
                      type="email"
                      placeholder="Email for resolution notifications"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-white/60 soft-card rounded-b-3xl rounded-t-none flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="btn-soft-tactile flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs cursor-pointer"
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
              onClick={() => {
                if (step === 2 && !title.trim()) {
                  alert('Please enter a title for the report before continuing.');
                  return;
                }
                setStep((s) => (s + 1) as any);
              }}
              className="btn-primary-designer flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-primary-designer flex items-center space-x-2 px-6 py-2.5 rounded-2xl text-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>Submit Issue Report</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
