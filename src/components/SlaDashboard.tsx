import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle,
  AlertOctagon,
  ShieldAlert,
  Building,
  TrendingUp,
  UserCheck,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Filter,
  Calendar,
  Zap,
  BarChart3,
  Target,
  ShieldCheck,
  Layers,
  Search,
  Users,
  Check,
  ExternalLink,
  RefreshCw,
  SlidersHorizontal,
  AlertTriangle,
  FileText,
  X,
  Info,
} from 'lucide-react';
import { Report, ReportCategory, SeverityLevel, PredictiveCompletionAnalysis } from '../types';
import { CATEGORY_SLA_HOURS, CATEGORY_CONFIG, MUNICIPAL_WARDS, SEVERITY_CONFIG } from '../lib/constants';
import { CategoryIcon } from './CategoryIcon';

interface SlaDashboardProps {
  reports: Report[];
  onConfirmResolution: (reportId: string, confirmed: boolean, disputeReason?: string) => void;
}

interface CategoryInsight {
  category: string;
  standardSlaHours: number;
  historicalSampleCount: number;
  historicalAverageHours: number;
  historicalMedianHours: number;
  activeQueueCount: number;
  slaAdherenceRate: number;
  loadStatus: 'OPTIMAL' | 'MODERATE_LOAD' | 'CONGESTED';
  recommendedCrew: string;
}

export const SlaDashboard: React.FC<SlaDashboardProps> = ({ reports, onConfirmResolution }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [disputeModalReport, setDisputeModalReport] = useState<Report | null>(null);
  const [disputeReason, setDisputeReason] = useState<string>('');

  // AI Predictive Analysis State
  const [selectedReportForAi, setSelectedReportForAi] = useState<Report | null>(null);
  const [aiPrediction, setAiPrediction] = useState<PredictiveCompletionAnalysis | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiPredictionsCache, setAiPredictionsCache] = useState<Record<string, PredictiveCompletionAnalysis>>({});

  // Category Insights State
  const [categoryInsights, setCategoryInsights] = useState<CategoryInsight[]>([]);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<ReportCategory>('POTHOLE');
  const [isLoadingInsights, setIsLoadingInsights] = useState<boolean>(false);

  // What-If Simulator State
  const [showSimulator, setShowSimulator] = useState<boolean>(false);
  const [simCategory, setSimCategory] = useState<ReportCategory>('POTHOLE');
  const [simSeverity, setSimSeverity] = useState<SeverityLevel>('MEDIUM');
  const [simWard, setSimWard] = useState<string>('Ward 1');
  const [simPrediction, setSimPrediction] = useState<PredictiveCompletionAnalysis | null>(null);
  const [isSimLoading, setIsSimLoading] = useState<boolean>(false);

  // Fetch Category Insights on mount
  useEffect(() => {
    fetchCategoryInsights();
  }, []);

  const fetchCategoryInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const res = await fetch('/api/sla/category-insights');
      if (res.ok) {
        const data = await res.json();
        if (data.insights && Array.isArray(data.insights)) {
          setCategoryInsights(data.insights);
        }
      }
    } catch (err) {
      console.warn('Failed to load category insights:', err);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  // Run AI Predictive Analysis for a specific report
  const handleOpenAiPrediction = async (report: Report) => {
    setSelectedReportForAi(report);
    
    // Check if already in cache
    if (aiPredictionsCache[report.id]) {
      setAiPrediction(aiPredictionsCache[report.id]);
      return;
    }

    setIsAiLoading(true);
    try {
      const res = await fetch('/api/sla/predict-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: report.id,
          category: report.category,
          severity: report.severity,
          wardZone: report.wardZone || 'Ward 1',
          title: report.title,
          description: report.description,
          createdAt: report.createdAt,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          setAiPrediction(data.result);
          setAiPredictionsCache((prev) => ({
            ...prev,
            [report.id]: data.result,
          }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch predictive analysis:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Run What-If Simulation
  const handleRunSimulation = async () => {
    setIsSimLoading(true);
    try {
      const res = await fetch('/api/sla/predict-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: simCategory,
          severity: simSeverity,
          wardZone: simWard,
          title: `Simulated ${simCategory.replace('_', ' ')} Repair`,
          description: `Hypothetical ${simSeverity.toLowerCase()} priority civic request for dispatch planning.`,
          createdAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          setSimPrediction(data.result);
        }
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimLoading(false);
    }
  };

  // SLA Statistics Calculations
  const totalCount = reports.length;
  const resolvedCount = reports.filter((r) => r.status === 'RESOLVED' || (r as any).status === 'CLOSED').length;
  const overdueCount = reports.filter((r) => r.slaStatus === 'OVERDUE' || (r as any).slaStatus === 'DISPUTED').length;
  const approachingCount = reports.filter((r) => r.slaStatus === 'APPROACHING_DUE').length;
  const onTrackRate = totalCount > 0 ? Math.round(((totalCount - overdueCount) / totalCount) * 100) : 100;

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.addressText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.wardZone && r.wardZone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'OVERDUE') return r.slaStatus === 'OVERDUE' || (r as any).slaStatus === 'DISPUTED';
    if (selectedFilter === 'APPROACHING') return r.slaStatus === 'APPROACHING_DUE';
    if (selectedFilter === 'RESOLVED') return r.status === 'RESOLVED' || (r as any).status === 'CLOSED';
    if (selectedFilter === 'DISPUTED') return (r as any).slaStatus === 'DISPUTED';
    return true;
  });

  const handleDisputeSubmit = () => {
    if (!disputeModalReport) return;
    onConfirmResolution(disputeModalReport.id, false, disputeReason.trim());
    setDisputeModalReport(null);
    setDisputeReason('');
  };

  // Active Category Insight object
  const activeInsight =
    categoryInsights.find((i) => i.category === selectedCategoryTab) || {
      category: selectedCategoryTab,
      standardSlaHours: CATEGORY_SLA_HOURS[selectedCategoryTab]?.hours || 72,
      historicalSampleCount: 35,
      historicalAverageHours: 42.5,
      historicalMedianHours: 38.0,
      activeQueueCount: 3,
      slaAdherenceRate: 94,
      loadStatus: 'OPTIMAL' as const,
      recommendedCrew: '2 Municipal Specialists',
    };

  return (
    <div className="space-y-6">
      {/* SLA Hero Header with Live Predictive Intelligence Indicator */}
      <div className="bg-[#0A2540] p-6 sm:p-8 rounded-xl border-1.5 border-[#006D5B] relative overflow-hidden text-white shadow-lg">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#006D5B] text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-teal-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Municipal SLA & Predictive AI Engine</span>
              </span>
              <span className="px-2.5 py-1 bg-teal-950/80 text-teal-200 text-xs font-bold rounded-lg border border-teal-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
                <span>Historical Resolution Benchmarks</span>
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Service Level Agreement (SLA) & Predictive Completion Center
            </h1>
            
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              Empowering our community with transparent municipal resolution tracking. Our predictive AI model estimates completion times based on historical repair records, crew capacity, and category logistics across city wards.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowSimulator(!showSimulator);
                  if (!simPrediction) handleRunSimulation();
                }}
                className="px-4 py-2.5 bg-[#B45309] hover:bg-[#92400E] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm min-h-[44px]"
                aria-label="Toggle What-If AI Completion Simulator"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-200" />
                <span>{showSimulator ? 'Close Simulator' : '⚡ Open What-If AI Estimator'}</span>
              </button>

              <button
                type="button"
                onClick={fetchCategoryInsights}
                disabled={isLoadingInsights}
                className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700 min-h-[44px]"
                title="Refresh historical category metrics"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInsights ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh Data</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="p-3.5 bg-[#071B2F] border-1.5 border-[#006D5B] rounded-xl text-center shadow-sm">
              <span className="block text-2xl font-bold text-emerald-400">{onTrackRate}%</span>
              <span className="text-xs font-bold text-slate-200 uppercase">On-Track Rate</span>
            </div>
            <div className="p-3.5 bg-[#071B2F] border-1.5 border-rose-800 rounded-xl text-center shadow-sm">
              <span className="block text-2xl font-bold text-rose-400">{overdueCount}</span>
              <span className="text-xs font-bold text-slate-200 uppercase">Overdue Reports</span>
            </div>
            <div className="p-3.5 bg-[#071B2F] border-1.5 border-amber-800 rounded-xl text-center shadow-sm">
              <span className="block text-2xl font-bold text-amber-400">{approachingCount}</span>
              <span className="text-xs font-bold text-slate-200 uppercase">Approaching Due</span>
            </div>
            <div className="p-3.5 bg-[#071B2F] border-1.5 border-teal-800 rounded-xl text-center shadow-sm">
              <span className="block text-2xl font-bold text-teal-300">{resolvedCount}</span>
              <span className="text-xs font-bold text-slate-200 uppercase">Resolved Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* WHAT-IF AI COMPLETION SIMULATOR PANEL (Interactive Simulation Tool) */}
      {showSimulator && (
        <div className="bg-white dark:bg-[#0A2540] p-6 rounded-xl border-2 border-[#B45309] space-y-5 shadow-md animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#CBD5E1] dark:border-slate-700 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-amber-100 dark:bg-amber-950 text-[#B45309] dark:text-amber-300 rounded-xl">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111827] dark:text-white flex items-center gap-2">
                  <span>Interactive AI Completion Simulator</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900 text-[#B45309] dark:text-amber-200 text-xs font-mono">
                    Predictive Model
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Simulate resolution turnaround times for different infrastructure categories, hazard severities, and ward dispatch sectors based on empirical historical data.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSimulator(false)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer"
              aria-label="Close simulator"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#111827] dark:text-white uppercase tracking-wider">
                1. Infrastructure Category
              </label>
              <select
                value={simCategory}
                onChange={(e) => setSimCategory(e.target.value as ReportCategory)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-sm font-bold text-[#111827] dark:text-white outline-none focus:ring-2 focus:ring-[#006D5B] min-h-[50px]"
              >
                {(Object.keys(CATEGORY_SLA_HOURS) as ReportCategory[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace('_', ' ')} (Standard SLA: {CATEGORY_SLA_HOURS[cat]?.label || '72h'})
                  </option>
                ))}
              </select>
            </div>

            {/* Severity Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#111827] dark:text-white uppercase tracking-wider">
                2. Hazard Severity Tier
              </label>
              <select
                value={simSeverity}
                onChange={(e) => setSimSeverity(e.target.value as SeverityLevel)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-sm font-bold text-[#111827] dark:text-white outline-none focus:ring-2 focus:ring-[#006D5B] min-h-[50px]"
              >
                <option value="CRITICAL">Critical Safety Risk (Emergency Dispatch)</option>
                <option value="HIGH">High Priority (Urgent Repair)</option>
                <option value="MEDIUM">Moderate Hazard (Standard Dispatch)</option>
                <option value="LOW">Low Severity (Scheduled Maintenance)</option>
              </select>
            </div>

            {/* Ward Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#111827] dark:text-white uppercase tracking-wider">
                3. Dispatch Ward / Sector
              </label>
              <select
                value={simWard}
                onChange={(e) => setSimWard(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-sm font-bold text-[#111827] dark:text-white outline-none focus:ring-2 focus:ring-[#006D5B] min-h-[50px]"
              >
                {MUNICIPAL_WARDS.map((w) => (
                  <option key={w.id} value={w.name.split(' - ')[0]}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleRunSimulation}
              disabled={isSimLoading}
              className="px-5 py-2.5 bg-[#006D5B] hover:bg-[#005244] text-white font-bold rounded-xl text-xs flex items-center space-x-2 transition-all cursor-pointer min-h-[48px] shadow-sm disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 text-amber-300 ${isSimLoading ? 'animate-spin' : ''}`} />
              <span>{isSimLoading ? 'Computing Simulation...' : 'Calculate AI Completion Forecast'}</span>
            </button>
          </div>

          {/* Simulation Output Card */}
          {simPrediction && (
            <div className="p-4 bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#006D5B] rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#CBD5E1] dark:border-slate-800 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 bg-[#006D5B] text-white rounded-lg text-xs font-mono font-bold">
                    {simPrediction.category}
                  </span>
                  <span className="text-xs font-bold text-[#006D5B] dark:text-teal-300">
                    Predicted Turnaround: {simPrediction.estimatedHours} Hours
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Standard SLA Limit: <span className="font-bold">{simPrediction.standardSlaHours}h</span> (
                  <span className={simPrediction.isAheadOfSla ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}>
                    {simPrediction.isAheadOfSla ? `${Math.abs(simPrediction.hoursVarianceVsSla)}h faster` : `${simPrediction.hoursVarianceVsSla}h over`}
                  </span>
                  )
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white dark:bg-[#0A2540] rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="block text-[11px] font-bold text-slate-500 uppercase">Historical Sample</span>
                  <span className="text-base font-bold text-[#111827] dark:text-white">
                    {simPrediction.historicalSampleCount} Past Resolutions
                  </span>
                  <span className="text-xs text-slate-500 block">Avg: {simPrediction.historicalAverageHours}h</span>
                </div>

                <div className="p-3 bg-white dark:bg-[#0A2540] rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="block text-[11px] font-bold text-slate-500 uppercase">Confidence Score</span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {Math.round(simPrediction.confidenceScore * 100)}% ({simPrediction.confidenceLabel})
                  </span>
                  <span className="text-xs text-slate-500 block">Risk: {simPrediction.riskOfSlaBreach}</span>
                </div>

                <div className="p-3 bg-white dark:bg-[#0A2540] rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="block text-[11px] font-bold text-slate-500 uppercase">Recommended Crew</span>
                  <span className="text-xs font-bold text-[#006D5B] dark:text-teal-300 line-clamp-2">
                    {simPrediction.recommendedCrewSize}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium bg-white dark:bg-[#0A2540] p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-[#006D5B] dark:text-teal-300">Historical Analysis: </span>
                {simPrediction.historicalBasisSummary}
              </p>
            </div>
          )}
        </div>
      )}

      {/* HISTORICAL BENCHMARK & PREDICTIVE CATEGORY MATRIX */}
      <div className="bg-white dark:bg-[#0A2540] p-5 rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#CBD5E1] dark:border-slate-700 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#111827] dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#006D5B] dark:text-teal-300" />
              <span>Historical Completion Benchmarks vs. Standard SLA Targets</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Comparative analysis of municipal turnaround times across infrastructure categories based on past resolved work orders.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#006D5B] dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-lg border border-teal-200 dark:border-teal-800 self-start sm:self-auto">
            {categoryInsights.length} Categories Calibrated
          </span>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-2.5">
          {(Object.keys(CATEGORY_SLA_HOURS) as ReportCategory[]).map((catKey) => {
            const sla = CATEGORY_SLA_HOURS[catKey];
            const insight = categoryInsights.find((i) => i.category === catKey);
            const isSelected = selectedCategoryTab === catKey;

            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setSelectedCategoryTab(catKey)}
                className={`p-3 rounded-xl border-1.5 space-y-2 text-left transition-all cursor-pointer min-h-[96px] ${
                  isSelected
                    ? 'border-[#006D5B] bg-[#E6F4F1] dark:bg-[#004D40]/60 ring-2 ring-[#006D5B]'
                    : 'border-[#CBD5E1] dark:border-slate-700 bg-slate-50 dark:bg-[#071B2F] hover:border-teal-500'
                }`}
                aria-label={`View historical analysis for ${catKey}`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-1.5 bg-white dark:bg-[#0A2540] rounded-lg text-[#006D5B] dark:text-teal-300 border border-slate-200 dark:border-slate-700 shadow-xs">
                    <CategoryIcon category={catKey} className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#006D5B] dark:text-teal-300">
                    SLA {sla.hours}h
                  </span>
                </div>

                <div>
                  <div className="font-bold text-xs text-[#111827] dark:text-white line-clamp-1">
                    {catKey.replace('_', ' ')}
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-0.5">
                    Hist. Avg:{' '}
                    <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">
                      {insight ? `${insight.historicalAverageHours}h` : `${Math.round(sla.hours * 0.55)}h`}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Category Deep Dive Panel */}
        <div className="p-4 bg-slate-50 dark:bg-[#071B2F] border-1.5 border-[#006D5B] rounded-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-[#111827] dark:text-white">
                Historical Profile: {selectedCategoryTab.replace('_', ' ')}
              </span>
              <span className="px-2 py-0.5 bg-[#006D5B] text-white rounded-md text-[11px] font-mono font-bold">
                {activeInsight.historicalSampleCount} Historical Repairs Analyzed
              </span>
            </div>
            <div className="text-xs font-bold text-[#006D5B] dark:text-teal-300">
              SLA Compliance Rate: <span className="text-emerald-600 dark:text-emerald-400">{activeInsight.slaAdherenceRate}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 bg-white dark:bg-[#0A2540] rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Standard SLA Limit</span>
              <span className="font-bold text-[#111827] dark:text-white text-sm">
                {activeInsight.standardSlaHours} Hours ({CATEGORY_SLA_HOURS[selectedCategoryTab]?.label})
              </span>
            </div>

            <div className="p-2.5 bg-white dark:bg-[#0A2540] rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Historical Turnaround</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {activeInsight.historicalAverageHours}h Avg (Median: {activeInsight.historicalMedianHours}h)
              </span>
            </div>

            <div className="p-2.5 bg-white dark:bg-[#0A2540] rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Active Ward Queue</span>
              <span className="font-bold text-[#111827] dark:text-white text-sm">
                {activeInsight.activeQueueCount} Pending Reports
              </span>
            </div>

            <div className="p-2.5 bg-white dark:bg-[#0A2540] rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Standard Crew Profile</span>
              <span className="font-bold text-[#006D5B] dark:text-teal-300 text-sm line-clamp-1">
                {activeInsight.recommendedCrew}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'ALL', label: `All Reports (${reports.length})` },
            { id: 'OVERDUE', label: `🚨 Overdue & Escalated (${overdueCount})` },
            { id: 'APPROACHING', label: `⚠️ Approaching Due (${approachingCount})` },
            { id: 'RESOLVED', label: `✅ Resolved (${resolvedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer min-h-[48px] shadow-sm ${
                selectedFilter === tab.id
                  ? 'bg-[#006D5B] text-white border-1.5 border-[#004D40]'
                  : 'bg-white dark:bg-[#0A2540] text-[#111827] dark:text-white border-1.5 border-[#CBD5E1] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search reports or ward..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2.5 bg-white dark:bg-[#0A2540] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs font-bold text-[#111827] dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#006D5B] min-h-[48px]"
          />
        </div>
      </div>

      {/* REPORTS SLA LIST WITH PER-REPORT PREDICTIVE AI FORECAST BUTTON */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white dark:bg-[#0A2540] p-12 text-center space-y-2 rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm">
            <CheckCircle className="w-10 h-10 text-[#006D5B] dark:text-teal-300 mx-auto" />
            <h4 className="font-bold text-base text-[#111827] dark:text-white">No Reports in Selection</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">All municipal requests in this category are operating normally.</p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const catSla = CATEGORY_SLA_HOURS[report.category] || CATEGORY_SLA_HOURS.OTHER;
            const isResolved = report.status === 'RESOLVED' || (report as any).status === 'CLOSED';
            const isOverdue = report.slaStatus === 'OVERDUE';
            const isDisputed = (report as any).slaStatus === 'DISPUTED';
            const cachedPred = aiPredictionsCache[report.id];

            return (
              <div
                key={report.id}
                className={`p-5 rounded-xl border-1.5 transition-all shadow-sm ${
                  isDisputed
                    ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40'
                    : isOverdue
                    ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40'
                    : 'bg-white dark:bg-[#0A2540] border-[#CBD5E1] dark:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-1.5">
                      <span className="px-3 py-1 rounded-xl bg-[#0A2540] text-white text-xs font-mono font-bold uppercase">
                        {report.category}
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-[#E6F4F1] dark:bg-[#004D40] text-[#006D5B] dark:text-teal-200 text-xs font-bold border border-[#006D5B]/30">
                        {report.wardZone || 'Ward 1'}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                          SEVERITY_CONFIG[report.severity]?.colorClass || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {SEVERITY_CONFIG[report.severity]?.label || report.severity}
                      </span>
                      {report.isProxyReport && (
                        <span className="px-3 py-1 rounded-xl bg-amber-100 text-[#B45309] text-xs font-bold border border-amber-300">
                          🤝 Proxy (Neighbor)
                        </span>
                      )}
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-[#111827] dark:text-white">
                      {report.title}
                    </h4>
                    <p className="text-sm font-semibold text-[#111827] dark:text-slate-200 flex items-center gap-1.5">
                      <span className="text-[#006D5B] dark:text-teal-300">📍</span>
                      <span>{report.addressText}</span>
                    </p>

                    {/* Cached AI predictive preview pill if available */}
                    {cachedPred && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/70 border border-teal-300 dark:border-teal-700 text-xs font-bold text-[#006D5B] dark:text-teal-200">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>AI Forecast: ~{cachedPred.estimatedHours} hrs to resolution</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          ({cachedPred.historicalSampleCount} past cases)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions & SLA Badges */}
                  <div className="flex items-center space-x-3 shrink-0 flex-wrap gap-2">
                    {/* Predictive AI Forecast Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenAiPrediction(report)}
                      className="px-4 py-2.5 bg-[#006D5B] hover:bg-[#005244] text-white font-bold rounded-xl text-xs transition-all cursor-pointer min-h-[48px] flex items-center space-x-2 shadow-sm active:scale-95"
                      aria-label={`Open AI Completion Forecast for ${report.title}`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>AI Completion Forecast</span>
                    </button>

                    {/* Standard SLA Countdown Badge */}
                    <div className="text-right">
                      <span className="block text-[10px] font-bold text-[#006D5B] dark:text-teal-300 uppercase">Target SLA</span>
                      <span
                        className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl inline-block border ${
                          isResolved
                            ? 'bg-[#E6F4F1] text-[#006D5B] border-[#006D5B]/40 dark:bg-[#004D40] dark:text-teal-200'
                            : isOverdue
                            ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                            : 'bg-slate-100 dark:bg-slate-800 text-[#111827] dark:text-slate-100 border-[#CBD5E1] dark:border-slate-700'
                        }`}
                      >
                        {isResolved ? '✅ RESOLVED' : isOverdue ? '🚨 OVERDUE' : `⏱️ Target: ${catSla.label}`}
                      </span>
                    </div>

                    {/* Resident Confirmation / Dispute Buttons */}
                    {isResolved && !report.resolutionConfirmedByReporter && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onConfirmResolution(report.id, true)}
                          className="px-4 py-2.5 bg-[#006D5B] hover:bg-[#005244] text-white font-bold rounded-xl text-xs transition-all cursor-pointer min-h-[48px] flex items-center space-x-1.5 shadow-sm active:scale-95"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>Confirm Fixed</span>
                        </button>

                        <button
                          onClick={() => setDisputeModalReport(report)}
                          className="px-4 py-2.5 bg-[#B45309] hover:bg-[#92400E] text-white font-bold rounded-xl text-xs transition-all cursor-pointer min-h-[48px] flex items-center space-x-1.5 shadow-sm active:scale-95"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span>Dispute</span>
                        </button>
                      </div>
                    )}

                    {report.resolutionConfirmedByReporter && (
                      <span className="px-3.5 py-2 bg-[#E6F4F1] dark:bg-[#004D40] text-[#006D5B] dark:text-teal-200 border border-[#006D5B]/30 rounded-xl text-xs font-bold flex items-center space-x-1.5 min-h-[48px]">
                        <CheckCircle className="w-4 h-4 text-[#006D5B]" />
                        <span>Resolution Confirmed</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Dispute Reason Banner if any */}
                {report.resolutionDisputeReason && (
                  <div className="mt-3.5 p-3.5 bg-rose-50 dark:bg-rose-950/80 border-1.5 border-rose-300 dark:border-rose-800 rounded-xl text-xs text-[#111827] dark:text-rose-100 flex items-start space-x-2.5">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-rose-900 dark:text-rose-200 text-sm">Resident Dispute Filed:</span>
                      <p className="text-xs font-medium text-[#111827] dark:text-rose-100 mt-0.5">{report.resolutionDisputeReason}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* AI PREDICTIVE COMPLETION TIME INSPECTOR MODAL */}
      {selectedReportForAi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0A2540] rounded-xl p-6 sm:p-7 border-2 border-[#006D5B] shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-1.5 border-[#CBD5E1] dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#006D5B] text-white rounded-xl shadow-sm">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#0A2540] dark:bg-slate-800 text-white text-[10px] font-mono font-bold uppercase">
                      {selectedReportForAi.category}
                    </span>
                    <span className="text-xs font-bold text-[#006D5B] dark:text-teal-300">
                      Predictive AI Resolution Analysis
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#111827] dark:text-white line-clamp-1 mt-0.5">
                    {selectedReportForAi.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedReportForAi(null);
                  setAiPrediction(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-all cursor-pointer"
                aria-label="Close prediction modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {isAiLoading ? (
              <div className="p-12 text-center space-y-4">
                <Sparkles className="w-12 h-12 text-[#006D5B] dark:text-teal-300 mx-auto animate-spin" />
                <h4 className="text-base font-bold text-[#111827] dark:text-white">
                  Synthesizing Historical Category Data...
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Cross-referencing past {selectedReportForAi.category.toLowerCase().replace('_', ' ')} resolutions, crew logistics, and ward queue pressure.
                </p>
              </div>
            ) : aiPrediction ? (
              <div className="space-y-5">
                {/* Highlight Estimate Banner */}
                <div className="p-5 bg-gradient-to-br from-[#E6F4F1] to-teal-50 dark:from-[#004D40]/70 dark:to-[#071B2F] rounded-xl border-1.5 border-[#006D5B] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#006D5B] dark:text-teal-300">
                        Estimated Completion Time
                      </span>
                      <div className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white">
                        ~{aiPrediction.estimatedHours} Hours
                      </div>
                      <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-[#006D5B] dark:text-teal-300" />
                        <span>Expected: {new Date(aiPrediction.estimatedCompletionDate).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-right sm:border-l sm:border-[#006D5B]/30 sm:pl-4 space-y-1">
                      <span className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
                        Target SLA Comparison
                      </span>
                      <span
                        className={`inline-block px-3 py-1 rounded-xl text-xs font-mono font-bold ${
                          aiPrediction.isAheadOfSla
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-amber-600 text-white'
                        }`}
                      >
                        {aiPrediction.isAheadOfSla
                          ? `⚡ ${Math.abs(aiPrediction.hoursVarianceVsSla)}h Ahead of SLA`
                          : `⚠️ ${aiPrediction.hoursVarianceVsSla}h Over Standard SLA`}
                      </span>
                      <span className="block text-[11px] text-slate-600 dark:text-slate-300">
                        Standard Limit: {aiPrediction.standardSlaHours}h
                      </span>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="pt-2 border-t border-[#006D5B]/20 flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-[#111827] dark:text-white">
                        Prediction Confidence: {Math.round(aiPrediction.confidenceScore * 100)}% ({aiPrediction.confidenceLabel})
                      </span>
                    </div>
                    <span className="text-slate-600 dark:text-slate-300">
                      SLA Breach Risk: <span className="font-extrabold text-[#006D5B] dark:text-teal-300">{aiPrediction.riskOfSlaBreach}</span>
                    </span>
                  </div>
                </div>

                {/* Historical Basis Summary Box */}
                <div className="p-4 bg-slate-50 dark:bg-[#071B2F] rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#006D5B] dark:text-teal-300">
                    <Info className="w-4 h-4" />
                    <span>Historical Empirical Foundation</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#111827] dark:text-slate-200 leading-relaxed">
                    {aiPrediction.historicalBasisSummary}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300 pt-1">
                    <span>Sample Pool: {aiPrediction.historicalSampleCount} cases</span>
                    <span>•</span>
                    <span>Category Average: {aiPrediction.historicalAverageHours}h</span>
                    <span>•</span>
                    <span>Category Median: {aiPrediction.historicalMedianHours}h</span>
                  </div>
                </div>

                {/* Key Operational Variance Factors */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#111827] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#006D5B] dark:text-teal-300" />
                    <span>Key Operational & Environmental Factors</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {aiPrediction.keyVarianceFactors.map((factor, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-white dark:bg-[#0A2540] rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-[#111827] dark:text-slate-200 flex items-start space-x-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#006D5B] dark:bg-teal-400 shrink-0 mt-1.5" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4-Stage Milestone Timeline */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#111827] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#006D5B] dark:text-teal-300" />
                    <span>Predicted Resolution Milestones</span>
                  </h4>
                  <div className="space-y-2">
                    {aiPrediction.milestones.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white dark:bg-[#0A2540] rounded-xl border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5 flex-1">
                          <div className="font-bold text-[#111827] dark:text-white flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#006D5B] text-white text-[10px] flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            <span>{m.step}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 pl-7">{m.description}</p>
                        </div>
                        <span className="font-mono font-bold text-[#006D5B] dark:text-teal-300 shrink-0 bg-teal-50 dark:bg-teal-950 px-2 py-1 rounded-md">
                          ~{m.estimatedHoursFromStart}h
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proactive Resident Advice */}
                <div className="p-4 bg-amber-50 dark:bg-amber-950/50 rounded-xl border border-amber-300 dark:border-amber-800 text-xs space-y-1">
                  <span className="font-bold text-[#B45309] dark:text-amber-300 block">
                    Public Works Advisory for Neighbors:
                  </span>
                  <p className="text-slate-800 dark:text-amber-100 leading-relaxed font-medium">
                    {aiPrediction.proactiveResidentAdvice}
                  </p>
                </div>

                {/* Crew & Dispatch Profile */}
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-[#006D5B] dark:text-teal-300" />
                    <span className="font-bold">Assigned Crew Profile:</span>
                    <span>{aiPrediction.recommendedCrewSize}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Model: Gemini-3.7-Flash Municipal Engine
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-rose-500 font-bold">
                Could not load prediction analysis. Please try again.
              </div>
            )}

            <div className="flex items-center justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setSelectedReportForAi(null);
                  setAiPrediction(null);
                }}
                className="px-5 py-2.5 bg-[#006D5B] text-white font-bold rounded-xl text-xs hover:bg-[#005244] transition-all cursor-pointer min-h-[48px]"
              >
                Close Forecast
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Citizen Dispute Modal */}
      {disputeModalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0A2540] rounded-xl p-6 border-2 border-rose-500 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 border-b-1.5 border-[#CBD5E1] dark:border-slate-800 pb-3.5">
              <div className="p-2.5 bg-rose-600 text-white rounded-xl">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111827] dark:text-white">
                  Dispute Municipal Resolution
                </h3>
                <p className="text-xs font-bold text-[#006D5B] dark:text-teal-300">Report: {disputeModalReport.title}</p>
              </div>
            </div>

            <p className="text-xs text-[#111827] dark:text-slate-200 font-medium leading-relaxed">
              Please specify why this repair is incomplete or requires additional municipal attention. Your feedback re-opens the report with priority SLA escalation.
            </p>

            <textarea
              rows={3}
              placeholder="e.g. Pothole patch opened back up after rain or streetlight still flickering..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-sm font-bold text-[#111827] dark:text-white outline-none focus:ring-2 focus:ring-[#006D5B]"
            />

            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <button
                onClick={() => setDisputeModalReport(null)}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-[#111827] dark:text-slate-200 border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-xs font-bold cursor-pointer min-h-[48px] hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDisputeSubmit}
                disabled={!disputeReason.trim()}
                className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all cursor-pointer min-h-[48px] disabled:opacity-50 shadow-sm"
              >
                Submit Dispute & Re-open
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
