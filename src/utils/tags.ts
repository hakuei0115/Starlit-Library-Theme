import { siteConfig } from '../site.config';
import type { BlogPost } from './posts';

export interface Tag {
  /** Display name, as written in the newest post that uses it. */
  name: string;
  slug: string;
  posts: BlogPost[];
}

/**
 * URL segment for a tag: "State Machine" -> "state-machine", "C#" -> "c-sharp".
 * Letters of any language are kept, so Chinese tags stay readable.
 * Tags that only differ in case, spacing or punctuation share one page.
 */
export function tagSlug(tag: string): string {
  const slug = tag
    .normalize('NFC')
    .trim()
    .toLowerCase()
    .replace(/#/g, '-sharp')
    .replace(/\+/g, '-plus')
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  // A tag made only of symbols still needs a unique, valid segment.
  return slug || Array.from(tag, (c) => `u${c.codePointAt(0)!.toString(16)}`).join('-');
}

export const tagUrl = (tag: string) => `/tags/${tagSlug(tag)}/`;

/** All tags used by the given posts, most used first. Post order is preserved. */
export function collectTags(posts: BlogPost[]): Tag[] {
  const tags = new Map<string, Tag>();

  for (const post of posts) {
    for (const name of post.data.tags) {
      if (!name.trim()) continue;
      const slug = tagSlug(name);
      const tag = tags.get(slug) ?? { name, slug, posts: [] };
      if (!tag.posts.includes(post)) tag.posts.push(post);
      tags.set(slug, tag);
    }
  }

  return [...tags.values()].sort(
    (a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name, siteConfig.lang),
  );
}
