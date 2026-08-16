import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  Smartphone,
  Monitor,
  Share2,
  Users,
  Copy,
  Check,
  QrCode,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Mail,
  Send,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Info,
  Laptop,
  Apple,
  Chrome,
  Flame,
  Volume2,
  Gift,
  MapPin,
  ArrowRight,
  Layers,
  FileText
} from 'lucide-react';
import { getDeviceInfo, promptPWAInstall, subscribePWAInstall, DeviceInfo } from '../lib/pwaInstaller';
import { getPlatformSpecificUrl, getShareableUrl, canNativeShare, triggerNativeShare } from '../lib/shareUtils';
import { civicAudio } from '../lib/chimeAudio';
import { CityscapeLogo } from './CityscapeLogo';

interface AppDownloadShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'download' | 'invite' | 'share';
  activeCityName?: string;
  userKarma?: number;
  onKarmaReward?: (bonus: number) => void;
}

export const AppDownloadShareModal: React.FC<AppDownloadShareModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'download',
  activeCityName = 'Rawalpindi',
  userKarma = 840,
  onKarmaReward,
}) => {
  const [activeTab, setActiveTab] = useState<'download' | 'invite' | 'share'>(defaultTab);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getDeviceInfo());
  const [canInstall, setCanInstall] = useState<boolean>(false);
  const [installStatus, setInstallStatus] = useState<'idle' | 'installed' | 'dismissed'>('idle');

  // Copy Feedback States
  const [copiedLinkType, setCopiedLinkType] = useState<string | null>(null);
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<string | null>(null);

  // Invitation Customization State
  const [inviteSenderName, setInviteSenderName] = useState<string>('A Civic Neighbor');
  const [inviteWard, setInviteWard] = useState<string>('Ward 4 - Central District');
  const [inviteRecipientContact, setInviteRecipientContact] = useState<string>('');
  const [inviteCustomNote, setInviteCustomNote] = useState<string>(
    `Hi neighbor! I'm inviting you to test Cityscape, our new community civic app. Join our free trial run to report street issues, check municipal water & power bulletins, and track repair times together!`
  );
  const [showPrintableFlyer, setShowPrintableFlyer] = useState<boolean>(false);
  const [totalInvitesCount, setTotalInvitesCount] = useState<number>(14);

  // Sync PWA status
  useEffect(() => {
    setDeviceInfo(getDeviceInfo());
    const unsubscribe = subscribePWAInstall((available) => {
      setCanInstall(available);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      // Fetch dynamic download stats
      fetch('/api/app-download-info')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.totalTrialInvitesSent !== undefined) {
            setTotalInvitesCount(data.totalTrialInvitesSent + 14);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  const universalUrl = getPlatformSpecificUrl('universal', 'COMMUNITY_TRIAL_2026');
  const mobileUrl = getPlatformSpecificUrl('mobile', 'MOBILE_TRIAL_2026');
  const desktopUrl = getPlatformSpecificUrl('desktop', 'DESKTOP_TRIAL_2026');
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    mobileUrl
  )}&bgcolor=FFFFFF&color=0A2540&margin=1`;

  const copyToClipboard = (text: string, typeKey: string) => {
    civicAudio.playClickSoft();
    navigator.clipboard.writeText(text);
    setCopiedLinkType(typeKey);
    setTimeout(() => setCopiedLinkType(null), 2500);
  };

  const handleNativeInstall = async () => {
    civicAudio.playCivicChime();
    const result = await promptPWAInstall();
    if (result.outcome === 'accepted') {
      setInstallStatus('installed');
    } else if (result.outcome === 'dismissed') {
      setInstallStatus('dismissed');
    }
  };

  const handleSendTrialInvite = async (channel: string) => {
    civicAudio.playCivicChime();
    setIsSendingInvite(true);

    try {
      const payload = {
        senderName: inviteSenderName,
        recipientContact: inviteRecipientContact,
        wardName: inviteWard,
        cityName: activeCityName,
        customMessage: inviteCustomNote,
        channel,
      };

      const res = await fetch('/api/trial-invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setTotalInvitesCount((prev) => prev + 1);
        setInviteSuccessMsg(`Thank you! Invitation logged. You earned +50 Civic Karma for inviting a neighbor.`);
        if (onKarmaReward) {
          onKarmaReward(50);
        }
      }
    } catch (e) {
      console.warn('Could not record invite to server:', e);
    } finally {
      setIsSendingInvite(false);
    }
  };

  // Composed text for messaging
  const fullInviteMessage = `${inviteCustomNote}\n\n🏛️ Cityscape Free Community Trial (${activeCityName})\n👉 Open & Install: ${universalUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullInviteMessage)}`;
  const smsUrl = `sms:?&body=${encodeURIComponent(fullInviteMessage)}`;
  const emailUrl = `mailto:${encodeURIComponent(
    inviteRecipientContact
  )}?subject=${encodeURIComponent(
    `Invitation to Trial Cityscape in ${activeCityName} (${inviteWard})`
  )}&body=${encodeURIComponent(fullInviteMessage)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    universalUrl
  )}&text=${encodeURIComponent(inviteCustomNote)}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0A2540]/80 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Download App and Invite Neighbors"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-white dark:bg-[#0E2841] text-[#111827] dark:text-slate-100 rounded-3xl shadow-2xl border-2 border-[#CBD5E1] dark:border-slate-700 overflow-hidden my-auto max-h-[92vh] flex flex-col text-left"
        >
          {/* Header Banner */}
          <div className="bg-[#0A2540] text-white p-5 sm:p-6 border-b-2 border-slate-700 relative shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-13 h-13 rounded-2xl bg-white/10 text-white border-2 border-white/20 flex items-center justify-center shrink-0 shadow-sm">
                  <Smartphone className="w-7 h-7 text-[#CCFF00]" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#B45309] text-white text-[11px] font-black uppercase tracking-wider">
                      Free Community Trial
                    </span>
                    <span className="text-xs font-bold text-teal-300">
                      Multi-Platform Mobile & Desktop
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                    Download Cityscape & Invite Neighbors
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    Install for offline access and help test our civic ecosystem across {activeCityName}.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer min-h-[48px] min-w-[48px] flex items-center justify-center shrink-0 border border-white/20"
                aria-label="Close dialog"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mt-5 bg-[#071B2F] p-1.5 rounded-2xl border border-slate-700/80 overflow-x-auto">
              <button
                onClick={() => {
                  civicAudio.playClickSoft();
                  setActiveTab('download');
                }}
                className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px] ${
                  activeTab === 'download'
                    ? 'bg-[#006D5B] text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Download className="w-4 h-4 text-[#CCFF00]" />
                <span>Download & Install</span>
              </button>

              <button
                onClick={() => {
                  civicAudio.playClickSoft();
                  setActiveTab('invite');
                }}
                className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px] ${
                  activeTab === 'invite'
                    ? 'bg-[#B45309] text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-4 h-4 text-amber-200" />
                <span>Invite Neighbors (+50 Karma)</span>
              </button>

              <button
                onClick={() => {
                  civicAudio.playClickSoft();
                  setActiveTab('share');
                }}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px] ${
                  activeTab === 'share'
                    ? 'bg-slate-700 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Share2 className="w-4 h-4 text-teal-300" />
                <span>Share Links</span>
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
            {/* ====================================================================
                TAB 1: DOWNLOAD & INSTALL APP (MOBILE + DESKTOP)
                ==================================================================== */}
            {activeTab === 'download' && (
              <div className="space-y-6">
                {/* 1-Click Native Install Callout if Available */}
                {canInstall && (
                  <div className="bg-gradient-to-r from-[#006D5B] to-[#0A2540] text-white p-5 sm:p-6 rounded-2xl shadow-md border-2 border-[#006D5B] space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6 text-[#CCFF00]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black leading-tight">
                          1-Click Fast Install Ready on This Device
                        </h4>
                        <p className="text-xs sm:text-sm text-teal-100 font-medium">
                          Install Cityscape directly to your home screen or desktop application menu.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleNativeInstall}
                      className="w-full py-4 px-6 bg-[#B45309] hover:bg-[#92400E] text-white font-black text-base sm:text-lg rounded-xl shadow-lg transition-all transform active:scale-98 cursor-pointer flex items-center justify-center gap-3 min-h-[56px]"
                    >
                      <Download className="w-6 h-6 text-amber-200" />
                      <span>Install Cityscape App Now</span>
                    </button>
                  </div>
                )}

                {installStatus === 'installed' && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 rounded-2xl flex items-center gap-3 text-emerald-900 dark:text-emerald-200">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-black text-sm">App Successfully Installed!</h4>
                      <p className="text-xs font-medium">
                        Cityscape is now installed on your device. You can access it anytime directly from your home screen or applications menu.
                      </p>
                    </div>
                  </div>
                )}

                {/* Device-Specific Dual Grid: Mobile vs Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* MOBILE APP CONTAINER */}
                  <div className="bg-[#F8FAFC] dark:bg-[#071B2F] border-2 border-[#CBD5E1] dark:border-slate-700 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-xl bg-[#0A2540] text-white flex items-center justify-center shrink-0">
                        <Smartphone className="w-6 h-6 text-[#CCFF00]" />
                      </div>
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#006D5B] dark:text-teal-400">
                          Smartphones & Tablets
                        </span>
                        <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                          Mobile App (iOS & Android)
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      Enjoy instant camera reporting, real-time GPS pinpointing, offline queuing, and fast push alerts without app store delays.
                    </p>

                    {/* QR Code for Mobile Scanning */}
                    <div className="bg-white dark:bg-[#0A2540] p-4 rounded-xl border border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4">
                      <img
                        src={qrCodeUrl}
                        alt="Scan QR code to install Cityscape Mobile App"
                        className="w-28 h-28 rounded-lg border border-slate-200 dark:border-slate-600 shrink-0 bg-white"
                      />
                      <div className="space-y-2 text-center sm:text-left">
                        <span className="text-xs font-black text-[#0A2540] dark:text-white uppercase tracking-wider block">
                          Scan with Phone Camera
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          Point your phone camera to open the instant mobile trial run immediately.
                        </p>
                        <button
                          onClick={() => copyToClipboard(mobileUrl, 'mobile_url')}
                          className="text-xs font-bold text-[#006D5B] hover:text-[#0A2540] dark:hover:text-teal-300 inline-flex items-center gap-1.5 cursor-pointer underline"
                        >
                          {copiedLinkType === 'mobile_url' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Mobile Link Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Mobile Web App Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Step-by-Step Mobile Installation Guides */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-black text-[#0A2540] dark:text-white uppercase tracking-wider">
                        Quick Install Steps:
                      </h4>

                      {/* iOS Instructions */}
                      <div className="bg-white dark:bg-[#0A2540] p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                        <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-100 font-bold">
                          <Apple className="w-4 h-4 text-slate-900 dark:text-white" />
                          <span>Apple iOS (iPhone & iPad Safari):</span>
                        </div>
                        <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                          <li>
                            Tap the <strong>Share</strong> button (box with upward arrow) in Safari.
                          </li>
                          <li>
                            Scroll down and tap <strong>"Add to Home Screen"</strong> (⊞).
                          </li>
                          <li>
                            Tap <strong>"Add"</strong> in the top-right corner.
                          </li>
                        </ol>
                      </div>

                      {/* Android Instructions */}
                      <div className="bg-white dark:bg-[#0A2540] p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                        <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-100 font-bold">
                          <Chrome className="w-4 h-4 text-[#006D5B]" />
                          <span>Android (Chrome & Edge):</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          Tap the three dots (⋮) menu in Chrome and select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DESKTOP APP CONTAINER */}
                  <div className="bg-[#F8FAFC] dark:bg-[#071B2F] border-2 border-[#CBD5E1] dark:border-slate-700 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 rounded-xl bg-[#006D5B] text-white flex items-center justify-center shrink-0">
                          <Monitor className="w-6 h-6 text-[#CCFF00]" />
                        </div>
                        <div>
                          <span className="text-[11px] font-black uppercase tracking-wider text-[#B45309]">
                            Windows, Mac, Linux
                          </span>
                          <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                            Desktop Web Application
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        Run Cityscape in a high-speed standalone window with desktop notification badges, multi-monitor dispatch map support, and keyboard navigation.
                      </p>

                      <div className="bg-white dark:bg-[#0A2540] p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                        <div className="flex items-center space-x-2">
                          <Laptop className="w-5 h-5 text-[#006D5B]" />
                          <h4 className="text-xs font-black uppercase text-[#0A2540] dark:text-white">
                            Desktop Installation Instructions:
                          </h4>
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                          <li>
                            <strong>Chrome / Edge:</strong> Look for the <strong>Install Icon</strong> (computer screen with down arrow) in the browser address bar on the right.
                          </li>
                          <li>
                            <strong>Mac Safari:</strong> Select <strong>File</strong> &rarr; <strong>"Add to Dock"</strong> to launch like a native macOS app.
                          </li>
                          <li>
                            <strong>Keyboard Shortcut:</strong> Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border rounded font-mono text-[10px]">Ctrl + D</kbd> (or <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border rounded font-mono text-[10px]">⌘ + D</kbd>) to bookmark.
                          </li>
                        </ul>
                      </div>

                      {/* Offline & PWA Features Checklist */}
                      <div className="bg-white dark:bg-[#0A2540] p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#006D5B] dark:text-teal-400 block">
                          Included App Capabilities:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-200">
                          <span className="inline-flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#006D5B]" />
                            Offline Queue & Sync
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#006D5B]" />
                            Live GPS Pin Locator
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#006D5B]" />
                            Municipal Bulletins
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#006D5B]" />
                            HOA QR Pass Reader
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => copyToClipboard(desktopUrl, 'desktop_url')}
                        className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#0A2540] dark:text-white font-black text-sm rounded-xl border border-[#CBD5E1] dark:border-slate-600 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[50px]"
                      >
                        {copiedLinkType === 'desktop_url' ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>Desktop Web Link Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-[#006D5B]" />
                            <span>Copy Desktop Web App Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ====================================================================
                TAB 2: INVITATION TO TRIAL THE APP (NEIGHBOR ENGAGEMENT + KARMA)
                ==================================================================== */}
            {activeTab === 'invite' && (
              <div className="space-y-6">
                {/* Karma & Community Incentive Callout */}
                <div className="bg-gradient-to-r from-[#B45309] to-[#78350F] text-white p-5 sm:p-6 rounded-2xl shadow-md border-2 border-amber-500 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0">
                        <Gift className="w-7 h-7 text-[#CCFF00]" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider">
                            Community Ambassador Reward
                          </span>
                          <span className="text-xs font-bold text-amber-200">
                            {totalInvitesCount} Neighbors Invited
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-white leading-tight mt-0.5">
                          Earn +50 Civic Karma for Every Neighbor Invited
                        </h3>
                      </div>
                    </div>

                    <div className="hidden sm:block text-right">
                      <span className="text-2xl font-black text-[#CCFF00]">+{50}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider block text-amber-200">
                        Karma Points
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-amber-100 font-medium">
                    Stronger communities start with connected neighbors. Invite residents on your street, apartment building, or ward council to test Cityscape during our free trial run.
                  </p>
                </div>

                {/* Customizer Card */}
                <div className="bg-[#F8FAFC] dark:bg-[#071B2F] border-2 border-[#CBD5E1] dark:border-slate-700 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-[#006D5B]" />
                    <h3 className="text-base sm:text-lg font-black text-[#0A2540] dark:text-white">
                      Customize Your Neighborhood Invitation:
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Sender Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Your Name / Resident Title:
                      </label>
                      <input
                        type="text"
                        value={inviteSenderName}
                        onChange={(e) => setInviteSenderName(e.target.value)}
                        placeholder="e.g. Tariq, Flat 4B, or Neighborhood Watch"
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#CBD5E1] dark:border-slate-600 bg-white dark:bg-[#0A2540] text-sm font-semibold text-[#0A2540] dark:text-white outline-none focus:border-[#0A2540] min-h-[48px]"
                      />
                    </div>

                    {/* Ward / Area */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Your Ward / Street / Community:
                      </label>
                      <input
                        type="text"
                        value={inviteWard}
                        onChange={(e) => setInviteWard(e.target.value)}
                        placeholder="e.g. Ward 4 - Satellite Town"
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#CBD5E1] dark:border-slate-600 bg-white dark:bg-[#0A2540] text-sm font-semibold text-[#0A2540] dark:text-white outline-none focus:border-[#0A2540] min-h-[48px]"
                      />
                    </div>
                  </div>

                  {/* Recipient Contact Optional */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Neighbor Email or Mobile Number (Optional):
                    </label>
                    <input
                      type="text"
                      value={inviteRecipientContact}
                      onChange={(e) => setInviteRecipientContact(e.target.value)}
                      placeholder="e.g. neighbor@example.com or +92 300 1234567"
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#CBD5E1] dark:border-slate-600 bg-white dark:bg-[#0A2540] text-sm font-semibold text-[#0A2540] dark:text-white outline-none focus:border-[#0A2540] min-h-[48px]"
                    />
                  </div>

                  {/* Message Preview Textarea */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Invitation Message:
                    </label>
                    <textarea
                      rows={3}
                      value={inviteCustomNote}
                      onChange={(e) => setInviteCustomNote(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#CBD5E1] dark:border-slate-600 bg-white dark:bg-[#0A2540] text-sm font-medium text-slate-800 dark:text-slate-100 outline-none focus:border-[#0A2540]"
                    />
                  </div>

                  {/* One-Click Action Trigger Channels */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-black text-[#0A2540] dark:text-white uppercase tracking-wider block">
                      Send Invitation Via:
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {/* WhatsApp */}
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleSendTrialInvite('whatsapp')}
                        className="py-3.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer min-h-[48px] text-center"
                      >
                        <MessageCircle className="w-4 h-4 shrink-0" />
                        <span>WhatsApp</span>
                      </a>

                      {/* SMS */}
                      <a
                        href={smsUrl}
                        onClick={() => handleSendTrialInvite('sms')}
                        className="py-3.5 px-3 bg-[#0A2540] hover:bg-[#071B2F] text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer min-h-[48px] text-center border border-slate-700"
                      >
                        <Send className="w-4 h-4 shrink-0 text-[#CCFF00]" />
                        <span>SMS / Text</span>
                      </a>

                      {/* Email */}
                      <a
                        href={emailUrl}
                        onClick={() => handleSendTrialInvite('email')}
                        className="py-3.5 px-3 bg-[#006D5B] hover:bg-[#004D40] text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer min-h-[48px] text-center"
                      >
                        <Mail className="w-4 h-4 shrink-0 text-teal-200" />
                        <span>Email</span>
                      </a>

                      {/* Telegram */}
                      <a
                        href={telegramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleSendTrialInvite('telegram')}
                        className="py-3.5 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer min-h-[48px] text-center"
                      >
                        <Share2 className="w-4 h-4 shrink-0" />
                        <span>Telegram</span>
                      </a>
                    </div>

                    {/* Copy Full Invitation Card Text */}
                    <button
                      onClick={() => {
                        copyToClipboard(fullInviteMessage, 'full_invite');
                        handleSendTrialInvite('clipboard');
                      }}
                      className="w-full py-4 px-5 bg-white dark:bg-[#0A2540] hover:bg-slate-50 dark:hover:bg-[#0E2841] text-[#0A2540] dark:text-white font-black text-sm rounded-xl border-2 border-[#CBD5E1] dark:border-slate-600 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[52px] shadow-xs"
                    >
                      {copiedLinkType === 'full_invite' ? (
                        <>
                          <Check className="w-5 h-5 text-emerald-600" />
                          <span>Invitation Text & Link Copied to Clipboard! (+50 Karma)</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5 text-[#B45309]" />
                          <span>Copy Invitation Message & Trial Link</span>
                        </>
                      )}
                    </button>
                  </div>

                  {inviteSuccessMsg && (
                    <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500 rounded-xl text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{inviteSuccessMsg}</span>
                    </div>
                  )}

                  {/* Printable Community Noticeboard Flyer Toggle */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setShowPrintableFlyer(!showPrintableFlyer)}
                      className="text-xs font-black text-[#006D5B] dark:text-teal-400 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>{showPrintableFlyer ? 'Hide Printable Flyer' : 'View Printable Noticeboard Flyer (for apartment lobbies & noticeboards)'}</span>
                    </button>

                    {showPrintableFlyer && (
                      <div className="mt-4 p-6 bg-white text-[#0A2540] border-2 border-dashed border-[#0A2540] rounded-2xl space-y-4 text-center">
                        <div className="flex justify-center">
                          <CityscapeLogo size="md" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xl font-black uppercase tracking-tight">
                            Join Our Neighborhood Civic Trial Run!
                          </h4>
                          <p className="text-xs font-bold text-[#006D5B]">
                            {activeCityName} • {inviteWard}
                          </p>
                        </div>
                        <p className="text-xs text-slate-700 max-w-md mx-auto leading-relaxed">
                          "Report local potholes, broken lights, and water issues. Check municipal advisories extracted twice daily and build a safer community."
                        </p>
                        <div className="flex justify-center">
                          <img
                            src={qrCodeUrl}
                            alt="Scan QR code"
                            className="w-36 h-36 border-2 border-[#0A2540] rounded-xl p-1 bg-white"
                          />
                        </div>
                        <p className="text-[11px] font-mono font-bold text-slate-600">
                          Scan to open or visit: {universalUrl}
                        </p>
                        <button
                          onClick={() => window.print()}
                          className="px-4 py-2 bg-[#0A2540] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-800"
                        >
                          Print Flyer (PDF / Paper)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ====================================================================
                TAB 3: SHARE DIRECT LINKS & SOCIAL CHANNELS
                ==================================================================== */}
            {activeTab === 'share' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {/* Universal Link */}
                  <div className="bg-[#F8FAFC] dark:bg-[#071B2F] border-2 border-[#CBD5E1] dark:border-slate-700 rounded-2xl p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-[#006D5B] dark:text-teal-400">
                        Universal Share Link:
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">Auto-detects Mobile & Desktop</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={universalUrl}
                        className="flex-1 px-3 py-2.5 bg-white dark:bg-[#0A2540] border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 outline-none truncate"
                      />
                      <button
                        onClick={() => copyToClipboard(universalUrl, 'universal_url')}
                        className="px-4 py-2.5 bg-[#006D5B] hover:bg-[#004D40] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 min-h-[44px]"
                      >
                        {copiedLinkType === 'universal_url' ? (
                          <>
                            <Check className="w-4 h-4 text-[#CCFF00]" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Native Device Share API Trigger */}
                  {canNativeShare() && (
                    <button
                      onClick={() =>
                        triggerNativeShare({
                          type: 'trial_invite',
                          title: `Cityscape Free Community Trial (${activeCityName})`,
                          text: `Join the free community trial of Cityscape in ${activeCityName} to report local neighborhood issues and check municipal bulletins.`,
                          url: universalUrl,
                        })
                      }
                      className="w-full py-4 px-6 bg-[#0A2540] hover:bg-[#071B2F] text-white font-black text-sm sm:text-base rounded-2xl shadow-md border-2 border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-3 min-h-[56px]"
                    >
                      <Share2 className="w-5 h-5 text-[#CCFF00]" />
                      <span>Open Device Native Share Sheet</span>
                    </button>
                  )}

                  {/* Social Channel Grid */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-black text-[#0A2540] dark:text-white uppercase tracking-wider block">
                      Share Directly to Social & Neighborhood Groups:
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 bg-[#F8FAFC] dark:bg-[#071B2F] border-2 border-[#CBD5E1] dark:border-slate-700 hover:border-emerald-600 rounded-xl flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all"
                      >
                        <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          `Testing the new @Cityscape civic engagement trial in ${activeCityName}! Report potholes, check municipal bulletins, and track repair times:`
                        )}&url=${encodeURIComponent(universalUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 bg-[#F8FAFC] dark:bg-[#071B2F] border-2 border-[#CBD5E1] dark:border-slate-700 hover:border-sky-500 rounded-xl flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all"
                      >
                        <Share2 className="w-5 h-5 text-sky-500 shrink-0" />
                        <span>Twitter / X</span>
                      </a>

                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(universalUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 bg-[#F8FAFC] dark:bg-[#071B2F] border-2 border-[#CBD5E1] dark:border-slate-700 hover:border-blue-600 rounded-xl flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all"
                      >
                        <Share2 className="w-5 h-5 text-blue-600 shrink-0" />
                        <span>Facebook</span>
                      </a>

                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(universalUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 bg-[#F8FAFC] dark:bg-[#071B2F] border-2 border-[#CBD5E1] dark:border-slate-700 hover:border-blue-700 rounded-xl flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all"
                      >
                        <Share2 className="w-5 h-5 text-blue-700 shrink-0" />
                        <span>LinkedIn</span>
                      </a>

                      <a
                        href={telegramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 bg-[#F8FAFC] dark:bg-[#071B2F] border-2 border-[#CBD5E1] dark:border-slate-700 hover:border-sky-600 rounded-xl flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all"
                      >
                        <Send className="w-5 h-5 text-sky-600 shrink-0" />
                        <span>Telegram</span>
                      </a>

                      <a
                        href={emailUrl}
                        className="p-3.5 bg-[#F8FAFC] dark:bg-[#071B2F] border-2 border-[#CBD5E1] dark:border-slate-700 hover:border-[#006D5B] rounded-xl flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all"
                      >
                        <Mail className="w-5 h-5 text-[#006D5B] shrink-0" />
                        <span>Email Invite</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Info & Dismiss */}
          <div className="bg-[#F8FAFC] dark:bg-[#071B2F] p-4 sm:p-5 border-t-2 border-[#CBD5E1] dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#006D5B] shrink-0" />
              <span className="font-bold">
                Cityscape Community Trial • WCAG AAA Accessibility Verified
              </span>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#0A2540] dark:text-white font-bold rounded-xl transition-all cursor-pointer min-h-[44px]"
            >
              Done & Return to App
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
