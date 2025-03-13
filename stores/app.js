import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
  const headerTitle = ref("");
  const currentUser = ref(null);

  const setHeaderTitle = (payload) => {
    headerTitle.value = payload;
  };
  const setCurrentUser = (payload) => {
    console.log("setCurrentUser");
    currentUser.value = payload;
  };

  const isSuperAdmin = computed(() =>
    currentUser.value?.roles?.includes("SUPER_ADMIN"),
  );

  return {
    headerTitle,
    currentUser,
    setHeaderTitle,
    setCurrentUser,
    isSuperAdmin,
  };
});
