import { useState, useEffect } from 'react';

/**
 * Hook compartido para detectar si la pantalla cumple una media query.
 * Reemplaza el patrón repetido de useState + useEffect + resize listener.
 *
 * @param {string} query - CSS media query, e.g. '(max-width: 767px)'
 * @returns {boolean}
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 767px)');
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

/** Shorthand: true cuando la pantalla es menor a 768px */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
