import { useEffect, useState } from 'react';

const STORAGE_KEY = 'zaynarah_recent_searches';
const MAX_ITEMS = 6;

export default function useRecentSearches() {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setRecent(Array.isArray(stored) ? stored : []);
    } catch {
      setRecent([]);
    }
  }, []);

  const addSearch = (query) => {
    if (!query || query.length < 2) return;

    setRecent((prev) => {
      const next = [
        query,
        ...prev.filter((q) => q.toLowerCase() !== query.toLowerCase()),
      ].slice(0, MAX_ITEMS);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearRecent = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecent([]);
  };

  return {
    recent,
    addSearch,
    clearRecent,
  };
}
