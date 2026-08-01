import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldAlert,
  SlidersHorizontal,
  UserCheck,
  X,
  Upload,
  Sparkles,
  Filter,
  Siren,
} from 'lucide-react';
import { Report, ReportStatus } from '../types';
import { STATUS_CONFIG, CATEGORY_CONFIG, SEVERITY_CONFIG } from '../lib/constants';
import { CategoryIcon } from './CategoryIcon';
import { ReportMapDirections } from './ReportMapDirections';
import { readFileAsBase64, formatTimeAgo } from '../lib/utils';

interface AdminDashboardProps {
  reports: Report[];
  onUpdateStatus: (
    reportId: string,
    status: ReportStatus,
    officialNote?: string,
    resolutionImageUrl?: string,
    assignedWorker?: string
  ) => Promise<void>;
  onSelectReport: (report: Report) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  reports,
  onUpdateStatus,
  onSelectReport,
}) => {
  const [selectedReportForEdit, setSelectedReportForEdit] = useState<Report | null>(null);
  const [newStatus, setNewStatus] = useState<ReportStatus>('IN_PROGRESS');
  const [officialNote, setOfficialNote] = useState('');
  const [assignedWorker, setAssignedWorker] = useState('');
  const [resolutionPhoto, setResolutionPhoto] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const columns: { status: ReportStatus; title: string; colorHex: string; bgHeader: string }[] = [
    { status: 'OPEN', title: 'Open / Unassigned', colorHex: '#EF4444', bgHeader: 'bg-red-50 text-red-800 border-red-200' },
    { status: 'IN_PROGRESS', title: 'In Progress / Dispatched', colorHex: '#F59E0B', bgHeader: 'bg-amber-50 text-amber-800 border-amber-200' },
    { status: 'RESOLVED', title: 'Resolved / Work Done', colorHex: '#10B981', bgHeader: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { status: 'REJECTED', title: 'Rejected / Duplicate', colorHex: '#64748B', bgHeader: 'bg-slate-100 text-slate-800 border-slate-200' },
  ];

  const handleOpenEditModal = (report: Report) => {
    setSelectedReportForEdit(report);
    setNewStatus(report.status);
    setOfficialNote(report.officialNote || '');
    setAssignedWorker(report.assignedWorker || 'Public Works Crew A');
    setResolutionPhoto(report.resolutionImageUrl || null);
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReportForEdit) return;

    setIsUpdating(true);
    try {
      await onUpdateStatus(
        selectedReportForEdit.id,
        newStatus,
        officialNote,
        resolutionPhoto || undefined,
        assignedWorker
      );

      // Trigger confetti if newly resolved!
      if (newStatus === 'RESOLVED' && selectedReportForEdit.status !== 'RESOLVED') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      setSelectedReportForEdit(null);
    } catch (err) {
      console.error('Failed to update report status', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await readFileAsBase64(file);
      setResolutionPhoto(base64);
    }
  };

  const aiFlaggedCount = reports.filter(r => r.isFlaggedAsAiFake || r.aiForensics?.isAiGenerated).length;

  const filteredReports = reports.filter((r) => {
    if (categoryFilter === 'AI_FLAGGED') return r.isFlaggedAsAiFake || r.aiForensics?.isAiGenerated;
    if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Municipal Operations Header Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-[#004d4d] text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-700 font-['Montserrat']">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              Municipal Operations Portal
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-black tracking-tight text-white">City Infrastructure Work Orders</h2>
          <p className="text-xs text-slate-300">
            Triage resident filings, dispatch public works maintenance crews, and publish resolution updates.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center space-x-2 bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
          <Filter className="w-4 h-4 text-slate-400 ml-1" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 text-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-700 outline-none"
          >
            <option value="ALL">All Categories ({reports.length})</option>
            <option value="AI_FLAGGED">⚠️ AI Fake Pictures Flagged ({aiFlaggedCount})</option>
            {Object.keys(CATEGORY_CONFIG).map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colReports = filteredReports.filter((r) => r.status === col.status);

          return (
            <div
              key={col.status}
              className="soft-card p-3.5 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className={`p-3 rounded-2xl border ${col.bgHeader} flex items-center justify-between mb-3 shadow-2xs font-heading font-black`}>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: col.colorHex }} />
                  <span>{col.title}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/90 text-slate-900 shadow-2xs">
                  {colReports.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {colReports.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 font-bold text-xs border-2 border-dashed border-white/60 rounded-2xl my-4">
                    No tickets in {col.status.toLowerCase().replace('_', ' ')}
                  </div>
                ) : (
                  colReports.map((report) => {
                    const catConf = CATEGORY_CONFIG[report.category] || CATEGORY_CONFIG.OTHER;
                    const sevConf = SEVERITY_CONFIG[report.severity] || SEVERITY_CONFIG.MEDIUM;
                    const isEmergency = report.category === 'EMERGENCY';

                    return (
                      <div
                        key={report.id}
                        className={`rounded-2xl p-3.5 border transition-all space-y-2.5 ${
                          isEmergency
                            ? 'bg-red-50 dark:bg-red-950/40 border-red-500 shadow-md ring-1 ring-red-400'
                            : 'bg-[#f5f4fd] border-white/90 shadow-2xs hover:shadow-md'
                        }`}
                      >
                        {isEmergency && (
                          <div className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center justify-between shadow-xs">
                            <span className="flex items-center gap-1">
                              <Siren className="w-3 h-3 text-yellow-300 animate-pulse" />
                              EMERGENCY
                            </span>
                            <span>URGENT</span>
                          </div>
                        )}

                        {(report.isFlaggedAsAiFake || report.aiForensics?.isAiGenerated) && (
                          <div className="px-2.5 py-1 bg-rose-950 text-rose-200 border border-rose-800 rounded-lg text-[9px] font-mono font-bold flex items-center justify-between shadow-xs">
                            <span className="flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3 text-rose-400 animate-pulse" />
                              AI FAKE PHOTO FLAGGED
                            </span>
                            <span>{report.aiForensics?.aiProbability ?? 96}% AI</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono text-[#008080] dark:text-[#CCFF00] font-bold">#{report.id}</span>
                          <span className={`px-2 py-0.5 rounded-md border font-black ${sevConf.colorClass}`}>
                            {sevConf.label}
                          </span>
                        </div>

                        <div className="flex items-start space-x-2.5">
                          <img
                            src={report.imageUrls[0]}
                            alt={report.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100 border border-white"
                          />
                          <div className="min-w-0">
                            <h4
                              onClick={() => onSelectReport(report)}
                              className="font-['Montserrat'] font-black text-xs text-[#1A1A1A] dark:text-white line-clamp-2 hover:text-[#008080] cursor-pointer"
                            >
                              {report.title}
                            </h4>
                            <p className="text-[10px] text-slate-600 font-medium truncate mt-0.5">{report.addressText}</p>
                          </div>
                        </div>

                        {/* Quick Turn-by-Turn Directions Launcher for Field Crew */}
                        <ReportMapDirections report={report} variant="compact" />

                        {report.officialNote && (
                          <p className="text-[10px] text-amber-900 bg-amber-100/80 p-2 rounded-xl line-clamp-2 border border-amber-200/80 font-bold">
                            Note: {report.officialNote}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-white/70 text-[11px]">
                          <span className="text-slate-500 font-bold">{formatTimeAgo(report.createdAt)}</span>
                          <button
                            onClick={() => handleOpenEditModal(report)}
                            className="btn-soft-tactile px-2.5 py-1 rounded-xl text-[10px] cursor-pointer"
                          >
                            Manage →
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Municipal Work Order Update Modal */}
      {selectedReportForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col my-auto">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900 shrink-0">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Update Work Order #{selectedReportForEdit.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReportForEdit(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="flex-1 flex flex-col min-h-0 overflow-hidden text-xs">
              <div className="p-5 space-y-4 overflow-y-auto flex-1 max-h-[calc(92vh-130px)]">
                {/* Field Crew Navigation & Dispatch Map */}
                <ReportMapDirections report={selectedReportForEdit} variant="full" />

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Change Issue Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="OPEN">🔴 OPEN / Unresolved</option>
                    <option value="IN_PROGRESS">🟡 IN PROGRESS / Crew Dispatched</option>
                    <option value="RESOLVED">🟢 RESOLVED / Work Complete</option>
                    <option value="REJECTED">⚪ REJECTED / Non-Municipal Issue</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Assigned Maintenance Crew
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Public Works Crew B, SF Water Dept"
                    value={assignedWorker}
                    onChange={(e) => setAssignedWorker(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Official Municipal Work Note
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Details on repairs completed or scheduled timeline..."
                    value={officialNote}
                    onChange={(e) => setOfficialNote(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>

                {/* Upload resolution photo if marking resolved */}
                {newStatus === 'RESOLVED' && (
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Upload Official Resolution Photo (Completion Proof)
                    </label>
                    {resolutionPhoto ? (
                      <div className="relative h-32 w-full rounded-2xl overflow-hidden border">
                        <img src={resolutionPhoto} alt="Resolution" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setResolutionPhoto(null)}
                          className="absolute top-2 right-2 p-1 bg-slate-900 text-white rounded-full cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-emerald-500">
                        <Upload className="w-5 h-5 text-slate-400 mr-2" />
                        <span className="font-semibold text-slate-600">Select repair completion image</span>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-end space-x-3 shrink-0 sticky bottom-0 z-20">
                <button
                  type="button"
                  onClick={() => setSelectedReportForEdit(null)}
                  className="btn-soft-tactile px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-primary-designer px-5 py-2.5 rounded-2xl text-xs font-extrabold cursor-pointer min-h-[44px]"
                >
                  Save Status & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
