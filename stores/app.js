import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
  const headerTitle = ref("");
  const currentUser = ref(null);
  const currentFirebaseUser = ref(null);
  const currentUserToken = ref(null);

  const setHeaderTitle = (payload) => {
    headerTitle.value = payload;
  };
  const setCurrentUser = (payload) => {
    currentUser.value = payload;
  };

  const setCurrentFirebaseUser = (payload) => {
    currentFirebaseUser.value = payload;
  };

  const isSuperAdmin = computed(() =>
    currentUser.value?.roles?.includes("SUPER_ADMIN"),
  );

  const setCurrentUserToken = (payload) => {
    currentUserToken.value = payload;
  };

  return {
    headerTitle,
    currentUser,
    setHeaderTitle,
    setCurrentUser,
    isSuperAdmin,
    currentFirebaseUser,
    setCurrentFirebaseUser,
    currentUserToken,
    setCurrentUserToken,
  };
});
