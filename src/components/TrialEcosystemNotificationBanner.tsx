import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Radio,
  Volume2,
  VolumeX,
  Bell,
  AlertOctagon,
  Info,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Play,
  Square,
  Flame,
  ShieldCheck,
  Building2,
  MapPin,
  Megaphone,
  Share2,
  Layers,
  Send,
  X,
  Clock,
  HelpCircle,
  Award,
  ExternalLink,
  Smartphone,
  Download,
  Users,
  Gift,
} from 'lucide-react';
import { civicAudio } from '../lib/chimeAudio';

interface TrialEcosystemNotificationBannerProps {
  onNavigateToView?: (view: string) => void;
  activeCityName?: string;
  onOpenReportModal?: () => void;
  onOpenDownloadShareModal?: (tab?: 'download' | 'invite' | 'share') => void;
  className?: string;
}

export const TrialEcosystemNotificationBanner: React.FC<TrialEcosystemNotificationBannerProps> = ({
  onNavigateToView,
  activeCityName = 'Rawalpindi',
  onOpenReportModal,
  onOpenDownloadShareModal,
  className = '',
}) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return localStorage.getItem('cityscape_trial_banner_collapsed') === 'true';
  });
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioPlaybackStep, setAudioPlaybackStep] = useState<string>('');
  const [isAdvisoryModalOpen, setIsAdvisoryModalOpen] = useState<boolean>(false);
  const [isEcosystemTourOpen, setIsEcosystemTourOpen] = useState<boolean>(false);
  const [selectedTourPillar, setSelectedTourPillar] = useState<number>(0);

  // Go-Live alert subscription
  const [subscriberContact, setSubscriberContact] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    return localStorage.getItem('cityscape_golive_subscribed') === 'true';
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState<boolean>(false);
  const [subscriptionFeedback, setSubscriptionFeedback] = useState<string>('');

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleCollapse = () => {
    const newState = !isDismissed;
    setIsDismissed(newState);
    localStorage.setItem('cityscape_trial_banner_collapsed', newState.toString());
  };

  // Play audio broadcast: Chime + Comprehensive Trial Advisory + Live Bulletins
  const handlePlayTrialAndBulletinAudio = async () => {
    if (isPlayingAudio) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      setAudioPlaybackStep('');
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech audio is not supported in this browser window.');
      return;
    }

    setIsPlayingAudio(true);
    setAudioPlaybackStep('Broadcasting Civic Alert Chime...');

    // 1. Play melodic 3-tone chime
    await civicAudio.playCivicChime();

    // 2. Fetch live bulletin headlines for the active city to play in tandem
    let bulletinSummary = '';
    try {
      setAudioPlaybackStep(`Loading official ${activeCityName} bulletins...`);
      const res = await fetch(`/api/bulletins/live?city=${encodeURIComponent(activeCityName)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.bulletins) && data.bulletins.length > 0) {
          const topBulletins = data.bulletins.slice(0, 3);
          bulletinSummary = ` Now playing the active municipal bulletins for ${activeCityName}: ` +
            topBulletins
              .map((b: any, i: number) => `Notice ${i + 1}: ${b.title}. Issued by ${b.department}. ${b.description}`)
              .join(' ');
        }
      }
    } catch {
      // Continue with standard bulletin advisory if fetch fails
      bulletinSummary = ` Active municipal bulletins are updated twice daily for roadworks, water utility maintenance, and civic announcements.`;
    }

    // 3. Compose full spoken transcript
    const spokenTranscript =
      `Official Civic Announcement for Cityscape Free Community Trial Run. ` +
      `Good day, neighbors and residents of ${activeCityName}. ` +
      `You are currently participating in the interactive Cityscape Free Trial Run. ` +
      `Please be advised: All neighborhood requests, issue reports, upvotes, and comments logged in this preview sandbox are for community testing and familiarization only. ` +
      `Municipal public works crews and emergency responders are not dispatched for test reports during this trial period. ` +
      `For real life-threatening emergencies, always dial 9-1-1 or your local emergency line immediately. ` +
      `All registered neighbors will be notified with an official broadcast the moment Cityscape officially goes live with live municipal integration in your ward. ` +
      bulletinSummary +
      ` Thank you for exploring the Cityscape community platform.`;

    setAudioPlaybackStep('Narrating Trial Advisory & Bulletin...');

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenTranscript);
    utterance.rate = 0.88; // Slower cadence for senior accessibility and clear comprehension
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setAudioPlaybackStep('');
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setAudioPlaybackStep('');
    };

    window.speechSynthesis.speak(utterance);
  };

  // Submit contact for Go-Live Alert
  const handleSubscribeToGoLive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberContact.trim()) return;

    setIsSubmittingContact(true);
    try {
      const res = await fetch('/api/notifications/trial-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: subscriberContact.trim(),
          cityName: activeCityName,
          subscribedAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setIsSubscribed(true);
        localStorage.setItem('cityscape_golive_subscribed', 'true');
        localStorage.setItem('cityscape_golive_contact', subscriberContact.trim());
        setSubscriptionFeedback(
          `✓ Success! We have registered ${subscriberContact.trim()} for the official Go-Live broadcast in ${activeCityName}.`
        );
      } else {
        // Fallback local persistence
        setIsSubscribed(true);
        localStorage.setItem('cityscape_golive_subscribed', 'true');
        setSubscriptionFeedback(`✓ Registered! You will receive an alert as soon as ${activeCityName} goes live.`);
      }
    } catch {
      setIsSubscribed(true);
      localStorage.setItem('cityscape_golive_subscribed', 'true');
      setSubscriptionFeedback(`✓ Registered! You will receive an alert as soon as ${activeCityName} goes live.`);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const ECOSYSTEM_PILLARS = [
    {
      id: 'reports',
      icon: MapPin,
      badge: 'Pillar 1',
      title: 'Neighborhood Reports & AI Forensics',
      color: 'bg-red-600 text-white',
      accentBg: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900',
      description:
        'Log public infrastructure issues (potholes, streetlights, drainage) with instant GPS geotagging, photo upload, and automated AI synthetic image forensics to prevent fake reports.',
      actionText: 'Try Logging a Sample Request',
      actionView: 'map',
      onAction: () => {
        setIsEcosystemTourOpen(false);
        if (onOpenReportModal) onOpenReportModal();
      },
    },
    {
      id: 'karma',
      icon: Flame,
      badge: 'Pillar 2',
      title: 'Citizen Passport & Civic Karma',
      color: 'bg-amber-600 text-white',
      accentBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
      description:
        'Earn Civic Karma points (+25 per fix confirmed, +50 for adopting a micro-zone). Build reputation as a trusted neighborhood steward and unlock municipal badges.',
      actionText: 'Open Citizen Passport',
      actionView: 'profile',
      onAction: () => {
        setIsEcosystemTourOpen(false);
        if (onNavigateToView) onNavigateToView('profile');
      },
    },
    {
      id: 'govdesk',
      icon: ShieldCheck,
      badge: 'Pillar 3',
      title: 'Municipal Gov Desk & 48hr SLA',
      color: 'bg-blue-600 text-white',
      accentBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900',
      description:
        'Municipal staff manage incoming requests via an interactive Kanban board with 48-hour SLA resolution countdowns, crew assignments, and official before-and-after photo verification.',
      actionText: 'Inspect Gov Desk Portal',
      actionView: 'admin',
      onAction: () => {
        setIsEcosystemTourOpen(false);
        if (onNavigateToView) onNavigateToView('admin');
      },
    },
    {
      id: 'bulletins',
      icon: Megaphone,
      badge: 'Pillar 4',
      title: 'Twice-Daily Ground Bulletins',
      color: 'bg-teal-600 text-white',
      accentBg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-900',
      description:
        'Automated municipal news engine searches city records twice daily to extract water supply advisories, scheduled roadworks, power upgrades, and city council hearings.',
      actionText: 'Read City Bulletins',
      actionView: 'bulletin',
      onAction: () => {
        setIsEcosystemTourOpen(false);
        if (onNavigateToView) onNavigateToView('bulletin');
      },
    },
    {
      id: 'estate',
      icon: Building2,
      badge: 'Pillar 5',
      title: 'HOA & Private Gated Community Portal',
      color: 'bg-emerald-600 text-white',
      accentBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
      description:
        'Tailored private portals for gated residential estates: generate guest barrier QR passes, review quiet hours bylaws, track maintenance dues, and emergency gate hotlines.',
      actionText: 'Explore HOA Portal',
      actionView: 'estate',
      onAction: () => {
        setIsEcosystemTourOpen(false);
        if (onNavigateToView) onNavigateToView('estate');
      },
    },
  ];

  return (
    <aside
      aria-label="Civic Trial Run and Ecosystem Advisory Notice"
      className={`w-full transition-all duration-300 ${className}`}
    >
      {/* 
        ========================================================================
        RED THEMED CIVIC TRIAL NOTIFICATION CONTAINER (WCAG AAA High Contrast)
        Bold Alert Crimson (#DC2626 -> #991B1B) • Pure White Text (#FFFFFF)
        ========================================================================
      */}
      <div
        id="trial-ecosystem-red-banner"
        className="relative overflow-hidden rounded-2xl border-2 border-red-500/90 dark:border-red-600 bg-gradient-to-r from-[#991B1B] via-[#B91C1C] to-[#7F1D1D] text-white shadow-xl"
      >
        {/* Subtle Decorative Background Alert Rings */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-red-400/20 blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-16 w-64 h-32 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        {/* Collapsed State (Slim High-Impact Red Ticker Bar) */}
        {isDismissed ? (
          <div className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3 gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="flex h-3 w-3 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-300" />
              </span>

              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/20 text-white text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0">
                <Radio className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                <span>Trial Run Active</span>
              </div>

              <p className="text-xs sm:text-sm font-bold text-white truncate">
                Preview Sandbox Mode: Reports are for ecosystem demonstration until live launch in {activeCityName}.
              </p>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Audio Play Button */}
              <button
                onClick={handlePlayTrialAndBulletinAudio}
                title={isPlayingAudio ? 'Stop audio notification' : 'Play spoken trial alert along with bulletin'}
                aria-label={isPlayingAudio ? 'Stop audio announcement' : 'Play trial run audio alert with bulletin'}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[38px] ${
                  isPlayingAudio
                    ? 'bg-yellow-400 text-red-950 shadow-md font-black animate-pulse'
                    : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-yellow-300" />
                    <span className="hidden xs:inline">Play Audio + Bulletin</span>
                    <span className="xs:hidden">Play</span>
                  </>
                )}
              </button>

              {/* View Advisory Modal */}
              <button
                onClick={() => setIsAdvisoryModalOpen(true)}
                className="px-3 py-1.5 bg-white text-red-900 hover:bg-red-50 font-black rounded-xl text-xs min-h-[38px] shadow-sm transition-all cursor-pointer"
              >
                View Notice
              </button>

              {/* Expand Toggle */}
              <button
                onClick={handleToggleCollapse}
                title="Expand notification details"
                aria-label="Expand notification details"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer transition-all"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Expanded Full Comprehensive Alert Panel */
          <div className="p-4 sm:p-5 md:p-6 space-y-4">
            {/* Top Bar: Live Beacons, Badges & Dismiss Control */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-red-400/40">
              <div className="flex items-center flex-wrap gap-2">
                {/* Red Pulse Beacon */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-950/80 text-white border border-red-400 text-xs font-black uppercase tracking-wider shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" />
                  <Radio className="w-4 h-4 text-yellow-300" />
                  <span>Free Community Trial Run</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-yellow-400 text-red-950 text-xs font-black uppercase tracking-wider shadow-xs">
                  <AlertOctagon className="w-3.5 h-3.5 text-red-900" />
                  <span>Preview & Sandbox Mode</span>
                </div>

                <span className="text-xs font-bold text-red-100/90 hidden md:inline">
                  Jurisdiction: <strong className="text-white underline">{activeCityName}</strong>
                </span>
              </div>

              {/* Top Controls: Minimize Button */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={handleToggleCollapse}
                  title="Minimize notification banner"
                  aria-label="Minimize notification banner"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all cursor-pointer min-h-[36px]"
                >
                  <span>Minimize Banner</span>
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Headline & Human-First Advisory Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              <div className="lg:col-span-8 space-y-2.5 text-left">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight tracking-tight flex items-center gap-2 flex-wrap">
                  <span>Welcome to the Cityscape Community Trial</span>
                  <span className="text-sm font-bold bg-white/20 text-yellow-200 px-2.5 py-0.5 rounded-lg border border-white/20">
                    Demonstration Phase
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-red-50 font-medium leading-relaxed">
                  We invite all neighbors to test and explore the features of this civic engagement platform.
                  <strong className="text-white font-extrabold bg-red-950/60 px-1.5 py-0.5 rounded ml-1">
                    Important Notice: Requests created during this free trial are demonstration records for community familiarization only and are NOT dispatched to municipal public works crews.
                  </strong>
                </p>

                {/* Clear Safety Guidelines Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-400/40 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-yellow-300 font-extrabold uppercase tracking-wide">
                      <AlertOctagon className="w-4 h-4 shrink-0" />
                      <span>Not Live Municipal Dispatch Yet</span>
                    </div>
                    <p className="text-red-100 font-medium leading-snug">
                      Test reports help tune AI forensics and response workflows. Live city dispatch will activate when municipal integration launches.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-400/40 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-yellow-300 font-extrabold uppercase tracking-wide">
                      <Bell className="w-4 h-4 shrink-0" />
                      <span>Official Go-Live Broadcast Alert</span>
                    </div>
                    <p className="text-red-100 font-medium leading-snug">
                      All registered residents will be alerted automatically the moment Cityscape officially goes live in {activeCityName}.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Action Panel: Audio Narration & Interactive Tour Triggers */}
              <div className="lg:col-span-4 flex flex-col gap-2.5 p-3.5 sm:p-4 rounded-xl bg-red-950/80 border border-red-400/50 shadow-inner">
                <span className="text-xs font-black uppercase tracking-wider text-yellow-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Interactive Trial Station
                </span>

                {/* Primary Spoken Audio Button (Plays Trial Advisory + Bulletins) */}
                <button
                  id="btn-play-trial-bulletin-audio"
                  onClick={handlePlayTrialAndBulletinAudio}
                  className={`w-full p-3 rounded-xl font-extrabold text-xs sm:text-sm min-h-[50px] transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-md ${
                    isPlayingAudio
                      ? 'bg-yellow-400 hover:bg-yellow-300 text-red-950 font-black animate-pulse border-2 border-yellow-200'
                      : 'bg-white hover:bg-red-50 text-red-950 border-2 border-white'
                  }`}
                  title="Play spoken audio narration of this trial notice combined with current city bulletins"
                  aria-label="Play spoken audio notification along with live city bulletins"
                >
                  {isPlayingAudio ? (
                    <>
                      <Square className="w-4 h-4 fill-current text-red-950 shrink-0" />
                      <div className="text-left">
                        <span className="block font-black text-xs">Stop Spoken Audio</span>
                        <span className="text-[10px] font-semibold opacity-90 truncate max-w-[170px] block">
                          {audioPlaybackStep || 'Narrating advisory...'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5 text-red-700 shrink-0" />
                      <div className="text-left">
                        <span className="block font-black text-xs sm:text-sm leading-tight">
                          Play Spoken Notification & Bulletin
                        </span>
                        <span className="text-[10px] text-red-800 font-semibold block">
                          3-Tone Harmonic Chime + Live Ground News
                        </span>
                      </div>
                    </>
                  )}
                </button>

                {/* Equalizer Wave Animation when audio is active */}
                {isPlayingAudio && (
                  <div className="flex items-center justify-center gap-1 py-1 px-3 bg-red-900/80 rounded-lg">
                    <span className="text-[10px] font-bold text-yellow-300 uppercase tracking-wider mr-2">
                      Broadcasting Audio:
                    </span>
                    <span className="h-3.5 w-1 bg-yellow-300 rounded-full animate-bounce" />
                    <span className="h-5 w-1 bg-yellow-300 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="h-2.5 w-1 bg-yellow-300 rounded-full animate-bounce [animation-delay:0.3s]" />
                    <span className="h-4.5 w-1 bg-yellow-300 rounded-full animate-bounce [animation-delay:0.45s]" />
                    <span className="h-3 w-1 bg-yellow-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                )}

                {/* Secondary Action Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (onOpenDownloadShareModal) {
                        onOpenDownloadShareModal('download');
                      } else {
                        window.dispatchEvent(new CustomEvent('cityscape:open-download-modal', { detail: { tab: 'download' } }));
                      }
                    }}
                    className="px-3 py-2 bg-red-900 hover:bg-red-800 text-white font-bold rounded-xl text-xs border border-red-400/60 min-h-[42px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Download Cityscape on mobile or desktop"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Download App</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenDownloadShareModal) {
                        onOpenDownloadShareModal('invite');
                      } else {
                        window.dispatchEvent(new CustomEvent('cityscape:open-download-modal', { detail: { tab: 'invite' } }));
                      }
                    }}
                    className="px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl text-xs border border-amber-300 min-h-[42px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    title="Invite neighbors to the free trial run and earn +50 Civic Karma points"
                  >
                    <Users className="w-3.5 h-3.5 text-yellow-200" />
                    <span>Invite Neighbors</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsEcosystemTourOpen(true)}
                    className="px-2.5 py-1.5 bg-red-900/60 hover:bg-red-800 text-white font-semibold rounded-lg text-[11px] border border-red-400/40 min-h-[34px] transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Layers className="w-3 h-3 text-yellow-300" />
                    <span>Ecosystem Tour</span>
                  </button>

                  <button
                    onClick={() => setIsAdvisoryModalOpen(true)}
                    className="px-2.5 py-1.5 bg-red-900/60 hover:bg-red-800 text-white font-semibold rounded-lg text-[11px] border border-red-400/40 min-h-[34px] transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Info className="w-3 h-3 text-yellow-300" />
                    <span>Read Advisory</span>
                  </button>
                </div>

                {/* Go-Live Subscription Quick Trigger */}
                <div className="pt-2 border-t border-red-800/80">
                  {isSubscribed ? (
                    <div className="flex items-center gap-1.5 text-xs text-yellow-200 font-bold bg-red-900/60 p-2 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">Enrolled for Official Go-Live Alert</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAdvisoryModalOpen(true)}
                      className="w-full text-center text-xs font-bold text-yellow-200 hover:text-white underline transition-colors cursor-pointer"
                    >
                      🔔 Get notified when Cityscape goes live →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 
        ========================================================================
        MODAL 1: COMPREHENSIVE TRIAL ADVISORY & GO-LIVE ALERT SIGNUP
        ========================================================================
      */}
      <AnimatePresence>
        {isAdvisoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl bg-white dark:bg-[#0A2540] text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl border-2 border-red-500 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Red Header */}
              <div className="p-4 sm:p-6 bg-gradient-to-r from-[#991B1B] to-[#7F1D1D] text-white flex items-start justify-between gap-4">
                <div className="space-y-1 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-yellow-400 text-red-950 text-xs font-black uppercase tracking-wider">
                    <AlertOctagon className="w-3.5 h-3.5 text-red-950" />
                    <span>Official Preview & Sandbox Advisory</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Cityscape Free Trial Run Notice
                  </h3>
                  <p className="text-xs sm:text-sm text-red-100 font-medium">
                    Guidance for community members exploring the platform in {activeCityName}
                  </p>
                </div>

                <button
                  onClick={() => setIsAdvisoryModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer transition-all"
                  aria-label="Close Advisory Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-7 space-y-6 overflow-y-auto text-left text-sm sm:text-base leading-relaxed">
                {/* Essential Clarification Card */}
                <div className="p-4 sm:p-5 rounded-xl bg-red-50 dark:bg-red-950/30 border-2 border-red-300 dark:border-red-800 space-y-3">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-black text-base">
                    <AlertOctagon className="w-5 h-5 shrink-0" />
                    <h4>Do Not Consider Trial Submissions as Real Municipal Dispatches</h4>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">
                    Please be advised that all reports, hazard pins, comments, upvotes, and mock resolution confirmations submitted in this app version are part of a <strong>Free Community Trial & Ecosystem Familiarization Run</strong>.
                  </p>
                  <ul className="list-disc pl-5 text-xs sm:text-sm space-y-1.5 text-slate-700 dark:text-slate-300 font-medium">
                    <li>
                      <strong>No Crew Dispatch:</strong> Municipal public works and emergency response crews are not dispatched for entries submitted during the trial period.
                    </li>
                    <li>
                      <strong>Emergency Protocol:</strong> In case of an urgent, life-threatening emergency (gas leaks, live power cables, severe structural collapses), please immediately contact <strong>911 or your local emergency dispatch center</strong>.
                    </li>
                    <li>
                      <strong>Safe Testing Ground:</strong> You are warmly encouraged to test photo reporting, verify AI forensic scans, adopt mock micro-zones, and review twice-daily bulletins safely.
                    </li>
                  </ul>
                </div>

                {/* Go-Live Notification Enrollment Section */}
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#071B2F] border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[#0A2540] dark:text-white font-black text-base">
                      <Bell className="w-5 h-5 text-[#B45309]" />
                      <h4>Get Notified When Cityscape Officially Goes Live</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                      Register your email or phone number below. We will send you an official notification broadcast the moment municipal crew dispatch and public administration go live in your ward.
                    </p>
                  </div>

                  {subscriptionFeedback ? (
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{subscriptionFeedback}</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribeToGoLive} className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="text"
                        required
                        placeholder="Enter email address or mobile number..."
                        value={subscriberContact}
                        onChange={(e) => setSubscriberContact(e.target.value)}
                        className="flex-1 px-4 py-3 bg-white dark:bg-[#0A2540] border-1.5 border-[#CBD5E1] dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-[#0A2540] min-h-[48px] placeholder:text-slate-400"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingContact}
                        className="px-5 py-3 bg-[#B45309] hover:bg-[#92400E] text-white font-bold rounded-xl text-sm min-h-[48px] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs shrink-0 disabled:opacity-60"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isSubmittingContact ? 'Registering...' : 'Notify Me at Launch'}</span>
                      </button>
                    </form>
                  )}
                </div>

                {/* Audio Broadcast Explanation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-xs text-amber-900 dark:text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-amber-700" />
                      Audio Broadcast Playback
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                      You can play this trial notification aloud with a civic chime and the latest {activeCityName} bulletins anytime.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsAdvisoryModalOpen(false);
                      handlePlayTrialAndBulletinAudio();
                    }}
                    className="px-4 py-2 bg-[#0A2540] hover:bg-[#0E3357] text-white font-bold rounded-xl text-xs sm:text-sm min-h-[44px] shrink-0 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Volume2 className="w-4 h-4 text-yellow-300" />
                    <span>Play Audio Broadcast</span>
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 bg-slate-100 dark:bg-[#071B2F] border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
                  Cityscape Civic Transparency Protocol
                </span>
                <button
                  onClick={() => setIsAdvisoryModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs sm:text-sm min-h-[44px] ml-auto transition-all cursor-pointer"
                >
                  I Understand & Acknowledge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 
        ========================================================================
        MODAL 2: INTERACTIVE ECOSYSTEM TOUR & CAPABILITIES WALKTHROUGH
        ========================================================================
      */}
      <AnimatePresence>
        {isEcosystemTourOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl bg-white dark:bg-[#0A2540] text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl border-2 border-[#CBD5E1] dark:border-slate-700 overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Tour Header */}
              <div className="p-4 sm:p-6 bg-[#0A2540] text-white flex items-start justify-between gap-4 border-b border-slate-700">
                <div className="space-y-1 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#006D5B] text-white text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Free Trial Ecosystem Guide</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Explore the 5 Pillars of Cityscape
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    Learn how residents, ward stewards, and municipal teams collaborate on our platform.
                  </p>
                </div>

                <button
                  onClick={() => setIsEcosystemTourOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer transition-all"
                  aria-label="Close Ecosystem Tour"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tour Pillar Selector Tabs */}
              <div className="p-3 bg-slate-50 dark:bg-[#071B2F] border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {ECOSYSTEM_PILLARS.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  const isSelected = selectedTourPillar === idx;
                  return (
                    <button
                      key={pillar.id}
                      onClick={() => setSelectedTourPillar(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer min-h-[44px] flex items-center gap-2 border-1.5 ${
                        isSelected
                          ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-sm font-extrabold'
                          : 'bg-white dark:bg-[#0A2540] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-yellow-300' : 'text-[#006D5B]'}`} />
                      <span>{pillar.badge}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Pillar Content View */}
              {(() => {
                const current = ECOSYSTEM_PILLARS[selectedTourPillar];
                const Icon = current.icon;
                return (
                  <div className="p-5 sm:p-7 space-y-6 overflow-y-auto text-left">
                    <div className={`p-5 rounded-2xl border-2 ${current.accentBg} space-y-3`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${current.color} shadow-sm shrink-0`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {current.badge}
                          </span>
                          <h4 className="text-lg sm:text-xl font-black text-[#0A2540] dark:text-white">
                            {current.title}
                          </h4>
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                        {current.description}
                      </p>
                    </div>

                    {/* How It Works in Practice */}
                    <div className="space-y-3">
                      <h5 className="font-extrabold text-sm uppercase tracking-wide text-slate-600 dark:text-slate-300">
                        How to Experience This During the Free Trial:
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-medium">
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071B2F] border border-slate-200 dark:border-slate-700">
                          <strong className="block text-[#0A2540] dark:text-white font-bold mb-1">
                            Step 1: Test & Explore
                          </strong>
                          <span>
                            Navigate to this module and create sample reports or review real municipal extractions.
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071B2F] border border-slate-200 dark:border-slate-700">
                          <strong className="block text-[#0A2540] dark:text-white font-bold mb-1">
                            Step 2: Voice & Audio Sync
                          </strong>
                          <span>
                            Use the integrated audio narrator to hear bulletins and updates read aloud with accessibility rates.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Action Button for This Pillar */}
                    <div className="pt-2">
                      <button
                        onClick={current.onAction}
                        className="w-full py-3.5 px-5 bg-[#006D5B] hover:bg-[#004D40] text-white font-black rounded-xl text-sm min-h-[50px] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                      >
                        <span>{current.actionText}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Tour Navigation Footer */}
              <div className="p-4 sm:p-5 bg-slate-100 dark:bg-[#071B2F] border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                <button
                  disabled={selectedTourPillar === 0}
                  onClick={() => setSelectedTourPillar((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 bg-white dark:bg-[#0A2540] text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs sm:text-sm min-h-[44px] border border-slate-300 dark:border-slate-600 disabled:opacity-40 cursor-pointer"
                >
                  ← Previous Pillar
                </button>

                <span className="text-xs font-bold text-slate-500">
                  {selectedTourPillar + 1} of {ECOSYSTEM_PILLARS.length}
                </span>

                <button
                  disabled={selectedTourPillar === ECOSYSTEM_PILLARS.length - 1}
                  onClick={() => setSelectedTourPillar((prev) => Math.min(ECOSYSTEM_PILLARS.length - 1, prev + 1))}
                  className="px-4 py-2 bg-[#0A2540] hover:bg-[#0E3357] text-white font-bold rounded-xl text-xs sm:text-sm min-h-[44px] disabled:opacity-40 cursor-pointer"
                >
                  Next Pillar →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </aside>
  );
};
