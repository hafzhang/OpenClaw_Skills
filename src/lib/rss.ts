/**
 * RSS Feed Generation
 * Phase 4: US-081 - RSS/Content Feeds
 */

import { getAllTutorials } from './tutorials';
import { getAllSkills } from './skills';
import { getAllConfigs } from './configs';

const SITE_URL = 'https://openclaw-tools.com';
const SITE_TITLE = 'OpenClaw Hub';
const SITE_DESCRIPTION = 'OpenClaw Skill 市场网站 - 发现、分享和安装 Claude Code 技能';

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
  category?: string;
  author?: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateRSS(items: RSSItem[], title: string, description: string): string {
  const now = new Date().toUTCString();

  const itemsXml = items
    .map(
      (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      ${item.category ? `<category>${escapeXml(item.category)}</category>` : ''}
      ${item.author ? `<author>${escapeXml(item.author)}</author>` : ''}
    </item>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(description)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;
}

// Generate main RSS feed (all content)
export function generateMainFeed(): string {
  const tutorials = getAllTutorials();
  const skills = getAllSkills();
  const configs = getAllConfigs();

  const items: RSSItem[] = [
    ...tutorials.map((t) => ({
      title: `教程: ${t.title}`,
      link: `${SITE_URL}/tutorials/${t.slug}`,
      description: t.description,
      pubDate: t.createdAt,
      guid: `${SITE_URL}/tutorials/${t.slug}`,
      category: t.category,
      author: t.author,
    })),
    ...skills.map((s) => ({
      title: `技能: ${s.name}`,
      link: `${SITE_URL}/skills#${s.id}`,
      description: s.description,
      pubDate: s.createdAt,
      guid: `${SITE_URL}/skills#${s.id}`,
      category: s.category,
      author: s.author,
    })),
    ...configs.map((c) => ({
      title: `配置: ${c.name}`,
      link: `${SITE_URL}/configs/${c.slug}`,
      description: c.description,
      pubDate: c.createdAt,
      guid: `${SITE_URL}/configs/${c.slug}`,
      category: c.category,
      author: c.author,
    })),
  ].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return generateRSS(items, SITE_TITLE, SITE_DESCRIPTION);
}

// Generate tutorials RSS feed
export function generateTutorialsFeed(): string {
  const tutorials = getAllTutorials();

  const items: RSSItem[] = tutorials
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((t) => ({
      title: t.title,
      link: `${SITE_URL}/tutorials/${t.slug}`,
      description: t.description,
      pubDate: t.createdAt,
      guid: `${SITE_URL}/tutorials/${t.slug}`,
      category: t.category,
      author: t.author,
    }));

  return generateRSS(
    items,
    `${SITE_TITLE} - 教程`,
    'OpenClaw 最新教程和指南'
  );
}

// Generate skills RSS feed
export function generateSkillsFeed(): string {
  const skills = getAllSkills();

  const items: RSSItem[] = skills
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((s) => ({
      title: s.name,
      link: `${SITE_URL}/skills#${s.id}`,
      description: s.description,
      pubDate: s.createdAt,
      guid: `${SITE_URL}/skills#${s.id}`,
      category: s.category,
      author: s.author,
    }));

  return generateRSS(items, `${SITE_TITLE} - 技能`, 'OpenClaw 最新技能');
}

// Generate configs RSS feed
export function generateConfigsFeed(): string {
  const configs = getAllConfigs();

  const items: RSSItem[] = configs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((c) => ({
      title: c.name,
      link: `${SITE_URL}/configs/${c.slug}`,
      description: c.description,
      pubDate: c.createdAt,
      guid: `${SITE_URL}/configs/${c.slug}`,
      category: c.category,
      author: c.author,
    }));

  return generateRSS(items, `${SITE_TITLE} - 配置`, 'OpenClaw 最新配置分享');
}

// Generate category-specific RSS feed
export function generateCategoryFeed(category: string): string | null {
  const tutorials = getAllTutorials().filter((t) => t.category === category);
  const skills = getAllSkills().filter((s) => s.category === category);

  if (tutorials.length === 0 && skills.length === 0) {
    return null;
  }

  const items: RSSItem[] = [
    ...tutorials.map((t) => ({
      title: `教程: ${t.title}`,
      link: `${SITE_URL}/tutorials/${t.slug}`,
      description: t.description,
      pubDate: t.createdAt,
      guid: `${SITE_URL}/tutorials/${t.slug}`,
      category: t.category,
      author: t.author,
    })),
    ...skills.map((s) => ({
      title: `技能: ${s.name}`,
      link: `${SITE_URL}/skills#${s.id}`,
      description: s.description,
      pubDate: s.createdAt,
      guid: `${SITE_URL}/skills#${s.id}`,
      category: s.category,
      author: s.author,
    })),
  ].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return generateRSS(
    items,
    `${SITE_TITLE} - ${category}`,
    `${category} 分类下的最新内容`
  );
}

// Get RSS link tags for head
export function getRSSLinkTags(): { href: string; title: string; type: string }[] {
  return [
    { href: '/rss.xml', title: '全部内容', type: 'application/rss+xml' },
    { href: '/rss/tutorials.xml', title: '教程', type: 'application/rss+xml' },
    { href: '/rss/skills.xml', title: '技能', type: 'application/rss+xml' },
    { href: '/rss/configs.xml', title: '配置', type: 'application/rss+xml' },
  ];
}
