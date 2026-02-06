/**
 * Bookmarking system for skills, tutorials, and configs
 * Phase 4: US-079 - Bookmarking & Reading List
 */

import { Bookmark, BookmarkFolder } from '@/types';
import { storage } from './storage';
import { getSkillBySlug } from './skills';
import { getTutorialBySlug } from './tutorials';
import { getConfigBySlug } from './configs';

const BOOKMARKS_KEY = 'bookmarks';
const BOOKMARK_FOLDERS_KEY = 'bookmark_folders';

// Get all bookmarks
export function getAllBookmarks(): Bookmark[] {
  return storage.bookmarks.get() || [];
}

// Check if an item is bookmarked
export function isBookmarked(id: string): boolean {
  const bookmarks = getAllBookmarks();
  return bookmarks.some(b => b.id === id);
}

// Add a bookmark
export function addBookmark(bookmark: Omit<Bookmark, 'createdAt'>): boolean {
  const bookmarks = getAllBookmarks();

  // Check if already exists
  if (bookmarks.some(b => b.id === bookmark.id)) {
    return false;
  }

  const newBookmark: Bookmark = {
    ...bookmark,
    createdAt: new Date().toISOString(),
  };

  return storage.bookmarks.set([...bookmarks, newBookmark]);
}

// Remove a bookmark
export function removeBookmark(id: string): boolean {
  const bookmarks = getAllBookmarks();
  const filtered = bookmarks.filter(b => b.id !== id);
  return storage.bookmarks.set(filtered);
}

// Toggle bookmark status
export function toggleBookmark(bookmark: Omit<Bookmark, 'createdAt'>): boolean {
  if (isBookmarked(bookmark.id)) {
    return removeBookmark(bookmark.id);
  }
  return addBookmark(bookmark);
}

// Get bookmarked items with full data
export function getBookmarkedItems() {
  const bookmarks = getAllBookmarks();

  return bookmarks.map(bookmark => {
    let item = null;

    if (bookmark.type === 'skill') {
      item = getSkillBySlug(bookmark.slug);
    } else if (bookmark.type === 'tutorial') {
      item = getTutorialBySlug(bookmark.slug);
    } else if (bookmark.type === 'config') {
      item = getConfigBySlug(bookmark.slug);
    }

    return { bookmark, item };
  }).filter(({ item }) => item !== null);
}

// Get bookmarks by type
export function getBookmarksByType(type: Bookmark['type']): Bookmark[] {
  const bookmarks = getAllBookmarks();
  return bookmarks.filter(b => b.type === type);
}

// Clear all bookmarks
export function clearAllBookmarks(): boolean {
  return storage.bookmarks.remove();
}

// Export bookmarks to JSON
export function exportBookmarks(): string {
  const bookmarks = getAllBookmarks();
  const folders = getAllFolders();

  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    bookmarks,
    folders,
  };

  return JSON.stringify(data, null, 2);
}

// Import bookmarks from JSON
export function importBookmarks(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);

    if (!data.bookmarks || !Array.isArray(data.bookmarks)) {
      return false;
    }

    storage.bookmarks.set(data.bookmarks);

    if (data.folders && Array.isArray(data.folders)) {
      storage.set(BOOKMARK_FOLDERS_KEY, data.folders);
    }

    return true;
  } catch (error) {
    console.error('Error importing bookmarks:', error);
    return false;
  }
}

// Bookmark folders
export function getAllFolders(): BookmarkFolder[] {
  return storage.get<BookmarkFolder[]>(BOOKMARK_FOLDERS_KEY) || [];
}

export function createFolder(name: string): BookmarkFolder {
  const folders = getAllFolders();
  const newFolder: BookmarkFolder = {
    id: `folder_${Date.now()}`,
    name,
    bookmarks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  storage.set(BOOKMARK_FOLDERS_KEY, [...folders, newFolder]);
  return newFolder;
}

export function deleteFolder(folderId: string): boolean {
  const folders = getAllFolders();
  const filtered = folders.filter(f => f.id !== folderId);
  return storage.set(BOOKMARK_FOLDERS_KEY, filtered);
}

export function addBookmarkToFolder(bookmarkId: string, folderId: string): boolean {
  const folders = getAllFolders();
  const folder = folders.find(f => f.id === folderId);

  if (!folder) return false;

  if (!folder.bookmarks.includes(bookmarkId)) {
    folder.bookmarks.push(bookmarkId);
    folder.updatedAt = new Date().toISOString();
    return storage.set(BOOKMARK_FOLDERS_KEY, folders);
  }

  return true;
}

export function removeBookmarkFromFolder(bookmarkId: string, folderId: string): boolean {
  const folders = getAllFolders();
  const folder = folders.find(f => f.id === folderId);

  if (!folder) return false;

  folder.bookmarks = folder.bookmarks.filter(id => id !== bookmarkId);
  folder.updatedAt = new Date().toISOString();
  return storage.set(BOOKMARK_FOLDERS_KEY, folders);
}

// Get recent bookmarks
export function getRecentBookmarks(limit = 5): Bookmark[] {
  const bookmarks = getAllBookmarks();
  return bookmarks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

// Search bookmarks
export function searchBookmarks(query: string): Bookmark[] {
  const bookmarks = getAllBookmarks();
  const lowercaseQuery = query.toLowerCase();

  return bookmarks.filter(b =>
    b.title.toLowerCase().includes(lowercaseQuery) ||
    b.description.toLowerCase().includes(lowercaseQuery) ||
    b.category?.toLowerCase().includes(lowercaseQuery)
  );
}
