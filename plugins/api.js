export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.METADATA_URL,
    headers: {
      "Content-type": "application/json",
    },
    credentials: "include",
    onRequest({ options }) {
      if (process.client) {
        const token = localStorage.getItem("firebaseToken");
        if (token) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          };
        }
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
