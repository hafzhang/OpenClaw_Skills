import { SearchResult } from '@/types';
import { searchTutorials } from './tutorials';
import { searchSkills } from './skills';

/**
 * Search all content (tutorials and skills)
 * @param query - Search query string
 * @returns Array of search results with type identifiers
 */
export function searchAll(query: string): SearchResult[] {
  const tutorialResults = searchTutorials(query);
  const skillResults = searchSkills(query);

  const results: SearchResult[] = [
    ...tutorialResults.map((tutorial) => ({
      type: 'tutorial' as const,
      item: tutorial,
    })),
    ...skillResults.map((skill) => ({
      type: 'skill' as const,
      item: skill,
    })),
  ];

  return results;
}
