const W = 1280;
const H = 720;
// Top of the lightning down conductor on the factory's left corner.
const SEED = { x: 152, y: 254 };
const BRIDGE = 3;
const HEAD = 36;
const PULSE_GAP = 260;
const PULSE_WIDTH = 46;
const PULSE_SPEED = 150;

type CopperField = {
  index: Uint32Array;
  dist: Float32Array;
  rgb: Uint8Array;
  maxDist: number;
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const remap = (value: number, inMin: number, inMax: number) =>
  clamp((value - inMin) / Math.max(0.0001, inMax - inMin));

const isSoft = (r: number, g: number, b: number) => r > 55 && r - g > 32 && r > b * 1.6;
const isCore = (r: number, g: number, b: number) => r > 120 && r - g > 50 && r > b * 1.8;

// Geodesic distance along the copper pixels of the plate, so light travels the drawn routes.
const buildField = (image: HTMLImageElement): CopperField => {
  const scratch = document.createElement("canvas");

  scratch.width = W;
  scratch.height = H;
  const context = scratch.getContext("2d", { willReadFrequently: true })!;

  context.drawImage(image, 0, 0, W, H);
  const data = context.getImageData(0, 0, W, H).data;
  const size = W * H;
  const soft = new Uint8Array(size);
  const graph = new Uint8Array(size);

  for (let i = 0; i < size; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];

    if (isSoft(r, g, b)) soft[i] = graph[i] = 1;
    if (!isCore(r, g, b)) continue;
    const x = i % W;
    const y = (i / W) | 0;

    // Occluders cut the routes into fragments; a small dilation bridges them.
    for (let dy = -BRIDGE; dy <= BRIDGE; dy++) {
      const ny = y + dy;

      if (ny < 0 || ny >= H) continue;
      for (let dx = -BRIDGE; dx <= BRIDGE; dx++) {
        const nx = x + dx;

        if (nx >= 0 && nx < W) graph[ny * W + nx] = 1;
      }
    }
  }

  const dist = new Float32Array(size).fill(Infinity);
  const queue = new Int32Array(size);
  const flood = (start: number, base: number) => {
    let head = 0;
    let tail = 0;

    dist[start] = base;
    queue[tail++] = start;
    while (head < tail) {
      const p = queue[head++];
      const x = p % W;
      const y = (p / W) | 0;
      const d = dist[p];

      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;

        if (ny < 0 || ny >= H) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;

          if (nx < 0 || nx >= W) continue;
          const n = ny * W + nx;
          const step = dx && dy ? Math.SQRT2 : 1;

          if (!graph[n] || dist[n] <= d + step) continue;
          dist[n] = d + step;
          queue[tail++] = n;
        }
      }
    }
  };
  const nearestGraph = (x: number, y: number) => {
    let best = -1;
    let bestDistance = Infinity;

    for (let i = 0; i < size; i++) {
      if (!graph[i]) continue;
      const d = Math.hypot((i % W) - x, ((i / W) | 0) - y);

      if (d < bestDistance) {
        bestDistance = d;
        best = i;
      }
    }
    return best;
  };

  const seed = nearestGraph(SEED.x, SEED.y);

  if (seed < 0) throw new Error("No copper pixels found");
  flood(seed, 0);

  const graphList: number[] = [];

  for (let i = 0; i < size; i++) if (graph[i]) graphList.push(i);
  const seen = new Int32Array(size);

  // Remaining islands start where they come closest to an already lit route.
  for (let guard = 1; guard <= 400; guard++) {
    const reached: number[] = [];
    let pending = -1;

    for (let k = 0; k < graphList.length; k++) {
      const i = graphList[k];

      if (dist[i] < Infinity) {
        if (k % 5 === 0) reached.push(i);
      } else if (pending < 0) {
        pending = i;
      }
    }
    if (pending < 0) break;

    const island: number[] = [pending];
    let head = 0;

    seen[pending] = guard;
    while (head < island.length) {
      const p = island[head++];
      const x = p % W;
      const y = (p / W) | 0;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;

          if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          const n = ny * W + nx;

          if (graph[n] && seen[n] !== guard && dist[n] === Infinity) {
            seen[n] = guard;
            island.push(n);
          }
        }
      }
    }

    let start = pending;
    let base = Infinity;

    for (let k = 0; k < island.length; k += 3) {
      const p = island[k];
      const px = p % W;
      const py = (p / W) | 0;

      for (const q of reached) {
        const d = dist[q] + Math.hypot((q % W) - px, ((q / W) | 0) - py);

        if (d < base) {
          base = d;
          start = p;
        }
      }
    }
    flood(start, Number.isFinite(base) ? base : 0);
  }

  const picks: number[] = [];
  let maxDist = 0;

  for (let i = 0; i < size; i++) {
    if (!soft[i] || dist[i] === Infinity) continue;
    picks.push(i);
    if (dist[i] > maxDist) maxDist = dist[i];
  }
  const index = new Uint32Array(picks);
  const fieldDist = new Float32Array(picks.length);
  const rgb = new Uint8Array(picks.length * 3);

  picks.forEach((p, k) => {
    fieldDist[k] = dist[p];
    rgb[k * 3] = data[p * 4];
    rgb[k * 3 + 1] = data[p * 4 + 1];
    rgb[k * 3 + 2] = data[p * 4 + 2];
  });

  return { index, dist: fieldDist, rgb, maxDist };
};

class GroundingFlow extends HTMLElement {
  private cleanup?: () => void;

  connectedCallback() {
    this.cleanup?.();
    const copperImage = this.querySelector<HTMLImageElement>("img.scene-copper")!;
    const canvas = this.querySelector<HTMLCanvasElement>(".copper-canvas")!;
    const button = this.querySelector<HTMLButtonElement>(".playback")!;
    const section = this.closest<HTMLElement>("section.grounding-experience")!;
    const track = section.querySelector<HTMLElement>(".grounding-track")!;
    const context = canvas.getContext("2d")!;
    const frameData = context.createImageData(W, H);
    const pixels = new Uint32Array(frameData.data.buffer);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const events = new AbortController();
    const { signal } = events;
    let field: CopperField | undefined;
    let visible = false;
    let paused = false;
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    let progress = 0;
    let copperDraw = 0;
    let ticking = false;

    const setVar = (name: string, value: number) => section.style.setProperty(name, String(value));

    const flowing = () =>
      !!field && visible && !paused && !reduced.matches && !document.hidden && progress > 0.8;

    const draw = () => {
      if (!field) return;
      const { index, dist, rgb, maxDist } = field;
      const front = copperDraw * (maxDist + HEAD);
      const pulseGate = flowing() ? remap(progress, 0.8, 0.88) : 0;
      const offset = elapsed * PULSE_SPEED;

      for (let k = 0; k < index.length; k++) {
        const d = dist[k];

        if (d > front) {
          pixels[index[k]] = 0;
          continue;
        }
        const head = front - d < HEAD && copperDraw < 1 ? 1 - (front - d) / HEAD : 0;
        let boost = head * 0.85;

        if (pulseGate) {
          const phase = (((d - offset) % PULSE_GAP) + PULSE_GAP) % PULSE_GAP;

          if (phase < PULSE_WIDTH)
            boost = Math.max(boost, Math.sin((phase / PULSE_WIDTH) * Math.PI) * 0.75 * pulseGate);
        }
        const r = rgb[k * 3];
        const g = rgb[k * 3 + 1];
        const b = rgb[k * 3 + 2];
        const nr = r + (255 - r) * boost;
        const ng = g + (236 - g) * boost;
        const nb = b + (200 - b) * boost;

        pixels[index[k]] = (255 << 24) | ((nb | 0) << 16) | ((ng | 0) << 8) | (nr | 0);
      }
      context.putImageData(frameData, 0, 0);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
    };

    const tick = (now: number) => {
      frame = 0;
      if (!flowing()) return;
      if (previous) elapsed += Math.min((now - previous) / 1000, 0.1);
      previous = now;
      draw();
      frame = requestAnimationFrame(tick);
    };

    const sync = () => {
      stop();
      button.hidden = !field || reduced.matches || progress < 0.8;
      button.setAttribute("aria-pressed", String(paused));
      button.setAttribute("aria-label", paused ? "播放動畫" : "暫停動畫");
      if (flowing()) frame = requestAnimationFrame(tick);
    };

    const apply = (value: number) => {
      progress = value;
      // 0–0.18 structures, 0.18–0.40 power lines, 0.40–0.46 copper base, 0.46–0.80 copper routes light up, 0.82–0.95 annotations
      copperDraw = remap(value, 0.46, 0.8);
      setVar("--structures-opacity", remap(value, 0, 0.18));
      setVar("--power-draw", remap(value, 0.18, 0.4));
      setVar("--copper-base", remap(value, 0.4, 0.46));
      setVar("--copper-gray", field ? 1 : 1 - copperDraw);
      setVar("--anno-progress", remap(value, 0.82, 0.95));
      draw();
      sync();
    };

    const measure = () => {
      if (reduced.matches) {
        apply(1);
        return;
      }
      const rect = track.getBoundingClientRect();

      apply(clamp(-rect.top / Math.max(1, rect.height - window.innerHeight)));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        measure();
      });
    };

    const initialize = () => {
      if (field || signal.aborted || !copperImage.naturalWidth) return;
      try {
        field = buildField(copperImage);
        this.dataset.ready = "true";
      } catch {
        field = undefined;
      }
      measure();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          if (copperImage.complete) initialize();
          measure();
        } else {
          sync();
        }
      },
      { rootMargin: "200px 0px" }
    );

    copperImage.addEventListener("load", () => visible && initialize(), { signal });
    button.addEventListener(
      "click",
      () => {
        paused = !paused;
        sync();
      },
      { signal }
    );
    reduced.addEventListener("change", measure, { signal });
    document.addEventListener("visibilitychange", sync, { signal });
    window.addEventListener("scroll", onScroll, { passive: true, signal });
    window.addEventListener("resize", onScroll, { passive: true, signal });
    observer.observe(track);
    measure();

    this.cleanup = () => {
      events.abort();
      stop();
      observer.disconnect();
      field = undefined;
      delete this.dataset.ready;
      for (const name of [
        "--structures-opacity",
        "--power-draw",
        "--copper-base",
        "--copper-gray",
        "--anno-progress",
      ]) {
        section.style.removeProperty(name);
      }
    };
  }

  disconnectedCallback() {
    this.cleanup?.();
    this.cleanup = undefined;
  }
}

if (!customElements.get("grounding-flow")) {
  customElements.define("grounding-flow", GroundingFlow);
}
