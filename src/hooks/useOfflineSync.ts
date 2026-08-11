import { useState, useEffect, useCallback } from 'react';
import {
  getOfflineQueue,
  getSimulatedUndergroundMode,
  setSimulatedUndergroundMode,
  processOfflineQueue,
  PendingOfflineItem,
  getLastSyncTimestamp,
} from '../lib/offlineQueue';

export function useOfflineSync(onSyncItem?: (item: PendingOfflineItem) => Promise<boolean>) {
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isUndergroundSimulated, setIsUndergroundSimulated] = useState<boolean>(
    getSimulatedUndergroundMode()
  );
  const [pendingQueue, setPendingQueue] = useState<PendingOfflineItem[]>(getOfflineQueue());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(getLastSyncTimestamp());
  const [lastSyncSummary, setLastSyncSummary] = useState<{ synced: number; failed: number } | null>(null);

  // Effective online status takes both browser network and manual subterranean mode toggle into account
  const isEffectiveOnline = isBrowserOnline && !isUndergroundSimulated;

  const refreshQueue = useCallback(() => {
    setPendingQueue(getOfflineQueue());
  }, []);

  // Sync execution handler
  const triggerSync = useCallback(async () => {
    if (!isEffectiveOnline || isSyncing) return;
    const currentQueue = getOfflineQueue();
    if (currentQueue.length === 0) return;

    setIsSyncing(true);
    try {
      const result = await processOfflineQueue(async (item) => {
        if (onSyncItem) {
          return await onSyncItem(item);
        }
        return false;
      });

      setLastSyncSummary({ synced: result.successCount, failed: result.failCount });
      setLastSyncTime(getLastSyncTimestamp());
      refreshQueue();
    } catch (err) {
      console.warn('Sync loop exception:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [isEffectiveOnline, isSyncing, onSyncItem, refreshQueue]);

  useEffect(() => {
    const handleOnline = () => {
      setIsBrowserOnline(true);
    };

    const handleOffline = () => {
      setIsBrowserOnline(false);
    };

    const handleUndergroundChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsUndergroundSimulated(customEvent.detail?.enabled ?? getSimulatedUndergroundMode());
    };

    const handleQueueChange = () => {
      refreshQueue();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('cityscape-underground-mode-changed', handleUndergroundChange);
    window.addEventListener('cityscape-offline-queue-changed', handleQueueChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('cityscape-underground-mode-changed', handleUndergroundChange);
      window.removeEventListener('cityscape-offline-queue-changed', handleQueueChange);
    };
  }, [refreshQueue]);

  // Auto-sync when effective network becomes online and queue is not empty
  useEffect(() => {
    if (isEffectiveOnline && pendingQueue.length > 0 && !isSyncing) {
      const timer = setTimeout(() => {
        triggerSync();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isEffectiveOnline, pendingQueue.length, isSyncing, triggerSync]);

  const toggleUndergroundMode = useCallback((enabled: boolean) => {
    setSimulatedUndergroundMode(enabled);
    setIsUndergroundSimulated(enabled);
  }, []);

  return {
    isOnline: isEffectiveOnline,
    isBrowserOnline,
    isUndergroundSimulated,
    pendingQueue,
    pendingCount: pendingQueue.length,
    isSyncing,
    lastSyncTime,
    lastSyncSummary,
    triggerSync,
    toggleUndergroundMode,
    refreshQueue,
  };
}
