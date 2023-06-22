import { defineStore } from "pinia";
import { getConfigsTypes } from "~/api/configs";

export const useStore = defineStore("app-store", {
  state: () => ({
    configTypes: [],
  }),
  actions: {
    setConfigTypes(payload) {
      this.configTypes = payload;
    },

    async getConfigTypes() {
      const configTypesData = await getConfigsTypes();
      this.setConfigTypes(configTypesData);
    },
  },
});
