---
# Copy this file to src/content/case-studies/<slug>.md
#   <slug> = lowercase words joined by hyphens; it becomes the URL /work/<slug>/
# Every field is checked by the schema in src/content.config.ts. A mistake fails `npm run build`.
# Use only facts that already exist (Daniel's own write-ups). Never invent clients, results,
# testimonials, quotes, or prices.
#
# HOW TO ADD A CASE STUDY
#   1. Copy this file to src/content/case-studies/<slug>.md (the slug "category" is reserved).
#   2. Fill in every field; list one or more categories (slugs from src/data/categories.ts).
#   3. Put any image in public/ and reference it as "/File%20Name.jpg".
#   4. Run `npm test`. Nothing else to edit: the library (/work/), each category page
#      (/work/category/<slug>/), the home category grid and the "Related projects"
#      strips all update from the categories list. Search covers title, one-liner,
#      category names, tags and tools.
#   Lists are sorted by `date`, newest first, and every card shows it ("Oct 2026",
#   "Jan 20, 2026", "2025"). A year-only date counts as the start of that year; studies
#   with the same date fall back to `order`. Each category's newest study is the one
#   shown in the home carousel, so a new study takes over its category's slide.
#
# HOW TO ADD A CATEGORY
#   1. Add an entry to CATEGORIES in src/data/categories.ts: slug (lowercase-hyphens),
#      name, one-line description, image (an existing file in public/, or omit it to use
#      the icon placeholder) and icon. The home carousel shows the category's newest
#      study; set the optional `featured` (a study slug in that category, or the build
#      fails) only to pin a different one.
#   2. Add the slug to the `categories:` list of each case study that belongs in it.
#   3. Run `npm test`. A category with no case studies is hidden everywhere, and the
#      order of CATEGORIES is the order of the home carousel, home tiles and library chips.

title: "Project name"                      # 1–120 characters
oneLiner: "One sentence: what was built and why it matters (20–320 characters)."
date: "2026-06"                            # YYYY, YYYY-MM, or YYYY-MM-DD; shown on cards, lists sort newest first
order: 10                                  # tie-breaker for studies with the same date (lower first); must be unique
domains:                                   # one or more of: Writing, Hardware, Software, Analysis, Media, AI systems
  - "Software"
categories:                                # one or more slugs from src/data/categories.ts
  - "software-apps"
# tags:                                   # optional extra search words for the library
#   - "mobile app"
tools:                                     # at least one (also searchable in the library)
  - "Claude"
featured: false                            # true for at most a few headline studies
cover:                                     # share image (og:image); file must be in public/
  src: "/AI%20Lab%20Logo.png"              # root-relative, spaces encoded as %20
  alt: "Describe the image"
icon: "robot"                              # robot | book | audit | wrench | network | globe | podcast | comic
visual:                                    # pick ONE of the three shapes:
  type: "youtube"
  videoId: "XXXXXXXXXXX"                   # the 11-character id from the YouTube URL
  title: "Video title"
# visual:
#   type: "image"
#   src: "/my-image.jpg"
#   alt: "Describe the image"
#   href: "https://example.com"            # optional: click-through link
#   badge: "Label"                         # optional
#   fit: "cover"                           # cover | contain
# visual:
#   type: "illustration"
#   name: "audit-money-flow"               # only built-in illustrations
stats:                                     # exactly three
  - value: "~1 mo"                         # max 24 characters
    label: "start to finish"               # max 60 characters
  - value: "3"
    label: "second stat"
  - value: "Solo"
    label: "third stat"
# Optional: AT MOST ONE of goalVsDelivery, scope, timeline, callout.
# goalVsDelivery:
#   rows:
#     - goal: "What was planned"
#       delivered: "What shipped"
#       status: "Hit"                      # Hit | Revised (give every row a status, or none)
#   note: "Optional note under the table"
# scope: "One paragraph on what this was and was not."
# timeline:
#   rows:
#     - value: "Week 1"
#       text: "What happened"
#   note: "Optional note"
# callout: "A highlighted line; **bold** is allowed."
# signoff: "Optional closing line"
links:                                     # at least one; https:// URL or a file in public/
  - label: "Read the full case study"      # the long-form PDF, last in the list
    href: "/<slug>-case-study.pdf"
---

## What Was Built

## Why It Was Built

## Starting Competence

## How AI Was Used

## Timeline & Conditions

## Outcome & Evidence

## Key Metrics

## Lessons Learned
