/**
 * Cityscape PWA & Device Installation Helper
 * Detects device OS, manages native install prompts, and provides senior-accessible install guides
 */

export interface DeviceInfo {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isDesktop: boolean;
  isMac: boolean;
  isWindows: boolean;
  isStandalone: boolean;
  canPromptInstall: boolean;
}

let deferredInstallPrompt: any = null;
const listeners: Array<(canInstall: boolean) => void> = [];

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent default mini-infobar or browser prompt
    e.preventDefault();
    deferredInstallPrompt = e;
    listeners.forEach((cb) => cb(true));
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    listeners.forEach((cb) => cb(false));
  });
}

export function subscribePWAInstall(callback: (canInstall: boolean) => void) {
  listeners.push(callback);
  callback(Boolean(deferredInstallPrompt));
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isMobile: false,
      isIOS: false,
      isAndroid: false,
      isDesktop: true,
      isMac: false,
      isWindows: false,
      isStandalone: false,
      canPromptInstall: false,
    };
  }

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
  const isAndroid = /android/i.test(userAgent);
  const isMobile = isIOS || isAndroid || /Mobi|Tablet|iPad/i.test(userAgent);
  const isMac = /Macintosh|Mac OS X/i.test(userAgent) && !isIOS;
  const isWindows = /Windows NT/i.test(userAgent);
  const isDesktop = !isMobile;

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://');

  return {
    isMobile,
    isIOS,
    isAndroid,
    isDesktop,
    isMac,
    isWindows,
    isStandalone,
    canPromptInstall: Boolean(deferredInstallPrompt),
  };
}

export async function promptPWAInstall(): Promise<{ outcome: 'accepted' | 'dismissed' | 'unsupported' }> {
  if (!deferredInstallPrompt) {
    return { outcome: 'unsupported' };
  }

  try {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    listeners.forEach((cb) => cb(false));
    return { outcome };
  } catch (err) {
    console.warn('PWA install prompt error:', err);
    return { outcome: 'dismissed' };
  }
}
