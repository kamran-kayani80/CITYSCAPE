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
  ArrowUpRight,
  Printer,
  Smartphone,
  Phone,
  Wrench,
  DollarSign,
  UserPlus,
  Home,
  Hammer
} from 'lucide-react';
import {
  TaskAssignment,
  TaskAssignmentStatus,
  TaskAssignmentAuditEntry,
  Report,
  EstateStaffMember,
  EstateContext
} from '../types';

interface HoaTaskAssignmentHistoryViewProps {
  estateContext?: EstateContext;
  reports?: Report[];
  onSelectReport?: (report: Report) => void;
  onRefreshReports?: () => void;
  onOpenDispatchModal?: (workOrder?: Report) => void;
  isPlanFeatureAllowed?: (feature: any) => boolean;
}

const HOA_STATUS_CONFIG: Record<
  TaskAssignmentStatus,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  ASSIGNED: {
    label: 'Contractor Assigned',
    bg: 'bg-blue-50 dark:bg-blue-950/60',
    text: 'text-blue-800 dark:text-blue-200',
    border: 'border-blue-300 dark:border-blue-700',
    icon: Clock,
  },
  ACKNOWLEDGED: {
    label: 'Tech Acknowledged',
    bg: 'bg-indigo-50 dark:bg-indigo-950/60',
    text: 'text-indigo-800 dark:text-indigo-200',
    border: 'border-indigo-300 dark:border-indigo-700',
    icon: CheckCircle2,
  },
  EN_ROUTE: {
    label: 'Contractor En Route',
    bg: 'bg-amber-50 dark:bg-amber-950/60',
    text: 'text-amber-900 dark:text-amber-200',
    border: 'border-amber-300 dark:border-amber-700',
    icon: Sparkles,
  },
  ON_SITE: {
    label: 'Arrived at Unit / Gate',
    bg: 'bg-purple-50 dark:bg-purple-950/60',
    text: 'text-purple-800 dark:text-purple-200',
    border: 'border-purple-300 dark:border-purple-700',
    icon: MapPin,
  },
  IN_PROGRESS: {
    label: 'Repairs In Progress',
    bg: 'bg-teal-50 dark:bg-teal-950/60',
    text: 'text-teal-900 dark:text-teal-200',
    border: 'border-teal-300 dark:border-teal-700',
    icon: Wrench,
  },
  RESOLVED: {
    label: 'Resolved & Signed Off',
    bg: 'bg-emerald-50 dark:bg-emerald-950/60',
    text: 'text-emerald-900 dark:text-emerald-200',
    border: 'border-emerald-300 dark:border-emerald-700',
    icon: ShieldCheck,
  },
  REASSIGNED: {
    label: 'Reassigned Contractor',
    bg: 'bg-orange-50 dark:bg-orange-950/60',
    text: 'text-orange-900 dark:text-orange-200',
    border: 'border-orange-300 dark:border-orange-700',
    icon: RefreshCw,
  },
  ESCALATED: {
    label: 'Escalated to Board',
    bg: 'bg-red-50 dark:bg-red-950/60',
    text: 'text-red-900 dark:text-red-200',
    border: 'border-red-300 dark:border-red-700',
    icon: AlertTriangle,
  },
};

const TIER_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  COMMON_GROUNDS: {
    label: 'Common Grounds',
    bg: 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-200',
    text: 'text-teal-800 dark:text-teal-200'
  },
  RESIDENTIAL_INTERIOR: {
    label: 'Private Villa / Unit',
    bg: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200',
    text: 'text-purple-800 dark:text-purple-200'
  },
  EMERGENCY_AMENITY: {
    label: 'Critical Amenity',
    bg: 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200',
    text: 'text-red-800 dark:text-red-200'
  }
};

export const HoaTaskAssignmentHistoryView: React.FC<HoaTaskAssignmentHistoryViewProps> = ({
  estateContext,
  reports = [],
  onSelectReport,
  onRefreshReports,
  isPlanFeatureAllowed,
}) => {
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [staffList, setStaffList] = useState<EstateStaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('ALL');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('ALL');
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');
  const [expandedAssignmentIds, setExpandedAssignmentIds] = useState<Set<string>>(new Set());

  // Modal for logging an audit status update
  const [selectedAssignmentForUpdate, setSelectedAssignmentForUpdate] = useState<TaskAssignment | null>(null);
  const [updateStatus, setUpdateStatus] = useState<TaskAssignmentStatus>('IN_PROGRESS');
  const [updateNote, setUpdateNote] = useState('');
  const [updaterName, setUpdaterName] = useState('HOA Facilities Director');
  const [updaterRole, setUpdaterRole] = useState<'EXECUTIVE' | 'FIELD_OFFICER' | 'ADMIN'>('EXECUTIVE');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionProofUrl, setResolutionProofUrl] = useState('');
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);
  const [statusFeedbackMsg, setStatusFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal for creating a new task assignment dispatch
  const [isNewDispatchModalOpen, setIsNewDispatchModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedReportId, setSelectedReportId] = useState('');
  const [customWorkOrderTitle, setCustomWorkOrderTitle] = useState('');
  const [customUnitPlot, setCustomUnitPlot] = useState('');
  const [dispatchExecutiveName, setDispatchExecutiveName] = useState('Alexander Vance (HOA Board President)');
  const [dispatchDirective, setDispatchDirective] = useState('');
  const [dispatchPriority, setDispatchPriority] = useState<'CRITICAL' | 'HIGH' | 'STANDARD'>('HIGH');
  const [dispatchTier, setDispatchTier] = useState<'COMMON_GROUNDS' | 'RESIDENTIAL_INTERIOR' | 'EMERGENCY_AMENITY'>('COMMON_GROUNDS');
  const [dispatchSlaHours, setDispatchSlaHours] = useState(24);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchFeedback, setDispatchFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch HOA Assignments and Staff
  const fetchHoaAuditData = async () => {
    setIsLoading(true);
    try {
      const estateIdParam = estateContext?.id ? `?estateId=${encodeURIComponent(estateContext.id)}` : '';
      const [asgnRes, staffRes] = await Promise.all([
        fetch(`/api/hoa/assignments${estateIdParam}`),
        fetch(`/api/hoa/staff${estateIdParam}`),
      ]);

      if (asgnRes.ok) {
        const data = await asgnRes.json();
        if (Array.isArray(data.assignments)) {
          setAssignments(data.assignments);
          // Expand the first 2 items by default
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
      console.error('Failed fetching HOA task assignment history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHoaAuditData();
  }, [estateContext?.id]);

  // Filtered Assignments List
  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      // Status check
      if (selectedStatusFilter !== 'ALL' && item.status !== selectedStatusFilter) {
        return false;
      }
      // Tier check
      if (selectedTierFilter !== 'ALL' && item.workOrderTier !== selectedTierFilter) {
        return false;
      }
      // Priority check
      if (selectedPriorityFilter !== 'ALL' && item.priority !== selectedPriorityFilter) {
        return false;
      }
      // Staff contractor check
      if (selectedStaffFilter !== 'ALL' && item.assignedStaffId !== selectedStaffFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.reportTitle.toLowerCase().includes(q);
        const matchesStaff = item.assignedStaffName.toLowerCase().includes(q);
        const matchesExec = item.assignedByExecutiveName.toLowerCase().includes(q);
        const matchesBadge = item.assignedStaffBadge?.toLowerCase().includes(q);
        const matchesUnit = item.unitPlotNumber?.toLowerCase().includes(q);
        const matchesDirective = item.directive?.toLowerCase().includes(q);
        return matchesTitle || matchesStaff || matchesExec || matchesBadge || matchesUnit || matchesDirective;
      }
      return true;
    });
  }, [
    assignments,
    selectedStatusFilter,
    selectedTierFilter,
    selectedPriorityFilter,
    selectedStaffFilter,
    searchQuery,
  ]);

  // Toggle item expansion
  const toggleExpandAssignment = (id: string) => {
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

  // Submit Status / Audit Update
  const handleSubmitStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentForUpdate) return;

    setIsSubmittingStatus(true);
    setStatusFeedbackMsg(null);

    try {
      const res = await fetch(`/api/hoa/assignments/${selectedAssignmentForUpdate.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newStatus: updateStatus,
          note: updateNote.trim() || `Status updated to ${updateStatus}`,
          updatedByName: updaterName.trim() || 'HOA Facilities Director',
          updatedByRole: updaterRole,
          resolutionNotes: resolutionNotes.trim() || undefined,
          resolutionProofUrl: resolutionProofUrl.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update status');
      }

      const data = await res.json();
      setStatusFeedbackMsg({
        type: 'success',
        text: `Audit updated! Assignment transitioned to [${updateStatus}].`,
      });

      // Update local state
      setAssignments((prev) =>
        prev.map((a) => (a.id === selectedAssignmentForUpdate.id ? data.assignment : a))
      );

      if (onRefreshReports) onRefreshReports();

      setTimeout(() => {
        setSelectedAssignmentForUpdate(null);
        setStatusFeedbackMsg(null);
        setUpdateNote('');
        setResolutionNotes('');
        setResolutionProofUrl('');
      }, 1200);
    } catch (err: any) {
      setStatusFeedbackMsg({
        type: 'error',
        text: err.message || 'Network error updating HOA assignment.',
      });
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  // Submit New Task Dispatch
  const handleDispatchNewTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) {
      setDispatchFeedback({ type: 'error', text: 'Please select a registered specialist contractor.' });
      return;
    }

    const matchedStaff = staffList.find((s) => s.id === selectedStaffId);
    let selectedReport = reports.find((r) => r.id === selectedReportId);

    const reportTitle = selectedReport ? selectedReport.title : (customWorkOrderTitle.trim() || 'Common Area Preventive Maintenance');
    const unitPlotNumber = selectedReport ? (selectedReport.addressText || estateContext?.unitPlotNumber || 'Clubhouse') : (customUnitPlot.trim() || estateContext?.unitPlotNumber || 'Sector B Common Lane');

    setIsDispatching(true);
    setDispatchFeedback(null);

    try {
      const res = await fetch('/api/hoa/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: selectedReportId || `hoa-wo-${Date.now()}`,
          reportTitle,
          reportCategory: selectedReport?.category || 'GENERAL_MAINTENANCE',
          reportAddress: unitPlotNumber,
          unitPlotNumber,
          estateId: estateContext?.id || 'prime-valley-hoa-01',
          estateName: estateContext?.estateName || 'Prime Valley HOA',
          assignedStaffId: matchedStaff?.id || selectedStaffId,
          assignedStaffName: matchedStaff?.name || 'Registered Contractor',
          assignedByExecutiveId: 'hoa-exec-lead',
          assignedByExecutiveName: dispatchExecutiveName.trim() || 'HOA Facilities Director',
          directive: dispatchDirective.trim() || 'Execute scheduled on-site inspection, diagnostics, and repairs with zero disruption to neighbors.',
          priority: dispatchPriority,
          workOrderTier: dispatchTier,
          slaHours: dispatchSlaHours,
          tradeSpecialty: matchedStaff?.tradeSpecialty,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to dispatch work order');
      }

      const data = await res.json();
      setDispatchFeedback({
        type: 'success',
        text: `Work order dispatched to ${matchedStaff?.name || 'contractor'}!`,
      });

      // Prepend to local assignments list
      if (data.assignment) {
        setAssignments((prev) => [data.assignment, ...prev]);
        setExpandedAssignmentIds((prev) => new Set([data.assignment.id, ...Array.from(prev)]));
      }

      if (onRefreshReports) onRefreshReports();

      setTimeout(() => {
        setIsNewDispatchModalOpen(false);
        setDispatchFeedback(null);
        setSelectedReportId('');
        setSelectedStaffId('');
        setCustomWorkOrderTitle('');
        setCustomUnitPlot('');
        setDispatchDirective('');
      }, 1200);
    } catch (err: any) {
      setDispatchFeedback({
        type: 'error',
        text: err.message || 'Failed to create HOA dispatch order.',
      });
    } finally {
      setIsDispatching(false);
    }
  };

  // Quick statistics calculation
  const totalDispatches = assignments.length;
  const inProgressCount = assignments.filter((a) => a.status === 'IN_PROGRESS' || a.status === 'EN_ROUTE' || a.status === 'ON_SITE').length;
  const onSiteCount = assignments.filter((a) => a.status === 'ON_SITE').length;
  const resolvedCount = assignments.filter((a) => a.status === 'RESOLVED').length;
  const resolvedPercent = totalDispatches > 0 ? Math.round((resolvedCount / totalDispatches) * 100) : 100;

  return (
    <div id="hoa-task-assignment-history-root" className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="bg-[#0A2540] text-white p-6 rounded-3xl border-2 border-[#006D5B] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#006D5B] text-[#CCFF00] font-black text-[10px] uppercase tracking-wider">
              OFFICIAL HOA AUDIT SYSTEM
            </span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">
              {estateContext?.estateName || 'Gated Community HOA'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2.5">
            <History className="w-6 h-6 text-[#2DD4BF]" />
            Task Assignment History & Contractor Audit Log
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
            Chronological audit trail recording which HOA Board Executive dispatched which specialist contractor, unit coordinates, status transitions, and resolution sign-offs.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsNewDispatchModalOpen(true)}
            className="px-4 py-3 bg-[#B45309] hover:bg-amber-700 text-white font-black text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-md transition-all cursor-pointer min-h-[48px]"
          >
            <PlusCircle className="w-5 h-5 text-yellow-300" />
            <span>+ Dispatch HOA Work Order</span>
          </button>

          <button
            onClick={fetchHoaAuditData}
            title="Refresh Audit Data"
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/20 transition-all cursor-pointer min-h-[48px]"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-[#2DD4BF]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Audit Telemetry Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Total Work Orders</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-[#0A2540] dark:text-white">{totalDispatches}</p>
          <span className="text-[10px] text-slate-500 font-medium">All logged society dispatches</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Active & In Field</span>
            <Wrench className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{inProgressCount}</p>
          <span className="text-[10px] text-slate-500 font-medium">{onSiteCount} confirmed on site</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Signed Off & Resolved</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{resolvedCount}</p>
          <span className="text-[10px] text-emerald-600 font-bold">{resolvedPercent}% compliance rate</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Approved Contractors</span>
            <UserCheck className="w-4 h-4 text-[#006D5B]" />
          </div>
          <p className="text-2xl font-black text-[#006D5B] dark:text-teal-400">{staffList.length}</p>
          <span className="text-[10px] text-slate-500 font-medium">Pre-cleared trade specialists</span>
        </div>
      </div>

      {/* Filter & View Mode Controls */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket title, contractor, badge ID, executive, or unit/plot number..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-[#0A2540] dark:text-white placeholder:text-slate-400 focus:border-[#0A2540] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-300 dark:border-slate-700 shrink-0">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-white dark:bg-slate-900 text-[#0A2540] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0A2540]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#006D5B]" />
              <span>Visual Timeline</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-[#0A2540] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0A2540]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#006D5B]" />
              <span>Audit Grid</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs font-bold">
          {/* Status Filter */}
          <div>
            <label className="text-[11px] text-slate-500 font-extrabold uppercase mb-1 block">Status</label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold focus:border-[#0A2540] focus:outline-none"
            >
              <option value="ALL">All Statuses ({assignments.length})</option>
              <option value="ASSIGNED">Assigned / Queued</option>
              <option value="ACKNOWLEDGED">Acknowledged</option>
              <option value="EN_ROUTE">Crew En Route</option>
              <option value="ON_SITE">Arrived On Site</option>
              <option value="IN_PROGRESS">Repairs In Progress</option>
              <option value="RESOLVED">Resolved & Signed Off</option>
              <option value="ESCALATED">Escalated to Board</option>
            </select>
          </div>

          {/* Work Order Tier Filter */}
          <div>
            <label className="text-[11px] text-slate-500 font-extrabold uppercase mb-1 block">Work Order Tier</label>
            <select
              value={selectedTierFilter}
              onChange={(e) => setSelectedTierFilter(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold focus:border-[#0A2540] focus:outline-none"
            >
              <option value="ALL">All Tiers</option>
              <option value="COMMON_GROUNDS">Common Grounds</option>
              <option value="RESIDENTIAL_INTERIOR">Private Villa / Interior</option>
              <option value="EMERGENCY_AMENITY">Emergency Amenity</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="text-[11px] text-slate-500 font-extrabold uppercase mb-1 block">Priority Level</label>
            <select
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold focus:border-[#0A2540] focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="STANDARD">Standard</option>
            </select>
          </div>

          {/* Contractor Specialist Filter */}
          <div>
            <label className="text-[11px] text-slate-500 font-extrabold uppercase mb-1 block">Assigned Contractor</label>
            <select
              value={selectedStaffFilter}
              onChange={(e) => setSelectedStaffFilter(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold focus:border-[#0A2540] focus:outline-none"
            >
              <option value="ALL">All Contractors ({staffList.length})</option>
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.vendorCompany || 'Contractor'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main List Rendering */}
      {isLoading ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 space-y-3">
          <RefreshCw className="w-8 h-8 text-[#006D5B] animate-spin mx-auto" />
          <p className="text-sm font-black text-[#0A2540] dark:text-white">
            Loading HOA Task Assignment & Audit Logs...
          </p>
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 space-y-4">
          <History className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-black text-[#0A2540] dark:text-white">
            No Task Assignment Records Match Filter
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query, priority, or status filters, or dispatch a new HOA work order to a registered contractor.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStatusFilter('ALL');
              setSelectedTierFilter('ALL');
              setSelectedPriorityFilter('ALL');
              setSelectedStaffFilter('ALL');
            }}
            className="px-4 py-2 bg-[#006D5B] text-white font-extrabold text-xs rounded-xl hover:bg-teal-700 cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'timeline' ? (
        /* VISUAL TIMELINE VIEW */
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => {
            const statusMeta = HOA_STATUS_CONFIG[assignment.status] || HOA_STATUS_CONFIG.ASSIGNED;
            const StatusIcon = statusMeta.icon;
            const isExpanded = expandedAssignmentIds.has(assignment.id);
            const tierMeta = TIER_CONFIG[assignment.workOrderTier || 'COMMON_GROUNDS'] || TIER_CONFIG.COMMON_GROUNDS;

            return (
              <div
                key={assignment.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 overflow-hidden shadow-xs hover:border-[#006D5B] transition-all"
              >
                {/* Assignment Header Card */}
                <div className="p-5 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black text-[#006D5B] bg-teal-50 dark:bg-teal-950/80 px-2.5 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                          #{assignment.id}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded ${tierMeta.bg}`}>
                          {tierMeta.label}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded ${
                          assignment.priority === 'CRITICAL'
                            ? 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200'
                            : assignment.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                            : 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200'
                        }`}>
                          {assignment.priority} Priority
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          Dispatched: {new Date(assignment.assignedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-[#0A2540] dark:text-white">
                        {assignment.reportTitle}
                      </h3>
                    </div>

                    {/* Status Badge & Quick Action */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className={`px-3 py-1.5 rounded-xl border-2 font-black text-xs flex items-center gap-1.5 ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span>{statusMeta.label}</span>
                      </span>

                      <button
                        onClick={() => {
                          setSelectedAssignmentForUpdate(assignment);
                          setUpdateStatus(assignment.status);
                          setUpdaterName(assignment.assignedByExecutiveName || 'HOA Facilities Director');
                        }}
                        className="px-3 py-2 bg-[#006D5B] hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer min-h-[40px]"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Log Audit / Update</span>
                      </button>
                    </div>
                  </div>

                  {/* Operational Relationship Details (Executive -> Contractor & Location) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                    {/* Dispatcher (HOA Executive) */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-[#0A2540] dark:text-slate-300" />
                        HOA Dispatcher Executive
                      </span>
                      <p className="font-extrabold text-[#0A2540] dark:text-white">
                        {assignment.assignedByExecutiveName}
                      </p>
                      <p className="text-[11px] text-slate-500">{assignment.dispatcherRole || 'HOA Board Executive'}</p>
                    </div>

                    {/* Dispatchee (Specialist Contractor) */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-[#006D5B]" />
                        Assigned Specialist Contractor
                      </span>
                      <div className="flex items-center gap-2">
                        {assignment.assignedStaffAvatar ? (
                          <img
                            src={assignment.assignedStaffAvatar}
                            alt={assignment.assignedStaffName}
                            className="w-6 h-6 rounded-full object-cover border border-[#006D5B]"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#006D5B] text-white flex items-center justify-center text-[10px] font-bold">
                            {assignment.assignedStaffName.charAt(0)}
                          </div>
                        )}
                        <span className="font-extrabold text-[#0A2540] dark:text-white">
                          {assignment.assignedStaffName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Badge: {assignment.assignedStaffBadge} • Phone: {assignment.assignedStaffPhone || '+1 (555) 301-8811'}
                      </p>
                    </div>

                    {/* Location Coordinates & SLA */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        Unit / Coordinates & SLA Target
                      </span>
                      <p className="font-extrabold text-[#0A2540] dark:text-white">
                        {assignment.unitPlotNumber || assignment.reportAddress || 'Common Grounds'}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Target SLA: {assignment.slaTargetHours || 24} Hours (Due: {assignment.slaDueDate ? new Date(assignment.slaDueDate).toLocaleDateString() : 'Active'})
                      </p>
                    </div>
                  </div>

                  {/* Directive Banner */}
                  {assignment.directive && (
                    <div className="p-3 bg-teal-50/70 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800 text-xs flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#006D5B] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#0A2540] dark:text-teal-200">Official Board Directive: </strong>
                        <span className="text-slate-700 dark:text-slate-300">{assignment.directive}</span>
                      </div>
                    </div>
                  )}

                  {/* Audit History Toggle Button */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 text-xs">
                    <button
                      onClick={() => toggleExpandAssignment(assignment.id)}
                      className="font-black text-[#006D5B] hover:text-teal-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <History className="w-4 h-4" />
                      <span>
                        {isExpanded ? 'Hide' : 'View'} Audit Timeline History (
                        {assignment.auditHistory ? assignment.auditHistory.length : 0} Events)
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <span>Last Updated By: <strong>{assignment.lastUpdatedBy || assignment.assignedByExecutiveName}</strong></span>
                    </div>
                  </div>
                </div>

                {/* EXPANDABLE AUDIT TRAIL LOG */}
                {isExpanded && (
                  <div className="p-5 bg-slate-50 dark:bg-slate-950 border-t-2 border-slate-200 dark:border-slate-800 space-y-4">
                    <h4 className="text-xs font-black text-[#0A2540] dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <History className="w-4 h-4 text-[#006D5B]" />
                      Immutable Timestamped Audit Trail
                    </h4>

                    {!assignment.auditHistory || assignment.auditHistory.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No audit transitions logged yet.</p>
                    ) : (
                      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-300 dark:before:bg-slate-700">
                        {assignment.auditHistory.map((audit: TaskAssignmentAuditEntry, idx: number) => {
                          const auditStatusMeta = HOA_STATUS_CONFIG[audit.newStatus as TaskAssignmentStatus] || HOA_STATUS_CONFIG.ASSIGNED;

                          return (
                            <div key={audit.id || idx} className="relative space-y-1">
                              {/* Dot */}
                              <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-[#006D5B] border-2 border-white dark:border-slate-900" />

                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-xs text-[#0A2540] dark:text-white">
                                    {audit.updatedByName}
                                  </span>
                                  <span className="px-2 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
                                    {audit.updatedByRole}
                                  </span>
                                  <span className={`text-[10px] font-black px-2 py-0.2 rounded ${auditStatusMeta.bg} ${auditStatusMeta.text}`}>
                                    [{audit.newStatus}]
                                  </span>
                                </div>

                                <span className="text-[11px] font-mono text-slate-500">
                                  {new Date(audit.timestamp).toLocaleString([], {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                  })}
                                </span>
                              </div>

                              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                                {audit.note}
                              </p>

                              {audit.attachmentUrl && (
                                <div className="mt-2 pt-1">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                                    Resolution Verification Photo:
                                  </span>
                                  <img
                                    src={audit.attachmentUrl}
                                    alt="Resolution Proof"
                                    className="w-48 h-32 rounded-xl object-cover border-2 border-slate-300 dark:border-slate-700"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* STRUCTURED AUDIT TABLE VIEW */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#CBD5E1] dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-[#0A2540] dark:text-slate-200 border-b-2 border-slate-300 dark:border-slate-700 font-extrabold uppercase">
                  <th className="p-3.5">Assignment ID</th>
                  <th className="p-3.5">Work Order & Unit</th>
                  <th className="p-3.5">HOA Executive</th>
                  <th className="p-3.5">Specialist Contractor</th>
                  <th className="p-3.5">Priority / Tier</th>
                  <th className="p-3.5">Current Status</th>
                  <th className="p-3.5">SLA Target</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredAssignments.map((assignment) => {
                  const statusMeta = HOA_STATUS_CONFIG[assignment.status] || HOA_STATUS_CONFIG.ASSIGNED;
                  const tierMeta = TIER_CONFIG[assignment.workOrderTier || 'COMMON_GROUNDS'] || TIER_CONFIG.COMMON_GROUNDS;

                  return (
                    <tr key={assignment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3.5 font-mono font-bold text-[#006D5B]">
                        #{assignment.id.slice(-8)}
                      </td>
                      <td className="p-3.5">
                        <div className="font-extrabold text-[#0A2540] dark:text-white max-w-xs truncate">
                          {assignment.reportTitle}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {assignment.unitPlotNumber || assignment.reportAddress || 'Common Area'}
                        </div>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                        {assignment.assignedByExecutiveName}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-[#0A2540] dark:text-white">
                          {assignment.assignedStaffName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {assignment.assignedStaffBadge}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex flex-col gap-1">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.2 rounded w-fit ${tierMeta.bg}`}>
                            {tierMeta.label}
                          </span>
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                            {assignment.priority}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] inline-flex items-center gap-1 ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}>
                          {statusMeta.label}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                        {assignment.slaTargetHours || 24}h
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedAssignmentForUpdate(assignment);
                            setUpdateStatus(assignment.status);
                            setUpdaterName(assignment.assignedByExecutiveName || 'HOA Facilities Director');
                          }}
                          className="px-3 py-1.5 bg-[#006D5B] text-white font-extrabold text-xs rounded-xl hover:bg-teal-700 cursor-pointer"
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

      {/* =========================================================================
          MODAL 1: LOG AUDIT STATUS TRANSITION
         ========================================================================= */}
      {selectedAssignmentForUpdate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl border-2 border-[#006D5B] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-[#006D5B] text-white rounded-2xl">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0A2540] dark:text-white">
                    Log HOA Work Order Audit Transition
                  </h3>
                  <p className="text-xs text-slate-500">
                    Assignment #{selectedAssignmentForUpdate.id} • {selectedAssignmentForUpdate.assignedStaffName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAssignmentForUpdate(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusFeedbackMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-bold ${
                  statusFeedbackMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-red-50 text-red-800 border border-red-300'
                }`}
              >
                {statusFeedbackMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmitStatusUpdate} className="space-y-4">
              {/* Transition Status Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                  Select New Progress Status:
                </label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value as TaskAssignmentStatus)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white focus:border-[#0A2540] focus:outline-none"
                >
                  <option value="ACKNOWLEDGED">Acknowledged by Contractor</option>
                  <option value="EN_ROUTE">Crew Mobilized / En Route</option>
                  <option value="ON_SITE">Arrived On Site at Unit</option>
                  <option value="IN_PROGRESS">Repairs In Progress</option>
                  <option value="RESOLVED">Resolved & Signed Off</option>
                  <option value="ESCALATED">Escalated to HOA Board</option>
                </select>
              </div>

              {/* Updater Role & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                    Logged By (Name):
                  </label>
                  <input
                    type="text"
                    required
                    value={updaterName}
                    onChange={(e) => setUpdaterName(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                    Updater Role:
                  </label>
                  <select
                    value={updaterRole}
                    onChange={(e) => setUpdaterRole(e.target.value as any)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white"
                  >
                    <option value="EXECUTIVE">HOA Board Executive</option>
                    <option value="FIELD_OFFICER">Contractor Field Specialist</option>
                    <option value="ADMIN">Property Manager Admin</option>
                  </select>
                </div>
              </div>

              {/* Observation / Audit Note */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                  Audit Notes & Inspection Findings:
                </label>
                <textarea
                  rows={3}
                  required
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  placeholder="e.g., Contractor arrived at Villa 142. Main water valve pressure tested. Gasket replaced and sealed."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-[#0A2540] dark:text-white focus:border-[#0A2540] focus:outline-none"
                />
              </div>

              {/* If Resolved: Sign-Off Details & Photo */}
              {updateStatus === 'RESOLVED' && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800 space-y-3">
                  <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-200 uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Final Quality Sign-Off & Photo Proof
                  </h4>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Resolution Sign-Off Summary:
                    </label>
                    <input
                      type="text"
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="e.g., Completed pressure testing with 0% leak. Signed off by Lead Tech & Resident."
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-emerald-300 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Completion Photo Proof URL (Optional):
                    </label>
                    <input
                      type="url"
                      value={resolutionProofUrl}
                      onChange={(e) => setResolutionProofUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-emerald-300 rounded-xl text-xs font-medium font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedAssignmentForUpdate(null)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs rounded-xl hover:bg-slate-200 cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStatus}
                  className="px-5 py-2.5 bg-[#006D5B] hover:bg-teal-700 text-white font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all min-h-[44px]"
                >
                  {isSubmittingStatus ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Audit Entry...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Record Audit Transition</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: DISPATCH NEW HOA WORK ORDER
         ========================================================================= */}
      {isNewDispatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border-2 border-[#006D5B] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-[#B45309] text-white rounded-2xl">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0A2540] dark:text-white">
                    Dispatch HOA Work Order to Contractor
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official Executive Directive for {estateContext?.estateName || 'Prime Valley HOA'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsNewDispatchModalOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {dispatchFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-bold ${
                  dispatchFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-red-50 text-red-800 border border-red-300'
                }`}
              >
                {dispatchFeedback.text}
              </div>
            )}

            <form onSubmit={handleDispatchNewTask} className="space-y-4">
              {/* Select Existing Work Order OR Custom Title */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                  Select Existing Queue Work Order (Optional):
                </label>
                <select
                  value={selectedReportId}
                  onChange={(e) => {
                    setSelectedReportId(e.target.value);
                    const found = reports.find((r) => r.id === e.target.value);
                    if (found) {
                      setCustomWorkOrderTitle(found.title);
                      setCustomUnitPlot(found.addressText || '');
                    }
                  }}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white focus:border-[#0A2540] focus:outline-none"
                >
                  <option value="">-- Or enter custom work order details below --</option>
                  {reports.map((r) => (
                    <option key={r.id} value={r.id}>
                      #{r.id} - {r.title} ({r.addressText})
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Work Order Title & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                    Work Order Title:
                  </label>
                  <input
                    type="text"
                    required
                    value={customWorkOrderTitle}
                    onChange={(e) => setCustomWorkOrderTitle(e.target.value)}
                    placeholder="e.g., Main Sewerage Junction Pipe Repair"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                    Unit / Plot / Location:
                  </label>
                  <input
                    type="text"
                    required
                    value={customUnitPlot}
                    onChange={(e) => setCustomUnitPlot(e.target.value)}
                    placeholder="e.g., Villa 142 / Lane 4"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white"
                  />
                </div>
              </div>

              {/* Select Approved Contractor Specialist */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                  Assign to Registered HOA Specialist / Contractor:
                </label>
                <select
                  required
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-[#006D5B] rounded-xl text-xs font-bold text-[#0A2540] dark:text-white focus:outline-none"
                >
                  <option value="">-- Choose pre-approved contractor --</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.roleTitle || 'Tech'}) — {s.vendorCompany || 'Independent'} [Rate: ${s.hourlyRateUsd || 65}/hr]
                    </option>
                  ))}
                </select>
              </div>

              {/* Work Order Tier, Priority & SLA */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                    Work Order Tier:
                  </label>
                  <select
                    value={dispatchTier}
                    onChange={(e) => setDispatchTier(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white"
                  >
                    <option value="COMMON_GROUNDS">Common Grounds</option>
                    <option value="RESIDENTIAL_INTERIOR">Private Villa / Interior</option>
                    <option value="EMERGENCY_AMENITY">Emergency Amenity</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                    Priority:
                  </label>
                  <select
                    value={dispatchPriority}
                    onChange={(e) => setDispatchPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white"
                  >
                    <option value="CRITICAL">Critical Priority</option>
                    <option value="HIGH">High Priority</option>
                    <option value="STANDARD">Standard</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                    SLA Target (Hours):
                  </label>
                  <select
                    value={dispatchSlaHours}
                    onChange={(e) => setDispatchSlaHours(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white"
                  >
                    <option value={2}>2 Hours (Emergency)</option>
                    <option value={4}>4 Hours (Urgent)</option>
                    <option value={12}>12 Hours (Same Day)</option>
                    <option value={24}>24 Hours (Next Day)</option>
                    <option value={48}>48 Hours (Standard)</option>
                  </select>
                </div>
              </div>

              {/* Official Directive */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                  Executive Directive & Specific Instructions:
                </label>
                <textarea
                  rows={3}
                  required
                  value={dispatchDirective}
                  onChange={(e) => setDispatchDirective(e.target.value)}
                  placeholder="e.g., Mobilize emergency dewatering pump to Sector B Lane 4 crossing. Replace worn coupling gasket and test water pressure."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-[#0A2540] dark:text-white focus:border-[#0A2540] focus:outline-none"
                />
              </div>

              {/* Executive Dispatcher Identity */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                  Authorizing Board Executive:
                </label>
                <input
                  type="text"
                  required
                  value={dispatchExecutiveName}
                  onChange={(e) => setDispatchExecutiveName(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-[#0A2540] dark:text-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewDispatchModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs rounded-xl hover:bg-slate-200 cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDispatching}
                  className="px-5 py-2.5 bg-[#B45309] hover:bg-amber-700 text-white font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all min-h-[44px]"
                >
                  {isDispatching ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Dispatching Work Order...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Issue Dispatch Order & Notify Contractor</span>
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
