import { getCollection, type CollectionEntry } from 'astro:content';
import { REQUIRED_SECTIONS } from '../content.config';

export type CaseStudy = CollectionEntry<'caseStudies'>;

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Sortable number for a partial ISO date ("2026", "2026-10", "2026-01-20").
 * A missing month or day counts as the start of that year or month, so
 * "2026" sorts before "2026-01-20", which sorts before "2026-10".
 */
export function dateKey(date: string): number {
  const [y, m = 0, d = 0] = date.split('-').map(Number);
  return y * 10000 + m * 100 + d;
}

/** Readable date: "2025", "Oct 2026" or "Jan 20, 2026". */
export function formatDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  if (!m) return String(y);
  if (!d) return `${MONTHS[m - 1]} ${y}`;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/** Newest first; studies with the same date fall back to `order` (lower first). */
export const byNewest = (a: CaseStudy, b: CaseStudy) =>
  dateKey(b.data.date) - dateKey(a.data.date) || a.data.order - b.data.order;

/**
 * All case studies, newest first (ties broken by `order`), after checks the schema cannot express: after checks the schema cannot express:
 * file-name slugs, unique `order` values, and the eight required body sections.
 * Any problem throws, which fails `astro build`.
 */
export async function getCaseStudies(): Promise<CaseStudy[]> {
  const entries = await getCollection('caseStudies');
  const problems: string[] = [];
  const seenOrder = new Map<number, string>();

  for (const e of entries) {
    const where = `src/content/case-studies/${e.id}.md`;
    if (!SLUG.test(e.id)) problems.push(`${where}: file name must be lowercase-words-with-hyphens`);
    const dup = seenOrder.get(e.data.order);
    if (dup) problems.push(`${where}: order ${e.data.order} is already used by ${dup}`);
    seenOrder.set(e.data.order, e.id);

    const headings = [...(e.body ?? '').matchAll(/^##\s+(.+?)\s*$/gm)].map((m) => m[1]);
    if (headings.join('|') !== REQUIRED_SECTIONS.join('|')) {
      problems.push(
        `${where}: body must have exactly these "## " sections in order: ${REQUIRED_SECTIONS.join(', ')}. Found: ${headings.join(', ') || 'none'}`,
      );
    }
    if (/luminary/i.test(JSON.stringify(e.data) + (e.body ?? ''))) {
      problems.push(`${where}: "Luminary" is a typo; the series is "The Luminari Expanse"`);
    }
  }

  if (problems.length) throw new Error(`Invalid case studies:\n- ${problems.join('\n- ')}`);
  return entries.sort(byNewest);
}

/** Absolute URL for a root-relative path. */
export const absolute = (path: string, site: URL | undefined) => new URL(path, site).href;
