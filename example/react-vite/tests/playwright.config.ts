import {defineConfig} from '@playwright/test'
export default defineConfig({testDir:'.',testMatch:'browser.spec.ts',use:{baseURL:'http://127.0.0.1:4173'},webServer:{command:'pnpm dev --host 127.0.0.1 --port 4173 --strictPort',url:'http://127.0.0.1:4173',reuseExistingServer:false},reporter:'list'})
