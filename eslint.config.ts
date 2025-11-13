// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

// eslintRules

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: {
    // Enable strict TypeScript rules
    typescript: {
      strict: true,
    },
  },
  dirs: {
    src: [
      './playground',
    ],
  },
})
  .prepend(
  )
  .append(
  )
