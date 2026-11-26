// @ts-check
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkCjkFriendly from 'remark-cjk-friendly';
import remarkMath from 'remark-math';

/**
 * Warns during `astro build` when `site` is not set. Without it, canonical links,
 * Open Graph image URLs and the RSS feed fall back to relative or incorrect URLs,
 * and no sitemap is generated.
 * Set the SITE_URL environment variable (or `site` below) and this warning goes away.
 * @type {import('astro').AstroIntegration}
 */
const requireSite = {
  name: 'starlit-require-site',
  hooks: {
    'astro:config:setup': ({ command, config, logger }) => {
      if (command === 'build' && !config.site) {
        logger.warn(
          "No site URL is set. Canonical links, Open Graph images, the RSS feed and the sitemap need your production URL: set the SITE_URL environment variable (e.g. SITE_URL=https://example.com) or `site` in astro.config.mjs.",
        );
      }
    },
  },
};

// https://astro.build/config
export default defineConfig({
  // Your production URL, used for canonical links, Open Graph images, RSS and the sitemap.
  // Set the SITE_URL environment variable on your host (or when building), or replace
  // this line with a fixed value such as site: 'https://example.com'.
  site: process.env.SITE_URL || undefined,

  // mdx() reuses the `markdown` settings below for .mdx files.
  // sitemap() needs `site`; it writes sitemap-index.xml at build time.
  integrations: [mdx(), sitemap(), requireSite],

  markdown: {
    // High-contrast syntax colors stay readable (WCAG AA) on --color-code-bg, which
    // global.css applies to code blocks. Check contrast again if you change either.
    shikiConfig: { theme: 'github-dark-high-contrast' },

    // Lets **bold** and *italic* work next to Chinese, Japanese and Korean punctuation.
    // Standard Markdown leaves the asterisks visible in text such as **粗體（Bold）**文字.
    // remark-math and rehype-katex render $inline$ and $$block$$ formulas at build time.
    processor: unified({
      remarkPlugins: [remarkCjkFriendly, remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },

  image: {
    // The default artwork in src/assets/brand/ is SVG; this lets it go through the same
    // WebP pipeline as PNG/JPG artwork you add yourself. Only enable it for SVGs you trust
    // (your own project files).
    dangerouslyProcessSVG: true,
  },
});
