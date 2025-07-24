import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const appStore = useAppStore();

  const { currentUserToken } = storeToRefs(appStore);

  const api = $fetch.create({
    baseURL: config.public.METADATA_URL,
    headers: {
      "Content-type": "application/json",
    },
    credentials: "include",
    onRequest({ options }) {
      if (process.client && currentUserToken.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${currentUserToken.value}`,
        };
      }
    },
    onResponseError({ _request, response }) {
      const router = useRouter();
      switch (response.status) {
        case 401:
          router.push("/");
          break;
        case 403:
          router.push("/forbidden");
          break;
      }
    },
  });

  const wssApi = config.public.COINAPI_WSS;

  nuxtApp.provide("api", api);
  nuxtApp.provide("wss_api", wssApi);
});
