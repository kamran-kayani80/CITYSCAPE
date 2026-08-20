import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Crown,
  Building2,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Globe2,
  Layers,
  Sparkles,
  Download,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Activity,
  ArrowRight,
  Filter,
  RefreshCw,
  Search,
  ExternalLink,
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { MunicipalBillingDashboard } from './MunicipalBillingDashboard';

interface OwnerOversightDashboardProps {
  onExportAuditLedger?: () => void;
  onNavigateToCityDesk?: (cityKey: string) => void;
  onNavigateToGovDesk?: () => void;
  onNavigateToHoaPortal?: () => void;
  isOwnerUnlocked?: boolean;
  onLockOwnerAccess?: () => void;
  onRequestOwnerAccess?: () => void;
}

export const OwnerOversightDashboard: React.FC<OwnerOversightDashboardProps> = ({
  onExportAuditLedger,
  onNavigateToCityDesk,
  onNavigateToGovDesk,
  onNavigateToHoaPortal,
  isOwnerUnlocked = true,
  onLockOwnerAccess,
  onRequestOwnerAccess,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'billing_mrr' | 'contracts' | 'telemetry' | 'branding'>('billing_mrr');

  if (!isOwnerUnlocked) {
    return (
      <div className="p-8 sm:p-12 text-center rounded-3xl bg-white dark:bg-[#0A2540] border-2 border-amber-500/80 dark:border-amber-400 shadow-2xl space-y-6 max-w-xl mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border-2 border-amber-400/50 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 text-xs font-black uppercase tracking-wider border border-amber-300 dark:border-amber-700">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Strict Password Protection Required</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111827] dark:text-white">
            Platform Owner Terminal Locked
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            This executive workspace manages confidential municipal SaaS subscriptions, global billing ledger audits, and cross-city revenue metrics. Please authenticate with the master key to continue.
          </p>
        </div>
        <button
          onClick={onRequestOwnerAccess}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#92400E] via-[#B45309] to-[#78350F] hover:from-[#B45309] hover:to-[#92400E] text-white font-black text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 border-1.5 border-amber-400"
        >
          <KeyRound className="w-4 h-4 text-amber-200" />
          <span>Authenticate Master Passcode</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner: Master Platform Owner Oversight */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0A2540] via-[#0C3052] to-[#1E3A8A] text-white border-2 border-[#CBD5E1] dark:border-slate-700 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-xs font-black uppercase tracking-wider text-amber-300">
                <Crown className="w-4 h-4" />
                <span>Platform Executive Tier • Master SaaS Oversight</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-[11px] font-bold text-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Encrypted Session Active</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Cityscape Master Revenue &amp; Multi-City Governance Oversight
            </h1>
            <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
              Global executive control tower managing municipal contracts across 9+ global geotagged jurisdictions, 48 gated community HOAs, and local merchant advertising streams.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-right">
              <span className="text-[11px] font-bold text-slate-300 uppercase block">Consolidated Platform MRR</span>
              <span className="text-3xl font-black font-mono text-amber-300">$32,722 / mo</span>
            </div>

            {onLockOwnerAccess && (
              <button
                type="button"
                onClick={onLockOwnerAccess}
                title="Lock Terminal and Protect Confidential Billing Data"
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs border border-red-400/60 shadow-sm transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Terminal</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] font-bold text-slate-300 uppercase block">Active Geotagged Cities</span>
            <span className="text-2xl font-black font-mono text-white">9 Metros</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] font-bold text-emerald-300 uppercase block">Municipal Contracts</span>
            <span className="text-2xl font-black font-mono text-emerald-300">7 Active ($8,750/mo)</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] font-bold text-teal-300 uppercase block">HOA Gated Estates</span>
            <span className="text-2xl font-black font-mono text-teal-300">48 Estates ($19,152/mo)</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] font-bold text-amber-300 uppercase block">Merchant Ad Subscriptions</span>
            <span className="text-2xl font-black font-mono text-amber-300">34 Active ($4,820/mo)</span>
          </div>
        </div>
      </div>

      {/* Render the Complete Master Billing Engine */}
      <MunicipalBillingDashboard />
    </div>
  );
};

