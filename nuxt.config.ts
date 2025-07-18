export default defineNuxtConfig({
  modules: ["@nuxtjs/eslint-module", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: ["@/assets/css/icons.css"],

  runtimeConfig: {
    public: {
      METADATA_URL: process.env.METADATA_URL,
      COINAPI_WSS: process.env.COINAPI_WSS,
      fbaseApiKey: process.env.FBASE_API_KEY,
      fbaseAuthDomain: process.env.FBASE_AUTH_DOMAIN,
      fbaseProjectId: process.env.FBASE_PROJECT_ID,
      fbaseStorageBucket: process.env.FBASE_STORAGE_BUCKET,
      fbaseMessagingSenderId: process.env.FBASE_MESSAGING_SENDER_ID,
      fbaseAppId: process.env.FBASE_APP_ID,
    },
  },

  build: {
    transpile: ["vue-toastification"],
  },

  app: {
    head: {
      title: "MAUI",
      meta: [
        {
          charset: "utf-8",
        },
        {
          name: "description",
          content: "Tools for updates",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon.png",
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
});
