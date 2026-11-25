import { existsSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:3230";
const edgePath = join(
  process.env["ProgramFiles(x86)"] ?? "C:/Program Files (x86)",
  "Microsoft",
  "Edge",
  "Application",
  "msedge.exe",
);
const channel = process.env.PLAYWRIGHT_CHANNEL ??
  (process.platform === "win32" && existsSync(edgePath) ? "msedge" : undefined);

export default defineConfig({
  testDir: "./tests",
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  reporter: "list",
  workers: 2,
  use: {
    browserName: "chromium",
    channel,
    baseURL,
    locale: "ru-RU",
    timezoneId: "Europe/Moscow",
    trace: "retain-on-failure",
  },
  webServer: {
    command: process.env.PLAYWRIGHT_COMMAND ?? "pnpm dev --port 3230",
    reuseExistingServer: !process.env.CI,
    url: baseURL,
    timeout: 120_000,
  },
});
