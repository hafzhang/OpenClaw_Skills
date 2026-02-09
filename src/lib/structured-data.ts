import { Skill } from '@/types';
import { Tutorial } from '@/types';

const BASE_URL = 'https://www.clawtools.dev';

/**
 * Generate JSON-LD structured data for a skill page (SoftwareApplication schema)
 */
export function generateSkillStructuredData(skill: Skill) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: skill.name,
    description: skill.longDescription || skill.description,
    applicationCategory: skill.category,
    operatingSystem: 'OpenClaw CLI',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: skill.author,
    },
    aggregateRating: skill.verified ? {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
      bestRating: '5',
      worstRating: '1',
    } : undefined,
    url: `${BASE_URL}/skills/${skill.slug}`,
    downloadUrl: skill.source,
    keywords: skill.tags.join(', '),
    datePublished: new Date(skill.createdAt).toISOString(),
    inLanguage: 'zh-CN',
  };
}

/**
 * Generate JSON-LD structured data for a tutorial page (TechArticle schema)
 */
export function generateTutorialStructuredData(tutorial: Tutorial) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: tutorial.title,
    description: tutorial.description,
    author: {
      '@type': 'Person',
      name: 'OpenClaw 社区',
    },
    datePublished: new Date(tutorial.createdAt).toISOString(),
    dateModified: new Date(tutorial.createdAt).toISOString(),
    url: `${BASE_URL}/tutorial/${tutorial.slug}`,
    inLanguage: 'zh-CN',
    keywords: tutorial.tags.join(', '),
    articleSection: tutorial.difficulty,
    timeRequired: `PT${tutorial.readTime}M`,
    proficiencyLevel: tutorial.difficulty === 'beginner'
      ? 'Beginner'
      : tutorial.difficulty === 'intermediate'
      ? 'Intermediate'
      : 'Expert',
  };
}

/**
 * Generate JSON-LD structured data for the website (WebSite schema)
 */
export function generateWebSiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OpenClaw 实战指南',
    url: BASE_URL,
    description: 'OpenClaw 实战指南 - 30 个真实案例，让 AI 助手真正帮你工作',
    inLanguage: 'zh-CN',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/skills?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate JSON-LD structured data for organization (Organization schema)
 */
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OpenClaw 社区',
    url: BASE_URL,
    description: 'OpenClaw 技能市场与实战教程社区',
    sameAs: [
      'https://github.com/openclaw-tools',
    ],
    inLanguage: 'zh-CN',
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
