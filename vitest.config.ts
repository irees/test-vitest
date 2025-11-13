import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import { defineVitestProject } from '@nuxt/test-utils/config'
import vue from '@vitejs/plugin-vue'

const _dirname = dirname(fileURLToPath(import.meta.url))
const alias = [{ find: '~', replacement: _dirname }]

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'clover', 'json'],
      reportsDirectory: './coverage',
    },
    projects: [
      // Nuxt environment, using defineVitestProject helper
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/*.{test,spec}.ts'],
          environment: 'nuxt',
        },
      }),
      // Vue environment, using @vitejs/plugin-vue, happy-dom, vue/test-utils
      {
        resolve: { alias },
        plugins: [vue()],
        test: {
          name: 'vue',
          include: [
            'test/vue/**/*.{test,spec}.ts',
          ],
          environment: 'happy-dom',
        },
      },
      // E2E environment, using Node.js after Nuxt await setup()
      {
        resolve: { alias },
        test: {
          name: 'e2e',
          include: [
            'test/e2e/**/*.{test,spec}.ts',
          ],
          environment: 'node',
          setupFiles: ['./test/e2e/setup.ts'],
        },
      },
      // E2E environment with browser tests
      {
        resolve: { alias },
        test: {
          name: 'browser',
          include: ['test/browser/**/*.{test,spec}.ts'],
          environment: 'node',
          setupFiles: ['./test/browser/setup.ts'],
        },
      },
    ],
  },
})
