export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // Короче чем customFetch, updatedFetch или newFetch
  const myFetch = $fetch.create({
    baseURL: config.public.METADATA_URL,
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Content-type": "application/json",
    },
    credentials: "include",
    async onResponseError({ request, response, options }) {
      // Todo: to switch-case
      if (response.status === 401) {
        console.log("Redirect to LOGIN");
        return;
      }

      if (response.status === 403) {
        console.log("Redirect to 403 NO ACCESS");
        const router = useRouter();
        router.push("/errorPagess");
        return;
      }

      // console.log("RespError", request, response.status, response.body);
      console.log("Redirect to NuxtErrorPage");
    },
  });

  nuxtApp.provide("myFetch", myFetch);
});
