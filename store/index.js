import { defineStore } from "pinia";

export const useStore = defineStore("app-store", {
  state: () => ({
    configTypes: [],
    configsList: [],
    providersGroups: [],
    providersNetworks: [],
    headerTitle: "",
    currentUser: null,
    cloneConfigData: null,
  }),
  actions: {
    setProvidersGroups(payload) {
      this.providersGroups = payload;
    },

    setProvidersNetworks(payload) {
      this.providersNetworks = payload;
    },

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

    setCloneConfigData(payload) {
      this.cloneConfigData = payload;
    },
  },
});
