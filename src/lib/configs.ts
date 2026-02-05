import { AgentConfig } from '@/types';
import configsData from '../data/configs.json';

/**
 * Get all configs
 * @returns Array of all configs
 */
export function getAllConfigs(): AgentConfig[] {
  return configsData as AgentConfig[];
}

/**
 * Get config by slug
 * @param slug - The config slug
 * @returns The config or undefined if not found
 */
export function getConfigBySlug(slug: string): AgentConfig | undefined {
  return getAllConfigs().find((config) => config.slug === slug);
}

/**
 * Get configs by category
 * @param category - The category slug (e.g., 'development', 'productivity', 'learning')
 * @returns Array of configs in the specified category
 */
export function getConfigsByCategory(category: string): AgentConfig[] {
  return getAllConfigs().filter((config) => config.category === category);
}

/**
 * Get featured configs (official configs sorted by likes)
 * @returns Array of featured configs sorted by likes count
 */
export function getFeaturedConfigs(): AgentConfig[] {
  return getAllConfigs()
    .filter((config) => config.isOfficial)
    .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
}

/**
 * Search configs by query
 * @param query - Search query string
 * @returns Array of configs matching the query in name, description, or tags
 */
export function searchConfigs(query: string): AgentConfig[] {
  const lowerQuery = query.toLowerCase();

  return getAllConfigs().filter((config) => {
    return (
      config.name.toLowerCase().includes(lowerQuery) ||
      config.description.toLowerCase().includes(lowerQuery) ||
      config.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}
