const GLYPHS = " .,:;+=*#%@";
const PALETTE = ["#8aabb3", "#dce9e9", "#168c90", "#25a7a7", "#c78440", "#efad61", "#fff0bd"];
// Hand-traced on the concept image, in image-relative coordinates. Visual paths only.
const PATHS = [
  [
    [0.09, 0.39],
    [0.09, 0.55],
    [0.14, 0.63],
    [0.2, 0.7],
    [0.28, 0.67],
    [0.38, 0.64],
    [0.38, 0.43],
  ],
  [
    [0.04, 0.6],
    [0.09, 0.57],
    [0.16, 0.66],
    [0.155, 0.75],
  ],
  [
    [0.2, 0.7],
    [0.33, 0.67],
    [0.4, 0.7],
    [0.41, 0.8],
    [0.46, 0.8],
  ],
  [
    [0.52, 0.6],
    [0.61, 0.63],
    [0.68, 0.66],
    [0.73, 0.61],
    [0.79, 0.58],
    [0.88, 0.63],
  ],
  [
    [0.68, 0.66],
    [0.73, 0.63],
    [0.75, 0.72],
  ],
] as const;

type Cell = { x: number; y: number; glyph: number; color: number; seed: number; copper: boolean };
type Wave = { x: number; y: number; time: number };

class GroundingAscii extends HTMLElement {
  private release?: () => void;

  connectedCallback() {
    this.release?.();
    const events = new AbortController();
    const { signal } = events;
    const canvas = this.querySelector("canvas")!;
    const fallback = this.querySelector("img")!;
    const button = this.querySelector("button")!;
    const ctx = canvas.getContext("2d", { alpha: false });
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const compact = matchMedia("(max-width: 760px)");
    const source = new Image();
    const base = document.createElement("canvas");
    const atlas = document.createElement("canvas");
    const baseCtx = base.getContext("2d", { alpha: false });
    const atlasCtx = atlas.getContext("2d");
    let cells: Cell[] = [];
    let dynamic: Cell[] = [];
    let frame = 0;
    let last = 0;
    let time = 0;
    let visible = false;
    let ready = false;
    let loading = false;
    let paused = false;
    let width = 0;
    let height = 0;
    let cellW = 0;
    let cellH = 0;
    let tileW = 0;
    let tileH = 0;
    let pointer: { x: number; y: number } | null = null;
    let waves: Wave[] = [];
    let quality = 1;
    let workMs = 0;
    let workFrames = 0;
    let lastBuildWidth = 0;
    let lastCompact = compact.matches;
    const running = () =>
      ready && visible && !document.hidden && !paused && !reduced.matches && !signal.aborted;
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    };
    const paint = (
      target: CanvasRenderingContext2D,
      cell: Cell,
      glyph = cell.glyph,
      color = cell.color,
      dx = 0,
      dy = 0
    ) => {
      target.drawImage(
        atlas,
        glyph * tileW,
        color * tileH,
        tileW,
        tileH,
        cell.x + dx,
        cell.y + dy,
        cellW,
        cellH
      );
    };
    const pulsePoints = () =>
      PATHS.map((path, i) => {
        const lengths = path
          .slice(1)
          .map((point, j) =>
            Math.hypot((point[0] - path[j][0]) * width, (point[1] - path[j][1]) * height)
          );
        const total = lengths.reduce((sum, length) => sum + length, 0);
        let distance = ((time * 0.1 + i * 0.19) % 1) * total;

        for (let j = 0; j < lengths.length; j++) {
          if (distance <= lengths[j]) {
            const t = distance / lengths[j];

            return {
              x: (path[j][0] + (path[j + 1][0] - path[j][0]) * t) * width,
              y: (path[j][1] + (path[j + 1][1] - path[j][1]) * t) * height,
            };
          }
          distance -= lengths[j];
        }
        return { x: path[0][0] * width, y: path[0][1] * height };
      });
    const draw = (animated: boolean) => {
      if (!ctx || !ready) return;
      ctx.drawImage(base, 0, 0, width, height);
      if (!animated) return;
      const pulses = pulsePoints();

      waves = waves.filter((wave) => time - wave.time < 1.2);
      const active = pointer || waves.length ? cells : dynamic;

      for (const cell of active) {
        let strength = 0;
        let dx = 0;
        let dy = 0;
        let glyph = cell.glyph;

        if (cell.seed % 53 === 0) {
          strength = Math.max(0, Math.sin(time * 1.5 + cell.seed)) * 0.35;
          if (strength > 0.28) glyph = Math.min(GLYPHS.length - 1, glyph + 1);
        }
        if (
          cell.copper &&
          pulses.some((p) => Math.hypot(cell.x - p.x, cell.y - p.y) < Math.max(12, width * 0.022))
        )
          strength = 1;
        if (pointer) {
          const x = cell.x - pointer.x;
          const y = cell.y - pointer.y;
          const distance = Math.hypot(x, y);
          const influence = Math.max(0, 1 - distance / 90);

          dx = (x / Math.max(distance, 1)) * influence * cellW * 0.8;
          dy = (y / Math.max(distance, 1)) * influence * cellH * 0.8;
          strength = Math.max(strength, influence);
        }
        for (const wave of waves) {
          const age = time - wave.time;
          const radius = age * 170;
          const distance = Math.abs(Math.hypot(cell.x - wave.x, cell.y - wave.y) - radius);

          strength = Math.max(strength, Math.max(0, 1 - distance / 20) * (1 - age / 1.2));
        }
        if (strength < 0.08) continue;
        ctx.fillStyle = "#000";
        ctx.fillRect(cell.x, cell.y, cellW, cellH);
        const bright = cell.copper ? 6 : cell.color >= 2 && cell.color <= 3 ? 3 : 1;

        paint(ctx, cell, glyph, strength > 0.4 ? bright : cell.color, dx, dy);
      }
    };
    const tick = (now: number) => {
      frame = 0;
      if (!running()) return;
      const interval = 1000 / (compact.matches ? 24 : 30);

      if (!last || now - last >= interval - 0.5) {
        time += last ? Math.min((now - last) / 1000, 0.1) : 0;
        last = now;
        const start = performance.now();

        draw(true);
        workMs += performance.now() - start;
        workFrames++;
        // Reduce grid density first, then the proportion of ambient animated cells.
        if (workFrames >= 90) {
          if (workMs / workFrames > interval * 0.65 && quality > 0.5) {
            quality *= 0.8;
            rebuild();
          } else if (workMs / workFrames > interval * 0.65)
            dynamic = dynamic.filter((cell) => cell.copper || cell.seed % 106 === 0);
          workFrames = 0;
          workMs = 0;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      stop();
      button.hidden = !ready || reduced.matches;
      button.setAttribute("aria-pressed", String(paused));
      button.setAttribute("aria-label", paused ? "播放動畫" : "暫停動畫");
      if (running()) frame = requestAnimationFrame(tick);
      else draw(false);
    };
    const rebuild = () => {
      if (
        !ctx ||
        !baseCtx ||
        !atlasCtx ||
        !source.complete ||
        !source.naturalWidth ||
        signal.aborted
      )
        return;
      width = this.clientWidth;
      height = this.clientHeight;
      if (!width || !height) return;
      lastBuildWidth = width;
      lastCompact = compact.matches;
      const cap = (compact.matches ? 10000 : 24000) * quality;
      const columns = Math.max(
        20,
        Math.floor(
          Math.min(width / (compact.matches ? 3 : 5), Math.sqrt((cap * width * 1.6) / height))
        )
      );
      const rows = Math.max(1, Math.floor((columns * height) / width / 1.6));

      cellW = width / columns;
      cellH = height / rows;
      const dpr = Math.min(devicePixelRatio || 1, compact.matches ? 1 : 1.5);

      canvas.width = base.width = Math.round(width * dpr);
      canvas.height = base.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      baseCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tileW = Math.ceil(cellW * dpr);
      tileH = Math.ceil(cellH * dpr);
      atlas.width = tileW * GLYPHS.length;
      atlas.height = tileH * PALETTE.length;
      atlasCtx.font = `${Math.round(tileH * 0.92)}px monospace`;
      atlasCtx.textAlign = "center";
      atlasCtx.textBaseline = "middle";
      PALETTE.forEach((color, c) => {
        atlasCtx.fillStyle = color;
        [...GLYPHS].forEach((glyph, g) =>
          atlasCtx.fillText(glyph, (g + 0.5) * tileW, (c + 0.5) * tileH, tileW)
        );
      });
      const sample = document.createElement("canvas");

      sample.width = columns * 2;
      sample.height = rows * 2;
      const sampling = sample.getContext("2d", { willReadFrequently: true });

      if (!sampling) return;
      sampling.imageSmoothingQuality = "high";
      sampling.drawImage(source, 0, 0, sample.width, sample.height);
      const pixels = sampling.getImageData(0, 0, sample.width, sample.height).data;

      cells = [];
      for (let row = 0; row < rows; row++)
        for (let col = 0; col < columns; col++) {
          let r = 0;
          let g = 0;
          let b = 0;

          for (let y = 0; y < 2; y++)
            for (let x = 0; x < 2; x++) {
              const index = ((row * 2 + y) * sample.width + col * 2 + x) * 4;

              r += pixels[index] / 4;
              g += pixels[index + 1] / 4;
              b += pixels[index + 2] / 4;
            }
          const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

          if (luminance < 7) continue;
          const copper = r > g * 1.22 && r > b * 1.45;
          const teal = g > r * 1.2 && b > r * 1.15;
          const color = copper
            ? luminance > 85
              ? 5
              : 4
            : teal
              ? luminance > 65
                ? 3
                : 2
              : luminance > 65
                ? 1
                : 0;

          cells.push({
            x: col * cellW,
            y: row * cellH,
            glyph: Math.max(1, Math.min(9, Math.round(Math.pow(luminance / 255, 0.5) * 15))),
            color,
            seed: (row * 127 + col * 73) >>> 0,
            copper,
          });
        }
      baseCtx.fillStyle = "#000";
      baseCtx.fillRect(0, 0, width, height);
      cells.forEach((cell) => paint(baseCtx, cell));
      dynamic = cells.filter((cell) => cell.copper || cell.seed % 53 === 0);
      ready = true;
      draw(false);
      canvas.hidden = false;
      fallback.hidden = true;
      this.dataset.ready = "true";
      sync();
    };
    const fail = () => {
      ready = false;
      stop();
      canvas.hidden = true;
      fallback.hidden = false;
      button.hidden = true;
      delete this.dataset.ready;
    };
    const buildSafely = () => {
      try {
        rebuild();
      } catch {
        fail();
      }
    };
    const proximity = new IntersectionObserver(
      (entries) => {
        if (
          loading ||
          !entries.some((entry) => entry.isIntersecting) ||
          !ctx ||
          !baseCtx ||
          !atlasCtx
        )
          return;
        loading = true;
        source.onload = () => {
          if (!signal.aborted) buildSafely();
        };
        source.onerror = fail;
        source.src = fallback.src;
        proximity.disconnect();
      },
      { rootMargin: "240px" }
    );
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    const sizing = new ResizeObserver(() => {
      if (
        source.naturalWidth &&
        (this.clientWidth !== lastBuildWidth || compact.matches !== lastCompact)
      )
        buildSafely();
    });
    const position = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();

      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    canvas.addEventListener(
      "pointermove",
      (event) => {
        if (running() && event.pointerType === "mouse") pointer = position(event);
      },
      { passive: true, signal }
    );
    canvas.addEventListener(
      "pointerleave",
      () => {
        pointer = null;
      },
      { signal }
    );
    canvas.addEventListener(
      "pointerdown",
      (event) => {
        if (running()) waves = [...waves.slice(-3), { ...position(event), time }];
      },
      { passive: true, signal }
    );
    button.addEventListener(
      "click",
      () => {
        paused = !paused;
        pointer = null;
        waves = [];
        sync();
      },
      { signal }
    );
    reduced.addEventListener(
      "change",
      () => {
        pointer = null;
        waves = [];
        sync();
      },
      { signal }
    );
    document.addEventListener("visibilitychange", sync, { signal });
    proximity.observe(this);
    visibility.observe(this);
    sizing.observe(this);
    this.release = () => {
      events.abort();
      stop();
      proximity.disconnect();
      visibility.disconnect();
      sizing.disconnect();
      source.onload = null;
      source.onerror = null;
      source.removeAttribute("src");
      cells = [];
      dynamic = [];
      waves = [];
      canvas.width = base.width = atlas.width = 0;
      fail();
    };
  }

  disconnectedCallback() {
    this.release?.();
    this.release = undefined;
  }
}

if (!customElements.get("grounding-ascii"))
  customElements.define("grounding-ascii", GroundingAscii);

export {};
