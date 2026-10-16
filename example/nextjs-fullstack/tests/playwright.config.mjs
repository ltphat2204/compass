import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'.',testMatch:'ui.spec.mjs',workers:1,fullyParallel:false,timeout:30000,use:{baseURL:process.env.TEST_BASE_URL || 'http://127.0.0.1:3102',headless:true},reporter:'list'});
