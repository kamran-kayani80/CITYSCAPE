import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Unlock,
  ShieldAlert,
  KeyRound,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  AlertTriangle,
  Landmark,
  ShieldCheck,
} from 'lucide-react';

interface OwnerPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const VALID_PASSCODES = [
  'cityscape-owner-2026',
  'cityscape2026',
  'admin80',
  'owner123',
  'cityscape',
];

export const OwnerPasswordModal: React.FC<OwnerPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setErrorMsg('Please enter the Master Platform Passcode.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    setTimeout(() => {
      const normalized = passcode.trim().toLowerCase();
      if (VALID_PASSCODES.includes(normalized)) {
        setIsVerifying(false);
        setPasscode('');
        setErrorMsg(null);
        sessionStorage.setItem('cityscape_owner_unlocked', 'true');
        onSuccess();
      } else {
        setIsVerifying(false);
        setAttempts((prev) => prev + 1);
        setErrorMsg('Authentication failed: Invalid Master Passcode. Please check the passcode and try again.');
      }
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md bg-white dark:bg-[#0A2540] rounded-3xl border-2 border-amber-500/80 dark:border-amber-400 shadow-2xl overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="owner-lock-modal-title"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-br from-[#78350F] via-[#92400E] to-[#B45309] text-white relative">
            <button
              onClick={onClose}
              aria-label="Close Security Verification Modal"
              className="absolute top-4 right-4 p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-400/20 border-2 border-amber-300 text-amber-200 shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-200 bg-black/30 px-2 py-0.5 rounded-md border border-amber-300/30">
                  Strict Access Control
                </span>
                <h2 id="owner-lock-modal-title" className="text-xl sm:text-2xl font-black tracking-tight mt-1 text-white">
                  Owner Oversight Terminal
                </h2>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border-1.5 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-100 text-xs sm:text-sm leading-relaxed space-y-1.5">
              <div className="flex items-center gap-2 font-black text-amber-900 dark:text-amber-200">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Executive Security Gate</span>
              </div>
              <p>
                This terminal accesses global multi-city SaaS billing pipelines, merchant sponsorships, and confidential platform revenue audits ($197,500 MRR).
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#111827] dark:text-white uppercase tracking-wider mb-1.5">
                  Master Security Passcode
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                    <KeyRound className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Enter owner master passcode"
                    autoFocus
                    className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-[#CBD5E1] dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 rounded-xl text-sm font-mono font-bold text-[#111827] dark:text-white outline-none transition-all placeholder:font-sans placeholder:font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                    aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Feedback */}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-red-50 dark:bg-red-950/70 border-1.5 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 text-xs font-bold flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {/* Demo Hint Banner for Seamless Testing */}
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span className="font-medium">Demo Passcode:</span>
                <button
                  type="button"
                  onClick={() => setPasscode('cityscape-owner-2026')}
                  className="font-mono font-black text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700 hover:underline cursor-pointer"
                >
                  cityscape-owner-2026
                </button>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#92400E] via-[#B45309] to-[#78350F] hover:from-[#B45309] hover:to-[#92400E] text-white font-black text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 border-1.5 border-amber-400"
                >
                  {isVerifying ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 text-amber-200" />
                      <span>Authenticate</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
