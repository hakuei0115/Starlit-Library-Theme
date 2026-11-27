/**
 * Interface text: the labels that belong to the theme itself.
 *
 * `siteConfig.lang` picks the language: any `zh…` value uses Traditional Chinese,
 * everything else uses English. To reword single labels, set `siteConfig.ui`.
 * Text about your own site (name, navigation, hero, mascot lines…) is in site.config.ts.
 */
import { siteConfig } from '../site.config';

const zhTW = {
  common: {
    home: '首頁',
    breadcrumb: '路徑導覽',
    articles: '文章',
    allArticles: '全部文章',
    viewAll: '查看全部',
    articleTags: '文章標籤',
    readingTime: (minutes: number) => `約 ${minutes} 分鐘`,
  },
  header: {
    skipToContent: '跳至主要內容 / Skip to content',
    mainNav: '主要導覽',
    menu: '選單',
    openMenu: '開啟導覽選單',
    closeMenu: '關閉導覽選單',
    mobileMenu: '行動版導覽選單',
    mobileNav: '行動版導覽',
  },
  footer: {
    nav: '頁尾連結',
    navigation: '導覽',
    resources: '資源',
    rss: 'RSS 訂閱',
    rights: 'All rights reserved.',
  },
  home: {
    featured: '精選文章',
    featuredEmpty: '目前尚無精選文章，書架上的典藏仍在整理中……',
    showFeatured: (index: number, title: string) => `顯示第 ${index} 篇精選文章：${title}`,
    latest: '最新筆記',
    latestList: '最新筆記列表',
    latestAllFeatured: '所有筆記都已收錄在上方的精選文章。',
    latestEmpty: '目前尚無新發布的文章筆記。',
    latestAndCorner: (corner: string) => `最新筆記與${corner}`,
    topicsNav: '主題分類導覽',
    topics: '典藏主題',
  },
  post: {
    published: (date: string) => `發布於 ${date}`,
    updated: (date: string) => `更新於 ${date}`,
    pagerNav: '前後文章導航',
    previous: '上一篇文章',
    next: '下一篇文章',
    related: '相關文章',
    tocTitle: '本文目錄',
    toc: '文章目錄',
    tocMobile: '文章目錄（行動版）',
    tocDesktop: '文章目錄（桌面版）',
    sidebar: '文章目錄與閱讀陪伴',
    companion: '閱讀陪伴',
  },
  code: {
    copy: '複製',
    copied: '已複製',
    failed: '複製失敗',
    copiedStatus: '程式碼已複製',
    failedStatus: '無法複製程式碼，請手動選取',
  },
  list: {
    eyebrow: '館藏檔案',
    pageTitle: (title: string, page: number) => (page > 1 ? `${title}（第 ${page} 頁）` : title),
    categoryTitle: (category: string, title: string) => `${category}｜${title}`,
    categoryDescription: (category: string) => `「${category}」分類的所有筆記。`,
    /** Text before and after the highlighted post count. */
    countBefore: '共收錄',
    countAfter: (_count: number) => '篇典藏。',
    filter: '分類篩選',
    filterLabel: '分類篩選：',
    allTags: '瀏覽所有標籤',
    list: '文章列表',
  },
  pagination: {
    nav: '文章分頁',
    previous: '上一頁',
    next: '下一頁',
    page: (page: number) => `第 ${page} 頁`,
  },
  tags: {
    /** Read by screen readers after the number on the tag index. */
    countSuffix: (_count: number) => ' 篇文章',
    description: (tag: string, count: number) => `共 ${count} 篇標記為「${tag}」的文章。`,
  },
  notFound: {
    home: '返回圖書館首頁',
    articles: '瀏覽全部典藏文章',
  },
};

export type UiStrings = typeof zhTW;

/** Any subset of the labels, section by section. */
export type UiOverrides = { [Section in keyof UiStrings]?: Partial<UiStrings[Section]> };

const plural = (count: number, noun: string) => `${noun}${count === 1 ? '' : 's'}`;

const en: UiStrings = {
  common: {
    home: 'Home',
    breadcrumb: 'Breadcrumb',
    articles: 'Articles',
    allArticles: 'All articles',
    viewAll: 'View all',
    articleTags: 'Tags',
    readingTime: (minutes) => `${minutes} min read`,
  },
  header: {
    skipToContent: 'Skip to content',
    mainNav: 'Main',
    menu: 'Menu',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    mobileMenu: 'Navigation menu',
    mobileNav: 'Mobile',
  },
  footer: {
    nav: 'Footer',
    navigation: 'Explore',
    resources: 'Resources',
    rss: 'RSS feed',
    rights: 'All rights reserved.',
  },
  home: {
    featured: 'Featured',
    featuredEmpty: 'No featured posts yet. The shelves are still being arranged.',
    showFeatured: (index, title) => `Show featured post ${index}: ${title}`,
    latest: 'Latest notes',
    latestList: 'Latest notes',
    latestAllFeatured: 'Every note is already featured above.',
    latestEmpty: 'No notes have been published yet.',
    latestAndCorner: (corner) => `Latest notes and ${corner}`,
    topicsNav: 'Topics',
    topics: 'Topics',
  },
  post: {
    published: (date) => `Published ${date}`,
    updated: (date) => `Updated ${date}`,
    pagerNav: 'Previous and next posts',
    previous: 'Previous post',
    next: 'Next post',
    related: 'Related post',
    tocTitle: 'On this page',
    toc: 'Table of contents',
    tocMobile: 'Table of contents (mobile)',
    tocDesktop: 'Table of contents (desktop)',
    sidebar: 'Table of contents and reading companion',
    companion: 'Reading companion',
  },
  code: {
    copy: 'Copy',
    copied: 'Copied',
    failed: 'Copy failed',
    copiedStatus: 'Code copied',
    failedStatus: 'Could not copy the code. Please select it manually.',
  },
  list: {
    eyebrow: 'Library archives',
    pageTitle: (title, page) => (page > 1 ? `${title} (page ${page})` : title),
    categoryTitle: (category, title) => `${category} | ${title}`,
    categoryDescription: (category) => `All notes in ${category}.`,
    countBefore: ' ',
    countAfter: (count) => ` ${plural(count, 'post')} in total.`,
    filter: 'Filter by category',
    filterLabel: 'Categories:',
    allTags: 'Browse all tags',
    list: 'Article list',
  },
  pagination: {
    nav: 'Pagination',
    previous: 'Previous',
    next: 'Next',
    page: (page) => `Page ${page}`,
  },
  tags: {
    countSuffix: (count) => ` ${plural(count, 'post')}`,
    description: (tag, count) => `${count} ${plural(count, 'post')} tagged “${tag}”.`,
  },
  notFound: {
    home: 'Back to the library',
    articles: 'Browse all articles',
  },
};

const base = siteConfig.lang.toLowerCase().startsWith('zh') ? zhTW : en;

const overrides: UiOverrides = siteConfig.ui;

export const t = Object.fromEntries(
  Object.entries(base).map(([section, labels]) => [
    section,
    { ...labels, ...overrides[section as keyof UiStrings] },
  ]),
) as UiStrings;
