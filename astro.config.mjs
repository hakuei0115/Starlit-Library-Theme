// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Warns during `astro build` when `site` is not set. Without it, canonical links,
 * Open Graph image URLs and the RSS feed fall back to relative or incorrect URLs.
 * Set the SITE_URL environment variable (or `site` below) and this warning goes away.
 * @type {import('astro').AstroIntegration}
 */
const requireSite = {
  name: 'starlit-require-site',
  hooks: {
    'astro:config:setup': ({ command, config, logger }) => {
      if (command === 'build' && !config.site) {
        logger.warn(
          "No site URL is set. Canonical links, Open Graph images and the RSS feed need your production URL: set the SITE_URL environment variable (e.g. SITE_URL=https://example.com) or `site` in astro.config.mjs.",
        );
      }
    },
  },
};

// https://astro.build/config
export default defineConfig({
  // Your production URL, used for canonical links, Open Graph images and the RSS feed.
  // Set the SITE_URL environment variable on your host (or when building), or replace
  // this line with a fixed value such as site: 'https://example.com'.
  site: process.env.SITE_URL || undefined,

  integrations: [requireSite],

  image: {
    // The default artwork in src/assets/brand/ is SVG; this lets it go through the same
    // WebP pipeline as PNG/JPG artwork you add yourself. Only enable it for SVGs you trust
    // (your own project files).
    dangerouslyProcessSVG: true,
  },
});
