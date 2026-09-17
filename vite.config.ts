/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the site from https://jesatu.github.io/BuildCheck/
export default defineConfig({
  base: '/BuildCheck/',
  plugins: [react()],
  test: {
    include: ['src/**/*.test.ts'],
  },
})
