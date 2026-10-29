type Point = { x: number; y: number };
type Circuit = {
  duration: number;
  offset: number;
  length: number;
  samples: Point[];
  tail: SVGPolylineElement;
  head: SVGCircleElement;
  halo: SVGCircleElement;
  joints: { element: SVGCircleElement; arrival: number }[];
};

class GroundingFlow extends HTMLElement {
  private cleanup?: () => void;

  connectedCallback() {
    this.cleanup?.();
    const image = this.querySelector("img")!;
    const overlay = this.querySelector<SVGSVGElement>(".flow-overlay")!;
    const button = this.querySelector<HTMLButtonElement>(".playback")!;
    const modeSwitch = this.querySelector<HTMLElement>(".mode-switch")!;
    const ascii = this.querySelector<HTMLElement>("grounding-ascii")!;
    const modes = Array.from(modeSwitch.querySelectorAll<HTMLButtonElement>("[data-mode]"));
    let mode = this.closest("section")!.classList.contains("is-monochrome") ? "mono" : "color";
    const section = this.closest("section")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const events = new AbortController();
    const { signal } = events;
    let circuits: Circuit[] = [];
    let ready = false;
    let visible = false;
    let paused = false;
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    let nextDraw = 0;
    const hide = (hidden: boolean) => {
      overlay.toggleAttribute("hidden", hidden);
      button.hidden = hidden;
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      nextDraw = 0;
    };
    const pointAt = (circuit: Circuit, fraction: number): Point => {
      const index = Math.max(0, Math.min(1, fraction)) * (circuit.samples.length - 1);
      const low = Math.floor(index);
      const a = circuit.samples[low];
      const b = circuit.samples[Math.min(low + 1, circuit.samples.length - 1)];
      const mix = index - low;

      return { x: a.x + (b.x - a.x) * mix, y: a.y + (b.y - a.y) * mix };
    };
    const render = () => {
      for (const circuit of circuits) {
        const phase = (elapsed + circuit.offset) % circuit.duration;
        // A short rest after reaching the end prevents a visible teleport across the image.
        const travel = circuit.duration - 0.8;
        const progress = Math.min(1, phase / travel);
        const point = pointAt(circuit, progress);
        const opacity = Math.min(1, phase / 0.2, Math.max(0, (travel + 0.3 - phase) / 0.3));

        circuit.head.setAttribute("cx", String(point.x));
        circuit.head.setAttribute("cy", String(point.y));
        circuit.halo.setAttribute("cx", String(point.x));
        circuit.halo.setAttribute("cy", String(point.y));
        circuit.head.style.opacity = String(opacity);
        circuit.halo.style.opacity = String(opacity * 0.3);
        const tailLength = Math.min(24 / circuit.length, progress);
        const tail = Array.from({ length: 9 }, (_, i) =>
          pointAt(circuit, progress - tailLength * (1 - i / 8))
        );

        circuit.tail.setAttribute("points", tail.map((p) => `${p.x},${p.y}`).join(" "));
        circuit.tail.style.opacity = String(opacity * 0.8);
        for (const joint of circuit.joints) {
          const age = phase - joint.arrival * travel;
          const glow = age >= 0 && age <= 0.6 ? Math.sin((age / 0.6) * Math.PI) * 0.65 : 0;

          joint.element.setAttribute("opacity", String(glow));
        }
      }
    };
    const running = () =>
      ready &&
      visible &&
      mode !== "ascii" &&
      !paused &&
      !reduced.matches &&
      !document.hidden &&
      !signal.aborted;
    const tick = (now: number) => {
      frame = 0;
      if (!running()) return;
      if (previous) elapsed += Math.min((now - previous) / 1000, 0.1);
      previous = now;
      if (now >= nextDraw) {
        render();
        nextDraw = now + 1000 / 30;
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      stop();
      hide(!ready || reduced.matches || mode === "ascii");
      button.setAttribute("aria-pressed", String(paused));
      button.setAttribute("aria-label", paused ? "播放動畫" : "暫停動畫");
      if (running()) frame = requestAnimationFrame(tick);
    };
    const initialize = () => {
      if (ready || signal.aborted || !image.naturalWidth) return;
      try {
        circuits = Array.from(this.querySelectorAll<SVGGElement>("[data-circuit]")).map((group) => {
          const path = group.querySelector<SVGPathElement>("[data-route]")!;
          const length = path.getTotalLength();
          const count = Math.max(2, Math.ceil(length / 2));
          const samples = Array.from({ length: count + 1 }, (_, i) => {
            const p = path.getPointAtLength((length * i) / count);

            return { x: p.x, y: p.y };
          });
          const joints = Array.from(group.querySelectorAll<SVGCircleElement>("[data-joint]")).map(
            (element) => {
              const x = Number(element.getAttribute("cx"));
              const y = Number(element.getAttribute("cy"));
              let nearest = 0;
              let distance = Infinity;

              samples.forEach((point, index) => {
                const d = Math.hypot(point.x - x, point.y - y);

                if (d < distance) {
                  nearest = index;
                  distance = d;
                }
              });
              return { element, arrival: nearest / count };
            }
          );

          return {
            length,
            samples,
            joints,
            duration: Number(group.dataset.duration),
            offset: Number(group.dataset.offset),
            tail: group.querySelector<SVGPolylineElement>("[data-tail]")!,
            head: group.querySelector<SVGCircleElement>("[data-head]")!,
            halo: group.querySelector<SVGCircleElement>("[data-halo]")!,
          };
        });
        ready = true;
        render();
        this.dataset.ready = "true";
        sync();
      } catch {
        ready = false;
        hide(true);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && image.complete) initialize();
      sync();
    });

    image.addEventListener(
      "load",
      () => {
        if (visible) initialize();
      },
      { signal }
    );
    image.addEventListener(
      "error",
      () => {
        ready = false;
        delete this.dataset.ready;
        sync();
      },
      { signal }
    );
    button.addEventListener(
      "click",
      () => {
        paused = !paused;
        sync();
      },
      { signal }
    );
    modeSwitch.hidden = false;
    for (const toggle of modes) {
      toggle.addEventListener(
        "click",
        () => {
          mode = toggle.dataset.mode!;
          section.classList.toggle("is-monochrome", mode === "mono");
          section.setAttribute(
            "aria-label",
            `${mode === "ascii" ? "ASCII" : mode === "mono" ? "黑白版" : "彩色版"}接地系統連接概念示意`
          );
          modes.forEach((item) =>
            item.setAttribute("aria-pressed", String(item.dataset.mode === mode))
          );
          image.hidden = mode === "ascii";
          ascii.hidden = mode !== "ascii";
          if (mode === "ascii") {
            // Load the character renderer only when requested; its image remains the fallback.
            void import("./grounding-ascii").catch(() => {});
          }
          sync();
        },
        { signal }
      );
    }
    reduced.addEventListener("change", sync, { signal });
    document.addEventListener("visibilitychange", sync, { signal });
    observer.observe(this);
    this.cleanup = () => {
      events.abort();
      stop();
      observer.disconnect();
      circuits = [];
      hide(true);
      modeSwitch.hidden = true;
      delete this.dataset.ready;
    };
  }

  disconnectedCallback() {
    this.cleanup?.();
    this.cleanup = undefined;
  }
}
if (!customElements.get("grounding-flow")) customElements.define("grounding-flow", GroundingFlow);
