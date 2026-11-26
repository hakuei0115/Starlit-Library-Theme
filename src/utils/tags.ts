import { siteConfig } from '../site.config';
import type { BlogPost } from './posts';
import { slugify } from './slug';

export interface Tag {
  /** Display name, as written in the newest post that uses it. */
  name: string;
  slug: string;
  posts: BlogPost[];
}

export const tagUrl = (tag: string) => `/tags/${slugify(tag)}/`;

/** All tags used by the given posts, most used first. Post order is preserved. */
export function collectTags(posts: BlogPost[]): Tag[] {
  const tags = new Map<string, Tag>();

  for (const post of posts) {
    for (const name of post.data.tags) {
      if (!name.trim()) continue;
      const slug = slugify(name);
      const tag = tags.get(slug) ?? { name, slug, posts: [] };
      if (!tag.posts.includes(post)) tag.posts.push(post);
      tags.set(slug, tag);
    }
  }

  return [...tags.values()].sort(
    (a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name, siteConfig.lang),
  );
}
