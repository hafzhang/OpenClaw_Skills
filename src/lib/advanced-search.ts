/**
 * Advanced search functionality with filtering, sorting, and scoring
 * Phase 4: US-078 - Advanced Search & Filters
 */

import {
  Tutorial,
  Skill,
  AgentConfig,
  SearchFilters,
  AdvancedSearchResult,
  SortOption,
  SearchType,
  DifficultyLevel,
} from '@/types';
import { getAllTutorials } from './tutorials';
import { getAllSkills } from './skills';
import { getAllConfigs } from './configs';
import { storage } from './storage';
import { getAllRatings } from './ratings';

// Tokenize and normalize query for better matching
function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(token => token.length > 0);
}

// Calculate relevance score for a single item
function getItemTitle(item: Tutorial | Skill | AgentConfig): string {
  if ('title' in item && item.title) {
    return item.title;
  }
  if ('name' in item && item.name) {
    return item.name;
  }
  return '';
}

// Calculate relevance score for a single item
function calculateScore(
  item: Tutorial | Skill | AgentConfig,
  tokens: string[]
): number {
  let score = 0;
  const title = getItemTitle(item);
  const searchableText = [
    title,
    item.description,
    ...(item.tags || []),
    item.category,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // Exact phrase match (highest score)
  const fullQuery = tokens.join(' ');
  if (searchableText.includes(fullQuery)) {
    score += 100;
  }

  // Individual token matches
  tokens.forEach(token => {
    // Title match (high weight)
    const itemTitle = getItemTitle(item);
    if (itemTitle.toLowerCase().includes(token)) {
      score += 20;
    }

    // Description match (medium weight)
    if (item.description?.toLowerCase().includes(token)) {
      score += 5;
    }

    // Tag match (medium-high weight)
    if (item.tags?.some(tag => tag.toLowerCase().includes(token))) {
      score += 10;
    }

    // Category match (medium weight)
    if (item.category?.toLowerCase().includes(token)) {
      score += 8;
    }

    // Exact token match
    if (searchableText.split(/\s+/).includes(token)) {
      score += 3;
    }
  });

  // Bonus for featured/verified items
  if ((item as Tutorial).featured) score += 15;
  if ((item as Skill).verified) score += 10;
  if ((item as AgentConfig).isOfficial) score += 10;

  return score;
}

// Get unique categories from all content
export function getAllCategories(): string[] {
  const tutorials = getAllTutorials();
  const skills = getAllSkills();
  const configs = getAllConfigs();

  const categories = new Set<string>();

  tutorials.forEach(t => categories.add(t.category));
  skills.forEach(s => categories.add(s.category));
  configs.forEach(c => categories.add(c.category));

  return Array.from(categories).sort();
}

// Get unique tags from all content
export function getAllTags(): string[] {
  const tutorials = getAllTutorials();
  const skills = getAllSkills();
  const configs = getAllConfigs();

  const tags = new Set<string>();

  tutorials.forEach(t => t.tags?.forEach(tag => tags.add(tag)));
  skills.forEach(s => s.tags?.forEach(tag => tags.add(tag)));
  configs.forEach(c => c.tags?.forEach(tag => tags.add(tag)));

  return Array.from(tags).sort();
}

// Filter content by criteria
function filterByCriteria(
  items: (Tutorial | Skill | AgentConfig)[],
  filters: SearchFilters
): (Tutorial | Skill | AgentConfig)[] {
  let filtered = items;

  // Filter by types
  if (filters.types.length > 0 && !filters.types.includes('all')) {
    filtered = filtered.filter(item => {
      if (filters.types.includes('tutorial') && 'content' in item) return true;
      if (filters.types.includes('skill') && 'command' in item) return true;
      if (filters.types.includes('config') && 'config' in item) return true;
      return false;
    });
  }

  // Filter by categories
  if (filters.categories.length > 0) {
    filtered = filtered.filter(item =>
      filters.categories.includes(item.category)
    );
  }

  // Filter by difficulty (tutorials only)
  if (filters.difficulties.length > 0) {
    filtered = filtered.filter(item => {
      if ('difficulty' in item) {
        return filters.difficulties.includes(item.difficulty);
      }
      return true; // Non-tutorial items pass difficulty filter
    });
  }

  // Filter by tags
  if (filters.tags.length > 0) {
    filtered = filtered.filter(item =>
      filters.tags.some(tag => item.tags?.includes(tag))
    );
  }

  // Filter by minimum rating
  if (filters.rating && filters.rating > 0) {
    const ratings = getAllRatings();
    filtered = filtered.filter(item => {
      const itemRatings = Object.values(ratings).filter(
        r => r.itemId === item.id
      );
      if (itemRatings.length === 0) return false;
      const avgRating = itemRatings.reduce((sum, r) => sum + r.rating, 0) / itemRatings.length;
      return avgRating >= (filters.rating || 0);
    });
  }

  return filtered;
}

// Sort results
function sortResults(
  results: AdvancedSearchResult[],
  sortBy: SortOption
): AdvancedSearchResult[] {
  const sorted = [...results];

  switch (sortBy) {
    case 'title-asc':
      sorted.sort((a, b) => {
        const titleA = getItemTitle(a.item);
        const titleB = getItemTitle(b.item);
        return titleA.localeCompare(titleB);
      });
      break;

    case 'title-desc':
      sorted.sort((a, b) => {
        const titleA = getItemTitle(a.item);
        const titleB = getItemTitle(b.item);
        return titleB.localeCompare(titleA);
      });
      break;

    case 'date-asc':
      sorted.sort((a, b) =>
        new Date(a.item.createdAt).getTime() - new Date(b.item.createdAt).getTime()
      );
      break;

    case 'date-desc':
      sorted.sort((a, b) =>
        new Date(b.item.createdAt).getTime() - new Date(a.item.createdAt).getTime()
      );
      break;

    case 'rating-asc':
      sorted.sort((a, b) => {
        const ratings = getAllRatings();
        const ratingsA = Object.values(ratings).filter(r => r.itemId === a.item.id);
        const ratingsB = Object.values(ratings).filter(r => r.itemId === b.item.id);
        const avgA = ratingsA.length ? ratingsA.reduce((sum, r) => sum + r.rating, 0) / ratingsA.length : 0;
        const avgB = ratingsB.length ? ratingsB.reduce((sum, r) => sum + r.rating, 0) / ratingsB.length : 0;
        return avgA - avgB;
      });
      break;

    case 'rating-desc':
      sorted.sort((a, b) => {
        const ratings = getAllRatings();
        const ratingsA = Object.values(ratings).filter(r => r.itemId === a.item.id);
        const ratingsB = Object.values(ratings).filter(r => r.itemId === b.item.id);
        const avgA = ratingsA.length ? ratingsA.reduce((sum, r) => sum + r.rating, 0) / ratingsA.length : 0;
        const avgB = ratingsB.length ? ratingsB.reduce((sum, r) => sum + r.rating, 0) / ratingsB.length : 0;
        return avgB - avgA;
      });
      break;

    case 'popular':
      sorted.sort((a, b) => {
        const viewsA = (a.item as Tutorial).stats?.viewCount || 0;
        const viewsB = (b.item as Tutorial).stats?.viewCount || 0;
        return viewsB - viewsA;
      });
      break;

    case 'relevance':
    default:
      sorted.sort((a, b) => b.score - a.score);
      break;
  }

  return sorted;
}

// Main advanced search function
export function advancedSearch(filters: SearchFilters): AdvancedSearchResult[] {
  const tutorials = getAllTutorials();
  const skills = getAllSkills();
  const configs = getAllConfigs();

  // Combine all items
  const allItems = [...tutorials, ...skills, ...configs];

  // Filter by criteria
  let filteredItems = filterByCriteria(allItems, filters);

  // Helper to get item type
function getItemType(item: Tutorial | Skill | AgentConfig): 'tutorial' | 'skill' | 'config' {
  if ('content' in item) return 'tutorial';
  if ('command' in item) return 'skill';
  return 'config';
}

// Calculate scores if there's a query
  const tokens = filters.query ? tokenizeQuery(filters.query) : [];

  if (tokens.length > 0) {
    const results: AdvancedSearchResult[] = filteredItems
      .map(item => {
        const score = calculateScore(item, tokens);
        if (score === 0) return null;

        return {
          type: getItemType(item),
          item,
          score,
        };
      })
      .filter((r): r is AdvancedSearchResult => r !== null);

    return sortResults(results, filters.sortBy);
  } else {
    // No query - return all filtered items
    const results: AdvancedSearchResult[] = filteredItems.map(item => {
      return {
        type: getItemType(item),
        item,
        score: 0,
      };
    });

    return sortResults(results, filters.sortBy);
  }
}

// Default search filters
export const defaultSearchFilters: SearchFilters = {
  query: '',
  types: ['all'],
  categories: [],
  difficulties: [],
  tags: [],
  sortBy: 'relevance',
  rating: undefined,
};

// Search suggestions (autocomplete)
export function getSearchSuggestions(query: string, limit = 5): string[] {
  if (query.length < 2) return [];

  const tutorials = getAllTutorials();
  const skills = getAllSkills();
  const configs = getAllConfigs();

  const suggestions = new Set<string>();

  // Add titles
  tutorials.forEach(t => {
    if (t.title.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(t.title);
    }
  });
  skills.forEach(s => {
    if (s.name.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(s.name);
    }
  });
  configs.forEach(c => {
    if (c.name.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(c.name);
    }
  });

  // Add tags
  getAllTags().forEach(tag => {
    if (tag.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(tag);
    }
  });

  // Add categories
  getAllCategories().forEach(cat => {
    if (cat.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(cat);
    }
  });

  return Array.from(suggestions).slice(0, limit);
}
