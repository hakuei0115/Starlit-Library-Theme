import type { BlogPost } from './posts';
import { slugify } from './slug';

export interface Category {
  /** Display name, as written in the newest post that uses it. */
  name: string;
  slug: string;
  posts: BlogPost[];
}

export const categoryUrl = (name: string) => `/articles/category/${slugify(name)}/`;

/** Categories used by the given posts, in order of first appearance. Post order is preserved. */
export function collectCategories(posts: BlogPost[]): Category[] {
  const categories = new Map<string, Category>();

  for (const post of posts) {
    const name = post.data.category;
    if (!name.trim()) continue;
    const slug = slugify(name);
    const category = categories.get(slug) ?? { name, slug, posts: [] };
    category.posts.push(post);
    categories.set(slug, category);
  }

  return [...categories.values()];
}
