# AGENTS.md — working on ailaboratorydesk.com

Instructions for people and AI agents changing this repository. Read the whole file before you start.

The site is a static [Astro](https://astro.build) site for **The AI Laboratory** (Daniel Stroup),
served by GitHub Pages at <https://www.ailaboratorydesk.com>.

## Ground rules

- **Never push to `main`, never merge, never force-push, never rewrite history, never delete branches.**
  Work on a branch and open a pull request. Daniel merges.
- **Keep "Available for AI consulting"** on the homepage, with a working contact form. It is the
  specimen for the AI LABORATORY trademark application (serial 99869622). `npm test` fails without it.
- **Invent nothing.** Use only facts already in Daniel's write-ups: no made-up clients, results,
  testimonials, quotes, or prices.
- **Spelling:** the book series is *The Luminari Expanse* — never "Luminary". The build fails on it.
- Do not change DNS (GoDaddy), the custom domain, or repository/Pages settings unless Daniel asks.

## Data security (read before every commit)

- **No secrets in the repo**: API keys, tokens, passwords, private keys, `.env` files, cookies.
  Files such as `Mailerlite api_token.txt` or `AI Lab API Key.txt` must never be opened, copied,
  printed, or committed. `.gitignore` blocks common names; `npm run test:security` checks for more.
- **No personal data**: no personal email addresses, phone numbers, home addresses, or account numbers
  in pages or source. The contact form posts to FormSubmit; set its endpoint once, in `src/data/site.ts`.
- **No sensitive documents**: no court filings, bank statements, discovery, contracts, medical or
  client documents — not even "just for the build". Case-study PDFs must be the redacted, public versions.
- When reporting a finding, give the **file path and type only**, never the value.
- GitHub secret scanning and push protection are enabled on this repo; if a push is blocked, remove the
  secret from the commit (and rotate it) instead of bypassing the block.

## Layout

```
astro.config.mjs              site URL, static output, Markdown pipeline
src/content.config.ts         caseStudies collection + strict zod schema (the source of truth for fields)
src/content/case-studies/     one .md per case study (filename = URL slug)
src/lib/case-studies.ts       loads/sorts studies; extra build-time checks (sections, order, spelling)
src/lib/rehype-case-study-sections.mjs   turns "## Heading" blocks into the card's section markup
src/data/site.ts              site name, description, social links, contact form endpoint
src/layouts/BaseLayout.astro  <head> (title, canonical, Open Graph, Twitter card), nav, footer
src/components/               Nav, Hero, Consulting (LAB-3), About, Contact, CaseStudyCard, icons
src/pages/index.astro         homepage
src/pages/work/[slug].astro   one page per case study at /work/<slug>/
src/styles/global.css         the site's original CSS (keep the look unchanged)
public/                       files served as-is (images, PDFs, CNAME, followmewagon_report.html)
docs/case-study-template.md   copy this to add a case study
scripts/check-build.mjs       post-build checks on dist/
scripts/check-security.mjs    secret / personal-data scan of tracked files
.github/workflows/deploy.yml  CI build on PRs; deploy to Pages on push to main
                              (until moved there, parked at docs/deploy-workflow.yml)
```

## Add a case study

1. Copy `docs/case-study-template.md` to `src/content/case-studies/<slug>.md`
   (`<slug>`: lowercase, hyphens; it becomes `/work/<slug>/`).
2. Fill in the front matter. The schema rejects unknown fields, missing fields, bad dates, bad URLs,
   anything other than exactly three stats, and duplicate `order` values.
3. Write the body with exactly these `##` sections, in this order:
   What Was Built · Why It Was Built · Starting Competence · How AI Was Used ·
   Timeline & Conditions · Outcome & Evidence · Key Metrics · Lessons Learned.
4. Put any linked files (PDF, image) in `public/` and link them root-relative with spaces as `%20`.
5. Run `npm test`, check the homepage card and `/work/<slug>/` in `npm run dev`, then open a PR.

Files whose name starts with `_` are ignored by the collection (use that for drafts you keep locally — but
do not commit drafts with unpublished or sensitive content).

## Build and test

Requires Node **22.23.4 or newer** (Astro 7).

```bash
npm ci               # install exact versions from package-lock.json
npm run dev          # local dev server at http://localhost:4321
npm run build        # static build into dist/
npm run preview      # serve dist/ locally
npm test             # astro check + build + scripts/check-build.mjs + scripts/check-security.mjs
```

`npm test` must pass before a PR is opened. `check-build` warns (does not fail) about local links that
point to files not in the repo.

If a Markdown/plugin change does not show up, clear the caches: `rm -rf .astro node_modules/.astro dist`.

## Deploying

`.github/workflows/deploy.yml` builds every pull request (no deploy) and, on a push to `main`
(i.e. when Daniel merges a PR) or a manual run on `main`, uploads `dist/` with
`actions/upload-pages-artifact` and publishes it with `actions/deploy-pages`.

Until it is moved into place, the workflow is parked at `docs/deploy-workflow.yml` (pushing
workflow files needs a GitHub token with the `workflow` scope); move it with
`git mv docs/deploy-workflow.yml .github/workflows/deploy.yml` before merging.

This only works when **Settings → Pages → Build and deployment → Source** is **GitHub Actions**.
`public/CNAME` keeps the custom domain `www.ailaboratorydesk.com`; DNS stays at GoDaddy, unchanged.

## Consulting copy (LAB-3)

The consulting section ships in a separate PR (LAB-3). Its markup slots into
`src/components/Consulting.astro` and `src/components/ConsultingCta.astro` (both placeholders here),
plus any hero/contact text in `Hero.astro` / `Contact.astro` and the form endpoint in `src/data/site.ts`.
Port the LAB-3 copy verbatim; do not write new consulting copy.
