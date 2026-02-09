import { getAllSkills } from '@/lib/skills';

const BASE_URL = 'https://www.clawtools.dev';

export const dynamic = 'force-static';

export async function GET() {
  const skills = getAllSkills();

  const rssItems = skills.map((skill) => `
    <item>
      <title><![CDATA[${skill.name}]]></title>
      <description><![CDATA[${skill.longDescription || skill.description}]]></description>
      <link>${BASE_URL}/skills/${skill.slug}</link>
      <guid>${BASE_URL}/skills/${skill.slug}</guid>
      <author>${skill.author}</author>
      <category>${skill.category}</category>
      <pubDate>${new Date(skill.createdAt).toUTCString()}</pubDate>
      ${skill.tags.map((tag) => `<category>${tag}</category>`).join('')}
    </item>
  `).join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>OpenClaw Hub - 技能</title>
    <description>OpenClaw 技能索引 - 所有可用的 AI 助手技能</description>
    <link>${BASE_URL}/skills</link>
    <atom:link href="${BASE_URL}/rss/skills.xml" rel="self" type="application/rss+xml" />
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
