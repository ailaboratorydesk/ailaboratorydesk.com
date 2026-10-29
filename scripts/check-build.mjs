#!/usr/bin/env node
/**
 * Post-build checks on dist/. Fails (exit 1) on any error; prints warnings.
 * Run with `npm test` (or `node scripts/check-build.mjs` after `npm run build`).
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const SITE = 'https://www.ailaboratorydesk.com';
const errors = [];
const warnings = [];
const read = (p) => fs.readFileSync(path.join(DIST, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(DIST, p));

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

if (!exists('index.html')) errors.push('dist/index.html is missing');
else {
  const home = read('index.html');
  // Trademark specimen: the offer and a working contact route must stay.
  if (!home.includes('Available for AI consulting')) errors.push('homepage lost "Available for AI consulting"');
  if (!/<form[^>]+action="https:\/\/api\.web3forms\.com\/submit"[^>]*method="POST"/.test(home))
    errors.push('homepage contact form (Web3Forms) is missing');
  if (!/<input type="hidden" name="access_key" value="[^"]+"/.test(home))
    errors.push('homepage contact form has no Web3Forms access_key field');
  else if (home.includes('WEB3FORMS_ACCESS_KEY_PLACEHOLDER'))
    warnings.push('contact form still uses WEB3FORMS_ACCESS_KEY_PLACEHOLDER; set the real access key in src/data/site.ts before merging');
  if (!home.includes('id="contact"')) errors.push('homepage #contact section is missing');
}

const cname = exists('CNAME') ? read('CNAME').trim() : '';
if (cname !== 'www.ailaboratorydesk.com') errors.push(`dist/CNAME must be "www.ailaboratorydesk.com" (found "${cname}")`);

// Every case study page has its share tags.
const workDir = path.join(DIST, 'work');
const slugs = fs.existsSync(workDir) ? fs.readdirSync(workDir) : [];
if (slugs.length === 0) errors.push('no /work/<slug>/ pages were built');
for (const slug of slugs) {
  const file = `work/${slug}/index.html`;
  if (!exists(file)) { errors.push(`${file} is missing`); continue; }
  const html = read(file);
  const url = `${SITE}/work/${slug}/`;
  const need = {
    canonical: `<link rel="canonical" href="${url}">`,
    'og:url': `<meta property="og:url" content="${url}">`,
    'og:title': '<meta property="og:title" content="',
    'og:description': '<meta property="og:description" content="',
    'og:image': `<meta property="og:image" content="${SITE}/`,
    'twitter:card': '<meta name="twitter:card" content="summary_large_image">',
  };
  for (const [k, v] of Object.entries(need)) if (!html.includes(v)) errors.push(`${file}: missing or wrong ${k}`);
  const img = html.match(/<meta property="og:image" content="https:\/\/www\.ailaboratorydesk\.com(\/[^"]+)"/);
  if (img && !exists(decodeURIComponent(img[1]))) errors.push(`${file}: og:image ${img[1]} does not exist in dist/`);
}

// Text files: no "Luminary" typo; local links resolve.
const textFiles = walk(DIST).filter((f) => /\.(html|css|js|xml|txt|json)$/.test(f));
for (const f of textFiles) {
  const s = fs.readFileSync(f, 'utf8');
  if (/luminary/i.test(s)) errors.push(`${f}: contains "Luminary" (the correct spelling is "Luminari")`);
}
for (const f of walk(DIST).filter((f) => f.endsWith('.html') && !f.endsWith('followmewagon_report.html'))) {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/\s(?:href|src)="(\/[^"#?]*)"/g)) {
    let p = decodeURIComponent(m[1]);
    if (p.endsWith('/')) p += 'index.html';
    if (!exists(p)) warnings.push(`${f}: link to ${m[1]} does not resolve to a file in dist/`);
  }
}

for (const w of [...new Set(warnings)]) console.warn(`WARN  ${w}`);
for (const e of errors) console.error(`ERROR ${e}`);
console.log(`check-build: ${slugs.length} case study pages, ${errors.length} error(s), ${new Set(warnings).size} warning(s)`);
process.exit(errors.length ? 1 : 0);
