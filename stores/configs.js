import { defineStore } from "pinia";

export const useConfigStore = defineStore("config", () => {
  /* RESPONSES */
  const storedConfigList = ref([]);
  const configTypes = ref([]);

  /* CONFIG FILTERS */
  const selectedType = ref(null);
  const selectedChain = ref(null);
  const storedSearch = ref(null);
  const visibleItemsCount = ref(30);

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

  /* CONFIG FILTERS */
  const setSelectedType = (payload) => {
    selectedType.value = payload;
  };
  const setSelectedChain = (payload) => {
    selectedChain.value = payload;
  };
  const setStoredSearch = (payload) => {
    storedSearch.value = payload;
  };
  const setVisibleItemsCount = (payload) => {
    visibleItemsCount.value = payload;
  };
  const setDefaultFilters = () => {
    selectedType.value = null;
    selectedChain.value = null;
    storedSearch.value = null;
    visibleItemsCount.value = 30;
  };

  /* GETTERS */

  /**
   * Filter configs by type -> by chain -> by search -> sort by id (=== creation order)
   */
  const filtredConfigs = computed(() => {
    const byType = (item) =>
      !selectedType.value || item.configType === selectedType.value;

    const byChain = (item) => {
      if (blockchains.value.length === 0) return true;

      const defaultChain = blockchains.value.includes("koala")
        ? "koala"
        : blockchains.value.includes("other")
          ? "other"
          : null;

      if (selectedChain.value === "all") return true;
      if (selectedChain.value === defaultChain) return !item.configChain;
      return item.configChain?.shortChainName === selectedChain.value;
    };

    const bySearch = (item) =>
      !storedSearch.value ||
      item.configName.toLowerCase().includes(storedSearch.value.toLowerCase());

    return storedConfigList.value
      .filter(byType)
      .filter(byChain)
      .filter(bySearch)
      .sort((a, b) => b.configId - a.configId);
  });

  /**
   * Get all configs with type === 'blockchain'
   */
  const blockchainConfigsList = computed(() =>
    storedConfigList.value
      .filter((item) => item.configType === "BLOCKCHAIN")
      .map((item) => {
        const configFileObject = JSON.parse(item.configFile);
        item.eucId = configFileObject.eucId;
        return cleared(item);
      }),
  );

  /**
   * Get all closest config blockchains and use them for 'blockchains' sorting block.
   * Add new field to typeToDefaultChain with default value (for configs without blockchain config in parents chain) to enable filtration by chain for config type.
   * config.configChain - value from serializeConfigs function, not from BE.
   */
  const blockchains = computed(() => {
    const chainsSet = new Set();
    const typeToDefaultChain = {
      BANNER: "koala",
      DAPP: "koala",
      NFT_COLLECTION: "koala",
      ASSET: "other",
      PARTNER: "other",
    };

    const defaultChain = typeToDefaultChain[selectedType.value];

    if (defaultChain) {
      storedConfigList.value.forEach((item) => {
        if (item.configType !== selectedType.value) return;
        const chainItem = item.configChain?.shortChainName || defaultChain;
        chainsSet.add(chainItem);
      });
    }

    const chainsArray = Array.from(chainsSet);

    if (chainsArray.length === 0) {
      setSelectedChain(null);
      return [];
    } else if (chainsArray.length === 1) {
      setSelectedChain(chainsArray[0]);
      return chainsArray;
    } else {
      setSelectedChain("all");
      return ["all", ...chainsArray];
    }
  });

  /**
   * Lazy-load for config list.
   */
  const visibleConfigs = computed(() =>
    filtredConfigs.value.slice(0, visibleItemsCount.value),
  );

  return {
    storedConfigList,
    configTypes,
    selectedType,
    selectedChain,
    storedSearch,
    visibleItemsCount,
    setConfigList,
    setConfigTypes,
    setSelectedType,
    setSelectedChain,
    setStoredSearch,
    setVisibleItemsCount,
    setDefaultFilters,
    visibleConfigs,
    filtredConfigs,
    blockchains,
    blockchainConfigsList,
  };
});
