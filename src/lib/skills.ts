import { Skill } from '@/types';
import skillsData from '../data/skills.json';

/**
 * Get all skills
 * @returns Array of all skills
 */
export function getAllSkills(): Skill[] {
  return skillsData as Skill[];
}

/**
 * Get skills by category
 * @param category - The category slug (e.g., 'development', 'productivity')
 * @returns Array of skills in the specified category
 */
export function getSkillsByCategory(category: string): Skill[] {
  return getAllSkills().filter((skill) => skill.category === category);
}

/**
 * Get verified skills only
 * @returns Array of verified skills
 */
export function getVerifiedSkills(): Skill[] {
  return getAllSkills().filter((skill) => skill.verified);
}

/**
 * Search skills by query
 * @param query - Search query string
 * @returns Array of skills matching the query in name, description, or tags
 */
export function searchSkills(query: string): Skill[] {
  const lowerQuery = query.toLowerCase();

  return getAllSkills().filter((skill) => {
    return (
      skill.name.toLowerCase().includes(lowerQuery) ||
      skill.description.toLowerCase().includes(lowerQuery) ||
      skill.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}
