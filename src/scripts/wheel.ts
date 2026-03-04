interface Problem {
  slug: string;
  label: string;
  project: string;
  colors: { bg: string; text: string; accent: string };
}

const wheelEl = document.getElementById('wheel')!;
const dataset = wheelEl.dataset;

const allProblems: Problem[] = JSON.parse(dataset.problems!);
// Keep bespoke first, shuffle the rest
const [first, ...rest] = allProblems;
for (let i = rest.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [rest[i], rest[j]] = [rest[j], rest[i]];
}
const problems: Problem[] = [first, ...rest];
const spokeAngle = Number(dataset.spokeAngle);
const visibleSpokes = Number(dataset.visibleSpokes);
const radius = Number(dataset.radius);
const halfVisible = Math.floor(visibleSpokes / 2);
const spokes = wheelEl.querySelectorAll<HTMLElement>('.spoke');

// State
let rotation = 0;
let velocity = 0;
let targetSnap: number | null = null;
let dwellTimer: number | null = null;
let takeoverActive = false;
let animating = false;

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

// Each spoke DOM element tracks its own "virtual slot" in the infinite list.
// Labels only change when a spoke recycles (wraps from one end to the other).
const spokeSlot: number[] = [];
for (let i = 0; i < visibleSpokes; i++) {
  spokeSlot[i] = i - halfVisible; // -8, -7, ..., 0, ..., 7, 8
}

function problemForSlot(slot: number): Problem {
  return problems[mod(slot, problems.length)];
}

// Set initial labels
spokes.forEach((spoke, i) => {
  spoke.textContent = problemForSlot(spokeSlot[i]).label;
});

// The fractional "center" of the wheel — which virtual slot is at 0°
function virtualCenter(): number {
  return -rotation / spokeAngle;
}

// Which problem is currently at center (for takeover)
function activeProblem(): Problem {
  return problemForSlot(Math.round(virtualCenter()));
}

function render() {
  const vc = virtualCenter();

  spokes.forEach((spoke, i) => {
    const slot = spokeSlot[i];

    // Position: the spoke's angle is determined by its slot and the current rotation
    const angle = slot * spokeAngle + rotation;
    const halfHeight = spoke.offsetHeight / 2;
    spoke.style.transform = `rotate(${angle}deg) translateX(${radius}px) translateY(-${halfHeight}px)`;

    // Recycle: if this spoke drifted too far from the visible window, wrap it
    const dist = slot - vc;
    if (dist > halfVisible + 1) {
      spokeSlot[i] -= visibleSpokes;
      spoke.textContent = problemForSlot(spokeSlot[i]).label;
    } else if (dist < -(halfVisible + 1)) {
      spokeSlot[i] += visibleSpokes;
      spoke.textContent = problemForSlot(spokeSlot[i]).label;
    }

    // Highlight: the spoke whose slot is nearest to the rounded center
    const nearestCenter = Math.round(vc);
    spoke.classList.toggle('active', slot === nearestCenter);
  });
}

function tick() {
  if (targetSnap !== null) {
    const diff = targetSnap - rotation;
    if (Math.abs(diff) < 0.3) {
      rotation = targetSnap;
      targetSnap = null;
      velocity = 0;
      render();
      startDwell();
      animating = false;
      return;
    }
    rotation += diff * 0.12;
  } else if (Math.abs(velocity) > 0.01) {
    rotation += velocity;
    velocity *= 0.92;

    if (Math.abs(velocity) < 0.3) {
      snapToNearest();
    }
  } else {
    animating = false;
    return;
  }

  render();
  requestAnimationFrame(tick);
}

function ensureAnimating() {
  if (!animating) {
    animating = true;
    requestAnimationFrame(tick);
  }
}

function snapToNearest() {
  const snapped = Math.round(rotation / spokeAngle) * spokeAngle;
  targetSnap = snapped;
  velocity = 0;
  ensureAnimating();
}

function snapToSlot(slot: number) {
  if (takeoverActive) dismissTakeover();
  cancelDwell();
  targetSnap = -slot * spokeAngle;
  velocity = 0;
  ensureAnimating();
}

// Dwell
function startDwell() {
  cancelDwell();
  dwellTimer = window.setTimeout(() => {
    if (!takeoverActive) {
      triggerTakeover();
    }
  }, 500);
}

function cancelDwell() {
  if (dwellTimer !== null) {
    clearTimeout(dwellTimer);
    dwellTimer = null;
  }
}

function triggerTakeover() {
  const problem = activeProblem();
  takeoverActive = true;
  wheelEl.classList.add('dimmed');
  document.dispatchEvent(new CustomEvent('takeover', { detail: problem }));
}

function dismissTakeover() {
  if (!takeoverActive) return;
  takeoverActive = false;
  wheelEl.classList.remove('dimmed');
  document.dispatchEvent(new CustomEvent('takeover-dismiss'));
}

const isMobile = window.matchMedia('(max-width: 768px)').matches;

if (!isMobile) {
  // Scroll input (desktop / trackpad)
  let lastScrollTime = 0;

  document.addEventListener('wheel', (e: WheelEvent) => {
    if ((e.target as HTMLElement).closest('.takeover-content.active')) return;
    e.preventDefault();

    if (takeoverActive) dismissTakeover();

    cancelDwell();
    targetSnap = null;

    const now = performance.now();
    const dt = now - lastScrollTime;
    lastScrollTime = now;

    const delta = -e.deltaY * 0.08;

    if (dt < 50) {
      velocity = velocity * 0.5 + delta * 0.5;
    } else {
      velocity = delta;
    }

    ensureAnimating();
  }, { passive: false });

  // Snap fallback when scrolling stops
  let scrollEndTimer: number | null = null;
  document.addEventListener('wheel', () => {
    if (scrollEndTimer) clearTimeout(scrollEndTimer);
    scrollEndTimer = window.setTimeout(() => {
      if (targetSnap === null && !takeoverActive) {
        snapToNearest();
      }
    }, 200);
  }, { passive: true });

  // Touch / pointer drag input
  let dragging = false;
  let lastPointerY = 0;
  let lastPointerTime = 0;
  let dragVelocity = 0;

  document.addEventListener('pointerdown', (e: PointerEvent) => {
    if ((e.target as HTMLElement).closest('.takeover-content.active')) return;
    if (e.pointerType === 'mouse') return; // mouse uses scroll wheel instead

    if (takeoverActive) dismissTakeover();

    dragging = true;
    lastPointerY = e.clientY;
    lastPointerTime = performance.now();
    dragVelocity = 0;

    cancelDwell();
    targetSnap = null;
    velocity = 0;
  });

  document.addEventListener('pointermove', (e: PointerEvent) => {
    if (!dragging) return;
    e.preventDefault();

    const now = performance.now();
    const dt = now - lastPointerTime;
    const dy = e.clientY - lastPointerY;
    const delta = dy * 0.15; // convert pixels to degrees

    rotation += delta;

    if (dt > 0 && dt < 100) {
      dragVelocity = dragVelocity * 0.4 + (delta / Math.max(dt, 8)) * 16 * 0.6;
    }

    lastPointerY = e.clientY;
    lastPointerTime = now;

    render();
  }, { passive: false });

  function endDrag() {
    if (!dragging) return;
    dragging = false;

    velocity = dragVelocity;
    if (Math.abs(velocity) < 0.3) {
      snapToNearest();
    } else {
      ensureAnimating();
    }
  }

  document.addEventListener('pointerup', endDrag);
  document.addEventListener('pointercancel', endDrag);

  // Prevent iOS Safari pull-to-refresh / overscroll during drag
  document.addEventListener('touchmove', (e: TouchEvent) => {
    if (dragging) e.preventDefault();
  }, { passive: false });

  // Click on a spoke to scroll it to center
  spokes.forEach((spoke, i) => {
    spoke.style.cursor = 'pointer';
    spoke.addEventListener('click', () => {
      snapToSlot(spokeSlot[i]);
    });
  });

  // Arrow keys
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (takeoverActive) dismissTakeover();
      cancelDwell();
      const currentSlot = Math.round(virtualCenter());
      const nextSlot = e.key === 'ArrowUp' ? currentSlot + 1 : currentSlot - 1;
      snapToSlot(nextSlot);
    }
  });

  // Initial render + start first dwell
  render();
  startDwell();
}

// Mobile handling
const mobileList = document.getElementById('mobile-list');
if (mobileList && window.matchMedia('(max-width: 768px)').matches) {
  const mobileDetail = document.getElementById('mobile-detail')!;
  const mobileDetailContent = document.getElementById('mobile-detail-content')!;
  const mobileDetailBack = document.getElementById('mobile-detail-back')!;
  const contentCache = new Map<string, string>();

  // Shuffle mobile items (keep first in place)
  const allItems = Array.from(mobileList.querySelectorAll<HTMLElement>('.mobile-item'));
  const [firstItem, ...restItems] = allItems;
  for (let i = restItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [restItems[i], restItems[j]] = [restItems[j], restItems[i]];
  }
  [firstItem, ...restItems].forEach(item => mobileList.appendChild(item));

  async function openDetail(slug: string, colors: { bg: string; text: string; accent: string }) {
    document.body.style.setProperty('--bg-color', colors.bg);
    document.body.style.setProperty('--text-color', colors.text);
    document.body.style.setProperty('--accent-color', colors.accent);
    document.querySelectorAll('style[data-takeover]').forEach(s => s.remove());
    document.querySelectorAll('script[data-takeover]').forEach(s => s.remove());

    if (!contentCache.has(slug)) {
      try {
        const res = await fetch(`/problems/${slug}/`);
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const detail = doc.querySelector('.problem-detail');
        contentCache.set(slug, detail ? detail.outerHTML : `<p>${slug}</p>`);
        const styles: string[] = [];
        doc.querySelectorAll('style').forEach(style => styles.push(style.textContent || ''));
        contentCache.set(slug + '__styles', styles.join('\n'));
        const scripts: string[] = [];
        doc.querySelectorAll('script').forEach(script => {
          if (script.textContent) scripts.push(script.textContent);
        });
        contentCache.set(slug + '__scripts', scripts.join('\n'));
      } catch {
        contentCache.set(slug, `<p>Could not load ${slug}</p>`);
        contentCache.set(slug + '__styles', '');
        contentCache.set(slug + '__scripts', '');
      }
    }

    mobileDetailContent.innerHTML = contentCache.get(slug)!;

    const styleText = contentCache.get(slug + '__styles');
    if (styleText) {
      const s = document.createElement('style');
      s.textContent = styleText;
      s.setAttribute('data-takeover', slug);
      document.head.appendChild(s);
    }
    const scriptText = contentCache.get(slug + '__scripts');
    if (scriptText) {
      const s = document.createElement('script');
      s.textContent = scriptText;
      s.setAttribute('data-takeover', slug);
      document.body.appendChild(s);
    }

    mobileDetail.classList.add('open');
  }

  function closeDetail() {
    mobileDetail.classList.remove('open');
    document.body.style.setProperty('--bg-color', '#1a1a2e');
    document.body.style.setProperty('--text-color', '#e0e0e0');
    document.body.style.removeProperty('--accent-color');
    document.querySelectorAll('style[data-takeover]').forEach(s => s.remove());
    document.querySelectorAll('script[data-takeover]').forEach(s => s.remove());
    mobileDetailContent.innerHTML = '';
  }

  allItems.forEach(item => {
    item.addEventListener('click', () => {
      const slug = item.dataset.slug!;
      const colors = JSON.parse(item.dataset.colors!);
      openDetail(slug, colors);
    });
  });

  mobileDetailBack.addEventListener('click', closeDetail);
}
