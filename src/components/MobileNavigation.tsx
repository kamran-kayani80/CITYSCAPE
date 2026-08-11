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
} from 'lucide-react';
import { AppViewMode, ReportFilter } from '../types';

interface MobileNavigationProps {
  activeView: AppViewMode;
  setActiveView: (view: AppViewMode) => void;
  onOpenReportModal: () => void;
  totalReportsCount: number;
  userKarma: number;
  isAdminMode: boolean;
  filter: ReportFilter;
  setFilter: React.Dispatch<React.SetStateAction<ReportFilter>>;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeView,
  setActiveView,
  onOpenReportModal,
  totalReportsCount,
  userKarma,
  isAdminMode,
  filter,
  setFilter,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navItems = [
    { id: 'map' as AppViewMode, label: 'Map', icon: MapIcon, count: totalReportsCount },
    { id: 'bulletin' as AppViewMode, label: 'Bulletin', icon: Bell },
    { id: 'events' as AppViewMode, label: 'Events', icon: Megaphone },
  ];

  const secondaryModules = [
    {
      category: 'Civic Core & Real-Time',
      items: [
        { id: 'map' as AppViewMode, label: 'Interactive Community Map', icon: MapIcon, badge: `${totalReportsCount} Active` },
        { id: 'estate' as AppViewMode, label: 'HOA & Gated Estate Portal', icon: Building2, badge: 'PRIVATE' },
        { id: 'bulletin' as AppViewMode, label: 'Public Notices & Alerts', icon: Bell },
        { id: 'sla' as AppViewMode, label: 'SLA Resolution Tracker', icon: Clock },
      ],
    },
    {
      category: 'Community & Engagement',
      items: [
        { id: 'events' as AppViewMode, label: 'Events & Local Hire', icon: Megaphone, badge: 'HIRE' },
        { id: 'gratitude' as AppViewMode, label: 'Civic Wall of Fame', icon: Sparkles },
        { id: 'blog' as AppViewMode, label: 'Civic Journal & Stories', icon: BookOpen },
        { id: 'profile' as AppViewMode, label: 'Citizen Impact Profile', icon: User, badge: `${userKarma} Karma` },
      ],
    },
    {
      category: 'Administration & Strategy',
      items: [
        { id: 'admin' as AppViewMode, label: 'Municipal Gov Desk', icon: ShieldCheck, badge: isAdminMode ? 'STAFF' : 'PASS' },
        { id: 'analytics' as AppViewMode, label: 'City Stats & Data', icon: BarChart3 },
        { id: 'strategic' as AppViewMode, label: 'Strategic AI Roadmap', icon: Sparkles, badge: 'AI' },
        { id: 'brand' as AppViewMode, label: 'Accessibility Tokens', icon: Palette },
      ],
    },
  ];

  const handleSelectView = (view: AppViewMode) => {
    setActiveView(view);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Mobile Fixed Bottom Glass Navigation Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden px-3 pb-3 pt-1 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent pointer-events-none">
        <nav
          aria-label="Mobile Navigation Dock"
          className="pointer-events-auto max-w-md mx-auto bg-[#0A2540]/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-[#006D5B]/50 rounded-2xl p-1.5 shadow-2xl flex items-center justify-between gap-1 text-white"
        >
          {/* Quick Tab 1: Map */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => handleSelectView('map')}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer min-h-[56px] relative ${
              activeView === 'map'
                ? 'text-[#CCFF00] font-black'
                : 'text-slate-300 hover:text-white font-semibold'
            }`}
          >
            {activeView === 'map' && (
              <motion.div
                layoutId="mobileActiveDockPill"
                className="absolute inset-0 bg-[#006D5B]/80 rounded-xl border border-[#CCFF00]/40 shadow-xs"
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center">
              <MapIcon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] uppercase tracking-wider font-extrabold">Map</span>
            </div>
          </motion.button>

          {/* Quick Tab 2: HOA Estate */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => handleSelectView('estate')}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer min-h-[56px] relative ${
              activeView === 'estate'
                ? 'text-[#CCFF00] font-black'
                : 'text-slate-300 hover:text-white font-semibold'
            }`}
          >
            {activeView === 'estate' && (
              <motion.div
                layoutId="mobileActiveDockPill"
                className="absolute inset-0 bg-[#006D5B]/80 rounded-xl border border-[#CCFF00]/40 shadow-xs"
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center">
              <Building2 className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] uppercase tracking-wider font-extrabold">HOA</span>
            </div>
          </motion.button>

          {/* Center Elevated CTA Button: Report */}
          <div className="relative px-1 -top-3">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.9 }}
              onClick={onOpenReportModal}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B45309] to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white shadow-xl flex flex-col items-center justify-center border-2 border-amber-300 ring-4 ring-amber-500/30 cursor-pointer min-h-[56px] min-w-[56px]"
              aria-label="Report New Issue"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </motion.button>
          </div>

          {/* Quick Tab 3: Bulletin */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => handleSelectView('bulletin')}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer min-h-[56px] relative ${
              activeView === 'bulletin'
                ? 'text-[#CCFF00] font-black'
                : 'text-slate-300 hover:text-white font-semibold'
            }`}
          >
            {activeView === 'bulletin' && (
              <motion.div
                layoutId="mobileActiveDockPill"
                className="absolute inset-0 bg-[#006D5B]/80 rounded-xl border border-[#CCFF00]/40 shadow-xs"
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center">
              <Bell className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] uppercase tracking-wider font-extrabold">Bulletin</span>
            </div>
          </motion.button>

          {/* Quick Tab 4: All Modules Menu Trigger */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsDrawerOpen(true)}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer min-h-[56px] relative ${
              isDrawerOpen
                ? 'text-[#CCFF00] font-black'
                : 'text-slate-300 hover:text-white font-semibold'
            }`}
            aria-label="Open All Modules Menu"
          >
            <div className="relative z-10 flex flex-col items-center">
              <Grid className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] uppercase tracking-wider font-extrabold">Menu</span>
            </div>
          </motion.button>
        </nav>
      </div>

      {/* Mobile Animated Bottom Drawer Sheet */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden font-['Montserrat']">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl border-t-2 border-[#006D5B] shadow-2xl overflow-hidden max-h-[88vh] flex flex-col z-10"
            >
              {/* Swipe Handle & Header */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0A2540] text-[#CCFF00] flex items-center justify-center font-black">
                    <Grid className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-[#0A2540] dark:text-white uppercase tracking-wider">
                      Civic Modules & Navigation
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      Access all Cityscape platform features
                    </p>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Scrollable Modules List */}
              <div className="p-4 space-y-6 overflow-y-auto flex-1">
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
                  className={`w-full p-3.5 rounded-2xl border-2 flex items-center justify-between text-xs font-black transition-all cursor-pointer min-h-[52px] ${
                    filter.category === 'EMERGENCY'
                      ? 'bg-red-600 text-white border-red-700 shadow-md ring-2 ring-red-400'
                      : 'bg-red-50 dark:bg-red-950/60 text-red-900 dark:text-red-200 border-red-300 dark:border-red-800 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Siren className="w-5 h-5 text-red-600 animate-pulse" />
                    <span>View Urgent Emergency Hazards</span>
                  </div>
                  <span className="bg-red-700 text-white text-[9px] px-2 py-0.5 rounded-md font-mono font-black uppercase">
                    ALERT
                  </span>
                </motion.button>

                {/* Categorized Modules Grid */}
                {secondaryModules.map((cat, idx) => (
                  <div key={idx} className="space-y-2">
                    <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                      {cat.category}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {cat.items.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = activeView === item.id;
                        return (
                          <motion.button
                            key={item.id}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleSelectView(item.id)}
                            className={`w-full p-3.5 rounded-2xl border-2 flex items-center justify-between text-xs font-bold text-left transition-all cursor-pointer min-h-[52px] ${
                              isActive
                                ? 'bg-[#0A2540] text-[#CCFF00] border-[#006D5B] dark:bg-[#006D5B] shadow-md font-black'
                                : 'bg-slate-50 dark:bg-slate-800 text-[#111827] dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#CCFF00]' : 'text-[#006D5B] dark:text-teal-400'}`} />
                              <span className="truncate">{item.label}</span>
                            </div>
                            {item.badge && (
                              <span
                                className={`text-[9px] px-2 py-0.5 rounded-md font-mono font-black uppercase shrink-0 ${
                                  isActive
                                    ? 'bg-[#006D5B] text-white'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
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
              <div className="p-3 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] font-bold text-slate-500">
                Cityscape Civic Engagement System • Mobile Optimized
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
