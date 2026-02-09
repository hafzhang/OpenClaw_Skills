import { getAllConfigs } from '@/lib/configs';

const BASE_URL = 'https://www.clawtools.dev';

export const dynamic = 'force-static';

export async function GET() {
  const configs = getAllConfigs();

  const rssItems = configs.map((config) => `
    <item>
      <title><![CDATA[${config.name}]]></title>
      <description><![CDATA[${config.description}]]></description>
      <link>${BASE_URL}/configs/${config.slug}</link>
      <guid>${BASE_URL}/configs/${config.slug}</guid>
      <author>${config.author}</author>
      <category>${config.category}</category>
      <pubDate>${new Date(config.createdAt).toUTCString()}</pubDate>
      ${config.tags.map((tag) => `<category>${tag}</category>`).join('')}
    </item>
  `).join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>OpenClaw Hub - 配置</title>
    <description>OpenClaw Agent 配置文件 - 预设的 AI 助手配置</description>
    <link>${BASE_URL}/configs</link>
    <atom:link href="${BASE_URL}/rss/configs.xml" rel="self" type="application/rss+xml" />
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
