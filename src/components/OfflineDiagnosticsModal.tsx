import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  WifiOff,
  Wifi,
  RefreshCw,
  Trash2,
  HardDrive,
  Database,
  ArrowUpRight,
  ShieldCheck,
  Check,
  Layers,
  Radio,
  Clock,
  Send,
  AlertCircle,
  Subtitles,
} from 'lucide-react';
import { PendingOfflineItem, clearOfflineQueue, removeOfflineItem } from '../lib/offlineQueue';

interface OfflineDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOnline: boolean;
  isBrowserOnline: boolean;
  isUndergroundSimulated: boolean;
  onToggleUnderground: (enabled: boolean) => void;
  pendingQueue: PendingOfflineItem[];
  isSyncing: boolean;
  onTriggerSync: () => void;
  lastSyncTime: string | null;
  cachedReportsCount: number;
}

export const OfflineDiagnosticsModal: React.FC<OfflineDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  isOnline,
  isBrowserOnline,
  isUndergroundSimulated,
  onToggleUnderground,
  pendingQueue,
  isSyncing,
  onTriggerSync,
  lastSyncTime,
  cachedReportsCount,
}) => {
  if (!isOpen) return null;

  const getItemTypeBadge = (type: PendingOfflineItem['type']) => {
    switch (type) {
      case 'CREATE_REPORT':
        return { label: 'Neighborhood Request', bg: 'bg-[#008080]/15 text-[#008080] dark:text-[#CCFF00]' };
      case 'UPVOTE_REPORT':
        return { label: 'Issue Endorsement', bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300' };
      case 'ADD_COMMENT':
        return { label: 'Community Feedback', bg: 'bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300' };
      case 'VERIFY_REPORT':
        return { label: 'On-Site Verification', bg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300' };
      case 'UPDATE_STATUS':
        return { label: 'Status Update', bg: 'bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300' };
      default:
        return { label: 'Civic Action', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200' };
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-[#CBD5E1] dark:border-slate-800 overflow-hidden my-auto p-5 sm:p-7 space-y-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                  isOnline
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300'
                }`}
              >
                {isOnline ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
              </div>
              <div>
                <span className="text-xs font-mono font-black uppercase tracking-wider text-[#008080] dark:text-[#CCFF00]">
                  Offline-First Architecture
                </span>
                <h3 className="text-xl font-heading font-black text-[#0A2540] dark:text-white leading-tight">
                  Sub-Surface & Underground Facility Sync
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[56px] min-w-[56px] flex items-center justify-center"
              aria-label="Close Diagnostics Modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Network State Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Network Connectivity
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black ${
                    isOnline
                      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {isOnline ? '🟢 Online (Connected)' : '📡 Underground / Offline'}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {isOnline
                  ? 'Connected to Cityscape municipal network servers. Actions sync instantly.'
                  : 'Operating seamlessly offline in underground facilities, tunnels, or basements.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Local Cache Engine
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-black bg-[#008080]/15 text-[#008080] dark:text-[#CCFF00]">
                  {cachedReportsCount} Reports Cached
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Last auto-sync timestamp:{' '}
                <span className="font-mono font-bold">
                  {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString() : 'Recent Session'}
                </span>
              </p>
            </div>
          </div>

          {/* Test Simulation Switch for Underground Facilities */}
          <div className="p-4 bg-[#0A2540] text-white rounded-2xl border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Radio className="w-5 h-5 text-[#CCFF00]" />
                <div>
                  <h4 className="text-sm font-bold">Underground Facility Simulation Mode</h4>
                  <p className="text-xs text-slate-300">
                    Test how Cityscape queues and syncs reports in subterranean environments.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onToggleUnderground(!isUndergroundSimulated)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer min-h-[56px] min-w-[120px] flex items-center justify-center border ${
                  isUndergroundSimulated
                    ? 'bg-[#B45309] text-white border-amber-500 shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                {isUndergroundSimulated ? '📡 SIMULATING OFFLINE' : '🔌 Standard Mode'}
              </button>
            </div>
          </div>

          {/* Pending Auto-Sync Queue */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-[#008080] dark:text-[#CCFF00]" />
                <h4 className="text-sm font-bold text-[#0A2540] dark:text-white">
                  Pending Auto-Sync Queue ({pendingQueue.length})
                </h4>
              </div>

              {pendingQueue.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onTriggerSync}
                    disabled={!isOnline || isSyncing}
                    className="px-3 py-1.5 bg-[#008080] hover:bg-[#006666] text-[#CCFF00] disabled:opacity-50 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer min-h-[44px]"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Sync Now</span>
                  </button>

                  <button
                    onClick={() => clearOfflineQueue()}
                    className="px-3 py-1.5 bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300 rounded-xl text-xs font-bold hover:bg-rose-200 cursor-pointer min-h-[44px]"
                    title="Clear queued items"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {pendingQueue.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  All local actions are fully synchronized with the municipal network.
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Any new neighborhood reports created offline in underground facilities will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {pendingQueue.map((item) => {
                  const badge = getItemTypeBadge(item.type);
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {new Date(item.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </p>
                        {item.lastError && (
                          <p className="text-[10px] text-rose-600 dark:text-rose-400 font-mono">
                            ⚠️ {item.lastError}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeOfflineItem(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Discard item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Notice */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Cityscape Underground Sync guarantees no neighborhood report is lost when working in subterranean spaces, transit tunnels, or remote utility wards.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
