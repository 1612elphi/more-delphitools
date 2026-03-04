# Showcase Wheel — Design Document

## Concept

A single-page portfolio site that frames projects around the **problems** they solve, not the tools themselves. A half-wheel anchored to the left edge of the viewport acts as an infinite, scrollable index of problems. Pausing on one triggers a full-page "takeover" revealing the solution.

## Desktop Layout

**Two zones, single viewport, no page scroll.**

### Left: The Wheel (~40% width)

- Half-circle with center point on the left screen edge. Only the right half is visible.
- Spokes radiate outward, each holding a problem statement as text.
- One spoke is always notched to horizontal center (pointing right) — the "active" spoke.
- Mouse scroll rotates the wheel. Scroll-snap ensures one spoke always aligns to center.
- Infinite loop: spokes rotating off-screen (past ~7–8 o'clock or ~4–5 o'clock) get their content swapped for the next problem in the list. The swap is invisible to the user.

### Right: The Takeover Zone (~60% width)

- Default state: title/tagline.
- When the active spoke dwells at center for ~1.5 seconds, the takeover triggers.
- Background color/gradient/pattern morphs across the entire viewport (~400–500ms CSS transition).
- Takeover content fades/slides in from the right.
- The wheel stays visible but dims; the active spoke stays highlighted.
- Scrolling the wheel again dismisses the takeover and resumes browsing.

## Mobile Layout

- Single column, full viewport.
- Problems in a vertically scrolling list with CSS scroll-snap — one problem snaps to vertical center.
- Centered problem is visually emphasized (larger, brighter); others dim.
- Tap centered problem → full-screen takeover with same color/gradient/pattern transition.
- Swipe or back gesture to return to the list.
- No wheel graphic — text only. The wheel is a desktop affordance.

## Takeover Content

- Each problem gets its own `.astro` file with freeform layout.
- Frontmatter defines: problem text, project name, color scheme, gradient, pattern.
- Problems sharing a project share a style definition but have independent layouts.
- Every takeover includes a link to the full project page.

## Tech Stack

- **Astro** — static site generator. Output is pure HTML/CSS/JS, zero runtime framework.
- No npm runtime dependencies beyond Astro itself.
- Scroll, snap, dwell, and transition logic in vanilla JS within `<script>` tags.

## Project Structure

```
more-delphitools/
├── astro.config.mjs
├── package.json
├── public/
│   └── projects/          # existing project HTML pages
│       ├── taxiway/
│       ├── cassini/
│       └── ...
├── src/
│   ├── layouts/
│   │   └── Base.astro     # shared viewport layout, fonts, global styles
│   ├── pages/
│   │   └── index.astro    # the wheel page
│   ├── components/
│   │   ├── Wheel.astro    # half-wheel + scroll/snap/dwell logic
│   │   └── Takeover.astro # takeover container + transition wrapper
│   ├── problems/
│   │   ├── preflight-pdfs.astro
│   │   ├── adfree-youtube.astro
│   │   └── ...            # one file per problem
│   ├── data/
│   │   └── problems.ts    # ordered list: slug, label, project, colors
│   └── styles/
│       ├── global.css
│       ├── wheel.css
│       └── projects/      # shared style families per project
│           ├── taxiway.css
│           ├── delphitools.css
│           └── ...
```

## Adding a New Problem

1. Add entry to `src/data/problems.ts` (slug, label, project, colors).
2. Create `src/problems/<slug>.astro` with the takeover layout.
3. Done.
