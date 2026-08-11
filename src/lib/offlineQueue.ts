import { Report } from '../types';

export type OfflineItemType = 
  | 'CREATE_REPORT'
  | 'UPVOTE_REPORT'
  | 'ADD_COMMENT'
  | 'UPDATE_STATUS'
  | 'VERIFY_REPORT'
  | 'CONFIRM_RESOLUTION';

export interface PendingOfflineItem {
  id: string;
  type: OfflineItemType;
  title: string;
  payload: any;
  createdAt: string;
  attempts: number;
  lastError?: string;
  offlineReportTempId?: string;
}

const OFFLINE_QUEUE_KEY = 'cityscape_offline_queue';
const CACHED_REPORTS_KEY = 'cityscape_cached_reports';
const SIMULATED_UNDERGROUND_KEY = 'cityscape_simulated_underground_mode';
const LAST_SYNC_TIMESTAMP_KEY = 'cityscape_last_sync_timestamp';

export function getSimulatedUndergroundMode(): boolean {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(SIMULATED_UNDERGROUND_KEY) === 'true';
}

export function setSimulatedUndergroundMode(enabled: boolean): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(SIMULATED_UNDERGROUND_KEY, enabled ? 'true' : 'false');
  // Dispatch custom event to notify listeners instantly across components
  window.dispatchEvent(new CustomEvent('cityscape-underground-mode-changed', { detail: { enabled } }));
}

export function getOfflineQueue(): PendingOfflineItem[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Error reading offline queue:', err);
    return [];
  }
}

export function saveOfflineQueue(queue: PendingOfflineItem[]): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    window.dispatchEvent(new CustomEvent('cityscape-offline-queue-changed', { detail: { queueLength: queue.length } }));
  } catch (err) {
    console.warn('Error saving offline queue:', err);
  }
}

export function enqueueOfflineItem(type: OfflineItemType, title: string, payload: any, offlineReportTempId?: string): PendingOfflineItem {
  const queue = getOfflineQueue();
  const newItem: PendingOfflineItem = {
    id: `off_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type,
    title,
    payload,
    createdAt: new Date().toISOString(),
    attempts: 0,
    offlineReportTempId,
  };
  const updated = [newItem, ...queue];
  saveOfflineQueue(updated);
  return newItem;
}

export function removeOfflineItem(id: string): void {
  const queue = getOfflineQueue();
  const updated = queue.filter((item) => item.id !== id);
  saveOfflineQueue(updated);
}

export function clearOfflineQueue(): void {
  saveOfflineQueue([]);
}

export function getCachedReports(): Report[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CACHED_REPORTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Error reading cached reports:', err);
    return [];
  }
}

export function saveCachedReports(reports: Report[]): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(CACHED_REPORTS_KEY, JSON.stringify(reports));
  } catch (err) {
    console.warn('Error saving cached reports:', err);
  }
}

export function getLastSyncTimestamp(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(LAST_SYNC_TIMESTAMP_KEY);
}

export function updateLastSyncTimestamp(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(LAST_SYNC_TIMESTAMP_KEY, new Date().toISOString());
}

/**
  * Processes the offline queue sequentially by executing the provided sync dispatcher
  */
export async function processOfflineQueue(
  dispatchFn: (item: PendingOfflineItem) => Promise<boolean>
): Promise<{ successCount: number; failCount: number }> {
  const queue = getOfflineQueue();
  if (queue.length === 0) {
    return { successCount: 0, failCount: 0 };
  }

  let successCount = 0;
  let failCount = 0;
  const remaining: PendingOfflineItem[] = [];

  for (const item of queue) {
    try {
      item.attempts += 1;
      const ok = await dispatchFn(item);
      if (ok) {
        successCount++;
      } else {
        failCount++;
        item.lastError = 'Server sync rejected item';
        remaining.push(item);
      }
    } catch (err: any) {
      failCount++;
      item.lastError = err.message || 'Network dispatch error';
      remaining.push(item);
    }
  }

  saveOfflineQueue(remaining);
  updateLastSyncTimestamp();
  return { successCount, failCount };
}
