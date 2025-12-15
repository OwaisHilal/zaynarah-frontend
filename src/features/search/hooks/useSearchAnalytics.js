import { useRef } from 'react';
import { SEARCH_EVENTS } from '../analytics/searchEvents';
import { trackSearchEvent } from '../analytics/trackSearchEvent';

export default function useSearchAnalytics() {
  const lastQueryRef = useRef('');

  const trackOpen = () => {
    trackSearchEvent(SEARCH_EVENTS.OPEN);
  };

  const trackQuery = (query) => {
    if (!query || query === lastQueryRef.current) return;
    lastQueryRef.current = query;

    trackSearchEvent(SEARCH_EVENTS.QUERY, { query });
  };

  const trackResultClick = ({ query, productId }) => {
    trackSearchEvent(SEARCH_EVENTS.RESULT_CLICK, {
      query,
      productId,
    });
  };

  const trackAddToCart = ({ query, productId }) => {
    trackSearchEvent(SEARCH_EVENTS.ADD_TO_CART, {
      query,
      productId,
    });
  };

  const trackNoResults = (query) => {
    trackSearchEvent(SEARCH_EVENTS.NO_RESULTS, { query });
  };

  return {
    trackOpen,
    trackQuery,
    trackResultClick,
    trackAddToCart,
    trackNoResults,
  };
}
