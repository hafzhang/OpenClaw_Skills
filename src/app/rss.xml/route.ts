import { getAllSkills } from '@/lib/skills';
import { getAllTutorials } from '@/lib/tutorials';
import { getAllConfigs } from '@/lib/configs';

const BASE_URL = 'https://www.clawtools.dev';

export const dynamic = 'force-static';

export async function GET() {
  const skills = getAllSkills();
  const tutorials = getAllTutorials();
  const configs = getAllConfigs();

  // Combine all content and sort by date
  const allContent = [
    ...skills.map((skill) => ({
      type: 'skill',
      title: skill.name,
      description: skill.description,
      url: `${BASE_URL}/skills/${skill.slug}`,
      date: new Date(skill.createdAt),
      author: skill.author,
      category: skill.category,
    })),
    ...tutorials.map((tutorial) => ({
      type: 'tutorial',
      title: tutorial.title,
      description: tutorial.description,
      url: `${BASE_URL}/tutorial/${tutorial.slug}`,
      date: new Date(tutorial.createdAt),
      author: 'OpenClaw 社区',
      category: tutorial.category,
    })),
    ...configs.map((config) => ({
      type: 'config',
      title: config.name,
      description: config.description,
      url: `${BASE_URL}/configs/${config.slug}`,
      date: new Date(config.createdAt),
      author: config.author,
      category: config.category,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const rssItems = allContent.map((item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.url}</link>
      <guid>${item.url}</guid>
      <author>${item.author}</author>
      <category>${item.category}</category>
      <pubDate>${item.date.toUTCString()}</pubDate>
    </item>
  `).join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>OpenClaw Hub - 全部内容</title>
    <description>OpenClaw 实战指南 - 技能、教程和配置的最新更新</description>
    <link>${BASE_URL}</link>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
