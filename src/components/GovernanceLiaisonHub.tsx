import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  ShieldCheck,
  ArrowRight,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  RefreshCw,
  Search,
  MessageSquare,
  BadgeCheck,
  FileText,
  UserCheck,
  Droplets,
  Zap,
  Wrench,
  ChevronRight,
  ExternalLink,
  Info,
  ShieldAlert,
  ArrowUpRight,
  MapPin,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import {
  GovernanceLiaisonCase,
  Report,
  MunicipalLiaisonStatus,
  UserPersona,
  ReportCategory,
  SeverityLevel,
} from '../types';
import { PRESET_GATED_COMMUNITIES } from '../data/estateData';

interface GovernanceLiaisonHubProps {
  userPersona: UserPersona;
  currentEstateId?: string;
  onSelectReport?: (reportId: string) => void;
  onEscalationSuccess?: (updatedReport: Report) => void;
}

export const INITIAL_LIAISON_CASES: GovernanceLiaisonCase[] = [
  {
    id: 'liaison-case-101',
    reportId: 'rep-muni-101',
    caseNumber: 'LIAISON-2026-DPW-084',
    title: 'Main WASA Water Trunk Line Burst at Outer Access Road (Gate 1)',
    description: 'High-pressure 12-inch municipal feeder pipe burst 40 meters outside the main society security perimeter, causing localized road sinking and flooding into the resident entrance ramp.',
    category: 'WATER_LEAK',
    severity: 'CRITICAL',
    estateId: 'comm-royal-palms',
    estateName: 'Royal Palms Gated Estate',
    unitPlotNumber: 'Gate 1 External Feeder Road',
    cityName: 'Rawalpindi',
    municipalityName: 'Rawalpindi Municipal Corporation & WASA',
    targetDepartment: 'WASA',
    escalatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    escalatedByHoaAdminName: 'Col. Tariq Mahmood (HOA Infrastructure Lead)',
    escalationReason: 'The burst pipe is part of the citywide 12" main municipal transmission conduit before the society bulk water meter.',
    jurisdictionArgument: 'Section 14(b) Municipal Water By-laws 2024: Main conduits outside bulk compound meters are the statutory maintenance responsibility of WASA.',
    status: 'ACCEPTED_BY_MUNICIPAL',
    municipalReviewNotes: 'WASA Rapid Response Crew #3 dispatched with excavation machinery. Isolation valve shutoff initiated on Main Grand Trunk Feed.',
    municipalReviewerName: 'Chief Eng. Arshad Malik (WASA Executive)',
    municipalAssignedOfficer: 'Officer Bilal Ahmad (WASA Specialist - Badge #WASA-402)',
    municipalEstimatedResolutionDays: 1,
    lastUpdated: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
  },
  {
    id: 'liaison-case-102',
    reportId: 'rep-muni-102',
    caseNumber: 'LIAISON-2026-TRANSIT-092',
    title: 'Public Feeder Highway Traffic Signal Synchronization at Society Junction',
    description: 'The traffic signal cycle on the public arterial avenue outside Gulberg Greens entrance causes 35-minute morning gridlock for 1,200 residential commuters.',
    category: 'ROADS_TRAFFIC',
    severity: 'HIGH',
    estateId: 'comm-gulberg-greens',
    estateName: 'Gulberg Greens Civic Community',
    unitPlotNumber: 'Avenue 1 Outer Intersection',
    cityName: 'Islamabad',
    municipalityName: 'Capital Development Authority (CDA)',
    targetDepartment: 'TRANSIT',
    escalatedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    escalatedByHoaAdminName: 'Rashid Khan (Society General Secretary)',
    escalationReason: 'Traffic signal control box is municipally owned and cannot be calibrated by private HOA security staff.',
    jurisdictionArgument: 'City Traffic Engineering Directorate holds exclusive jurisdiction over municipal road signal phasing.',
    status: 'WORK_IN_PROGRESS',
    municipalReviewNotes: 'Traffic Engineering Bureau scheduled a field calibration team to update green signal phase duration to 90 seconds during peak 07:30 - 09:30 AM hours.',
    municipalReviewerName: 'Director Farooq Siddiqui (CDA Transit)',
    municipalAssignedOfficer: 'Eng. Usman Tariq (Traffic Signals Dept)',
    municipalEstimatedResolutionDays: 2,
    lastUpdated: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
  },
  {
    id: 'liaison-case-103',
    reportId: 'rep-muni-103',
    caseNumber: 'LIAISON-2026-DPW-095',
    title: 'Stormwater Drainage Overflow Encroaching Society Boundary Wall',
    description: 'Municipal open storm nullah blocked by debris 200m downstream, causing backflow into private society green belt and retaining wall.',
    category: 'SANITATION',
    severity: 'HIGH',
    estateId: 'comm-silver-oaks',
    estateName: 'Silver Oaks Luxury Residences',
    unitPlotNumber: 'Perimeter Wall South Sector',
    cityName: 'Lahore',
    municipalityName: 'Lahore Metropolitan Corporation & LWMC',
    targetDepartment: 'DPW',
    escalatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    escalatedByHoaAdminName: 'Brig. Saleem Akhtar (Estate Admin)',
    escalationReason: 'The blockage is located in the municipal natural drainage easement, outside private estate boundary.',
    jurisdictionArgument: 'Municipal Drainage Act: Clearing municipal nullah channels is mandated under City Public Works jurisdiction.',
    status: 'PENDING_MUNICIPAL_REVIEW',
    lastUpdated: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
];

export const GovernanceLiaisonHub: React.FC<GovernanceLiaisonHubProps> = ({
  userPersona,
  currentEstateId = 'comm-royal-palms',
  onSelectReport,
  onEscalationSuccess,
}) => {
  const [cases, setCases] = useState<GovernanceLiaisonCase[]>(() => {
    try {
      const saved = localStorage.getItem('cityscape_liaison_cases');
      return saved ? JSON.parse(saved) : INITIAL_LIAISON_CASES;
    } catch {
      return INITIAL_LIAISON_CASES;
    }
  });

  const [selectedCase, setSelectedCase] = useState<GovernanceLiaisonCase | null>(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');

  // Escalation Form Modal State (For HOA Admins)
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [escalateTitle, setEscalateTitle] = useState('');
  const [escalateDesc, setEscalateDesc] = useState('');
  const [escalateCategory, setEscalateCategory] = useState<ReportCategory>('WATER_LEAK');
  const [escalateSeverity, setEscalateSeverity] = useState<SeverityLevel>('HIGH');
  const [escalateDept, setEscalateDept] = useState<'DPW' | 'WASA' | 'TRANSIT' | 'RESCUE' | 'COUNCIL'>('WASA');
  const [escalateReason, setEscalateReason] = useState('');
  const [escalateJurisdictionArg, setEscalateJurisdictionArg] = useState('');
  const [escalateUnitPlot, setEscalateUnitPlot] = useState('');
  const [escalateEstateName, setEscalateEstateName] = useState(
    PRESET_GATED_COMMUNITIES.find((e) => e.id === currentEstateId)?.estateName || 'Royal Palms Gated Estate'
  );
  const [isSubmittingEscalation, setIsSubmittingEscalation] = useState(false);

  // Municipal Response Form State (For Municipal Staff)
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [responseAction, setResponseAction] = useState<MunicipalLiaisonStatus>('ACCEPTED_BY_MUNICIPAL');
  const [responseNotes, setResponseNotes] = useState('');
  const [assignedOfficerName, setAssignedOfficerName] = useState('Officer Imran Khan (Municipal Senior Inspector)');
  const [estimatedDays, setEstimatedDays] = useState<number>(1);
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cityscape_liaison_cases', JSON.stringify(cases));
    } catch (e) {
      console.warn('Liaison cases save warning:', e);
    }
  }, [cases]);

  // Filter cases based on persona and criteria
  const filteredCases = cases.filter((c) => {
    // If HOA Admin, prioritize or filter to current estate if relevant
    if (userPersona === 'HOA_ADMIN' && currentEstateId && c.estateId !== currentEstateId) {
      // Allow viewing all or estate specific
    }
    if (activeStatusFilter !== 'ALL' && c.status !== activeStatusFilter) return false;
    if (selectedDeptFilter !== 'ALL' && c.targetDepartment !== selectedDeptFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.estateName.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.targetDepartment.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handle HOA Escalation Submit
  const handleCreateEscalation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalateTitle.trim() || !escalateReason.trim()) {
      alert('Please fill out the issue title and the reason for municipal escalation.');
      return;
    }

    setIsSubmittingEscalation(true);
    const newCaseNumber = `LIAISON-2026-${escalateDept}-${Math.floor(100 + Math.random() * 900)}`;
    const newCase: GovernanceLiaisonCase = {
      id: `liaison-${Date.now()}`,
      reportId: `rep-hoa-esc-${Date.now()}`,
      caseNumber: newCaseNumber,
      title: escalateTitle.trim(),
      description: escalateDesc.trim() || escalateTitle.trim(),
      category: escalateCategory,
      severity: escalateSeverity,
      estateId: currentEstateId,
      estateName: escalateEstateName,
      unitPlotNumber: escalateUnitPlot.trim() || 'Estate Boundary / Main Gate',
      cityName: 'Rawalpindi',
      municipalityName: 'Rawalpindi Municipal Corporation & WASA',
      targetDepartment: escalateDept,
      escalatedAt: new Date().toISOString(),
      escalatedByHoaAdminName: 'HOA Governance & Infrastructure Committee',
      escalationReason: escalateReason.trim(),
      jurisdictionArgument:
        escalateJurisdictionArg.trim() ||
        `Section 12 Infrastructure Act: Infrastructure outside internal compound limits falls under ${escalateDept} statutory authority.`,
      status: 'PENDING_MUNICIPAL_REVIEW',
      lastUpdated: new Date().toISOString(),
    };

    setCases((prev) => [newCase, ...prev]);
    setIsSubmittingEscalation(false);
    setIsEscalateModalOpen(false);
    setSelectedCase(newCase);
    showToast(`🏛️ Escalated to Municipal ${escalateDept}! Tracking ID: ${newCaseNumber}`);

    // Reset Form
    setEscalateTitle('');
    setEscalateDesc('');
    setEscalateReason('');
    setEscalateJurisdictionArg('');
    setEscalateUnitPlot('');
  };

  // Handle Municipal Staff Response Submit
  const handleMunicipalResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    if (!responseNotes.trim()) {
      alert('Please enter official review notes or instructions for the HOA Admin.');
      return;
    }

    setIsSubmittingResponse(true);
    const updatedCase: GovernanceLiaisonCase = {
      ...selectedCase,
      status: responseAction,
      municipalReviewNotes: responseNotes.trim(),
      municipalReviewerName: 'Eng. Arshad Malik (Municipal Deputy Director)',
      municipalAssignedOfficer: responseAction === 'ACCEPTED_BY_MUNICIPAL' ? assignedOfficerName : undefined,
      municipalEstimatedResolutionDays: responseAction === 'ACCEPTED_BY_MUNICIPAL' ? estimatedDays : undefined,
      lastUpdated: new Date().toISOString(),
    };

    setCases((prev) => prev.map((c) => (c.id === selectedCase.id ? updatedCase : c)));
    setSelectedCase(updatedCase);
    setIsSubmittingResponse(false);
    setIsResponseModalOpen(false);

    const actionText =
      responseAction === 'ACCEPTED_BY_MUNICIPAL'
        ? 'Accepted by Municipal Desk & Crew Assigned'
        : responseAction === 'REJECTED_HOA_JURISDICTION'
        ? 'Marked as Internal Private HOA Responsibility'
        : 'Joint Resolution Plan Formulated';

    showToast(`✅ Official Response Logged: ${actionText}`);
  };

  const getStatusBadge = (status: MunicipalLiaisonStatus) => {
    switch (status) {
      case 'ACCEPTED_BY_MUNICIPAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-black text-xs border border-emerald-300 dark:border-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Accepted by Municipal DPW
          </span>
        );
      case 'PENDING_MUNICIPAL_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-black text-xs border border-amber-300 dark:border-amber-700 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            Pending Municipal Review
          </span>
        );
      case 'WORK_IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 font-black text-xs border border-blue-300 dark:border-blue-700">
            <Wrench className="w-3.5 h-3.5" />
            Municipal Crew On-Site
          </span>
        );
      case 'REJECTED_HOA_JURISDICTION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 font-black text-xs border border-rose-300 dark:border-rose-700">
            <ShieldAlert className="w-3.5 h-3.5" />
            Private HOA Jurisdiction
          </span>
        );
      case 'JOINT_RESOLUTION':
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-300 font-black text-xs border border-teal-300 dark:border-teal-700">
            <BadgeCheck className="w-3.5 h-3.5" />
            Jointly Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner: Civic Governance Liaison Architecture */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0A2540] via-[#0C3052] to-[#004D40] text-white border-2 border-[#CBD5E1] dark:border-slate-700 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-[#006D5B]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-wider text-teal-300">
              <Building2 className="w-3.5 h-3.5" />
              <span>Cross-Jurisdiction Governance Liaison Bridge</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              HOA &amp; Municipal Administration Liaison
            </h2>
            <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
              Seamlessly bridge private gated communities and public municipal departments. Escalate boundary infrastructure issues, water trunk lines, road synchronizations, and utility easements with statutory audit trails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Primary Action Button based on Persona */}
            {userPersona === 'HOA_ADMIN' || userPersona === 'RESIDENT' ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsEscalateModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#B45309] to-[#D97706] text-white font-black text-sm shadow-lg hover:shadow-xl flex items-center gap-2 border border-amber-400/40 cursor-pointer min-h-[48px]"
              >
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                <span>Escalate Issue to Municipal DPW</span>
              </motion.button>
            ) : (
              <div className="px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-xs font-bold text-teal-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Municipal Review Authority Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] font-bold text-slate-300 uppercase block">Total Liaison Inquiries</span>
            <span className="text-2xl font-black font-mono text-white">{cases.length}</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] font-bold text-amber-300 uppercase block">Pending Gov Review</span>
            <span className="text-2xl font-black font-mono text-amber-300">
              {cases.filter((c) => c.status === 'PENDING_MUNICIPAL_REVIEW').length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] font-bold text-emerald-300 uppercase block">Accepted &amp; Dispatched</span>
            <span className="text-2xl font-black font-mono text-emerald-300">
              {cases.filter((c) => c.status === 'ACCEPTED_BY_MUNICIPAL' || c.status === 'WORK_IN_PROGRESS').length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] font-bold text-teal-300 uppercase block">Avg Gov Response Time</span>
            <span className="text-2xl font-black font-mono text-teal-300">3.2 Hours</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0A2540] border-1.5 border-[#CBD5E1] dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by case number, estate, keyword or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#006D5B]"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500">Dept:</span>
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="WASA">WASA (Water &amp; Sanitation)</option>
            <option value="DPW">DPW (Public Works &amp; Drainage)</option>
            <option value="TRANSIT">Transit (Signals &amp; Roads)</option>
            <option value="RESCUE">Rescue 1122 &amp; Emergency</option>
            <option value="COUNCIL">City Council &amp; Bylaws</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500">Status:</span>
          <select
            value={activeStatusFilter}
            onChange={(e) => setActiveStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING_MUNICIPAL_REVIEW">Pending Review</option>
            <option value="ACCEPTED_BY_MUNICIPAL">Accepted &amp; Assigned</option>
            <option value="WORK_IN_PROGRESS">Crew On-Site</option>
            <option value="REJECTED_HOA_JURISDICTION">Private HOA Scope</option>
            <option value="JOINT_RESOLUTION">Joint Resolved</option>
          </select>
        </div>
      </div>

      {/* Main Content Grid: Cases List & Selected Case Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Liaison Cases Feed */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Cross-Jurisdiction Cases ({filteredCases.length})
            </span>
            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold">
              Synced with Municipal Dispatch Ledger
            </span>
          </div>

          {filteredCases.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-[#0A2540] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
              <Building2 className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="font-bold text-sm text-slate-700 dark:text-slate-200">No Liaison Inquiries Found</p>
              <p className="text-xs text-slate-500">Try adjusting your search query or department filter.</p>
            </div>
          ) : (
            filteredCases.map((item) => {
              const isSelected = selectedCase?.id === item.id;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedCase(item)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer bg-white dark:bg-[#0A2540] ${
                    isSelected
                      ? 'border-[#006D5B] dark:border-teal-400 shadow-md ring-2 ring-[#006D5B]/20'
                      : 'border-[#CBD5E1] dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-blue-700 dark:text-blue-300">
                          {item.caseNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                          {item.targetDepartment}
                        </span>
                      </div>
                      <h4 className="font-black text-sm text-[#0A2540] dark:text-white line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#006D5B]" />
                        <span>{item.estateName}</span>
                        <span>•</span>
                        <span>{item.unitPlotNumber}</span>
                      </p>
                    </div>

                    <div className="shrink-0 text-right space-y-1">
                      {getStatusBadge(item.status)}
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {new Date(item.escalatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Summary row */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">
                      Escalated By: <strong className="text-slate-700 dark:text-slate-300">{item.escalatedByHoaAdminName}</strong>
                    </span>
                    <span className="text-[#006D5B] dark:text-teal-300 font-bold flex items-center gap-1">
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Right Column: Case Inspector & Action Console */}
        <div className="lg:col-span-5">
          {selectedCase ? (
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0A2540] border-2 border-[#CBD5E1] dark:border-slate-800 shadow-md space-y-4 sticky top-24">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">CASE FILE #{selectedCase.caseNumber}</span>
                  <h3 className="font-black text-base text-[#0A2540] dark:text-white">{selectedCase.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status & Department Details */}
              <div className="flex items-center justify-between">
                <div>{getStatusBadge(selectedCase.status)}</div>
                <div className="text-xs font-mono font-bold text-slate-500">
                  Target: <span className="text-blue-600 dark:text-blue-400">{selectedCase.targetDepartment} Dept</span>
                </div>
              </div>

              {/* Society & Location Details */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gated Community:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedCase.estateName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Specific Location:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedCase.unitPlotNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Municipal Agency:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedCase.municipalityName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Escalated By:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedCase.escalatedByHoaAdminName}</span>
                </div>
              </div>

              {/* Statutory Jurisdiction Rationale */}
              <div className="space-y-1 text-xs">
                <span className="font-black text-slate-700 dark:text-slate-300 uppercase text-[10px] flex items-center gap-1">
                  <FileText className="w-3 h-3 text-[#006D5B]" />
                  Statutory Jurisdiction Rationale
                </span>
                <p className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs leading-relaxed font-medium">
                  {selectedCase.jurisdictionArgument}
                </p>
              </div>

              {/* Official Municipal Response Section */}
              <div className="space-y-1 text-xs">
                <span className="font-black text-slate-700 dark:text-slate-300 uppercase text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  Official Municipal Review &amp; Dispatch Status
                </span>
                {selectedCase.municipalReviewNotes ? (
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200 space-y-2 text-xs">
                    <p className="font-medium">{selectedCase.municipalReviewNotes}</p>
                    {selectedCase.municipalAssignedOfficer && (
                      <div className="pt-2 border-t border-blue-200/60 dark:border-blue-800/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 dark:text-slate-400">Assigned Specialist:</span>
                        <strong className="text-blue-900 dark:text-blue-300 font-mono">
                          {selectedCase.municipalAssignedOfficer}
                        </strong>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 text-xs italic">
                    Awaiting review from Municipal Duty Supervisor.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {userPersona === 'MUNICIPAL_STAFF' ? (
                  <button
                    onClick={() => {
                      setResponseAction('ACCEPTED_BY_MUNICIPAL');
                      setResponseNotes(selectedCase.municipalReviewNotes || '');
                      setIsResponseModalOpen(true);
                    }}
                    className="w-full py-3 rounded-2xl bg-[#006D5B] hover:bg-[#004D40] text-white font-black text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Provide Official Municipal Response &amp; Crew Assignment</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        showToast(`Status refresh requested for ${selectedCase.caseNumber}`);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Ping Municipal Lead</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#0A2540]/60 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
              <Building2 className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
              <h4 className="font-black text-sm text-slate-700 dark:text-slate-300">Select a Liaison Case to Inspect</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                View full statutory jurisdiction arguments, society boundary blueprints, and direct municipal department dispatch records.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: HOA Escalation to Municipal DPW Modal */}
      <AnimatePresence>
        {isEscalateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="w-full max-w-2xl bg-white dark:bg-[#0A2540] rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-700 shadow-2xl p-6 sm:p-7 space-y-5 text-left text-slate-900 dark:text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#006D5B] text-white flex items-center justify-center font-black">
                    <ArrowUpRight className="w-5 h-5 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                      Escalate HOA Issue to Municipal Authority
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Formally bridge a community request to the city municipal public works desk.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEscalateModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateEscalation} className="space-y-4 text-xs">
                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-200 mb-1">
                    Gated Community / Estate
                  </label>
                  <select
                    value={escalateEstateName}
                    onChange={(e) => setEscalateEstateName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                  >
                    {PRESET_GATED_COMMUNITIES.map((c) => (
                      <option key={c.id} value={c.estateName}>
                        {c.estateName} ({c.phaseSector})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-black text-slate-700 dark:text-slate-200 mb-1">
                      Target Municipal Department
                    </label>
                    <select
                      value={escalateDept}
                      onChange={(e) => setEscalateDept(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-blue-900 dark:text-blue-300"
                    >
                      <option value="WASA">WASA (Water &amp; Sanitation)</option>
                      <option value="DPW">DPW (Public Works &amp; Infrastructure)</option>
                      <option value="TRANSIT">Transit (Signals &amp; Highways)</option>
                      <option value="RESCUE">Emergency 1122 Services</option>
                      <option value="COUNCIL">City Council &amp; Municipal Bylaws</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 dark:text-slate-200 mb-1">
                      Location / Plot / Outer Boundary
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Main Gate 1 Feeder Road or North Boundary Wall"
                      value={escalateUnitPlot}
                      onChange={(e) => setEscalateUnitPlot(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-200 mb-1">
                    Issue Title / Incident Summary *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Main 12-inch WASA Water Line Leak outside Gate 1"
                    value={escalateTitle}
                    onChange={(e) => setEscalateTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-200 mb-1">
                    Why does this require Municipal Jurisdiction? *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Explain why this falls outside private HOA internal maintenance (e.g. municipal water line before bulk meter, public highway intersection, external nullah drainage)."
                    value={escalateReason}
                    onChange={(e) => setEscalateReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-200 mb-1">
                    Statutory By-law or Jurisdiction Reference (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Section 14(b) Municipal Water By-laws 2024 (Main transmission line responsibility)"
                    value={escalateJurisdictionArg}
                    onChange={(e) => setEscalateJurisdictionArg(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setIsEscalateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingEscalation}
                    className="px-6 py-2.5 rounded-xl bg-[#006D5B] hover:bg-[#004D40] text-white font-black flex items-center gap-2 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmittingEscalation ? 'Dispatching...' : 'Dispatch Escalation'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Municipal Response & Officer Assignment Modal */}
      <AnimatePresence>
        {isResponseModalOpen && selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="w-full max-w-xl bg-white dark:bg-[#0A2540] rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-700 shadow-2xl p-6 sm:p-7 space-y-5 text-left text-slate-900 dark:text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <div>
                  <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                    Official Municipal Response &amp; Crew Assignment
                  </h3>
                  <p className="text-xs text-slate-500">Case: {selectedCase.caseNumber}</p>
                </div>
                <button
                  onClick={() => setIsResponseModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleMunicipalResponse} className="space-y-4 text-xs">
                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-200 mb-1">
                    Jurisdiction Determination Decision *
                  </label>
                  <select
                    value={responseAction}
                    onChange={(e) => setResponseAction(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-black text-blue-900 dark:text-blue-300"
                  >
                    <option value="ACCEPTED_BY_MUNICIPAL">
                      ✅ Accept Escalation (Municipal Public Works Statutory Responsibility)
                    </option>
                    <option value="WORK_IN_PROGRESS">
                      🚧 In Progress (Municipal Field Crew On-Site)
                    </option>
                    <option value="REJECTED_HOA_JURISDICTION">
                      🛑 Decline (Private Internal Estate HOA Scope)
                    </option>
                    <option value="JOINT_RESOLUTION">
                      🤝 Formulate Joint Municipal &amp; HOA Resolution
                    </option>
                  </select>
                </div>

                {responseAction === 'ACCEPTED_BY_MUNICIPAL' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-black text-slate-700 dark:text-slate-200 mb-1">
                        Assign Municipal Officer / Specialist
                      </label>
                      <input
                        type="text"
                        value={assignedOfficerName}
                        onChange={(e) => setAssignedOfficerName(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-black text-slate-700 dark:text-slate-200 mb-1">
                        Est. Resolution (Days)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={estimatedDays}
                        onChange={(e) => setEstimatedDays(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-200 mb-1">
                    Official Response Notes &amp; Action Directives *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide official directives, scheduled crew details, or reason for jurisdiction determination."
                    value={responseNotes}
                    onChange={(e) => setResponseNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setIsResponseModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingResponse}
                    className="px-6 py-2.5 rounded-xl bg-[#006D5B] hover:bg-[#004D40] text-white font-black flex items-center gap-2 shadow-md"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{isSubmittingResponse ? 'Saving...' : 'Save Official Response'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 right-6 z-50 bg-[#0A2540] text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-teal-500 flex items-center gap-3 text-xs font-bold font-['Montserrat']"
          >
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
