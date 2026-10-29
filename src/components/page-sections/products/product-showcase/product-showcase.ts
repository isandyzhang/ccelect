class ProductShowcase extends HTMLElement {
  private cleanup?: () => void;
  connectedCallback() {
    this.cleanup?.();
    const events = new AbortController();
    const { signal } = events;
    const photo = this.querySelector<HTMLElement>(".product-photo")!;
    const panel = this.querySelector<HTMLElement>(".product-video")!;
    const video = this.querySelector("video")!;
    const controls = this.querySelector<HTMLElement>(".showcase-controls")!;
    const error = this.querySelector<HTMLElement>(".video-error")!;
    const buttons = Array.from(controls.querySelectorAll("button"));

    controls.hidden = !video.dataset.src;
    for (const button of buttons) {
      button.addEventListener(
        "click",
        () => {
          const showVideo = button.dataset.view === "video";

          this.dataset.view = showVideo ? "video" : "photo";
          photo.hidden = showVideo;
          panel.hidden = !showVideo;
          buttons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
          if (!showVideo) {
            video.pause();
            return;
          }
          if (!video.getAttribute("src")) {
            video.src = video.dataset.src!;
            video.load();
          }
          if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
            void video.play().catch(() => {});
        },
        { signal }
      );
    }
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
        if (document.hidden) video.pause();
      },
      { signal }
    );
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
    });

    observer.observe(this);
    this.cleanup = () => {
      events.abort();
      observer.disconnect();
      video.pause();
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
