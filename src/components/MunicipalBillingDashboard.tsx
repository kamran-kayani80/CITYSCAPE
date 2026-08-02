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

// Mock Data for Recharts Visualizations
const MONTHLY_USAGE_TRENDS = [
  { month: 'Mar 2026', rfidScans: 120000, telemetryPings: 410000, repairDispatches: 320, panicAlerts: 14, mrr: 16200 },
  { month: 'Apr 2026', rfidScans: 135000, telemetryPings: 440000, repairDispatches: 380, panicAlerts: 12, mrr: 17100 },
  { month: 'May 2026', rfidScans: 148000, telemetryPings: 490000, repairDispatches: 410, panicAlerts: 18, mrr: 17900 },
  { month: 'Jun 2026', rfidScans: 162000, telemetryPings: 530000, repairDispatches: 460, panicAlerts: 15, mrr: 18400 },
  { month: 'Jul 2026', rfidScans: 175000, telemetryPings: 580000, repairDispatches: 510, panicAlerts: 9, mrr: 18900 },
  { month: 'Aug 2026', rfidScans: 189000, telemetryPings: 620000, repairDispatches: 540, panicAlerts: 11, mrr: 19152 },
];

const SUBSCRIPTION_TIERS_DISTRIBUTION = [
  { name: 'Standard ($99/mo)', value: 18, count: '18 Estates', color: '#006D5B', maxUnits: 'Up to 100 Units' },
  { name: 'Premier ($399/mo)', value: 24, count: '24 Estates', color: '#0A2540', maxUnits: 'Up to 500 Units' },
  { name: 'Enterprise ($899/mo)', value: 6, count: '6 Estates', color: '#B45309', maxUnits: '500+ Units / Custom' },
];

const TOP_GATED_COMMUNITIES = [
  { id: 'EST-101', name: 'Oakridge Royal Palms Society', plan: 'Premier ($399/mo)', units: 480, status: 'Active', mrr: 399, rfidScans: '28.4k', telemetryUptime: '99.9%', monthlyFeeTotal: 584 },
  { id: 'EST-102', name: 'Silverwood Heights Enclave', plan: 'Enterprise ($899/mo)', units: 620, status: 'Active', mrr: 899, rfidScans: '41.2k', telemetryUptime: '100%', monthlyFeeTotal: 1214 },
  { id: 'EST-103', name: 'Greenfield Valley Residences', plan: 'Premier ($399/mo)', units: 310, status: 'Active', mrr: 399, rfidScans: '19.8k', telemetryUptime: '99.7%', monthlyFeeTotal: 489 },
  { id: 'EST-104', name: 'Pinewood Meadows Community', plan: 'Standard ($99/mo)', units: 88, status: 'Active', mrr: 99, rfidScans: '6.1k', telemetryUptime: '99.4%', monthlyFeeTotal: 144 },
  { id: 'EST-105', name: 'Grand Horizon Towers & Villas', plan: 'Enterprise ($899/mo)', units: 750, status: 'Active', mrr: 899, rfidScans: '52.0k', telemetryUptime: '100%', monthlyFeeTotal: 1424 },
  { id: 'EST-106', name: 'Whispering Pines Gated Sector', plan: 'Standard ($99/mo)', units: 95, status: 'Active', mrr: 99, rfidScans: '7.3k', telemetryUptime: '99.8%', monthlyFeeTotal: 159 },
];

export const MunicipalBillingDashboard: React.FC<MunicipalBillingDashboardProps> = ({
  officerEmail = 'procurement@sfpublicworks.org',
  onExportSummary,
}) => {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | 'ytd'>('30d');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('all');

  const filteredEstates = selectedTierFilter === 'all'
    ? TOP_GATED_COMMUNITIES
    : TOP_GATED_COMMUNITIES.filter((est) => est.plan.toLowerCase().includes(selectedTierFilter.toLowerCase()));

  const handleDownloadCSV = () => {
    if (onExportSummary) {
      onExportSummary();
      return;
    }
    const headers = ['Estate ID', 'Community Name', 'Plan Tier', 'Enrolled Units', 'Status', 'Base MRR ($)', 'Monthly RFID Passes', 'Telemetry Uptime'];
    const csvRows = [
      headers.join(','),
      ...TOP_GATED_COMMUNITIES.map((est) =>
        [est.id, `"${est.name}"`, `"${est.plan}"`, est.units, est.status, est.mrr, est.rfidScans, est.telemetryUptime].join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Gated_Communities_Billing_Usage_Summary_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#006D5B] text-white text-[10px] font-black uppercase tracking-wider">
              Municipal SaaS Analytics
            </span>
            <span className="text-xs text-slate-500 font-mono font-bold">
              Updated: August 2026
            </span>
          </div>
          <h2 className="text-xl font-black text-[#0A2540] dark:text-white mt-1">
            Gated Community Subscriptions & Usage Dashboard
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time telemetry pings, RFID security gate scans, dispatch fees, and active recurring subscriptions.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
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
            onClick={handleDownloadCSV}
            className="px-4 py-2 bg-[#006D5B] hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs min-h-[40px] cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-200" />
            <span>Export Usage CSV</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Active Gated Communities
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-[#0A2540] dark:text-indigo-300">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0A2540] dark:text-white">
              48 Estates
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12.5%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            14,250 Total Residential Units Enrolled
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Monthly Recurring Revenue
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-[#006D5B] dark:text-emerald-300">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0A2540] dark:text-white">
              $19,152
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +8.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Average $399/mo per Gated Society
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Monthly Gate Scans
            </span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-[#B45309] dark:text-amber-300">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0A2540] dark:text-white font-mono">
              189,000
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Automated RFID & QR Code Gate Passes
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Telemetry & Dispatches
            </span>
            <div className="p-2 bg-sky-50 dark:bg-sky-950/60 rounded-xl text-sky-700 dark:text-sky-300">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0A2540] dark:text-white font-mono">
              620k Pings
            </span>
            <span className="text-xs font-bold text-amber-600 font-mono">
              540 Dispatches
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            $8,100 collected in $15 Private Repair Fees
          </p>
        </div>
      </div>

      {/* RECHARTS VISUALIZATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART 1: MONTHLY TELEMETRY & RFID USAGE TRENDS (2 COLS) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-black text-base text-[#0A2540] dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#006D5B]" />
                Monthly Telemetry & Gate Scanner Traffic Trends
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Volume of RFID barrier scans vs. Generator/Water telemetry sensor pings over time.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[10px] uppercase">
              Area Chart
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_USAGE_TRENDS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTelemetry" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A2540" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0A2540" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorRfid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006D5B" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#006D5B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#64748B' }} tickFormatter={(v) => `${v / 1000}k`} />
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
                    typeof value === 'number' ? value.toLocaleString() : value,
                    name === 'telemetryPings' ? 'Telemetry Pings' : 'RFID Barrier Scans',
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 700, paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="telemetryPings"
                  name="Telemetry Pings"
                  stroke="#0A2540"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTelemetry)"
                />
                <Area
                  type="monotone"
                  dataKey="rfidScans"
                  name="RFID Gate Scans"
                  stroke="#006D5B"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRfid)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: SUBSCRIPTION TIERS DISTRIBUTION (PIE/DONUT) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-black text-base text-[#0A2540] dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#B45309]" />
              Active Subscription Tiers
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Distribution of 48 gated communities across plan tiers.
            </p>
          </div>

          <div className="h-56 w-full relative my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SUBSCRIPTION_TIERS_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {SUBSCRIPTION_TIERS_DISTRIBUTION.map((entry, index) => (
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
                  formatter={(value: any, name: any) => [`${value} Estates`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-2xl font-black text-[#0A2540] dark:text-white">48</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Societies</span>
            </div>
          </div>

          {/* Tier Legend Breakdown */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
            {SUBSCRIPTION_TIERS_DISTRIBUTION.map((tier, idx) => (
              <div key={idx} className="flex items-center justify-between font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                  <span className="text-slate-700 dark:text-slate-300">{tier.name}</span>
                </div>
                <span className="font-mono text-slate-900 dark:text-white">{tier.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CHART 3: REVENUE & PRIVATE REPAIR DISPATCH FEES BAR CHART */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-black text-base text-[#0A2540] dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Monthly SaaS MRR & Private Repair Desk Fee Revenue ($)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Monthly Subscription Revenue vs. $15 Private Unit Repair Dispatch Fees collected across societies.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black text-[10px] uppercase">
            Revenue Trend
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY_USAGE_TRENDS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                formatter={(value: any) => [`$${typeof value === 'number' ? value.toLocaleString() : value}`, 'Monthly MRR ($)']}
              />
              <Bar dataKey="mrr" name="Subscription MRR ($)" fill="#006D5B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TOP GATED COMMUNITIES ROSTER TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-black text-base text-[#0A2540] dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0A2540] dark:text-indigo-400" />
              Gated Society Active Subscriptions Roster
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Detailed breakdown of active gated community subscriptions and telemetry health.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedTierFilter}
              onChange={(e) => setSelectedTierFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer min-h-[38px]"
            >
              <option value="all">All Plan Tiers</option>
              <option value="Standard">Standard Tier ($99/mo)</option>
              <option value="Premier">Premier Tier ($399/mo)</option>
              <option value="Enterprise">Enterprise Tier ($899/mo)</option>
            </select>
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
              {filteredEstates.map((est) => (
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
    </div>
  );
};
