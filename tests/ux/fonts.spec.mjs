import { test, expect } from "@playwright/test";

test("Noto Sans TC loads without an enlarged fallback on a cold visit", async ({
  page,
}, testInfo) => {
  let releaseFonts;
  const gate = new Promise((resolve) => {
    releaseFonts = resolve;
  });
  const measure = () =>
    page
      .locator(".hero-image-banner__line-inner")
      .first()
      .evaluate((node) => {
        const style = getComputedStyle(node);
        const range = document.createRange();

        range.selectNodeContents(node);
        return {
          width: range.getBoundingClientRect().width,
          fontSize: style.fontSize,
          family: style.fontFamily,
        };
      });

  await page.route(/\.woff2(?:\?|$)/, async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  let before;

  try {
    await expect(page.locator(".hero-image-banner__line-inner").first()).toBeVisible();
    const variable = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--font-noto-sans-tc")
    );

    expect(variable).toContain("Noto Sans TC-");
    expect(variable).not.toContain("fallback: Arial");
    const preloads = await page.locator('link[rel="preload"][as="font"]').count();

    expect(preloads).toBeGreaterThan(0);
    expect(preloads).toBeLessThanOrEqual(2);
    before = await measure();
  } finally {
    releaseFonts();
  }
  await page.evaluate(() => document.fonts.ready);
  const after = await measure();

  expect(after.fontSize).toBe(before.fontSize);
  expect(after.width / before.width).toBeGreaterThan(0.8);
  expect(after.width / before.width).toBeLessThan(1.2);
  await expect
    .poll(() =>
      page.evaluate(() =>
        Array.from(document.fonts).some(
          (font) => font.family.includes("Noto Sans TC-") && font.status === "loaded"
        )
      )
    )
    .toBe(true);
  await page.screenshot({ path: testInfo.outputPath("font-loaded.png") });
  await testInfo.attach("font-measurements.json", {
    body: JSON.stringify({ before, after }),
    contentType: "application/json",
  });
});
