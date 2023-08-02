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
          class="grid gap-4 grid-rows-2 grid-cols-4 w-11/12 shadow-md p-4 rounded-md"
        >
          <uiButton
            v-for="typeItem in configTypes"
            :key="typeItem"
            :value="typeItem"
            :class="typeItem === selectedType ? 'primary' : ''"
            @click="onTypesSelectHandler(typeItem)"
            >{{ typeItem }}</uiButton
          >
        </div>
        <div class="flex flex-col gap-4 w-11/12 justify-center items-center">
          <div class="flex gap-4">
            <UiButton
              v-for="chain in blockchains"
              :key="chain"
              :disabled="isLoading || filtredConfigs.length === 0"
              :class="chain === selectedChain ? 'primary' : ''"
              @click="onChainClickHandler(chain)"
            >
              {{ chain }}
            </UiButton>
          </div>

          <div class="flex w-full gap-4 justify-center items-center">
            <p>
              <span class="text-gray-500">Total count: </span
              >{{ configs.length }}
            </p>
            <p>
              <span class="text-gray-500">Selected type count: </span
              >{{ filtredConfigs.length }}
            </p>
            <UiButton
              class="success ml-auto"
              :disabled="isLoading || filtredConfigs.length === 0"
              @click="onCreateEmptyCloneHandler"
            >
              Create config
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
import { getConfigs, getConfigsTypes, cloneConfig } from "~/api/configs";
import { useStore } from "~/store";

definePageMeta({
  layout: "signedin",
});

const store = useStore();
const { $toast } = useNuxtApp();

const configs = ref([]);
const filtredConfigs = ref([]);
const selectedType = ref(null);
const isLoading = ref(true);
const visibleItemsCount = ref(30);
const blockchains = ref(["All", "KDA", "BTC", "ETH"]);
const selectedChain = ref("All");

// Config modal
const isTextInputModalVisible = ref(false);
const clonedConfigName = ref(null);

const configTypes = computed(() => store.configTypes);
const visibleConfigs = computed(() =>
  filtredConfigs.value.slice(0, visibleItemsCount.value),
);

// Handlers

const onChainClickHandler = (chain) => {
  selectedChain.value = chain;
  $toast.success(`Selected chain is ${chain}`);
};

const onTypesSelectHandler = (type) => {
  selectedType.value = type;
  store.setHeaderTitle(type);
  visibleItemsCount.value = 30;
  selectedChain.value = "All";

  filtredConfigs.value = configs.value.filter(
    (item) => item.configType === type,
  );
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
  if (payload) cloneConfigRequest(payload);
};

// Requests

const cloneConfigRequest = async (cloneName) => {
  const firstConfigInList = visibleConfigs.value[0];
  const emptyConfigFile = createEmptyConfigFileClone(firstConfigInList);
  const parentObjectEmptyClone = {
    configFile: emptyConfigFile,
    configType: firstConfigInList.configType,
  };

  const response = await cloneConfig(cloneName, parentObjectEmptyClone);

  if (response.configId) {
    filtredConfigs.value.unshift(response);
    configs.value.unshift(response);
    store.setConfigsList(configs.value);
    $toast.success(`New config was successfully created`);
  } else {
    $toast.error(`Creating clone error, status: ${response}`);
  }
  clonedConfigName.value = null;
};

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

const createEmptyConfigFileClone = (parentConfig) => {
  const obj = JSON.parse(parentConfig.configFile);

  const processValue = (value) => {
    if (typeof value === "boolean") {
      return false;
    } else if (typeof value === "number") {
      return 0;
    } else if (typeof value === "string" && value !== "banner") {
      return "";
    } else if (Array.isArray(value)) {
      return [""];
    } else if (typeof value === "object" && value !== null) {
      /* eslint-disable-next-line prefer-const */
      for (let key in value) {
        value[key] = processValue(value[key]);
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
