import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Map as MapIcon,
  List,
  Plus,
  Bell,
  Grid,
  X,
  Building2,
  Clock,
  Sparkles,
  BookOpen,
  Megaphone,
  BarChart3,
  User,
  ShieldCheck,
  Siren,
  ChevronUp,
  Palette,
  CheckCircle,
  Smartphone,
  Download,
  Users,
  Share2,
  Gift,
  Landmark,
  Lock,
} from 'lucide-react';
import { AppViewMode, ReportFilter } from '../types';

interface MobileNavigationProps {
  activeView: AppViewMode;
  setActiveView: (view: AppViewMode) => void;
  onOpenReportModal: () => void;
  onOpenDownloadShareModal?: (tab?: 'download' | 'invite' | 'share') => void;
  totalReportsCount: number;
  userKarma: number;
  isAdminMode: boolean;
  filter: ReportFilter;
  setFilter: React.Dispatch<React.SetStateAction<ReportFilter>>;
  isOwnerUnlocked?: boolean;
  onRequestOwnerAccess?: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeView,
  setActiveView,
  onOpenReportModal,
  onOpenDownloadShareModal,
  totalReportsCount,
  userKarma,
  isAdminMode,
  filter,
  setFilter,
  isOwnerUnlocked = false,
  onRequestOwnerAccess,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const secondaryModules = [
    {
      category: 'Civic Core & Real-Time',
      items: [
        { id: 'map' as AppViewMode, label: 'Interactive Community Map', icon: MapIcon, badge: `${totalReportsCount} Active` },
        { id: 'estate' as AppViewMode, label: 'HOA & Gated Estate Portal', icon: Building2, badge: 'PRIVATE' },
        { id: 'hoa_liaison' as AppViewMode, label: 'HOA ⇄ Gov Liaison Hub', icon: Building2, badge: 'BRIDGE' },
        { id: 'bulletin' as AppViewMode, label: 'Public Notices & Alerts', icon: Bell },
        { id: 'sla' as AppViewMode, label: 'Resolution Timeline Tracker', icon: Clock },
      ],
    },
    {
      category: 'Community & Engagement',
      items: [
        { id: 'attractions' as AppViewMode, label: 'City Attractions & Heritage', icon: Landmark, badge: 'TOUR' },
        { id: 'events' as AppViewMode, label: 'Events & Local Hire', icon: Megaphone, badge: 'HIRE' },
        { id: 'gratitude' as AppViewMode, label: 'Civic Wall of Fame', icon: Sparkles },
        { id: 'blog' as AppViewMode, label: 'Civic Journal & Stories', icon: BookOpen },
        { id: 'profile' as AppViewMode, label: 'Citizen Impact Profile', icon: User, badge: `${userKarma} Karma` },
      ],
    },
    {
      category: 'Administration & Strategy',
      items: [
        { id: 'owner_oversight' as AppViewMode, label: 'Owner Oversight & 80+ Cities', icon: Landmark, badge: isOwnerUnlocked ? 'MRR' : 'LOCK' },
        { id: 'admin' as AppViewMode, label: 'Municipal Desk Portal', icon: ShieldCheck, badge: isAdminMode ? 'STAFF' : 'PASS' },
        { id: 'analytics' as AppViewMode, label: 'City Stats & Data', icon: BarChart3 },
        { id: 'strategic' as AppViewMode, label: 'Strategic AI Roadmap', icon: Sparkles, badge: 'AI' },
        { id: 'brand' as AppViewMode, label: 'Brand & Accessibility Tokens', icon: Palette },
      ],
    },
  ];

  const handleSelectView = (view: AppViewMode) => {
    if (view === 'owner_oversight' && !isOwnerUnlocked) {
      onRequestOwnerAccess?.();
      setIsDrawerOpen(false);
      return;
    }
    setActiveView(view);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Mobile Fixed Bottom Glass Navigation Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden px-3 pb-3 pt-1 bg-gradient-to-t from-[#0A2540]/90 via-[#0A2540]/40 to-transparent pointer-events-none">
        <nav
          aria-label="Mobile Navigation Dock"
          className="pointer-events-auto max-w-md mx-auto bg-[#0A2540] border-2 border-[#CBD5E1]/30 rounded-2xl p-1.5 shadow-2xl flex items-center justify-between gap-1 text-white"
        >
          {/* Quick Tab 1: Map */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => handleSelectView('map')}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer min-h-[56px] relative ${
              activeView === 'map'
                ? 'text-white font-black'
                : 'text-slate-300 hover:text-white font-semibold'
            }`}
          >
            {activeView === 'map' && (
              <motion.div
                layoutId="mobileActiveDockPill"
                className="absolute inset-0 bg-[#006D5B] rounded-xl border border-teal-300/40 shadow-sm"
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center">
              <MapIcon className="w-5 h-5 mb-0.5" />
              <span className="text-xs uppercase tracking-wider font-extrabold">Map</span>
            </div>
          </motion.button>

          {/* Quick Tab 2: HOA Estate */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => handleSelectView('estate')}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer min-h-[56px] relative ${
              activeView === 'estate'
                ? 'text-white font-black'
                : 'text-slate-300 hover:text-white font-semibold'
            }`}
          >
            {activeView === 'estate' && (
              <motion.div
                layoutId="mobileActiveDockPill"
                className="absolute inset-0 bg-[#006D5B] rounded-xl border border-teal-300/40 shadow-sm"
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center">
              <Building2 className="w-5 h-5 mb-0.5" />
              <span className="text-xs uppercase tracking-wider font-extrabold">HOA</span>
            </div>
          </motion.button>

          {/* Center Elevated CTA Button: Report */}
          <div className="relative px-1 -top-3.5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={onOpenReportModal}
              className="w-14 h-14 rounded-2xl bg-[#B45309] hover:bg-[#92400E] text-white shadow-2xl flex flex-col items-center justify-center border-2 border-amber-200 ring-4 ring-[#0A2540] cursor-pointer min-h-[56px] min-w-[56px]"
              aria-label="Report Neighborhood Request"
            >
              <Plus className="w-7 h-7 stroke-[3]" />
            </motion.button>
          </div>

          {/* Quick Tab 3: Bulletin */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => handleSelectView('bulletin')}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer shrink-0 min-h-[56px] relative ${
              activeView === 'bulletin'
                ? 'text-white font-black'
                : 'text-slate-300 hover:text-white font-semibold'
            }`}
          >
            {activeView === 'bulletin' && (
              <motion.div
                layoutId="mobileActiveDockPill"
                className="absolute inset-0 bg-[#006D5B] rounded-xl border border-teal-300/40 shadow-sm"
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center">
              <Bell className="w-5 h-5 mb-0.5" />
              <span className="text-xs uppercase tracking-wider font-extrabold">Bulletin</span>
            </div>
          </motion.button>

          {/* Quick Tab 4: All Modules Menu Trigger */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsDrawerOpen(true)}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer shrink-0 min-h-[56px] relative ${
              isDrawerOpen
                ? 'text-white font-black'
                : 'text-slate-300 hover:text-white font-semibold'
            }`}
            aria-label="Open All Modules Menu"
          >
            <div className="relative z-10 flex flex-col items-center">
              <Grid className="w-5 h-5 mb-0.5" />
              <span className="text-xs uppercase tracking-wider font-extrabold">Menu</span>
            </div>
          </motion.button>
        </nav>
      </div>

      {/* Mobile Animated Bottom Drawer Sheet */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-[#0A2540]/80 backdrop-blur-sm"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0A2540] rounded-t-3xl border-t-2 border-[#006D5B] shadow-2xl overflow-hidden max-h-[88vh] flex flex-col z-10"
            >
              {/* Swipe Handle & Header */}
              <div className="p-4 bg-slate-50 dark:bg-[#071B2F] border-b border-[#CBD5E1] dark:border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0A2540] dark:bg-[#006D5B] text-white flex items-center justify-center font-black">
                    <Grid className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#0A2540] dark:text-white tracking-tight">
                      Neighborhood Hub & Modules
                    </h2>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Explore all community tools and services
                    </p>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 min-h-[56px] min-w-[56px] flex items-center justify-center cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Scrollable Modules List */}
              <div className="p-4 space-y-6 overflow-y-auto flex-1">
                {/* App Download & Neighbor Invite Banner */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setIsDrawerOpen(false);
                    if (onOpenDownloadShareModal) {
                      onOpenDownloadShareModal('download');
                    } else {
                      window.dispatchEvent(new CustomEvent('cityscape:open-download-modal'));
                    }
                  }}
                  className="w-full p-4 rounded-xl border-2 border-[#006D5B] bg-gradient-to-r from-[#006D5B] to-[#0A2540] text-white flex items-center justify-between text-left transition-all cursor-pointer min-h-[56px] shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0">
                      <Smartphone className="w-5 h-5 text-[#CCFF00]" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-white leading-tight">
                        Install App & Invite Neighbors
                      </h3>
                      <p className="text-[11px] text-teal-100 font-medium">
                        Add to home screen • Earn +50 Karma per invite
                      </p>
                    </div>
                  </div>
                  <span className="bg-[#B45309] text-white text-[10px] px-2 py-1 rounded-md font-black uppercase tracking-wider shrink-0">
                    +50 KARMA
                  </span>
                </motion.button>

                {/* Urgent Emergency Quick Filter Button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    handleSelectView('map');
                    setFilter((prev) => ({
                      ...prev,
                      category: prev.category === 'EMERGENCY' ? 'ALL' : 'EMERGENCY',
                    }));
                  }}
                  className={`w-full p-4 rounded-xl border-2 flex items-center justify-between text-sm font-bold transition-all cursor-pointer min-h-[56px] ${
                    filter.category === 'EMERGENCY'
                      ? 'bg-red-600 text-white border-red-700 shadow-md ring-2 ring-red-400'
                      : 'bg-red-50 dark:bg-red-950/70 text-red-950 dark:text-red-100 border-red-300 dark:border-red-800 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Siren className="w-6 h-6 text-red-600 dark:text-red-400 animate-pulse" />
                    <span>View Urgent Community Hazards</span>
                  </div>
                  <span className="bg-red-700 text-white text-xs px-2.5 py-1 rounded-md font-bold uppercase">
                    ALERT
                  </span>
                </motion.button>

                {/* Categorized Modules Grid */}
                {secondaryModules.map((cat, idx) => (
                  <div key={idx} className="space-y-2.5">
                    <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-1">
                      {cat.category}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {cat.items.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = activeView === item.id;
                        return (
                          <motion.button
                            key={item.id}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleSelectView(item.id)}
                            className={`w-full p-4 rounded-xl border-1.5 flex items-center justify-between text-sm font-bold text-left transition-all cursor-pointer min-h-[56px] ${
                              isActive
                                ? 'bg-[#0A2540] text-white border-[#006D5B] dark:bg-[#006D5B] shadow-md'
                                : 'bg-white dark:bg-[#0F3254] text-[#111827] dark:text-slate-100 border-[#CBD5E1] dark:border-[#1E4976] hover:bg-slate-100 dark:hover:bg-[#153D66]'
                            }`}
                          >
                            <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
                              <IconComponent className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#FEF3C7]' : 'text-[#006D5B] dark:text-teal-400'}`} />
                              <span className="truncate">{item.label}</span>
                            </div>
                            {item.badge && (
                              <span
                                className={`text-xs px-2.5 py-0.5 rounded-md font-bold uppercase shrink-0 ${
                                  isActive
                                    ? 'bg-[#006D5B] text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Footer Info */}
              <div className="p-3.5 bg-slate-100 dark:bg-[#071B2F] border-t border-[#CBD5E1] dark:border-slate-800 text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                Cityscape Civic Engagement • Connecting Neighbors & City Teams
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

