---
# Copy this file to src/content/case-studies/<slug>.md
#   <slug> = lowercase words joined by hyphens; it becomes the URL /work/<slug>/
# Every field is checked by the schema in src/content.config.ts. A mistake fails `npm run build`.
# Use only facts that already exist (Daniel's own write-ups). Never invent clients, results,
# testimonials, quotes, or prices.

title: "Project name"                      # 1–120 characters
oneLiner: "One sentence: what was built and why it matters (20–320 characters)."
date: "2026-06"                            # YYYY, YYYY-MM, or YYYY-MM-DD
order: 9                                   # position on the homepage; must be unique
domains:                                   # one or more of: Writing, Hardware, Software, Analysis, Media, AI systems
  - "Software"
tools:                                     # at least one
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
  - label: "Read the full case study"
    href: "/my-case-study.pdf"
---

## What Was Built

## Why It Was Built

## Starting Competence

## How AI Was Used

## Timeline & Conditions

## Outcome & Evidence

## Key Metrics

## Lessons Learned
