import { getCollection, type CollectionEntry } from 'astro:content';
import { REQUIRED_SECTIONS } from '../content.config';

export type CaseStudy = CollectionEntry<'caseStudies'>;

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * All case studies in homepage order, after checks the schema cannot express:
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
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/** Absolute URL for a root-relative path. */
export const absolute = (path: string, site: URL | undefined) => new URL(path, site).href;
