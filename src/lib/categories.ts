import { CATEGORIES, type CategoryDef } from '../data/categories';
import { getCaseStudies, type CaseStudy } from './case-studies';

export interface Category extends CategoryDef {
  href: string;
  /** Case studies in this category, in homepage order. */
  studies: CaseStudy[];
  /** The study shown for this category in the home carousel. */
  featuredStudy: CaseStudy;
}

export const categoryHref = (slug: string) => `/work/category/${slug}/`;

/**
 * Categories that have at least one case study, in the order of src/data/categories.ts.
 * Fails the build if a category's `featured` study is missing or not in that category,
 * or if a case study slug would collide with the /work/category/ route.
 */
export async function getCategories(): Promise<Category[]> {
  const studies = await getCaseStudies();
  const problems: string[] = [];
  if (studies.some((s) => s.id === 'category')) problems.push('a case study cannot be named "category" (reserved for /work/category/)');
  const out: Category[] = [];
  for (const def of CATEGORIES as readonly CategoryDef[]) {
    const members = studies.filter((s) => (s.data.categories as string[]).includes(def.slug));
    if (members.length === 0) continue; // never show an empty category
    const featuredStudy = members.find((s) => s.id === def.featured);
    if (!featuredStudy) {
      problems.push(`src/data/categories.ts: "${def.slug}" features "${def.featured}", which is not a case study in that category`);
      continue;
    }
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

/** Other studies sharing a category with `study`, most shared categories first, then homepage order. */
export function relatedTo(study: CaseStudy, all: CaseStudy[], limit = 4): CaseStudy[] {
  const mine = new Set(study.data.categories as string[]);
  return all
    .filter((s) => s.id !== study.id)
    .map((s) => ({ s, n: (s.data.categories as string[]).filter((c) => mine.has(c)).length }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n || a.s.data.order - b.s.data.order)
    .slice(0, limit)
    .map((x) => x.s);
}
