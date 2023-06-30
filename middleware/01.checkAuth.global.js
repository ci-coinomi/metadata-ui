import { useStore } from "~/store";
import { getMe } from "~/api/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server || to.name === "index" || to.name === "no-access") {
    return;
  }

  const store = useStore();

  if (!store.currentUser) {
    const user = await getMe();
    if (user) {
      store.setCurrentUser(user);
    } else {
      return navigateTo("/");
    }
  }
});
