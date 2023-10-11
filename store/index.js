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

    setConfigTypes(typesArray) {
      this.configTypes = typesArray.filter(
        (item) =>
          item !== "CONFIGURED_PROVIDER_NETWORKS" &&
          item !== "CONFIGURED_PROVIDER_GROUPS",
      );
    },

    setConfigsList(configsArray) {
      this.configsList = configsArray.filter(
        (item) =>
          item.configType !== "CONFIGURED_PROVIDER_NETWORKS" &&
          item.configType !== "CONFIGURED_PROVIDER_GROUPS",
      );
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
