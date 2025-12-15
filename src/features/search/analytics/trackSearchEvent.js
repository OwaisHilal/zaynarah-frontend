const STORAGE_KEY = 'zaynarah_search_events';

export function trackSearchEvent(event, payload = {}) {
  const entry = {
    event,
    payload,
    timestamp: Date.now(),
  };

  // Dev logging (remove later)
  if (import.meta.env.DEV) {
    console.log('[Search Analytics]', entry);
  }

  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    existing.push(entry);

    // keep last 100 events only
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(-100)));
  } catch {
    // fail silently
  }
}
