import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // External fonts and embedded players are not needed to verify local visitor flows.
  await page.route(/https:\/\/(?:fonts\.|www\.youtube|i\.ytimg)/, (route) => route.abort());
});

for (const prefix of ["", "/en", "/ja"]) {
  test(`${prefix || "zh-tw"}: search, empty results, query changes and contact`, async ({
    page,
  }) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${prefix}/search/?q=Exoweld`);
    await expect(page.locator(".search-result").first()).toBeVisible();
    const hrefs = await page
      .locator(".search-result-title a")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(
      hrefs.every((href) =>
        prefix ? href?.startsWith(`${prefix}/`) : !/^\/(en|ja)\//.test(href || "")
      )
    ).toBe(true);
    const field = page.locator('input[name="q"]');
    await field.fill("zzqvzx987654321");
    await expect(page.locator(".search-status")).toContainText("zzqvzx987654321");
    await expect(page.locator(".search-result")).toHaveCount(0);
    await field.fill("Exoweld");
    await field.fill("WE");
    await expect(page.locator(".search-section")).toHaveAttribute("aria-busy", "false");
    await expect(page).toHaveURL(/q=WE/);
    await expect(page.locator(".search-status")).toContainText("WE");
    await page.goto(`${prefix}/contact/`);
    await expect(page.locator("main form")).toHaveCount(0);
    await expect(page.locator('main a[href="tel:+886223632992"]')).toBeVisible();
    await expect(page.locator('main a[href="mailto:cce@ccelect.com.tw"]')).toBeVisible();
    await expect(page.locator('main a[href*="line.me"]')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test(`${prefix || "zh-tw"}: product, keyboard tabs, breadcrumb and localized contact`, async ({
    page,
  }, testInfo) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${prefix}/products/exoweld/w-series/`);
    const tabs = page.locator('[data-series-tabs] [role="tab"]');
    await tabs.first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Home");
    await expect(tabs.first()).toBeFocused();
    await page.locator('.series-products a[href$="/we/"]').first().click();
    await expect(page.locator("h1")).toHaveText("WE");
    await expect(page.locator('.product-breadcrumb a[href$="/w-series/"]')).toBeVisible();
    await expect(page.locator(".product-cta-primary")).toHaveAttribute(
      "href",
      `${prefix}/contact/`
    );
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1
    );
    expect(overflow).toBe(false);
    await page.screenshot({ path: testInfo.outputPath("product.png"), fullPage: true });
    await page.locator(".product-cta-primary").click();
    await expect(page).toHaveURL(new RegExp(`${prefix}/contact/$`));
    expect(errors).toEqual([]);
  });
}

test("search module download failure can be retried", async ({ page }) => {
  let fail = true;
  await page.route("**/pagefind/pagefind.js*", (route) =>
    fail ? route.abort() : route.continue()
  );
  await page.goto("/search/?q=Exoweld");
  const retry = page.locator(".search-retry");
  await expect(retry).toBeVisible();
  fail = false;
  await retry.click();
  await expect(page.locator(".search-result").first()).toBeVisible();
  await expect(retry).toBeHidden();
});

test("production excludes upstream drafts and disables unavailable translations", async ({
  page,
  request,
}) => {
  expect((await request.get("/pricing/")).status()).toBe(404);
  expect(
    (await request.get("/blog/why-we-rebuilt-our-dns-resolver-from-scratch-again/")).status()
  ).toBe(404);
  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  expect(sitemap).not.toContain("dns-resolver");
  expect(sitemap).not.toContain("/pricing/");
  await page.goto("/blog/exothermic-welding-process/");
  await page.locator(".lang-switcher summary").click();
  await expect(page.locator('.language-menu [data-locale="en"]')).toHaveAttribute(
    "aria-disabled",
    "true"
  );
  await expect(page.locator('.language-menu [data-locale="en"]')).not.toHaveAttribute("href");
  // The same persisted menu must regain valid links on the next page.
  await page.locator(".lang-switcher summary").press("Escape");
  await page.locator('main a[href="/blog/"]').first().click();
  await page.locator(".lang-switcher summary").click();
  await expect(page.locator('.language-menu [data-locale="en"]')).toHaveAttribute(
    "href",
    "/en/blog/"
  );
});

test("mobile menu traps focus, closes with Escape and works after navigation", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/products/");
  const hamburger = page.locator(".nav-hamburger");
  for (let cycle = 0; cycle < 3; cycle++) {
    await hamburger.click();
    const menu = page.locator(".mobile.is-open");
    await expect(menu).toBeVisible();
    await expect(menu.locator(".mobile-close")).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    expect(await menu.evaluate((node) => node.contains(document.activeElement))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(hamburger).toBeFocused();
    await expect(page.locator(".mobile")).toHaveAttribute("inert", "");
  }
  await page.locator('main .card a[href="/products/exoweld/w-series/"]').first().click();
  await hamburger.click();
  await expect(page.locator(".mobile.is-open")).toBeVisible();
  await page.keyboard.press("Escape");
  expect(errors).toEqual([]);
});

test("animation cleanup survives repeated client navigation", async ({ page }, testInfo) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  for (let cycle = 0; cycle < 2; cycle++) {
    await page.locator("grounding-flow").scrollIntoViewIfNeeded();
    await expect(page.locator("grounding-flow")).toHaveAttribute("data-ready", "true", {
      timeout: 15000,
    });
    await page.locator('main a[href="/contact/"]').first().click();
    await expect(page).toHaveURL(/\/contact\/$/);
    await page.locator(".main-nav-logo-link").click();
    await expect(page).toHaveURL("/");
  }
  await page.screenshot({ path: testInfo.outputPath("home.png"), fullPage: true });
  const media = await page.evaluate(() => ({
    images: Array.from(document.images).map((img) => ({
      src: img.currentSrc,
      loading: img.loading,
      width: img.naturalWidth,
    })),
    resources: performance.getEntriesByType("resource").map((entry) => ({
      url: entry.name,
      bytes: entry.transferSize,
      ms: entry.duration,
    })),
  }));
  await testInfo.attach("media.json", {
    body: JSON.stringify(media, null, 2),
    contentType: "application/json",
  });
  expect(errors).toEqual([]);
});
