/**
 * Starlit Library Theme — site configuration.
 *
 * Everything that is specific to *your* site lives here: name, tagline, navigation,
 * footer, social links, the optional mascot corner, and the artwork.
 * Generic interface labels (e.g. section headings) live in the components.
 *
 * Also set `site` in astro.config.mjs to your real URL (used for canonical links,
 * Open Graph images and the RSS feed).
 */
import type { ImageMetadata } from 'astro';

// ── Artwork ─────────────────────────────────────────────────────────────────
// These are neutral placeholders. Replace the files in src/assets/brand/ (keeping the
// names) or import your own images and point the settings below at them.
import heroBanner from './assets/brand/hero-banner.svg';
import heroBannerMobile from './assets/brand/hero-banner-mobile.svg';
import mascotArt from './assets/brand/mascot.svg';
import coverDefault from './assets/brand/covers/default.svg';
import coverLavender from './assets/brand/covers/lavender.svg';
import coverDusk from './assets/brand/covers/dusk.svg';
import coverMist from './assets/brand/covers/mist.svg';

export interface NavItem {
  /** Main label. */
  label: string;
  /** Small English/secondary label shown in the mobile menu. */
  sub: string;
  href: string;
}

export const siteConfig = {
  /** Site name, used in the header, footer, page titles and RSS. */
  title: "Mascot's Library",
  /** Short descriptor next to the site name. */
  subtitle: '星空技術圖書館',
  /** Default meta description (also used by RSS and the home page). */
  description: '一座星空中的溫柔技術圖書館，安靜陪伴讀者閱讀 AI、程式設計與軟體架構研究筆記。',
  /** HTML lang attribute and date formatting locale. */
  lang: 'zh-TW',
  /** Used in the footer copyright line. */
  author: 'Your Name',

  nav: [
    { label: '首頁', sub: 'Home', href: '/' },
    { label: '文章', sub: 'Articles', href: '/articles' },
    { label: '關於', sub: 'About', href: '/about' },
  ] satisfies NavItem[],

  /** Footer "resources" links. Set `github` to '' to hide the GitHub link. */
  links: {
    github: 'https://github.com/your-name',
    rss: true,
  },

  footer: {
    tagline: '一座星空中的溫柔技術圖書館，安靜陪伴讀者閱讀與探索技術。',
    /** Right-hand note in the bottom row. Set to '' to hide. */
    note: 'Starlit Library Theme — Powered by Astro',
  },

  hero: {
    tagline: '一座星空中的溫柔技術圖書館，安靜陪伴讀者閱讀 AI、程式設計與軟體架構研究筆記。',
    ctaLabel: '開始閱讀',
    ctaHref: '/articles',
    bannerAlt: "Mascot's Library — 星空技術圖書館橫幅",
  },

  /**
   * The optional mascot ("Mascot"): a corner card on the home page, a small companion
   * card beside articles, and the artwork on the 404 / empty states.
   * Set `enabled: false` to remove all of it.
   */
  mascot: {
    enabled: true,
    name: '館員',
    cornerTitle: '館員的角落',
    greeting: '歡迎來到我的星空圖書館 ✦',
    message:
      '歡迎來到這座靜謐的技術圖書館。在漫長的思考與探索中，館員會一直陪伴你翻閱每一篇筆記，願微光能為你指引前行的方向。',
    signature: '圖書館館員',
    artAlt: '館員抱著書，安靜地陪你閱讀',
    articleQuote: '今天也一起學到了新知識呢。',
    articleSignature: '— 館員 · 館員筆記',
    drawerNote: '館員陪伴你的每一次學習',
  },

  notFound: {
    title: '迷失在星空書架間',
    description: '這條星光路徑似乎不存在，或者該篇筆記已經移往其他藏書閣。別擔心，這裡為你準備了返回的路徑：',
    message: '館員在書架間找了又找，似乎沒有這本書呢……',
  },

  articles: {
    title: '文章館藏',
    description: '漫步於星空書架間，探索所有發布的技術筆記。',
    emptyFilterMessage: '在這個分類下沒有找到相關藏書呢，請試試其他分類。',
  },

  art: {
    heroBanner,
    /** 16:9 variant served below 768px; leave undefined to reuse `heroBanner`. */
    heroBannerMobile: heroBannerMobile as ImageMetadata | undefined,
    /** 3:4 portrait used by the mascot corner, 404 and article companion. */
    mascot: mascotArt,
  },

  /**
   * Cover images. A post uses, in order: its own `heroImage` → the cover mapped to its
   * category below → `defaultCover`. Categories that are not listed fall back to the default.
   */
  covers: {
    defaultCover: coverDefault as ImageMetadata,
    byCategory: {
      'AI & Systems': coverLavender,
      'CSS & Web': coverDusk,
      'Software Engineering': coverMist,
    } as Record<string, ImageMetadata>,
  },
};

export type SiteConfig = typeof siteConfig;
