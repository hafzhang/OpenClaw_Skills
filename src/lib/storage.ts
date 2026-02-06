/**
 * Client-side storage utilities for Phase 4 features
 * All data is stored in localStorage to maintain static architecture
 */

import { Bookmark, InstalledSkill, ReadingProgress, Rating } from '@/types';

const STORAGE_PREFIX = 'openclaw_';

// Generic storage operations
export class Storage<T> {
  constructor(private key: string) {}

  private getPrefixedKey(): string {
    return `${STORAGE_PREFIX}${this.key}`;
  }

  get(): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const item = localStorage.getItem(this.getPrefixedKey());
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage (${this.key}):`, error);
      return null;
    }
  }

  set(value: T): boolean {
    if (typeof window === 'undefined') return false;

    try {
      localStorage.setItem(this.getPrefixedKey(), JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${this.key}):`, error);
      return false;
    }
  }

  remove(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      localStorage.removeItem(this.getPrefixedKey());
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${this.key}):`, error);
      return false;
    }
  }

  clear(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
}

// Storage instances for different features
export const storage = {
  bookmarks: new Storage<Bookmark[]>('bookmarks'),
  progress: new Storage<Record<string, ReadingProgress>>('progress'),
  ratings: new Storage<Record<string, Rating>>('ratings'),
  installations: new Storage<InstalledSkill[]>('installations'),
  theme: new Storage<ThemeData>('theme'),

  // Generic getter/setter for custom keys
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  },

  set<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  },
};

// Local Types
export interface ThemeData {
  theme: 'light' | 'dark' | 'system';
  highContrast: boolean;
}

// Export/Import utilities
export function exportData(): string {
  const data = {
    bookmarks: storage.bookmarks.get(),
    progress: storage.progress.get(),
    ratings: storage.ratings.get(),
    installations: storage.installations.get(),
    theme: storage.theme.get(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);

    if (data.bookmarks) storage.bookmarks.set(data.bookmarks);
    if (data.progress) storage.progress.set(data.progress);
    if (data.ratings) storage.ratings.set(data.ratings);
    if (data.installations) storage.installations.set(data.installations);
    if (data.theme) storage.theme.set(data.theme);

    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}

// Browser detection for system preference
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Listen for system theme changes
export function listenSystemThemeChange(callback: (theme: 'light' | 'dark') => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e: MediaQueryListEvent) => callback(e.matches ? 'dark' : 'light');

  mediaQuery.addEventListener('change', handler);

  return () => mediaQuery.removeEventListener('change', handler);
}
