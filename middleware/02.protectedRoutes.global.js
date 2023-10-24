import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server || to.name === "index" || to.name === "forbidden") {
    return;
  }

  const appStore = useAppStore();
  const { currentUser } = storeToRefs(appStore);
  const rolesArr = currentUser.value?.roles;

  if (to.name === "configs" && !rolesArr?.includes("ROLE_ADMIN")) {
    return navigateTo("/forbidden");
  }

  if (to.name === "questions" && !rolesArr?.includes("ROLE_ADMIN")) {
    return navigateTo("/forbidden");
  }

  if (to.name === "create" && !rolesArr?.includes("ROLE_ADMIN")) {
    return navigateTo("/forbidden");
  }

  if (
    to.name === "users" &&
    rolesArr?.includes("ROLE_ADMIN") &&
    !rolesArr?.includes("ROLE_SUPER_ADMIN")
  ) {
    return navigateTo("/forbidden");
  }
});
