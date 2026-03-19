import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@raycast/api': resolve(__dirname, './src/test/mocks/raycast-api.ts'),
      '@raycast/utils': resolve(__dirname, './src/test/mocks/raycast-utils.ts'),
    },
  },
  define: {
    'process.env.NODE_ENV': '"test"',
  },
})
