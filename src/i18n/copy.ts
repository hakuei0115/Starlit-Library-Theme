/**
 * Default copy for the navigation, home button, article list, tag pages and 404 page,
 * in the language picked by `siteConfig.lang`.
 *
 * To use your own wording, fill in the matching setting in site.config.ts;
 * a setting left empty shows the default below.
 */
import { siteConfig, type NavItem } from '../site.config';
import { isChinese } from './ui';

const zhTW = {
  /** Matched to `siteConfig.nav` by `href`. `sub` is the small second label in the mobile menu. */
  nav: {
    '/': { label: '首頁', sub: 'Home' },
    '/articles': { label: '文章', sub: 'Articles' },
    '/about': { label: '關於', sub: 'About' },
  } as Record<string, { label: string; sub: string }>,
  hero: {
    ctaLabel: '開始閱讀',
    bannerAlt: `${siteConfig.title}橫幅`,
  },
  articles: {
    title: '文章館藏',
    description: '漫步於星空書架間，探索所有發布的技術筆記。',
    emptyMessage: '目前還沒有任何藏書呢。',
  },
  tags: {
    title: '文章標籤',
    description: '依標籤瀏覽所有筆記。',
    emptyMessage: '目前還沒有任何標籤。',
  },
  notFound: {
    title: '迷失在星空書架間',
    description: '這條星光路徑似乎不存在，或者該篇筆記已經移往其他藏書閣。別擔心，這裡為你準備了返回的路徑：',
    message: '館員在書架間找了又找，似乎沒有這本書呢……',
  },
};

const en: typeof zhTW = {
  nav: {
    '/': { label: 'Home', sub: '' },
    '/articles': { label: 'Articles', sub: '' },
    '/about': { label: 'About', sub: '' },
  },
  hero: {
    ctaLabel: 'Start reading',
    bannerAlt: `${siteConfig.title} banner`,
  },
  articles: {
    title: 'Articles',
    description: 'Wander the starlit shelves and browse every published note.',
    emptyMessage: 'The shelves are still empty.',
  },
  tags: {
    title: 'Tags',
    description: 'Browse every note by tag.',
    emptyMessage: 'No tags yet.',
  },
  notFound: {
    title: 'Lost among the starlit shelves',
    description:
      'This path does not seem to exist, or the note has moved to another shelf. Here are some ways back:',
    message: 'The librarian searched every shelf, but that book is not here…',
  },
};

const defaults = isChinese ? zhTW : en;

/** The site's own value where it is filled in, otherwise the default. */
function fill<T extends Record<string, string>>(fallback: T, own: Partial<Record<keyof T, string>>): T {
  return Object.fromEntries(
    Object.entries(fallback).map(([key, value]) => [key, own[key] || value]),
  ) as T;
}

function navItem({ href, label, sub }: NavItem) {
  const preset = defaults.nav[href.replace(/(.)\/$/, '$1')];
  if (!label && !preset) {
    throw new Error(`site.config.ts: the nav item for "${href}" needs a label.`);
  }
  // The default second label belongs to the default main label.
  return { href, label: label || preset.label, sub: sub || (label ? '' : preset.sub) };
}

export const copy = {
  nav: siteConfig.nav.map(navItem),
  hero: fill(defaults.hero, siteConfig.hero),
  articles: fill(defaults.articles, siteConfig.articles),
  tags: fill(defaults.tags, siteConfig.tags),
  notFound: fill(defaults.notFound, siteConfig.notFound),
};
