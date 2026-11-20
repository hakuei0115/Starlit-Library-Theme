import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async (context) => {
  // Fetch all published articles sorted by pubDate descending
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf());

  const site = context.site ? context.site.href.replace(/\/$/, '') : 'https://example.com';

  const itemsXml = posts
    .map((post) => {
      const postUrl = `${site}/posts/${post.id}/`;
      const pubDateStr = new Date(post.data.pubDate).toUTCString();
      const tagsXml = (post.data.tags || [])
        .map((tag: string) => `        <category><![CDATA[${tag}]]></category>`)
        .join('\n');

      return `    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.data.description}]]></description>
      <pubDate>${pubDateStr}</pubDate>
      <category><![CDATA[${post.data.category}]]></category>
${tagsXml ? tagsXml + '\n' : ''}    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Mascot's Library — Starlit Library</title>
    <description>一座星空中的溫柔技術圖書館，館員安靜陪伴讀者閱讀 AI、程式設計與研究筆記。</description>
    <link>${site}/</link>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />
    <language>zh-TW</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
