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
  Download,
  Smartphone,
  Share2,
  Users,
  Landmark,
  Compass,
  Globe2,
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
  onOpenDownloadShareModal?: (tab?: 'download' | 'invite' | 'share') => void;
  onOpenCivicLexiconModal?: () => void;
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
  onOpenDownloadShareModal,
  onOpenCivicLexiconModal,
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
    <header className="sticky top-0 z-30 bg-[#FFFFFF] dark:bg-[#0A2540] border-b-2 border-[#CBD5E1] dark:border-slate-800 shadow-sm transition-all">
      {/* Top Bar: Brand, Search, User Actions & Primary CTA */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-3 py-1.5 sm:py-2">
          {/* Brand Logo & Name */}
          <div
            onClick={() => setActiveView('map')}
            className="flex items-center gap-1.5 sm:gap-3 shrink-0 cursor-pointer group py-1 transition-transform hover:scale-[1.01]"
          >
            <CityscapeLogo size="md" showTagline={false} fontSize="36px" />
            <span className="hidden sm:inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#006D5B] text-white border border-[#004D40] shadow-sm">
              Official
            </span>
          </div>

          {/* Search bar for map/feed view - Modern & Cohesive Design */}
          {activeView === 'map' && (
            <div className="flex-1 max-w-xs lg:max-w-sm hidden md:block">
              <div className="relative flex items-center group">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#006D5B] dark:group-focus-within:text-teal-400 transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  id="header-map-search-input"
                  type="text"
                  placeholder="Search streets, landmarks, reports..."
                  value={filter.searchQuery || ''}
                  onChange={(e) => setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  className="w-full pl-9 pr-14 py-2 bg-slate-50/90 dark:bg-slate-800/90 hover:bg-slate-100/90 dark:hover:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm font-medium rounded-2xl border-1.5 border-slate-300 dark:border-slate-700 focus:border-[#006D5B] dark:focus:border-teal-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-3 focus:ring-[#006D5B]/15 outline-none transition-all h-[38px] sm:h-[42px] shadow-2xs"
                />
                <div className="absolute right-2.5 flex items-center gap-1">
                  {filter.searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setFilter((prev) => ({ ...prev, searchQuery: '' }))}
                      title="Clear search"
                      aria-label="Clear search text"
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-700/60 rounded-md border border-slate-300/60 dark:border-slate-600/60 pointer-events-none">
                      /
                    </kbd>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Right Action buttons & Identity cluster with Unified Hierarchy */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-nowrap">
            {/* 1. User Identity & Persona Cluster */}
            <div className="flex items-center gap-1.5 shrink-0 bg-slate-100/60 dark:bg-slate-800/60 p-0.5 sm:p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
              {/* Google Sign-In / Account Button */}
              <div className="shrink-0">
                <GoogleAuthButton
                  currentUserProfile={userProfile}
                  onAuthChange={onUserProfileChange}
                  variant="header"
                />
              </div>

              {/* User Mode Toggle: Resident vs Staff (Logically paired with Account Identity) */}
              <button
                id="btn-header-role-mode-toggle"
                onClick={() => setIsAdminMode(!isAdminMode)}
                aria-pressed={isAdminMode}
                aria-label={isAdminMode ? 'Switch from Staff Mode to Resident Mode' : 'Switch from Resident Mode to Staff Mode'}
                title={isAdminMode ? 'Active: Staff & Operations Mode (Click to switch to Resident)' : 'Active: Resident Mode (Click to switch to Staff/Public Works)'}
                className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer h-[38px] sm:h-[42px] min-w-[80px] xs:min-w-[90px] sm:min-w-[104px] shrink-0 border ${
                  isAdminMode
                    ? 'bg-[#006D5B] text-white border-[#004D40] shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600 hover:border-[#006D5B] dark:hover:border-teal-400'
                }`}
              >
                {isAdminMode ? (
                  <>
                    <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
                    <span className="truncate">Staff</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#006D5B] dark:text-teal-300 shrink-0" />
                    <span className="truncate">Resident</span>
                  </>
                )}
              </button>
            </div>

            {/* Primary CTA Button: Report (Equal width & unified height, cohesive Cityscape Action Amber styling) */}
            <motion.button
              id="btn-header-primary-report"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenReportModal}
              aria-label="Report a neighborhood issue to city team"
              title="Report an Issue or Request to Municipal Public Works (+50 Civic Karma)"
              className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 h-[38px] sm:h-[42px] min-w-[80px] xs:min-w-[92px] sm:min-w-[104px] text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#B45309] via-[#C25E10] to-[#92400E] hover:from-[#D97706] hover:via-[#B45309] hover:to-[#78350F] border-1.5 border-[#78350F] dark:border-amber-400/50 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(180,83,9,0.3)] hover:shadow-[0_4px_14px_rgba(180,83,9,0.45)] active:shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3] text-amber-200 shrink-0" />
              <span className="truncate tracking-tight font-extrabold">Report</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Line 2: Dedicated Navigation Tabs Bar (Layered Multi-Tier Buttons with Full Title Visibility) */}
      <div className="block bg-slate-50/90 dark:bg-[#071B2F] border-t-1.5 border-[#CBD5E1] dark:border-slate-800 py-2.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto space-y-2">
          {/* Layer 1: Core Civic Operations & Emergency Response */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Core Operations & Portals
              </span>
            </div>
            <nav className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 w-full" aria-label="Core Navigation Layer">
              {/* Persistent Urgent / Emergency Tab */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                id="urgent-tab-btn"
                onClick={() => {
                  setActiveView('map');
                  setFilter((prev) => ({
                    ...prev,
                    category: prev.category === 'EMERGENCY' ? 'ALL' : 'EMERGENCY',
                  }));
                }}
                title="View Urgent Community Hazards"
                className={`header-urgent-btn w-full ${
                  activeView === 'map' && filter.category === 'EMERGENCY' ? 'active' : ''
                }`}
              >
                <Siren className={`w-4 h-4 shrink-0 ${activeView === 'map' && filter.category === 'EMERGENCY' ? 'text-yellow-300 animate-bounce' : 'text-red-600 animate-pulse'}`} />
                <span className="font-bold text-xs sm:text-[13px] whitespace-nowrap">Urgent Hazards</span>
                <span className="bg-red-700 text-white text-[9px] sm:text-[10px] h-4.5 sm:h-5 px-1.5 rounded-md font-bold uppercase tracking-wider inline-flex items-center justify-center leading-none shadow-xs shrink-0">
                  ALERT
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                id="discovery-tab-btn"
                onClick={() => setActiveView('map')}
                className={`header-nav-btn w-full ${activeView === 'map' ? 'active' : ''}`}
              >
                <MapIcon className="w-4 h-4 shrink-0" />
                <span className="font-bold text-xs sm:text-[13px] whitespace-nowrap">Live Map</span>
                <span className={`text-[9px] sm:text-[10px] h-4.5 sm:h-5 px-1.5 rounded-md font-bold inline-flex items-center justify-center leading-none shadow-xs shrink-0 ${
                  activeView === 'map' ? 'bg-[#006D5B] text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                }`}>
                  {totalReportsCount}
                </span>
              </motion.button>

              {/* Primary Feature 1: HOA Gated Estate Portal */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                id="hoa-gated-estate-tab-btn"
                onClick={() => setActiveView('estate')}
                title="HOA & Gated Community Private Portal"
                className={`header-nav-btn-featured-hoa w-full ${activeView === 'estate' ? 'active' : ''}`}
              >
                <Building2 className={`w-4 h-4 shrink-0 ${activeView === 'estate' ? 'text-white' : 'text-[#059669] dark:text-[#34D399]'}`} />
                <span className="font-extrabold tracking-tight text-xs sm:text-[13px] whitespace-nowrap">HOA Portal</span>
                <span className={`text-[9px] sm:text-[10px] h-4.5 sm:h-5 px-1.5 rounded-md font-bold uppercase tracking-wider inline-flex items-center justify-center leading-none shadow-xs shrink-0 ${
                  activeView === 'estate' 
                    ? 'bg-white/25 text-white border border-white/30' 
                    : 'bg-[#059669] text-white'
                }`}>
                  PRIME
                </span>
              </motion.button>

              {/* Primary Feature 2: Gov Desk (Consolidated Municipal Administration & Public Works) */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                id="gov-desk-tab-btn"
                onClick={() => setActiveView('admin')}
                title="Municipal Government & Public Works Administration"
                className={`header-nav-btn-featured-gov w-full ${activeView === 'admin' ? 'active' : ''}`}
              >
                <ShieldCheck className={`w-4 h-4 shrink-0 ${activeView === 'admin' ? 'text-white' : 'text-[#2563EB] dark:text-[#60A5FA]'}`} />
                <span className="font-extrabold tracking-tight text-xs sm:text-[13px] whitespace-nowrap">Gov Desk</span>
                {isAdminMode ? (
                  <span className={`text-[9px] sm:text-[10px] h-4.5 sm:h-5 px-1.5 rounded-md font-bold uppercase tracking-wider inline-flex items-center justify-center gap-0.5 leading-none shadow-xs shrink-0 ${
                    activeView === 'admin' 
                      ? 'bg-white/25 text-white border border-white/30' 
                      : 'bg-[#2563EB] text-white'
                  }`}>
                    <span>STAFF</span>
                  </span>
                ) : (
                  <span className={`text-[9px] sm:text-[10px] h-4.5 sm:h-5 px-1.5 rounded-md font-bold uppercase tracking-wider inline-flex items-center justify-center gap-0.5 leading-none shadow-xs shrink-0 ${
                    activeView === 'admin' 
                      ? 'bg-white/25 text-white border border-white/30' 
                      : 'bg-[#1E3A8A] text-white dark:bg-[#3B82F6]'
                  }`}>
                    <span>GOV</span>
                  </span>
                )}
              </motion.button>

              {/* Citizen Passport / Profile */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveView('profile')}
                className={`header-nav-btn w-full ${activeView === 'profile' ? 'active' : ''}`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span className="font-bold text-xs sm:text-[13px] whitespace-nowrap">Passport</span>
                <span className="inline-flex items-center justify-center gap-0.5 text-[9px] sm:text-[10px] h-4.5 sm:h-5 font-bold text-[#B45309] bg-[#FEF3C7] px-1.5 rounded-md border border-[#FDE68A] shadow-xs leading-none shrink-0">
                  <Flame className="w-3 h-3 fill-[#B45309] text-[#B45309]" />
                  <span>{userKarma}</span>
                </span>
              </motion.button>
            </nav>
          </div>

          {/* Layer 2: Community Spaces, Events & Civic Culture */}
          <div className="flex flex-col gap-1 pt-1 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Community Hub & Culture
              </span>
            </div>
            <nav className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 w-full" aria-label="Community Navigation Layer">
              {/* City Tourist Attractions & Heritage */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveView('attractions')}
                className={`header-nav-btn w-full ${activeView === 'attractions' ? 'active' : ''}`}
              >
                <Landmark className="w-4 h-4 shrink-0 text-[#006D5B] dark:text-teal-300" />
                <span className="font-bold text-xs sm:text-[13px] whitespace-nowrap">City Attractions</span>
                <span className="bg-[#006D5B] text-white text-[9px] sm:text-[10px] h-4.5 sm:h-5 px-1.5 rounded-md font-bold uppercase tracking-wider inline-flex items-center justify-center leading-none shadow-xs shrink-0">
                  TOUR
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveView('bulletin')}
                className={`header-nav-btn w-full ${activeView === 'bulletin' ? 'active' : ''}`}
              >
                <Bell className="w-4 h-4 shrink-0 text-[#006D5B] dark:text-teal-300" />
                <span className="font-bold text-xs sm:text-[13px] whitespace-nowrap">Bulletin Board</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveView('blog')}
                className={`header-nav-btn w-full ${activeView === 'blog' ? 'active' : ''}`}
              >
                <BookOpen className="w-4 h-4 shrink-0 text-[#006D5B] dark:text-teal-300" />
                <span className="font-bold text-xs sm:text-[13px] whitespace-nowrap">Civic Journal</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveView('events')}
                className={`header-nav-btn w-full ${activeView === 'events' ? 'active' : ''}`}
              >
                <Megaphone className="w-4 h-4 shrink-0 text-[#006D5B] dark:text-teal-300" />
                <span className="font-bold text-xs sm:text-[13px] whitespace-nowrap">Local Events</span>
                <span className="bg-[#FEF3C7] text-[#B45309] text-[9px] sm:text-[10px] h-4.5 sm:h-5 px-1.5 rounded-md font-bold uppercase tracking-wider border border-[#FDE68A] inline-flex items-center justify-center leading-none shadow-xs shrink-0">
                  HIRE
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveView('gratitude')}
                className={`header-nav-btn w-full ${activeView === 'gratitude' ? 'active' : ''}`}
              >
                <Award className="w-4 h-4 shrink-0 text-[#006D5B] dark:text-teal-300" />
                <span className="font-bold text-xs sm:text-[13px] whitespace-nowrap">Fame & Badges</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveView('brand')}
                className={`header-nav-btn w-full ${activeView === 'brand' ? 'active' : ''}`}
              >
                <Palette className="w-4 h-4 shrink-0 text-[#006D5B] dark:text-teal-300" />
                <span className="font-bold text-xs sm:text-[13px] whitespace-nowrap">Brand Guide</span>
              </motion.button>

              {/* Civic Jargons 3.0 International Lexicon Modal Trigger */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                id="btn-header-civic-jargons"
                onClick={onOpenCivicLexiconModal}
                title="Explore International Civic Jargons & Urbanist Lexicon"
                className="header-nav-btn w-full bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700"
              >
                <Globe2 className="w-4 h-4 shrink-0 text-[#B45309] dark:text-amber-400" />
                <span className="font-extrabold text-xs sm:text-[13px] whitespace-nowrap">Civic Jargons</span>
                <span className="bg-[#B45309] text-white text-[9px] sm:text-[10px] h-4.5 sm:h-5 px-1.5 rounded-md font-bold uppercase tracking-wider inline-flex items-center justify-center leading-none shadow-xs shrink-0">
                  ISO
                </span>
              </motion.button>
            </nav>
          </div>
        </div>
      </div>

      {/* Filter Row / Bar for Map View */}
      {activeView === 'map' && (
        <div
          className={`${
            showFiltersMobile ? 'block' : 'hidden lg:block'
          } bg-slate-50 dark:bg-[#071B2F] border-t-1.5 border-[#CBD5E1] dark:border-slate-800 py-3 px-4 transition-all`}
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
            {/* Filter Pills with Equal-Width Button Layout */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full lg:w-auto">
              <span className="text-[#111827] dark:text-slate-200 font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 shrink-0">
                <Filter className="w-3.5 h-3.5 text-[#006D5B] dark:text-teal-300" />
                <span>Filter Status:</span>
              </span>
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setFilter((prev) => ({ ...prev, status: 'ALL' }))}
                  title="Show all statuses"
                  className={`header-filter-btn ${
                    !filter.status || filter.status === 'ALL' ? 'active' : ''
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                  <span className="truncate">All Status</span>
                </button>
                {(Object.keys(STATUS_CONFIG) as ReportStatus[]).map((st) => {
                  const conf = STATUS_CONFIG[st];
                  const isActive = filter.status === st;
                  return (
                    <button
                      key={st}
                      onClick={() => setFilter((prev) => ({ ...prev, status: isActive ? 'ALL' : st }))}
                      title={`Filter by ${conf.label}`}
                      className={`header-filter-btn ${
                        isActive
                          ? 'active !border-[#006D5B] ring-2 ring-[#006D5B]/30'
                          : ''
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${conf.dotColor}`} />
                      <span className="truncate">{conf.label.split(' / ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Dropdown & Sort */}
            <div className="flex items-center space-x-2.5">
              <select
                value={filter.category || 'ALL'}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, category: e.target.value as ReportCategory | 'ALL' }))
                }
                className="header-filter-select outline-none focus:ring-2 focus:ring-[#006D5B]"
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
                className="header-filter-select outline-none focus:ring-2 focus:ring-[#006D5B]"
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
                  className="text-sm text-[#B45309] dark:text-amber-400 font-bold underline hover:text-amber-800 ml-1 cursor-pointer min-h-[44px] flex items-center"
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
