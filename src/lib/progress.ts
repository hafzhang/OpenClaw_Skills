/**
 * Tutorial and skill progress tracking
 * Phase 4: US-080 - Tutorial Progress Tracking
 */

import { ReadingProgress, Section, Tutorial, Skill } from '@/types';
import { storage } from './storage';
import { getAllTutorials, getTutorialBySlug } from './tutorials';
import { getSkillBySlug } from './skills';

const PROGRESS_KEY = 'reading_progress';

// Get all progress entries
export function getAllProgress(): Record<string, ReadingProgress> {
  return storage.progress.get() || {};
}

// Get progress for a specific item
export function getProgress(id: string): ReadingProgress | null {
  const allProgress = getAllProgress();
  return allProgress[id] || null;
}

// Save progress
export function saveProgress(progress: Omit<ReadingProgress, 'lastReadAt'>): boolean {
  const allProgress = getAllProgress();

  allProgress[progress.id] = {
    ...progress,
    lastReadAt: new Date().toISOString(),
  };

  return storage.progress.set(allProgress);
}

// Update scroll position
export function updateScrollPosition(id: string, scrollPosition: number): boolean {
  const progress = getProgress(id);

  if (progress) {
    return saveProgress({
      ...progress,
      scrollPosition,
    });
  }

  return false;
}

// Mark section as completed
export function markSectionCompleted(id: string, sectionId: string): boolean {
  const progress = getProgress(id);

  if (progress) {
    if (!progress.completedSections.includes(sectionId)) {
      const completedSections = [...progress.completedSections, sectionId];
      const totalSections = progress.sections?.length || 1;
      const percentComplete = Math.round((completedSections.length / totalSections) * 100);

      return saveProgress({
        ...progress,
        completedSections,
        percentComplete,
      });
    }
    return true;
  }

  return false;
}

// Calculate progress percentage based on scroll
export function calculateProgressFromScroll(
  scrollPosition: number,
  scrollHeight: number
): number {
  if (scrollHeight <= 0) return 0;
  return Math.min(100, Math.round((scrollPosition / scrollHeight) * 100));
}

// Initialize progress for a tutorial
export function initProgress(
  id: string,
  type: 'tutorial' | 'skill',
  sections: Section[] = []
): ReadingProgress {
  const existing = getProgress(id);

  if (existing) {
    // Update sections if provided and different
    if (sections.length > 0) {
      const newSections = sections.map(s => ({
        ...s,
        completed: existing.completedSections.includes(s.id),
      }));

      const newProgress = {
        ...existing,
        sections: newSections,
      };
      saveProgress(newProgress);
      return newProgress;
    }

    return existing;
  }

  const newProgress: ReadingProgress = {
    id,
    type,
    scrollPosition: 0,
    lastReadAt: new Date().toISOString(),
    percentComplete: 0,
    completedSections: [],
    totalTime: 0,
    sections: sections.map(s => ({ ...s, completed: false })),
  };

  saveProgress(newProgress);
  return newProgress;
}

// Get items with progress
export function getInProgressItems(limit?: number): (ReadingProgress & { item: Tutorial | Skill })[] {
  const allProgress = getAllProgress();

  const items = Object.values(allProgress)
    .filter(p => p.percentComplete > 0 && p.percentComplete < 100)
    .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime())
    .map(progress => {
      let item: Tutorial | Skill | null = null;

      if (progress.type === 'tutorial') {
        item = getTutorialBySlug(progress.id) ?? null;
      } else if (progress.type === 'skill') {
        item = getSkillBySlug(progress.id) ?? null;
      }

      return { ...progress, item };
    })
    .filter((p): p is ReadingProgress & { item: Tutorial | Skill } => p.item !== null);

  return limit ? items.slice(0, limit) : items;
}

// Get completed items
export function getCompletedItems(): (ReadingProgress & { item: Tutorial | Skill })[] {
  const allProgress = getAllProgress();

  return Object.values(allProgress)
    .filter(p => p.percentComplete >= 100)
    .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime())
    .map(progress => {
      let item: Tutorial | Skill | null = null;

      if (progress.type === 'tutorial') {
        item = getTutorialBySlug(progress.id) ?? null;
      } else if (progress.type === 'skill') {
        item = getSkillBySlug(progress.id) ?? null;
      }

      return { ...progress, item };
    })
    .filter((p): p is ReadingProgress & { item: Tutorial | Skill } => p.item !== null);
}

// Get recently viewed items
export function getRecentlyViewed(limit = 5): (ReadingProgress & { item: Tutorial | Skill })[] {
  const allProgress = getAllProgress();

  return Object.values(allProgress)
    .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime())
    .slice(0, limit)
    .map(progress => {
      let item: Tutorial | Skill | null = null;

      if (progress.type === 'tutorial') {
        item = getTutorialBySlug(progress.id) ?? null;
      } else if (progress.type === 'skill') {
        item = getSkillBySlug(progress.id) ?? null;
      }

      return { ...progress, item };
    })
    .filter((p): p is ReadingProgress & { item: Tutorial | Skill } => p.item !== null);
}

// Get "Continue Reading" suggestions
export function getContinueReading(limit = 3): (ReadingProgress & { item: Tutorial | Skill })[] {
  return getInProgressItems(limit);
}

// Reset progress for an item
export function resetProgress(id: string): boolean {
  const allProgress = getAllProgress();
  delete allProgress[id];
  return storage.progress.set(allProgress);
}

// Clear all progress
export function clearAllProgress(): boolean {
  return storage.progress.remove();
}

// Extract sections from tutorial content (h2 headers)
export function extractSectionsFromContent(content: string): Section[] {
  const sections: Section[] = [];
  const regex = /^##\s+(.+)$/gm;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const title = match[1].trim();
    const id = title.toLowerCase().replace(/[^\w]+/g, '-');
    sections.push({ id, title, completed: false });
  }

  return sections;
}

// Get reading statistics
export function getReadingStats() {
  const allProgress = getAllProgress();
  const progressList = Object.values(allProgress);

  return {
    totalItems: progressList.length,
    completedItems: progressList.filter(p => p.percentComplete >= 100).length,
    inProgressItems: progressList.filter(p => p.percentComplete > 0 && p.percentComplete < 100).length,
    totalTimeMinutes: Math.round(progressList.reduce((sum, p) => sum + (p.totalTime || 0), 0) / 60),
  };
}
