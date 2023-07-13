import { defineStore } from "pinia";

export const useStore = defineStore("app-store", {
  state: () => ({
    configTypes: [],
    headerTitle: "",
    currentUser: null,
    updateAllBannersTrigger: false,
  }),
  actions: {
    setConfigTypes(payload) {
      this.configTypes = payload;
    },

    setHeaderTitle(payload) {
      this.headerTitle = payload;
    },

    setCurrentUser(payload) {
      this.currentUser = payload;
    },

    setUpdateAllBannersTrigger(payload) {
      this.updateAllBannersTrigger = payload;
    },
  },
});
