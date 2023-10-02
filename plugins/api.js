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

  const api2 = $fetch.create({
    baseURL: config.public.METADATA_URL_2,
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

  const wss_api = config.public.METADATA_URL_3;

  nuxtApp.provide("api", api);
  nuxtApp.provide("api2", api2);
  nuxtApp.provide("wss_api", wss_api);
});
