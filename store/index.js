import { defineStore } from "pinia";
import { getConfigsTypes } from "~/api/configs";

export const useStore = defineStore("app-store", {
  state: () => ({
    configTypes: [],
    headerTitle: "",
    currentUser: null,

    imagesParentConfig: null,
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

    setImagesParentConfig(payload) {
      this.imagesParentConfig = payload;
    },

    async getConfigTypes() {
      const configTypesData = await getConfigsTypes();
      this.setConfigTypes(configTypesData);
    },
  },
});
