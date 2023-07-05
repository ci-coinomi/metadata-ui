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

  if (to.name === "configs-id" && !rolesArr?.includes("ROLE_ADMIN")) {
    return navigateTo("/forbidden");
  }

  if (to.name === "images-id" && !rolesArr?.includes("ROLE_ADMIN")) {
    return navigateTo("/forbidden");
  }

  if (
    to.name === "configs-id-nft-collection" &&
    !rolesArr?.includes("ROLE_ADMIN")
  ) {
    return navigateTo("/forbidden");
  }

  if (to.name === "configs-id-banner" && !rolesArr?.includes("ROLE_ADMIN")) {
    return navigateTo("/forbidden");
  }

  if (to.name === "questions" && !rolesArr?.includes("ROLE_ADMIN")) {
    return navigateTo("/no-access");
  }

  if (
    to.name === "users" &&
    rolesArr?.includes("ROLE_ADMIN") &&
    !rolesArr?.includes("ROLE_SUPER_ADMIN")
  ) {
    return navigateTo("/forbidden");
  }
});
