// ============================================================
// WINTER ARC — Notification System (Section 5 Spec)
// ============================================================

export interface NotificationSettings {
  enabled: boolean;
  morningReminder: boolean;
  morningTime: string; // "07:00"
  habitReminders: boolean;
  eveningReminder: boolean;
  eveningTime: string; // "21:30"
  milestones: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:30"
  quietHoursEnd: string; // "06:30"
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  morningReminder: true,
  morningTime: '07:00',
  habitReminders: true,
  eveningReminder: true,
  eveningTime: '21:30',
  milestones: true,
  quietHoursEnabled: true,
  quietHoursStart: '22:30',
  quietHoursEnd: '06:30',
};

const STORAGE_KEY = 'winter_arc_notification_settings';

/**
 * Get saved notification settings from localStorage
 */
export function getNotificationSettings(): NotificationSettings {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_SETTINGS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to parse notification settings', e);
  }
  return DEFAULT_NOTIFICATION_SETTINGS;
}

/**
 * Save notification settings
 */
export function saveNotificationSettings(settings: NotificationSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

/**
 * Check if the browser supports notifications
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Check current browser notification permission
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  try {
    const perm = await Notification.requestPermission();
    const isGranted = perm === 'granted';
    if (isGranted) {
      const current = getNotificationSettings();
      saveNotificationSettings({ ...current, enabled: true });
    }
    return isGranted;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return false;
  }
}

/**
 * Check if current time falls within Quiet Hours (e.g. 10:30 PM - 6:30 AM)
 */
export function isCurrentlyQuietHours(settings: NotificationSettings): boolean {
  if (!settings.quietHoursEnabled) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [sHour, sMin] = settings.quietHoursStart.split(':').map(Number);
  const [eHour, eMin] = settings.quietHoursEnd.split(':').map(Number);

  const startMinutes = sHour * 60 + sMin;
  const endMinutes = eHour * 60 + eMin;

  if (startMinutes > endMinutes) {
    // Overnight interval (e.g. 22:30 to 06:30)
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  } else {
    // Same-day interval
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }
}

export type ArcNotificationType = 'morning' | 'habit' | 'incomplete' | 'evening' | 'milestone';

/**
 * Trigger an instant Arc notification (if permitted and not in quiet hours)
 */
export function triggerArcNotification(
  type: ArcNotificationType,
  customBody?: string,
  force: boolean = false
): boolean {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return false;

  const settings = getNotificationSettings();
  if (!settings.enabled && !force) return false;
  if (isCurrentlyQuietHours(settings) && !force) return false;

  let title = 'Winter Arc ❄️';
  let body = 'Show up for who you said you would become.';

  switch (type) {
    case 'morning':
      if (!settings.morningReminder && !force) return false;
      title = 'Winter Arc · Morning Protocol ❄️';
      body = customBody || 'Your Arc starts now. The standard is set in the morning.';
      break;
    case 'habit':
      if (!settings.habitReminders && !force) return false;
      title = 'Habit Trigger ⚡';
      body = customBody || 'Keep the promise. Do not negotiate with your standards.';
      break;
    case 'incomplete':
      title = 'Commitments Remaining 🛡️';
      body = customBody || 'You still have commitments left today. Protect your minimums.';
      break;
    case 'evening':
      if (!settings.eveningReminder && !force) return false;
      title = 'Evening Lock-In 🔒';
      body = customBody || 'Before the day ends... did you show up? Lock in your progress.';
      break;
    case 'milestone':
      if (!settings.milestones && !force) return false;
      title = 'Arc Milestone Reached! 🏆';
      body = customBody || "Milestone day unlocked. You're not the same person who started.";
      break;
  }

  try {
    new Notification(title, {
      body,
      icon: '/manifest.json', // browser icon
      badge: '/manifest.json',
      tag: `winter_arc_${type}`,
    });
    return true;
  } catch (err) {
    console.warn('Failed to dispatch notification', err);
    return false;
  }
}
