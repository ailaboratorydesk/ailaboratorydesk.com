/**
 * Content collections for www.ailaboratorydesk.com.
 *
 * The `caseStudies` schema is deliberately strict: an entry with a missing
 * field, a wrong type, an unknown key, a bad date, a malformed URL, or the
 * wrong number of stats fails `astro build`, so a broken case study can never
 * reach the live site. See AGENTS.md and docs/case-study-template.md.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Domains double as the future filter chips (see the redesign plan). */
export const DOMAINS = ['Writing', 'Hardware', 'Software', 'Analysis', 'Media', 'AI systems'] as const;

/** Card icons available in src/components/CaseStudyIcon.astro. */
export const ICONS = ['robot', 'book', 'audit', 'wrench', 'network', 'globe', 'podcast', 'comic'] as const;

/** Hand-drawn card illustrations available in src/components/visuals/. */
export const ILLUSTRATIONS = ['audit-money-flow'] as const;

/** The eight body sections every case study must contain, in this order. */
export const REQUIRED_SECTIONS = [
  'What Was Built',
  'Why It Was Built',
  'Starting Competence',
  'How AI Was Used',
  'Timeline & Conditions',
  'Outcome & Evidence',
  'Key Metrics',
  'Lessons Learned',
] as const;

const text = (min = 1, max = 2000) => z.string().trim().min(min).max(max);

/** A file served from public/, written as a root-relative, URL-encoded path (spaces as %20). */
const localPath = z
  .string()
  .regex(/^\/[A-Za-z0-9._~%\-/]+$/, 'must be a root-relative path like "/my-file.pdf" (encode spaces as %20)')
  .refine((p) => !p.includes('..'), 'must not contain ".."');

const imagePath = localPath.refine(
  (p) => /\.(jpe?g|png|webp|gif|svg)$/i.test(p),
  'must point to an image file (.jpg, .jpeg, .png, .webp, .gif, .svg)',
);

const httpsUrl = z.url({ protocol: /^https$/, hostname: z.regexes.domain }).describe('absolute https:// URL');

/** A link is either an external https:// URL or a file served from public/. */
const href = z.union([httpsUrl, localPath], {
  error: 'must be an https:// URL or a root-relative path like "/file.pdf"',
});

/** Partial ISO date: "2025", "2026-06" or "2026-01-20". */
const partialIsoDate = z
  .string()
  .regex(/^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/, 'must be YYYY, YYYY-MM or YYYY-MM-DD')
  .refine((d) => {
    const [y, m, day] = d.split('-').map(Number);
    if (y < 2000 || y > 2100) return false;
    if (day === undefined) return true;
    const dt = new Date(Date.UTC(y, m - 1, day));
    return dt.getUTCMonth() === m - 1 && dt.getUTCDate() === day;
  }, 'must be a real calendar date between 2000 and 2100');

const stat = z.strictObject({ value: text(1, 24), label: text(1, 60) });

const visual = z.discriminatedUnion('type', [
  z.strictObject({
    type: z.literal('youtube'),
    videoId: z.string().regex(/^[A-Za-z0-9_-]{11}$/, 'must be an 11-character YouTube video id'),
    title: text(1, 120),
  }),
  z.strictObject({
    type: z.literal('image'),
    src: imagePath,
    alt: text(1, 200),
    href,
    badge: text(1, 40),
    fit: z.enum(['cover', 'contain']).default('cover'),
  }),
  z.strictObject({
    type: z.literal('illustration'),
    name: z.enum(ILLUSTRATIONS),
  }),
]);

const caseStudies = defineCollection({
  // Files starting with "_" (drafts, scratch copies) are ignored.
  loader: glob({ base: './src/content/case-studies', pattern: '[!_]*.md' }),
  schema: z
    .strictObject({
      /** Card and page title. */
      title: text(1, 120),
      /** One sentence under the title; also the page meta/OG description. */
      oneLiner: text(20, 320),
      /** When the project was completed (or published). Partial ISO date. */
      date: partialIsoDate,
      /** Position on the homepage, 1 = first. Must be unique. */
      order: z.int().min(1).max(999),
      /** One or more domains from DOMAINS. */
      domains: z.array(z.enum(DOMAINS)).min(1).refine((a) => new Set(a).size === a.length, 'no duplicate domains'),
      /** Main tools and platforms used. */
      tools: z.array(text(1, 60)).min(1),
      /** Pin to the featured row in the upcoming redesign. */
      featured: z.boolean().default(false),
      /** Share image (Open Graph / Twitter card) for the study page. */
      cover: z.strictObject({ src: imagePath, alt: text(1, 200) }),
      /** Small square icon shown on the card head. */
      icon: z.enum(ICONS),
      /** The media block on the collapsed card: a YouTube embed, a linked image, or an illustration. */
      visual,
      /** Exactly three headline stats on the collapsed card. */
      stats: z.array(stat).length(3),
      /** Optional "Goal vs. Delivery" table. `status` is Hit or Revised; omit it to hide the status column. */
      goalVsDelivery: z
        .strictObject({
          rows: z
            .array(
              z.strictObject({
                goal: text(1, 300),
                delivered: text(1, 300),
                status: z.enum(['Hit', 'Revised']).optional(),
              }),
            )
            .min(1),
          note: text(1, 1200).optional(),
        })
        .refine(
          (g) => g.rows.every((r) => r.status) || g.rows.every((r) => !r.status),
          'give every row a status, or none of them',
        )
        .optional(),
      /** Optional italic scope banner shown at the top of the case study. */
      scope: text(1, 1200).optional(),
      /** Optional two-stage timeline (value + text rows). */
      timeline: z
        .strictObject({
          rows: z.array(z.strictObject({ value: text(1, 24), text: text(1, 300) })).min(1),
          note: text(1, 1200).optional(),
        })
        .optional(),
      /** Optional highlighted callout. `**bold**` is supported. */
      callout: text(1, 1200).optional(),
      /** Optional closing quote. */
      signoff: text(1, 400).optional(),
      /** Evidence buttons at the bottom of the case study (demo, live site, full PDF). */
      links: z.array(z.strictObject({ label: text(1, 80), href })).min(1),
    })
    .refine((d) => [d.goalVsDelivery, d.scope, d.timeline, d.callout].filter(Boolean).length <= 1, {
      message: 'use at most one of goalVsDelivery, scope, timeline, callout',
    }),
});

export const collections = { caseStudies };
