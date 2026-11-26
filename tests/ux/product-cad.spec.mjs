import { test, expect } from "@playwright/test";

test("product CAD starts dim and crossfades to the decoded photo with scroll", async ({
  page,
}, testInfo) => {
  const errors = [];
  let releasePhoto;
  const gate = new Promise((resolve) => {
    releasePhoto = resolve;
  });

  page.on("pageerror", (error) => errors.push(error.message));
  await page.route(/product-display\./, async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const scene = page.locator("product-showcase");
  const photo = scene.locator(".product-photo");
  const cad = scene.locator("img.product-cad");
  const real = scene.locator(".product-photo-real");
  const scroll = (value) =>
    page.locator(".feature-grid:has(product-showcase)").evaluate((section, progress) => {
      const top = section.getBoundingClientRect().top + window.scrollY;

      window.scrollTo(0, top + progress * (section.offsetHeight - window.innerHeight));
    }, value);

  try {
    await expect
      .poll(() => cad.evaluate((image) => image.naturalWidth), { timeout: 15000 })
      .toBeGreaterThan(0);
    await expect(photo).toHaveCSS("opacity", "0");
  } finally {
    releasePhoto();
  }
  await expect(scene).toHaveAttribute("data-media-ready", "");
  await expect(scene).toHaveAttribute("data-cad-ready", "");
  await expect(scene).toHaveAttribute("data-photo-ready", "");
  await scroll(0);
  await expect(photo).toHaveCSS("opacity", "1");
  await expect(cad).toHaveCSS("opacity", "0.35");
  await expect(real).toHaveCSS("opacity", "0");
  await page.screenshot({ path: testInfo.outputPath("product-cad-start.png") });
  await scroll(0.3);
  await expect(real).toHaveCSS("opacity", "0");
  await expect(cad).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(real).toHaveCSS("opacity", "0");
  await expect(cad).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await scroll(0.55);
  await expect
    .poll(async () => Number(await real.evaluate((node) => getComputedStyle(node).opacity)))
    .toBeCloseTo((0.55 - 0.4) / 0.32, 2);
  await scroll(0.85);
  await expect(real).toHaveCSS("opacity", "1");
  await expect(cad).toHaveCSS("opacity", "0");
  await page.screenshot({ path: testInfo.outputPath("product-photo.png") });
  await scroll(0);
  await expect(cad).toHaveCSS("opacity", "0.35");
  await expect(real).toHaveCSS("opacity", "0");
  expect(errors).toEqual([]);
});

test("product photo switches with wheel scrolling after returning to the homepage", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const decode = HTMLImageElement.prototype.decode;

    HTMLImageElement.prototype.decode = function () {
      if (this.closest(".product-photo-real") && this.complete && this.naturalWidth > 0) {
        return Promise.reject(new DOMException("Source selection changed", "AbortError"));
      }
      return decode.call(this);
    };
  });
  await page.goto("/");
  for (let cycle = 0; cycle < 2; cycle++) {
    const scene = page.locator("product-showcase");

    await expect(scene).toHaveAttribute("data-media-ready", "");
    const travel = await page.locator(".feature-grid:has(product-showcase)").evaluate((section) => {
      window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY);
      return section.offsetHeight - window.innerHeight;
    });

    await expect(scene.locator(".product-photo-real")).toHaveCSS("opacity", "0");
    await page.mouse.move(300, 300);
    await page.mouse.wheel(0, travel * 0.85);
    await expect(scene.locator(".product-photo-real")).toHaveCSS("opacity", "1");
    await expect(scene.locator("img.product-cad")).toHaveCSS("opacity", "0");
    await page.locator('main a[href="/contact/"]').first().click();
    await expect(page).toHaveURL(/\/contact\/$/);
    await page.locator(".main-nav-logo-link").click();
    await expect(page).toHaveURL("/");
  }
});
