import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Send,
  Building2,
  Radio,
  FileText,
  Check,
  ChevronRight,
  Calendar,
  X,
  RefreshCw,
  ExternalLink,
  Shield,
  Layers,
  Wrench,
  Navigation,
  History,
} from 'lucide-react';
import { MunicipalStaffMember, TaskAssignment, Report, ReportStatus, MunicipalStaffOperationalType, MunicipalCitySubscription } from '../types';

interface MunicipalStaffViewProps {
  reports: Report[];
  onSelectReport?: (report: Report) => void;
  onRefreshReports?: () => void;
  activeCity?: string;
  onNavigateToTab?: (tab: string) => void;
}

const PRESET_GEOTAGGED_CITIES: Array<{ name: string; country: string; flag: string }> = [
  { name: 'Rawalpindi', country: 'Pakistan', flag: '🇵🇰' },
  { name: 'Islamabad', country: 'Pakistan', flag: '🇵🇰' },
  { name: 'Lahore', country: 'Pakistan', flag: '🇵🇰' },
  { name: 'Karachi', country: 'Pakistan', flag: '🇵🇰' },
  { name: 'Peshawar', country: 'Pakistan', flag: '🇵🇰' },
  { name: 'Multan', country: 'Pakistan', flag: '🇵🇰' },
  { name: 'San Francisco', country: 'United States', flag: '🇺🇸' },
  { name: 'New York City', country: 'United States', flag: '🇺🇸' },
  { name: 'London', country: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Paris', country: 'France', flag: '🇫🇷' },
  { name: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
];

export const MunicipalStaffView: React.FC<MunicipalStaffViewProps> = ({
  reports,
  onSelectReport,
  onRefreshReports,
  activeCity: initialCity,
  onNavigateToTab,
}) => {
  // Active city based on subscription / user location
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    if (initialCity) return initialCity;
    const saved = localStorage.getItem('cityscape_user_city');
    return saved || 'Rawalpindi';
  });

  const [staffList, setStaffList] = useState<MunicipalStaffMember[]>([]);
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [subscriptions, setSubscriptions] = useState<MunicipalCitySubscription[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<MunicipalCitySubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [selectedOperationalTypeFilter, setSelectedOperationalTypeFilter] = useState<'ALL' | 'DISPATCHER' | 'DISPATCHEE'>('ALL');

  // New Staff Registration Form Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<MunicipalStaffMember['role']>('FIELD_OFFICER');
  const [newOperationalType, setNewOperationalType] = useState<MunicipalStaffOperationalType>('DISPATCHEE');
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Department of Public Works (DPW)');
  const [newDeptCode, setNewDeptCode] = useState('DPW');
  const [newBadgeId, setNewBadgeId] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCityName, setNewCityName] = useState('Rawalpindi');
  const [newMunicipality, setNewMunicipality] = useState('Rawalpindi Municipal Corporation & DPW');
  const [newWard, setNewWard] = useState('Ward 4 - Commercial & Market Zone');
  const [newSpecialties, setNewSpecialties] = useState('');
  const [isSubmittingStaff, setIsSubmittingStaff] = useState(false);
  const [staffFeedbackMsg, setStaffFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Quick Task Dispatch Modal State
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedStaffForDispatch, setSelectedStaffForDispatch] = useState<MunicipalStaffMember | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [dispatchExecutiveName, setDispatchExecutiveName] = useState('Mr. Kamran (Chief Municipal Executive)');
  const [dispatchDirective, setDispatchDirective] = useState('');
  const [dispatchPriority, setDispatchPriority] = useState<'CRITICAL' | 'HIGH' | 'STANDARD'>('CRITICAL');
  const [dispatchSlaHours, setDispatchSlaHours] = useState(24);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchFeedback, setDispatchFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Active View Tab: 'roster' | 'dispatch_feed'
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'dispatch_feed'>('roster');

  // Load Staff, Assignments, and Subscriptions from API with City Filter
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const cityQueryParam = selectedCity !== 'ALL' ? `?city=${encodeURIComponent(selectedCity)}` : '';
      const [staffRes, asgnRes, subsRes] = await Promise.all([
        fetch(`/api/municipal/staff${cityQueryParam}`),
        fetch(`/api/municipal/assignments${cityQueryParam}`),
        fetch(`/api/municipal/subscriptions`),
      ]);
      if (staffRes.ok) {
        const data = await staffRes.json();
        if (Array.isArray(data.staff)) setStaffList(data.staff);
      }
      if (asgnRes.ok) {
        const data = await asgnRes.json();
        if (Array.isArray(data.assignments)) setAssignments(data.assignments);
      }
      if (subsRes.ok) {
        const subsData = await subsRes.json();
        if (Array.isArray(subsData.subscriptions)) {
          setSubscriptions(subsData.subscriptions);
          if (selectedCity !== 'ALL') {
            const found = subsData.subscriptions.find(
              (s: MunicipalCitySubscription) => s.cityName.toLowerCase() === selectedCity.toLowerCase()
            );
            setActiveSubscription(found || null);
          } else {
            setActiveSubscription(null);
          }
        }
      }
    } catch (err) {
      console.error('Failed fetching municipal staff data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCity]);

  // Sync city if changed externally
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

  // Filtered staff list
  const filteredStaff = staffList.filter((s) => {
    // City filter
    const matchesCity =
      selectedCity === 'ALL' ||
      !s.cityName ||
      s.cityName.toLowerCase() === selectedCity.toLowerCase() ||
      (s.municipality && s.municipality.toLowerCase().includes(selectedCity.toLowerCase()));

    // Operational Type filter (Dispatcher vs Dispatchee)
    const matchesOpType =
      selectedOperationalTypeFilter === 'ALL' ||
      (selectedOperationalTypeFilter === 'DISPATCHER' && (s.operationalType === 'DISPATCHER' || s.role === 'EXECUTIVE')) ||
      (selectedOperationalTypeFilter === 'DISPATCHEE' && (s.operationalType === 'DISPATCHEE' || s.role !== 'EXECUTIVE'));

    const matchesRole = selectedRoleFilter === 'ALL' || s.role === selectedRoleFilter;
    const matchesDept = selectedDeptFilter === 'ALL' || s.departmentCode === selectedDeptFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.title.toLowerCase().includes(q) ||
      s.badgeId.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      (s.cityName && s.cityName.toLowerCase().includes(q)) ||
      s.specialties.some((sp) => sp.toLowerCase().includes(q));
    return matchesCity && matchesOpType && matchesRole && matchesDept && matchesSearch;
  });

  // Calculate counts
  const totalDispatchers = staffList.filter((s) => s.operationalType === 'DISPATCHER' || s.role === 'EXECUTIVE').length;
  const totalDispatchees = staffList.filter((s) => s.operationalType === 'DISPATCHEE' || s.role !== 'EXECUTIVE').length;

  // Handle New Staff Registration
  const handleRegisterStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newBadgeId.trim() || !newTitle.trim()) {
      setStaffFeedbackMsg({ type: 'error', text: 'Please fill in all mandatory fields (Name, Title, Badge ID).' });
      return;
    }

    setIsSubmittingStaff(true);
    setStaffFeedbackMsg(null);

    const operationalType = newOperationalType || (newRole === 'EXECUTIVE' ? 'DISPATCHER' : 'DISPATCHEE');

    try {
      const res = await fetch('/api/municipal/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          role: newRole,
          operationalType,
          title: newTitle.trim(),
          department: newDept,
          departmentCode: newDeptCode,
          badgeId: newBadgeId.trim(),
          phone: newPhone.trim() || '+92 (300) 123-4567',
          email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, '.')}@cityscape.solutions`,
          cityName: newCityName,
          municipality: newMunicipality,
          wardZone: newWard,
          specialties: newSpecialties
            ? newSpecialties.split(',').map((s) => s.trim()).filter(Boolean)
            : ['General Infrastructure Engineering'],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to register municipal staff');
      }

      const resData = await res.json();
      setStaffFeedbackMsg({
        type: 'success',
        text: `Successfully registered ${resData.staff.name} as a ${operationalType === 'DISPATCHER' ? 'Dispatcher (Executive)' : 'Dispatchee (Field Specialist)'} for ${newCityName}!`,
      });

      // Reset form
      setNewName('');
      setNewTitle('');
      setNewBadgeId('');
      setNewPhone('');
      setNewEmail('');
      setNewSpecialties('');
      fetchData();
      setTimeout(() => {
        setIsRegisterModalOpen(false);
        setStaffFeedbackMsg(null);
      }, 1500);
    } catch (err: any) {
      setStaffFeedbackMsg({ type: 'error', text: err.message || 'Registration failed' });
    } finally {
      setIsSubmittingStaff(false);
    }
  };

  // Open Task Dispatch modal for a specific staff member
  const handleOpenDispatchModal = (staff: MunicipalStaffMember) => {
    setSelectedStaffForDispatch(staff);
    // Auto-select first open or unassigned report if available
    const openRep = reports.find((r) => r.status === 'OPEN' || !r.assignedStaffId);
    setSelectedReportId(openRep ? openRep.id : (reports[0]?.id || ''));
    setDispatchDirective(
      staff.role === 'EXECUTIVE' || staff.operationalType === 'DISPATCHER'
        ? 'Executive oversight, cross-agency coordination, and SLA enforcement.'
        : 'Immediate field inspection, public safety cordon, and high-durability infrastructure remediation.'
    );
    setDispatchFeedback(null);
    setIsDispatchModalOpen(true);
  };

  // Execute Task Dispatch (e.g. Mr. Kamran assigns Mr. Sagheer)
  const handleExecuteDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReportId || !selectedStaffForDispatch) {
      setDispatchFeedback({ type: 'error', text: 'Please select a valid report to assign.' });
      return;
    }

    setIsDispatching(true);
    setDispatchFeedback(null);

    try {
      const res = await fetch(`/api/reports/${selectedReportId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignedStaffId: selectedStaffForDispatch.id,
          assignedStaffName: selectedStaffForDispatch.name,
          assignedByExecutiveName: dispatchExecutiveName.trim() || 'Mr. Kamran (Chief Municipal Executive)',
          directive: dispatchDirective.trim(),
          priority: dispatchPriority,
          slaHours: dispatchSlaHours,
          department: selectedStaffForDispatch.department,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to dispatch assignment');
      }

      const resData = await res.json();
      setDispatchFeedback({
        type: 'success',
        text: `Task dispatched successfully! Dispatcher (${dispatchExecutiveName}) assigned Dispatchee (${selectedStaffForDispatch.name}). Resident and executive notified.`,
      });

      fetchData();
      if (onRefreshReports) onRefreshReports();

      // Dispatch global event so other tabs and maps reflect assignment immediately
      window.dispatchEvent(
        new CustomEvent('cityscape:assignment-updated', {
          detail: {
            reportId: selectedReportId,
            staffName: selectedStaffForDispatch.name,
            executiveName: dispatchExecutiveName,
          },
        })
      );

      setTimeout(() => {
        setIsDispatchModalOpen(false);
        setDispatchFeedback(null);
      }, 1600);
    } catch (err: any) {
      setDispatchFeedback({ type: 'error', text: err.message || 'Dispatch failed' });
    } finally {
      setIsDispatching(false);
    }
  };

  // Quick auto-fill badge id generator helper
  const handleDeptSelect = (deptCode: string) => {
    setNewDeptCode(deptCode);
    const deptNames: Record<string, string> = {
      DPW: 'Department of Public Works (DPW)',
      WASA: 'Water & Sanitation Agency (WASA)',
      TRANSIT: 'Traffic, Transit & Mobility Bureau',
      RESCUE: 'Emergency Services & Disaster Management (1122)',
      COUNCIL: 'City Council & Citizen Engagement Secretariat',
    };
    setNewDept(deptNames[deptCode] || deptCode);
    const randomNum = Math.floor(100 + Math.random() * 899);
    setNewBadgeId(`${deptCode}-${newRole === 'EXECUTIVE' ? 'EXEC' : 'FO'}-${randomNum}`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner: Municipal Staff & Executive Task Assignment Engine */}
      <div className="p-6 bg-gradient-to-br from-[#0A2540] via-[#0F365E] to-[#1E3A8A] text-white rounded-2xl border-2 border-slate-700 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold uppercase rounded-lg border border-amber-400/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Cityscape Registered Roster
              </span>
              <span className="px-3 py-1 bg-teal-500/20 text-teal-200 text-xs font-bold uppercase rounded-lg border border-teal-400/30 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-300" />
                Active Subscription City: <strong>{selectedCity}</strong>
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold rounded border border-emerald-400/30">
                Verified Municipal Enterprise Tier
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Municipal Staff Directory &amp; Executive Task Dispatch
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl font-medium">
              Registered municipal specialists (<strong>Dispatchees</strong>) are dispatched to field incidents by municipal executives (<strong>Dispatchers</strong>, e.g. <strong>Mr. Kamran</strong> assigning <strong>Mr. Sagheer</strong>). When an assignment is dispatched, both the executive and the resident are instantly notified through the app.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-4 py-3 bg-[#B45309] hover:bg-amber-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2 min-h-[48px] active:scale-97 border border-amber-400/50"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>Register New Staff</span>
            </button>
            <button
              onClick={fetchData}
              title="Refresh Staff Roster and Assignments"
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[48px] min-w-[48px] flex items-center justify-center border border-white/20"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* City Jurisdiction Subscription Selector Banner */}
        <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-200">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="font-bold text-white">
                Subscribed Municipal Jurisdictions (Geotagged Cities):
              </span>
            </div>
            <span className="text-[11px] text-slate-300">
              Staff &amp; Executive Dispatch active for all {subscriptions.length || PRESET_GEOTAGGED_CITIES.length} subscribed cities
            </span>
          </div>

          {/* Subscribed City Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {PRESET_GEOTAGGED_CITIES.map((c) => {
              const isCurrent = selectedCity.toLowerCase() === c.name.toLowerCase();
              return (
                <button
                  key={c.name}
                  onClick={() => setSelectedCity(c.name)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer min-h-[36px] flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-[#006D5B] text-white shadow-md border-2 border-teal-300 font-extrabold scale-102'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                  }`}
                >
                  <span className="text-sm">{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              );
            })}
            <button
              onClick={() => setSelectedCity('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer min-h-[36px] ${
                selectedCity === 'ALL'
                  ? 'bg-amber-500 text-[#0A2540] shadow-md font-black border-2 border-amber-300'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
              }`}
            >
              🌐 All Subscribed Jurisdictions
            </button>
          </div>

          {/* Active City Subscription Card Details */}
          {activeSubscription && (
            <div className="p-3 bg-black/25 rounded-lg border border-teal-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="text-lg">{activeSubscription.flagEmoji || '🏛️'}</span>
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{activeSubscription.municipalityName}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded border border-emerald-400/40 uppercase">
                      ● Active Gov Subscription
                    </span>
                  </div>
                  <div className="text-slate-300 text-[10px]">
                    Plan: <strong className="text-amber-300">{activeSubscription.planTier}</strong> • SLA: <strong className="text-teal-300">{activeSubscription.slaTier}</strong> • Capacity: <strong>{activeSubscription.seatsAssigned} Seats</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-slate-300 text-[10px]">
                <div>
                  Renewal: <span className="text-white font-semibold">{new Date(activeSubscription.renewalDate).toLocaleDateString()}</span>
                </div>
                <div className="px-2 py-1 bg-white/10 rounded font-mono text-slate-200">
                  {activeSubscription.poNumber || 'PO-2026-GOV'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Summary Counter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-700/80">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-[11px] text-slate-300 font-bold uppercase tracking-wider block">
              {selectedCity === 'ALL' ? 'Total Registered' : `${selectedCity} Staff`}
            </span>
            <span className="text-xl font-black text-white">{staffList.length}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider block">
              📢 Dispatchers (Executives)
            </span>
            <span className="text-xl font-black text-amber-300">{totalDispatchers}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-[11px] text-teal-300 font-bold uppercase tracking-wider block">
              🛠️ Dispatchees (Field Crew)
            </span>
            <span className="text-xl font-black text-teal-300">{totalDispatchees}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider block">
              Dispatched / On Duty
            </span>
            <span className="text-xl font-black text-emerald-300">
              {staffList.filter((s) => s.status === 'DISPATCHED').length} / {staffList.length}
            </span>
          </div>
        </div>
      </div>

      {/* Role Clarification Legend Box: Dispatcher vs Dispatchee */}
      <div className="p-4 bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="flex items-start space-x-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/60">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black shrink-0">
            📢
          </div>
          <div>
            <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
              DISPATCHER (Municipal Executive / Director)
            </h4>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
              <strong>Role &amp; Authority:</strong> Authorizes work orders, sets operational directives, assigns field specialists, enforces SLA compliance, and oversees cross-agency coordination (e.g. <strong>Mr. Kamran</strong>).
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 bg-teal-50 dark:bg-[#004D40]/30 rounded-xl border border-teal-200 dark:border-[#006D5B]/60">
          <div className="w-8 h-8 rounded-lg bg-[#006D5B] text-white flex items-center justify-center font-black shrink-0">
            🛠️
          </div>
          <div>
            <h4 className="font-bold text-[#006D5B] dark:text-teal-200 text-sm">
              DISPATCHEE (Field Officer / Technical Specialist)
            </h4>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
              <strong>Role &amp; Operations:</strong> Receives executive assignments, is dispatched on-site, executes physical infrastructure repairs, conducts quality inspections, and logs resolution photos (e.g. <strong>Mr. Sagheer</strong>).
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center justify-between gap-4 p-2 bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm flex-wrap">
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <button
            onClick={() => setActiveSubTab('roster')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-2 ${
              activeSubTab === 'roster'
                ? 'bg-[#006D5B] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff Roster &amp; Profiles ({staffList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('dispatch_feed')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-2 ${
              activeSubTab === 'dispatch_feed'
                ? 'bg-[#0A2540] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            <Radio className="w-4 h-4 text-amber-400" />
            <span>Executive Dispatch Stream ({assignments.length})</span>
          </button>
        </div>

        {onNavigateToTab && (
          <button
            onClick={() => onNavigateToTab('history')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer min-h-[40px]"
          >
            <History className="w-4 h-4" />
            <span>Open Task Assignment History &amp; Audit Log</span>
          </button>
        )}
      </div>

      {/* VIEW 1: STAFF ROSTER & DIRECTORY */}
      {activeSubTab === 'roster' && (
        <div className="space-y-5">
          {/* Search & Filter Bar */}
          <div className="p-4 bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff by name, badge ID, specialty or department..."
                className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#111827] dark:text-white outline-none focus:border-[#006D5B] min-h-[44px]"
              />
            </div>

            {/* Operational Classification Pill Filters (Dispatcher vs Dispatchee) */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-xl bg-slate-100 dark:bg-[#071B2F] p-1 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setSelectedOperationalTypeFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedOperationalTypeFilter === 'ALL'
                      ? 'bg-[#0A2540] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  All ({staffList.length})
                </button>
                <button
                  onClick={() => setSelectedOperationalTypeFilter('DISPATCHER')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    selectedOperationalTypeFilter === 'DISPATCHER'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950'
                  }`}
                >
                  <span>📢 Dispatchers ({totalDispatchers})</span>
                </button>
                <button
                  onClick={() => setSelectedOperationalTypeFilter('DISPATCHEE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    selectedOperationalTypeFilter === 'DISPATCHEE'
                      ? 'bg-[#006D5B] text-white shadow-xs'
                      : 'text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-950'
                  }`}
                >
                  <span>🛠️ Dispatchees ({totalDispatchees})</span>
                </button>
              </div>

              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#111827] dark:text-white min-h-[44px]"
              >
                <option value="ALL">All Departments</option>
                <option value="DPW">Public Works (DPW)</option>
                <option value="WASA">Water &amp; Sanitation (WASA)</option>
                <option value="TRANSIT">Traffic &amp; Transit Bureau</option>
                <option value="RESCUE">Emergency (Rescue 1122)</option>
                <option value="COUNCIL">City Council Secretariat</option>
              </select>

              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#111827] dark:text-white min-h-[44px]"
              >
                <option value="ALL">All Roles</option>
                <option value="EXECUTIVE">Executive / Director</option>
                <option value="FIELD_OFFICER">Field Officer / Specialist</option>
                <option value="INSPECTOR">Quality Inspector</option>
                <option value="SUPERVISOR">Crew Supervisor</option>
              </select>
            </div>
          </div>

          {/* Staff Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.length === 0 ? (
              <div className="col-span-full p-10 text-center bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-dashed border-[#CBD5E1] dark:border-slate-700 space-y-2">
                <Users className="w-8 h-8 mx-auto text-slate-400" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  No registered municipal staff found for {selectedCity !== 'ALL' ? selectedCity : 'the selected criteria'}.
                </p>
                <p className="text-xs text-slate-400">
                  Try switching city or changing role filters, or click &quot;Register New Staff&quot; above.
                </p>
              </div>
            ) : (
              filteredStaff.map((staff) => {
                const isDispatched = staff.status === 'DISPATCHED';
                const isDispatcher = staff.operationalType === 'DISPATCHER' || staff.role === 'EXECUTIVE';

                return (
                  <div
                    key={staff.id}
                    className={`p-5 bg-white dark:bg-[#0A2540] rounded-xl border-1.5 ${
                      isDispatcher
                        ? 'border-amber-300 dark:border-amber-800'
                        : 'border-[#CBD5E1] dark:border-slate-700'
                    } shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4`}
                  >
                    <div className="space-y-3">
                      {/* Top Operational Pill: DISPATCHER vs DISPATCHEE */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                        {isDispatcher ? (
                          <span className="px-2.5 py-1 bg-amber-100 text-[#B45309] dark:bg-amber-950 dark:text-amber-200 text-[11px] font-black uppercase rounded-lg border border-amber-300 flex items-center gap-1.5">
                            <span>📢 DISPATCHER</span>
                            <span className="font-medium text-[10px] text-slate-600 dark:text-slate-300">• Authorizing Executive</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-teal-100 text-[#006D5B] dark:bg-teal-950 dark:text-teal-200 text-[11px] font-black uppercase rounded-lg border border-teal-300 flex items-center gap-1.5">
                            <span>🛠️ DISPATCHEE</span>
                            <span className="font-medium text-[10px] text-slate-600 dark:text-slate-300">• Field Specialist / Crew</span>
                          </span>
                        )}

                        {/* Status Pill */}
                        <span
                          className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full tracking-wider ${
                            isDispatched
                              ? 'bg-amber-100 text-[#B45309] dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                          }`}
                        >
                          {isDispatched ? '● Dispatched' : '● Available'}
                        </span>
                      </div>

                      {/* Top Row: Avatar, Name, Title, City */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={staff.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                            alt={staff.name}
                            className={`w-12 h-12 rounded-xl object-cover border-2 ${
                              isDispatcher ? 'border-amber-400' : 'border-[#006D5B]'
                            } shadow-xs`}
                          />
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <h4 className="text-base font-bold text-[#111827] dark:text-white">
                                {staff.name}
                              </h4>
                              {isDispatcher && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-amber-200 text-amber-900 dark:bg-amber-900/80 dark:text-amber-200 font-bold rounded uppercase">
                                  EXEC
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                              {staff.title}
                            </p>
                            <span className="text-[11px] font-bold text-[#006D5B] dark:text-teal-300 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              <span>{staff.cityName || 'Rawalpindi'}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Department & Badge Information */}
                      <div className="p-3 bg-slate-50 dark:bg-[#071B2F] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                        <div className="flex items-center justify-between font-medium text-slate-700 dark:text-slate-300">
                          <span className="text-slate-500 dark:text-slate-400">Department:</span>
                          <span className="font-bold text-[#006D5B] dark:text-teal-300 truncate max-w-[170px]">
                            {staff.department}
                          </span>
                        </div>
                        <div className="flex items-center justify-between font-medium text-slate-700 dark:text-slate-300">
                          <span className="text-slate-500 dark:text-slate-400">Badge ID:</span>
                          <span className="font-mono font-bold text-[#0A2540] dark:text-white bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {staff.badgeId}
                          </span>
                        </div>
                        <div className="flex items-center justify-between font-medium text-slate-700 dark:text-slate-300">
                          <span className="text-slate-500 dark:text-slate-400">Contact:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{staff.phone}</span>
                        </div>
                        {staff.municipality && (
                          <div className="flex items-center justify-between font-medium text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                            <span className="text-slate-500 dark:text-slate-400">Jurisdiction:</span>
                            <span className="text-slate-700 dark:text-slate-300 truncate max-w-[170px]">
                              {staff.municipality}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Specialties tags */}
                      <div className="flex flex-wrap gap-1">
                        {staff.specialties.map((spec, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[10px] font-semibold border border-slate-200 dark:border-slate-700"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button: Dispatch Task */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                        Active Tasks: <strong className="text-[#006D5B] dark:text-teal-300">{staff.activeTasksCount}</strong>
                      </div>

                      <button
                        onClick={() => handleOpenDispatchModal(staff)}
                        className="px-4 py-2.5 bg-[#0A2540] hover:bg-[#006D5B] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs min-h-[40px] active:scale-97"
                      >
                        <Send className="w-3.5 h-3.5 text-amber-300" />
                        <span>{isDispatcher ? 'Delegate Oversight' : 'Dispatch Field Task'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: EXECUTIVE DISPATCH STREAM & TASK ASSIGNMENTS LOG */}
      {activeSubTab === 'dispatch_feed' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-[#111827] dark:text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#B45309]" />
                <span>Live Executive Task Assignment &amp; Dispatch Stream</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Every task assignment connects an authorizing <strong>Dispatcher</strong> (Executive) to a registered <strong>Dispatchee</strong> (Field Specialist).
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {assignments.length} Dispatches Recorded
            </span>
          </div>

          <div className="space-y-3">
            {assignments.length === 0 ? (
              <div className="p-10 text-center bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-dashed border-[#CBD5E1] dark:border-slate-700">
                <p className="text-sm font-bold text-slate-500">No task assignments logged for {selectedCity} yet.</p>
              </div>
            ) : (
              assignments.map((asgn) => {
                const targetReport = reports.find((r) => r.id === asgn.reportId);
                return (
                  <div
                    key={asgn.id}
                    className="p-5 bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-3.5 text-left"
                  >
                    {/* Header line: Report title + Priority + Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-[#004D40] text-[#006D5B] dark:text-teal-200 flex items-center justify-center font-bold shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono font-bold text-[#006D5B] dark:text-teal-300">
                              #{asgn.reportId.slice(0, 8)}
                            </span>
                            {asgn.cityName && (
                              <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded">
                                📍 {asgn.cityName}
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm sm:text-base text-[#111827] dark:text-white">
                            {asgn.reportTitle}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300">
                          {asgn.priority}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                          {asgn.status}
                        </span>
                      </div>
                    </div>

                    {/* Assignment Telemetry Box: Dispatcher -> Dispatchee */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-[#071B2F] rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-black text-[10px] uppercase rounded">
                            📢 DISPATCHER (EXECUTIVE)
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 font-bold text-[#0A2540] dark:text-white text-sm">
                          <ShieldCheck className="w-4 h-4 text-[#006D5B]" />
                          <span>{asgn.assignedByExecutiveName}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 block">
                          Dispatched: {new Date(asgn.assignedAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="px-2 py-0.5 bg-teal-100 dark:bg-teal-950 text-[#006D5B] dark:text-teal-200 font-black text-[10px] uppercase rounded">
                            🛠️ DISPATCHEE (FIELD SPECIALIST)
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 font-bold text-[#006D5B] dark:text-teal-300 text-sm">
                          <Briefcase className="w-4 h-4" />
                          <span>{asgn.assignedStaffName}</span>
                          <span className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-800 dark:text-slate-200">
                            {asgn.assignedStaffBadge}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block">Phone: {asgn.assignedStaffPhone}</span>
                      </div>
                    </div>

                    {/* Official Directive */}
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-950 dark:text-amber-200">
                      <strong className="block font-bold mb-0.5">Official Executive Directive:</strong>
                      <p className="leading-relaxed font-medium">{asgn.directive}</p>
                    </div>

                    {/* Citizen & Executive Notification Status */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Dispatched • Executive ({asgn.assignedByExecutiveName.split(' ')[0]}) and Resident Aware</span>
                        </span>
                      </div>

                      {targetReport && onSelectReport && (
                        <button
                          onClick={() => onSelectReport(targetReport)}
                          className="px-3 py-1.5 bg-[#006D5B] text-white rounded-lg font-bold text-xs hover:bg-[#0A2540] transition-colors cursor-pointer"
                        >
                          View Live Report
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: REGISTER NEW MUNICIPAL STAFF MEMBER FORM */}
      {/* ========================================================================= */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#0A2540] rounded-2xl shadow-2xl border-1.5 border-[#CBD5E1] dark:border-slate-700 p-6 sm:p-7 space-y-5 text-left my-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b-1.5 border-[#CBD5E1] dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#006D5B] text-white flex items-center justify-center font-bold shadow-md">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#111827] dark:text-white">
                    Register Municipal Staff Member
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Add registered specialist or executive to Cityscape Municipal Roster
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {staffFeedbackMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  staffFeedbackMsg.type === 'success'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border border-rose-300'
                }`}
              >
                {staffFeedbackMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{staffFeedbackMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleRegisterStaff} className="space-y-4">
              {/* Operational Classification Selection */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Operational Classification *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setNewOperationalType('DISPATCHEE');
                      setNewRole('FIELD_OFFICER');
                    }}
                    className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-all ${
                      newOperationalType === 'DISPATCHEE'
                        ? 'border-[#006D5B] bg-teal-50 dark:bg-[#004D40]/40 text-[#006D5B] dark:text-teal-200'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#071B2F] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span>🛠️ Dispatchee</span>
                    </div>
                    <p className="text-[10px] mt-0.5 leading-tight">
                      On-site Field Specialist / Crew
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewOperationalType('DISPATCHER');
                      setNewRole('EXECUTIVE');
                    }}
                    className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-all ${
                      newOperationalType === 'DISPATCHER'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#071B2F] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span>📢 Dispatcher</span>
                    </div>
                    <p className="text-[10px] mt-0.5 leading-tight">
                      Authorizing Executive / Director
                    </p>
                  </button>
                </div>
              </div>

              {/* City Jurisdiction */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    City Jurisdiction *
                  </label>
                  <select
                    value={newCityName}
                    onChange={(e) => {
                      setNewCityName(e.target.value);
                      setNewMunicipality(`${e.target.value} Municipal Corporation & DPW`);
                    }}
                    className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl min-h-[44px]"
                  >
                    {PRESET_GEOTAGGED_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.flag} {c.name} ({c.country})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Municipality Entity
                  </label>
                  <input
                    type="text"
                    value={newMunicipality}
                    onChange={(e) => setNewMunicipality(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Mr. Sagheer"
                    className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Designation / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Senior Asphalt Field Specialist"
                    className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Municipal Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setNewRole(val);
                      if (val === 'EXECUTIVE') setNewOperationalType('DISPATCHER');
                    }}
                    className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl min-h-[44px]"
                  >
                    <option value="FIELD_OFFICER">Field Officer / Specialist</option>
                    <option value="EXECUTIVE">Executive / Department Head</option>
                    <option value="INSPECTOR">Quality Inspector</option>
                    <option value="SUPERVISOR">Crew Supervisor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={newDeptCode}
                    onChange={(e) => handleDeptSelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl min-h-[44px]"
                  >
                    <option value="DPW">Public Works (DPW)</option>
                    <option value="WASA">Water &amp; Sanitation (WASA)</option>
                    <option value="TRANSIT">Traffic &amp; Transit Bureau</option>
                    <option value="RESCUE">Emergency Services (1122)</option>
                    <option value="COUNCIL">City Council Secretariat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Official Badge ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBadgeId}
                    onChange={(e) => setNewBadgeId(e.target.value)}
                    placeholder="e.g. DPW-FO-842"
                    className="w-full px-3.5 py-2.5 text-sm font-mono font-bold bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Verified Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+92 (333) 514-9921"
                    className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Specialties (comma separated)
                </label>
                <input
                  type="text"
                  value={newSpecialties}
                  onChange={(e) => setNewSpecialties(e.target.value)}
                  placeholder="e.g. Heavy Asphalt Compaction, Trench Leveling, Storm Drainage"
                  className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl min-h-[44px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStaff}
                  className="px-6 py-2.5 bg-[#006D5B] hover:bg-[#0A2540] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center gap-2 min-h-[44px]"
                >
                  {isSubmittingStaff ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  <span>Save Staff Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: QUICK TASK DISPATCH (EXECUTIVE ASSIGNMENT) MODAL */}
      {/* ========================================================================= */}
      {isDispatchModalOpen && selectedStaffForDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#0A2540] rounded-2xl shadow-2xl border-1.5 border-[#CBD5E1] dark:border-slate-700 p-6 sm:p-7 space-y-5 text-left my-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b-1.5 border-[#CBD5E1] dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A2540] text-amber-300 flex items-center justify-center font-bold shadow-md">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#111827] dark:text-white">
                    Executive Task Dispatch Order
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Assigning Dispatchee: <strong>{selectedStaffForDispatch.name}</strong> ({selectedStaffForDispatch.badgeId}) • {selectedStaffForDispatch.cityName || selectedCity}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {dispatchFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  dispatchFeedback.type === 'success'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border border-rose-300'
                }`}
              >
                {dispatchFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{dispatchFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handleExecuteDispatch} className="space-y-4">
              {/* Select Report */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Select Civic Report to Dispatch *
                </label>
                <select
                  value={selectedReportId}
                  onChange={(e) => setSelectedReportId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl min-h-[44px]"
                >
                  {reports.map((r) => (
                    <option key={r.id} value={r.id}>
                      [{r.status}] #{r.id.slice(0, 8)} - {r.title} ({r.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Assigning Executive (Dispatcher) */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Assigning Municipal Executive (Dispatcher) *
                </label>
                <input
                  type="text"
                  required
                  value={dispatchExecutiveName}
                  onChange={(e) => setDispatchExecutiveName(e.target.value)}
                  placeholder="e.g. Mr. Kamran (Chief Municipal Executive)"
                  className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={dispatchPriority}
                    onChange={(e) => setDispatchPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl min-h-[44px]"
                  >
                    <option value="CRITICAL">CRITICAL (Immediate)</option>
                    <option value="HIGH">HIGH (Within 12h)</option>
                    <option value="STANDARD">STANDARD (24h-48h)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    SLA Target Hours
                  </label>
                  <input
                    type="number"
                    value={dispatchSlaHours}
                    onChange={(e) => setDispatchSlaHours(Number(e.target.value))}
                    min={1}
                    max={168}
                    className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl min-h-[44px]"
                  />
                </div>
              </div>

              {/* Official Directive */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Official Directive &amp; Operational Instructions
                </label>
                <textarea
                  rows={3}
                  value={dispatchDirective}
                  onChange={(e) => setDispatchDirective(e.target.value)}
                  placeholder="e.g. Execute fast asphalt compaction, ensure safety coning, and provide photo documentation."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="p-3 bg-teal-50 dark:bg-[#004D40] rounded-xl border border-[#006D5B] text-xs text-[#006D5B] dark:text-teal-200">
                <span className="font-bold block mb-0.5">Two-Way Notification Guarantee:</span>
                <p>
                  Upon dispatch, dispatcher <strong>{dispatchExecutiveName}</strong> and the reporting resident are both updated in real-time that dispatchee <strong>{selectedStaffForDispatch.name} ({selectedStaffForDispatch.badgeId})</strong> has been dispatched.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDispatching}
                  className="px-6 py-2.5 bg-[#B45309] hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center gap-2 min-h-[44px]"
                >
                  {isDispatching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Confirm &amp; Dispatch Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
