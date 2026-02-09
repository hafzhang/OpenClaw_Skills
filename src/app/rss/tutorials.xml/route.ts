import { getAllTutorials } from '@/lib/tutorials';

const BASE_URL = 'https://www.clawtools.dev';

export const dynamic = 'force-static';

export async function GET() {
  const tutorials = getAllTutorials();

  const rssItems = tutorials.map((tutorial) => `
    <item>
      <title><![CDATA[${tutorial.title}]]></title>
      <description><![CDATA[${tutorial.description}]]></description>
      <link>${BASE_URL}/tutorial/${tutorial.slug}</link>
      <guid>${BASE_URL}/tutorial/${tutorial.slug}</guid>
      <author>OpenClaw 社区</author>
      <category>${tutorial.category}</category>
      <pubDate>${new Date(tutorial.createdAt).toUTCString()}</pubDate>
      ${tutorial.tags.map((tag) => `<category>${tag}</category>`).join('')}
    </item>
  `).join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>OpenClaw Hub - 教程</title>
    <description>OpenClaw 实战教程 - 真实案例让 AI 助手真正帮你工作</description>
    <link>${BASE_URL}</link>
    <atom:link href="${BASE_URL}/rss/tutorials.xml" rel="self" type="application/rss+xml" />
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
