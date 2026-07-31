import React from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Plus,
  Search,
  LayoutDashboard,
  BarChart3,
  Map as MapIcon,
  ShieldCheck,
  UserCheck,
  Building2,
  X,
  Filter,
  Sparkles,
  Award,
  User,
  Flame,
  Siren,
  Lock,
  CreditCard,
  BookOpen,
  Calendar,
  Megaphone,
  Clock,
  Bell,
  Palette,
} from 'lucide-react';
import { CityscapeLogo } from './CityscapeLogo';
import { GoogleAuthButton } from './GoogleAuthButton';
import { ReportFilter, ReportCategory, ReportStatus, SeverityLevel, UserProfile, AppViewMode } from '../types';
import { CATEGORY_CONFIG, STATUS_CONFIG, SEVERITY_CONFIG } from '../lib/constants';

interface HeaderProps {
  activeView: AppViewMode;
  setActiveView: (view: AppViewMode) => void;
  filter: ReportFilter;
  setFilter: React.Dispatch<React.SetStateAction<ReportFilter>>;
  onOpenReportModal: () => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  totalReportsCount: number;
  userKarma?: number;
  userProfile?: UserProfile | null;
  onUserProfileChange?: (profile: UserProfile) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  filter,
  setFilter,
  onOpenReportModal,
  isAdminMode,
  setIsAdminMode,
  totalReportsCount,
  userKarma = 840,
  userProfile,
  onUserProfileChange,
}) => {
  const [showFiltersMobile, setShowFiltersMobile] = React.useState(false);

  const activeFiltersCount =
    (filter.category && filter.category !== 'ALL' ? 1 : 0) +
    (filter.status && filter.status !== 'ALL' ? 1 : 0) +
    (filter.severity && filter.severity !== 'ALL' ? 1 : 0);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-md border-b-2 border-[#008080] shadow-sm transition-all font-['Montserrat']">
      {/* Top Bar: Brand, Search, User Actions & Primary CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 py-2">
          {/* Brand Logo & Name */}
          <div
            onClick={() => setActiveView('map')}
            className="flex items-center space-x-2 shrink-0 cursor-pointer group py-1"
          >
            <CityscapeLogo size="md" showTagline={true} />
            <span className="hidden xl:inline-block px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-md bg-[#008080] text-[#CCFF00] border border-[#CCFF00]/40 self-start mt-1">
              Official
            </span>
          </div>

          {/* Search bar for map/feed view */}
          {activeView === 'map' && (
            <div className="flex-1 max-w-sm hidden md:block relative">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#008080]" />
                <input
                  type="text"
                  placeholder="Search location or hazard..."
                  value={filter.searchQuery || ''}
                  onChange={(e) => setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  className="w-full pl-9 pr-8 py-1.5 bg-[#F2F2F2] dark:bg-slate-800 focus:bg-white border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-[#1A1A1A] dark:text-white outline-none transition-all placeholder-slate-500 focus:ring-2 focus:ring-[#008080]"
                />
                {filter.searchQuery && (
                  <button
                    onClick={() => setFilter((prev) => ({ ...prev, searchQuery: '' }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#008080]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right Action buttons & Identity cluster */}
          <div className="flex items-center space-x-2.5">
            {/* Google Sign-In Button */}
            <div className="hidden md:block">
              <GoogleAuthButton
                currentUserProfile={userProfile}
                onAuthChange={onUserProfileChange}
                variant="header"
              />
            </div>

            {/* User Mode Toggle: Resident vs Staff */}
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              title={isAdminMode ? 'Switch to Resident Mode' : 'Switch to Staff Mode'}
              className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isAdminMode
                  ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                  : 'bg-white/80 text-slate-900 border-white hover:bg-white'
              }`}
            >
              {isAdminMode ? (
                <>
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Staff</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-[#008080]" />
                  <span>Resident</span>
                </>
              )}
            </button>

            {/* Mobile filter toggle */}
            {activeView === 'map' && (
              <button
                onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                className="lg:hidden relative p-2 text-slate-900 bg-white/80 rounded-xl border border-white"
              >
                <Filter className="w-4 h-4" />
                {activeFiltersCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
                )}
              </button>
            )}

            {/* Primary CTA Button: Brief Heading "+ Report" */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenReportModal}
              className="btn-primary-designer pro-button flex items-center space-x-1.5 py-2 px-3.5 rounded-xl text-xs cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Report</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Line 2: Dedicated Navigation Tabs Bar (Gestalt Law of Proximity) */}
      <div className="bg-[#F2F2F2] dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Main View Tabs (Short & Brief Labels) */}
          <nav className="flex items-center gap-1.5 text-xs font-['Montserrat'] font-extrabold overflow-x-auto no-scrollbar py-0.5">
            {/* Persistent Urgent / Emergency Tab */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              id="urgent-tab-btn"
              onClick={() => {
                setActiveView('map');
                setFilter((prev) => ({
                  ...prev,
                  category: prev.category === 'EMERGENCY' ? 'ALL' : 'EMERGENCY',
                }));
              }}
              title="View Urgent Emergency Hazards"
              className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-lg transition-all cursor-pointer shrink-0 border ${
                activeView === 'map' && filter.category === 'EMERGENCY'
                  ? 'bg-red-600 text-white border-red-700 shadow-md ring-2 ring-red-400 font-black'
                  : 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-300/80 hover:bg-red-600 hover:text-white'
              }`}
            >
              <Siren className={`w-3.5 h-3.5 ${activeView === 'map' && filter.category === 'EMERGENCY' ? 'text-yellow-300 animate-bounce' : 'text-red-600 animate-pulse'}`} />
              <span>Urgent</span>
              <span className="bg-red-700 text-white text-[9px] px-1.5 py-0.2 rounded font-mono font-black uppercase tracking-wider">
                ALERT
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              id="discovery-tab-btn"
              onClick={() => setActiveView('map')}
              className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-lg transition-all cursor-pointer shrink-0 border ${
                activeView === 'map'
                  ? 'bg-[#008080] text-[#CCFF00] shadow-xs border-[#CCFF00]/40 font-black'
                  : 'bg-white dark:bg-slate-800 text-[#1A1A1A] dark:text-white hover:bg-slate-100 border-slate-200 dark:border-slate-700'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                activeView === 'map' ? 'bg-[#1A1A1A] text-[#CCFF00]' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}>
                {totalReportsCount}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveView('bulletin')}
              className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-lg transition-all cursor-pointer shrink-0 border ${
                activeView === 'bulletin'
                  ? 'bg-[#008080] text-[#CCFF00] shadow-xs border-[#CCFF00]/40 font-black'
                  : 'bg-white dark:bg-slate-800 text-[#1A1A1A] dark:text-white hover:bg-slate-100 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-[#008080] dark:text-[#CCFF00]" />
              <span>Bulletin</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveView('sla')}
              className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-lg transition-all cursor-pointer shrink-0 border ${
                activeView === 'sla'
                  ? 'bg-[#008080] text-[#CCFF00] shadow-xs border-[#CCFF00]/40 font-black'
                  : 'bg-white dark:bg-slate-800 text-[#1A1A1A] dark:text-white hover:bg-slate-100 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#008080] dark:text-[#CCFF00]" />
              <span>SLA Tracker</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveView('blog')}
              className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-lg transition-all cursor-pointer shrink-0 border ${
                activeView === 'blog'
                  ? 'bg-[#008080] text-[#CCFF00] shadow-xs border-[#CCFF00]/40 font-black'
                  : 'bg-white dark:bg-slate-800 text-[#1A1A1A] dark:text-white hover:bg-slate-100 border-slate-200 dark:border-slate-700'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#008080] dark:text-[#CCFF00]" />
              <span>Civic Journal</span>
            </motion.button>

            <button
              onClick={() => setActiveView('events')}
              className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-lg transition-all cursor-pointer shrink-0 border ${
                activeView === 'events'
                  ? 'bg-[#008080] text-[#CCFF00] shadow-xs border-[#CCFF00]/40 font-black'
                  : 'bg-white dark:bg-slate-800 text-[#1A1A1A] dark:text-white hover:bg-slate-100 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5 text-[#008080] dark:text-[#CCFF00]" />
              <span>Events & Ads</span>
              <span className="bg-[#CCFF00] text-[#1A1A1A] text-[9px] px-1.5 py-0.2 rounded font-mono font-black uppercase tracking-wider">
                HIRE
              </span>
            </button>

            <button
              onClick={() => setActiveView('gratitude')}
              className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-lg transition-all cursor-pointer shrink-0 border ${
                activeView === 'gratitude'
                  ? 'bg-[#008080] text-[#CCFF00] shadow-xs border-[#CCFF00]/40 font-black'
                  : 'bg-white dark:bg-slate-800 text-[#1A1A1A] dark:text-white hover:bg-slate-100 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#008080] dark:text-[#CCFF00]" />
              <span>Fame</span>
            </button>

            <button
              onClick={() => setActiveView('admin')}
              className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-lg transition-all cursor-pointer shrink-0 border ${
                activeView === 'admin'
                  ? 'bg-[#008080] text-[#CCFF00] shadow-xs border-[#CCFF00]/40 font-black'
                  : 'bg-white dark:bg-slate-800 text-[#1A1A1A] dark:text-white hover:bg-slate-100 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#008080] dark:text-[#CCFF00]" />
              <span>Gov Desk</span>
              {isAdminMode ? (
                <span className="bg-[#008080] text-[#CCFF00] text-[9px] px-1.5 py-0.2 rounded font-mono font-black uppercase tracking-wider flex items-center gap-0.5 border border-[#CCFF00]/40">
                  <ShieldCheck className="w-2.5 h-2.5 text-[#CCFF00]" />
                  <span>$25/mo</span>
                </span>
              ) : (
                <span className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[9px] px-1.5 py-0.2 rounded font-mono font-black uppercase tracking-wider flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" />
                  <span>PASS</span>
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('analytics')}
              className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-lg transition-all cursor-pointer shrink-0 border ${
                activeView === 'analytics'
                  ? 'bg-[#008080] text-[#CCFF00] shadow-xs border-[#CCFF00]/40 font-black'
                  : 'bg-white dark:bg-slate-800 text-[#1A1A1A] dark:text-white hover:bg-slate-100 border-slate-200 dark:border-slate-700'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#008080] dark:text-[#CCFF00]" />
              <span>Stats</span>
            </button>

            <button
              onClick={() => setActiveView('profile')}
              className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-lg transition-all cursor-pointer shrink-0 ${
                activeView === 'profile'
                  ? 'bg-[#008080] text-white shadow-xs font-black'
                  : 'bg-white/60 text-slate-900 hover:bg-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Passport</span>
              <span className="flex items-center gap-0.5 text-[10px] font-mono font-black text-amber-800 bg-amber-100 px-1 rounded">
                <Flame className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                <span>{userKarma}</span>
              </span>
            </button>


          </nav>


        </div>
      </div>

      {/* Filter Row / Bar for Map View */}
      {activeView === 'map' && (
        <div
          className={`${
            showFiltersMobile ? 'block' : 'hidden lg:block'
          } bg-[#008080]/15 border-t border-white/80 py-2.5 px-4 transition-all`}
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-900 font-black uppercase tracking-wider text-[10px]">
                Filter Status:
              </span>
              <button
                onClick={() => setFilter((prev) => ({ ...prev, status: 'ALL' }))}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  !filter.status || filter.status === 'ALL'
                    ? 'bg-[#008080] text-white shadow-xs font-black'
                    : 'bg-white/80 text-slate-900 border border-white hover:bg-white'
                }`}
              >
                All Statuses
              </button>
              {(Object.keys(STATUS_CONFIG) as ReportStatus[]).map((st) => {
                const conf = STATUS_CONFIG[st];
                const isActive = filter.status === st;
                return (
                  <button
                    key={st}
                    onClick={() => setFilter((prev) => ({ ...prev, status: isActive ? 'ALL' : st }))}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                      isActive
                        ? `${conf.bgClass} ${conf.textClass} shadow-xs ring-2 ring-[#008080]`
                        : 'bg-white/80 text-slate-900 border border-white hover:bg-white'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${conf.dotColor}`} />
                    <span>{conf.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Category Dropdown & Sort */}
            <div className="flex items-center space-x-2">
              <select
                value={filter.category || 'ALL'}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, category: e.target.value as ReportCategory | 'ALL' }))
                }
                className="bg-white/90 border border-white/80 text-slate-900 font-bold px-3 py-1 rounded-xl focus:ring-2 focus:ring-[#008080] outline-none cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                {(Object.keys(CATEGORY_CONFIG) as ReportCategory[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_CONFIG[cat].label}
                  </option>
                ))}
              </select>

              <select
                value={filter.sortBy || 'newest'}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    sortBy: e.target.value as 'newest' | 'oldest' | 'upvotes' | 'severity',
                  }))
                }
                className="bg-white/90 border border-white/80 text-slate-900 font-bold px-3 py-1 rounded-xl focus:ring-2 focus:ring-[#008080] outline-none cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="upvotes">Sort: Most Endorsed</option>
                <option value="severity">Sort: Highest Hazard</option>
                <option value="oldest">Sort: Oldest First</option>
              </select>

              {activeFiltersCount > 0 && (
                <button
                  onClick={() =>
                    setFilter({
                      status: 'ALL',
                      category: 'ALL',
                      severity: 'ALL',
                      searchQuery: '',
                      sortBy: 'newest',
                    })
                  }
                  className="text-xs text-[#008080] font-extrabold underline hover:text-teal-950 ml-1 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
