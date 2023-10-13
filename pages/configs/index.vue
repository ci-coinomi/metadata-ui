<template>
  <main
    class="mt-3 flex flex-col items-center justify-center gap-6 rounded bg-white p-4 shadow-md"
  >
    <configIndexSkeleton v-if="isLoading" />

    <h2
      v-else-if="
        !isLoading && (!storedConfigList || storedConfigList.length === 0)
      "
      class="flex items-center justify-center text-xl"
    >
      Configs were not recieved
    </h2>

    <div v-else class="flex w-full flex-col items-center justify-center gap-6">
      <div class="flex flex-col items-center gap-4 rounded-md p-4 shadow-md">
        <div class="w-full">
          <div v-if="configTypes.length === 0">
            <h2 class="text-center text-xl">Config types were not recieved</h2>
          </div>
          <div v-else class="grid w-full grid-cols-4 grid-rows-2 gap-4">
            <uiButton
              v-for="typeItem in configTypes"
              :key="typeItem"
              :value="typeItem"
              class="small"
              :class="typeItem === selectedType ? 'primary' : ''"
              @click="onTypesSelectHandler(typeItem)"
              >{{ typeItem }}</uiButton
            >
          </div>
        </div>
        <div
          v-if="!isBlockchainBlockHidden"
          class="flex w-full justify-center gap-4"
        >
          <UiButton
            v-for="chain in blockchains"
            :key="chain"
            :disabled="isLoading"
            :class="chain === selectedChain ? 'primary' : ''"
            class="my-auto"
            @click="onChainClickHandler(chain)"
          >
            {{ chain }}
          </UiButton>
        </div>
      </div>
      <div class="flex w-full flex-col items-center justify-center gap-2">
        <div class="flex w-full items-center justify-between gap-4">
          <div class="mr-aut flex gap-4 py-2">
            <p class="w-[135px]">
              <span class="text-gray-500">Total count: </span
              >{{ storedConfigList.length }}
            </p>
            <p class="w-[155px]">
              <span class="text-gray-500">Filtered count: </span
              >{{ filtredConfigs.length }}
            </p>
          </div>
          <UiInputField
            v-model="searchValue"
            :placeholder="'Search by config name...'"
            :type="'text'"
          />
          <UiButton
            v-if="isCreateEmptyConfigVisible"
            class="success whitespace-nowrap"
            @click="onCreateEmptyCloneHandler"
          >
            Create config
          </UiButton>
        </div>

        <configListItem
          v-for="(config, index) in visibleConfigs"
          :key="config.configId"
          :config="config"
          :config-index="index"
          class="w-full"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import { createEmptyConfigFileClone } from "~/utils/utilfunc";
import {
  getConfigs,
  getConfigsTypes,
  getProviderGroup,
  getProviderNetworks,
} from "~/api/configs";
import { useStore } from "~/store";

definePageMeta({
  layout: "signedin",
});

const store = useStore();
const { $toast } = useNuxtApp();
const router = useRouter();
const route = useRoute();

const selectedType = ref(null);
const isLoading = ref(true);
const visibleItemsCount = ref(30);
const blockchains = ref([]);
const selectedChain = ref(null);
const searchValue = ref("");

const configTypes = computed(() => store.configTypes);
const storedConfigList = computed(() => store.configsList);
const providersGroups = computed(() => store.providersGroups);
const providersNetworks = computed(() => store.providersNetworks);

/*
Filtering configs by configType - by Chain - by Name and sorting by id.
Filter depends on selectedType, selectedChain, searchValue and configs
*/

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
        item.configName.toLowerCase().includes(searchValue.value.toLowerCase()),
    )
    .sort((a, b) => b.configId - a.configId);
});

/*
Lazy-load, works with handleScroll().
Depends on filtredConfigs and visibleItemsCount.
*/
const visibleConfigs = computed(() =>
  filtredConfigs.value.slice(0, visibleItemsCount.value),
);

/*
Shown only for config types without parentConfig
*/
const isCreateEmptyConfigVisible = computed(() => {
  if (selectedType.value === "CONFIGURED_PROVIDERS") return true;
  if (
    filtredConfigs.value.length === 0 ||
    visibleConfigs.value.some((el) => el.parentConfig)
  )
    return false;
  return true;
});
const isBlockchainBlockHidden = computed(
  () => isLoading.value || blockchains.value.length === 0,
);

// Handlers

const onChainClickHandler = (chain) => {
  selectedChain.value = chain;
  visibleItemsCount.value = 30;
  selectedChain.value === "All"
    ? store.setHeaderTitle(`${selectedType.value}`)
    : store.setHeaderTitle(
        `${selectedType.value}, chain ${selectedChain.value}`,
      );
  updateQueryParams();
};

/*
Set all values to default (accept selectedType) and get chains list as well.
*/
const onTypesSelectHandler = (type) => {
  searchValue.value = "";
  selectedChain.value = null;
  selectedType.value = type;
  visibleItemsCount.value = 30;
  store.setHeaderTitle(type);

  getChainsFromFiltredConfigs(filtredConfigs.value);
  updateQueryParams();
};

/*
Print more configs (+30) after scrolling to the bottom of the page by increasing visibleItemsCount.
*/
const handleScroll = () => {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop;
  if (
    scrollTop + windowHeight >= documentHeight &&
    visibleItemsCount.value < filtredConfigs.value.length
  ) {
    visibleItemsCount.value += 30;
  }
};

/*
Awailable for configTypes were configs have no parentConfig.
Setting all fields of visibleConfigs.value[0] as empty and redirect to /configs/create
*/
const onCreateEmptyCloneHandler = () => {
  const configToBePassed = visibleConfigs.value[0];
  const configFileToBePassed = createEmptyConfigFileClone(
    configToBePassed.configFile,
  );

  const cloneData = {
    config: configToBePassed,
    configFile: configFileToBePassed,
    configImages: [],
  };

  store.setCloneConfigData(cloneData);
  router.push({
    path: "/configs/create",
    query: {
      type: selectedType.value,
    },
  });
};

// Requests

/*
Fetch config types if store.configTypes is empty
*/
const fetchConfigTypes = async () => {
  if (store.configTypes.length === 0) {
    const response = await getConfigsTypes();
    if (Array.isArray(response)) {
      store.setConfigTypes(response);
    } else {
      $toast.error(`Fetching config types error, status: ${response}`);
    }
  }
};

/*
Fetch configs if store.configsList is empty.
*/
const fetchConfigs = async () => {
  isLoading.value = true;
  if (store.configsList.length === 0) {
    const response = await getConfigs();
    if (Array.isArray(response)) {
      const configs = response.sort((a, b) => b.configId - a.configId);
      store.setConfigsList(configs);
    } else {
      $toast.error(`Fetching configs error, status: ${response}`);
    }
  }
  isLoading.value = false;
};

const getProvidersData = async () => {
  if (
    providersGroups.value.length === 0 ||
    providersNetworks.value.length === 0
  ) {
    const networksResponse = await getProviderNetworks();
    const groupResponse = await getProviderGroup();
    store.setProvidersGroups(groupResponse);
    store.setProvidersNetworks(networksResponse);
  }
};

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
  store.setHeaderTitle("Select config type");
  await fetchConfigTypes();
  await fetchConfigs();
  filterListByQuery();
  await getProvidersData();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

// Watchers

/*
Mostly for updating filtredConfigs by clicking on 'go back' & 'go forward' browser buttons
*/

watch(
  () => route.query,
  () => {
    if (route.query.type && selectedType.value !== route.query.type) {
      selectedType.value = route.query.type;
      getChainsFromFiltredConfigs(filtredConfigs.value);
    }

    if (route.query.chain && selectedChain.value !== route.query.chain) {
      selectedChain.value = route.query.chain;
    }

    if (route.query.search && searchValue.value !== route.query.search) {
      searchValue.value = route.query.search;
    }

    if (!route.query.search) searchValue.value = "";

    if (!route.query.search && !route.query.type) {
      // If there is no type and no search (we returned to pure /config without query)
      router.push("/configs");
      searchValue.value = "";
      selectedType.value = null;
      selectedChain.value = null;
      visibleItemsCount.value = 30;
      blockchains.value = [];
    }
  },
);

/*
For updating query params after changing searchValue.
*/
watch(searchValue, () => {
  if (searchValue.value !== "") {
    router.push({
      name: route.name,
      query: {
        ...route.query,
        search: searchValue.value,
      },
    });
  }

  if (!searchValue.value) {
    removeUnusedRouterQuery("search");
  }
});

// Utils

/*
Setting searchValue, selectedType and selectedChain from the query on the first load of the page (onMount)
*/
const filterListByQuery = () => {
  const query = route.query;

  if (!query.type && !query.search) {
    router.push({
      name: route.name,
      query: {},
    });
    return;
  }

  if (query.search) searchValue.value = query.search;

  if (query.type) {
    selectedType.value = query.type;
    store.setHeaderTitle(query.type);
    const configsToBeFiltred = storedConfigList.value.filter(
      (item) => item.configType === query.type,
    );
    getChainsFromFiltredConfigs(configsToBeFiltred);
  }

  if (query.chain) selectedChain.value = query.chain;
};

/*
Push selectedChain and selectedType to query.
*/
const updateQueryParams = async () => {
  const query = {
    type: selectedType.value,
  };

  if (selectedChain.value) query.chain = selectedChain.value;

  await nextTick();

  router.push({
    name: route.name,
    query,
  });
};

/*
Remove the passed parameter from query
*/
const removeUnusedRouterQuery = (queryToRemove) => {
  const updQuery = {
    ...route.query,
  };
  delete updQuery[queryToRemove];
  router.push({
    name: route.name,
    query: updQuery,
  });
};

/*
Getting every unique chain name from config.configFile.eucId's in configs array.
If we have no chain names in eucId after '@' - hide chainsBlock
If we have only one chain type in filtredConfigs - show chainsBlock and select this chain
If there are more than 1 chain in filtredConfigs - add 'All' (selected by default) and show chains in chainsBlock

For BANNER - search for parentConfig name (blockchains) or 'koala' if !parentConfig
*/
const getChainsFromFiltredConfigs = (configs) => {
  const chainsSet = new Set();
  if (
    selectedType.value === "BANNER" ||
    selectedType.value === "DAPP" ||
    selectedType.value === "NFT_COLLECTION"
  ) {
    configs.forEach((item) => {
      const chainItem = item.parentConfig?.configName || "koala";
      if (chainItem) chainsSet.add(chainItem);
    });
  } else if (selectedType.value === "ASSET") {
    configs.forEach((item) => {
      const chainItem = getChainNameFromConfigItem(item, "eucId");
      if (chainItem) chainsSet.add(chainItem);
    });
  } else if (selectedType.value === "PARTNER") {
    configs.forEach((item) => {
      const chainItem = getChainNameFromConfigItem(item, "name");
      if (chainItem) chainsSet.add(chainItem);
    });
  }
  const chainsArray = Array.from(chainsSet);

  if (chainsArray.length === 0) {
    selectedChain.value = null;
    blockchains.value = [];
  } else if (chainsArray.length === 1) {
    selectedChain.value = chainsArray[0];
    blockchains.value = chainsArray;
  } else {
    selectedChain.value = "All";
    blockchains.value = ["All", ...chainsArray];
  }
};

/*
Get chain name from passed config.
Specifically from config.configFile.eucId, (value after '@')
*/
const getChainNameFromConfigItem = (config, searchPlace) => {
  try {
    if (searchPlace === "eucId") {
      const configObj = JSON.parse(config.configFile);
      const eucId = configObj.eucId;
      if (eucId && eucId.includes("@")) {
        const splitValues = eucId.split("@");
        const chainName = splitValues[1];
        if (chainName) return chainName;
      }
    } else if (searchPlace === "name") {
      if (config.configName && config.configName.includes("@")) {
        const splitValues = config.configName.split("@");
        const chainName = splitValues[1];
        if (chainName) return chainName;
      } else if (config.configName) {
        return 'other'
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("JSON error:", config, error);
  }
};
</script>
