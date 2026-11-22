// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Your production URL. Used for canonical links, Open Graph images and the RSS feed.
  // site: 'https://example.com',

  image: {
    // The default artwork in src/assets/brand/ is SVG; this lets it go through the same
    // WebP pipeline as PNG/JPG artwork you add yourself. Only enable it for SVGs you trust
    // (your own project files).
    dangerouslyProcessSVG: true,
  },
});
