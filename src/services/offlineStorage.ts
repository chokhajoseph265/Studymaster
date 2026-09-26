import { DownloadedItem, FormLevel } from '../types';

const OFFLINE_STORAGE_KEY = 'studymaster_offline_library_v1';
const OFFLINE_SYNC_QUEUE_KEY = 'studymaster_offline_sync_queue_v1';

export interface SyncQueueItem {
  id: string;
  type: 'quiz_submission' | 'activity_point' | 'study_progress';
  payload: any;
  timestamp: string;
}

export const offlineStorage = {
  getDownloadedItems(): DownloadedItem[] {
    try {
      const raw = localStorage.getItem(OFFLINE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  isItemDownloaded(id: string): boolean {
    const items = this.getDownloadedItems();
    return items.some((item) => item.id === id);
  },

  getDownloadedItem(id: string): DownloadedItem | undefined {
    const items = this.getDownloadedItems();
    return items.find((item) => item.id === id);
  },

  saveDownloadedItem(
    id: string,
    type: DownloadedItem['type'],
    title: string,
    subjectName: string,
    form: FormLevel,
    version: number,
    data: any
  ): DownloadedItem {
    const items = this.getDownloadedItems();
    const existingIndex = items.findIndex((item) => item.id === id);

    // Calculate approximate size in bytes
    const str = JSON.stringify(data);
    const fileSizeBytes = new Blob([str]).size + 1024 * (type === 'past_paper' ? 450 : 25);

    const newItem: DownloadedItem = {
      id,
      type,
      title,
      subjectName,
      form,
      version,
      latestServerVersion: version,
      downloadedAt: new Date().toISOString(),
      fileSizeBytes,
      data
    };

    if (existingIndex !== -1) {
      items[existingIndex] = newItem;
    } else {
      items.unshift(newItem);
    }

    try {
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Offline storage quota issue:', e);
    }

    return newItem;
  },

  removeDownloadedItem(id: string): void {
    const items = this.getDownloadedItems().filter((item) => item.id !== id);
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(items));
  },

  clearAllDownloads(): void {
    localStorage.removeItem(OFFLINE_STORAGE_KEY);
  },

  // Check if any downloaded items have higher versions on the server
  checkVersionUpdates(serverItems: { id: string; version: number }[]): { id: string; updateAvailable: boolean }[] {
    const downloads = this.getDownloadedItems();
    return downloads.map((dl) => {
      const serverMatch = serverItems.find((s) => s.id === dl.id);
      const updateAvailable = serverMatch ? serverMatch.version > dl.version : false;
      return { id: dl.id, updateAvailable };
    });
  },

  // Offline sync queue
  getSyncQueue(): SyncQueueItem[] {
    try {
      const raw = localStorage.getItem(OFFLINE_SYNC_QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  enqueueSync(type: SyncQueueItem['type'], payload: any): void {
    const queue = this.getSyncQueue();
    queue.push({
      id: `sync-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      payload,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(OFFLINE_SYNC_QUEUE_KEY, JSON.stringify(queue));
  },

  clearSyncQueue(): void {
    localStorage.removeItem(OFFLINE_SYNC_QUEUE_KEY);
  },

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }
};
