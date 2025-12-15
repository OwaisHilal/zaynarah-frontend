import { useEffect, useRef, useState } from 'react';
import { fetchProducts } from '@/features/products/services/productsApi';

// --- simple fuzzy score (fast, no deps) ---
function fuzzyScore(text = '', query = '') {
  if (!query) return 0;
  text = text.toLowerCase();
  query = query.toLowerCase();

  let score = 0;
  let ti = 0;

  for (let qi = 0; qi < query.length; qi++) {
    const idx = text.indexOf(query[qi], ti);
    if (idx === -1) return 0;
    // reward closer matches
    score += 5 - Math.min(idx - ti, 4);
    ti = idx + 1;
  }

  // bonus for prefix
  if (text.startsWith(query)) score += 10;
  return score;
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    // debounce
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      // cancel previous request
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      try {
        const res = await fetchProducts(
          { search: query, limit: 12 },
          { signal: abortRef.current.signal }
        );

        const data = res?.data ?? [];

        // client-side fuzzy re-rank
        const ranked = data
          .map((p) => ({
            ...p,
            __score: fuzzyScore(p.title, query) + fuzzyScore(p.category, query),
          }))
          .filter((p) => p.__score > 0)
          .sort((a, b) => b.__score - a.__score)
          .slice(0, 8);

        setResults(ranked);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Search error:', err);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return {
    query,
    results,
    loading,
    search: setQuery,
  };
}
