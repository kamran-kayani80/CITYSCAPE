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
import { AccessibilityProvider } from './context/AccessibilityContext';
import { Report, Comment, ReportFilter, CityStats, ReportStatus, IssueVerification, UserProfile } from './types';
import { CheckCircle, AlertCircle, Plus, Sparkles, SlidersHorizontal, Map, List } from 'lucide-react';

export default function App() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [cityStats, setCityStats] = useState<CityStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [activeView, setActiveView] = useState<
    'map' | 'admin' | 'analytics' | 'gratitude' | 'profile' | 'blog' | 'events' | 'bulletin' | 'sla'
  >('map');
  const [mobileTab, setMobileTab] = useState<'map' | 'list'>('map');

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [verificationReport, setVerificationReport] = useState<Report | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userKarma, setUserKarma] = useState(840);

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

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch reports from Express API
  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filter.status && filter.status !== 'ALL') queryParams.append('status', filter.status);
      if (filter.category && filter.category !== 'ALL') queryParams.append('category', filter.category);
      if (filter.severity && filter.severity !== 'ALL') queryParams.append('severity', filter.severity);
      if (filter.searchQuery) queryParams.append('search', filter.searchQuery);
      if (filter.sortBy) queryParams.append('sort', filter.sortBy);

      const res = await fetch(`/api/reports?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch reports');
      const data = await res.json();
      const fetchedReports = data.reports || [];
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
    } catch (err) {
      console.error('Fetch reports error:', err);
    } finally {
      setIsLoading(false);
    }
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

  // Upvote / Endorse issue handler
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

    try {
      const res = await fetch(`/api/reports/${reportId}/upvote`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        showToast(data.userHasUpvoted ? '👍 Issue Endorsed! "I see this too"' : 'Endorsement removed');
      }
    } catch (err) {
      console.error('Upvote failed:', err);
    }
  };

  // Create Report Handler
  const handleSubmitNewReport = async (newReportData: any) => {
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReportData),
      });

      if (!res.ok) throw new Error('Failed to create report');
      const data = await res.json();

      if (data.report) {
        showToast('🎉 Issue Report Submitted Successfully!');
        fetchReports();
        fetchStats();
        // Select newly created report to center map
        setSelectedReport(data.report);
      }
    } catch (err) {
      console.error('Create report failed', err);
      alert('Failed to submit report. Please try again.');
    }
  };

  // Add comment handler
  const handleAddComment = async (reportId: string, content: string, isOfficial: boolean) => {
    try {
      const res = await fetch(`/api/reports/${reportId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: isAdminMode ? 'Municipal Operations' : 'Local Resident',
          userRole: isAdminMode ? 'admin' : 'citizen',
          content,
          isOfficialUpdate: isOfficial || isAdminMode,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [...prev, data.comment]);
        showToast('Comment posted successfully');
      }
    } catch (err) {
      console.error('Add comment failed', err);
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
      <div className="min-h-screen bg-[#e5e3f7] dark:bg-[#121026] text-[#242242] dark:text-[#e5e3f7] flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
        {/* Sticky WCAG AAA Accessibility Toolbar */}
        <AccessibilityToolbar />

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
          {/* Dynamic Citizen Pride Banner */}
          <CitizenPrideBanner />

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
                  <div className="flex md:hidden items-center justify-center p-1 bg-slate-200 dark:bg-slate-800 rounded-xl max-w-xs mx-auto">
                    <button
                      onClick={() => setMobileTab('map')}
                      className={`flex-1 flex items-center justify-center space-x-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all active:scale-[0.97] cursor-pointer ${
                        mobileTab === 'map' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      <Map className="w-3.5 h-3.5" />
                      <span>Map View</span>
                    </button>
                    <button
                      onClick={() => setMobileTab('list')}
                      className={`flex-1 flex items-center justify-center space-x-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all active:scale-[0.97] cursor-pointer ${
                        mobileTab === 'list' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>Issue List ({reports.length})</span>
                    </button>
                  </div>

                  {/* Split Screen Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 h-[calc(100vh-170px)] min-h-[500px]">
                    {/* Interactive Map Side */}
                    <div
                      className={`md:col-span-7 lg:col-span-8 h-full rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 ${
                        mobileTab === 'list' ? 'hidden md:block' : 'block'
                      }`}
                    >
                      <CommunityMap
                        reports={reports}
                        selectedReportId={selectedReport?.id}
                        onSelectReport={handleSelectReport}
                        onUpvoteReport={handleUpvoteReport}
                      />
                    </div>

                    {/* Reported Issues Feed Side */}
                    <div
                      className={`md:col-span-5 lg:col-span-4 h-full overflow-y-auto pr-1 ${
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
      <ReportDetailModal
        report={selectedReport}
        comments={comments}
        onClose={() => setSelectedReport(null)}
        onUpvote={handleUpvoteReport}
        onAddComment={handleAddComment}
        isAdminMode={isAdminMode}
        onOpenVerificationModal={(report) => setVerificationReport(report)}
      />

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
            className="fixed bottom-6 right-6 z-50 bg-[#0A2540] text-white px-4 py-3 rounded-2xl shadow-2xl border border-indigo-500/40 flex items-center space-x-3 text-xs font-bold"
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
