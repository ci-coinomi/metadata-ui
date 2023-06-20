import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const api = axios.create({
    baseURL: config.public.METADATA_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  nuxtApp.provide("api", api);
});
