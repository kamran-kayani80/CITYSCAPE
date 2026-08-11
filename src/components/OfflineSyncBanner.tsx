import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  WifiOff,
  Wifi,
  RefreshCw,
  Database,
  Radio,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { OfflineDiagnosticsModal } from './OfflineDiagnosticsModal';
import { PendingOfflineItem } from '../lib/offlineQueue';

interface OfflineSyncBannerProps {
  isOnline: boolean;
  isBrowserOnline: boolean;
  isUndergroundSimulated: boolean;
  onToggleUnderground: (enabled: boolean) => void;
  pendingQueue: PendingOfflineItem[];
  isSyncing: boolean;
  onTriggerSync: () => void;
  lastSyncTime: string | null;
  cachedReportsCount: number;
  lastSyncSummary: { synced: number; failed: number } | null;
}

export const OfflineSyncBanner: React.FC<OfflineSyncBannerProps> = ({
  isOnline,
  isBrowserOnline,
  isUndergroundSimulated,
  onToggleUnderground,
  pendingQueue,
  isSyncing,
  onTriggerSync,
  lastSyncTime,
  cachedReportsCount,
  lastSyncSummary,
}) => {
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  return (
    <>
      <div className="w-full">
        <AnimatePresence mode="wait">
          {!isOnline ? (
            /* Offline Mode Bar (Sub-Surface / Underground Facility Ready) */
            <motion.div
              key="offline-bar"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#0A2540] text-white border-b-2 border-amber-500/80 px-4 py-2.5 shadow-md"
            >
              <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
                    <WifiOff className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-amber-500 text-[#0A2540] text-[10px] font-black uppercase tracking-wider rounded-md">
                        Underground Facility Mode Active
                      </span>
                      {pendingQueue.length > 0 && (
                        <span className="px-2 py-0.5 bg-[#008080] text-[#CCFF00] text-[10px] font-mono font-bold rounded-md">
                          📦 {pendingQueue.length} Pending
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-200 truncate mt-0.5">
                      Operating offline without network connectivity. Reports & actions are saved locally and will auto-sync on reconnect.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 ml-auto">
                  <button
                    onClick={() => setIsDiagnosticsOpen(true)}
                    className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black transition-all cursor-pointer min-h-[44px] flex items-center space-x-1.5 border border-white/20"
                  >
                    <Database className="w-3.5 h-3.5 text-[#CCFF00]" />
                    <span>Queue & Diagnostics</span>
                  </button>

                  {isUndergroundSimulated && (
                    <button
                      onClick={() => onToggleUnderground(false)}
                      className="px-3 py-1.5 bg-amber-500 text-[#0A2540] hover:bg-amber-400 rounded-xl text-xs font-black transition-all cursor-pointer min-h-[44px]"
                    >
                      Disable Simulation
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ) : pendingQueue.length > 0 ? (
            /* Online with Pending Items Ready to Auto-Sync */
            <motion.div
              key="pending-bar"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gradient-to-r from-[#008080] to-[#005555] text-white border-b-2 border-[#CCFF00] px-4 py-2.5 shadow-md"
            >
              <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="p-2 bg-[#CCFF00]/20 text-[#CCFF00] rounded-xl shrink-0">
                    <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-[#CCFF00] text-[#0A2540] text-[10px] font-black uppercase tracking-wider rounded-md">
                        Auto-Sync Ready
                      </span>
                      <span className="text-xs font-extrabold text-[#CCFF00]">
                        {pendingQueue.length} offline report{pendingQueue.length > 1 ? 's' : ''} stored locally
                      </span>
                    </div>
                    <p className="text-xs text-slate-100 font-medium truncate mt-0.5">
                      Network re-connected. Syncing subterranean offline queue to municipal database...
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 ml-auto">
                  <button
                    onClick={onTriggerSync}
                    disabled={isSyncing}
                    className="px-4 py-2 bg-[#CCFF00] text-[#0A2540] hover:bg-lime-300 font-black rounded-xl text-xs transition-all cursor-pointer min-h-[44px] flex items-center space-x-1.5 shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Queue Now'}</span>
                  </button>

                  <button
                    onClick={() => setIsDiagnosticsOpen(true)}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px]"
                  >
                    Inspect Queue
                  </button>
                </div>
              </div>
            </motion.div>
          ) : lastSyncSummary && lastSyncSummary.synced > 0 ? (
            /* Auto-Sync Success Confirmation Toast Bar */
            <motion.div
              key="sync-success-bar"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-800 text-white border-b-2 border-emerald-400 px-4 py-2 shadow-sm"
            >
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span className="text-xs font-extrabold">
                    ⚡ Auto-Sync Complete: {lastSyncSummary.synced} subterranean offline action{lastSyncSummary.synced > 1 ? 's' : ''} uploaded to Cityscape Network!
                  </span>
                </div>
                <button
                  onClick={() => setIsDiagnosticsOpen(true)}
                  className="text-xs font-bold text-emerald-200 underline hover:text-white cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <OfflineDiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        isOnline={isOnline}
        isBrowserOnline={isBrowserOnline}
        isUndergroundSimulated={isUndergroundSimulated}
        onToggleUnderground={onToggleUnderground}
        pendingQueue={pendingQueue}
        isSyncing={isSyncing}
        onTriggerSync={onTriggerSync}
        lastSyncTime={lastSyncTime}
        cachedReportsCount={cachedReportsCount}
      />
    </>
  );
};
