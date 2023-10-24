import { defineStore } from "pinia";

export const useConfigStore = defineStore("config", () => {
  const storedConfigList = ref([]);
  const configTypes = ref([]);
  const cloneConfigData = ref(null);

  const providerGroups = ref([]);
  const providerNetworks = ref([]);
  const providerAccounts = ref([]);

  const setConfigList = (configsArray) => {
    storedConfigList.value = configsArray.filter(
      (config) =>
        config.configType !== "CONFIGURED_PROVIDER_NETWORKS" &&
        config.configType !== "CONFIGURED_PROVIDER_GROUPS" &&
        config.configType !== "CONFIGURED_PROVIDER_ACCOUNTS",
    );
  };
  const setConfigTypes = (typesArray) => {
    configTypes.value = typesArray.filter(
      (type) =>
        type !== "CONFIGURED_PROVIDER_NETWORKS" &&
        type !== "CONFIGURED_PROVIDER_GROUPS" &&
        type !== "CONFIGURED_PROVIDER_ACCOUNTS",
    );
  };
  const setCloneConfigData = (payload) => {
    cloneConfigData.value = payload;
  };
  const setProviderGroups = (payload) => {
    providerGroups.value = payload;
  };
  const setProviderNetworks = (payload) => {
    providerNetworks.value = payload;
  };
  const setProviderAccounts = (payload) => {
    providerAccounts.value = payload;
  };

  return {
    storedConfigList,
    configTypes,
    cloneConfigData,
    providerGroups,
    providerNetworks,
    providerAccounts,
    setConfigList,
    setConfigTypes,
    setCloneConfigData,
    setProviderGroups,
    setProviderNetworks,
    setProviderAccounts,
  };
});
