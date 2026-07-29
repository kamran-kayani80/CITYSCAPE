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
} from 'lucide-react';
import { Report, ReportStatus } from '../types';
import { AdminDashboard } from './AdminDashboard';
import { downloadInvoicePDF } from '../lib/pdfExporter';

interface MunicipalDeskPortalProps {
  reports: Report[];
  onUpdateStatus: (
    reportId: string,
    status: ReportStatus,
    officialNote?: string,
    resolutionImageUrl?: string,
    assignedWorker?: string
  ) => Promise<void>;
  onSelectReport: (report: Report) => void;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
}

export const MunicipalDeskPortal: React.FC<MunicipalDeskPortalProps> = ({
  reports,
  onUpdateStatus,
  onSelectReport,
  isAdminMode,
  setIsAdminMode,
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

  // SaaS Subscription State ($25 USD / month)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    return localStorage.getItem('civic_muni_subscribed') === 'true';
  });
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'board' | 'subscription' | 'settings'>('board');

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

  // Handle Logout / Lock Desk
  const handleLockDesk = () => {
    setIsAuthenticated(false);
    setIsAdminMode(false);
    localStorage.removeItem('civic_muni_authenticated');
  };

  // Handle SaaS $25/mo Subscription Checkout
  const handleSubscribePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    const generatedKey = `MUNI-GOVT-${Math.floor(1000 + Math.random() * 9000)}-2026-DESK`;
    setTimeout(() => {
      setIsSubscribed(true);
      setIsProcessingPayment(false);
      setLicenseKey(generatedKey);
      setPaymentSuccessMsg(`🎉 Municipal SaaS Subscription Active ($25.00/mo)! License Issued: ${generatedKey}`);
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
  // STEP 1: PASSWORD GATEKEEPER SCREEN (If unauthenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto my-6 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-indigo-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 space-y-6">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-700 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
            <Building2 className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-200/80">
              PROTECTED WORK DESK
            </span>
            <h2 className="text-2xl font-heading font-black text-[#1c1a3b] dark:text-white mt-2">
              Municipal Operations Portal
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
              Restricted portal for city administrators, public works staff, and emergency dispatch personnel.
            </p>
          </div>
        </div>

        {/* Security Alert Badge */}
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl flex items-center space-x-3 text-xs text-amber-900 dark:text-amber-200">
          <Lock className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="font-extrabold">Password Protected Portal</p>
            <p className="text-[11px] opacity-80">
              Demo Security Passcode: <code className="font-mono bg-amber-200/60 dark:bg-amber-900/80 px-1.5 py-0.5 rounded font-black text-amber-950 dark:text-amber-100">civic2026</code>
            </p>
          </div>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleAuthenticate} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Enter Administrative Passcode
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (e.g. civic2026)"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            {authError && (
              <p className="text-xs text-red-600 dark:text-red-400 font-extrabold mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{authError}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-200 dark:shadow-none transition-all cursor-pointer flex items-center justify-center space-x-2 pro-button"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Unlock Municipal Work Desk</span>
          </button>
        </form>

        {/* SaaS Subscription Info Box */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center space-y-2">
          <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-500 font-medium">
            <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
            <span>Requires Municipal SaaS Desk Subscription ($25.00 USD / month)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Includes multi-department dispatching, real-time SLA trackers, verified official seals, and CSV work order exports.
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STEP 2: SAAS SUBSCRIPTION GATEWAY SCREEN (If unlocked but unsubscribed)
  // -------------------------------------------------------------
  if (!isSubscribed) {
    return (
      <div className="space-y-6">
        {/* Unsubscribed Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-xl border border-indigo-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                MUNICIPAL SAAS SUBSCRIPTION DESK
              </span>
            </div>
            <h2 className="text-2xl font-heading font-black tracking-tight text-white">
              Activate Municipal Operations Subscription
            </h2>
            <p className="text-xs text-slate-300">
              Get access to the protected municipal work desk for city maintenance staff, automated dispatching, emergency alerts, and verified official responses for <strong className="text-white font-extrabold">$25 USD / month</strong>.
            </p>
          </div>

          <button
            onClick={() => setShowCheckoutModal(true)}
            className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer shrink-0 flex items-center space-x-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Subscribe for $25/Month</span>
          </button>
        </div>

        {/* Features Comparison Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="soft-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
              <Siren className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-heading font-black text-sm text-[#1c1a3b] dark:text-white">
              Emergency Dispatch & SLA
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Prioritize life-safety hazards, assign field crews, track resolution SLAs, and broadcast emergency response notices.
            </p>
          </div>

          <div className="soft-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-heading font-black text-sm text-[#1c1a3b] dark:text-white">
              Verified Official Seal
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Attach authenticated municipal notes and photographic proof of repair to resident filings to build public trust.
            </p>
          </div>

          <div className="soft-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-heading font-black text-sm text-[#1c1a3b] dark:text-white">
              Work Order CSV Export
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Export comprehensive city infrastructure maintenance reports for city council budgeting and audit compliance.
            </p>
          </div>
        </div>

        {/* Lock / Logout Button */}
        <div className="flex justify-end">
          <button
            onClick={handleLockDesk}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Work Desk</span>
          </button>
        </div>

        {/* $25/mo SaaS Government Checkout Modal */}
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-indigo-100 dark:border-slate-800 overflow-hidden my-auto p-6 sm:p-7 space-y-5">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-700 to-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                    <Building2 className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-lg text-[#1c1a3b] dark:text-white">
                      Government Secure Checkout
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>256-Bit SSL Encrypted • SAM.gov Cleared</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Order Breakdown Box */}
              <div className="p-4 bg-gradient-to-r from-indigo-50/80 via-blue-50/80 to-slate-50 dark:from-indigo-950/60 dark:via-blue-950/60 dark:to-slate-900 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                      ENTERPRISE SAAS PLAN
                    </span>
                    <p className="text-sm font-heading font-extrabold text-[#1c1a3b] dark:text-white">
                      Municipal Operations Work Desk
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-heading font-black text-indigo-700 dark:text-indigo-300">
                      $25.00
                    </span>
                    <span className="text-xs text-slate-500"> / mo</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-indigo-200/50 dark:border-indigo-900/50 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                  <span>Municipal Sales Tax (Exempt)</span>
                  <span className="font-mono font-bold text-emerald-600">$0.00 USD</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Select Procurement Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-600 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/30'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>P-Card / Credit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('po')}
                    className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      paymentMethod === 'po'
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-600 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/30'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Purchase Order</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ach')}
                    className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      paymentMethod === 'ach'
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-600 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/30'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>ACH / Bank Wire</span>
                  </button>
                </div>
              </div>

              {/* Form Content Based on Method */}
              <form onSubmit={handleSubscribePayment} className="space-y-4">
                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                        Department / Cardholder Name
                      </label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                        P-Card / Credit Card Number
                      </label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                          CVC / Security Code
                        </label>
                        <input
                          type="text"
                          required
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'po' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                        Municipal Purchase Order (PO) Number
                      </label>
                      <input
                        type="text"
                        required
                        value={poNumber}
                        onChange={(e) => setPoNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                          Tax ID / EIN Number
                        </label>
                        <input
                          type="text"
                          required
                          value={einNumber}
                          onChange={(e) => setEinNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                          Tax Exemption Certificate ID
                        </label>
                        <input
                          type="text"
                          required
                          value={taxExemptId}
                          onChange={(e) => setTaxExemptId(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'ach' && (
                  <div className="space-y-3 p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                    <p className="font-extrabold text-[#1c1a3b] dark:text-white flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      <span>Direct ACH / Wire Transfer Instructions</span>
                    </p>
                    <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300 space-y-1 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <p>Bank Name: First Civic Federal Reserve Bank</p>
                      <p>Routing Number: 121000358</p>
                      <p>Account Number: 9876543210</p>
                      <p>Vendor SAM.gov UEI: CVC-GOVT-2026-X9</p>
                    </div>
                  </div>
                )}

                {/* Government Contact Email */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Officer Billing Email (For Invoices & W-9 Form)
                  </label>
                  <input
                    type="email"
                    required
                    value={officerEmail}
                    onChange={(e) => setOfficerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  />
                </div>

                {paymentSuccessMsg && (
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-2xl text-xs font-black text-center border border-emerald-300 space-y-1">
                    <p>{paymentSuccessMsg}</p>
                    {licenseKey && (
                      <p className="font-mono text-[11px] bg-emerald-200/60 dark:bg-emerald-900/80 py-1 px-2 rounded font-bold">
                        License Key: {licenseKey}
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg cursor-pointer transition-all flex items-center justify-center space-x-2"
                >
                  {isProcessingPayment ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-200" />
                      <span>Authorize $25.00 USD Monthly Govt Subscription</span>
                    </>
                  )}
                </button>
              </form>

              {/* Security & Compliance Footer */}
              <div className="pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center space-x-3">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
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
      <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-md border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-700 text-white flex items-center justify-center shadow-md">
            <Building2 className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-heading font-black text-[#1c1a3b] dark:text-white">
                Municipal Operations Desk
              </h2>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-mono font-black rounded-full border border-emerald-300 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                SaaS Active ($25/mo)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Department Passcode Protected • Official City Administration Portal
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('board')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'board'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            📋 Work Orders Board
          </button>

          <button
            onClick={() => setActiveTab('subscription')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'subscription'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            💳 SaaS Billing ($25/mo)
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            🔒 Passcode Settings
          </button>

          <button
            onClick={handleLockDesk}
            title="Lock Municipal Desk"
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-950 text-slate-600 dark:text-slate-300 hover:text-red-600 rounded-xl transition-colors cursor-pointer ml-2"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TAB 1: WORK ORDERS KANBAN BOARD */}
      {activeTab === 'board' && (
        <AdminDashboard
          reports={reports}
          onUpdateStatus={onUpdateStatus}
          onSelectReport={onSelectReport}
        />
      )}

      {/* TAB 2: SAAS BILLING & SUBSCRIPTION MANAGEMENT */}
      {activeTab === 'subscription' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="soft-card p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                  CURRENT PLAN STATUS
                </span>
                <h3 className="text-xl font-heading font-black text-[#1c1a3b] dark:text-white">
                  CITYSCAPE Municipal Enterprise SaaS
                </h3>
                <p className="text-xs text-slate-500">Auto-renews on August 25, 2026</p>
              </div>

              <div className="text-right">
                <span className="text-3xl font-heading font-black text-indigo-700 dark:text-indigo-300">
                  $25.00
                </span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>
            </div>

            {/* Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Kanban Work Orders</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Emergency Triage Desk</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Official Response Seal</span>
              </div>
            </div>

            {/* Invoices List */}
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Invoice History
              </h4>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between text-xs font-medium">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Invoice #INV-2026-0725 ($25.00 USD)</span>
                </div>
                <button
                  onClick={() => downloadInvoicePDF('INV-2026-0725', '25.00', officerEmail || 'procurement@sfpublicworks.org')}
                  className="px-2.5 py-1 bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 rounded-lg text-[11px] font-bold border border-slate-200 dark:border-slate-600 flex items-center space-x-1 cursor-pointer active:scale-95 transition-all"
                >
                  <Download className="w-3 h-3" />
                  <span>PDF Invoice</span>
                </button>
              </div>
            </div>

            {/* Cancel Subscription */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-500">Need to pause municipal billing?</span>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to pause your $25/month SaaS subscription?')) {
                    setIsSubscribed(false);
                  }
                }}
                className="px-3 py-1.5 bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
              >
                Cancel $25/mo Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PASSCODE & SECURITY SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-md mx-auto soft-card p-6 space-y-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-base text-[#1c1a3b] dark:text-white">
                Update Security Passcode
              </h3>
              <p className="text-xs text-slate-500">Change passcode for department admin access</p>
            </div>
          </div>

          <form onSubmit={handleChangePasscode} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Current Passcode
              </label>
              <input
                type="password"
                required
                value={oldPassInput}
                onChange={(e) => setOldPassInput(e.target.value)}
                placeholder="Current passcode"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                New Security Passcode
              </label>
              <input
                type="password"
                required
                value={newPassInput}
                onChange={(e) => setNewPassInput(e.target.value)}
                placeholder="Enter new passcode"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
              />
            </div>

            {passChangeSuccess && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                {passChangeSuccess}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              Update Passcode
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
