// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Warns during `astro build` when `site` is not set. Without it, canonical links,
 * Open Graph image URLs and the RSS feed fall back to relative or incorrect URLs.
 * Set `site` below and this warning goes away.
 * @type {import('astro').AstroIntegration}
 */
const requireSite = {
  name: 'starlit-require-site',
  hooks: {
    'astro:config:setup': ({ command, config, logger }) => {
      if (command === 'build' && !config.site) {
        logger.warn(
          "`site` is not set in astro.config.mjs. Canonical links, Open Graph images and the RSS feed need your production URL (e.g. site: 'https://example.com').",
        );
      }
    },
  },
};

// https://astro.build/config
export default defineConfig({
  // Your production URL. Used for canonical links, Open Graph images and the RSS feed.
  // site: 'https://example.com',

  integrations: [requireSite],

  image: {
    // The default artwork in src/assets/brand/ is SVG; this lets it go through the same
    // WebP pipeline as PNG/JPG artwork you add yourself. Only enable it for SVGs you trust
    // (your own project files).
    dangerouslyProcessSVG: true,
  },
});
