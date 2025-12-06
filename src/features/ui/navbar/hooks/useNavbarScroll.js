// src/features/ui/navbar/hooks/useNavbarScroll.js
import { useEffect, useState } from 'react';

export function useNavbarScroll() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return scrolled;
}
