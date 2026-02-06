/**
 * Content Rating System
 * Phase 4: US-083 - Content Rating System
 */

import { Rating } from '@/types';
import { storage } from './storage';

const RATINGS_KEY = 'ratings';

// Get all ratings
export function getAllRatings(): Record<string, Rating> {
  return storage.ratings.get() || {};
}

// Get user's rating for a specific item
export function getUserRating(itemId: string): number | null {
  const ratings = getAllRatings();
  return ratings[itemId]?.rating ?? null;
}

// Rate an item
export function rateItem(
  itemId: string,
  itemType: 'tutorial' | 'skill' | 'config',
  rating: number,
  comment?: string
): boolean {
  if (rating < 1 || rating > 5) return false;

  const ratings = getAllRatings();
  const now = new Date().toISOString();

  ratings[itemId] = {
    id: `rating_${Date.now()}`,
    itemId,
    itemType,
    rating,
    comment,
    createdAt: now,
    updatedAt: now,
  };

  return storage.ratings.set(ratings);
}

// Remove rating
export function removeRating(itemId: string): boolean {
  const ratings = getAllRatings();
  delete ratings[itemId];
  return storage.ratings.set(ratings);
}

// Get average rating for an item (using local storage data)
export function getAverageRating(itemId: string): { average: number; count: number } {
  // In a real app, this would come from a server
  // For now, we just return the user's own rating if exists
  const userRating = getUserRating(itemId);
  if (userRating !== null) {
    return { average: userRating, count: 1 };
  }
  return { average: 0, count: 0 };
}

// Check if user has rated an item
export function hasRated(itemId: string): boolean {
  const ratings = getAllRatings();
  return itemId in ratings;
}

// Get all rated items by type
export function getRatedItemsByType(type: 'tutorial' | 'skill' | 'config'): Rating[] {
  const ratings = getAllRatings();
  return Object.values(ratings).filter(r => r.itemType === type);
}

// Get top rated items (based on user's own ratings)
export function getTopRatedItems(limit = 5): { itemId: string; rating: number; itemType: string }[] {
  const ratings = Object.values(getAllRatings());
  return ratings
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
    .map(r => ({ itemId: r.itemId, rating: r.rating, itemType: r.itemType }));
}
