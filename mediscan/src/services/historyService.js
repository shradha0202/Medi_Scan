// Stores scan history, recent searches and reports in LocalStorage.
const HISTORY_KEY = 'mediscan.history';
const SEARCH_KEY = 'mediscan.recentSearches';
const REPORT_KEY = 'mediscan.reports';

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const write = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full or blocked */ }
};

export const getHistory = () => read(HISTORY_KEY, []);

// Number of scans of the same medicine ID within the last 24 hours.
export function countRecentScans(identifier) {
  const since = Date.now() - 24 * 60 * 60 * 1000;
  return getHistory().filter((h) => h.identifier === identifier && new Date(h.scannedAt).getTime() > since).length;
}

// Last saved scan for an ID that has a record (used for offline viewing).
export const findSaved = (identifier) => getHistory().find((h) => h.identifier === identifier && h.record) || null;

export function recordScan(result) {
  const entry = {
    scanId: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    identifier: result.identifier,
    status: result.status,
    record: result.record || null,
    duplicate: !!result.duplicate,
    scannedAt: new Date().toISOString(),
  };
  write(HISTORY_KEY, [entry, ...getHistory()].slice(0, 200));
  return entry;
}

export const clearHistory = () => write(HISTORY_KEY, []);

export const getRecentSearches = () => read(SEARCH_KEY, []);
export function addRecentSearch(q) {
  const text = q.trim();
  if (!text) return;
  write(SEARCH_KEY, [text, ...getRecentSearches().filter((s) => s.toLowerCase() !== text.toLowerCase())].slice(0, 6));
}
export const clearRecentSearches = () => write(SEARCH_KEY, []);

export const getReports = () => read(REPORT_KEY, []);
export const saveReport = (report) => write(REPORT_KEY, [report, ...getReports()]);

export function clearAllData() {
  [HISTORY_KEY, SEARCH_KEY, REPORT_KEY].forEach((k) => localStorage.removeItem(k));
}
