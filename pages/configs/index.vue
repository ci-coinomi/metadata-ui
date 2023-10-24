<template>
  <main
    class="mt-3 flex flex-col items-center justify-center gap-6 rounded bg-white p-4 shadow-md"
  >
    <DesignConfigIndexSkeleton v-if="isLoading" />

    <h2
      v-else-if="
        !isLoading && (!storedConfigList || storedConfigList.length === 0)
      "
      class="flex items-center justify-center text-xl"
    >
      Configs were not recieved
    </h2>

    <div v-else class="flex w-full flex-col items-center justify-center gap-6">
      <ConfigTypesSection />

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
import { storeToRefs } from "pinia";
import { createEmptyConfigFileClone } from "~/utils/utilfunc";
import {
  getConfigs,
  getProviderGroups,
  getProviderNetworks,
  getProviderAccounts,
} from "~/api/configs";
import { useAppStore } from "@/stores/app";
import { useConfigStore } from "@/stores/configs";

definePageMeta({
  layout: "signedin",
});

const appStore = useAppStore();
const configStore = useConfigStore();
const { $toast } = useNuxtApp();
const router = useRouter();
const route = useRoute();

const isLoading = ref(true);

const {
  storedConfigList,
  providerGroups,
  providerNetworks,
  providerAccounts,
  filtredConfigs,
  selectedType,
  selectedChain,
  searchValue,
  visibleItemsCount,
} = storeToRefs(configStore);

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

  if (filtredConfigs.value.length === 0) return false;
  if (visibleConfigs.value.some((el) => el.parentConfig)) return false;

  return true;
});

// Handlers

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
    configStore.setVisibleItemsCount((visibleItemsCount.value += 30));
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

  configStore.setCloneConfigData(cloneData);
  router.push({
    path: "/configs/create",
    query: {
      type: selectedType.value,
    },
  });
};

// Requests

/*
Fetch configs if store.configsList is empty.
*/
const fetchConfigs = async () => {
  isLoading.value = true;
  if (storedConfigList.value.length === 0) {
    const response = await getConfigs();
    if (response.success) {
      const configs = response.data.sort((a, b) => b.configId - a.configId);
      configStore.setConfigList(configs);
    } else {
      $toast.error(`Fetching configs error, status: ${response.status}`);
    }
  }
  isLoading.value = false;
};

const getProvidersData = async () => {
  if (!providerGroups.value) {
    const groupResponse = await getProviderGroups();
    if (groupResponse.success) {
      configStore.setProviderGroups(groupResponse.data);
    } else {
      $toast.error(
        `Getting provider groups error, status: ${groupResponse.status}`,
      );
    }
  }

  if (!providerNetworks.value) {
    const networksResponse = await getProviderNetworks();
    if (networksResponse.success) {
      configStore.setProviderNetworks(networksResponse.data);
    } else {
      $toast.error(
        `Getting provider networks error, status: ${networksResponse.status}`,
      );
    }
  }

  if (!providerAccounts.value) {
    const accountsResponse = await getProviderAccounts();
    if (accountsResponse.success) {
      configStore.setProviderAccounts(accountsResponse.data);
    } else {
      $toast.error(
        `Getting provider accounts error, status: ${accountsResponse.status}`,
      );
    }
  }
};

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
  appStore.setHeaderTitle("Select config type");
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

// TODO
watch(
  () => route.query,
  () => {
    if (route.query.type && selectedType.value !== route.query.type) {
      configStore.setSelectedType(route.query.type);
      getChainsFromFiltredConfigs(filtredConfigs.value);
    }

    if (route.query.chain && selectedChain.value !== route.query.chain) {
      configStore.setSelectedChain(route.query.chain);
    }

    if (route.query.search && searchValue.value !== route.query.search) {
      configStore.setSearchValue(route.query.search);
    }

    if (!route.query.search) configStore.setSearchValue(null);

    // If there is no type and no search (we returned to pure /config without query)
    if (!route.query.search && !route.query.type && !route.query.chain) {
      router.push("/configs");
      configStore.setDefaultFilters();
    }
  },
);

/*
For updating query params after changing searchValue.
*/
// TODO
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

  if (!query.type && !query.chain && !query.search) {
    router.push({
      name: route.name,
      query: {},
    });
    return;
  }

  if (query.search) configStore.setSearchValue(query.search);

  if (query.type) {
    configStore.setSelectedType(query.type);
    appStore.setHeaderTitle(query.type);
    const configsToBeFiltred = storedConfigList.value.filter(
      (item) => item.configType === query.type,
    );
    getChainsFromFiltredConfigs(configsToBeFiltred);
  }

  if (query.chain) configStore.setSelectedChain(query.chain);
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
    configStore.setSelectedChain(null);
    configStore.setBlockchains([]);
  } else if (chainsArray.length === 1) {
    configStore.setSelectedChain(chainsArray[0]);
    configStore.setBlockchains(chainsArray);
  } else {
    configStore.setSelectedChain("All");
    configStore.setBlockchains(["All", ...chainsArray]);
  }
};
</script>
