// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  modules: [
    'tlv2-ui',
    '@nuxt/test-utils/module',
    '@nuxt/eslint',
  ],

  tlv2: {
    useProxy: false,
    bulma: '~/assets/main.scss',
  },

  compatibilityDate: '2025-02-18',
})
