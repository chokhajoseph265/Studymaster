export interface AppSyncEvent {
  type: 'announcements_updated' | 'notes_updated' | 'topics_updated' | 'past_papers_updated' | 'timetable_updated' | 'student_updated' | 'reports_updated' | 'general_sync';
  source: 'admin' | 'student';
  timestamp: number;
  payload?: any;
}

const STORAGE_KEY = 'studymaster_cross_app_sync';
const CHANNEL_NAME = 'studymaster_cross_app_channel';

class SyncManager {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(event: AppSyncEvent) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        if ('BroadcastChannel' in window) {
          this.channel = new BroadcastChannel(CHANNEL_NAME);
          this.channel.onmessage = (e) => {
            if (e.data) {
              this.notifyListeners(e.data);
            }
          };
        }
      } catch (err) {
        console.warn('BroadcastChannel not available, falling back to storage events', err);
      }

      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.notifyListeners(parsed);
          } catch {
            // ignore
          }
        }
      });

      window.addEventListener('studymaster_internal_sync' as any, (e: CustomEvent<AppSyncEvent>) => {
        if (e.detail) {
          this.notifyListeners(e.detail);
        }
      });
    }
  }

  private notifyListeners(event: AppSyncEvent) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in sync listener:', err);
      }
    });
  }

  public broadcast(type: AppSyncEvent['type'], source: 'admin' | 'student' = 'admin', payload?: any) {
    const event: AppSyncEvent = {
      type,
      source,
      timestamp: Date.now(),
      payload
    };

    // 1. BroadcastChannel (for other tabs / windows)
    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch (e) {
        console.warn('Channel postMessage failed:', e);
      }
    }

    // 2. localStorage (for cross-tab fallback)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(event));
    } catch {
      // ignore
    }

    // 3. CustomEvent (for same tab)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('studymaster_internal_sync', { detail: event }));
    }
  }

  public subscribe(callback: (event: AppSyncEvent) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public getLastSyncTime(): number {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (item) {
        const parsed = JSON.parse(item);
        return parsed.timestamp || Date.now();
      }
    } catch {
      // ignore
    }
    return Date.now();
  }
}

export const syncManager = new SyncManager();
