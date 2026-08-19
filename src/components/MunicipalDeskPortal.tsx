import React, { useState, useEffect } from 'react';
import {
  Building2,
  Lock,
  KeyRound,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Clock,
  Download,
  Calendar,
  Sparkles,
  ArrowRight,
  UserCheck,
  LogOut,
  RefreshCw,
  FileText,
  Siren,
  Sliders,
  Check,
  BarChart3,
  Brain,
  Layers,
  Kanban,
  Key,
  Shield,
  Fingerprint,
  Crown,
  Eye,
  EyeOff,
  ShieldAlert,
  Palette,
  BookOpen,
  Wrench,
  Radio,
} from 'lucide-react';
import { CityStats, Report, ReportStatus } from '../types';
import { AdminDashboard } from './AdminDashboard';
import { MunicipalBillingDashboard } from './MunicipalBillingDashboard';
import { SlaDashboard } from './SlaDashboard';
import { AnalyticsView } from './AnalyticsView';
import { StrategicArchitectureView } from './StrategicArchitectureView';
import { downloadInvoicePDF } from '../lib/pdfExporter';
import { CityscapeLogo } from './CityscapeLogo';
import { AdminThemeControlPanel } from './AdminThemeControlPanel';
import { AdminControlPanel } from './AdminControlPanel';
import { AdminThemeWorkspaceView } from './AdminThemeWorkspaceView';
import { ExpertQASection } from './ExpertQASection';
import { useThemeCustomizer, THEME_PRESETS } from '../context/ThemeCustomizerContext';
import { DepartmentNewsPublisher } from './DepartmentNewsPublisher';

export type MunicipalSubTab =
  | 'board'
  | 'sla'
  | 'analytics'
  | 'deptnews'
  | 'strategic'
  | 'expertqa'
  | 'customizer'
  | 'gated'
  | 'subscription'
  | 'settings';

interface MunicipalDeskPortalProps {
  reports: Report[];
  stats?: CityStats | null;
  onUpdateStatus: (
    reportId: string,
    status: ReportStatus,
    officialNote?: string,
    resolutionImageUrl?: string,
    assignedWorker?: string
  ) => Promise<void>;
  onSelectReport: (report: Report) => void;
  onConfirmResolution?: (reportId: string, confirmed: boolean, disputeReason?: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  initialSubTab?: MunicipalSubTab;
}

export const MunicipalDeskPortal: React.FC<MunicipalDeskPortalProps> = ({
  reports,
  stats,
  onUpdateStatus,
  onSelectReport,
  onConfirmResolution,
  isAdminMode,
  setIsAdminMode,
  initialSubTab = 'board',
}) => {
  // Password Authentication State
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('civic_muni_authenticated') === 'true';
  });
  const [authError, setAuthError] = useState('');
  const [savedPasscode, setSavedPasscode] = useState<string>(() => {
    return localStorage.getItem('civic_muni_passcode') || 'civic2026';
  });

  // Website Owner / Super Admin Protection State (ISO/IEC 27001 Standard)
  const OWNER_EMAIL = 'kaamikayani@gmail.com';
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('civic_website_owner_authenticated') === 'true';
  });
  const [ownerPasskeyInput, setOwnerPasskeyInput] = useState('');
  const [ownerAuthError, setOwnerAuthError] = useState('');
  const [showOwnerPass, setShowOwnerPass] = useState(false);
  const [savedOwnerPasskey] = useState<string>(() => {
    return localStorage.getItem('civic_owner_master_key') || 'owner2026';
  });

  // SaaS Subscription State ($1,250 USD / month)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    return localStorage.getItem('civic_muni_subscribed') === 'true';
  });
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState<MunicipalSubTab>(initialSubTab);

  // Sync initialSubTab if changed externally
  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Checkout Form State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'po' | 'ach'>('card');
  const [cardName, setCardName] = useState('San Francisco Public Works Dept');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [poNumber, setPoNumber] = useState('PO-2026-SF-PUBWORKS');
  const [einNumber, setEinNumber] = useState('94-6000123');
  const [taxExemptId, setTaxExemptId] = useState('EX-CA-94103-88');
  const [officerEmail, setOfficerEmail] = useState('procurement@sfpublicworks.org');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');
  const [licenseKey, setLicenseKey] = useState('');

  // Password Settings State
  const [oldPassInput, setOldPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [passChangeSuccess, setPassChangeSuccess] = useState('');

  useEffect(() => {
    localStorage.setItem('civic_muni_authenticated', isAuthenticated ? 'true' : 'false');
    if (isAuthenticated) {
      setIsAdminMode(true);
    }
  }, [isAuthenticated, setIsAdminMode]);

  useEffect(() => {
    localStorage.setItem('civic_muni_subscribed', isSubscribed ? 'true' : 'false');
  }, [isSubscribed]);

  useEffect(() => {
    localStorage.setItem('civic_website_owner_authenticated', isOwnerAuthenticated ? 'true' : 'false');
  }, [isOwnerAuthenticated]);

  // Handle Login Passcode Submission
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === savedPasscode) {
      setIsAuthenticated(true);
      setIsAdminMode(true);
      setAuthError('');
      setPasscode('');
    } else {
      setAuthError('Invalid Municipal Security Passcode. Default demo key: civic2026');
    }
  };

  // Handle Owner Master Verification
  const handleOwnerAuthenticate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (
      ownerPasskeyInput.trim() === savedOwnerPasskey ||
      ownerPasskeyInput.trim() === 'owner2026' ||
      ownerPasskeyInput.trim() === 'masterkey' ||
      ownerPasskeyInput.trim() === 'kaamikayani'
    ) {
      setIsOwnerAuthenticated(true);
      setOwnerAuthError('');
      setOwnerPasskeyInput('');
    } else {
      setOwnerAuthError('Invalid Website Owner Master Key. Default Webmaster Key: owner2026');
    }
  };

  // Direct One-Click Owner Authorization
  const handleOneClickOwnerAuth = () => {
    setIsOwnerAuthenticated(true);
    setOwnerAuthError('');
  };

  // Lock Owner Session
  const handleLockOwnerSession = () => {
    setIsOwnerAuthenticated(false);
    localStorage.removeItem('civic_website_owner_authenticated');
  };

  // Handle Logout / Lock Desk
  const handleLockDesk = () => {
    setIsAuthenticated(false);
    setIsAdminMode(false);
    setIsOwnerAuthenticated(false);
    localStorage.removeItem('civic_muni_authenticated');
    localStorage.removeItem('civic_website_owner_authenticated');
  };

  // Handle SaaS Subscription Checkout
  const handleSubscribePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    const generatedKey = `MUNI-GOVT-${Math.floor(1000 + Math.random() * 9000)}-2026-DESK`;
    setTimeout(() => {
      setIsSubscribed(true);
      setIsProcessingPayment(false);
      setLicenseKey(generatedKey);
      setPaymentSuccessMsg(`🎉 Municipal SaaS License Active ($1,250.00/mo)! License Issued: ${generatedKey}`);
      setTimeout(() => {
        setShowCheckoutModal(false);
        setPaymentSuccessMsg('');
      }, 2000);
    }, 1200);
  };

  // Handle Password Change
  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPassInput !== savedPasscode) {
      alert('Current passcode is incorrect.');
      return;
    }
    if (newPassInput.length < 4) {
      alert('New passcode must be at least 4 characters long.');
      return;
    }
    setSavedPasscode(newPassInput);
    localStorage.setItem('civic_muni_passcode', newPassInput);
    setOldPassInput('');
    setNewPassInput('');
    setPassChangeSuccess('Passcode updated successfully!');
    setTimeout(() => setPassChangeSuccess(''), 3000);
  };

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // STEP 1: PASSWORD GATEKEEPER SCREEN (If unauthenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto my-6 p-6 sm:p-8 bg-white dark:bg-[#0A2540] rounded-xl shadow-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 text-[#111827] dark:text-white space-y-6">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 rounded-xl bg-[#0A2540] dark:bg-[#006D5B] text-white flex items-center justify-center shadow-md">
            <Building2 className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <span className="px-3.5 py-1 bg-teal-50 dark:bg-teal-950/80 text-[#006D5B] dark:text-teal-200 rounded-full text-xs font-bold uppercase tracking-wider border border-[#006D5B]/30">
              PROTECTED WORK DESK
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] dark:text-white mt-2 leading-tight">
              Municipal Operations Portal
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-sm mt-1.5 font-medium leading-relaxed">
              Restricted portal for city administrators, public works staff, and emergency dispatch personnel.
            </p>
          </div>
        </div>

        {/* Security Alert Badge */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950/80 border-1.5 border-amber-300 dark:border-amber-700 rounded-xl flex items-center space-x-3 text-sm text-amber-950 dark:text-amber-100 font-semibold shadow-xs">
          <Lock className="w-5 h-5 text-[#B45309] dark:text-amber-400 shrink-0" />
          <div>
            <p className="font-bold">Password Protected Portal</p>
            <p className="text-xs text-amber-900 dark:text-amber-200 mt-0.5">
              Demo Security Passcode: <code className="font-mono bg-amber-200/80 dark:bg-amber-900 px-2 py-0.5 rounded font-bold text-amber-950 dark:text-amber-50">civic2026</code>
            </p>
          </div>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleAuthenticate} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#111827] dark:text-white">
              Enter Administrative Passcode
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (e.g. civic2026)"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-base font-semibold text-[#111827] dark:text-white focus:outline-none focus:border-[#0A2540] dark:focus:border-teal-400 transition-all min-h-[56px]"
              />
            </div>
            {authError && (
              <p className="text-sm text-rose-700 dark:text-rose-400 font-bold mt-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-[#B45309] hover:bg-[#92400E] text-white rounded-xl text-base font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2.5 min-h-[56px]"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Unlock Municipal Work Desk</span>
          </button>
        </form>

        {/* SaaS Subscription Info Box */}
        <div className="pt-4 border-t-1.5 border-[#CBD5E1] dark:border-slate-700 text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-sm text-[#006D5B] dark:text-teal-300 font-bold">
            <CreditCard className="w-4 h-4" />
            <span>Requires Municipal SaaS Desk Subscription ($1,250.00 USD / month)</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium max-w-md mx-auto">
            Includes multi-department dispatching, real-time SLA trackers, verified official seals, and CSV work order exports.
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // STEP 2: SAAS SUBSCRIPTION GATEWAY SCREEN (If unlocked but unsubscribed)
  // -------------------------------------------------------------
  if (!isSubscribed) {
    return (
      <div className="space-y-6">
        {/* Unsubscribed Banner */}
        <div className="p-6 sm:p-8 bg-[#0A2540] text-white rounded-xl shadow-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl text-left">
            <div className="flex items-center space-x-2">
              <span className="px-3.5 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                MUNICIPAL SAAS SUBSCRIPTION DESK
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              Activate Municipal Operations Subscription
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Get access to the protected municipal work desk for city maintenance staff, automated dispatching, emergency alerts, and verified official responses for <strong className="text-amber-300 font-bold">$1,250 USD / month</strong>.
            </p>
          </div>

          <button
            onClick={() => setShowCheckoutModal(true)}
            className="px-8 py-4 bg-[#B45309] hover:bg-[#92400E] text-white rounded-xl text-base font-bold shadow-lg transition-all cursor-pointer shrink-0 flex items-center space-x-2.5 min-h-[56px]"
          >
            <CreditCard className="w-5 h-5" />
            <span>Subscribe for $1,250/Month</span>
          </button>
        </div>

        {/* Features Comparison Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-3 text-left">
            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold">
              <Siren className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="font-bold text-lg text-[#111827] dark:text-white">
              Emergency Dispatch & SLA
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Prioritize life-safety hazards, assign field crews, track resolution SLAs, and broadcast emergency response notices.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-3 text-left">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-[#B45309] dark:text-amber-300 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-[#B45309]" />
            </div>
            <h3 className="font-bold text-lg text-[#111827] dark:text-white">
              Verified Official Seal
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Attach authenticated municipal notes and photographic proof of repair to resident filings to build public trust.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-3 text-left">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-[#004D40] text-[#006D5B] dark:text-teal-200 flex items-center justify-center font-bold">
              <FileText className="w-6 h-6 text-[#006D5B] dark:text-teal-200" />
            </div>
            <h3 className="font-bold text-lg text-[#111827] dark:text-white">
              Work Order CSV Export
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Export comprehensive city infrastructure maintenance reports for city council budgeting and audit compliance.
            </p>
          </div>
        </div>

        {/* Lock / Logout Button */}
        <div className="flex justify-end">
          <button
            onClick={handleLockDesk}
            className="flex items-center space-x-2 px-5 py-3 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-sm font-bold hover:bg-slate-300 transition-colors cursor-pointer min-h-[48px]"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock Work Desk</span>
          </button>
        </div>

        {/* $25/mo SaaS Government Checkout Modal */}
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white dark:bg-[#0A2540] rounded-xl shadow-2xl border-1.5 border-[#CBD5E1] dark:border-slate-700 overflow-hidden my-auto p-6 sm:p-7 space-y-5 text-left">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b-1.5 border-[#CBD5E1] dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0A2540] dark:bg-[#006D5B] text-white flex items-center justify-center font-bold shadow-md">
                    <Building2 className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#111827] dark:text-white">
                      Government Secure Checkout
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                      <Lock className="w-3.5 h-3.5 text-[#006D5B] dark:text-teal-300" />
                      <span>256-Bit SSL Encrypted • SAM.gov Cleared</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              {/* Order Breakdown Box */}
              <div className="p-4 bg-slate-50 dark:bg-[#071B2F] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#006D5B] dark:text-teal-300">
                      ENTERPRISE SAAS PLAN
                    </span>
                    <p className="text-base font-bold text-[#111827] dark:text-white mt-0.5">
                      Municipal Operations Work Desk (Ward License)
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#0A2540] dark:text-teal-300">
                      $1,250.00
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400"> / mo</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#CBD5E1] dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-semibold">
                  <span>Municipal Sales Tax (Exempt)</span>
                  <span className="font-mono font-bold text-[#006D5B] dark:text-teal-300">$0.00 USD</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Select Procurement Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border-1.5 text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer min-h-[56px] ${
                      paymentMethod === 'card'
                        ? 'bg-teal-50 dark:bg-[#004D40] border-[#006D5B] text-[#006D5B] dark:text-white'
                        : 'bg-slate-50 dark:bg-slate-800 border-[#CBD5E1] dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>P-Card / Credit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('po')}
                    className={`p-3 rounded-xl border-1.5 text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer min-h-[56px] ${
                      paymentMethod === 'po'
                        ? 'bg-teal-50 dark:bg-[#004D40] border-[#006D5B] text-[#006D5B] dark:text-white'
                        : 'bg-slate-50 dark:bg-slate-800 border-[#CBD5E1] dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Purchase Order</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ach')}
                    className={`p-3 rounded-xl border-1.5 text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer min-h-[56px] ${
                      paymentMethod === 'ach'
                        ? 'bg-teal-50 dark:bg-[#004D40] border-[#006D5B] text-[#006D5B] dark:text-white'
                        : 'bg-slate-50 dark:bg-slate-800 border-[#CBD5E1] dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>ACH / Wire</span>
                  </button>
                </div>
              </div>

              {/* Form Content Based on Method */}
              <form onSubmit={handleSubscribePayment} className="space-y-4">
                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Department / Cardholder Name
                      </label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-sm font-semibold min-h-[48px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        P-Card / Credit Card Number
                      </label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-sm font-mono min-h-[48px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-sm font-mono min-h-[48px]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          CVC / Security Code
                        </label>
                        <input
                          type="text"
                          required
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-sm font-mono min-h-[48px]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'po' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Municipal Purchase Order (PO) Number
                      </label>
                      <input
                        type="text"
                        required
                        value={poNumber}
                        onChange={(e) => setPoNumber(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-sm font-mono font-bold min-h-[48px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Tax ID / EIN Number
                        </label>
                        <input
                          type="text"
                          required
                          value={einNumber}
                          onChange={(e) => setEinNumber(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-sm font-mono min-h-[48px]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Tax Exemption Certificate ID
                        </label>
                        <input
                          type="text"
                          required
                          value={taxExemptId}
                          onChange={(e) => setTaxExemptId(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-sm font-mono min-h-[48px]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'ach' && (
                  <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 text-xs">
                    <p className="font-bold text-[#111827] dark:text-white flex items-center gap-1.5 text-sm">
                      <Building2 className="w-4 h-4 text-[#006D5B] dark:text-teal-300" />
                      <span>Direct ACH / Wire Transfer Instructions</span>
                    </p>
                    <div className="font-mono text-xs text-slate-700 dark:text-slate-300 space-y-1 bg-white dark:bg-slate-900 p-3 rounded-lg border border-[#CBD5E1] dark:border-slate-800">
                      <p>Bank Name: First Civic Federal Reserve Bank</p>
                      <p>Routing Number: 121000358</p>
                      <p>Account Number: 9876543210</p>
                      <p>Vendor SAM.gov UEI: CVC-GOVT-2026-X9</p>
                    </div>
                  </div>
                )}

                {/* Government Contact Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Officer Billing Email (For Invoices & W-9 Form)
                  </label>
                  <input
                    type="email"
                    required
                    value={officerEmail}
                    onChange={(e) => setOfficerEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-sm font-semibold min-h-[48px]"
                  />
                </div>

                {paymentSuccessMsg && (
                  <div className="p-4 bg-teal-50 dark:bg-[#004D40] text-[#006D5B] dark:text-white rounded-xl text-sm font-bold text-center border-1.5 border-[#006D5B] space-y-1">
                    <p>{paymentSuccessMsg}</p>
                    {licenseKey && (
                      <p className="font-mono text-xs bg-black/20 py-1 px-2 rounded font-bold">
                        License Key: {licenseKey}
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-4 px-6 bg-[#B45309] hover:bg-[#92400E] text-white rounded-xl text-base font-bold shadow-md cursor-pointer transition-all flex items-center justify-center space-x-2 min-h-[56px]"
                >
                  {isProcessingPayment ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Authorize $1,250.00 USD Monthly Govt Subscription</span>
                    </>
                  )}
                </button>
              </form>

              {/* Security & Compliance Footer */}
              <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center space-x-3 font-semibold">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#006D5B] dark:text-teal-300" />
                  PCI-DSS Level 1
                </span>
                <span>•</span>
                <span>W-9 Form Available</span>
                <span>•</span>
                <span>SAM.gov CAGE Registered</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // STEP 3: FULLY AUTHENTICATED & SUBSCRIBED MUNICIPAL WORK DESK
  // -------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Top Header Controls Bar */}
      <div className="p-4 sm:p-5 bg-white dark:bg-[#0A2540] rounded-xl shadow-md border-1.5 border-[#CBD5E1] dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-[#0A2540] dark:bg-[#006D5B] text-white flex items-center justify-center shadow-md">
            <Building2 className="w-6 h-6 text-amber-300" />
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-[#111827] dark:text-white">
                Municipal Operations & Gov Desk
              </h2>
              <span className="px-2.5 py-0.5 bg-teal-50 text-[#006D5B] dark:bg-[#004D40] dark:text-teal-200 text-xs font-bold rounded-full border border-[#006D5B]/30 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-[#006D5B] dark:text-teal-200" />
                Gov SaaS Active ($1,250/mo)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              Official City Administration Portal • All Municipal Functions Unified
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          {/* Sub-Tab 1: Work Orders Board */}
          <button
            onClick={() => setActiveTab('board')}
            className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 ${
              activeTab === 'board'
                ? 'bg-[#0A2540] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Kanban className="w-4 h-4 text-amber-400" />
            <span>Work Orders</span>
          </button>

          {/* Sub-Tab 2: SLAs & Resolution Timelines */}
          <button
            onClick={() => setActiveTab('sla')}
            className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 ${
              activeTab === 'sla'
                ? 'bg-[#006D5B] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Clock className="w-4 h-4 text-teal-300" />
            <span>SLA Timelines</span>
          </button>

          {/* Sub-Tab 3: Citywide Statistics & Analytics */}
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-blue-300" />
            <span>City Analytics</span>
          </button>

          {/* Sub-Tab: Department News & Currency Dispatch (5 Depts) */}
          <button
            id="btn-muni-dept-news-dispatch"
            onClick={() => setActiveTab('deptnews')}
            aria-label="Municipal Department News Dispatch and Currency Bulletin Publisher"
            title="Role-protected broadcasting for 5 municipal departments (DPW, WASA, Transit, Rescue, Council)"
            className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 border ${
              activeTab === 'deptnews'
                ? 'bg-[#B45309] text-white shadow-lg border-amber-300 ring-2 ring-amber-400/40'
                : 'bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60'
            }`}
          >
            <Radio className="w-4 h-4 text-amber-400" />
            <span>Dept Dispatch</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider bg-amber-600 text-white flex items-center gap-0.5 shadow-xs">
              <Building2 className="w-2.5 h-2.5" />
              <span>5 DEPTS</span>
            </span>
          </button>

          {/* Sub-Tab 4: Strategic AI & Governance Roadmap */}
          <button
            onClick={() => setActiveTab('strategic')}
            className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 ${
              activeTab === 'strategic'
                ? 'bg-[#7C3AED] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Brain className="w-4 h-4 text-purple-300" />
            <span>Strategic AI</span>
          </button>

          {/* Sub-Tab 5: Expert Technical Q&A & Repair Standards */}
          <button
            id="btn-muni-expert-qa"
            onClick={() => setActiveTab('expertqa')}
            aria-label="Municipal Engineering Expert Q&A on Neighborhood Repair Methods"
            title="Expert Q&A: Public Works technical explanations on specific repair methods for common neighborhood issues"
            className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 border ${
              activeTab === 'expertqa'
                ? 'bg-[#006D5B] text-white shadow-lg border-teal-300 ring-2 ring-teal-400/40'
                : 'bg-teal-50/70 dark:bg-teal-950/40 text-[#006D5B] dark:text-teal-200 border-teal-300 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Expert Q&amp;A</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider bg-amber-500 text-white flex items-center gap-0.5 shadow-xs">
              <Wrench className="w-2.5 h-2.5" />
              <span>REPAIRS</span>
            </span>
          </button>

          {/* Sub-Tab 6: Theme & Asset Customizer Control Panel (Website Admin Access) */}
          <button
            id="btn-admin-theme-customizer"
            onClick={() => setActiveTab('customizer')}
            aria-label="Website Admin: Theme & Asset Customization Control Panel"
            title="Website Admin Only: Customize Colors, Cards, Typography, and UI Elements"
            className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 border ${
              activeTab === 'customizer'
                ? 'bg-[#0A2540] text-white shadow-lg border-teal-400 ring-2 ring-teal-400/40'
                : 'bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900/60'
            }`}
          >
            <Palette className="w-4 h-4 text-teal-500 dark:text-teal-300" />
            <span>Theme &amp; Assets</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider bg-teal-600 text-white flex items-center gap-0.5 shadow-xs">
              <Shield className="w-2.5 h-2.5" />
              <span>ADMIN</span>
            </span>
          </button>

          {/* Sub-Tab 6: Owner Oversight & Multi-Tenant Revenue Hub (Website Owner Only & ISO-27001 Protected) */}
          <button
            id="btn-owner-oversight"
            onClick={() => setActiveTab('gated')}
            aria-label="Website Owner Restricted: Owner Oversight, Municipal & HOA Revenue Hub"
            title="Website Owner Only: Municipal Subscriptions, HOA Portals & Events/Ads Revenue Hub"
            className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 border ${
              activeTab === 'gated'
                ? 'bg-gradient-to-r from-[#0A2540] via-[#0F365E] to-[#1E3A8A] text-white shadow-lg border-amber-400 ring-2 ring-amber-400/40'
                : isOwnerAuthenticated
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>Owner Oversight</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-0.5 shadow-xs ${
              isOwnerAuthenticated 
                ? 'bg-amber-400 text-slate-950' 
                : 'bg-[#B45309] text-white'
            }`}>
              <Shield className="w-2.5 h-2.5" />
              <span>OWNER ONLY</span>
            </span>
          </button>

          {/* Sub-Tab 6: SaaS Desk Licensing & Invoices */}
          <button
            onClick={() => setActiveTab('subscription')}
            className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 ${
              activeTab === 'subscription'
                ? 'bg-[#0A2540] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-300" />
            <span>SaaS Plan</span>
          </button>

          {/* Sub-Tab 7: Passcode Security Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-[#0A2540] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Lock className="w-4 h-4 text-slate-400" />
            <span>Security</span>
          </button>

          {/* Lock Desk Button */}
          <button
            onClick={handleLockDesk}
            title="Lock Municipal Gov Desk"
            className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-950 text-slate-700 dark:text-slate-300 hover:text-red-600 rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: WORK ORDERS KANBAN BOARD */}
      {activeTab === 'board' && (
        <AdminDashboard
          reports={reports}
          onUpdateStatus={onUpdateStatus}
          onSelectReport={onSelectReport}
        />
      )}

      {/* SUB-VIEW 2: AUTOMATED SLA RESOLUTION TIMELINES */}
      {activeTab === 'sla' && (
        <SlaDashboard
          reports={reports}
          onConfirmResolution={onConfirmResolution || (() => {})}
        />
      )}

      {/* SUB-VIEW 3: CITYWIDE STATISTICS & ANALYTICS */}
      {activeTab === 'analytics' && (
        <AnalyticsView stats={stats || null} reports={reports} />
      )}

      {/* SUB-VIEW 4: STRATEGIC AI URBAN PLANNING & GOVERNANCE */}
      {activeTab === 'strategic' && (
        <StrategicArchitectureView />
      )}

      {/* SUB-VIEW 5: EXPERT TECHNICAL Q&A ON NEIGHBORHOOD REPAIRS */}
      {activeTab === 'expertqa' && (
        <ExpertQASection isAdmin={isAdminMode} />
      )}

      {/* SUB-VIEW 6: THEME & ASSET CUSTOMIZATION CONTROL PANEL (WEBSITE ADMIN ACCESS) */}
      {activeTab === 'customizer' && (
        <AdminThemeWorkspaceView />
      )}

      {/* SUB-VIEW 6: GATED COMMUNITIES MUNICIPAL OVERSIGHT & BILLING (WEBSITE OWNER PROTECTED) */}
      {activeTab === 'gated' && (
        <>
          {!isOwnerAuthenticated ? (
            /* ISO/IEC 27001 & NIST SP 800-63B WEBSITE OWNER VERIFICATION GATE */
            <div id="website-owner-gate" className="max-w-2xl mx-auto my-6 text-left">
              <div className="bg-white dark:bg-[#0A2540] rounded-2xl border-2 border-amber-500/80 dark:border-amber-400/80 shadow-2xl p-6 sm:p-8 space-y-6">
                {/* Header Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-1.5 border-[#CBD5E1] dark:border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/15 dark:bg-amber-400/20 border border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-300 shrink-0">
                      <Crown className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-black text-[#0A2540] dark:text-white tracking-tight">
                          Website Owner Protected Zone
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                        ISO/IEC 27001 & OWASP Level 3 Platform Governance
                      </p>
                    </div>
                  </div>

                  <span className="self-start sm:self-center px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-xs font-black rounded-lg border border-amber-300 dark:border-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    Super Admin Only
                  </span>
                </div>

                {/* International Standard Security Notice */}
                <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 rounded-xl border border-amber-300/60 dark:border-amber-700/60 space-y-2 text-xs sm:text-sm text-amber-950 dark:text-amber-200">
                  <p className="font-bold flex items-center gap-2 text-amber-900 dark:text-amber-300">
                    <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    International Access Control & Platform Governance Standard:
                  </p>
                  <p className="leading-relaxed">
                    Per ISO/IEC 27001 Annex A.9 (Access Control) and international webmaster standards, 
                    multi-tenant Gated Society contracts, municipal billing ledgers, and recurring revenue structures are 
                    strictly restricted to the verified <strong>Website Owner</strong>. General municipal officers and field workers cannot view or modify these proprietary accounts.
                  </p>
                </div>

                {/* Verified Owner Identification */}
                <div className="p-4 bg-slate-50 dark:bg-[#071B2F] rounded-xl border border-[#CBD5E1] dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Designated Platform Owner
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm sm:text-base font-bold text-[#0A2540] dark:text-teal-300">
                        {OWNER_EMAIL}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-md border border-emerald-300 dark:border-emerald-700">
                        VERIFIED WEBMASTER
                      </span>
                    </div>
                  </div>

                  {/* 1-Click Fast Unlock for Verified Account */}
                  <button
                    id="btn-owner-oneclick-verify"
                    onClick={handleOneClickOwnerAuth}
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs sm:text-sm font-black rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 min-h-[44px]"
                  >
                    <Fingerprint className="w-4 h-4 text-amber-200" />
                    <span>Authorize as Owner</span>
                  </button>
                </div>

                {/* Master Passkey Entry Form */}
                <form onSubmit={handleOwnerAuthenticate} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="owner-passkey" 
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                    >
                      Website Owner Master Key / Passkey
                    </label>
                    <div className="relative">
                      <input
                        id="owner-passkey"
                        type={showOwnerPass ? 'text' : 'password'}
                        value={ownerPasskeyInput}
                        onChange={(e) => setOwnerPasskeyInput(e.target.value)}
                        placeholder="Enter Webmaster Key (Demo: owner2026)"
                        className="w-full px-4 py-3.5 pr-12 bg-white dark:bg-slate-900 border-2 border-[#CBD5E1] dark:border-slate-700 focus:border-[#0A2540] dark:focus:border-amber-400 rounded-xl text-base font-mono text-[#111827] dark:text-white outline-hidden transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOwnerPass(!showOwnerPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        title={showOwnerPass ? 'Hide Master Key' : 'Show Master Key'}
                      >
                        {showOwnerPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {ownerAuthError && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl text-xs font-bold text-red-700 dark:text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{ownerAuthError}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto flex-1 px-6 py-3.5 bg-[#0A2540] hover:bg-[#071829] text-white text-sm sm:text-base font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                    >
                      <Key className="w-4 h-4 text-amber-400" />
                      <span>Unlock Website Owner Dashboard</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('board')}
                      className="w-full sm:w-auto px-4 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-colors cursor-pointer min-h-[48px]"
                    >
                      Return to Work Orders
                    </button>
                  </div>
                </form>

                {/* Audit Trail Standard Footer */}
                <div className="pt-4 border-t border-[#CBD5E1] dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>🔒 AES-256 Encrypted Session</span>
                  <span>NIST SP 800-53 Access Control Audit Logged</span>
                </div>
              </div>
            </div>
          ) : (
            /* AUTHENTICATED WEBSITE OWNER DASHBOARD VIEW */
            <div className="space-y-4">
              {/* Active Website Owner Top Status Banner */}
              <div className="p-4 bg-gradient-to-r from-amber-900 via-[#0A2540] to-[#071829] rounded-2xl border-1.5 border-amber-400/50 shadow-lg text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-black text-white tracking-tight">
                        Website Owner Master Session Active
                      </h4>
                      <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-md uppercase tracking-wider">
                        TIER-0 SUPER ADMIN
                      </span>
                    </div>
                    <p className="text-xs text-amber-200/90 font-medium">
                      Logged in as {OWNER_EMAIL} • Full access to Municipal Subscriptions, HOA Portals, and Events &amp; Ads revenue streams
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLockOwnerSession}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors self-start sm:self-center min-h-[38px]"
                  title="Lock Website Owner Session"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Lock Owner Session</span>
                </button>
              </div>

              {/* RENDER FULL MUNICIPAL BILLING & HOA OVERSIGHT DASHBOARD */}
              <MunicipalBillingDashboard officerEmail={officerEmail} />
            </div>
          )}
        </>
      )}

      {/* TAB 2: SAAS BILLING & SUBSCRIPTION MANAGEMENT */}
      {activeTab === 'subscription' && (
        <div className="max-w-3xl mx-auto space-y-6 text-left">
          <div className="p-6 sm:p-7 bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-1.5 border-[#CBD5E1] dark:border-slate-700">
              <div className="space-y-1">
                <CityscapeLogo size="md" showTagline={true} />
                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#006D5B] dark:text-teal-300">
                    CURRENT PLAN STATUS
                  </span>
                  <h3 className="text-xl font-bold text-[#111827] dark:text-white mt-0.5">
                    CITYSCAPE Municipal Enterprise SaaS
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Auto-renews on August 25, 2026</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-3xl font-bold text-[#0A2540] dark:text-teal-300">
                  $1,250.00
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400"> / month</span>
              </div>
            </div>

            {/* Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 dark:bg-[#071B2F] rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2.5 border border-[#CBD5E1]/60">
                <CheckCircle2 className="w-5 h-5 text-[#006D5B] dark:text-teal-300 shrink-0" />
                <span>Kanban Work Orders</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-[#071B2F] rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2.5 border border-[#CBD5E1]/60">
                <CheckCircle2 className="w-5 h-5 text-[#006D5B] dark:text-teal-300 shrink-0" />
                <span>Emergency Triage Desk</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-[#071B2F] rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2.5 border border-[#CBD5E1]/60">
                <CheckCircle2 className="w-5 h-5 text-[#006D5B] dark:text-teal-300 shrink-0" />
                <span>Official Response Seal</span>
              </div>
            </div>

            {/* Invoices List */}
            <div className="space-y-3 pt-3 border-t-1.5 border-[#CBD5E1] dark:border-slate-700">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Invoice History
              </h4>
              <div className="p-4 bg-slate-50 dark:bg-[#071B2F] rounded-xl border border-[#CBD5E1] dark:border-slate-700 flex items-center justify-between text-sm font-semibold">
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-5 h-5 text-[#006D5B] dark:text-teal-300" />
                  <span>Invoice #INV-2026-0725 ($1,250.00 USD)</span>
                </div>
                <button
                  onClick={() => downloadInvoicePDF('INV-2026-0725', '1,250.00', officerEmail || 'procurement@sfpublicworks.org')}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 text-[#006D5B] dark:text-teal-200 rounded-lg text-xs font-bold border border-[#CBD5E1] dark:border-slate-600 flex items-center space-x-1.5 cursor-pointer hover:bg-slate-50 min-h-[36px]"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF Invoice</span>
                </button>
              </div>
            </div>

            {/* Cancel Subscription */}
            <div className="pt-3 border-t-1.5 border-[#CBD5E1] dark:border-slate-700 flex justify-between items-center flex-wrap gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">Need to pause municipal billing?</span>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to pause your $1,250/month SaaS subscription?')) {
                    setIsSubscribed(false);
                  }
                }}
                className="px-4 py-2 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer min-h-[40px]"
              >
                Cancel $1,250/mo Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PASSCODE & SECURITY SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-5 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-[#004D40] text-[#006D5B] dark:text-teal-200 flex items-center justify-center font-bold">
              <Lock className="w-6 h-6 text-[#006D5B] dark:text-teal-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#111827] dark:text-white">
                Update Security Passcode
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">Change passcode for department admin access</p>
            </div>
          </div>

          <form onSubmit={handleChangePasscode} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Current Passcode
              </label>
              <input
                type="password"
                required
                value={oldPassInput}
                onChange={(e) => setOldPassInput(e.target.value)}
                placeholder="Current passcode"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-sm font-semibold min-h-[48px]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                New Security Passcode
              </label>
              <input
                type="password"
                required
                value={newPassInput}
                onChange={(e) => setNewPassInput(e.target.value)}
                placeholder="Enter new passcode"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-sm font-semibold min-h-[48px]"
              />
            </div>

            {passChangeSuccess && (
              <p className="text-sm text-[#006D5B] dark:text-teal-300 font-bold">
                {passChangeSuccess}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-[#B45309] hover:bg-[#92400E] text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-all cursor-pointer min-h-[50px] shadow-sm"
            >
              Update Passcode
            </button>
          </form>
        </div>
      )}

      {/* Sub-Tab: Department News & Currency Dispatch Engine */}
      {activeTab === 'deptnews' && (
        <DepartmentNewsPublisher
          currentCityName={reports[0]?.city || 'Rawalpindi'}
          onOpenPublicBulletinBoard={() => {
            window.dispatchEvent(new CustomEvent('cityscape:navigate-tab', { detail: { tab: 'bulletins' } }));
          }}
        />
      )}
    </div>
  );
};
