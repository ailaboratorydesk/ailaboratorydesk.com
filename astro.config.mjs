// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeCaseStudySections from './src/lib/rehype-case-study-sections.mjs';

export default defineConfig({
  site: 'https://www.ailaboratorydesk.com',
  output: 'static',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  // Renamed URLs keep working (a static page with a meta refresh and canonical link).
  redirects: {
    '/work/category/finance-analysis/': '/work/category/analysis/',
  },
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      // Case-study prose uses "~18 hrs" and straight quotes; keep it exactly as written
      // (GFM would turn "~a ... ~b" into strikethrough, smartypants would curl quotes).
      gfm: false,
      smartypants: false,
      rehypePlugins: [rehypeCaseStudySections],
    }),
  },
});
