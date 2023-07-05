import { useStore } from "~/store";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server || to.name === "index" || to.name === "no-access") {
    return;
  }

  const store = useStore();
  const rolesArr = store.currentUser?.roles;

  if (to.name === "configs" && !rolesArr?.includes("ROLE_ADMIN")) {
    return navigateTo("/no-access");
  }

  if (to.name === "configs-id" && !rolesArr?.includes("ROLE_ADMIN")) {
    return navigateTo("/no-access");
  }

  if (to.name === "images-id" && !rolesArr?.includes("ROLE_ADMIN")) {
    return navigateTo("/no-access");
  }

  if (to.name === "questions" && !rolesArr?.includes("ROLE_ADMIN")) {
    return navigateTo("/no-access");
  }

  if (
    to.name === "users" &&
    rolesArr?.includes("ROLE_ADMIN") &&
    !rolesArr?.includes("ROLE_SUPER_ADMIN")
  ) {
    return navigateTo("/no-access");
  }
});
