import { useStore } from "~/store";
import { getMe } from "~/api/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server || to.name === "index" || to.name === "forbidden") {
    return;
  }

  const store = useStore();

  if (!store.currentUser) {
    const response = await getMe();
    if (response.status === 200) {
      store.setCurrentUser(response._data);
    } else {
      return navigateTo("/");
    }
  }
});
