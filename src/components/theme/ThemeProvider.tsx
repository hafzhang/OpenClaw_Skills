'use client';

import * as React from 'react';
import { ThemeMode, ThemeSettings } from '@/types';
import { storage, getSystemTheme, listenSystemThemeChange } from '@/lib/storage';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  highContrast: boolean;
  reducedMotion: boolean;
  setTheme: (theme: ThemeMode) => void;
  setHighContrast: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);
  const [settings, setSettings] = React.useState<ThemeSettings>({
    mode: defaultTheme,
    highContrast: false,
    reducedMotion: false,
  });

  // Load settings from storage on mount
  React.useEffect(() => {
    setMounted(true);
    const saved = storage.theme.get();
    if (saved) {
      setSettings(prev => ({
        ...prev,
        mode: saved.theme || defaultTheme,
        highContrast: saved.highContrast || false,
      }));
    }
  }, [defaultTheme]);

  // Calculate resolved theme (light or dark)
  const resolvedTheme = React.useMemo(() => {
    if (settings.mode === 'system') {
      return getSystemTheme();
    }
    return settings.mode;
  }, [settings.mode]);

  // Apply theme to document
  React.useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Remove both classes and add the active one
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);

    // Apply high contrast mode
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Save to storage
    storage.theme.set({
      theme: settings.mode,
      highContrast: settings.highContrast,
    });
  }, [mounted, resolvedTheme, settings.highContrast, settings.reducedMotion]);

  // Listen for system theme changes
  React.useEffect(() => {
    if (settings.mode !== 'system') return;

    return listenSystemThemeChange((theme) => {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    });
  }, [settings.mode]);

  const setTheme = React.useCallback((theme: ThemeMode) => {
    setSettings(prev => ({ ...prev, mode: theme }));
  }, []);

  const setHighContrast = React.useCallback((enabled: boolean) => {
    setSettings(prev => ({ ...prev, highContrast: enabled }));
  }, []);

  const setReducedMotion = React.useCallback((enabled: boolean) => {
    setSettings(prev => ({ ...prev, reducedMotion: enabled }));
  }, []);

  const toggleTheme = React.useCallback(() => {
    setSettings(prev => ({
      ...prev,
      mode: prev.mode === 'dark' ? 'light' : prev.mode === 'light' ? 'system' : 'dark',
    }));
  }, []);

  const value = React.useMemo(
    () => ({
      theme: settings.mode,
      resolvedTheme,
      highContrast: settings.highContrast,
      reducedMotion: settings.reducedMotion,
      setTheme,
      setHighContrast,
      setReducedMotion,
      toggleTheme,
    }),
    [
      settings.mode,
      resolvedTheme,
      settings.highContrast,
      settings.reducedMotion,
      setTheme,
      setHighContrast,
      setReducedMotion,
      toggleTheme,
    ]
  );

  // Prevent flash of wrong theme
  if (!mounted) {
    return <>{children}</>;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
