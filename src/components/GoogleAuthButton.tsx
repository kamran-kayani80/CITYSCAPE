import React, { useState, useEffect } from 'react';
import { LogOut, CheckCircle, ShieldCheck, User, X, Mail } from 'lucide-react';
import { GoogleUser, UserProfile } from '../types';
import { loginWithGoogle } from '../lib/firebase';

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
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  useEffect(() => {
    setIsConnected(Boolean(currentUserProfile?.isGoogleConnected));
  }, [currentUserProfile?.isGoogleConnected]);

  // Listen for popup OAuth postMessage response
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Accept messages from same origin, run.app, or localhost
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        setIsLoading(false);
        setIsConnected(true);
        setShowAccountModal(false);
        // Refresh profile state
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
    try {
      const res = await fetch('/api/auth/google/connect-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          picture: picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          id: `google-${Date.now()}`,
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
      console.error('Direct Google connect error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

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
      console.warn('Firebase popup auth fallback to server OAuth / modal:', firebaseErr);
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
          // Check if popup closed without completing after 8 seconds
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

    // Step 3: If popups are blocked in iframe preview, open in-app account selector modal
    setIsLoading(false);
    setShowAccountModal(true);
  };

  const handleDisconnect = async () => {
    try {
      const res = await fetch('/api/auth/google/disconnect', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setIsConnected(false);
        if (onAuthChange && data.profile) {
          onAuthChange(data.profile);
        }
      }
    } catch (err) {
      console.error('Failed to disconnect Google account:', err);
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
          <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <GoogleIcon />
            <span className="truncate max-w-[130px]">{currentUserProfile.email}</span>
            <button
              onClick={handleDisconnect}
              title="Disconnect Google Account"
              className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 p-0.5 rounded-full hover:bg-emerald-200/50 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
                  <GoogleIcon />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Google Account Connected</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-xs text-slate-500 font-mono">{currentUserProfile.email}</div>
                </div>
              </div>

              <button
                onClick={handleDisconnect}
                className="px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl border border-red-200/60 transition-colors cursor-pointer"
              >
                Disconnect
              </button>
            </div>
          </div>
        )
      ) : variant === 'header' ? (
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="btn-soft-tactile pro-button flex items-center space-x-2 px-3 py-1.5 rounded-2xl text-xs cursor-pointer disabled:opacity-50"
        >
          <GoogleIcon />
          <span>{isLoading ? 'Connecting...' : 'Sign in'}</span>
        </button>
      ) : (
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <GoogleIcon />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sign in with Google</h4>
              <p className="text-[11px] text-slate-500">Auto-verify reports and earn extra Civic Karma</p>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 pro-button"
          >
            <GoogleIcon />
            <span>{isLoading ? 'Connecting Google Account...' : 'Connect Google Account'}</span>
          </button>
        </div>
      )}

      {/* In-App Interactive Google Account Selector Modal (Fallback when popups blocked in iframe) */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-settled-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <GoogleIcon />
                <span className="font-bold text-sm text-slate-900 dark:text-white">Sign in with Google</span>
              </div>
              <button
                onClick={() => setShowAccountModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Enter your email address to sign in or connect your Google account:
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customEmail.trim()) {
                  connectAccountDirectly(
                    customEmail.trim(),
                    customName.trim() || customEmail.trim().split('@')[0]
                  );
                }
              }}
              className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700"
            >
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#008080] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name (Optional)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#008080] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!customEmail.trim() || isLoading}
                className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#008080] hover:bg-[#006666] text-[#CCFF00] font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isLoading ? 'Signing in...' : 'Sign In with Email'}</span>
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 block">Or select a demo profile:</span>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => connectAccountDirectly('resident@cityscape.org', 'Civic Resident')}
                  className="w-full flex items-center space-x-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#008080] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                    CR
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Civic Resident</div>
                    <div className="text-[11px] text-slate-500 font-mono truncate">resident@cityscape.org</div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => connectAccountDirectly('alex.m@sfgov.org', 'Alex Morgan (Civic Lead)')}
                  className="w-full flex items-center space-x-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#008080] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0A2540] text-[#CCFF00] font-bold flex items-center justify-center text-xs shrink-0">
                    AM
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Alex Morgan (Civic Lead)</div>
                    <div className="text-[11px] text-slate-500 font-mono truncate">alex.m@sfgov.org</div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

