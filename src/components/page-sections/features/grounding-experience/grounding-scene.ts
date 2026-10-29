import type * as Three from "three";

class GroundingScene extends HTMLElement {
  private cleanup?: () => void;
  private generation = 0;

  connectedCallback() {
    const generation = ++this.generation;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void this.initialize(generation);
      },
      { rootMargin: "240px" }
    );

    observer.observe(this);
    this.cleanup = () => observer.disconnect();
  }

  disconnectedCallback() {
    this.generation++;
    this.cleanup?.();
    this.removeAttribute("data-ready");
  }

  private async initialize(generation: number) {
    let THREE: typeof Three;

    try {
      THREE = await import("three");
    } catch {
      return;
    }
    if (!this.isConnected || generation !== this.generation) return;
    const canvas = this.querySelector("canvas")!;
    const stage = this.querySelector<HTMLElement>(".grounding-stage")!;
    const button = this.querySelector("button")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 760px)");
    let renderer: Three.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !mobile.matches,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);

    camera.position.set(7, 5.5, 9);
    camera.lookAt(0, -0.5, 0);
    renderer.setClearColor(0x101513, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    const assembly = new THREE.Group();

    scene.add(assembly);
    scene.add(new THREE.HemisphereLight(0xe6fff0, 0x392419, 3));
    for (const [color, intensity, x, y, z] of [
      [0xffd2a1, 6, 2, 5, 4],
      [0xc5e6ff, 4, -4, 2, -3],
    ]) {
      const light = new THREE.DirectionalLight(color, intensity);

      light.position.set(x, y, z);
      scene.add(light);
    }
    const copper = new THREE.MeshStandardMaterial({
      color: 0xc47d49,
      metalness: 0.72,
      roughness: 0.32,
    });
    const jointMaterial = new THREE.MeshStandardMaterial({
      color: 0xdb9e69,
      metalness: 0.65,
      roughness: 0.38,
    });
    const glow = new THREE.MeshBasicMaterial({ color: 0xd9ffba });
    const paths = [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4, 0.6, 0),
        new THREE.Vector3(-2, 0.2, 0),
        new THREE.Vector3(0, 0, 0),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(2, 0.2, 0),
        new THREE.Vector3(4, 0.6, -0.4),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -1.5, 0),
        new THREE.Vector3(0, -3.2, 0),
      ]),
    ];

    // Seven individually twisted strands form each copper conductor.
    paths.slice(0, 2).forEach((path) => {
      for (let strand = 0; strand < 7; strand++) {
        const points = Array.from({ length: 81 }, (_, i) => {
          const t = i / 80;
          const p = path.getPoint(t);
          const angle = t * Math.PI * 10 + (strand * Math.PI) / 3;
          const radius = strand === 6 ? 0 : 0.105;

          p.y += Math.cos(angle) * radius;
          p.z += Math.sin(angle) * radius;
          return p;
        });

        assembly.add(
          new THREE.Mesh(
            new THREE.TubeGeometry(
              new THREE.CatmullRomCurve3(points),
              mobile.matches ? 80 : 160,
              0.052,
              6,
              false
            ),
            copper
          )
        );
      }
    });
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.09, 3.5, 24), copper);

    rod.position.y = -1.45;
    assembly.add(rod);
    const joint = new THREE.Mesh(new THREE.SphereGeometry(0.37, 32, 20), jointMaterial);

    joint.scale.set(1.5, 0.78, 0.85);
    assembly.add(joint);
    const grid = new THREE.GridHelper(12, 24, 0x5d7962, 0x344a3b);

    grid.position.y = -3.3;
    scene.add(grid);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x9ebc8b,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const rings = [0, 1, 2].map(() => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.97, 1, 64), ringMaterial.clone());

      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -3.26;
      assembly.add(ring);
      return ring;
    });

    ringMaterial.dispose();
    const particleGeometry = new THREE.SphereGeometry(0.065, 8, 8);
    const particles = paths.flatMap((path) =>
      Array.from({ length: mobile.matches ? 4 : 7 }, (_, index) => {
        const mesh = new THREE.Mesh(particleGeometry, glow);

        assembly.add(mesh);
        return { mesh, path, offset: index / (mobile.matches ? 4 : 7) };
      })
    );
    let visible = false;
    let paused = false;
    let frame = 0;
    let last = 0;
    let elapsed = 0;
    let pointerX = 0;
    let pointerY = 0;
    let disposed = false;
    const draw = (time: number) => {
      frame = 0;
      if (disposed) return;
      const moving = !paused && !reduced.matches;

      if (moving) elapsed += Math.min((time - (last || time)) / 1000, 0.05);
      last = time;
      const rect = this.getBoundingClientRect();
      const progress =
        reduced.matches || paused
          ? 0.5
          : Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
      const rotation = (progress - 0.5) * 0.45 + (moving ? pointerX * 0.15 : 0);

      assembly.rotation.y += (rotation - assembly.rotation.y) * 0.06;
      assembly.rotation.x += ((moving ? pointerY * 0.07 : 0) - assembly.rotation.x) * 0.06;
      particles.forEach(({ mesh, path, offset }) =>
        mesh.position.copy(path.getPoint((elapsed * 0.22 + offset) % 1))
      );
      rings.forEach((ring, i) => {
        const phase = (elapsed * 0.25 + i / 3) % 1;

        ring.scale.setScalar(0.3 + phase * 3);
        ring.material.opacity = (1 - phase) * 0.3;
      });
      renderer.render(scene, camera);
      if (visible && !document.hidden && moving) frame = requestAnimationFrame(draw);
    };
    const wake = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (visible && !document.hidden && !disposed) frame = requestAnimationFrame(draw);
    };
    const resize = () => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;

      renderer.setPixelRatio(Math.min(devicePixelRatio, mobile.matches ? 1.25 : 1.75));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.set(7, 5.5, 9).multiplyScalar(camera.aspect < 1.2 ? 1.35 : 1);
      camera.updateProjectionMatrix();
      wake();
    };
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reduced.matches || paused) return;
      const rect = stage.getBoundingClientRect();

      pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      pointerY = (event.clientY - rect.top) / rect.height - 0.5;
    };
    const leave = () => {
      pointerX = 0;
      pointerY = 0;
    };
    const preference = () => {
      button.hidden = reduced.matches;
      wake();
    };
    const toggle = () => {
      paused = !paused;
      button.setAttribute("aria-pressed", String(paused));
      button.textContent = paused ? "播放動畫" : "暫停動畫";
      wake();
    };
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    const sizing = new ResizeObserver(resize);
    const lost = (event: Event) => {
      event.preventDefault();
      this.cleanup?.();
      this.removeAttribute("data-ready");
      button.hidden = true;
    };

    this.cleanup = () => {
      disposed = true;
      cancelAnimationFrame(frame);
      visibility.disconnect();
      sizing.disconnect();
      document.removeEventListener("visibilitychange", wake);
      reduced.removeEventListener("change", preference);
      stage.removeEventListener("pointermove", pointer);
      stage.removeEventListener("pointerleave", leave);
      button.removeEventListener("click", toggle);
      canvas.removeEventListener("webglcontextlost", lost);
      const geometries = new Set<Three.BufferGeometry>();
      const materials = new Set<Three.Material>();

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
          geometries.add(object.geometry);
          (Array.isArray(object.material) ? object.material : [object.material]).forEach(
            (material) => materials.add(material)
          );
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    };
    canvas.addEventListener("webglcontextlost", lost);
    stage.addEventListener("pointermove", pointer, { passive: true });
    stage.addEventListener("pointerleave", leave);
    button.addEventListener("click", toggle);
    document.addEventListener("visibilitychange", wake);
    reduced.addEventListener("change", preference);
    sizing.observe(stage);
    visibility.observe(this);
    resize();
    // A static render also serves reduced-motion users.
    draw(performance.now());
    this.setAttribute("data-ready", "");
    button.hidden = reduced.matches;
  }
}

if (!customElements.get("grounding-scene"))
  customElements.define("grounding-scene", GroundingScene);
