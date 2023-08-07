import { defineStore } from "pinia";

export const useStore = defineStore("app-store", {
  state: () => ({
    configTypes: [],
    configsList: [],
    headerTitle: "",
    currentUser: null,
    cloneConfigData: null,
    toParentNavigateData: null,
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

    setCloneConfigData(payload) {
      this.cloneConfigData = payload;
    },

    setToParentNavigateData(payload) {
      /*
        For now we don't have query-params for navigation. 
        In this case for navigating to parent config toParentNavigateData is used.
        We use this param as highest filter on /configs.vue page and reseting by click on configType.
      */
      this.toParentNavigateData = payload;
    },
  },
});
