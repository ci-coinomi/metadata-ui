import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";

export default defineNuxtRouteMiddleware((to) => {
  if (process.server || to.name === "index" || to.name === "forbidden") {
    return;
  }

  const appStore = useAppStore();
  const { currentUser } = storeToRefs(appStore);
  const rolesArr = currentUser.value?.roles;

  if (to.name === "configs" && !rolesArr?.includes("ADMIN")) {
    // return navigateTo("/forbidden");
  }

  if (to.name === "questions" && !rolesArr?.includes("ADMIN")) {
    // return navigateTo("/forbidden");
  }

  if (to.name === "create" && !rolesArr?.includes("ADMIN")) {
    // return navigateTo("/forbidden");
  }

  if (
    to.name === "users" &&
    rolesArr?.includes("ADMIN") &&
    !rolesArr?.includes("SUPER_ADMIN")
  ) {
    // return navigateTo("/forbidden");
  }
});
