import { getLocalISODate } from './realTimeSync';

export interface BackupPayload {
  version: string;
  exportDate: string;
  user: string;
  totalDaysLogged: number;
  data: Record<string, string>;
}

/**
 * Collects all Bruce Arc records, photos, checklists, and settings from localStorage
 * and triggers a browser download of a timestamped .json file.
 */
export function exportAllDataBackup() {
  if (typeof window === 'undefined') return;

  const backupData: Record<string, string> = {};
  let daysCount = 0;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    // Collect all relevant storage keys
    if (
      key.startsWith('arc_day_') ||
      key.startsWith('prashant_') ||
      key.startsWith('winter_arc_') ||
      key.startsWith('bruce_')
    ) {
      const val = localStorage.getItem(key);
      if (val !== null) {
        backupData[key] = val;
        if (key.startsWith('arc_day_')) daysCount++;
      }
    }
  }

  const payload: BackupPayload = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    user: 'Bruce',
    totalDaysLogged: daysCount,
    data: backupData,
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  const dateStr = getLocalISODate();
  a.href = url;
  a.download = `bruce_glowup_backup_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Restores all keys from a BackupPayload JSON file into localStorage.
 */
export function importDataBackup(jsonContent: string): { success: boolean; count: number; error?: string } {
  try {
    const parsed: BackupPayload = JSON.parse(jsonContent);
    if (!parsed || !parsed.data) {
      return { success: false, count: 0, error: 'Invalid backup file format.' };
    }

    let restoredCount = 0;
    Object.entries(parsed.data).forEach(([key, val]) => {
      localStorage.setItem(key, val);
      restoredCount++;
    });

    return { success: true, count: restoredCount };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'Failed to parse JSON backup.' };
  }
}
