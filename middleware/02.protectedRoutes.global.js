import { useStore } from "~/store";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server || to.name === "index" || to.name === "forbidden") {
    return;
  }

  const store = useStore();
  const rolesArr = store.currentUser?.roles;

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
