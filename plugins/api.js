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
          router.push("/no-access");
          break;
      }
    },
  });

  nuxtApp.provide("api", api);
});
