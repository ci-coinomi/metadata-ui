export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.METADATA_URL,
    headers: {
      "Content-type": "application/json",
    },
    credentials: "include",
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

  /**
   * GetMe and Login without redirect in the case of 401 error (when user entered wrong login data).
   * For login and redirect pages.
   */
  const loginApi = $fetch.create({
    baseURL: config.public.METADATA_URL,
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  });

  const wssApi = config.public.COINAPI_WSS;

  nuxtApp.provide("api", api);
  nuxtApp.provide("loginApi", loginApi);
  nuxtApp.provide("wss_api", wssApi);
});
