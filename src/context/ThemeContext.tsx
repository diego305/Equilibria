import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemePreference = 'auto' | 'light' | 'dark';

interface ThemeContextType {
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isNightTime: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(() => {
    try {
      const saved = localStorage.getItem('equilibria_theme_preference');
      if (saved === 'light' || saved === 'dark' || saved === 'auto') {
        return saved;
      }
    } catch (e) {
      // Ignore
    }
    return 'auto';
  });

  const [isSystemDark, setIsSystemDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [isNightTime, setIsNightTime] = useState<boolean>(() => {
    const hour = new Date().getHours();
    return hour >= 20 || hour < 7;
  });

  // Listen to system changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsSystemDark(e.matches);
    mediaQuery.addEventListener('change', handler);

    // Periodically update night time check
    const interval = setInterval(() => {
      const hour = new Date().getHours();
      setIsNightTime(hour >= 20 || hour < 7);
    }, 60000);

    return () => {
      mediaQuery.removeEventListener('change', handler);
      clearInterval(interval);
    };
  }, []);

  const isDark =
    themePreference === 'dark' ||
    (themePreference === 'auto' && (isSystemDark || isNightTime));

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [isDark]);

  const setThemePreference = (pref: ThemePreference) => {
    setThemePreferenceState(pref);
    try {
      localStorage.setItem('equilibria_theme_preference', pref);
    } catch (e) {
      // Ignore
    }
  };

  const toggleTheme = () => {
    // When the user clicks the toggle, immediately invert the active visual mode
    const nextTheme = isDark ? 'light' : 'dark';
    setThemePreference(nextTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        themePreference,
        setThemePreference,
        toggleTheme,
        isDark,
        isNightTime,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
