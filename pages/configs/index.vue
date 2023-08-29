<template>
  <main
    class="flex flex-col justify-center items-center gap-6 bg-white p-4 mt-3 shadow-md rounded"
  >
    <configIndexSkeleton v-if="isLoading" />

    <h2
      v-else-if="!isLoading && (!configs || configs.length === 0)"
      class="text-xl flex justify-center items-center"
    >
      Configs were not recieved
    </h2>

    <div v-else class="flex flex-col justify-center items-center gap-6 w-full">
      <div
        class="w-11/12 shadow-md p-4 rounded-md flex flex-col items-center gap-4"
      >
        <div class="w-full">
          <div v-if="configTypes.length === 0">
            <h2 class="text-xl text-center">Config types were not recieved</h2>
          </div>
          <div v-else class="grid gap-4 grid-rows-2 grid-cols-4 w-full">
            <uiButton
              v-for="typeItem in configTypes"
              :key="typeItem"
              :value="typeItem"
              :class="typeItem === selectedType ? 'primary' : ''"
              @click="onTypesSelectHandler(typeItem)"
              >{{ typeItem }}</uiButton
            >
          </div>
        </div>
        <div
          v-if="!isBlockchainBlockHidden"
          class="flex gap-4 w-full justify-center"
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
      <div class="flex flex-col gap-2 w-11/12 justify-center items-center">
        <div class="flex w-full justify-between items-center gap-4">
          <div class="py-2 mr-aut flex gap-4">
            <p class="w-[135px]">
              <span class="text-gray-500">Total count: </span
              >{{ configs.length }}
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
            v-if="!isCreateEmptyConfigHidden"
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
import { getConfigs, getConfigsTypes } from "~/api/configs";
import { useStore } from "~/store";

definePageMeta({
  layout: "signedin",
});

const store = useStore();
const { $toast } = useNuxtApp();
const router = useRouter();
const route = useRoute();

const configs = ref([]);
const selectedType = ref(null);
const isLoading = ref(true);
const visibleItemsCount = ref(30);
const blockchains = ref([]);
const selectedChain = ref(null);
const searchValue = ref("");

const configTypes = computed(() => store.configTypes);

/*
Filtering configs by configType - by Chain - by Name and sorting by id.
Filter depends on selectedType, selectedChain, searchValue and configs
*/
const filtredConfigs = computed(() =>
  configs.value
    .filter((item) =>
      selectedType.value ? item.configType === selectedType.value : item,
    )
    .filter((item) => {
      if (selectedChain.value && selectedChain.value !== "All") {
        const configChainName = getChainNameFromConfigItem(item);
        return configChainName === selectedChain.value;
      } else {
        return item;
      }
    })
    .filter((item) =>
      searchValue.value
        ? item.configName
            .toLowerCase()
            .includes(searchValue.value.toLowerCase())
        : item,
    )
    .sort((a, b) => b.configId - a.configId),
);

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
const isCreateEmptyConfigHidden = computed(
  () =>
    isLoading.value ||
    filtredConfigs.value.length === 0 ||
    visibleConfigs.value.some((el) => el.parentConfig),
);

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
  const firstConfigInList = visibleConfigs.value[0];
  const emptyConfigFile = createEmptyConfigFileClone(
    firstConfigInList.configFile,
  );

  const cloneData = {
    config: firstConfigInList,
    configFile: emptyConfigFile,
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
  if (store.configsList.length > 0) {
    configs.value = store.configsList;
  } else {
    const response = await getConfigs();
    if (Array.isArray(response)) {
      configs.value = response.sort((a, b) => b.configId - a.configId);
      store.setConfigsList(configs.value);
    } else {
      $toast.error(`Fetching configs error, status: ${response}`);
    }
  }
  isLoading.value = false;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  store.setHeaderTitle("Select config type");
  fetchConfigTypes();
  fetchConfigs();
  filterListByQuery();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

// Watchers

/*
Update configs if store.configsList was changed by creating new config or deleting one.
All these functions (here and in /configs/[id] page as well) change precisely store.configsList.
*/
watch(
  () => store.configsList,
  () => {
    configs.value = store.configsList;
  },
);

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
    const configsToBeFiltred = configs.value.filter(
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
*/
const getChainsFromFiltredConfigs = (configs) => {
  const chainsSet = new Set();
  configs.forEach((item) => {
    const chainItem = getChainNameFromConfigItem(item);
    if (chainItem) chainsSet.add(chainItem);
  });
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
const getChainNameFromConfigItem = (config) => {
  try {
    const configObj = JSON.parse(config.configFile);
    const eucId = configObj.eucId;
    if (eucId && eucId.includes("@")) {
      const splitValues = eucId.split("@");
      const chainName = splitValues[1];
      if (chainName) return chainName;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("JSON error:", config, error);
  }
};
</script>
