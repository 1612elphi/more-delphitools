# Showcase Wheel — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single-page portfolio site with a half-wheel problem navigator and per-problem takeover pages, using Astro for static site generation.

**Architecture:** Astro generates a static index page with the wheel component. Each problem has a detail page at `/problems/<slug>/` generated at build time. When a takeover triggers, the client fetches the detail page HTML and injects it into the takeover zone — the ~400ms CSS transition hides the fetch latency. All interactivity (scroll, snap, dwell, transitions) is vanilla JS in `<script>` tags.

**Tech Stack:** Astro 5.x (static output), vanilla JS, CSS transitions/transforms, no runtime frameworks.

**Design doc:** `docs/plans/2026-03-03-showcase-wheel-design.md`

---

### Task 1: Scaffold Astro Project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`
- Create: `src/pages/index.astro`
- Delete: `index.html` (replaced by Astro output)

**Step 1: Initialize Astro with the minimal template**

```bash
cd /Users/ruby/GitRepos/more-delphitools
npm create astro@latest . -- --template minimal --install --no-git --typescript strict
```

Use `--no-git` because the repo already exists. The `.` tells it to scaffold into the current directory. Say yes to overwrite if prompted about existing files.

**Step 2: Delete the old empty `index.html`**

```bash
rm index.html
```

**Step 3: Verify dev server starts**

```bash
npm run dev
```

Visit `http://localhost:4321`. Should see the minimal Astro starter page. Kill the server.

**Step 4: Verify build works**

```bash
npm run build
```

Should produce `dist/` with static HTML output.

**Step 5: Add `dist/` and `node_modules/` to `.gitignore`**

Create/update `.gitignore`:
```
node_modules/
dist/
.astro/
```

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro project with minimal template"
```

---

### Task 2: Base Layout, Global Styles, and Problems Data

**Files:**
- Create: `src/layouts/Base.astro`
- Create: `src/styles/global.css`
- Create: `src/data/problems.ts`
- Modify: `src/pages/index.astro`

**Step 1: Create the Base layout**

`src/layouts/Base.astro`:
```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>

<style is:global>
  @import '../styles/global.css';
</style>
```

**Step 2: Create global styles**

`src/styles/global.css` — full viewport, no scroll, bold background:
```css
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow: hidden;
  font-family: system-ui, -apple-system, sans-serif;
}

body {
  background: var(--bg-color, #1a1a2e);
  color: var(--text-color, #e0e0e0);
  transition: background 500ms ease, color 500ms ease;
}
```

The `--bg-color` and `--text-color` CSS custom properties are the takeover hook — JS sets them to transition the background.

**Step 3: Create the problems data file**

`src/data/problems.ts` — start with 5 problems across 2–3 projects as test data:
```typescript
export interface Problem {
  slug: string;
  label: string;
  project: string;
  colors: {
    bg: string;
    text: string;
    accent: string;
  };
}

export const problems: Problem[] = [
  {
    slug: 'preflight-pdfs',
    label: 'I need to preflight PDFs without Adobe',
    project: 'taxiway',
    colors: { bg: '#1a1a2e', text: '#e0e0e0', accent: '#d4a843' },
  },
  {
    slug: 'pixel-art-ipad',
    label: 'I want a minimal pixel art tool for iPad',
    project: 'cassini',
    colors: { bg: '#0d1b2a', text: '#e0e0e0', accent: '#48cae4' },
  },
  {
    slug: 'rpn-calculator',
    label: 'I miss my HP RPN calculator',
    project: 'pocketpigs',
    colors: { bg: '#2d1b00', text: '#f0e6d3', accent: '#ff8c00' },
  },
  {
    slug: 'adfree-youtube',
    label: 'I want ad-free YouTube on Apple TV',
    project: 'envy',
    colors: { bg: '#1a0a2e', text: '#e0e0e0', accent: '#bb86fc' },
  },
  {
    slug: 'train-departures',
    label: 'I want live train departures on my phone',
    project: 'siding',
    colors: { bg: '#0a1a0a', text: '#e0e0e0', accent: '#4caf50' },
  },
];
```

**Step 4: Wire up index.astro as a shell**

`src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import { problems } from '../data/problems';
---
<Base title="delphitools">
  <main class="viewport">
    <div class="wheel-zone">
      <!-- Wheel goes here in Task 3 -->
      <p>Wheel ({problems.length} problems)</p>
    </div>
    <div class="takeover-zone">
      <div class="default-content">
        <h1>delphitools</h1>
        <p>things I've built to solve problems</p>
      </div>
      <div class="takeover-content" id="takeover-content"></div>
    </div>
  </main>
</Base>

<style>
  .viewport {
    display: flex;
    height: 100vh;
    width: 100vw;
  }
  .wheel-zone {
    width: 40%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .takeover-zone {
    width: 60%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .default-content {
    text-align: center;
  }
  .takeover-content {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 400ms ease;
    pointer-events: none;
  }
  .takeover-content.active {
    opacity: 1;
    pointer-events: auto;
  }
</style>
```

**Step 5: Verify in dev server**

```bash
npm run dev
```

Should see "delphitools" title on the right, "Wheel (5 problems)" on the left.

**Step 6: Commit**

```bash
git add src/
git commit -m "feat: add base layout, global styles, problems data, and index shell"
```

---

### Task 3: Static Wheel Rendering

**Files:**
- Create: `src/components/Wheel.astro`
- Create: `src/styles/wheel.css`
- Modify: `src/pages/index.astro`

**Step 1: Create the wheel CSS**

`src/styles/wheel.css` — positions the half-wheel with center at left edge:
```css
.wheel {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
}

.spoke {
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0 0;
  white-space: nowrap;
  font-size: 1rem;
  font-weight: 600;
  padding-left: 2rem;
  cursor: default;
  transition: opacity 200ms ease;
  color: var(--text-color, #e0e0e0);
  opacity: 0.5;
}

.spoke.active {
  opacity: 1;
  font-size: 1.1rem;
}
```

Each spoke's `transform` will be set inline: `rotate(Xdeg) translateX(Rpx)` where R is the wheel radius and X is the spoke's angle. This positions the text along a radial spoke pointing outward from the left edge.

**Step 2: Create the Wheel component**

`src/components/Wheel.astro`:
```astro
---
import type { Problem } from '../data/problems';

interface Props {
  problems: Problem[];
}

const { problems } = Astro.props;
const SPOKE_ANGLE = 25; // degrees between spokes
const VISIBLE_SPOKES = 11; // render this many spokes (covers ~270° visible arc + buffer)
const WHEEL_RADIUS = 280; // px from center to text
---

<div class="wheel" id="wheel"
  data-problems={JSON.stringify(problems)}
  data-spoke-angle={SPOKE_ANGLE}
  data-visible-spokes={VISIBLE_SPOKES}
  data-radius={WHEEL_RADIUS}
>
  {Array.from({ length: VISIBLE_SPOKES }, (_, i) => {
    const angle = (i - Math.floor(VISIBLE_SPOKES / 2)) * SPOKE_ANGLE;
    const problem = problems[((i % problems.length) + problems.length) % problems.length];
    return (
      <div
        class:list={['spoke', { active: i === Math.floor(VISIBLE_SPOKES / 2) }]}
        data-index={i}
        style={`transform: rotate(${angle}deg) translateX(${WHEEL_RADIUS}px);`}
      >
        {problem.label}
      </div>
    );
  })}
</div>

<style>
  @import '../styles/wheel.css';
</style>
```

This renders the initial static wheel: spokes fanning out from the left edge, center spoke marked active.

**Step 3: Wire into index.astro**

Replace the placeholder in `index.astro`'s wheel-zone:
```astro
---
import Base from '../layouts/Base.astro';
import Wheel from '../components/Wheel.astro';
import { problems } from '../data/problems';
---
<Base title="delphitools">
  <main class="viewport">
    <div class="wheel-zone">
      <Wheel problems={problems} />
    </div>
    <div class="takeover-zone">
      <!-- ... same as before ... -->
    </div>
  </main>
</Base>
```

**Step 4: Verify visually**

```bash
npm run dev
```

Should see problem text labels radiating out from the left edge in a fan pattern. The center spoke should be brighter/larger. This is the static foundation — no scrolling yet.

**Step 5: Commit**

```bash
git add src/
git commit -m "feat: add static wheel component with radial spoke layout"
```

---

### Task 4: Wheel Scroll, Rotation, and Snap

**Files:**
- Create: `src/scripts/wheel.ts`
- Modify: `src/components/Wheel.astro` (add `<script>` import)

This is the core interaction: scroll to rotate, snap to nearest spoke.

**Step 1: Create the wheel interaction script**

`src/scripts/wheel.ts`:
```typescript
interface WheelState {
  problems: { slug: string; label: string; project: string; colors: { bg: string; text: string; accent: string } }[];
  spokeAngle: number;
  visibleSpokes: number;
  radius: number;
  rotation: number;       // current rotation in degrees (fractional during scroll)
  targetRotation: number; // snap target
  activeIndex: number;    // index into problems[] for the center spoke
  isAnimating: boolean;
  dwellTimer: number | null;
  takeoverActive: boolean;
}

const wheelEl = document.getElementById('wheel')!;
const dataset = wheelEl.dataset;

const state: WheelState = {
  problems: JSON.parse(dataset.problems!),
  spokeAngle: Number(dataset.spokeAngle),
  visibleSpokes: Number(dataset.visibleSpokes),
  radius: Number(dataset.radius),
  rotation: 0,
  targetRotation: 0,
  activeIndex: 0,
  isAnimating: false,
  dwellTimer: null,
  takeoverActive: false,
};

const spokes = wheelEl.querySelectorAll<HTMLElement>('.spoke');
const halfVisible = Math.floor(state.visibleSpokes / 2);

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function render() {
  spokes.forEach((spoke, i) => {
    const offset = i - halfVisible;
    const angle = offset * state.spokeAngle + state.rotation;
    spoke.style.transform = `rotate(${angle}deg) translateX(${state.radius}px)`;

    // Determine which problem this spoke shows
    const problemIndex = mod(state.activeIndex + offset, state.problems.length);
    spoke.textContent = state.problems[problemIndex].label;

    // Highlight the center spoke
    const isCenter = i === halfVisible;
    spoke.classList.toggle('active', isCenter);
  });
}

// Smooth snap animation
function animateSnap() {
  const diff = state.targetRotation - state.rotation;
  if (Math.abs(diff) < 0.5) {
    state.rotation = state.targetRotation;
    state.isAnimating = false;
    render();
    startDwell();
    return;
  }
  state.rotation += diff * 0.15;
  render();
  requestAnimationFrame(animateSnap);
}

function snapToNearest() {
  // Round rotation to nearest spoke multiple
  const snapped = Math.round(state.rotation / state.spokeAngle) * state.spokeAngle;
  state.targetRotation = snapped;
  // Update active index based on how many spokes we've scrolled
  state.activeIndex = mod(Math.round(-snapped / state.spokeAngle), state.problems.length);
  if (!state.isAnimating) {
    state.isAnimating = true;
    requestAnimationFrame(animateSnap);
  }
}

// Dwell detection
function startDwell() {
  cancelDwell();
  state.dwellTimer = window.setTimeout(() => {
    if (!state.takeoverActive) {
      triggerTakeover();
    }
  }, 1500);
}

function cancelDwell() {
  if (state.dwellTimer !== null) {
    clearTimeout(state.dwellTimer);
    state.dwellTimer = null;
  }
}

function triggerTakeover() {
  const problem = state.problems[state.activeIndex];
  state.takeoverActive = true;
  wheelEl.classList.add('dimmed');
  document.dispatchEvent(new CustomEvent('takeover', { detail: problem }));
}

function dismissTakeover() {
  if (!state.takeoverActive) return;
  state.takeoverActive = false;
  wheelEl.classList.remove('dimmed');
  document.dispatchEvent(new CustomEvent('takeover-dismiss'));
}

// Scroll handler
let scrollTimeout: number | null = null;

wheelEl.closest('.wheel-zone')!.addEventListener('wheel', (e: WheelEvent) => {
  e.preventDefault();

  // If takeover is active, dismiss it first
  if (state.takeoverActive) {
    dismissTakeover();
    return;
  }

  cancelDwell();

  // deltaY: positive = scroll down = rotate clockwise (next problem)
  state.rotation -= e.deltaY * 0.15;
  render();

  // Debounce snap
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = window.setTimeout(() => snapToNearest(), 150);
}, { passive: false });

// Also listen on the whole viewport so scrolling anywhere rotates the wheel
document.addEventListener('wheel', (e: WheelEvent) => {
  // Only if not inside takeover-zone content
  if ((e.target as HTMLElement).closest('.takeover-content.active')) return;
  e.preventDefault();

  if (state.takeoverActive) {
    dismissTakeover();
    return;
  }

  cancelDwell();
  state.rotation -= e.deltaY * 0.15;
  render();

  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = window.setTimeout(() => snapToNearest(), 150);
}, { passive: false });

// Initial render + start first dwell
render();
startDwell();
```

**Step 2: Import the script in Wheel.astro**

Add at the bottom of `src/components/Wheel.astro`:
```astro
<script>
  import '../scripts/wheel';
</script>
```

**Step 3: Add dimmed state to wheel.css**

Append to `src/styles/wheel.css`:
```css
.wheel.dimmed .spoke {
  opacity: 0.2;
  transition: opacity 400ms ease;
}
.wheel.dimmed .spoke.active {
  opacity: 0.5;
}
```

**Step 4: Verify interactively**

```bash
npm run dev
```

- Scroll anywhere on the page → wheel should rotate
- Spokes should snap to the center detent when scrolling stops
- After 1.5s dwell, a `takeover` custom event should fire (check console with `document.addEventListener('takeover', e => console.log(e.detail))`)
- Scrolling after takeover should fire `takeover-dismiss`

**Step 5: Commit**

```bash
git add src/
git commit -m "feat: add wheel scroll rotation, snap-to-detent, and dwell detection"
```

---

### Task 5: Takeover Component and Transitions

**Files:**
- Create: `src/components/Takeover.astro`
- Create: `src/pages/problems/[slug].astro` (dynamic route)
- Create: `src/problems/preflight-pdfs.astro` (first example problem)
- Modify: `src/pages/index.astro`

**Step 1: Create the Takeover component**

`src/components/Takeover.astro`:
```astro
<div class="takeover-zone" id="takeover-zone">
  <div class="default-content" id="default-content">
    <h1>delphitools</h1>
    <p>things I've built to solve problems</p>
  </div>
  <div class="takeover-content" id="takeover-content"></div>
</div>

<script>
  const zone = document.getElementById('takeover-zone')!;
  const defaultContent = document.getElementById('default-content')!;
  const takeoverContent = document.getElementById('takeover-content')!;

  document.addEventListener('takeover', async (e: Event) => {
    const { slug, colors } = (e as CustomEvent).detail;

    // Transition background
    document.body.style.setProperty('--bg-color', colors.bg);
    document.body.style.setProperty('--text-color', colors.text);
    document.body.style.setProperty('--accent-color', colors.accent);

    // Fetch problem detail page
    try {
      const res = await fetch(`/problems/${slug}/`);
      const html = await res.text();
      // Extract just the body content from the fetched page
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const content = doc.querySelector('.problem-detail');
      if (content) {
        takeoverContent.innerHTML = content.outerHTML;
      }
    } catch (err) {
      takeoverContent.innerHTML = `<p>Could not load details for ${slug}</p>`;
    }

    // Animate in
    defaultContent.classList.add('hidden');
    takeoverContent.classList.add('active');
  });

  document.addEventListener('takeover-dismiss', () => {
    // Reset background
    document.body.style.setProperty('--bg-color', '#1a1a2e');
    document.body.style.setProperty('--text-color', '#e0e0e0');
    document.body.style.removeProperty('--accent-color');

    // Animate out
    takeoverContent.classList.remove('active');
    defaultContent.classList.remove('hidden');
    takeoverContent.innerHTML = '';
  });
</script>

<style>
  .takeover-zone {
    width: 60%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .default-content {
    text-align: center;
    transition: opacity 400ms ease;
  }
  .default-content.hidden {
    opacity: 0;
    pointer-events: none;
  }
  .takeover-content {
    position: absolute;
    inset: 0;
    opacity: 0;
    padding: 2rem;
    overflow-y: auto;
    transition: opacity 400ms ease;
    pointer-events: none;
  }
  .takeover-content.active {
    opacity: 1;
    pointer-events: auto;
  }
</style>
```

**Step 2: Create the dynamic problem detail route**

`src/pages/problems/[slug].astro`:
```astro
---
import { problems } from '../../data/problems';

export function getStaticPaths() {
  return problems.map(p => ({ params: { slug: p.slug } }));
}

const { slug } = Astro.params;
const problem = problems.find(p => p.slug === slug)!;

// Try to load problem-specific content
let ProblemContent: any = null;
const allProblems = import.meta.glob('../../problems/*.astro', { eager: true });
const key = Object.keys(allProblems).find(k => k.includes(`/${slug}.astro`));
if (key) {
  ProblemContent = (allProblems[key] as any).default;
}
---

<div class="problem-detail" data-project={problem.project} style={`--accent: ${problem.colors.accent};`}>
  {ProblemContent ? <ProblemContent /> : (
    <div class="problem-placeholder">
      <h2>{problem.label}</h2>
      <p>Part of <strong>{problem.project}</strong></p>
    </div>
  )}
</div>

<style>
  .problem-detail {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .problem-placeholder {
    text-align: center;
  }
  .problem-placeholder h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
</style>
```

**Step 3: Create the first example problem**

`src/problems/preflight-pdfs.astro`:
```astro
<div class="preflight-pdfs">
  <h2>Taxiway</h2>
  <p class="subtitle">Native PDF preflight for macOS</p>
  <p class="description">
    I got tired of paying for Adobe Acrobat just to check if a PDF was
    print-ready. Taxiway parses PDFs directly and runs 35+ checks against
    configurable profiles — fonts, images, color spaces, bleed, marks —
    all without Adobe.
  </p>
  <a href="/projects/taxiway/" class="project-link">View project →</a>
</div>

<style>
  .preflight-pdfs {
    text-align: left;
    max-width: 480px;
  }
  h2 {
    font-size: 2.5rem;
    color: var(--accent, #d4a843);
    margin-bottom: 0.5rem;
  }
  .subtitle {
    font-size: 1.1rem;
    opacity: 0.7;
    margin-bottom: 1.5rem;
  }
  .description {
    line-height: 1.6;
    margin-bottom: 2rem;
  }
  .project-link {
    color: var(--accent, #d4a843);
    text-decoration: none;
    font-weight: 600;
    border-bottom: 2px solid transparent;
    transition: border-color 200ms;
  }
  .project-link:hover {
    border-bottom-color: currentColor;
  }
</style>
```

**Step 4: Update index.astro to use the Takeover component**

Replace the takeover-zone div in `src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import Wheel from '../components/Wheel.astro';
import Takeover from '../components/Takeover.astro';
import { problems } from '../data/problems';
---
<Base title="delphitools">
  <main class="viewport">
    <div class="wheel-zone">
      <Wheel problems={problems} />
    </div>
    <Takeover />
  </main>
</Base>

<style>
  .viewport {
    display: flex;
    height: 100vh;
    width: 100vw;
  }
  .wheel-zone {
    width: 40%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
</style>
```

**Step 5: Verify the full flow**

```bash
npm run dev
```

- Page loads with wheel + default "delphitools" title
- Scroll to rotate the wheel
- Stop on "I need to preflight PDFs without Adobe"
- After 1.5s: background transitions to Taxiway's dark blue + amber, takeover content slides in
- Scroll again: takeover dismisses, background resets

**Step 6: Commit**

```bash
git add src/
git commit -m "feat: add takeover component, dynamic problem routes, and first example problem"
```

---

### Task 6: Remaining Starter Problem Pages

**Files:**
- Create: `src/problems/pixel-art-ipad.astro`
- Create: `src/problems/rpn-calculator.astro`
- Create: `src/problems/adfree-youtube.astro`
- Create: `src/problems/train-departures.astro`

**Step 1: Create each problem file**

Each file follows the same pattern as `preflight-pdfs.astro` — a wrapper div, heading with project name, subtitle, description paragraph, and project link. Use the problem's accent color via `var(--accent)`. Keep descriptions to 2–3 sentences each.

Content for each:

`pixel-art-ipad.astro` — Cassini. Minimal pixel art editor for iPad with Apple Pencil. No layers, no menus, just draw.

`rpn-calculator.astro` — PocketPIGS. HP RPN calculator replica for iPhone. Full stack operations, same keypad layout as the hardware.

`adfree-youtube.astro` — Envy. Ad-free YouTube client for Apple TV via Piped API. Browse, search, subscribe, play — no ads, no tracking.

`train-departures.astro` — Siding. Live train departure board on your phone. Real-time data, clean display.

**Step 2: Verify each takeover loads**

```bash
npm run dev
```

Scroll through all 5 problems. Each should trigger its own background color transition and show its content.

**Step 3: Commit**

```bash
git add src/problems/
git commit -m "feat: add 4 more starter problem pages"
```

---

### Task 7: Mobile Layout

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`
- Modify: `src/components/Wheel.astro`
- Modify: `src/components/Takeover.astro`
- Modify: `src/scripts/wheel.ts`

**Step 1: Add mobile styles to global.css**

Append media query:
```css
@media (max-width: 768px) {
  body {
    overflow-y: auto;
    overflow-x: hidden;
  }
}
```

**Step 2: Add mobile styles to index.astro**

Add responsive override:
```css
@media (max-width: 768px) {
  .viewport {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }
  .wheel-zone {
    width: 100%;
    height: 100vh;
  }
}
```

**Step 3: Create mobile problem list in Wheel.astro**

Add a separate mobile-only list alongside the wheel. The wheel itself gets `display: none` on mobile:
```astro
<!-- Mobile list -->
<div class="mobile-list" id="mobile-list">
  {problems.map((p, i) => (
    <div class="mobile-item" data-slug={p.slug} data-index={i}>
      {p.label}
    </div>
  ))}
</div>
```

CSS:
```css
.mobile-list {
  display: none;
}

@media (max-width: 768px) {
  .wheel { display: none; }
  .mobile-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    padding: 40vh 1rem;
  }
  .mobile-item {
    scroll-snap-align: center;
    padding: 2rem;
    font-size: 1.2rem;
    font-weight: 600;
    text-align: center;
    opacity: 0.4;
    transition: opacity 200ms, transform 200ms;
    cursor: pointer;
    min-height: 4rem;
    display: flex;
    align-items: center;
  }
}
```

**Step 4: Add mobile interaction to wheel.ts**

Add an IntersectionObserver for mobile items that highlights the centered one. Add tap handler that triggers takeover:
```typescript
// Mobile handling
const mobileList = document.getElementById('mobile-list');
if (mobileList && window.innerWidth <= 768) {
  const items = mobileList.querySelectorAll<HTMLElement>('.mobile-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        items.forEach(item => item.classList.remove('centered'));
        entry.target.classList.add('centered');
      }
    });
  }, { root: mobileList, rootMargin: '-45% 0px -45% 0px', threshold: 0.5 });

  items.forEach(item => {
    observer.observe(item);
    item.addEventListener('click', () => {
      const idx = Number(item.dataset.index);
      const problem = state.problems[idx];
      document.dispatchEvent(new CustomEvent('takeover', { detail: problem }));
    });
  });
}
```

**Step 5: Make Takeover full-screen on mobile**

Add to Takeover.astro styles:
```css
@media (max-width: 768px) {
  .takeover-zone {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    display: none;
  }
  .takeover-zone.mobile-active {
    display: flex;
  }
  .takeover-content {
    position: relative;
    inset: auto;
    width: 100%;
    height: 100%;
  }
}
```

Add a back button and the `mobile-active` class toggle to the Takeover script.

**Step 6: Test on mobile viewport**

Use browser devtools responsive mode at 375px width. Verify:
- Vertical list with scroll-snap
- Center item highlighted
- Tap triggers full-screen takeover
- Back gesture/button returns to list

**Step 7: Commit**

```bash
git add src/
git commit -m "feat: add mobile layout with vertical list and full-screen takeover"
```

---

### Task 8: Bring In Existing Project Pages

**Files:**
- Create: `public/projects/taxiway/index.html` (copy from `/Users/ruby/GitRepos/Taxiway/Taxiway.html`)
- Create: `public/projects/cassini/index.html` (copy from `/Users/ruby/GitRepos/Cassini/CASSINI.html`)

**Step 1: Create the public/projects directory**

```bash
mkdir -p public/projects/taxiway public/projects/cassini
```

**Step 2: Copy existing project pages**

```bash
cp /Users/ruby/GitRepos/Taxiway/Taxiway.html public/projects/taxiway/index.html
cp /Users/ruby/GitRepos/Cassini/CASSINI.html public/projects/cassini/index.html
```

**Step 3: Verify links work**

```bash
npm run dev
```

Trigger the Taxiway takeover, click "View project →". Should navigate to the full Taxiway showcase page.

**Step 4: Commit**

```bash
git add public/
git commit -m "feat: add existing Taxiway and Cassini project pages"
```

---

### Task 9: Polish and Visual Refinement

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/styles/wheel.css`
- Modify: various component files

**Step 1: Typography**

Choose and apply a web font. Add a Google Fonts import for a bold sans-serif (e.g., Inter or Space Grotesk) in `Base.astro`'s `<head>`. Apply to body.

**Step 2: Wheel visual polish**

- Add a subtle radial line or arc behind the spokes to suggest the wheel shape
- Style the active spoke with the accent color underline or glow
- Smooth the spoke text with `will-change: transform` for GPU acceleration

**Step 3: Transition polish**

- Add subtle background pattern (CSS-only, e.g., radial gradients or repeating patterns) that changes per-project
- Tune transition timing curves
- Add a subtle slide-in animation for takeover content (translate from right)

**Step 4: Default state styling**

Style the "delphitools / things I've built" default content — large bold type, centered.

**Step 5: Test full flow end-to-end**

```bash
npm run build && npx serve dist
```

Verify the built output works statically without the dev server.

**Step 6: Commit**

```bash
git add src/ public/
git commit -m "feat: visual polish — typography, wheel styling, transitions"
```

---

### Task 10: Final Build Verification

**Step 1: Full build**

```bash
npm run build
```

Verify no errors.

**Step 2: Test static output**

```bash
npx serve dist
```

Walk through the full flow: wheel rotation, snap, dwell, takeover for each problem, mobile viewport, project page links.

**Step 3: Commit any final fixes**

```bash
git add -A
git commit -m "chore: final build verification and fixes"
```
