import { CATEGORIES, type CategoryDef } from '../data/categories';
import { byNewest, getCaseStudies, type CaseStudy } from './case-studies';

export interface Category extends CategoryDef {
  href: string;
  /** Case studies in this category, newest first. */
  studies: CaseStudy[];
  /**
   * The study shown for this category in the home carousel: the newest study whose primary
   * (first-listed) category is this one, so a study in several categories fills only one slide.
   * Falls back to the newest study not already shown. `featured` overrides it.
   */
  featuredStudy: CaseStudy;
}

export const categoryHref = (slug: string) => `/work/category/${slug}/`;

/**
 * Categories that have at least one case study, in the order of src/data/categories.ts.
 * Each category's studies are newest first; its carousel study is its newest primary study (see featuredStudy).
 * Fails the build if a category's optional `featured` override is not a study in that category,
 * or if a case study slug would collide with the /work/category/ route.
 */
export async function getCategories(): Promise<Category[]> {
  const studies = await getCaseStudies();
  const problems: string[] = [];
  if (studies.some((s) => s.id === 'category')) problems.push('a case study cannot be named "category" (reserved for /work/category/)');
  const out: Category[] = [];
  const shown = new Set<string>();
  for (const def of CATEGORIES as readonly CategoryDef[]) {
    const members = studies.filter((s) => (s.data.categories as string[]).includes(def.slug));
    if (members.length === 0) continue; // never show an empty category
    const primary = members.find((s) => (s.data.categories as string[])[0] === def.slug);
    const featuredStudy = def.featured
      ? members.find((s) => s.id === def.featured)
      : primary ?? members.find((s) => !shown.has(s.id)) ?? members[0];
    if (!featuredStudy) {
      problems.push(`src/data/categories.ts: "${def.slug}" features "${def.featured}", which is not a case study in that category`);
      continue;
    }
    shown.add(featuredStudy.id);
    out.push({ ...def, href: categoryHref(def.slug), studies: members, featuredStudy });
  }
  if (problems.length) throw new Error(`Invalid categories:\n- ${problems.join('\n- ')}`);
  return out;
}

/** Category definitions for one study, in category order. */
export function categoriesOf(study: CaseStudy): CategoryDef[] {
  const mine = study.data.categories as string[];
  return (CATEGORIES as readonly CategoryDef[]).filter((c) => mine.includes(c.slug));
}

/** Other studies sharing a category with `study`, most shared categories first, then newest first. */
export function relatedTo(study: CaseStudy, all: CaseStudy[], limit = 4): CaseStudy[] {
  const mine = new Set(study.data.categories as string[]);
  return all
    .filter((s) => s.id !== study.id)
    .map((s) => ({ s, n: (s.data.categories as string[]).filter((c) => mine.has(c)).length }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n || byNewest(a.s, b.s))
    .slice(0, limit)
    .map((x) => x.s);
}
