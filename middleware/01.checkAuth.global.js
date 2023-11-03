import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";
import { getMe } from "@/api/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server || to.name === "index" || to.name === "forbidden") {
    return;
  }

  const appStore = useAppStore();
  const { currentUser } = storeToRefs(appStore);

  if (!currentUser.value) {
    const response = await getMe();
    if (response.success) {
      appStore.setCurrentUser(response.data);
    } else {
      return navigateTo("/");
    }
  }
});
