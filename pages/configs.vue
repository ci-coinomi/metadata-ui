<template>
  <div>
    <modalTextInput
      v-if="isTextInputModalVisible"
      v-model="clonedConfigName"
      @is-modal-confirmed="addNameModalHandler"
    />
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

      <div
        v-else
        class="flex flex-col justify-center items-center gap-6 w-full"
      >
        <div
          class="w-11/12 shadow-md p-4 rounded-md flex flex-col items-center gap-4"
        >
          <div class="grid gap-4 grid-rows-2 grid-cols-4 w-full">
            <uiButton
              v-for="typeItem in configTypes"
              :key="typeItem"
              :value="typeItem"
              :class="typeItem === selectedType ? 'primary' : ''"
              @click="onTypesSelectHandler(typeItem)"
              >{{ typeItem }}</uiButton
            >
          </div>
          <div
            v-if="!isBlockchainBlockHidden"
            class="flex gap-4 w-full justify-center"
          >
            <UiButton
              v-for="chain in blockchains"
              :key="chain"
              :disabled="isLoading || filtredConfigs.length === 0"
              :class="chain === selectedChain ? 'primary' : ''"
              class="my-auto"
              @click="onChainClickHandler(chain)"
            >
              {{ chain }}
            </UiButton>
          </div>
        </div>
        <div class="flex flex-col gap-4 w-11/12 justify-center items-center">
          <div class="flex w-full justify-between items-center">
            <div class="py-2 mr-aut flex gap-4">
              <p>
                <span class="text-gray-500">Total count: </span
                >{{ configs.length }}
              </p>
              <p>
                <span class="text-gray-500">Selected type count: </span
                >{{ filtredConfigs.length }}
              </p>
            </div>
            <UiButton
              v-if="!isCreateEmptyConfigHidden"
              class="success"
              @click="onCreateEmptyCloneHandler"
            >
              Create empty config
            </UiButton>
          </div>

          <configListItem
            v-for="config in visibleConfigs"
            :key="config.configId"
            :config="config"
            class="w-full"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { getConfigs, getConfigsTypes } from "~/api/configs";
import { useStore } from "~/store";

definePageMeta({
  layout: "signedin",
});

const store = useStore();
const { $toast } = useNuxtApp();
const router = useRouter();

const configs = ref([]);
const filtredConfigs = ref([]);
const selectedType = ref(null);
const isLoading = ref(true);
const visibleItemsCount = ref(30);
const blockchains = ref([]);
const selectedChain = ref(null);

// Config modal
const isTextInputModalVisible = ref(false);
const clonedConfigName = ref(null);

const configTypes = computed(() => store.configTypes);
const visibleConfigs = computed(() =>
  filtredConfigs.value.slice(0, visibleItemsCount.value),
);
const isCreateEmptyConfigHidden = computed(
  // Shown only for config types without parentConfig
  // Also hidden if parentConfig is only item in the filtredConfigList
  () =>
    isLoading.value ||
    filtredConfigs.value.length === 0 ||
    visibleConfigs.value.some((el) => el.parentConfig) ||
    store.toParentNavigateData,
);

const isBlockchainBlockHidden = computed(
  () =>
    /*
  Visible if in all configFile elements exist eucId-field in configfile with '@',
  this is our filter param
  */
    isLoading.value ||
    filtredConfigs.value.length === 0 ||
    blockchains.value.length === 0,
);

// Handlers

const onChainClickHandler = (chain) => {
  selectedChain.value = chain;

  if (selectedChain.value === "All") {
    filtredConfigs.value = configs.value.filter(
      (item) => item.configType === selectedType.value,
    );
  } else {
    filtredConfigs.value = configs.value.filter((item) => {
      const configChainName = getChainNameFromConfigItem(item);
      return (
        item.configType === selectedType.value &&
        configChainName === selectedChain.value
      );
    });
  }
};

const onTypesSelectHandler = (type) => {
  selectedType.value = type;
  store.setHeaderTitle(type);
  visibleItemsCount.value = 30;
  store.setToParentNavigateData(null);

  filtredConfigs.value = configs.value.filter(
    (item) => item.configType === type,
  );

  getChainsFromFiltredConfigs(filtredConfigs.value);
};

const handleScroll = () => {
  // Load more configs after scrolling to the bottom of the page
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

const onCreateEmptyCloneHandler = () => {
  isTextInputModalVisible.value = true;
};

const addNameModalHandler = (payload) => {
  isTextInputModalVisible.value = false;

  if (payload) {
    const firstConfigInList = visibleConfigs.value[0];
    const emptyConfigFile = createEmptyConfigFileClone(firstConfigInList);

    const cloneData = {
      cloneName: payload,
      parentConfig: visibleConfigs.value[0],
      configFile: emptyConfigFile,
      parentConfigImages: [],
    };

    store.setCloneConfigData(cloneData);
    router.push("create");
  }
};

// Requests

const fetchConfigTypes = async () => {
  if (store.configsList.length === 0) {
    const response = await getConfigsTypes();
    if (Array.isArray(response)) {
      store.setConfigTypes(response);
    } else {
      $toast.error(`Fetching config types error, status: ${response}`);
    }
  }
};

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
  if (store.toParentNavigateData) {
    displayOnlyParentConfig();
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

watch(
  () => store.configsList,
  () => {
    configs.value = store.configsList;
    filtredConfigs.value = configs.value.filter(
      (item) => item.configType === selectedType.value,
    );
  },
);

watch(
  () => store.toParentNavigateData,
  () => {
    if (store.toParentNavigateData) displayOnlyParentConfig();
  },
);

const displayOnlyParentConfig = () => {
  // If toParentNavigateData was set - hide chains block, show only parent config
  // and set all filters as default. To hide parent config user will need to set selectedType again
  configs.value = store.configsList;
  selectedType.value = null;
  selectedChain.value = null;
  blockchains.value = [];
  filtredConfigs.value = configs.value.filter(
    (item) => item.configId === store.toParentNavigateData.configId,
  );
};

const getChainsFromFiltredConfigs = (configs) => {
  // Getting every unique chain name from config.configFile.eucId's in configs array
  const chainsSet = new Set();
  configs.forEach((item) => {
    const chainItem = getChainNameFromConfigItem(item);
    if (chainItem) chainsSet.add(chainItem);
  });
  const chainsArray = Array.from(chainsSet);

  /*
  If we have no chain names in eucId after '@' - hide chainsBlock
  If we have only one chain type in filtredConfigs - show chainsBlock and select this chain
  If there are more than 1 chain in filtredConfigs - add 'All' (selected by default) and show chains in chainsBlock
  */
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

const getChainNameFromConfigItem = (config) => {
  // Get chain name from config.configFile.eucId (value after '@')
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

const createEmptyConfigFileClone = (parentConfig) => {
  const obj = JSON.parse(parentConfig.configFile);

  const processValue = (value, key) => {
    if (key === "@type") {
      return value;
    } else if (typeof value === "boolean") {
      return false;
    } else if (typeof value === "number") {
      return 0;
    } else if (typeof value === "string") {
      return "";
    } else if (Array.isArray(value)) {
      return [""];
    } else if (typeof value === "object" && value !== null) {
      /* eslint-disable-next-line prefer-const */
      for (let key in value) {
        value[key] = processValue(value[key], key);
      }
      return value;
    } else {
      return value;
    }
  };

  const processedObj = processValue(obj);
  const processedJSONString = JSON.stringify(processedObj);
  return processedJSONString;
};
</script>
