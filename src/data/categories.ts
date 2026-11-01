/**
 * Portfolio categories, in display order. This is the only place a category is defined.
 *
 * A case study joins a category by listing its slug in `categories:` in its front matter.
 * Everything else derives from that: the home carousel (one featured study per
 * category), the home category grid and its counts, /work/category/<slug>/ pages,
 * the library filter chips and the "Related projects" strip.
 *
 * A category with no case studies is not shown anywhere, so add a category here
 * only when a case study for it exists. See docs/case-study-template.md.
 *
 * Plain data only (no astro: imports): src/content.config.ts imports the slugs.
 */
export interface CategoryDef {
  /** URL slug: /work/category/<slug>/. Lowercase words joined by hyphens. */
  slug: string;
  /** Display name. */
  name: string;
  /** One plain sentence, based only on facts in the case studies. */
  description: string;
  /** Tile image (a file in public/, spaces as %20). Omit to show `icon` on a styled panel. */
  image?: { src: string; alt: string; fit?: 'cover' | 'contain'; pos?: string };
  /** Icon for the styled panel when there is no image (see CaseStudyIcon.astro). */
  icon: 'robot' | 'book' | 'audit' | 'wrench' | 'network' | 'globe' | 'podcast' | 'comic';
  /** Slug of the case study shown for this category in the home carousel. Must be in the category. */
  featured: string;
}

export const CATEGORIES = [
  {
    slug: 'hardware-robotics',
    name: 'Hardware & Robotics',
    description: 'Physical builds from off-the-shelf parts, like a GPS-tracking robot that follows you on command.',
    image: { src: '/FollowMeWagon.JPG', alt: 'The Follow-Me Wagon robot' },
    icon: 'robot',
    featured: 'follow-me-wagon',
  },
  {
    slug: 'writing-publishing',
    name: 'Writing & Publishing',
    description: 'A published novella, an AI-made comic and an author website, each taken from concept to finished result.',
    image: { src: '/red-omen-cover-600.jpg', alt: 'The Red Omen book cover', fit: 'contain' },
    icon: 'book',
    featured: 'the-red-omen',
  },
  {
    slug: 'analysis',
    name: 'Analysis',
    description: 'AI-assisted analysis of messy source records, delivered with every claim cited to file and page.',
    image: { src: '/analysis-icon-800.jpg', alt: 'Magnifying glass over documents and data traces', fit: 'contain' },
    icon: 'audit',
    featured: 'financial-audit',
  },
  {
    slug: 'software-apps',
    name: 'Software & Apps',
    description: 'A cross-platform mobile app and a custom-coded website, built with no prior development experience.',
    image: { src: '/Life%20Mx%20App.JPG', alt: 'Life Maintenance App icon' },
    icon: 'wrench',
    featured: 'life-maintenance-app',
  },
  {
    slug: 'ai-agents-automation',
    name: 'AI Agents & Automation',
    description: 'Multi-agent AI systems with quality control engineered into every step.',
    image: { src: '/Report%20Snippet.JPG', alt: 'Multi-agent viability report output', pos: 'top center' },
    icon: 'network',
    featured: 'multi-agent-viability-system',
  },
  {
    slug: 'media-content',
    name: 'Media & Content',
    description: 'A live video podcast with an automated production workflow, and a comic made by comparing six AI image platforms.',
    image: { src: '/Podcast%20Screenshot.JPG', alt: 'AI Laboratory Podcast episode', pos: 'top center' },
    icon: 'podcast',
    featured: 'ai-laboratory-podcast',
  },
] as const satisfies readonly CategoryDef[];

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];
export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug) as [CategorySlug, ...CategorySlug[]];
