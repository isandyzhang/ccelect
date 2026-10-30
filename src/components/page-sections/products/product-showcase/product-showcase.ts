class ProductShowcase extends HTMLElement {
  private cleanup?: () => void;

  connectedCallback() {
    this.cleanup?.();
    const events = new AbortController();
    const { signal } = events;
    const photo = this.querySelector<HTMLElement>(".product-photo")!;
    const panel = this.querySelector<HTMLElement>(".product-video")!;
    const experience = this.querySelector<HTMLElement>(".weld-experience")!;
    const video = this.querySelector("video")!;
    const controls = this.querySelector<HTMLElement>(".showcase-controls")!;
    const error = this.querySelector<HTMLElement>(".video-error")!;
    const buttons = Array.from(controls.querySelectorAll<HTMLButtonElement>("[data-view]"));
    const chapters = Array.from(this.querySelectorAll<HTMLButtonElement>("[data-chapter]"));
    const play = this.querySelector<HTMLButtonElement>('[data-action="play"]')!;
    const progress = this.querySelector<HTMLElement>(".playback-track span")!;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const starts = [0, 2800, 5300, 7800];
    const duration = 11000;
    let elapsed = 0;
    let offset = 0;
    let started = 0;
    let timer: ReturnType<typeof setInterval> | undefined;
    let phase = -1;

    const setPhase = (index: number) => {
      if (phase === index) return;
      phase = index;
      this.dataset.phase = String(index);
      this.querySelector("[data-chapter-index]")!.textContent = `0${index + 1} / 04`;
      this.querySelector("[data-chapter-title]")!.textContent = chapters[index].dataset.title!;
      this.querySelector("[data-chapter-text]")!.textContent = chapters[index].dataset.text!;
      chapters.forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
    };
    const render = () => {
      setPhase(starts.reduce((current, time, i) => (elapsed >= time ? i : current), 0));
      progress.style.transform = `scaleX(${elapsed / duration})`;
    };
    const stop = () => {
      if (timer !== undefined) {
        elapsed = Math.min(duration, offset + performance.now() - started);
        clearInterval(timer);
        timer = undefined;
        render();
      }
      this.dataset.playing = "false";
      play.textContent = elapsed >= duration ? "重播展示 ↻" : "播放展示 ▶";
    };
    const start = () => {
      if (timer !== undefined) return;
      if (elapsed >= duration) elapsed = 0;
      started = performance.now();
      offset = elapsed;
      this.dataset.playing = "true";
      play.textContent = "暫停展示 Ⅱ";
      render();
      timer = setInterval(() => {
        elapsed = Math.min(duration, offset + performance.now() - started);
        render();
        if (elapsed >= duration) stop();
      }, 100);
    };

    setPhase(0);
    this.dataset.playing = "false";
    controls.hidden = false;
    buttons.forEach((button) =>
      button.addEventListener(
        "click",
        () => {
          const view = button.dataset.view!;
          stop();
          video.pause();
          this.dataset.view = view;
          photo.hidden = view !== "photo";
          panel.hidden = view !== "video";
          experience.hidden = view !== "experience";
          buttons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
          if (view === "experience" && !motion.matches) start();
          if (view === "video") {
            error.hidden = true;
            if (!video.getAttribute("src")) {
              video.src = video.dataset.src!;
              video.load();
            }
            if (!motion.matches) void video.play().catch(() => {});
          }
        },
        { signal }
      )
    );
    play.addEventListener("click", () => (timer === undefined ? start() : stop()), { signal });
    chapters.forEach((button, i) =>
      button.addEventListener(
        "click",
        () => {
          stop();
          elapsed = starts[i];
          render();
        },
        { signal }
      )
    );
    const suspend = () => {
      stop();
      video.pause();
    };
    motion.addEventListener("change", suspend, { signal });
    video.addEventListener(
      "error",
      () => {
        error.hidden = false;
      },
      { signal }
    );
    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) suspend();
      },
      { signal }
    );
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) suspend();
    });
    observer.observe(this);
    this.cleanup = () => {
      events.abort();
      observer.disconnect();
      suspend();
    };
  }

  disconnectedCallback() {
    this.cleanup?.();
    this.cleanup = undefined;
  }
}

if (!customElements.get("product-showcase"))
  customElements.define("product-showcase", ProductShowcase);

export {};
