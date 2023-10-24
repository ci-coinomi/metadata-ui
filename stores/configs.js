import { defineStore } from "pinia";
import { getChainNameFromConfigItem } from "@/utils/utilfunc";

export const useConfigStore = defineStore("config", () => {
  /* RESPONSES */
  const storedConfigList = ref([]);
  const configTypes = ref([]);
  const providerGroups = ref(null);
  const providerNetworks = ref(null);
  const providerAccounts = ref(null);

  /* CONFIG FILTERS */
  const selectedType = ref(null);
  const selectedChain = ref(null);
  const blockchains = ref(null);
  const searchValue = ref(null);
  const visibleItemsCount = ref(30);

  const cloneConfigData = ref(null);

  /* RESPONSES */
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
  const setProviderGroups = (payload) => {
    providerGroups.value = payload;
  };
  const setProviderNetworks = (payload) => {
    providerNetworks.value = payload;
  };
  const setProviderAccounts = (payload) => {
    providerAccounts.value = payload;
  };

  /* CONFIG FILTERS */
  const setSelectedType = (payload) => {
    selectedType.value = payload;
  };
  const setSelectedChain = (payload) => {
    selectedChain.value = payload;
  };
  const setBlockchains = (payload) => {
    blockchains.value = payload;
  };
  const setSearchValue = (payload) => {
    searchValue.value = payload;
  };
  const setVisibleItemsCount = (payload) => {
    visibleItemsCount.value = payload;
  };
  const setDefaultFilters = () => {
    selectedType.value = null;
    selectedChain.value = null;
    blockchains.value = null;
    searchValue.value = null;
    visibleItemsCount.value = 30;
  };

  const setCloneConfigData = (payload) => {
    cloneConfigData.value = payload;
  };

  /* GETTERS */
  // TODO и проверить поиск null
  const filtredConfigs = computed(() => {
    return storedConfigList.value
      .filter(
        (item) => !selectedType.value || item.configType === selectedType.value,
      )
      .filter((item) => {
        if (
          (selectedType.value === "BANNER" ||
            selectedType.value === "DAPP" ||
            selectedType.value === "NFT_COLLECTION") &&
          selectedChain.value
        ) {
          if (selectedChain.value === "All") return true;
          if (selectedChain.value === "koala") return !item.parentConfig;
          return item.parentConfig?.configName === selectedChain.value;
        }
        if (selectedType.value === "ASSET" && selectedChain.value) {
          if (selectedChain.value === "All") return true;
          const configChainName = getChainNameFromConfigItem(item, "eucId");
          return configChainName === selectedChain.value;
        }
        if (selectedType.value === "PARTNER" && selectedChain.value) {
          if (selectedChain.value === "All") return true;
          const configChainName = getChainNameFromConfigItem(item, "name");
          return configChainName === selectedChain.value;
        }
        return true;
      })
      .filter(
        (item) =>
          !searchValue.value ||
          item.configName
            .toLowerCase()
            .includes(searchValue.value.toLowerCase()),
      )
      .sort((a, b) => b.configId - a.configId);
  });

  return {
    storedConfigList,
    configTypes,
    providerGroups,
    providerNetworks,
    providerAccounts,
    selectedType,
    selectedChain,
    blockchains,
    searchValue,
    visibleItemsCount,
    cloneConfigData,
    setConfigList,
    setConfigTypes,
    setProviderGroups,
    setProviderNetworks,
    setProviderAccounts,
    setSelectedType,
    setSelectedChain,
    setBlockchains,
    setSearchValue,
    setVisibleItemsCount,
    setDefaultFilters,
    setCloneConfigData,
    filtredConfigs,
  };
});
