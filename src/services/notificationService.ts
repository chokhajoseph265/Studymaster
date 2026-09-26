/**
 * StudyMaster Malawi - Notification & Alert Service
 * Handles:
 * 1. Web / System Browser Notifications (PWA and desktop push alerts)
 * 2. Polite audio chimes (synthesized via Web Audio API, 100% offline & self-contained)
 * 3. In-app toast event dispatching
 * 4. User notification preferences (sound, browser push, daily study reminders)
 * 5. Daily study reminder scheduling
 */

export interface NotificationSettings {
  soundEnabled: boolean;
  browserPushEnabled: boolean;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string; // e.g. "19:00"
}

export interface InAppToastPayload {
  id: string;
  title: string;
  message: string;
  type?: 'exam_alert' | 'timetable' | 'curriculum' | 'study_tip' | 'announcement' | 'system';
  category?: string;
  actionText?: string;
  onAction?: () => void;
  durationMs?: number;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  soundEnabled: true,
  browserPushEnabled: false,
  dailyReminderEnabled: true,
  dailyReminderTime: '19:00'
};

const SETTINGS_KEY = 'studymaster_notification_settings';
const LAST_REMINDER_DATE_KEY = 'studymaster_last_study_reminder_date';

class NotificationService {
  private toastSubscribers: Set<(toast: InAppToastPayload | null) => void> = new Set();
  private currentToast: InAppToastPayload | null = null;
  private dismissTimer: ReturnType<typeof setTimeout> | null = null;
  private reminderCheckInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initStudyReminderChecker();
    }
  }

  // --- Settings Persistence ---
  public getSettings(): NotificationSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  }

  public updateSettings(partial: Partial<NotificationSettings>): NotificationSettings {
    const current = this.getSettings();
    const updated = { ...current, ...partial };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return updated;
  }

  // --- Browser Push Permission & Dispatch ---
  public isBrowserNotificationSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getBrowserPermission(): NotificationPermission | 'unsupported' {
    if (!this.isBrowserNotificationSupported()) return 'unsupported';
    return Notification.permission;
  }

  public async requestBrowserPermission(): Promise<NotificationPermission | 'unsupported'> {
    if (!this.isBrowserNotificationSupported()) return 'unsupported';
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.updateSettings({ browserPushEnabled: true });
      } else {
        this.updateSettings({ browserPushEnabled: false });
      }
      return permission;
    } catch (e) {
      console.warn('Error requesting notification permission:', e);
      return 'denied';
    }
  }

  /**
   * Dispatches a system/device notification if permission is granted
   */
  public sendBrowserNotification(title: string, options?: { body?: string; tag?: string; icon?: string }) {
    if (!this.isBrowserNotificationSupported()) return false;
    if (Notification.permission !== 'granted') return false;

    try {
      const n = new Notification(title, {
        body: options?.body,
        icon: options?.icon || '/icon.png',
        tag: options?.tag || 'studymaster-alert'
      });

      n.onclick = () => {
        window.focus();
        n.close();
      };
      return true;
    } catch (e) {
      console.warn('Could not display browser notification:', e);
      return false;
    }
  }

  // --- Synthesized Audio Chime (Offline, Zero Assets Needed) ---
  public playChime() {
    const settings = this.getSettings();
    if (!settings.soundEnabled) return;
    if (typeof window === 'undefined') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;

      // Note 1: High crisp pleasant harmonic (A5 = 880Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.1, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2: Warm upper resolve harmonic (C#6 = 1108.7Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1108.7, now + 0.1);
      gain2.gain.setValueAtTime(0.12, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.55);
    } catch {
      // AudioContext policy restriction, safely ignore
    }
  }

  // --- In-App Toast Banner ---
  public subscribeToast(callback: (toast: InAppToastPayload | null) => void): () => void {
    this.toastSubscribers.add(callback);
    callback(this.currentToast);
    return () => {
      this.toastSubscribers.delete(callback);
    };
  }

  public showToast(payload: InAppToastPayload) {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }

    this.currentToast = payload;
    this.toastSubscribers.forEach((cb) => cb(payload));

    // Play chime if enabled
    this.playChime();

    // Auto dismiss after specified or default duration
    const duration = payload.durationMs ?? 6000;
    if (duration > 0) {
      this.dismissTimer = setTimeout(() => {
        this.dismissToast();
      }, duration);
    }
  }

  public dismissToast() {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
    this.currentToast = null;
    this.toastSubscribers.forEach((cb) => cb(null));
  }

  // --- Test Notification Trigger ---
  public triggerTestNotification(onOpenModal?: () => void) {
    // 1. Play chime
    this.playChime();

    // 2. Dispatch in-app toast
    this.showToast({
      id: `test-notif-${Date.now()}`,
      title: 'StudyMaster Alert Active',
      message: 'Notifications are working properly! You will receive MANEB updates, study tips, and revision reminders.',
      type: 'exam_alert',
      category: 'System Test',
      actionText: 'View Alerts',
      onAction: onOpenModal,
      durationMs: 7000
    });

    // 3. Dispatch system browser push notification if permitted
    if (this.getBrowserPermission() === 'granted') {
      this.sendBrowserNotification('StudyMaster', {
        body: 'Notifications are working properly! MANEB updates and study reminders are active.',
        icon: '/icon.png'
      });
    }
  }

  // --- Daily Study Reminder Check ---
  private initStudyReminderChecker() {
    // Check every 60 seconds if it's time for the daily reminder
    this.reminderCheckInterval = setInterval(() => {
      this.checkAndFireDailyReminder();
    }, 60 * 1000);

    // Initial check after short delay
    setTimeout(() => {
      this.checkAndFireDailyReminder();
    }, 5000);
  }

  public checkAndFireDailyReminder() {
    const settings = this.getSettings();
    if (!settings.dailyReminderEnabled) return;

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    try {
      const lastSentDate = localStorage.getItem(LAST_REMINDER_DATE_KEY);
      if (lastSentDate === todayStr) {
        // Already triggered today
        return;
      }

      // Check time
      const [targetHours, targetMinutes] = settings.dailyReminderTime.split(':').map(Number);
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      // Fire if current time is at or past the target time today
      if (currentHours > targetHours || (currentHours === targetHours && currentMinutes >= (targetMinutes || 0))) {
        localStorage.setItem(LAST_REMINDER_DATE_KEY, todayStr);

        this.showToast({
          id: `reminder-${todayStr}`,
          title: '📖 Evening Revision Time!',
          message: 'Spend 15 minutes today reviewing a MANEB topic or practicing a past paper to keep your study momentum strong.',
          type: 'study_tip',
          category: 'Daily Study Habit',
          actionText: 'Study Now',
          durationMs: 8000
        });

        if (this.getBrowserPermission() === 'granted') {
          this.sendBrowserNotification('StudyMaster Revision Time', {
            body: 'Keep your study progress going! Spend 15 minutes practicing a MANEB past paper.',
            icon: '/icon.png'
          });
        }
      }
    } catch {
      // ignore
    }
  }
}

export const notificationService = new NotificationService();
