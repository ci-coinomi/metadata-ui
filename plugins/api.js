export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.METADATA_URL,
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Content-type": "application/json",
    },
    credentials: "include",
    async onResponseError({ request, response, options }) {
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

  /**
   * GetMe and Login without redirect in the case of 401 error (when user entered wrong login data).
   * For login and redirect pages.
   */
  const loginApi = $fetch.create({
    baseURL: config.public.METADATA_URL,
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Content-type": "application/json",
    },
    credentials: "include",
  });

  const wss_api = config.public.COINAPI_WSS;

  nuxtApp.provide("api", api);
  nuxtApp.provide("loginApi", loginApi);
  nuxtApp.provide("wss_api", wss_api);
});
