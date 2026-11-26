import { test, expect } from "@playwright/test";

const scrollToProgress = (page, progress) =>
  page.locator(".grounding-track").evaluate((track, value) => {
    const top = track.getBoundingClientRect().top + window.scrollY;

    window.scrollTo(0, top + (track.offsetHeight - window.innerHeight) * value);
  }, progress);

const sceneProgress = (page) =>
  page.locator(".grounding-experience").evaluate((section) => ({
    structures: Number(section.style.getPropertyValue("--structures-opacity")),
    copper: Number(section.style.getPropertyValue("--copper-base")),
    annotations: Number(section.style.getPropertyValue("--anno-progress")),
  }));

test("grounding waits for every image and reveals the current scroll frame", async ({
  page,
}, testInfo) => {
  const errors = [];
  let releaseCopper;
  const copperGate = new Promise((resolve) => {
    releaseCopper = resolve;
  });

  page.on("pageerror", (error) => errors.push(error.message));
  await page.route(/scene-copper/, async (route) => {
    await copperGate;
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const scene = page.locator("grounding-flow");

  try {
    await expect
      .poll(() => page.locator("img.scene-structures").evaluate((img) => img.naturalWidth))
      .toBeGreaterThan(0);
    await scrollToProgress(page, 0.9);
    await expect(scene).not.toHaveAttribute("data-media-ready");
    await expect(scene).toHaveCSS("opacity", "0");
    await expect(scene).toHaveCSS("visibility", "hidden");
    expect(await sceneProgress(page)).toEqual({ structures: 0.35, copper: 0, annotations: 0 });
  } finally {
    releaseCopper();
  }

  await expect(scene).toHaveAttribute("data-media-ready", "true", { timeout: 15000 });
  await expect(scene).toHaveAttribute("data-ready", "true");
  await expect(scene).toHaveCSS("transition-duration", "0.35s");
  await expect(scene).toHaveCSS("opacity", "1");
  const lateFrame = await sceneProgress(page);

  expect(lateFrame.structures).toBe(1);
  expect(lateFrame.copper).toBe(1);
  expect(lateFrame.annotations).toBeCloseTo((0.9 - 0.82) / (0.95 - 0.82), 2);
  await expect(scene.locator(".anno-text")).toHaveText(["WT T 接", "WE 直通熔接"]);
  const connection = await scene.locator("canvas").evaluate((canvas) => {
    const context = canvas.getContext("2d");

    const pixels = context.getImageData(378, 487, 5, 5).data;

    return Array.from({ length: pixels.length / 4 }, (_, index) =>
      Array.from(pixels.slice(index * 4, index * 4 + 4))
    ).some(([r, g, b, alpha]) => r > 120 && r - g > 32 && r > b * 1.6 && alpha === 255);
  });

  expect(connection).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("grounding-ready.png") });

  await scrollToProgress(page, 0);
  await expect(page.locator("img.scene-structures")).toHaveCSS("opacity", "0.35");
  await expect(page.locator("img.scene-powered")).toHaveCSS("clip-path", "inset(0px 100% 0px 0px)");
  await expect(page.locator("img.scene-copper")).toHaveCSS("opacity", "0");
  await page.screenshot({ path: testInfo.outputPath("grounding-start.png") });

  await scrollToProgress(page, 0.3);
  await expect(page.locator("img.scene-structures")).toHaveCSS("opacity", "1");
  await expect.poll(async () => (await sceneProgress(page)).copper).toBe(0);
  await scrollToProgress(page, 0.9);
  await expect
    .poll(async () => (await sceneProgress(page)).annotations)
    .toBeCloseTo(lateFrame.annotations, 2);
  expect(errors).toEqual([]);
});

test("grounding tolerates a failed image and respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route(/scene-copper/, (route) => route.abort());
  await page.goto("/");
  await scrollToProgress(page, 0.9);
  const scene = page.locator("grounding-flow");

  await expect(scene).toHaveAttribute("data-media-ready", "true");
  await expect(scene).toHaveCSS("opacity", "1");
  await expect(scene).toHaveCSS("transition-duration", "0s");
  await expect(page.locator("img.scene-copper")).toHaveCSS("visibility", "hidden");
  await expect(scene).not.toHaveAttribute("data-ready");
});

test("grounding stays readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    await page.goto("/");
    await expect(page.locator("grounding-flow")).toHaveCSS("opacity", "1");
    await expect(page.locator("grounding-flow")).toHaveCSS("visibility", "visible");
  } finally {
    await context.close();
  }
});
