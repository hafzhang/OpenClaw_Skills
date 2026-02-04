import { Tutorial } from '@/types';
import tutorialsData from '@/data/tutorials.json';

/**
 * Get all tutorials
 * @returns Array of all tutorials
 */
export function getAllTutorials(): Tutorial[] {
  return tutorialsData as Tutorial[];
}

/**
 * Get featured tutorials
 * @returns Array of featured tutorials sorted by view count
 */
export function getFeaturedTutorials(): Tutorial[] {
  return getAllTutorials()
    .filter((tutorial) => tutorial.featured)
    .sort((a, b) => b.stats.viewCount - a.stats.viewCount);
}

/**
 * Get tutorials by category
 * @param category - The category slug (e.g., 'quick-start', 'development')
 * @returns Array of tutorials in the specified category
 */
export function getTutorialsByCategory(category: string): Tutorial[] {
  return getAllTutorials().filter((tutorial) => tutorial.category === category);
}

/**
 * Get tutorial by slug
 * @param slug - The tutorial slug
 * @returns The tutorial or undefined if not found
 */
export function getTutorialBySlug(slug: string): Tutorial | undefined {
  return getAllTutorials().find((tutorial) => tutorial.slug === slug);
}

/**
 * Search tutorials by query
 * @param query - Search query string
 * @returns Array of tutorials matching the query in title, description, or tags
 */
export function searchTutorials(query: string): Tutorial[] {
  const lowerQuery = query.toLowerCase();

  return getAllTutorials().filter((tutorial) => {
    return (
      tutorial.title.toLowerCase().includes(lowerQuery) ||
      tutorial.description.toLowerCase().includes(lowerQuery) ||
      tutorial.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}
