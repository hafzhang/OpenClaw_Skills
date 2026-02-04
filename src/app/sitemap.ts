import { MetadataRoute } from 'next';

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

  // Tutorial pages
  const tutorials: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/tutorial/getting-started-with-openclaw`,
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tutorial/configuring-your-first-agent`,
      lastModified: new Date('2026-01-16'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tutorial/code-review-practice`,
      lastModified: new Date('2026-01-20'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  return [...staticPages, ...tutorials];
}
