import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  // const API_KEY = config.API_KEY;
  const api = axios.create({
    baseURL: config.public.API_URL,
    headers: {
      "Content-Type": "application/json",
      // "Authorization" : `Bearer ${API_KEY}`
    }
  });
  console.log(config.public.API_URL)
  nuxtApp.provide('api', api);
})