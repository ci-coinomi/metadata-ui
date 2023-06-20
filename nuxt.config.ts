export default defineNuxtConfig({
  modules: ["@nuxtjs/eslint-module", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
    },
  },
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
  },
  devtools: { enabled: true },
});
