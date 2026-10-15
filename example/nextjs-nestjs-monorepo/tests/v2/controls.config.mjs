import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: '.', testMatch: 'ui-controls.spec.mjs', workers: 1, reporter: 'list', use: { browserName: 'chromium', headless: true } });
