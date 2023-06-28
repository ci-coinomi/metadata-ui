import { defineStore } from "pinia";
import { getConfigsTypes } from "~/api/configs";

export const useStore = defineStore("app-store", {
  state: () => ({
    configTypes: [],
    headerTitle: "",
    userRole: "ADMIN",
  }),
  actions: {
    setConfigTypes(payload) {
      this.configTypes = payload;
    },

    setHeaderTitle(payload) {
      this.headerTitle = payload;
    },

    async getConfigTypes() {
      const configTypesData = await getConfigsTypes();
      this.setConfigTypes(configTypesData);
    },
  },
});
