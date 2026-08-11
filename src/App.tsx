import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { CommunityMap } from './components/CommunityMap';
import { IssueList } from './components/IssueList';
import { ReportModal } from './components/ReportModal';
import { ReportDetailModal } from './components/ReportDetailModal';
import { AdminDashboard } from './components/AdminDashboard';
import { MunicipalDeskPortal } from './components/MunicipalDeskPortal';
import { AnalyticsView } from './components/AnalyticsView';
import { CommunityGratitudeFeed } from './components/CommunityGratitudeFeed';
import { UserProfileView } from './components/UserProfileView';
import { CivicJournalBlog } from './components/CivicJournalBlog';
import { CommunityEventsHub } from './components/CommunityEventsHub';
import { CommunityVerificationModal } from './components/CommunityVerificationModal';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { CivicBulletinHub } from './components/CivicBulletinHub';
import { SlaDashboard } from './components/SlaDashboard';
import { CitizenPrideBanner } from './components/CitizenPrideBanner';
import { BrandIdentitySystem } from './components/BrandIdentitySystem';
import { StrategicArchitectureView } from './components/StrategicArchitectureView';
import { EstatePortalView } from './components/EstatePortalView';
import { INITIAL_REPORTS } from './data/seedData';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { Report, Comment, ReportFilter, CityStats, ReportStatus, IssueVerification, UserProfile, AppViewMode } from './types';
import { CheckCircle, AlertCircle, Plus, Sparkles, SlidersHorizontal, Map, List } from 'lucide-react';
import { useOfflineSync } from './hooks/useOfflineSync';
import { OfflineSyncBanner } from './components/OfflineSyncBanner';
import {
  getCachedReports,
  saveCachedReports,
  enqueueOfflineItem,
  PendingOfflineItem,
} from './lib/offlineQueue';

export default function App() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [cityStats, setCityStats] = useState<CityStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [activeView, setActiveView] = useState<AppViewMode>('map');
  const [mobileTab, setMobileTab] = useState<'map' | 'list'>('map');

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [verificationReport, setVerificationReport] = useState<Report | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userKarma, setUserKarma] = useState(840);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Offline Sync Dispatcher Handler
  const handleDispatchSyncItem = async (item: PendingOfflineItem): Promise<boolean> => {
    try {
      if (item.type === 'CREATE_REPORT') {
        const res = await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.payload),
        });
        if (res.ok) {
          fetchReports();
          return true;
        }
        return false;
      }
      if (item.type === 'UPVOTE_REPORT') {
        const res = await fetch(`/api/reports/${item.payload.reportId}/upvote`, { method: 'POST' });
        return res.ok;
      }
      if (item.type === 'ADD_COMMENT') {
        const res = await fetch(`/api/reports/${item.payload.reportId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.payload),
        });
        return res.ok;
      }
      if (item.type === 'UPDATE_STATUS') {
        const res = await fetch(`/api/reports/${item.payload.reportId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Role': isAdminMode ? 'admin' : 'citizen',
          },
          body: JSON.stringify(item.payload),
        });
        return res.ok;
      }
      if (item.type === 'CONFIRM_RESOLUTION') {
        const res = await fetch(`/api/reports/${item.payload.reportId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: item.payload.confirmed ? 'CLOSED' : 'IN_PROGRESS',
            resolutionDisputeReason: item.payload.disputeReason,
          }),
        });
        return res.ok;
      }
      return false;
    } catch (err) {
      console.warn('Sync dispatch error for queued item:', item, err);
      return false;
    }
  };

  const offlineSync = useOfflineSync(handleDispatchSyncItem);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setUserProfile(data.profile);
          setUserKarma(data.profile.civicKarma);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch user profile:', err);
    }
  };

  // Filters State
  const [filter, setFilter] = useState<ReportFilter>({
    status: 'ALL',
    category: 'ALL',
    severity: 'ALL',
    searchQuery: '',
    sortBy: 'newest',
  });

  // Fetch reports from Express API with offline caching support
  const fetchReports = async () => {
    setIsLoading(true);
    let fetchedReports: Report[] = [];
    try {
      const queryParams = new URLSearchParams();
      if (filter.status && filter.status !== 'ALL') queryParams.append('status', filter.status);
      if (filter.category && filter.category !== 'ALL') queryParams.append('category', filter.category);
      if (filter.severity && filter.severity !== 'ALL') queryParams.append('severity', filter.severity);
      if (filter.searchQuery) queryParams.append('search', filter.searchQuery);
      if (filter.sortBy) queryParams.append('sort', filter.sortBy);

      const res = await fetch(`/api/reports?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        fetchedReports = data.reports || [];
        saveCachedReports(fetchedReports);
      } else {
        console.warn('API returned non-OK status, falling back to cached & seed reports');
        const cached = getCachedReports();
        fetchedReports = cached.length > 0 ? cached : INITIAL_REPORTS;
      }
    } catch (err) {
      console.warn('API fetch unavailable (Offline Mode), loading from local cache:', err);
      const cached = getCachedReports();
      fetchedReports = cached.length > 0 ? cached : INITIAL_REPORTS;
    }

    // Merge locally cached user reports to ensure immediate persistence
    try {
      const savedLocal: Report[] = JSON.parse(localStorage.getItem('cityscape_user_created_reports') || '[]');
      if (Array.isArray(savedLocal) && savedLocal.length > 0) {
        const reportMap = new Map<string, Report>();
        fetchedReports.forEach((r) => reportMap.set(r.id, r));
        savedLocal.forEach((r) => {
          if (r && r.id && !reportMap.has(r.id)) {
            reportMap.set(r.id, r);
          }
        });
        fetchedReports = (Array.from(reportMap.values()) as Report[]).sort(
          (a: Report, b: Report) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    } catch (e) {
      console.warn('Local storage load warning:', e);
    }

    setReports(fetchedReports);

    // Deep link support: auto-select report if URL parameter or hash is present
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    const deepLinkId = urlParams.get('reportId') || (hash.startsWith('#report-') ? hash.replace('#report-', '') : null);

    if (deepLinkId) {
      const match = fetchedReports.find((r: Report) => r.id === deepLinkId);
      if (match) {
        handleSelectReport(match);
      }
    }

    setIsLoading(false);
  };

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const stats = await res.json();
        setCityStats(stats);
      }
    } catch (err) {
      console.warn('Stats fetch warning:', err);
    }
  };

  // Fetch Comments for Selected Report
  const fetchComments = async (reportId: string) => {
    try {
      const res = await fetch(`/api/reports/${reportId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error('Fetch comments error:', err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filter]);

  useEffect(() => {
    fetchStats();
  }, [reports.length]);

  const handleSelectReport = (report: Report) => {
    setSelectedReport(report);
    fetchComments(report.id);
  };

  // Upvote / Endorse issue handler with Offline Support
  const handleUpvoteReport = async (reportId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Optimistic UI update
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const userHasUpvoted = !r.userHasUpvoted;
          const upvotesCount = userHasUpvoted ? r.upvotesCount + 1 : Math.max(0, r.upvotesCount - 1);
          return { ...r, userHasUpvoted, upvotesCount };
        }
        return r;
      })
    );

    if (selectedReport && selectedReport.id === reportId) {
      const userHasUpvoted = !selectedReport.userHasUpvoted;
      const upvotesCount = userHasUpvoted ? selectedReport.upvotesCount + 1 : Math.max(0, selectedReport.upvotesCount - 1);
      setSelectedReport({ ...selectedReport, userHasUpvoted, upvotesCount });
    }

    if (!offlineSync.isOnline) {
      enqueueOfflineItem('UPVOTE_REPORT', `Endorsement for report #${reportId}`, { reportId });
      showToast('📡 Endorsement Saved Offline (Queued for Auto-Sync)');
      return;
    }

    try {
      const res = await fetch(`/api/reports/${reportId}/upvote`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        showToast(data.userHasUpvoted ? '👍 Issue Endorsed! "I see this too"' : 'Endorsement removed');
      }
    } catch (err) {
      console.warn('Upvote queued for offline sync:', err);
      enqueueOfflineItem('UPVOTE_REPORT', `Endorsement for report #${reportId}`, { reportId });
      showToast('📡 Endorsement Saved Offline (Queued for Auto-Sync)');
    }
  };

  // Create Report Handler with Offline Support for Underground Facilities
  const handleSubmitNewReport = async (newReportData: any) => {
    if (!offlineSync.isOnline) {
      const tempId = `off_rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const offlineReport: Report = {
        id: tempId,
        title: newReportData.title,
        description: newReportData.description || 'Recorded in subterranean/offline mode.',
        category: newReportData.category,
        severity: newReportData.severity || 'MEDIUM',
        status: 'OPEN',
        wardZone: newReportData.wardZone || 'Central Ward 4',
        latitude: Number(newReportData.latitude) || 33.5970,
        longitude: Number(newReportData.longitude) || 73.0449,
        addressText: newReportData.addressText || 'Underground Facility / Sub-Surface Site',
        imageUrls: newReportData.imageUrls || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userName: newReportData.userName || 'Local Resident',
        userEmail: newReportData.userEmail || '',
        isGuest: newReportData.isGuest || false,
        upvotesCount: 1,
        userHasUpvoted: true,
        verificationsCount: 0,
        verifications: [],
        slaHoursTarget: newReportData.slaHoursTarget || 48,
        slaDueDate: newReportData.slaDueDate || new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        slaStatus: 'ON_TRACK',
        isProxyReport: newReportData.isProxyReport || false,
        proxyResidentName: newReportData.proxyResidentName,
        proxyResidentContact: newReportData.proxyResidentContact,
        aiForensics: newReportData.aiForensics,
        isFlaggedAsAiFake: newReportData.isFlaggedAsAiFake || false,
      };

      enqueueOfflineItem('CREATE_REPORT', newReportData.title, newReportData, tempId);

      try {
        const savedLocal = JSON.parse(localStorage.getItem('cityscape_user_created_reports') || '[]');
        const updatedLocal = [offlineReport, ...savedLocal.filter((r: any) => r.id !== tempId)];
        localStorage.setItem('cityscape_user_created_reports', JSON.stringify(updatedLocal));
      } catch (e) {
        console.warn('Local storage save warning:', e);
      }

      setReports((prev) => [offlineReport, ...prev]);
      setSelectedReport(offlineReport);
      showToast('📡 Saved Offline! Automatically queued for auto-sync when network connectivity resumes.');
      return;
    }

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReportData),
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = null;
      if (contentType.includes('application/json')) {
        data = await res.json();
      }

      if (!res.ok) {
        const errorMsg = data?.error || `Server error (${res.status})`;
        throw new Error(errorMsg);
      }

      if (data && data.report) {
        showToast('🎉 Neighborhood Request Submitted Successfully!');

        try {
          const savedLocal = JSON.parse(localStorage.getItem('cityscape_user_created_reports') || '[]');
          const updatedLocal = [data.report, ...savedLocal.filter((r: any) => r.id !== data.report.id)];
          localStorage.setItem('cityscape_user_created_reports', JSON.stringify(updatedLocal));
        } catch (e) {
          console.warn('Local storage save warning:', e);
        }

        fetchReports();
        fetchStats();
        setSelectedReport(data.report);
      }
    } catch (err: any) {
      console.warn('Online submission failed, queuing offline:', err);
      const tempId = `off_rep_${Date.now()}`;
      const offlineReport: Report = {
        id: tempId,
        title: newReportData.title,
        description: newReportData.description || 'Recorded in subterranean/offline mode.',
        category: newReportData.category,
        severity: newReportData.severity || 'MEDIUM',
        status: 'OPEN',
        wardZone: newReportData.wardZone || 'Central Ward 4',
        latitude: Number(newReportData.latitude) || 33.5970,
        longitude: Number(newReportData.longitude) || 73.0449,
        addressText: newReportData.addressText || 'Underground Facility / Sub-Surface Site',
        imageUrls: newReportData.imageUrls || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userName: newReportData.userName || 'Local Resident',
        userEmail: newReportData.userEmail || '',
        isGuest: newReportData.isGuest || false,
        upvotesCount: 1,
        userHasUpvoted: true,
        verificationsCount: 0,
        verifications: [],
        slaHoursTarget: newReportData.slaHoursTarget || 48,
        slaDueDate: newReportData.slaDueDate || new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        slaStatus: 'ON_TRACK',
      };

      enqueueOfflineItem('CREATE_REPORT', newReportData.title, newReportData, tempId);
      setReports((prev) => [offlineReport, ...prev]);
      setSelectedReport(offlineReport);
      showToast('📡 Saved Offline! Automatically queued for auto-sync when network connectivity resumes.');
    }
  };

  // Add comment handler with Offline Support
  const handleAddComment = async (reportId: string, content: string, isOfficial: boolean) => {
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      reportId,
      userName: isAdminMode ? 'Municipal Operations' : 'Local Resident',
      userRole: isAdminMode ? 'admin' : 'citizen',
      content,
      isOfficialUpdate: isOfficial || isAdminMode,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [...prev, newComment]);

    if (!offlineSync.isOnline) {
      enqueueOfflineItem('ADD_COMMENT', `Comment on report #${reportId}`, {
        reportId,
        userName: newComment.userName,
        userRole: newComment.userRole,
        content,
        isOfficialUpdate: newComment.isOfficialUpdate,
      });
      showToast('📡 Comment Saved Offline (Queued for Auto-Sync)');
      return;
    }

    try {
      const res = await fetch(`/api/reports/${reportId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: newComment.userName,
          userRole: newComment.userRole,
          content,
          isOfficialUpdate: newComment.isOfficialUpdate,
        }),
      });

      if (res.ok) {
        showToast('Comment posted successfully');
      }
    } catch (err) {
      console.warn('Add comment queued offline:', err);
      enqueueOfflineItem('ADD_COMMENT', `Comment on report #${reportId}`, {
        reportId,
        userName: newComment.userName,
        userRole: newComment.userRole,
        content,
        isOfficialUpdate: newComment.isOfficialUpdate,
      });
      showToast('📡 Comment Saved Offline (Queued for Auto-Sync)');
    }
  };

  // Update Status Handler (Admin Portal)
  const handleUpdateStatus = async (
    reportId: string,
    status: ReportStatus,
    officialNote?: string,
    resolutionImageUrl?: string,
    assignedWorker?: string
  ) => {
    try {
      const res = await fetch(`/api/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': isAdminMode ? 'admin' : 'citizen',
        },
        body: JSON.stringify({
          status,
          officialNote,
          resolutionImageUrl,
          assignedWorker,
        }),
      });

      if (res.ok) {
        showToast(`Report #${reportId} updated to ${status}`);
        fetchReports();
        fetchStats();
      }
    } catch (err) {
      console.error('Status update failed', err);
    }
  };

  // Confirm or Dispute Resolution Handler
  const handleConfirmResolution = async (reportId: string, confirmed: boolean, disputeReason?: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            resolutionConfirmedByReporter: confirmed,
            resolutionDisputeReason: disputeReason,
            slaStatus: confirmed ? ('ON_TRACK' as any) : ('DISPUTED' as any),
            status: confirmed ? 'CLOSED' : 'IN_PROGRESS',
          };
        }
        return r;
      })
    );

    if (confirmed) {
      setUserKarma((k) => k + 25);
      showToast('🎉 Resolution Confirmed! +25 Civic Karma awarded!');
    } else {
      showToast('🚨 Resolution Disputed! Ticket re-opened & escalated to Municipal Lead.');
    }
  };

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] text-[#111827] dark:text-[#F8FAFC] flex flex-col font-['Montserrat'] antialiased selection:bg-[#006D5B] selection:text-[#CCFF00]">
        {/* Sticky WCAG AAA Accessibility Toolbar */}
        <AccessibilityToolbar />

        {/* Offline Sync Banner (Underground Facility / Sub-Surface Ready) */}
        <OfflineSyncBanner
          isOnline={offlineSync.isOnline}
          isBrowserOnline={offlineSync.isBrowserOnline}
          isUndergroundSimulated={offlineSync.isUndergroundSimulated}
          onToggleUnderground={offlineSync.toggleUndergroundMode}
          pendingQueue={offlineSync.pendingQueue}
          isSyncing={offlineSync.isSyncing}
          onTriggerSync={offlineSync.triggerSync}
          lastSyncTime={offlineSync.lastSyncTime}
          cachedReportsCount={reports.length}
          lastSyncSummary={offlineSync.lastSyncSummary}
        />

        {/* Navigation Header */}
        <Header
          activeView={activeView}
          setActiveView={setActiveView}
          filter={filter}
          setFilter={setFilter}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          isAdminMode={isAdminMode}
          setIsAdminMode={setIsAdminMode}
          totalReportsCount={reports.length}
          userKarma={userKarma}
          userProfile={userProfile}
          onUserProfileChange={(updated) => {
            setUserProfile(updated);
            setUserKarma(updated.civicKarma);
          }}
        />

        {/* Main View Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">
          {/* Dynamic Citizen Pride Banner - Only on Home Screen */}
          {activeView === 'map' && <CitizenPrideBanner />}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.99 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* VIEW 1: DUAL MAP & LIST SPLIT VIEW */}
              {activeView === 'map' && (
                <div className="space-y-4">
                  {/* Mobile View Switcher Pill */}
                  <div className="flex md:hidden items-center justify-center p-1.5 bg-slate-200 dark:bg-slate-800 rounded-2xl max-w-sm mx-auto border-2 border-slate-300 dark:border-slate-700 shadow-sm">
                    <button
                      onClick={() => setMobileTab('map')}
                      className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl text-xs font-black transition-all active:scale-[0.97] cursor-pointer min-h-[44px] ${
                        mobileTab === 'map'
                          ? 'bg-[#0A2540] text-[#CCFF00] dark:bg-[#006D5B] shadow-md border-2 border-[#006D5B]'
                          : 'text-[#111827] dark:text-slate-100 font-extrabold hover:bg-slate-300/50'
                      }`}
                    >
                      <Map className="w-4 h-4 text-[#CCFF00]" />
                      <span>Map View</span>
                    </button>
                    <button
                      onClick={() => setMobileTab('list')}
                      className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl text-xs font-black transition-all active:scale-[0.97] cursor-pointer min-h-[44px] ${
                        mobileTab === 'list'
                          ? 'bg-[#0A2540] text-[#CCFF00] dark:bg-[#006D5B] shadow-md border-2 border-[#006D5B]'
                          : 'text-[#111827] dark:text-slate-100 font-extrabold hover:bg-slate-300/50'
                      }`}
                    >
                      <List className="w-4 h-4 text-[#CCFF00]" />
                      <span>Issue List ({reports.length})</span>
                    </button>
                  </div>

                  {/* Split Screen Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 h-auto md:h-[calc(100vh-180px)] md:min-h-[520px]">
                    {/* Interactive Map Side */}
                    <div
                      className={`md:col-span-7 lg:col-span-8 h-[380px] sm:h-[480px] md:h-full rounded-3xl overflow-hidden shadow-sm border-2 border-slate-300 dark:border-slate-700 ${
                        mobileTab === 'list' ? 'hidden md:block' : 'block'
                      }`}
                    >
                      <CommunityMap
                        reports={reports}
                        selectedReportId={selectedReport?.id}
                        onSelectReport={handleSelectReport}
                        onUpvoteReport={handleUpvoteReport}
                        currentUserName={userProfile?.fullName}
                        currentUserEmail={userProfile?.email}
                        currentUserId={userProfile?.id}
                      />
                    </div>

                    {/* Reported Issues Feed Side */}
                    <div
                      className={`md:col-span-5 lg:col-span-4 h-auto md:h-full overflow-y-auto pr-1 ${
                        mobileTab === 'map' ? 'hidden md:block' : 'block'
                      }`}
                    >
                      <IssueList
                        reports={reports}
                        selectedReportId={selectedReport?.id}
                        onSelectReport={handleSelectReport}
                        onUpvoteReport={handleUpvoteReport}
                        isLoading={isLoading}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: CIVIC BULLETIN & ANNOUNCEMENTS */}
              {activeView === 'bulletin' && <CivicBulletinHub />}

              {/* VIEW 3: AUTOMATED SLA RESOLUTION ENGINE */}
              {activeView === 'sla' && (
                <SlaDashboard reports={reports} onConfirmResolution={handleConfirmResolution} />
              )}

              {/* VIEW 4: COMMUNITY GRATITUDE & WALL OF FAME */}
              {activeView === 'gratitude' && (
                <CommunityGratitudeFeed
                  onSelectReport={(report) => {
                    setSelectedReport(report);
                    setActiveView('map');
                  }}
                  onOpenVerificationModal={(report) => setVerificationReport(report)}
                />
              )}

              {/* VIEW 5: CIVIC PASSPORT & USER PROFILE */}
              {activeView === 'profile' && (
                <UserProfileView
                  onSelectReport={(report) => {
                    setSelectedReport(report);
                    setActiveView('map');
                  }}
                  onProfileUpdate={(updated) => {
                    setUserProfile(updated);
                    setUserKarma(updated.civicKarma);
                    showToast(`Profile updated! Username set to @${updated.username}`);
                  }}
                />
              )}

              {/* VIEW 6: SEPARATE PASSWORD-PROTECTED & SAAS-SUBSCRIBED MUNICIPAL DESK */}
              {activeView === 'admin' && (
                <MunicipalDeskPortal
                  reports={reports}
                  onUpdateStatus={handleUpdateStatus}
                  onSelectReport={handleSelectReport}
                  isAdminMode={isAdminMode}
                  setIsAdminMode={setIsAdminMode}
                />
              )}

              {/* VIEW 7: CIVIC JOURNAL & GUEST BLOGGING HUB */}
              {activeView === 'blog' && (
                <CivicJournalBlog
                  onAwardKarma={(amount, reason) => {
                    setUserKarma((prev) => prev + amount);
                    showToast(`+${amount} Karma Earned! ${reason}`);
                  }}
                />
              )}

              {/* VIEW 8: COMMUNITY EVENTS & LOCAL BUSINESS AD MARKETPLACE */}
              {activeView === 'events' && (
                <CommunityEventsHub
                  onAwardKarma={(amount, reason) => {
                    setUserKarma((prev) => prev + amount);
                    showToast(`+${amount} Karma Earned! ${reason}`);
                  }}
                />
              )}

              {/* VIEW 9: CITY INSIGHTS & ANALYTICS */}
              {activeView === 'analytics' && <AnalyticsView stats={cityStats} reports={reports} />}

              {/* VIEW 10: OFFICIAL BRAND IDENTITY SYSTEM & GUIDELINES */}
              {activeView === 'brand' && <BrandIdentitySystem />}

              {/* VIEW 12: PRIVATE HOUSING SOCIETIES & GATED COMMUNITY HOA PORTAL */}
              {activeView === 'estate' && (
                <EstatePortalView
                  onOpenPublicReportModal={() => setIsReportModalOpen(true)}
                  onSelectReportDetail={(report) => setSelectedReport(report)}
                />
              )}

              {/* VIEW 11: STRATEGIC AI & GOVERNANCE ROADMAP ARCHITECTURE */}
              {activeView === 'strategic' && <StrategicArchitectureView />}
            </motion.div>
          </AnimatePresence>
        </main>

      {/* Multi-Step Issue Reporting Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleSubmitNewReport}
      />

      {/* Individual Report Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <ReportDetailModal
            report={selectedReport}
            comments={comments}
            onClose={() => setSelectedReport(null)}
            onUpvote={handleUpvoteReport}
            onAddComment={handleAddComment}
            isAdminMode={isAdminMode}
            onOpenVerificationModal={(report) => setVerificationReport(report)}
          />
        )}
      </AnimatePresence>

      {/* Community Verification Modal */}
      {verificationReport && (
        <CommunityVerificationModal
          report={verificationReport}
          isOpen={!!verificationReport}
          onClose={() => setVerificationReport(null)}
          onVerificationSuccess={(verification, karmaAwarded) => {
            setUserKarma((prev) => prev + karmaAwarded);
            showToast(`+${karmaAwarded} Civic Karma Earned! Ground Verification Recorded.`);
            setVerificationReport(null);
            fetchReports();
          }}
        />
      )}

      {/* Toast Notification Popup with Spring Entrance */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-4 py-3 rounded-2xl shadow-2xl border-2 border-[#008080] flex items-center space-x-3 text-xs font-bold font-['Montserrat']"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </AccessibilityProvider>
  );
}
