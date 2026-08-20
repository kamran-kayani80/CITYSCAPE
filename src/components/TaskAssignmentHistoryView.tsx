import React, { useState, useEffect, useMemo } from 'react';
import {
  History,
  ShieldCheck,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  Download,
  Calendar,
  Building2,
  Briefcase,
  Layers,
  Sparkles,
  FileText,
  Send,
  MapPin,
  RefreshCw,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sliders,
  Check,
  PlusCircle,
  Eye,
  AlertTriangle,
  BadgeAlert,
  ArrowUpRight,
  Printer,
  Smartphone,
  Phone,
} from 'lucide-react';
import {
  TaskAssignment,
  TaskAssignmentStatus,
  TaskAssignmentAuditEntry,
  Report,
  MunicipalStaffMember,
} from '../types';

interface TaskAssignmentHistoryViewProps {
  reports?: Report[];
  onSelectReport?: (report: Report) => void;
  onRefreshReports?: () => void;
  activeCity?: string;
}

const SUPPORTED_CITIES = [
  'Rawalpindi',
  'Islamabad',
  'Lahore',
  'Karachi',
  'San Francisco',
];

const STATUS_CONFIG: Record<
  TaskAssignmentStatus,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  ASSIGNED: {
    label: 'Assigned / Queued',
    bg: 'bg-blue-50 dark:bg-blue-950/60',
    text: 'text-blue-800 dark:text-blue-200',
    border: 'border-blue-300 dark:border-blue-700',
    icon: Clock,
  },
  ACKNOWLEDGED: {
    label: 'Acknowledged',
    bg: 'bg-indigo-50 dark:bg-indigo-950/60',
    text: 'text-indigo-800 dark:text-indigo-200',
    border: 'border-indigo-300 dark:border-indigo-700',
    icon: CheckCircle2,
  },
  EN_ROUTE: {
    label: 'Crew En Route',
    bg: 'bg-amber-50 dark:bg-amber-950/60',
    text: 'text-amber-900 dark:text-amber-200',
    border: 'border-amber-300 dark:border-amber-700',
    icon: Sparkles,
  },
  ON_SITE: {
    label: 'Arrived On Site',
    bg: 'bg-purple-50 dark:bg-purple-950/60',
    text: 'text-purple-800 dark:text-purple-200',
    border: 'border-purple-300 dark:border-purple-700',
    icon: MapPin,
  },
  IN_PROGRESS: {
    label: 'Work In Progress',
    bg: 'bg-teal-50 dark:bg-teal-950/60',
    text: 'text-teal-900 dark:text-teal-200',
    border: 'border-teal-300 dark:border-teal-700',
    icon: Briefcase,
  },
  RESOLVED: {
    label: 'Resolved & Signed-Off',
    bg: 'bg-emerald-50 dark:bg-emerald-950/60',
    text: 'text-emerald-900 dark:text-emerald-200',
    border: 'border-emerald-300 dark:border-emerald-700',
    icon: ShieldCheck,
  },
  REASSIGNED: {
    label: 'Reassigned',
    bg: 'bg-orange-50 dark:bg-orange-950/60',
    text: 'text-orange-900 dark:text-orange-200',
    border: 'border-orange-300 dark:border-orange-700',
    icon: RefreshCw,
  },
  ESCALATED: {
    label: 'Escalated to Chief',
    bg: 'bg-red-50 dark:bg-red-950/60',
    text: 'text-red-900 dark:text-red-200',
    border: 'border-red-300 dark:border-red-700',
    icon: AlertTriangle,
  },
};

export const TaskAssignmentHistoryView: React.FC<TaskAssignmentHistoryViewProps> = ({
  reports = [],
  onSelectReport,
  onRefreshReports,
  activeCity: initialCity,
}) => {
  // Active city selection
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    if (initialCity) return initialCity;
    const saved = localStorage.getItem('cityscape_user_city');
    return saved || 'Rawalpindi';
  });

  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [staffList, setStaffList] = useState<MunicipalStaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedExecutiveFilter, setSelectedExecutiveFilter] = useState<string>('ALL');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('ALL');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');
  const [expandedAssignmentIds, setExpandedAssignmentIds] = useState<Set<string>>(new Set());

  // Modal for logging an audit status update
  const [selectedAssignmentForUpdate, setSelectedAssignmentForUpdate] = useState<TaskAssignment | null>(null);
  const [updateStatus, setUpdateStatus] = useState<TaskAssignmentStatus>('IN_PROGRESS');
  const [updateNote, setUpdateNote] = useState('');
  const [updaterName, setUpdaterName] = useState('Mr. Kamran (Chief Municipal Executive)');
  const [updaterRole, setUpdaterRole] = useState<'EXECUTIVE' | 'FIELD_OFFICER' | 'ADMIN'>('EXECUTIVE');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);
  const [statusFeedbackMsg, setStatusFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal for creating a new task assignment dispatch
  const [isNewDispatchModalOpen, setIsNewDispatchModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedReportId, setSelectedReportId] = useState('');
  const [dispatchExecutiveName, setDispatchExecutiveName] = useState('Mr. Kamran (Chief Municipal Executive)');
  const [dispatchDirective, setDispatchDirective] = useState('');
  const [dispatchPriority, setDispatchPriority] = useState<'CRITICAL' | 'HIGH' | 'STANDARD'>('CRITICAL');
  const [dispatchSlaHours, setDispatchSlaHours] = useState(24);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchFeedback, setDispatchFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch Assignments and Staff
  const fetchAuditData = async () => {
    setIsLoading(true);
    try {
      const cityQueryParam = selectedCity !== 'ALL' ? `?city=${encodeURIComponent(selectedCity)}` : '';
      const [asgnRes, staffRes] = await Promise.all([
        fetch(`/api/municipal/assignments${cityQueryParam}`),
        fetch(`/api/municipal/staff${cityQueryParam}`),
      ]);

      if (asgnRes.ok) {
        const data = await asgnRes.json();
        if (Array.isArray(data.assignments)) {
          setAssignments(data.assignments);
          // Expand the first 2 by default
          if (data.assignments.length > 0) {
            setExpandedAssignmentIds(new Set(data.assignments.slice(0, 2).map((a: TaskAssignment) => a.id)));
          }
        }
      }

      if (staffRes.ok) {
        const data = await staffRes.json();
        if (Array.isArray(data.staff)) {
          setStaffList(data.staff);
        }
      }
    } catch (err) {
      console.error('Failed fetching task assignment history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, [selectedCity]);

  // Sync external city changes
  useEffect(() => {
    const handleCityChange = (e: Event) => {
      const customEv = e as CustomEvent<{ cityName?: string }>;
      if (customEv.detail?.cityName) {
        setSelectedCity(customEv.detail.cityName);
      }
    };
    window.addEventListener('cityscape:city-changed', handleCityChange);
    return () => window.removeEventListener('cityscape:city-changed', handleCityChange);
  }, []);

  // Filtered Assignments List
  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      // City check
      if (selectedCity !== 'ALL' && item.cityName) {
        if (!item.cityName.toLowerCase().includes(selectedCity.toLowerCase())) {
          return false;
        }
      }
      // Status check
      if (selectedStatusFilter !== 'ALL' && item.status !== selectedStatusFilter) {
        return false;
      }
      // Priority check
      if (selectedPriorityFilter !== 'ALL' && item.priority !== selectedPriorityFilter) {
        return false;
      }
      // Executive check
      if (selectedExecutiveFilter !== 'ALL') {
        if (
          !item.assignedByExecutiveName.toLowerCase().includes(selectedExecutiveFilter.toLowerCase()) &&
          item.assignedByExecutiveId !== selectedExecutiveFilter
        ) {
          return false;
        }
      }
      // Department check
      if (selectedDeptFilter !== 'ALL') {
        if (!item.department.toLowerCase().includes(selectedDeptFilter.toLowerCase())) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.reportTitle?.toLowerCase().includes(q) || false;
        const matchId = item.reportId?.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
        const matchExecutive = item.assignedByExecutiveName.toLowerCase().includes(q);
        const matchStaff = item.assignedStaffName.toLowerCase().includes(q);
        const matchBadge = item.assignedStaffBadge.toLowerCase().includes(q);
        const matchDirective = item.directive.toLowerCase().includes(q);
        const matchCity = item.cityName?.toLowerCase().includes(q) || false;
        const matchAuditNote = item.auditHistory?.some((a) => a.note?.toLowerCase().includes(q)) || false;

        if (
          !matchTitle &&
          !matchId &&
          !matchExecutive &&
          !matchStaff &&
          !matchBadge &&
          !matchDirective &&
          !matchCity &&
          !matchAuditNote
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    assignments,
    selectedCity,
    selectedStatusFilter,
    selectedPriorityFilter,
    selectedExecutiveFilter,
    selectedDeptFilter,
    searchQuery,
  ]);

  // Unique list of Executives for filter dropdown
  const executivesList = useMemo(() => {
    const map = new Map<string, string>();
    assignments.forEach((a) => {
      if (a.assignedByExecutiveName) {
        map.set(a.assignedByExecutiveName, a.assignedByExecutiveName);
      }
    });
    return Array.from(map.values());
  }, [assignments]);

  // Metrics Calculations
  const stats = useMemo(() => {
    const total = filteredAssignments.length;
    const active = filteredAssignments.filter((a) => a.status !== 'RESOLVED').length;
    const resolved = filteredAssignments.filter((a) => a.status === 'RESOLVED').length;
    const critical = filteredAssignments.filter((a) => a.priority === 'CRITICAL').length;
    const onTimeCompliance = total > 0 ? Math.round((resolved / (total || 1)) * 100) : 100;

    return { total, active, resolved, critical, onTimeCompliance };
  }, [filteredAssignments]);

  const toggleExpand = (id: string) => {
    setExpandedAssignmentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Submit Status Audit Update
  const handleStatusUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentForUpdate) return;

    setIsSubmittingStatus(true);
    setStatusFeedbackMsg(null);

    try {
      const res = await fetch(`/api/municipal/assignments/${selectedAssignmentForUpdate.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newStatus: updateStatus,
          note: updateNote,
          updatedByName: updaterName,
          updatedByRole: updaterRole,
          resolutionNotes: updateStatus === 'RESOLVED' ? resolutionNotes || updateNote : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to record audit status update');
      }

      setStatusFeedbackMsg({
        type: 'success',
        text: `Audit log updated successfully! Status is now ${updateStatus}.`,
      });

      // Refresh list
      await fetchAuditData();
      if (onRefreshReports) onRefreshReports();

      setTimeout(() => {
        setSelectedAssignmentForUpdate(null);
        setStatusFeedbackMsg(null);
        setUpdateNote('');
        setResolutionNotes('');
      }, 1200);
    } catch (err: any) {
      setStatusFeedbackMsg({
        type: 'error',
        text: err.message || 'Failed to update assignment status.',
      });
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  // Dispatch New Assignment
  const handleNewDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReportId || !selectedStaffId) {
      setDispatchFeedback({
        type: 'error',
        text: 'Please select both an open report and a registered staff specialist.',
      });
      return;
    }

    setIsDispatching(true);
    setDispatchFeedback(null);

    try {
      const staffMember = staffList.find((s) => s.id === selectedStaffId);
      const res = await fetch(`/api/reports/${selectedReportId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignedStaffId: selectedStaffId,
          assignedStaffName: staffMember?.name || 'Assigned Staff',
          assignedByExecutiveId: 'staff-kamran-exec',
          assignedByExecutiveName: dispatchExecutiveName,
          directive: dispatchDirective,
          priority: dispatchPriority,
          slaHours: dispatchSlaHours,
          department: staffMember?.department || 'Department of Public Works (DPW)',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to dispatch assignment');
      }

      setDispatchFeedback({
        type: 'success',
        text: `Official assignment audit record created for ${staffMember?.name}! Citizen notified.`,
      });

      await fetchAuditData();
      if (onRefreshReports) onRefreshReports();

      setTimeout(() => {
        setIsNewDispatchModalOpen(false);
        setDispatchFeedback(null);
        setSelectedReportId('');
        setSelectedStaffId('');
        setDispatchDirective('');
      }, 1200);
    } catch (err: any) {
      setDispatchFeedback({
        type: 'error',
        text: err.message || 'Failed to dispatch task assignment.',
      });
    } finally {
      setIsDispatching(false);
    }
  };

  // Export to CSV Function
  const exportToCSV = () => {
    if (filteredAssignments.length === 0) return;

    const headers = [
      'Audit ID',
      'Report ID',
      'Report Title',
      'City',
      'Assigned Executive (Dispatcher)',
      'Assigned Staff Specialist (Dispatchee)',
      'Staff Badge ID',
      'Staff Phone',
      'Assignment Timestamp (UTC)',
      'Priority Level',
      'Department',
      'Current Status',
      'SLA Target (Hours)',
      'SLA Due Date',
      'Citizen Notified',
      'Executive Directive',
      'Audit Updates Count',
      'Last Audit Note',
    ];

    const rows = filteredAssignments.map((a) => {
      const latestAudit = a.auditHistory && a.auditHistory.length > 0 ? a.auditHistory[a.auditHistory.length - 1] : null;
      return [
        `"${a.id}"`,
        `"${a.reportId}"`,
        `"${(a.reportTitle || '').replace(/"/g, '""')}"`,
        `"${a.cityName || ''}"`,
        `"${(a.assignedByExecutiveName || '').replace(/"/g, '""')}"`,
        `"${(a.assignedStaffName || '').replace(/"/g, '""')}"`,
        `"${a.assignedStaffBadge || ''}"`,
        `"${a.assignedStaffPhone || ''}"`,
        `"${a.assignedAt}"`,
        `"${a.priority}"`,
        `"${(a.department || '').replace(/"/g, '""')}"`,
        `"${a.status}"`,
        `"${a.slaTargetHours || 24}"`,
        `"${a.slaDueDate || ''}"`,
        `"${a.citizenNotificationSent ? 'YES' : 'NO'}"`,
        `"${(a.directive || '').replace(/"/g, '""')}"`,
        `"${a.auditHistory ? a.auditHistory.length : 1}"`,
        `"${latestAudit ? (latestAudit.note || '').replace(/"/g, '""') : ''}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Cityscape_Task_Assignment_Audit_Log_${selectedCity}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const exportToJSON = () => {
    if (filteredAssignments.length === 0) return;
    const jsonStr = JSON.stringify(filteredAssignments, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cityscape_Task_Assignment_Audit_Log_${selectedCity}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. Header Banner & Identity */}
      <div className="bg-gradient-to-br from-[#0A2540] via-[#0F365E] to-[#0A2540] rounded-2xl p-6 sm:p-8 text-white border-1.5 border-[#0A2540] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#006D5B]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>OFFICIAL AUDIT LEDGER</span>
              </span>
              <span className="px-3 py-1 bg-teal-500/20 text-teal-200 border border-teal-400/30 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                <span>TASK ASSIGNMENT HISTORY</span>
              </span>
              <span className="px-3 py-1 bg-slate-800 text-slate-200 text-xs font-mono font-bold rounded-lg">
                JURISDICTION: {selectedCity.toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Municipal Executive Task Assignment Audit Log
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Complete, immutable chain of custody recording which municipal executive authorized and dispatched
              registered specialists to each citizen report, including timestamps, SLA commitments, and real-time field status updates.
            </p>
          </div>

          {/* Action Tools: Export, Print, Quick Dispatch */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsNewDispatchModalOpen(true)}
              className="px-4 py-3 bg-[#B45309] hover:bg-amber-600 text-white rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer min-h-[48px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Dispatch New Task</span>
            </button>

            <button
              onClick={exportToCSV}
              title="Download detailed audit history in CSV format for municipal record keeping"
              className="px-3.5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all border border-white/20 flex items-center gap-2 cursor-pointer min-h-[48px]"
            >
              <Download className="w-4 h-4 text-teal-300" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={exportToJSON}
              title="Export structured JSON audit ledger"
              className="px-3.5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all border border-white/20 flex items-center gap-2 cursor-pointer min-h-[48px]"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>JSON</span>
            </button>

            <button
              onClick={() => window.print()}
              title="Print Audit Report"
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all border border-white/20 flex items-center justify-center cursor-pointer min-h-[48px] min-w-[48px]"
            >
              <Printer className="w-4 h-4 text-slate-200" />
            </button>
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-700/60 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 mr-2 flex items-center gap-1 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Subscribed City:</span>
          </span>
          <button
            onClick={() => setSelectedCity('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCity === 'ALL'
                ? 'bg-white text-[#0A2540] shadow-md font-bold'
                : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            All Cities
          </button>
          {SUPPORTED_CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                selectedCity === c
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              <span>{c}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Key Metrics & Audit Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-[#071B2F] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Total Dispatches Logged
            </span>
            <History className="w-4 h-4 text-[#0A2540] dark:text-teal-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#0A2540] dark:text-white font-mono">
            {stats.total}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Recorded in official audit log
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-[#071B2F] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Active In Field
            </span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 font-mono">
            {stats.active}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            En route, on-site, or in-repair
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-[#071B2F] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006D5B] dark:text-teal-400">
              Signed-Off &amp; Resolved
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#006D5B] dark:text-teal-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#006D5B] dark:text-teal-400 font-mono">
            {stats.resolved}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Verified completed remediation
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-[#071B2F] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
              Critical Priority
            </span>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 font-mono">
            {stats.critical}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Emergency infrastructure alerts
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-[#071B2F] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-1.5 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A2540] dark:text-teal-400">
              SLA Compliance
            </span>
            <ShieldCheck className="w-4 h-4 text-[#006D5B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#0A2540] dark:text-teal-300 font-mono">
            {stats.onTimeCompliance}%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Resolved within target SLA
          </p>
        </div>
      </div>

      {/* 3. Search & Multi-Filter Control Bar */}
      <div className="p-4 sm:p-5 bg-white dark:bg-[#071B2F] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Report title, Report ID, Executive name, Specialist name, Badge, Directive..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0A2540] dark:focus:border-teal-400 min-h-[48px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Mode Toggle: Timeline vs Table */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mr-1">
              View:
            </span>
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center border border-[#CBD5E1] dark:border-slate-700">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'timeline'
                    ? 'bg-white dark:bg-[#0A2540] text-[#0A2540] dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <History className="w-3.5 h-3.5 text-amber-500" />
                <span>Timeline Log</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-[#0A2540] text-[#0A2540] dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-teal-500" />
                <span>Audit Table</span>
              </button>
            </div>

            <button
              onClick={fetchAuditData}
              title="Refresh Audit History"
              className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-300 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center border border-[#CBD5E1] dark:border-slate-700"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Detailed Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-[#CBD5E1] dark:border-slate-700/80">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Assignment Status
            </label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none min-h-[40px]"
            >
              <option value="ALL">All Statuses ({assignments.length})</option>
              <option value="ASSIGNED">Queued / Assigned</option>
              <option value="ACKNOWLEDGED">Acknowledged</option>
              <option value="EN_ROUTE">En Route</option>
              <option value="ON_SITE">Arrived On Site</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved & Signed Off</option>
              <option value="ESCALATED">Escalated</option>
            </select>
          </div>

          {/* Executive (Dispatcher) Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Authorizing Executive
            </label>
            <select
              value={selectedExecutiveFilter}
              onChange={(e) => setSelectedExecutiveFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none min-h-[40px]"
            >
              <option value="ALL">All Authorizing Executives</option>
              {executivesList.map((exec) => (
                <option key={exec} value={exec}>
                  {exec}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Priority Level
            </label>
            <select
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none min-h-[40px]"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">🔴 Critical Priority</option>
              <option value="HIGH">🟠 High Priority</option>
              <option value="STANDARD">🔵 Standard Priority</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none min-h-[40px]"
            >
              <option value="ALL">All Departments</option>
              <option value="Public Works">Public Works &amp; Infrastructure (DPW)</option>
              <option value="Water & Sanitation">Water &amp; Sanitation (WASA)</option>
              <option value="Lighting">Public Lighting &amp; Signals</option>
              <option value="Transit">Traffic &amp; Transit Bureau</option>
              <option value="Rescue">Emergency &amp; Rescue (1122)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Main Content: Timeline View OR Table View */}
      {isLoading ? (
        <div className="p-12 text-center bg-white dark:bg-[#071B2F] rounded-2xl border-1.5 border-[#CBD5E1] dark:border-slate-700 space-y-3">
          <RefreshCw className="w-8 h-8 text-[#006D5B] animate-spin mx-auto" />
          <p className="text-base font-bold text-slate-800 dark:text-white">
            Loading Municipal Task Assignment Audit Log...
          </p>
          <p className="text-xs text-slate-500">Querying immutable state from municipal server...</p>
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#071B2F] rounded-2xl border-1.5 border-[#CBD5E1] dark:border-slate-700 space-y-4">
          <History className="w-12 h-12 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              No Task Assignment Records Found
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              No task assignments matched your filter criteria for {selectedCity}. You can adjust your filters or dispatch a new task assignment.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStatusFilter('ALL');
              setSelectedExecutiveFilter('ALL');
              setSelectedPriorityFilter('ALL');
              setSelectedDeptFilter('ALL');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'timeline' ? (
        /* TIMELINE VIEW */
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => {
            const isExpanded = expandedAssignmentIds.has(assignment.id);
            const statusMeta = STATUS_CONFIG[assignment.status] || STATUS_CONFIG.ASSIGNED;
            const StatusIcon = statusMeta.icon;

            const timeAgo = Math.round(
              (Date.now() - new Date(assignment.assignedAt).getTime()) / (1000 * 60 * 60)
            );
            const timeAgoText =
              timeAgo <= 0
                ? 'Just now'
                : timeAgo === 1
                ? '1 hour ago'
                : `${timeAgo} hours ago`;

            return (
              <div
                key={assignment.id}
                className="bg-white dark:bg-[#071B2F] rounded-2xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Assignment Main Header */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 bg-slate-900 text-white dark:bg-slate-800 text-xs font-mono font-bold rounded-md">
                        {assignment.id}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{statusMeta.label}</span>
                      </span>

                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                          assignment.priority === 'CRITICAL'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-200 border border-red-300'
                            : assignment.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border border-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-200 border border-blue-300'
                        }`}
                      >
                        {assignment.priority} PRIORITY
                      </span>

                      {assignment.cityName && (
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-md flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#006D5B]" />
                          <span>{assignment.cityName}</span>
                        </span>
                      )}

                      {assignment.citizenNotificationSent && (
                        <span className="px-2.5 py-1 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 border border-teal-300 text-xs font-semibold rounded-md flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-[#006D5B]" />
                          <span>Citizen Notified</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-start lg:self-auto text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Assigned: {new Date(assignment.assignedAt).toLocaleString()} ({timeAgoText})</span>
                    </div>
                  </div>

                  {/* Report Title & Direct Link */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-lg sm:text-xl font-bold text-[#0A2540] dark:text-white flex items-center gap-2">
                        <span>{assignment.reportTitle || `Report #${assignment.reportId}`}</span>
                      </h2>

                      {onSelectReport && (
                        <button
                          onClick={() => {
                            const rep = reports.find((r) => r.id === assignment.reportId);
                            if (rep) onSelectReport(rep);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-[#006D5B] hover:text-teal-700 dark:text-teal-300 flex items-center gap-1 hover:underline shrink-0"
                        >
                          <span>View Ticket #{assignment.reportId}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {assignment.reportAddress && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{assignment.reportAddress}</span>
                      </p>
                    )}
                  </div>

                  {/* Executive (Dispatcher) vs Specialist (Dispatchee) Pair Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-[#CBD5E1] dark:border-slate-700">
                    {/* Dispatcher (Municipal Executive) */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0A2540] text-amber-400 flex items-center justify-center font-bold text-sm shrink-0 border-2 border-amber-400/40">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded">
                          AUTHORIZING EXECUTIVE (DISPATCHER)
                        </span>
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {assignment.assignedByExecutiveName}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {assignment.dispatcherRole || 'Chief Municipal Executive & Zonal Administrator'}
                        </p>
                      </div>
                    </div>

                    {/* Dispatchee (Registered Staff Specialist) */}
                    <div className="flex items-start gap-3 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-[#CBD5E1] dark:border-slate-700 md:pl-3">
                      {assignment.assignedStaffAvatar ? (
                        <img
                          src={assignment.assignedStaffAvatar}
                          alt={assignment.assignedStaffName}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-[#006D5B]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#006D5B] text-white flex items-center justify-center font-bold text-sm shrink-0">
                          <UserCheck className="w-5 h-5" />
                        </div>
                      )}
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-200 bg-teal-100 dark:bg-teal-950/80 px-2 py-0.5 rounded">
                          ASSIGNED SPECIALIST (DISPATCHEE)
                        </span>
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {assignment.assignedStaffName}{' '}
                          <span className="text-xs font-mono text-slate-500 font-normal">
                            ({assignment.assignedStaffBadge})
                          </span>
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 flex-wrap">
                          <span>{assignment.department}</span>
                          {assignment.assignedStaffPhone && (
                            <span className="flex items-center gap-0.5 text-slate-500 font-mono">
                              <Phone className="w-3 h-3" />
                              <span>{assignment.assignedStaffPhone}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Directive Box */}
                  <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/60 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      <span>Executive Directive &amp; Work Order Instructions:</span>
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic leading-relaxed">
                      "{assignment.directive}"
                    </p>
                  </div>

                  {/* SLA & Actions Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 flex-wrap">
                      <span className="font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#006D5B]" />
                        <span>SLA Target: {assignment.slaTargetHours || 24} Hours</span>
                      </span>
                      {assignment.slaDueDate && (
                        <span>
                          • Due: {new Date(assignment.slaDueDate).toLocaleDateString()}{' '}
                          {new Date(assignment.slaDueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                      {assignment.lastUpdatedAt && (
                        <span className="text-slate-500">
                          • Last activity: {new Date(assignment.lastUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedAssignmentForUpdate(assignment);
                          setUpdateStatus(assignment.status);
                          setUpdateNote('');
                        }}
                        className="px-3.5 py-2 bg-[#006D5B] hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer min-h-[40px]"
                      >
                        <Sliders className="w-3.5 h-3.5 text-amber-300" />
                        <span>Log Status Update</span>
                      </button>

                      <button
                        onClick={() => toggleExpand(assignment.id)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all border border-[#CBD5E1] dark:border-slate-700 flex items-center gap-1.5 cursor-pointer min-h-[40px]"
                      >
                        <span>
                          Audit Trail ({assignment.auditHistory ? assignment.auditHistory.length : 1})
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* EXPANDABLE AUDIT TRAIL LOG */}
                {isExpanded && (
                  <div className="bg-slate-50 dark:bg-[#051322] p-5 sm:p-6 border-t-1.5 border-[#CBD5E1] dark:border-slate-700 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A2540] dark:text-teal-400 flex items-center gap-1.5">
                        <History className="w-4 h-4 text-amber-500" />
                        <span>Detailed Chronological Audit Trail &amp; Field Telemetry</span>
                      </h4>
                      <span className="text-xs text-slate-500 font-mono">
                        Audited by Cityscape Enterprise Core
                      </span>
                    </div>

                    {assignment.auditHistory && assignment.auditHistory.length > 0 ? (
                      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#CBD5E1] dark:before:bg-slate-700">
                        {assignment.auditHistory.map((entry, idx) => {
                          const entryStatusMeta = STATUS_CONFIG[entry.newStatus] || STATUS_CONFIG.ASSIGNED;
                          const EntryIcon = entryStatusMeta.icon;

                          return (
                            <div key={entry.id || idx} className="relative space-y-1">
                              {/* Timeline Dot */}
                              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white dark:bg-[#071B2F] border-2 border-[#006D5B] flex items-center justify-center text-[#006D5B]">
                                <div className="w-2 h-2 rounded-full bg-[#006D5B]"></div>
                              </div>

                              <div className="p-3 bg-white dark:bg-slate-800/90 rounded-xl border border-[#CBD5E1] dark:border-slate-700 shadow-xs space-y-1.5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 ${entryStatusMeta.bg} ${entryStatusMeta.text}`}
                                    >
                                      <EntryIcon className="w-3 h-3" />
                                      <span>{entryStatusMeta.label}</span>
                                    </span>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                                      {entry.updatedByName}
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded font-semibold uppercase">
                                      {entry.updatedByRole}
                                    </span>
                                  </div>

                                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                    {new Date(entry.timestamp).toLocaleDateString()}{' '}
                                    {new Date(entry.timestamp).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit',
                                    })}
                                  </span>
                                </div>

                                {entry.note && (
                                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-1">
                                    {entry.note}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                        <p className="font-semibold">Initial Assignment Created</p>
                        <p className="text-slate-500 mt-0.5">
                          Dispatched on {new Date(assignment.assignedAt).toLocaleString()} by {assignment.assignedByExecutiveName}.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white dark:bg-[#071B2F] rounded-2xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/90 border-b-1.5 border-[#CBD5E1] dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <th className="p-3.5">Audit ID</th>
                  <th className="p-3.5">Report &amp; City</th>
                  <th className="p-3.5">Authorizing Executive</th>
                  <th className="p-3.5">Assigned Specialist</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBD5E1] dark:divide-slate-700 text-xs font-medium">
                {filteredAssignments.map((a) => {
                  const statusMeta = STATUS_CONFIG[a.status] || STATUS_CONFIG.ASSIGNED;
                  const StatusIcon = statusMeta.icon;

                  return (
                    <tr
                      key={a.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-slate-200">
                        {a.id}
                      </td>

                      <td className="p-3.5 max-w-xs">
                        <p className="font-bold text-slate-900 dark:text-white truncate">
                          {a.reportTitle || `Report #${a.reportId}`}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#006D5B]" />
                          <span>{a.cityName || 'Rawalpindi'}</span>
                        </p>
                      </td>

                      <td className="p-3.5">
                        <p className="font-bold text-[#0A2540] dark:text-amber-300">
                          {a.assignedByExecutiveName}
                        </p>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                          {a.dispatcherRole || 'Chief Executive'}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {a.assignedStaffName}
                        </p>
                        <span className="text-[11px] font-mono text-[#006D5B] dark:text-teal-400">
                          Badge: {a.assignedStaffBadge}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            a.priority === 'CRITICAL'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : a.priority === 'HIGH'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}
                        >
                          {a.priority}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1 w-fit ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusMeta.label}</span>
                        </span>
                      </td>

                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                        {new Date(a.assignedAt).toLocaleString()}
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedAssignmentForUpdate(a);
                            setUpdateStatus(a.status);
                            setUpdateNote('');
                          }}
                          className="px-3 py-1.5 bg-[#006D5B] hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: Log Status Audit Update */}
      {selectedAssignmentForUpdate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#071B2F] rounded-2xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1] dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#006D5B] text-white flex items-center justify-center">
                  <Sliders className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Log Task Assignment Audit Update
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Record ID: {selectedAssignmentForUpdate.id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAssignmentForUpdate(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusFeedbackMsg && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                  statusFeedbackMsg.type === 'success'
                    ? 'bg-teal-50 border-teal-300 text-teal-900 dark:bg-teal-950 dark:text-teal-200'
                    : 'bg-red-50 border-red-300 text-red-900 dark:bg-red-950 dark:text-red-200'
                }`}
              >
                {statusFeedbackMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{statusFeedbackMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleStatusUpdateSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Target Work Order:
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {selectedAssignmentForUpdate.reportTitle || selectedAssignmentForUpdate.reportId}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Assigned Staff: {selectedAssignmentForUpdate.assignedStaffName} (
                  {selectedAssignmentForUpdate.assignedStaffBadge})
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Select New Operational Status *
                </label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value as TaskAssignmentStatus)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none min-h-[48px]"
                >
                  <option value="ACKNOWLEDGED">Acknowledged by Field Crew</option>
                  <option value="EN_ROUTE">Crew En Route to Location</option>
                  <option value="ON_SITE">Arrived On Site & Secured Perimeter</option>
                  <option value="IN_PROGRESS">Active Remediation In Progress</option>
                  <option value="RESOLVED">Resolved & Work Sign-Off Complete</option>
                  <option value="REASSIGNED">Reassigned to Alternative Specialist</option>
                  <option value="ESCALATED">Escalated to Chief Municipal Engineer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Officer / Specialist Name Logging Entry *
                </label>
                <input
                  type="text"
                  required
                  value={updaterName}
                  onChange={(e) => setUpdaterName(e.target.value)}
                  placeholder="e.g. Mr. Kamran (Chief Executive) or Mr. Sagheer (Field Specialist)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Audit Notes &amp; Field Observations *
                </label>
                <textarea
                  required
                  rows={3}
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  placeholder="Detail exact actions taken (e.g. asphalt compaction completed, water pipe collar clamp welded, streetlights rewired)..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
                ></textarea>
              </div>

              {updateStatus === 'RESOLVED' && (
                <div className="p-3 bg-teal-50 dark:bg-teal-950/60 rounded-xl border border-teal-300 dark:border-teal-700 space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-200">
                    Official Resolution Certificate Notes
                  </label>
                  <input
                    type="text"
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="e.g. Remediation approved under standard municipal engineering specification."
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-teal-300 rounded-lg text-xs font-medium"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#CBD5E1] dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setSelectedAssignmentForUpdate(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStatus}
                  className="px-5 py-2.5 bg-[#006D5B] hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer min-h-[44px] disabled:opacity-50"
                >
                  {isSubmittingStatus ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Recording Audit...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Commit Audit Update</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Dispatch New Task Assignment */}
      {isNewDispatchModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#071B2F] rounded-2xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1] dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0A2540] text-amber-400 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Authorize &amp; Dispatch Municipal Task
                  </h3>
                  <p className="text-xs text-slate-500">
                    City Jurisdiction: {selectedCity}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsNewDispatchModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {dispatchFeedback && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                  dispatchFeedback.type === 'success'
                    ? 'bg-teal-50 border-teal-300 text-teal-900 dark:bg-teal-950 dark:text-teal-200'
                    : 'bg-red-50 border-red-300 text-red-900 dark:bg-red-950 dark:text-red-200'
                }`}
              >
                {dispatchFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{dispatchFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handleNewDispatchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Open Citizen Report *
                </label>
                <select
                  required
                  value={selectedReportId}
                  onChange={(e) => setSelectedReportId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none min-h-[44px]"
                >
                  <option value="">-- Choose a Neighborhood Issue --</option>
                  {reports.map((r) => (
                    <option key={r.id} value={r.id}>
                      [{r.id}] {r.title} ({r.cityName || selectedCity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Registered Staff Member (Dispatchee) *
                </label>
                <select
                  required
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none min-h-[44px]"
                >
                  <option value="">-- Select Registered Specialist --</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.badgeId}) • {s.department} • [{s.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Authorizing Municipal Executive (Dispatcher) *
                </label>
                <input
                  type="text"
                  required
                  value={dispatchExecutiveName}
                  onChange={(e) => setDispatchExecutiveName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Priority Level
                  </label>
                  <select
                    value={dispatchPriority}
                    onChange={(e) => setDispatchPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white min-h-[44px]"
                  >
                    <option value="CRITICAL">🔴 Critical Priority</option>
                    <option value="HIGH">🟠 High Priority</option>
                    <option value="STANDARD">🔵 Standard Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Target SLA (Hours)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={168}
                    value={dispatchSlaHours}
                    onChange={(e) => setDispatchSlaHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs font-mono font-bold min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Executive Directive &amp; Remediation Instructions *
                </label>
                <textarea
                  required
                  rows={3}
                  value={dispatchDirective}
                  onChange={(e) => setDispatchDirective(e.target.value)}
                  placeholder="Specify equipment required, safety measures, and expected resolution standard..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#CBD5E1] dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsNewDispatchModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDispatching}
                  className="px-5 py-2.5 bg-[#B45309] hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer min-h-[44px] disabled:opacity-50"
                >
                  {isDispatching ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Authorize &amp; Dispatch</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
