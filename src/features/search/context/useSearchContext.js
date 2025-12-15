import { useContext } from 'react';
import { SearchContext } from './SearchContext';

export default function useSearchContext() {
  const ctx = useContext(SearchContext);

  if (!ctx) {
    throw new Error('useSearchContext must be used inside <SearchProvider />');
  }

  return ctx;
}
