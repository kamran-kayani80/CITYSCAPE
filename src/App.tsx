import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { CommunityMap } from './components/CommunityMap';
import { IssueList } from './components/IssueList';
import { ReportModal } from './components/ReportModal';
import { ReportDetailModal } from './components/ReportDetailModal';
import { HashtagLandingView } from './components/HashtagLandingView';
import { HashtagArchitectureModal } from './components/HashtagArchitectureModal';
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
import { AppDownloadShareModal } from './components/AppDownloadShareModal';
import { BrandIdentitySystem } from './components/BrandIdentitySystem';
import { StrategicArchitectureView } from './components/StrategicArchitectureView';
import { EstatePortalView } from './components/EstatePortalView';
import { CityAttractionsView } from './components/CityAttractionsView';
import { OwnerOversightDashboard } from './components/OwnerOversightDashboard';
import { OwnerPasswordModal } from './components/OwnerPasswordModal';
import { GovernanceLiaisonHub } from './components/GovernanceLiaisonHub';
import { MobileNavigation } from './components/MobileNavigation';
import { SEOHead } from './components/SEOHead';
import { UndoSnackbar, UndoUpvoteState } from './components/UndoSnackbar';
import { AdminControlPanel } from './components/AdminControlPanel';
import { CivicLexiconModal } from './components/CivicLexiconModal';
import { INITIAL_REPORTS } from './data/seedData';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { Report, Comment, ReportFilter, CityStats, ReportStatus, IssueVerification, UserProfile, AppViewMode, UserPersona } from './types';
import { CheckCircle, AlertCircle, Plus, Sparkles, SlidersHorizontal, Map as MapIcon, List } from 'lucide-react';
import { useOfflineSync } from './hooks/useOfflineSync';
import { OfflineSyncBanner } from './components/OfflineSyncBanner';
import { auth, onAuthStateChanged } from './lib/firebase';
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
  const [activeHashtag, setActiveHashtag] = useState<string>('potholefix');
  const [isHashtagArchOpen, setIsHashtagArchOpen] = useState<boolean>(false);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDownloadShareModalOpen, setIsDownloadShareModalOpen] = useState(false);
  const [downloadShareModalTab, setDownloadShareModalTab] = useState<'download' | 'invite' | 'share'>('download');
  const [isCivicLexiconModalOpen, setIsCivicLexiconModalOpen] = useState(false);
  const [verificationReport, setVerificationReport] = useState<Report | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [userPersona, setUserPersona] = useState<UserPersona>('RESIDENT');
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('cityscape_owner_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [isOwnerPasswordModalOpen, setIsOwnerPasswordModalOpen] = useState(false);
  const [isAdminControlPanelOpen, setIsAdminControlPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userKarma, setUserKarma] = useState(840);

  // Global event listener for hashtag navigation & arch modal across all components
  useEffect(() => {
    const handleNavigateHashtag = (e: Event) => {
      const customEv = e as CustomEvent<{ tag: string }>;
      if (customEv.detail?.tag) {
        setActiveHashtag(customEv.detail.tag);
        setActiveView('hashtag');
      }
    };
    const handleOpenArchModal = () => {
      setIsHashtagArchOpen(true);
    };
    const handleOpenAdminCustomizer = () => {
      setIsAdminControlPanelOpen(true);
    };
    const handleOpenReportModal = () => {
      setIsReportModalOpen(true);
    };
    const handleOpenCivicLexicon = () => {
      setIsCivicLexiconModalOpen(true);
    };
    const handleOpenDownloadModal = (e: Event) => {
      const customEv = e as CustomEvent<{ tab?: 'download' | 'invite' | 'share' }>;
      if (customEv.detail?.tab) {
        setDownloadShareModalTab(customEv.detail.tab);
      } else {
        setDownloadShareModalTab('download');
      }
      setIsDownloadShareModalOpen(true);
    };

    window.addEventListener('cityscape:navigate-hashtag', handleNavigateHashtag);
    window.addEventListener('cityscape:open-arch-modal', handleOpenArchModal);
    window.addEventListener('cityscape:open-admin-customizer', handleOpenAdminCustomizer);
    window.addEventListener('cityscape:open-report-modal', handleOpenReportModal);
    window.addEventListener('cityscape:open-civic-lexicon', handleOpenCivicLexicon);
    window.addEventListener('cityscape:open-download-modal', handleOpenDownloadModal);
    return () => {
      window.removeEventListener('cityscape:navigate-hashtag', handleNavigateHashtag);
      window.removeEventListener('cityscape:open-arch-modal', handleOpenArchModal);
      window.removeEventListener('cityscape:open-admin-customizer', handleOpenAdminCustomizer);
      window.removeEventListener('cityscape:open-report-modal', handleOpenReportModal);
      window.removeEventListener('cityscape:open-civic-lexicon', handleOpenCivicLexicon);
      window.removeEventListener('cityscape:open-download-modal', handleOpenDownloadModal);
    };
  }, []);

  // Toast Notification & 5-second Undo Upvote State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [undoUpvoteState, setUndoUpvoteState] = useState<UndoUpvoteState | null>(null);
  const pendingUpvoteRef = useRef<Map<string, { timeout: NodeJS.Timeout; isUpvoted: boolean }>>(new Map());

  // Cleanup pending upvote timers on unmount
  useEffect(() => {
    return () => {
      pendingUpvoteRef.current.forEach((item) => clearTimeout(item.timeout));
    };
  }, []);

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

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        try {
          const res = await fetch('/api/auth/google/connect-demo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              picture: firebaseUser.photoURL || undefined,
              id: firebaseUser.uid,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.profile) {
              setUserProfile(data.profile);
              setUserKarma(data.profile.civicKarma);
            }
          }
        } catch (err) {
          console.warn('Failed to sync auth state to profile:', err);
        }
      }
    });

    return () => unsubscribe();
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

    // Deep link support: auto-select report, bulletin, event, tag, or article if URL parameter or hash is present
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    const deepLinkId = urlParams.get('reportId') || (hash.startsWith('#report-') ? hash.replace('#report-', '') : null);
    const bulletinParam = urlParams.get('bulletinId');
    const eventParam = urlParams.get('eventId');
    const tagParam = urlParams.get('tag');
    const articleParam = urlParams.get('articleId');

    if (deepLinkId) {
      const match = fetchedReports.find((r: Report) => r.id === deepLinkId);
      if (match) {
        handleSelectReport(match);
      }
    } else if (bulletinParam) {
      setActiveView('bulletin');
    } else if (eventParam) {
      setActiveView('events');
    } else if (tagParam) {
      setFilter(tagParam.startsWith('#') ? tagParam : `#${tagParam}`);
      setActiveView('map');
    } else if (articleParam) {
      setActiveView('blog');
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

  // Upvote / Endorse issue handler with 5-second Undo Snackbar and Offline Support
  const handleUpvoteReport = (reportId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Find targeted report
    const targetReport = reports.find((r) => r.id === reportId);
    if (!targetReport) return;

    const newUserHasUpvoted = !targetReport.userHasUpvoted;

    // Optimistic UI update
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const upvotesCount = newUserHasUpvoted ? r.upvotesCount + 1 : Math.max(0, r.upvotesCount - 1);
          return { ...r, userHasUpvoted: newUserHasUpvoted, upvotesCount };
        }
        return r;
      })
    );

    if (selectedReport && selectedReport.id === reportId) {
      const upvotesCount = newUserHasUpvoted ? selectedReport.upvotesCount + 1 : Math.max(0, selectedReport.upvotesCount - 1);
      setSelectedReport({ ...selectedReport, userHasUpvoted: newUserHasUpvoted, upvotesCount });
    }

    // Cancel any existing pending backend sync timer for this specific report
    const existingTimer = pendingUpvoteRef.current.get(reportId);
    if (existingTimer) {
      clearTimeout(existingTimer.timeout);
      pendingUpvoteRef.current.delete(reportId);
    }

    // Backend sync task that runs after 5-second window
    const commitUpvoteToBackend = async () => {
      pendingUpvoteRef.current.delete(reportId);
      setUndoUpvoteState((curr) => (curr?.reportId === reportId ? null : curr));

      if (!offlineSync.isOnline) {
        enqueueOfflineItem('UPVOTE_REPORT', `Endorsement for report #${reportId}`, { reportId });
        showToast('📡 Endorsement Saved Offline (Queued for Auto-Sync)');
        return;
      }

      try {
        const res = await fetch(`/api/reports/${reportId}/upvote`, { method: 'POST' });
        if (res.ok) {
          // Successfully synced to backend
        }
      } catch (err) {
        console.warn('Upvote queued for offline sync:', err);
        enqueueOfflineItem('UPVOTE_REPORT', `Endorsement for report #${reportId}`, { reportId });
        showToast('📡 Endorsement Saved Offline (Queued for Auto-Sync)');
      }
    };

    // Schedule 5-second window
    const timeoutId = setTimeout(commitUpvoteToBackend, 5000);
    pendingUpvoteRef.current.set(reportId, { timeout: timeoutId, isUpvoted: newUserHasUpvoted });

    // Show Undo Snackbar Notification
    setUndoUpvoteState({
      reportId,
      reportTitle: targetReport.title,
      isUpvoted: newUserHasUpvoted,
      expiresAt: Date.now() + 5000,
    });
  };

  // Handle Undo Endorsement Action within 5-second window
  const handleUndoUpvote = () => {
    if (!undoUpvoteState) return;

    const { reportId } = undoUpvoteState;

    // Clear pending backend sync timer
    const pending = pendingUpvoteRef.current.get(reportId);
    if (pending) {
      clearTimeout(pending.timeout);
      pendingUpvoteRef.current.delete(reportId);
    }

    // Revert Optimistic UI State
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const revertedUserHasUpvoted = !r.userHasUpvoted;
          const upvotesCount = revertedUserHasUpvoted ? r.upvotesCount + 1 : Math.max(0, r.upvotesCount - 1);
          return { ...r, userHasUpvoted: revertedUserHasUpvoted, upvotesCount };
        }
        return r;
      })
    );

    if (selectedReport && selectedReport.id === reportId) {
      const revertedUserHasUpvoted = !selectedReport.userHasUpvoted;
      const upvotesCount = revertedUserHasUpvoted ? selectedReport.upvotesCount + 1 : Math.max(0, selectedReport.upvotesCount - 1);
      setSelectedReport({ ...selectedReport, userHasUpvoted: revertedUserHasUpvoted, upvotesCount });
    }

    setUndoUpvoteState(null);
    showToast('↩️ Endorsement reverted');
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
      <SEOHead activeView={activeView} selectedReport={selectedReport} reportsCount={reports.length} />
      <div className="min-h-screen bg-[#F3F0E8] dark:bg-[#0f172a] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col font-['Montserrat'] antialiased selection:bg-[#7CD6B8] selection:text-[#063B2F]">
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
          onOpenDownloadShareModal={(tab) => {
            setDownloadShareModalTab(tab || 'download');
            setIsDownloadShareModalOpen(true);
          }}
          onOpenCivicLexiconModal={() => setIsCivicLexiconModalOpen(true)}
          isAdminMode={isAdminMode}
          setIsAdminMode={setIsAdminMode}
          userPersona={userPersona}
          onUserPersonaChange={(p) => {
            if (p === 'PLATFORM_OWNER' && !isOwnerUnlocked) {
              setIsOwnerPasswordModalOpen(true);
              return;
            }
            setUserPersona(p);
            if (p === 'MUNICIPAL_STAFF' || p === 'PLATFORM_OWNER') {
              setIsAdminMode(true);
            } else {
              setIsAdminMode(false);
            }
          }}
          totalReportsCount={reports.length}
          userKarma={userKarma}
          userProfile={userProfile}
          onUserProfileChange={(updated) => {
            setUserProfile(updated);
            setUserKarma(updated.civicKarma);
          }}
          isOwnerUnlocked={isOwnerUnlocked}
          onRequestOwnerAccess={() => setIsOwnerPasswordModalOpen(true)}
          onLockOwnerAccess={() => {
            setIsOwnerUnlocked(false);
            try { sessionStorage.removeItem('cityscape_owner_unlocked'); } catch {}
            setUserPersona('RESIDENT');
            setIsAdminMode(false);
            setActiveView('map');
            showToast('Platform Owner Terminal Locked.');
          }}
        />

        {/* Main View Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 pb-28 lg:pb-8 space-y-6">
          {/* Dynamic Citizen Pride Banner - Only on Home Screen */}
          {activeView === 'map' && (
            <CitizenPrideBanner onOpenReportModal={() => setIsReportModalOpen(true)} />
          )}

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
                  {/* Split Screen Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 h-auto md:h-[calc(100vh-180px)] md:min-h-[520px]">
                    {/* Interactive Map Side */}
                    <div className="md:col-span-7 lg:col-span-8 h-[320px] sm:h-[420px] md:h-full rounded-3xl overflow-hidden shadow-sm border-2 border-slate-300 dark:border-slate-700">
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
                    <div className="md:col-span-5 lg:col-span-4 h-auto md:h-full overflow-y-auto pr-1">
                      <IssueList
                        reports={reports}
                        selectedReportId={selectedReport?.id}
                        onSelectReport={handleSelectReport}
                        onUpvoteReport={handleUpvoteReport}
                        isLoading={isLoading}
                        filter={filter}
                        setFilter={setFilter}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: CIVIC BULLETIN & ANNOUNCEMENTS */}
              {activeView === 'bulletin' && <CivicBulletinHub />}

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

              {/* VIEW 6: UNIFIED MUNICIPAL OPERATIONS & GOV DESK (Work Orders, SLAs, Analytics, Strategic AI, Gated Oversight) */}
              {(activeView === 'admin' || activeView === 'sla' || activeView === 'analytics' || activeView === 'strategic') && (
                <MunicipalDeskPortal
                  reports={reports}
                  stats={cityStats}
                  onUpdateStatus={handleUpdateStatus}
                  onSelectReport={handleSelectReport}
                  onConfirmResolution={handleConfirmResolution}
                  isAdminMode={isAdminMode}
                  setIsAdminMode={setIsAdminMode}
                  initialSubTab={
                    activeView === 'sla'
                      ? 'sla'
                      : activeView === 'analytics'
                      ? 'analytics'
                      : activeView === 'strategic'
                      ? 'strategic'
                      : 'board'
                  }
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

              {/* VIEW 9: CITY TOURIST ATTRACTIONS, HERITAGE & PICTORIAL LIBRARY */}
              {activeView === 'attractions' && (
                <CityAttractionsView
                  initialCityName="Rawalpindi"
                  onAwardKarma={(amount, reason) => {
                    setUserKarma((prev) => prev + amount);
                    showToast(`+${amount} Karma Earned! ${reason}`);
                  }}
                  onNavigateToMap={() => setActiveView('map')}
                />
              )}

              {/* VIEW 10: OFFICIAL BRAND IDENTITY SYSTEM & GUIDELINES */}
              {activeView === 'brand' && <BrandIdentitySystem />}

              {/* VIEW 12: PRIVATE HOUSING SOCIETIES & GATED COMMUNITY HOA PORTAL */}
              {activeView === 'estate' && (
                <EstatePortalView
                  onOpenPublicReportModal={() => setIsReportModalOpen(true)}
                  onSelectReportDetail={(report) => setSelectedReport(report)}
                />
              )}

              {/* VIEW 14: PLATFORM OWNER OVERSIGHT DASHBOARD (Global SaaS MRR & 80+ Subscribed Cities) */}
              {activeView === 'owner_oversight' && (
                <OwnerOversightDashboard
                  isOwnerUnlocked={isOwnerUnlocked}
                  onRequestOwnerAccess={() => setIsOwnerPasswordModalOpen(true)}
                  onLockOwnerAccess={() => {
                    setIsOwnerUnlocked(false);
                    try { sessionStorage.removeItem('cityscape_owner_unlocked'); } catch {}
                    setUserPersona('RESIDENT');
                    setIsAdminMode(false);
                    setActiveView('map');
                    showToast('Platform Owner Terminal Locked.');
                  }}
                  onNavigateToGovDesk={() => {
                    setUserPersona('MUNICIPAL_STAFF');
                    setIsAdminMode(true);
                    setActiveView('admin');
                  }}
                  onNavigateToHoaPortal={() => {
                    setUserPersona('HOA_ADMIN');
                    setIsAdminMode(false);
                    setActiveView('estate');
                  }}
                />
              )}

              {/* VIEW 15: HOA ⇄ MUNICIPAL GOVERNANCE LIAISON HUB */}
              {activeView === 'hoa_liaison' && (
                <div className="bg-white dark:bg-[#0A2540] rounded-3xl border-2 border-slate-300 dark:border-slate-700 p-4 sm:p-6 shadow-sm">
                  <GovernanceLiaisonHub
                    currentPersona={userPersona === 'MUNICIPAL_STAFF' ? 'MUNICIPAL_STAFF' : 'HOA_ADMIN'}
                    onOpenReportModal={() => setIsReportModalOpen(true)}
                    onSelectReportDetail={(report) => setSelectedReport(report)}
                  />
                </div>
              )}

              {/* VIEW 13: HASHTAG LANDING & VELOCITY FEED */}
              {activeView === 'hashtag' && (
                <HashtagLandingView
                  tag={activeHashtag}
                  reports={reports}
                  onBack={() => setActiveView('map')}
                  onSelectReport={handleSelectReport}
                  onUpvoteReport={handleUpvoteReport}
                  onOpenReportModalWithTag={(tag) => setIsReportModalOpen(true)}
                  onHashtagClick={(tag) => {
                    setActiveHashtag(tag);
                    setActiveView('hashtag');
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

      {/* SQL & Velocity Algorithm Architecture Modal */}
      <HashtagArchitectureModal
        isOpen={isHashtagArchOpen}
        onClose={() => setIsHashtagArchOpen(false)}
      />

      {/* Multi-Step Issue Reporting Modal (With Dynamic HOA / General Scope Preselection) */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleSubmitNewReport}
        initialScope={userPersona === 'HOA_ADMIN' ? 'HOA_INTERNAL' : 'GENERAL_PUBLIC'}
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

      {/* Undo Upvote 5-Second Window Snackbar Notification */}
      <UndoSnackbar
        undoState={undoUpvoteState}
        onUndo={handleUndoUpvote}
        onDismiss={() => setUndoUpvoteState(null)}
      />

      {/* Website Administrator Global Theme & CSS Control Panel */}
      <AdminControlPanel
        isOpen={isAdminControlPanelOpen}
        onClose={() => setIsAdminControlPanelOpen(false)}
        userRole={isAdminMode ? 'admin' : 'citizen'}
        isWebsiteAdmin={isAdminMode}
      />

      {/* Mobile Fixed Dock Navigation & Sheet Menu */}
      <MobileNavigation
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenDownloadShareModal={(tab) => {
          setDownloadShareModalTab(tab || 'download');
          setIsDownloadShareModalOpen(true);
        }}
        totalReportsCount={reports.length}
        userKarma={userKarma}
        isAdminMode={isAdminMode}
        filter={filter}
        setFilter={setFilter}
        isOwnerUnlocked={isOwnerUnlocked}
        onRequestOwnerAccess={() => setIsOwnerPasswordModalOpen(true)}
      />

      {/* Platform Owner Oversight Master Authentication Gate Modal */}
      <OwnerPasswordModal
        isOpen={isOwnerPasswordModalOpen}
        onClose={() => setIsOwnerPasswordModalOpen(false)}
        onSuccess={() => {
          setIsOwnerUnlocked(true);
          try { sessionStorage.setItem('cityscape_owner_unlocked', 'true'); } catch {}
          setUserPersona('PLATFORM_OWNER');
          setIsAdminMode(true);
          setActiveView('owner_oversight');
          setIsOwnerPasswordModalOpen(false);
          showToast('Master Passcode Verified: Platform Owner Terminal Unlocked.');
        }}
      />

      {/* App Download, PWA Installation & Neighbor Trial Invitation Modal */}
      <AppDownloadShareModal
        isOpen={isDownloadShareModalOpen}
        onClose={() => setIsDownloadShareModalOpen(false)}
        initialTab={downloadShareModalTab}
        userKarma={userKarma}
        onKarmaReward={(bonus) => {
          setUserKarma((prev) => prev + bonus);
          showToast(`+${bonus} Civic Karma Earned! Trial Invitation Sent.`);
        }}
      />

      {/* Civic Lexicon 3.0 International Urbanist Jargon & Plain Language Glossary Modal */}
      <CivicLexiconModal
        isOpen={isCivicLexiconModalOpen}
        onClose={() => setIsCivicLexiconModalOpen(false)}
      />

      {/* Toast Notification Popup with Spring Entrance */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-[#1A1A1A] text-white px-4 py-3 rounded-2xl shadow-2xl border-2 border-[#008080] flex items-center space-x-3 text-xs font-bold font-['Montserrat']"
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
