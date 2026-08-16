import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldAlert,
  SlidersHorizontal,
  UserCheck,
  X,
  Sparkles,
  Filter,
  Siren,
  ChevronRight,
  Check,
  Search,
} from 'lucide-react';
import { Report, ReportStatus } from '../types';
import { STATUS_CONFIG, CATEGORY_CONFIG, SEVERITY_CONFIG } from '../lib/constants';
import { CategoryIcon } from './CategoryIcon';

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
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<ReportStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingReportId, setUpdatingReportId] = useState<string | null>(null);
  const [activeEditingId, setActiveEditingId] = useState<string | null>(null);

  const [noteInput, setNoteInput] = useState('');
  const [workerInput, setWorkerInput] = useState('');
  const [statusSelect, setStatusSelect] = useState<ReportStatus>('IN_PROGRESS');

  const filteredReports = reports.filter((r) => {
    const matchesStatus = selectedStatusFilter === 'ALL' || r.status === selectedStatusFilter;
    const locationStr = r.addressText || (r as any).locationName || '';
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locationStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApplyUpdate = async (reportId: string) => {
    setUpdatingReportId(reportId);
    try {
      await onUpdateStatus(
        reportId,
        statusSelect,
        noteInput.trim() || undefined,
        undefined,
        workerInput.trim() || undefined
      );
      setActiveEditingId(null);
      setNoteInput('');
      setWorkerInput('');
    } finally {
      setUpdatingReportId(null);
    }
  };

  return (
    <div className="space-y-5 text-left">
      {/* Search & Status Filter Row */}
      <div className="p-4 sm:p-5 bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by title, location or ID..."
              className="w-full pl-11 pr-4 py-3 text-sm font-semibold bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#111827] dark:text-white outline-none focus:border-[#0A2540] dark:focus:border-teal-400 min-h-[48px]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedStatusFilter('ALL')}
              className={`px-4 py-2.5 text-xs font-bold uppercase rounded-xl border-1.5 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
                selectedStatusFilter === 'ALL'
                  ? 'bg-[#0A2540] text-white border-[#0A2540]'
                  : 'bg-slate-50 dark:bg-slate-800 text-[#111827] dark:text-slate-200 border-[#CBD5E1] dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              All ({reports.length})
            </button>
            {(Object.keys(STATUS_CONFIG) as ReportStatus[]).map((st) => {
              const conf = STATUS_CONFIG[st];
              const count = reports.filter((r) => r.status === st).length;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatusFilter(st)}
                  className={`px-4 py-2.5 text-xs font-bold uppercase rounded-xl border-1.5 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 min-h-[44px] ${
                    selectedStatusFilter === st
                      ? 'bg-[#006D5B] text-white border-[#006D5B]'
                      : 'bg-slate-50 dark:bg-slate-800 text-[#111827] dark:text-slate-200 border-[#CBD5E1] dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${conf.dotColor}`} />
                  <span>{conf.label} ({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Work Orders List */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="p-10 text-center bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-dashed border-[#CBD5E1] dark:border-slate-700">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No reports match the current filters.</p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const statusConf = STATUS_CONFIG[report.status];
            const categoryConf = CATEGORY_CONFIG[report.category];
            const isEditing = activeEditingId === report.id;

            return (
              <div
                key={report.id}
                className="p-5 bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm transition-all space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-1.5 border-[#CBD5E1] dark:border-slate-700 pb-3.5">
                  <div className="flex items-center space-x-3">
                    <CategoryIcon category={report.category} className="w-6 h-6 text-[#006D5B] dark:text-teal-300 shrink-0" />
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="text-xs font-mono font-bold text-[#006D5B] dark:text-teal-200 bg-teal-50 dark:bg-[#004D40] px-2 py-0.5 rounded border border-[#006D5B]/30">
                          #{report.id.slice(0, 8)}
                        </span>
                        <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${statusConf.bgClass} ${statusConf.textClass}`}>
                          {statusConf.label}
                        </span>
                        {report.category === 'EMERGENCY' && (
                          <span className="text-xs font-bold bg-rose-600 text-white px-2 py-0.5 rounded animate-pulse">
                            URGENT HAZARD
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-base text-[#111827] dark:text-white mt-1">
                        {report.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => onSelectReport(report)}
                      className="px-4 py-2 bg-[#0A2540] hover:bg-[#006D5B] text-white rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[40px]"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        if (isEditing) {
                          setActiveEditingId(null);
                        } else {
                          setActiveEditingId(report.id);
                          setStatusSelect(report.status);
                          setNoteInput(report.officialNote || (report as any).officialResolutionNote || '');
                          setWorkerInput(report.assignedWorker || '');
                        }
                      }}
                      className="px-4 py-2 bg-[#B45309] hover:bg-[#92400E] text-white rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[40px]"
                    >
                      {isEditing ? 'Cancel' : 'Update Status'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#006D5B] dark:text-teal-300" />
                    <span>{report.addressText || (report as any).locationName || 'Location Not Specified'}</span>
                  </span>
                  <span>•</span>
                  <span>Category: {categoryConf.label}</span>
                  {report.assignedWorker && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-[#006D5B] dark:text-teal-300 font-bold">
                        <UserCheck className="w-4 h-4" />
                        Worker: {report.assignedWorker}
                      </span>
                    </>
                  )}
                </div>

                {/* Inline Editing Form */}
                {isEditing && (
                  <div className="p-4 bg-slate-50 dark:bg-[#071B2F] rounded-xl border-1.5 border-[#006D5B] space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#111827] dark:text-white mb-1">
                          Status Transition
                        </label>
                        <select
                          value={statusSelect}
                          onChange={(e) => setStatusSelect(e.target.value as ReportStatus)}
                          className="w-full p-2.5 text-sm font-bold bg-white dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl min-h-[44px]"
                        >
                          {(Object.keys(STATUS_CONFIG) as ReportStatus[]).map((st) => (
                            <option key={st} value={st}>
                              {STATUS_CONFIG[st].label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-[#111827] dark:text-white mb-1">
                          Assigned Public Works Crew
                        </label>
                        <input
                          type="text"
                          value={workerInput}
                          onChange={(e) => setWorkerInput(e.target.value)}
                          placeholder="e.g. Ward 4 Maintenance Crew B"
                          className="w-full p-2.5 text-sm font-semibold bg-white dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl min-h-[44px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#111827] dark:text-white mb-1">
                        Official Work Order Notes / Resolution Updates
                      </label>
                      <textarea
                        rows={2}
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Provide transparent update for citizens..."
                        className="w-full p-2.5 text-sm font-semibold bg-white dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleApplyUpdate(report.id)}
                        disabled={updatingReportId === report.id}
                        className="px-5 py-2.5 bg-[#006D5B] hover:bg-[#0A2540] text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center gap-2 min-h-[44px]"
                      >
                        <Check className="w-4 h-4" />
                        <span>{updatingReportId === report.id ? 'Saving...' : 'Save Work Order'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
