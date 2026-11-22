import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { getImage } from 'astro:assets';
import { siteConfig } from '../site.config';

export type BlogPost = CollectionEntry<'blog'>;

const byPubDateDesc = (a: BlogPost, b: BlogPost) =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

/** Published (non-draft) posts, newest first. */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const all = await getCollection('blog');
    return all.filter((p) => !p.data.draft).sort(byPubDateDesc);
  } catch {
    return [];
  }
}

/**
 * Posts shown in the homepage Featured region: explicitly featured posts first,
 * topped up with the newest remaining posts when fewer than 2 are featured.
 * Kept here so the Latest list can exclude exactly what Featured shows.
 */
export function selectFeatured(published: BlogPost[], max = 3): BlogPost[] {
  const featured = published.filter((p) => p.data.featured === true);
  if (featured.length >= 2) return featured.slice(0, max);

  const rest = published.filter((p) => !featured.some((f) => f.id === p.id));
  return [...featured, ...rest].slice(0, max);
}

/** Estimated reading time, e.g. "約 4 分鐘". Code blocks are excluded from the count. */
export function formatReadingTime(body: string | undefined): string | undefined {
  if (!body) return undefined;

  const prose = body.replace(/```[\s\S]*?```/g, ' ');
  const cjkChars = (prose.match(/[㐀-鿿]/g) ?? []).length;
  const latinWords = (prose.replace(/[㐀-鿿]/g, ' ').match(/[A-Za-z0-9]+/g) ?? []).length;

  // ~450 CJK characters or ~220 words per minute.
  const minutes = Math.max(1, Math.ceil(cjkChars / 450 + latinWords / 220));
  return `約 ${minutes} 分鐘`;
}

/**
 * Cover strategy: the post's own `heroImage` -> the cover mapped to its category
 * -> the default cover. The mapping lives in `siteConfig.covers` (src/site.config.ts).
 */
const { byCategory: CATEGORY_COVERS, defaultCover: DEFAULT_COVER } = siteConfig.covers;

export type PostCover = string | ImageMetadata;

export function getPostCover(post: BlogPost): PostCover {
  const own = post.data.heroImage?.trim();
  return own || CATEGORY_COVERS[post.data.category] || DEFAULT_COVER;
}

/** A URL for the cover (used for og:image): a 1200px-wide WebP for the built-in covers. */
export async function getPostCoverUrl(post: BlogPost): Promise<string> {
  const cover = getPostCover(post);
  if (typeof cover === 'string') return cover;
  return (await getImage({ src: cover, width: 1200, format: 'webp' })).src;
}
