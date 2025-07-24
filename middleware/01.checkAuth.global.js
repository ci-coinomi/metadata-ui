import { useAuth } from "@/composables/useFirebaseAuth";

export default defineNuxtRouteMiddleware(async (to) => {
  const { currentFirebaseUser, fetchCurrentUser } = useAuth();
  if (process.server || to.name === "index" || to.name === "forbidden") {
    return;
  }

  if (!currentFirebaseUser.value) {
    const currentUser = await fetchCurrentUser();
    if (!currentUser) {
      return navigateTo("/");
    }
  }
});
