import { MetadataRoute } from 'next';
import { getAllTutorials } from '@/lib/tutorials';
import { getAllSkills } from '@/lib/skills';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://openclaw-hub.vercel.app';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/skills`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Tutorial pages - dynamically generate from tutorials.json
  const tutorials: MetadataRoute.Sitemap = getAllTutorials().map((tutorial) => ({
    url: `${baseUrl}/tutorial/${tutorial.slug}`,
    lastModified: new Date(tutorial.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // Skill detail pages - dynamically generate from skills.json
  const skills: MetadataRoute.Sitemap = getAllSkills().map((skill) => ({
    url: `${baseUrl}/skills/${skill.slug}`,
    lastModified: new Date(skill.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...tutorials, ...skills];
}
