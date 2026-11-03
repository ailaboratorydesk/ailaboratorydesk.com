/**
 * Portfolio categories, in display order. This is the only place a category is defined.
 *
 * A case study joins a category by listing its slug in `categories:` in its front matter.
 * Everything else derives from that: the home carousel (each category's newest
 * study), the home category grid, /work/category/<slug>/ pages,
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
  /**
   * Optional override: slug of the case study to show for this category in the home
   * carousel instead of its newest one. Must be in the category. Unused by default.
   */
  featured?: string;
}

export const CATEGORIES = [
  {
    slug: 'hardware-robotics',
    name: 'Hardware & Robotics',
    description: 'Physical builds from off-the-shelf parts, like a GPS-tracking robot that follows you on command.',
    image: { src: '/FollowMeWagon.JPG', alt: 'The Follow-Me Wagon robot' },
    icon: 'robot',
  },
  {
    slug: 'writing-publishing',
    name: 'Writing & Publishing',
    description: 'Fiction, comics and author platforms taken from concept to finished result, with AI as a working partner.',
    image: { src: '/red-omen-cover-600.jpg', alt: 'The Red Omen book cover', fit: 'contain' },
    icon: 'book',
  },
  {
    slug: 'analysis',
    name: 'Analysis',
    description: 'AI-assisted analysis, from a forensic review of messy source records to multi-agent business viability reports.',
    image: { src: '/analysis-icon-800.jpg', alt: 'Magnifying glass over documents and data traces', fit: 'contain' },
    icon: 'audit',
  },
  {
    slug: 'software-apps',
    name: 'Software & Apps',
    description: 'Apps, websites and robot control software built with AI, starting from no prior development experience.',
    image: { src: '/Life%20Mx%20App.JPG', alt: 'Life Maintenance App icon' },
    icon: 'wrench',
  },
  {
    slug: 'ai-agents-automation',
    name: 'AI Agents & Automation',
    description: 'Multi-agent AI systems with quality control engineered into every step.',
    image: { src: '/ai-agents-icon-800.jpg', alt: 'A central hub node routing work to a team of AI agent nodes', fit: 'contain' },
    icon: 'network',
  },
  {
    slug: 'media-content',
    name: 'Media & Content',
    description: 'A live video podcast with an automated production workflow, and a comic made by comparing six AI image platforms.',
    image: { src: '/Podcast%20Screenshot.JPG', alt: 'AI Laboratory Podcast episode', pos: 'top center' },
    icon: 'podcast',
  },
] as const satisfies readonly CategoryDef[];

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];
export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug) as [CategorySlug, ...CategorySlug[]];
