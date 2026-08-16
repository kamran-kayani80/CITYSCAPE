import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  Zap,
  Shield,
  CreditCard,
  Download,
  Calendar,
  Layers,
  Activity,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Filter,
  Megaphone,
  Landmark,
  Crown,
  Eye,
  MousePointerClick,
  FileSpreadsheet,
  BadgeCheck,
  Search,
  ChevronRight,
  ShieldAlert,
  Clock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

interface MunicipalBillingDashboardProps {
  officerEmail?: string;
  onExportSummary?: () => void;
}

// Multi-Stream Monthly Revenue Trends (Gov + HOA + Ads)
const MONTHLY_PLATFORM_REVENUE = [
  { month: 'Mar 2026', govRevenue: 6250, hoaRevenue: 16200, adsRevenue: 2850, totalMrr: 25300, adImpressions: 820000 },
  { month: 'Apr 2026', govRevenue: 7500, hoaRevenue: 17100, adsRevenue: 3400, totalMrr: 28000, adImpressions: 980000 },
  { month: 'May 2026', govRevenue: 7500, hoaRevenue: 17900, adsRevenue: 3950, totalMrr: 29350, adImpressions: 1120000 },
  { month: 'Jun 2026', govRevenue: 8750, hoaRevenue: 18400, adsRevenue: 4200, totalMrr: 31350, adImpressions: 1250000 },
  { month: 'Jul 2026', govRevenue: 8750, hoaRevenue: 18900, adsRevenue: 4600, totalMrr: 32250, adImpressions: 1380000 },
  { month: 'Aug 2026', govRevenue: 8750, hoaRevenue: 19152, adsRevenue: 4820, totalMrr: 32722, adImpressions: 1420000 },
];

// Revenue Distribution by Stream
const REVENUE_STREAM_DISTRIBUTION = [
  { name: 'HOA & Gated Societies', value: 19152, count: '48 Estates', color: '#006D5B', share: '58.5%' },
  { name: 'Municipal Gov Subscriptions', value: 8750, count: '7 Dept Contracts', color: '#0A2540', share: '26.7%' },
  { name: 'Events & Ad Space Subscriptions', value: 4820, count: '34 Active Campaigns', color: '#B45309', share: '14.8%' },
];

// Municipal Government Subscriptions Data
const MUNICIPAL_GOV_SUBSCRIPTIONS = [
  {
    id: 'GOV-SF-01',
    agencyName: 'San Francisco Department of Public Works',
    planTier: 'Enterprise Gov Desk ($1,250/mo)',
    annualBilling: '$15,000 / yr',
    mrr: 1250,
    seatsAssigned: '45 Field Staff & Dispatchers',
    renewalDate: 'Nov 14, 2026',
    slaTier: 'Gold 99.9% 1-Hour Response',
    status: 'Active (Auto-Renew)',
    contactLead: 'director.infrastructure@sfgov.org',
  },
  {
    id: 'GOV-SF-02',
    agencyName: 'District 6 Municipal Transit & Roads Authority',
    planTier: 'Enterprise Gov Desk ($1,250/mo)',
    annualBilling: '$15,000 / yr',
    mrr: 1250,
    seatsAssigned: '32 Engineers & Ward Officers',
    renewalDate: 'Dec 01, 2026',
    slaTier: 'Gold 99.9% 1-Hour Response',
    status: 'Active (Auto-Renew)',
    contactLead: 'traffic.ops@sfmuni.gov',
  },
  {
    id: 'GOV-SF-03',
    agencyName: 'Bay Area Regional Clean Water & Drainage Bureau',
    planTier: 'Enterprise Gov Desk ($1,250/mo)',
    annualBilling: '$15,000 / yr',
    mrr: 1250,
    seatsAssigned: '28 Hydraulic Specialists',
    renewalDate: 'Jan 15, 2027',
    slaTier: 'Gold 99.9% 1-Hour Response',
    status: 'Active (Auto-Renew)',
    contactLead: 'drainage.maint@sfwater.org',
  },
  {
    id: 'GOV-SF-04',
    agencyName: 'Civic Parks, Trees & Urban Forestry Division',
    planTier: 'Enterprise Gov Desk ($1,250/mo)',
    annualBilling: '$15,000 / yr',
    mrr: 1250,
    seatsAssigned: '24 Arborists & Ground Crews',
    renewalDate: 'Feb 10, 2027',
    slaTier: 'Gold 99.9% 1-Hour Response',
    status: 'Active (Auto-Renew)',
    contactLead: 'urbanforestry@sfparks.gov',
  },
  {
    id: 'GOV-SF-05',
    agencyName: 'Metro Street Lighting & Electrical Bureau',
    planTier: 'Enterprise Gov Desk ($1,250/mo)',
    annualBilling: '$15,000 / yr',
    mrr: 1250,
    seatsAssigned: '20 Master Electricians',
    renewalDate: 'Mar 22, 2027',
    slaTier: 'Gold 99.9% 1-Hour Response',
    status: 'Active (Auto-Renew)',
    contactLead: 'grid.lighting@sfenergy.gov',
  },
  {
    id: 'GOV-SF-06',
    agencyName: 'Central Environmental Waste & Sanitation Services',
    planTier: 'Enterprise Gov Desk ($1,250/mo)',
    annualBilling: '$15,000 / yr',
    mrr: 1250,
    seatsAssigned: '38 Route Managers',
    renewalDate: 'Apr 05, 2027',
    slaTier: 'Gold 99.9% 1-Hour Response',
    status: 'Active (Auto-Renew)',
    contactLead: 'sanitation.fleet@recoloros.gov',
  },
  {
    id: 'GOV-SF-07',
    agencyName: 'Ward 8 Community Planning & Code Enforcement',
    planTier: 'Enterprise Gov Desk ($1,250/mo)',
    annualBilling: '$15,000 / yr',
    mrr: 1250,
    seatsAssigned: '18 Code Inspectors',
    renewalDate: 'May 18, 2027',
    slaTier: 'Gold 99.9% 1-Hour Response',
    status: 'Active (Auto-Renew)',
    contactLead: 'ward8.planning@sfmuni.gov',
  },
];

// Top Gated Communities Subscriptions Data
const TOP_GATED_COMMUNITIES = [
  { id: 'EST-101', name: 'Oakridge Royal Palms Society', plan: 'Premier ($119/mo)', units: 480, status: 'Active', mrr: 119, rfidScans: '28.4k', telemetryUptime: '99.9%', monthlyFeeTotal: 304 },
  { id: 'EST-102', name: 'Silverwood Heights Enclave', plan: 'Enterprise ($249/mo)', units: 620, status: 'Active', mrr: 249, rfidScans: '41.2k', telemetryUptime: '100%', monthlyFeeTotal: 564 },
  { id: 'EST-103', name: 'Greenfield Valley Residences', plan: 'Premier ($119/mo)', units: 310, status: 'Active', mrr: 119, rfidScans: '19.8k', telemetryUptime: '99.7%', monthlyFeeTotal: 209 },
  { id: 'EST-104', name: 'Pinewood Meadows Community', plan: 'Standard ($39/mo)', units: 88, status: 'Active', mrr: 39, rfidScans: '6.1k', telemetryUptime: '99.4%', monthlyFeeTotal: 84 },
  { id: 'EST-105', name: 'Grand Horizon Towers & Villas', plan: 'Enterprise ($249/mo)', units: 750, status: 'Active', mrr: 249, rfidScans: '52.0k', telemetryUptime: '100%', monthlyFeeTotal: 774 },
  { id: 'EST-106', name: 'Whispering Pines Gated Sector', plan: 'Standard ($39/mo)', units: 95, status: 'Active', mrr: 39, rfidScans: '7.3k', telemetryUptime: '99.8%', monthlyFeeTotal: 99 },
];

// Events & Ad Space Subscriptions Data
const EVENTS_AND_ADS_SUBSCRIPTIONS = [
  {
    id: 'AD-201',
    advertiserName: 'Mission Merchant Alliance',
    campaignTitle: 'Saturday Organic Farmers Market & Artisan Fair',
    placementTier: 'Platinum Banner Ad ($49.00 / week)',
    monthlyBilling: 196,
    impressions: '342,000 Views',
    clicks: '14,820 Clicks',
    ctr: '4.33%',
    duration: 'Aug 1 - Aug 31, 2026',
    status: 'Active',
    category: 'Farmers Market',
  },
  {
    id: 'AD-202',
    advertiserName: 'Artisan Roastery & Bakery Collective',
    campaignTitle: 'Civic Coffee House Grand Opening Free Roast Tasting',
    placementTier: 'Platinum Banner Ad ($49.00 / week)',
    monthlyBilling: 196,
    impressions: '418,500 Views',
    clicks: '19,250 Clicks',
    ctr: '4.60%',
    duration: 'Aug 5 - Sep 05, 2026',
    status: 'Active',
    category: 'Business Special',
  },
  {
    id: 'AD-203',
    advertiserName: 'Sunset Eco Nursery & Garden Supplies',
    campaignTitle: 'Local Tree Planting & Drought-Resistant Flora Workshop',
    placementTier: 'Featured 3-Day Highlight ($15.00 / run)',
    monthlyBilling: 60,
    impressions: '128,400 Views',
    clicks: '6,140 Clicks',
    ctr: '4.78%',
    duration: 'Aug 10 - Aug 25, 2026',
    status: 'Active',
    category: 'Workshop',
  },
  {
    id: 'AD-204',
    advertiserName: 'Bay Area Electric Bike & Repair Co-op',
    campaignTitle: 'Community E-Bike Safety Tune-Up Weekend (20% Off)',
    placementTier: 'Monthly Local Business Partner ($99.00 / mo)',
    monthlyBilling: 99,
    impressions: '210,000 Views',
    clicks: '9,800 Clicks',
    ctr: '4.67%',
    duration: 'Monthly Recurring',
    status: 'Active (Auto-Renew)',
    category: 'Business Special',
  },
  {
    id: 'AD-205',
    advertiserName: 'Civic Health Dental & Wellness Clinic',
    campaignTitle: 'Free Senior Oral Screening & Community Wellness Day',
    placementTier: 'Monthly Local Business Partner ($99.00 / mo)',
    monthlyBilling: 99,
    impressions: '185,000 Views',
    clicks: '7,400 Clicks',
    ctr: '4.00%',
    duration: 'Monthly Recurring',
    status: 'Active (Auto-Renew)',
    category: 'Workshop',
  },
  {
    id: 'AD-206',
    advertiserName: 'Urban Solar Roof & Clean Energy Partners',
    campaignTitle: 'Neighborhood Microgrid Rebate Information Session',
    placementTier: 'Quarterly Civic Sponsor ($299.00 / qtr)',
    monthlyBilling: 99.66,
    impressions: '136,100 Views',
    clicks: '5,220 Clicks',
    ctr: '3.84%',
    duration: 'Jul 1 - Sep 30, 2026',
    status: 'Active',
    category: 'Townhall',
  },
];

export const MunicipalBillingDashboard: React.FC<MunicipalBillingDashboardProps> = ({
  officerEmail = 'kaamikayani@gmail.com',
  onExportSummary,
}) => {
  const [activeStreamTab, setActiveStreamTab] = useState<'all' | 'gov' | 'hoa' | 'ads'>('all');
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | 'ytd'>('30d');
  const [searchQuery, setSearchQuery] = useState('');

  const handleDownloadMasterCSV = () => {
    if (onExportSummary) {
      onExportSummary();
      return;
    }
    const lines = [
      'CITYSCAPE MASTER PLATFORM REVENUE LEDGER - OWNER OVERSIGHT',
      `Exported By: ${officerEmail}`,
      `Export Date: ${new Date().toISOString()}`,
      '',
      '--- 1. MUNICIPAL GOVERNMENT SUBSCRIPTIONS ($8,750 MRR) ---',
      'Contract ID,Agency Name,Plan Tier,Annual Billing,Monthly MRR,Assigned Seats,Renewal Date,Status',
      ...MUNICIPAL_GOV_SUBSCRIPTIONS.map((g) =>
        [g.id, `"${g.agencyName}"`, `"${g.planTier}"`, `"${g.annualBilling}"`, g.mrr, `"${g.seatsAssigned}"`, g.renewalDate, g.status].join(',')
      ),
      '',
      '--- 2. GATED COMMUNITIES & HOA REVENUE ($19,152 MRR) ---',
      'Estate ID,Community Name,Plan Tier,Enrolled Units,Monthly RFID Passes,Telemetry Uptime,Monthly Bill ($),Status',
      ...TOP_GATED_COMMUNITIES.map((h) =>
        [h.id, `"${h.name}"`, `"${h.plan}"`, h.units, h.rfidScans, h.telemetryUptime, h.monthlyFeeTotal, h.status].join(',')
      ),
      '',
      '--- 3. COMMUNITY EVENTS & AD SPACE SUBSCRIPTIONS ($4,820 MRR) ---',
      'Campaign ID,Advertiser Name,Campaign Title,Placement Tier,Monthly Billing ($),Impressions,Clicks,CTR,Duration,Status',
      ...EVENTS_AND_ADS_SUBSCRIPTIONS.map((a) =>
        [a.id, `"${a.advertiserName}"`, `"${a.campaignTitle}"`, `"${a.placementTier}"`, a.monthlyBilling, `"${a.impressions}"`, `"${a.clicks}"`, a.ctr, `"${a.duration}"`, a.status].join(',')
      ),
      '',
      'TOTAL GROSS MRR: $32,722.00 / mo',
      'TOTAL PROJECTED ARR: $392,664.00 / yr',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cityscape_Master_Revenue_Ledger_Owner_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-left">
      {/* MASTER TOP HEADER BAR */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl border-2 border-amber-500/40 dark:border-amber-400/30 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" />
              Owner Oversight
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-300 dark:border-emerald-700">
              ● All 3 Monetization Streams Live
            </span>
            <span className="text-xs text-slate-500 font-mono font-bold">
              Account: {officerEmail}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0A2540] dark:text-white mt-1.5 tracking-tight">
            Master Revenue, Subscriptions & Contracts Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-0.5">
            Unified financial oversight across Municipal Gov SaaS ($1,250/mo), HOA Estate Telemetry, and Events & Ad Space Subscriptions.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {(['30d', '90d', 'ytd'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  timeRange === range
                    ? 'bg-[#0A2540] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleDownloadMasterCSV}
            className="px-4 py-2.5 bg-gradient-to-r from-[#0A2540] to-[#006D5B] hover:from-[#081d33] hover:to-[#005546] text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all shadow-md min-h-[42px] cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Export Master Audit CSV</span>
          </button>
        </div>
      </div>

      {/* STREAM SELECTOR SUB-NAVIGATION TABS */}
      <div className="flex items-center flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveStreamTab('all')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[42px] ${
            activeStreamTab === 'all'
              ? 'bg-[#0A2540] text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span>All Revenue Streams</span>
          <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full">
            $32.7k MRR
          </span>
        </button>

        <button
          onClick={() => setActiveStreamTab('gov')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[42px] ${
            activeStreamTab === 'gov'
              ? 'bg-[#0A2540] text-white shadow-md ring-2 ring-blue-400/40'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Landmark className="w-4 h-4 text-blue-400" />
          <span>Municipal Gov SaaS</span>
          <span className="px-2 py-0.5 bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200 text-[10px] font-black rounded-full">
            $8,750/mo
          </span>
        </button>

        <button
          onClick={() => setActiveStreamTab('hoa')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[42px] ${
            activeStreamTab === 'hoa'
              ? 'bg-[#006D5B] text-white shadow-md ring-2 ring-emerald-400/40'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-300" />
          <span>HOA Gated Societies</span>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 text-[10px] font-black rounded-full">
            $19,152/mo
          </span>
        </button>

        <button
          onClick={() => setActiveStreamTab('ads')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[42px] ${
            activeStreamTab === 'ads'
              ? 'bg-[#B45309] text-white shadow-md ring-2 ring-amber-400/40'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Megaphone className="w-4 h-4 text-amber-300" />
          <span>Events & Ads Space</span>
          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 text-[10px] font-black rounded-full">
            $4,820/mo
          </span>
        </button>
      </div>

      {/* 4 HIGH-LEVEL KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Gross MRR */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Total Gross MRR
            </span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-300">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0A2540] dark:text-white font-mono">
              $32,722
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            $392,664 Annual Run Rate (ARR)
          </p>
        </div>

        {/* Metric 2: Municipal Gov SaaS */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Municipal Gov Contracts
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-300">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0A2540] dark:text-white">
              7 Agencies
            </span>
            <span className="text-xs font-bold text-blue-600 font-mono">
              $8,750/mo
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            100% Retained at $1,250/mo Standard Gov Desk
          </p>
        </div>

        {/* Metric 3: Gated Communities */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              HOA Estates Active
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-[#006D5B] dark:text-emerald-300">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0A2540] dark:text-white">
              48 Estates
            </span>
            <span className="text-xs font-bold text-emerald-600 font-mono">
              $19,152/mo
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            14,250 Units • 189k monthly RFID scans
          </p>
        </div>

        {/* Metric 4: Events & Ads Subscriptions */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Events & Ads Space
            </span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-[#B45309] dark:text-amber-300">
              <Megaphone className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0A2540] dark:text-white font-mono">
              $4,820/mo
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +21%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            34 Active Sponsors • 1.42M Ad Impressions
          </p>
        </div>
      </div>

      {/* CHARTS ROW 1: MULTI-STREAM REVENUE GROWTH & REVENUE SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART 1: MULTI-STREAM STACKED REVENUE GROWTH */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-black text-base text-[#0A2540] dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#006D5B]" />
                Multi-Stream Revenue Growth Trajectory (Gov + HOA + Ads)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Monthly revenue expansion across all 3 monetized platform verticals over the last 6 months.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[10px] uppercase">
              Area Breakdown
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_PLATFORM_REVENUE} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGov" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A2540" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#0A2540" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorHoa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006D5B" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#006D5B" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorAds" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B45309" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#B45309" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#64748B' }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A2540',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: any) => [
                    `$${typeof value === 'number' ? value.toLocaleString() : value}`,
                    name,
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 700, paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="hoaRevenue"
                  name="HOA & Gated Societies ($)"
                  stroke="#006D5B"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorHoa)"
                />
                <Area
                  type="monotone"
                  dataKey="govRevenue"
                  name="Municipal Gov SaaS ($)"
                  stroke="#0A2540"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorGov)"
                />
                <Area
                  type="monotone"
                  dataKey="adsRevenue"
                  name="Events & Ads Space ($)"
                  stroke="#B45309"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAds)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: REVENUE DISTRIBUTION DONUT */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-black text-base text-[#0A2540] dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#B45309]" />
              Platform MRR Share by Stream
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Gross breakdown of $32,722 / month across all revenue lines.
            </p>
          </div>

          <div className="h-56 w-full relative my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={REVENUE_STREAM_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {REVENUE_STREAM_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A2540',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: any) => [`$${value.toLocaleString()} / mo`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-2xl font-black text-[#0A2540] dark:text-white font-mono">$32.7k</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Total MRR</span>
            </div>
          </div>

          {/* Legend Breakdown */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
            {REVENUE_STREAM_DISTRIBUTION.map((stream, idx) => (
              <div key={idx} className="flex items-center justify-between font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stream.color }} />
                  <span className="text-slate-700 dark:text-slate-300">{stream.name}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-slate-900 dark:text-white">${stream.value.toLocaleString()}</span>
                  <span className="text-slate-400 text-[11px]">({stream.share})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 1: MUNICIPAL GOVERNMENT SUBSCRIPTIONS ROSTER */}
      {(activeStreamTab === 'all' || activeStreamTab === 'gov') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-blue-500/30 dark:border-blue-500/20 p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200 text-xs font-black uppercase">
                  Gov SaaS Revenue Stream
                </span>
                <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">
                  Total MRR: $8,750.00
                </span>
              </div>
              <h3 className="font-black text-lg text-[#0A2540] dark:text-white flex items-center gap-2 mt-1">
                <Landmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Municipal Government SaaS Subscriptions & Enterprise Contracts
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Active municipal department contracts subscribed at $1,250/mo standard Gov Desk tier with automated dispatch and SLA monitoring.
              </p>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800 text-center sm:text-right shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Annual Gov Contract Value
              </span>
              <p className="text-xl font-black text-blue-900 dark:text-blue-200 font-mono">
                $105,000 / yr
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-['Montserrat']">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[#0A2540] dark:text-slate-200 font-black">
                  <th className="p-3">Municipal Agency / Department</th>
                  <th className="p-3">Contract Plan Tier</th>
                  <th className="p-3 text-center">Allocated Staff Seats</th>
                  <th className="p-3 text-center">SLA Tier</th>
                  <th className="p-3 text-center">Renewal Date</th>
                  <th className="p-3 text-right">Monthly Bill ($)</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {MUNICIPAL_GOV_SUBSCRIPTIONS.map((gov) => (
                  <tr key={gov.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-[#0A2540] dark:text-white flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{gov.agencyName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{gov.contactLead}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200 font-extrabold text-[11px] border border-blue-200 dark:border-blue-800">
                        {gov.planTier}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300">
                      {gov.seatsAssigned}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 font-mono font-bold text-[10px]">
                        {gov.slaTier}
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono text-slate-600 dark:text-slate-400">
                      {gov.renewalDate}
                    </td>
                    <td className="p-3 text-right font-black font-mono text-[#0A2540] dark:text-white text-sm">
                      ${gov.mrr.toLocaleString()} / mo
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black text-[10px] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: GATED COMMUNITIES & HOA TELEMETRY ROSTER */}
      {(activeStreamTab === 'all' || activeStreamTab === 'hoa') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#006D5B] text-white text-xs font-black uppercase">
                  HOA Subscriptions & Telemetry
                </span>
                <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  Total MRR: $19,152.00
                </span>
              </div>
              <h3 className="font-black text-lg text-[#0A2540] dark:text-white flex items-center gap-2 mt-1">
                <Building2 className="w-5 h-5 text-[#006D5B]" />
                Gated Society Active Subscriptions & Private Repair Revenue
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Recurring monthly dues statements, RFID barrier passes, and private repair desk fees collected across 48 societies.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center sm:text-right shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Monthly Repair Dispatch Fees
              </span>
              <p className="text-xl font-black text-emerald-900 dark:text-emerald-200 font-mono">
                +$8,100 / mo
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-['Montserrat']">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[#0A2540] dark:text-slate-200 font-black">
                  <th className="p-3">Estate / Society Name</th>
                  <th className="p-3">Subscription Tier</th>
                  <th className="p-3 text-center">Enrolled Units</th>
                  <th className="p-3 text-center">Monthly RFID Passes</th>
                  <th className="p-3 text-center">Telemetry Uptime</th>
                  <th className="p-3 text-right">Monthly Bill ($)</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {TOP_GATED_COMMUNITIES.map((est) => (
                  <tr key={est.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-[#0A2540] dark:text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#006D5B]" />
                      <span>{est.name}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-[11px]">
                        {est.plan}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold">{est.units} Units</td>
                    <td className="p-3 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {est.rfidScans}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono font-black text-[10px]">
                        {est.telemetryUptime}
                      </span>
                    </td>
                    <td className="p-3 text-right font-black font-mono text-[#0A2540] dark:text-white">
                      ${est.monthlyFeeTotal} / mo
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black text-[10px] flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: EVENTS & AD SPACE SUBSCRIPTIONS & SPONSORSHIPS */}
      {(activeStreamTab === 'all' || activeStreamTab === 'ads') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-amber-500/30 dark:border-amber-500/20 p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#B45309] text-white text-xs font-black uppercase">
                  Ad Space & Events Subscriptions
                </span>
                <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
                  Total MRR: $4,820.00
                </span>
              </div>
              <h3 className="font-black text-lg text-[#0A2540] dark:text-white flex items-center gap-2 mt-1">
                <Megaphone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                Community Events & Local Business Ad Space Subscriptions
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Featured 3-Day Promotions ($15.00), Platinum Top Banners ($49.00/wk), and Monthly Business Partner Subscriptions ($99.00/mo).
              </p>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 text-center sm:text-right shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Monthly Ad Impressions
              </span>
              <p className="text-xl font-black text-amber-900 dark:text-amber-200 font-mono">
                1.42M Views (4.3% CTR)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-['Montserrat']">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[#0A2540] dark:text-slate-200 font-black">
                  <th className="p-3">Advertiser & Campaign Name</th>
                  <th className="p-3">Ad Space Tier</th>
                  <th className="p-3 text-center">Impressions</th>
                  <th className="p-3 text-center">Clicks / CTR</th>
                  <th className="p-3 text-center">Campaign Duration</th>
                  <th className="p-3 text-right">Monthly Revenue ($)</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {EVENTS_AND_ADS_SUBSCRIPTIONS.map((ad) => (
                  <tr key={ad.id} className="hover:bg-amber-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-[#0A2540] dark:text-white flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{ad.advertiserName}</span>
                      </div>
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium block">
                        {ad.campaignTitle}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-extrabold text-[11px] border border-amber-200 dark:border-amber-800">
                        {ad.placementTier}
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                      {ad.impressions}
                    </td>
                    <td className="p-3 text-center font-mono">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{ad.clicks}</span>
                      <span className="text-[10px] text-slate-400 block font-bold">({ad.ctr})</span>
                    </td>
                    <td className="p-3 text-center font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                      {ad.duration}
                    </td>
                    <td className="p-3 text-right font-black font-mono text-[#0A2540] dark:text-white text-sm">
                      ${ad.monthlyBilling.toFixed(2)} / mo
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black text-[10px] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FOOTER AUDIT LOG & COMPLIANCE SUMMARY */}
      <div className="p-4 bg-slate-50 dark:bg-[#071829] rounded-2xl border border-[#CBD5E1] dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Webmaster Notice:</strong> All municipal revenue, estate telemetry, and ad payouts are logged under ISO/IEC 27001 Annex A.9 access control standards.
          </span>
        </div>
        <span className="font-mono text-[11px] font-bold shrink-0">
          Last Financial Settlement: Aug 14, 2026 05:00 UTC
        </span>
      </div>
    </div>
  );
};

