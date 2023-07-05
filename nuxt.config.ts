export default defineNuxtConfig({
  modules: ["@nuxtjs/eslint-module", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
  runtimeConfig: {
    public: {
      METADATA_URL: process.env.METADATA_URL,
    },
  },
  css: ["vue-toast-notification/dist/theme-default.css"],
  app: {
    head: {
      // __dangerouslyDisableSanitizers: ['script'],
      title: "Eucalyptus Labs - Metadata UI",
      meta: [
        {
          charset: "utf-8",
        },
        {
          name: "description",
          content: "Tools for updates",
        },
      ],
    },
  },
  eslint: {
    lintOnStart: false,
    emitWarning: false,
    emitError: false,
    exclude: ["**/.nuxt/**"],
  },
  devtools: { enabled: true },
});
