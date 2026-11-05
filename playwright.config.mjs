import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/ux",
  fullyParallel: true,
  workers: 2,
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:4322",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    {
      name: "mobile",
      use: { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true },
    },
  ],
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4322",
    url: "http://127.0.0.1:4322",
    reuseExistingServer: !process.env.CI,
  },
});
