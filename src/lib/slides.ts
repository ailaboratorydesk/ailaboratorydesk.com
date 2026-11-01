/**
 * Images for the redesign's project carousel and gallery. Every image is an
 * existing case-study image in public/ (no new artwork). The Red Omen uses a
 * resized copy of its cover (red-omen-cover-600.jpg) instead of the 1.9 MB original.
 * Studies with `placeholder: true` have no photo yet and show their icon on a
 * styled panel (Forensic Financial Audit).
 */
import type { CaseStudy } from './case-studies';

export interface SlideImage {
  src?: string;
  alt: string;
  /** CSS object-fit for the tile. Portrait covers use contain. */
  fit: 'cover' | 'contain';
  /** CSS object-position. */
  pos: string;
  placeholder?: boolean;
}

const OVERRIDES: Record<string, Partial<SlideImage>> = {
  'the-red-omen': { src: '/red-omen-cover-600.jpg', fit: 'contain' },
  'financial-audit': { src: undefined, placeholder: true },
  'multi-agent-viability-system': { pos: 'top center' },
  'ai-laboratory-podcast': { pos: 'top center' },
  'luminariexpanse': { pos: 'center' },
  'digital-comic-with-ai': { pos: 'top center' },
};

export function slideImage(s: CaseStudy): SlideImage {
  const base: SlideImage = { src: s.data.cover.src, alt: s.data.cover.alt, fit: 'cover', pos: 'center' };
  return { ...base, ...OVERRIDES[s.id] };
}
