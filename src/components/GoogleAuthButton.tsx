import React, { useState, useEffect } from 'react';
import { LogOut, CheckCircle, ShieldCheck, User, X, Mail, Lock, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { loginWithGoogle, registerWithEmail, loginWithEmail, logoutUser } from '../lib/firebase';
import { AuthModal } from './AuthModal';

interface GoogleAuthButtonProps {
  currentUserProfile?: UserProfile | null;
  onAuthChange?: (profile: UserProfile) => void;
  variant?: 'header' | 'profile' | 'modal' | 'full';
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  currentUserProfile,
  onAuthChange,
  variant = 'header',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(Boolean(currentUserProfile?.isGoogleConnected));
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Form states
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [customName, setCustomName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setIsConnected(Boolean(currentUserProfile?.isGoogleConnected));
  }, [currentUserProfile?.isGoogleConnected]);

  // Listen for popup OAuth postMessage response
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        setIsLoading(false);
        setIsConnected(true);
        setShowAccountModal(false);
        fetch('/api/profile')
          .then((res) => res.json())
          .then((data) => {
            if (data.profile && onAuthChange) {
              onAuthChange(data.profile);
            }
          })
          .catch((err) => console.error('Error updating profile after Google login:', err));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAuthChange]);

  const connectAccountDirectly = async (email: string, name: string, picture?: string) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/google/connect-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          picture: picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          id: `user-${Date.now()}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsConnected(true);
        setShowAccountModal(false);
        if (data.profile && onAuthChange) {
          onAuthChange(data.profile);
        }
      }
    } catch (err) {
      console.error('Direct connect error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    setIsLoading(true);
    setAuthError(null);

    try {
      if (authMode === 'REGISTER') {
        if (customPassword.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        // Firebase Auth User Registration
        const user = await registerWithEmail(customEmail.trim(), customPassword, customName.trim() || undefined);
        await connectAccountDirectly(
          user.email || customEmail.trim(),
          user.displayName || customName.trim() || customEmail.trim().split('@')[0],
          user.photoURL || undefined
        );
      } else {
        // Firebase Auth Login
        let user;
        if (customPassword) {
          try {
            user = await loginWithEmail(customEmail.trim(), customPassword);
          } catch (fErr: any) {
            console.warn('Firebase login attempt:', fErr);
            // If user doesn't exist in Firebase yet or password mistyped, allow quick sign in fallback
            if (fErr.code === 'auth/user-not-found' || fErr.code === 'auth/wrong-password' || fErr.code === 'auth/invalid-credential') {
              throw new Error('Invalid email or password. Please check credentials or switch to Create Account.');
            }
          }
        }
        await connectAccountDirectly(
          user?.email || customEmail.trim(),
          user?.displayName || customName.trim() || customEmail.trim().split('@')[0],
          user?.photoURL || undefined
        );
      }
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      setAuthError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setAuthError(null);

    // Step 1: Try Firebase Auth Google Sign-In Popup
    try {
      const firebaseUser = await loginWithGoogle();
      if (firebaseUser && firebaseUser.email) {
        await connectAccountDirectly(
          firebaseUser.email,
          firebaseUser.displayName || firebaseUser.email.split('@')[0],
          firebaseUser.photoURL || undefined
        );
        return;
      }
    } catch (firebaseErr) {
      console.warn('Firebase popup auth fallback:', firebaseErr);
    }

    // Step 2: Try Server OAuth Popup
    try {
      const res = await fetch('/api/auth/google/url');
      if (res.ok) {
        const { url } = await res.json();
        const popup = window.open(
          url,
          'google_oauth_popup',
          'width=520,height=650,status=no,toolbar=no,menubar=no'
        );

        if (popup) {
          const timer = setInterval(() => {
            if (popup.closed) {
              clearInterval(timer);
              setIsLoading(false);
            }
          }, 1000);
          return;
        }
      }
    } catch (serverErr) {
      console.warn('Server OAuth launch warning:', serverErr);
    }

    // Step 3: Open in-app account modal for manual email or demo login
    setIsLoading(false);
    setShowAccountModal(true);
  };

  const handleDisconnect = async () => {
    try {
      await logoutUser().catch(() => {});
      const res = await fetch('/api/auth/google/disconnect', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setIsConnected(false);
        if (onAuthChange && data.profile) {
          onAuthChange(data.profile);
        }
      }
    } catch (err) {
      console.error('Failed to disconnect account:', err);
    }
  };

  const GoogleIcon = () => (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.28v3.13C3.25 21.31 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.6H1.28C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.4l4-3.13z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.28 6.6l4 3.13c.95-2.83 3.6-4.98 6.72-4.98z" />
    </svg>
  );

  return (
    <>
      {isConnected && currentUserProfile?.email ? (
        variant === 'header' ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowAccountModal(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowAccountModal(true);
              }
            }}
            title="Resident Account: Click to view details or manage session"
            aria-label="Resident Account: Click to view details or manage session"
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 bg-[#0A2540] hover:bg-[#0e3357] dark:bg-[#071B2F] dark:hover:bg-[#0b2947] text-white border-1.5 border-[#006D5B] dark:border-teal-500/50 rounded-xl text-xs sm:text-sm font-bold shadow-xs h-[38px] sm:h-[42px] min-w-[76px] xs:min-w-[88px] sm:min-w-[100px] whitespace-nowrap cursor-pointer transition-all active:scale-98 focus:outline-none focus:ring-2 focus:ring-teal-400 group shrink-0"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#006D5B] text-teal-100 flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 border border-teal-300/40 shadow-xs group-hover:scale-105 transition-transform">
                {currentUserProfile.fullName ? currentUserProfile.fullName.charAt(0).toUpperCase() : 'R'}
              </div>
              <div className="flex flex-col text-left leading-tight hidden xs:flex">
                <span className="text-[11px] sm:text-xs font-bold text-white max-w-[50px] xs:max-w-[70px] sm:max-w-[110px] truncate group-hover:text-teal-200 transition-colors">
                  {currentUserProfile.fullName || currentUserProfile.email.split('@')[0]}
                </span>
              </div>
            </div>
            <div className="h-3 w-px bg-slate-700/80 mx-0.5 shrink-0 hidden xs:block" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDisconnect();
              }}
              title="Sign Out / Disconnect Account"
              aria-label="Sign Out / Disconnect Account"
              className="text-slate-300 hover:text-rose-400 p-1 rounded-lg hover:bg-white/10 transition-all cursor-pointer min-h-[24px] min-w-[24px] flex items-center justify-center shrink-0 active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="p-4 bg-white dark:bg-[#0A2540] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl space-y-3 text-[#111827] dark:text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-[#E6F4F1] dark:bg-[#004D40] text-[#006D5B] dark:text-teal-200 rounded-xl border border-[#006D5B]/30">
                  <ShieldCheck className="w-5 h-5 text-[#006D5B] dark:text-teal-200" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#111827] dark:text-white flex items-center gap-1.5">
                    <span>Resident Account Connected</span>
                    <CheckCircle className="w-4 h-4 text-[#006D5B] dark:text-teal-300" />
                  </div>
                  <div className="text-xs text-[#006D5B] dark:text-teal-300 font-mono font-bold">{currentUserProfile.email}</div>
                </div>
              </div>

              <button
                onClick={handleDisconnect}
                className="px-4 py-2.5 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 rounded-xl border border-rose-300 dark:border-rose-800 transition-colors cursor-pointer min-h-[48px]"
              >
                Sign Out
              </button>
            </div>
          </div>
        )
      ) : variant === 'header' ? (
        <button
          onClick={() => setShowAccountModal(true)}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 bg-[#0A2540] hover:bg-[#006D5B] text-white border-1.5 border-[#006D5B]/50 rounded-xl text-xs sm:text-sm font-bold shadow-xs cursor-pointer disabled:opacity-50 h-[38px] sm:h-[42px] min-w-[76px] xs:min-w-[88px] sm:min-w-[100px] whitespace-nowrap transition-all active:scale-97 shrink-0"
        >
          <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-300 shrink-0" />
          <span className="leading-none truncate">{isLoading ? '...' : 'Sign In'}</span>
        </button>
      ) : (
        <div className="p-4 sm:p-5 bg-white dark:bg-[#0A2540] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl space-y-3.5 shadow-sm text-[#111827] dark:text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#006D5B] text-white rounded-xl shadow-xs">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111827] dark:text-white">Resident Account Access</h4>
              <p className="text-xs font-medium text-[#006D5B] dark:text-teal-300">Sign in or register to submit and verify neighborhood reports</p>
            </div>
          </div>

          <button
            onClick={() => setShowAccountModal(true)}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-[#B45309] hover:bg-[#92400E] text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50 min-h-[56px]"
          >
            <LogIn className="w-5 h-5 text-white" />
            <span>{isLoading ? 'Loading Auth...' : 'Open Resident Sign In / Register'}</span>
          </button>
        </div>
      )}

      {/* Accessible Resident Account Authentication & Registration Modal */}
      <AuthModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        currentUserProfile={currentUserProfile}
        onAuthChange={onAuthChange}
        initialMode={authMode}
      />
    </>
  );
};
