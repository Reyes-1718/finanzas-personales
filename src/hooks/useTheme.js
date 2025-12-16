import { useState, useEffect } from 'react';

/**
 * Hook para manejar el tema oscuro/claro
 */
export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme_preference');
    if (stored) {
      return stored === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('theme_preference', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return {
    isDark,
    toggleTheme
  };
};
