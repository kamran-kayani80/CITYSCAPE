import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Mail,
  Lock,
  User,
  LogIn,
  LogOut,
  UserPlus,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Check,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { UserProfile } from '../types';
import {
  loginWithGoogle,
  registerWithEmail,
  loginWithEmail,
  logoutUser,
} from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserProfile?: UserProfile | null;
  onAuthChange?: (profile: UserProfile) => void;
  initialMode?: 'LOGIN' | 'REGISTER';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUserProfile,
  onAuthChange,
  initialMode = 'LOGIN',
}) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    setAuthMode(initialMode);
    setAuthError(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleConnectProfile = async (
    userEmail: string,
    userName: string,
    userPicture?: string
  ) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/google/connect-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          name: userName,
          picture:
            userPicture ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          id: `user-${Date.now()}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.profile && onAuthChange) {
          onAuthChange(data.profile);
        }
        onClose();
      } else {
        throw new Error('Server returned an error while updating resident profile.');
      }
    } catch (err: any) {
      console.error('Connect profile error:', err);
      setAuthError(err?.message || 'Connected with Auth, but failed to sync profile data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setAuthError(null);

    try {
      if (authMode === 'REGISTER') {
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        const user = await registerWithEmail(
          email.trim(),
          password,
          name.trim() || undefined
        );
        await handleConnectProfile(
          user.email || email.trim(),
          user.displayName || name.trim() || email.trim().split('@')[0],
          user.photoURL || undefined
        );
      } else {
        let user;
        if (password) {
          try {
            user = await loginWithEmail(email.trim(), password);
          } catch (fErr: any) {
            console.warn('Firebase login attempt:', fErr);
            if (
              fErr.code === 'auth/user-not-found' ||
              fErr.code === 'auth/wrong-password' ||
              fErr.code === 'auth/invalid-credential'
            ) {
              throw new Error(
                'Invalid email or password. Please verify your details or select "Create Account".'
              );
            }
          }
        }
        await handleConnectProfile(
          user?.email || email.trim(),
          user?.displayName || name.trim() || email.trim().split('@')[0],
          user?.photoURL || undefined
        );
      }
    } catch (err: any) {
      console.error('Email Auth Submission Error:', err);
      setAuthError(err?.message || 'Authentication could not be completed. Let\'s try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setAuthError(null);

    // 1. Firebase Auth Google Sign-In Popup
    try {
      const firebaseUser = await loginWithGoogle();
      if (firebaseUser && firebaseUser.email) {
        await handleConnectProfile(
          firebaseUser.email,
          firebaseUser.displayName || firebaseUser.email.split('@')[0],
          firebaseUser.photoURL || undefined
        );
        return;
      }
    } catch (firebaseErr: any) {
      console.warn('Firebase Google Auth Popup:', firebaseErr);
      const code = firebaseErr?.code || '';
      
      if (code === 'auth/popup-closed-by-user') {
        setAuthError('Google sign-in popup was closed. Please try again.');
      } else if (code === 'auth/popup-blocked') {
        setAuthError('Browser popup was blocked. Please enable popups or use Email & Password below.');
      } else if (code === 'auth/unauthorized-domain') {
        setAuthError('The development preview URL is running in sandbox mode. You can sign in instantly using Email & Password or the Quick Resident Sign-In button below.');
      } else {
        setAuthError(
          firebaseErr?.message?.includes('network')
            ? 'Network timeout during Google sign-in. Please try again or use Email & Password.'
            : (firebaseErr?.message || 'Google sign-in could not be completed. Please try again or use Email.')
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await logoutUser().catch(() => {});
      const res = await fetch('/api/auth/google/disconnect', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (onAuthChange && data.profile) {
          onAuthChange(data.profile);
        }
        onClose();
      }
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.28v3.13C3.25 21.31 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.6H1.28C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.4l4-3.13z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.28 6.6l4 3.13c.95-2.83 3.6-4.98 6.72-4.98z" />
    </svg>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      {/* High-Contrast Accessible Modal Card complying with WCAG AAA & Full Smooth Scrolling */}
      <div className="w-full max-w-lg my-auto relative z-10 flex flex-col max-h-[88vh] sm:max-h-[85vh] border-1.5 border-[#CBD5E1] dark:border-slate-700 bg-white dark:bg-[#0A2540] text-[#111827] dark:text-white shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Fixed Modal Header (Non-scrolling anchor) */}
        <div className="shrink-0 px-5 sm:px-6 py-4 sm:py-5 border-b-1.5 border-[#CBD5E1] dark:border-slate-700 bg-white dark:bg-[#0A2540] flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 sm:p-3 bg-[#0A2540] dark:bg-[#006D5B] rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="text-left">
              <h3
                id="auth-modal-title"
                className="font-bold text-lg sm:text-xl text-[#111827] dark:text-white leading-tight"
              >
                {currentUserProfile?.isGoogleConnected ? 'Resident Account' : 'Resident Sign-In'}
              </h3>
              <p className="text-xs font-semibold text-[#006D5B] dark:text-teal-300">
                Community Access & Report Verification
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-[#CBD5E1] dark:border-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 active:scale-95"
            title="Close window"
            aria-label="Close window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Container (Completely scrollable on all screen sizes) */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 py-5 sm:py-6 space-y-5 focus:outline-none">
          {/* User Already Connected View */}
          {currentUserProfile?.isGoogleConnected && currentUserProfile?.email ? (
            <div className="space-y-5 text-center">
              {/* Civic Resident Passport Card */}
              <div className="p-5 sm:p-6 bg-[#0A2540] rounded-2xl space-y-4 text-white shadow-lg border-2 border-[#006D5B] text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#006D5B]/20 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#006D5B] text-amber-300 flex items-center justify-center font-extrabold text-lg shadow-sm border-2 border-teal-300/40">
                      {currentUserProfile.fullName ? currentUserProfile.fullName.charAt(0).toUpperCase() : 'R'}
                    </div>
                    <div>
                      <div className="text-base font-bold text-white leading-tight">
                        {currentUserProfile.fullName || 'Verified Resident'}
                      </div>
                      <div className="text-xs text-teal-200 font-mono mt-0.5 truncate max-w-[200px] sm:max-w-[260px]">
                        {currentUserProfile.email}
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#006D5B] rounded-xl text-xs font-bold text-white border border-teal-300/40 shrink-0 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Verified</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#006D5B]/40 grid grid-cols-2 gap-3 text-xs relative z-10">
                  <div className="bg-[#071B2F] p-2.5 rounded-xl border border-[#006D5B]/50">
                    <span className="text-slate-300 block font-bold text-[11px]">Civic Role</span>
                    <span className="font-bold text-white text-xs sm:text-sm">Verified Resident</span>
                  </div>
                  <div className="bg-[#071B2F] p-2.5 rounded-xl border border-[#006D5B]/50">
                    <span className="text-slate-300 block font-bold text-[11px]">Data Status</span>
                    <span className="font-bold text-emerald-400 text-xs sm:text-sm">Cloud Synced</span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 font-medium leading-relaxed relative z-10">
                  Your submitted reports, verifications, and community upvotes are permanently linked to your verified resident identity.
                </p>
              </div>

              {/* Account Actions Group */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleDisconnect();
                    setAuthMode('LOGIN');
                  }}
                  className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-[#111827] dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-xs cursor-pointer transition-all min-h-[50px] flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-[#006D5B] dark:text-teal-300" />
                  <span>Switch / Connect Another Account</span>
                </button>

                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-rose-900 dark:text-rose-100 bg-rose-50 dark:bg-rose-950/80 hover:bg-rose-100 dark:hover:bg-rose-900 border-1.5 border-rose-300 dark:border-rose-800 shadow-xs cursor-pointer transition-all min-h-[50px] flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Sign Out of Resident Account</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Error Notice Display */}
              {authError && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/90 border-1.5 border-amber-400 dark:border-amber-700 rounded-xl text-xs sm:text-sm text-amber-950 dark:text-amber-100 font-bold flex items-start space-x-2.5 text-left shadow-sm">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* 1. Primary Google Sign-In Action */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full py-3.5 px-5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border-2 border-[#CBD5E1] dark:border-slate-700 text-[#111827] dark:text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-3 shadow-xs hover:border-[#0A2540] dark:hover:border-teal-400 transition-all cursor-pointer min-h-[52px] disabled:opacity-50"
                >
                  <GoogleIcon />
                  <span>{isLoading ? 'Connecting Google...' : 'Continue with Google Sign-In'}</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#CBD5E1] dark:border-slate-700" />
                <span className="flex-shrink mx-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Or use Email & Password
                </span>
                <div className="flex-grow border-t border-[#CBD5E1] dark:border-slate-700" />
              </div>

              {/* Mode Toggle Switch (Sign In vs Register) */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('LOGIN');
                    setAuthError(null);
                  }}
                  className={`py-2.5 px-4 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 min-h-[44px] ${
                    authMode === 'LOGIN'
                      ? 'bg-[#0A2540] dark:bg-[#006D5B] text-white shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('REGISTER');
                    setAuthError(null);
                  }}
                  className={`py-2.5 px-4 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 min-h-[44px] ${
                    authMode === 'REGISTER'
                      ? 'bg-[#0A2540] dark:bg-[#006D5B] text-white shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </div>

              {/* Email / Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {authMode === 'REGISTER' && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#111827] dark:text-white flex items-center space-x-1.5">
                      <User className="w-4 h-4 text-[#006D5B] dark:text-teal-300" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-4 py-3 bg-white dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 focus:border-[#0A2540] dark:focus:border-teal-400 text-slate-900 dark:text-white placeholder-slate-400 text-base font-semibold rounded-xl outline-none transition-all min-h-[50px]"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#111827] dark:text-white flex items-center space-x-1.5">
                    <Mail className="w-4 h-4 text-[#006D5B] dark:text-teal-300" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="neighbor@cityscape.org"
                    className="w-full px-4 py-3 bg-white dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 focus:border-[#0A2540] dark:focus:border-teal-400 text-slate-900 dark:text-white placeholder-slate-400 text-base font-semibold rounded-xl outline-none transition-all min-h-[50px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#111827] dark:text-white flex items-center space-x-1.5">
                    <Lock className="w-4 h-4 text-[#006D5B] dark:text-teal-300" />
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-3 bg-white dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 focus:border-[#0A2540] dark:focus:border-teal-400 text-slate-900 dark:text-white placeholder-slate-400 text-base font-semibold rounded-xl outline-none transition-all min-h-[50px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!email.trim() || isLoading}
                  className="w-full py-3.5 px-6 bg-[#B45309] hover:bg-[#92400E] text-white text-base font-bold cursor-pointer shadow-md flex items-center justify-center space-x-2 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 min-h-[52px]"
                >
                  {authMode === 'REGISTER' ? (
                    <UserPlus className="w-5 h-5" />
                  ) : (
                    <LogIn className="w-5 h-5" />
                  )}
                  <span>
                    {isLoading
                      ? 'Connecting...'
                      : authMode === 'REGISTER'
                      ? 'Create Resident Account'
                      : 'Sign In to Account'}
                  </span>
                </button>
              </form>

              {/* Instant Resident Demo / Fast Access */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleConnectProfile(
                      email.trim() || 'resident@cityscape.org',
                      name.trim() || 'Civic Resident',
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                    );
                  }}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-[#006D5B] dark:text-teal-300 border border-teal-300 dark:border-teal-700/60 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer transition-all min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4 text-[#006D5B] dark:text-teal-300" />
                  <span>
                    {email.trim() ? `Quick Sign In as ${email.trim()}` : 'Quick Sign In (1-Click Resident Access)'}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
