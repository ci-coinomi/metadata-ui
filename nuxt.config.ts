export default defineNuxtConfig({
  modules: ["@nuxtjs/eslint-module", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: ["@/assets/css/icons.css"],
  nitro: {
    preset: 'firebase',
  },
  // Ensure SSR is enabled for production
  ssr: true,
  
  runtimeConfig: {
    public: {
      METADATA_URL: process.env.METADATA_URL,
      COINAPI_WSS: process.env.COINAPI_WSS,
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
  },
});