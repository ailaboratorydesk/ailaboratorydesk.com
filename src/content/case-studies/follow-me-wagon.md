---
title: "Follow-Me Wagon"
oneLiner: "A GPS-tracking autonomous robot that follows you on command — built from off-the-shelf parts with zero prior robotics experience."
date: "2026-06"
order: 1
domains:
  - "Hardware"
  - "Software"
tools:
  - "Raspberry Pi 4"
  - "LewanSoul/Hiwonder tank chassis"
  - "Flask"
  - "Browser Geolocation API"
featured: false
cover:
  src: "/FollowMeWagon.JPG"
  alt: "The Follow-Me Wagon robot: a tracked chassis with a Raspberry Pi and GPS wiring"
icon: "robot"
visual:
  type: "youtube"
  videoId: "O5EXJdPDLwc"
  title: "Follow-Me Wagon demo"
stats:
  - value: "~18 hrs"
    label: "active build time"
  - value: "0"
    label: "prior robotics experience"
  - value: "Live"
    label: "on-camera demo"
goalVsDelivery:
  rows:
    - goal: "Working autonomous robot, demonstrated on camera"
      delivered: "Follows on GPS, four-mode state machine, demo filmed"
      status: "Hit"
    - goal: "Under 20 hours of active build time"
      delivered: "~18 hours"
      status: "Hit"
    - goal: "~$180 in parts (initial estimate)"
      delivered: "~$400 with tax"
      status: "Revised"
  note: "The $180 figure was a first-pass guess made before the design was finalized. As the hardware firmed up, the real parts list came in higher — these were the components the build actually required, not scope creep. The estimate was wrong; the spending was deliberate and documented."
signoff: "\"You don't have to know what you're doing to figure out how to do what you want to do.\""
links:
  - label: "▶ Watch the demo"
    href: "https://youtu.be/O5EXJdPDLwc"
  - label: "Read the full case study"
    href: "/follow-me-wagon-case-study.pdf"
---

## What Was Built

An autonomous robotic vehicle built from off-the-shelf parts. It tracks the operator's phone via GPS, steers with a phase-based control algorithm, and runs a four-mode state machine — Follow, Manual, Park, Neutral. The phone needs no app; a standard browser handles everything.

## Why It Was Built

Could a complete beginner take a physical-robot idea to a working prototype on a fixed time and dollar budget, using AI as the expert guide? The original underwater sand-burrowing concept was ruled out as too ambitious — the wagon was the right first project: meaningful, achievable, and demonstrable on camera.

## Starting Competence

Zero robotics, zero electronics, zero programming, zero multimeter use — every technical domain was new. The one relevant prior skill was structured planning and a willingness to be uncomfortable.

## How AI Was Used

Eight hours of design review came before anything was bought — killing four failed tracking approaches (AirTag UWB, Bluetooth RSSI, direct UWB, native iOS app) on paper before a dollar was spent. During the build, AI worked as an expert on call: a screenshot of an unfamiliar error returned a diagnosis and a fix in minutes, over SSH from the field. The Follow-mode controller went through three full rewrites and roughly six outdoor tuning rounds, landing on a phase-based algorithm that drives straight, executes a time-locked arc, then resumes straight.

## Timeline & Conditions

About one month of weekend sessions, ~18 hours of active build time. No external deadline — self-imposed success criteria. Prior design decisions were captured in handoff summaries so each re-entry was fast.

## Outcome & Evidence

A complete, working autonomous robot. It follows the operator's phone via GPS, runs a four-mode state machine with failsafes, is controlled entirely from a phone browser, and was delivered within the time target. The demo video shows it tracking across open ground, turning, and stopping at the set distance.

## Key Metrics

LewanSoul/Hiwonder tank chassis · Raspberry Pi 4 · phone GPS via browser Geolocation API → Flask on the Pi over WiFi · four operating modes · 10 Hz control loop · phase-based controller (3 rewrites, ~6 tuning rounds) · 4 tracking methods rejected · 1 motor failure (warranty replaced) · ~18 active hours.

## Lessons Learned

The first eight hours — the design phase — held the most leverage in the whole project. AI as an expert on call compressed days of forum research into hours, but the hardware work was still hands-on. Hardware fails, and that's normal: isolate, document, decide, continue. Every deferred feature was a deliberate scope decision, not a failure.
