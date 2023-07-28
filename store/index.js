import { defineStore } from "pinia";

export const useStore = defineStore("app-store", {
  state: () => ({
    configTypes: [],
    configsList: [],
    headerTitle: "",
    currentUser: null,
  }),
  actions: {
    setConfigTypes(payload) {
      this.configTypes = payload;
    },

    setConfigsList(payload) {
      this.configsList = payload;
    },

    setHeaderTitle(payload) {
      this.headerTitle = payload;
    },

    setCurrentUser(payload) {
      this.currentUser = payload;
    },
  },
});
