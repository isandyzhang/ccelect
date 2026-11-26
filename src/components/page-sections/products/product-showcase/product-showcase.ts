class ProductShowcase extends HTMLElement {
  private cleanup?: () => void;

  connectedCallback() {
    this.cleanup?.();
    const events = new AbortController();
    const { signal } = events;
    const photo = this.querySelector<HTMLElement>(".product-photo")!;
    const cadImage = photo.querySelector<HTMLImageElement>("img.product-cad")!;
    const realImage = photo.querySelector<HTMLImageElement>(".product-photo-real img")!;
    const section = this.closest<HTMLElement>(".feature-grid")!;
    let scrollFrame = 0;

    const measure = () => {
      const outer = section.querySelector<HTMLElement>(":scope > .outer-content");
      const frame = Math.min(this.offsetHeight || window.innerHeight, window.innerHeight);

      section.toggleAttribute("data-showcase-stick", frame > 0);
      if (outer) outer.style.top = "0px";
      section.style.minHeight = `${frame + window.innerHeight * 2.4}px`;
      const rect = section.getBoundingClientRect();
      const value = Math.min(
        1,
        Math.max(0, -rect.top / Math.max(1, rect.height - window.innerHeight))
      );

      section.style.setProperty("--showcase-p", value.toFixed(4));
      // Set the photo blend directly as well, so it is updated by this component's lifecycle.
      photo.style.setProperty(
        "--photo-reveal",
        String(Math.min(1, Math.max(0, (value - 0.4) / 0.32)))
      );
    };
    const requestMeasure = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        if (!signal.aborted) measure();
      });
    };
    const resizeObserver = new ResizeObserver(requestMeasure);

    resizeObserver.observe(this);
    window.addEventListener("scroll", requestMeasure, { passive: true, signal });
    window.addEventListener("resize", requestMeasure, { passive: true, signal });
    window.addEventListener("pageshow", requestMeasure, { signal });
    requestMeasure();

    const images = [cadImage, realImage];
    let mediaRequest = 0;

    // A responsive source change can cancel decode(). Retry on load rather than
    // permanently hiding the real photo after that transient cancellation.
    const prepareImages = async () => {
      const request = ++mediaRequest;
      const results = await Promise.allSettled(images.map((image) => image.decode()));

      if (signal.aborted || request !== mediaRequest) return;
      const ready = results.map(
        (result, index) =>
          result.status === "fulfilled" ||
          (images[index].complete && images[index].naturalWidth > 0)
      );

      this.toggleAttribute("data-cad-ready", ready[0]);
      this.toggleAttribute("data-photo-ready", ready[1]);
      measure();
      this.setAttribute("data-media-ready", "");
    };

    images.forEach((image) => {
      image.addEventListener("load", prepareImages, { signal });
      image.addEventListener("error", prepareImages, { signal });
    });
    void prepareImages();
    const panel = this.querySelector<HTMLElement>(".product-video")!;
    const experience = this.querySelector<HTMLElement>(".weld-experience")!;
    const video = this.querySelector("video")!;
    const error = this.querySelector<HTMLElement>(".video-error")!;
    const buttons = Array.from(this.querySelectorAll<HTMLButtonElement>("[data-view]"));
    const chapters = Array.from(this.querySelectorAll<HTMLButtonElement>("[data-chapter]"));
    const play = this.querySelector<HTMLButtonElement>('[data-action="play"]')!;
    const progress = this.querySelector<HTMLElement>(".playback-track span")!;
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
          if (view === "experience") start();
          if (view === "video") {
            error.hidden = true;
            if (!video.getAttribute("src")) {
              video.src = video.dataset.src!;
              video.load();
            }
            void video.play().catch(() => {});
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
      cancelAnimationFrame(scrollFrame);
      resizeObserver.disconnect();
      observer.disconnect();
      suspend();
      this.removeAttribute("data-media-ready");
      this.removeAttribute("data-cad-ready");
      this.removeAttribute("data-photo-ready");
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
