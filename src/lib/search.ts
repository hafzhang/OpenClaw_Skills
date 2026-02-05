import { SearchResult } from '@/types';
import { searchTutorials } from './tutorials';
import { searchSkills } from './skills';
import { searchConfigs } from './configs';

/**
 * Search all content (tutorials, skills, and configs)
 * @param query - Search query string
 * @returns Array of search results with type identifiers
 */
export function searchAll(query: string): SearchResult[] {
  const tutorialResults = searchTutorials(query);
  const skillResults = searchSkills(query);
  const configResults = searchConfigs(query);

  const results: SearchResult[] = [
    ...tutorialResults.map((tutorial) => ({
      type: 'tutorial' as const,
      item: tutorial,
    })),
    ...skillResults.map((skill) => ({
      type: 'skill' as const,
      item: skill,
    })),
    ...configResults.map((config) => ({
      type: 'config' as const,
      item: config,
    })),
  ];

  return results;
}
