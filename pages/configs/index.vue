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
        <ConfigSearchSection />

        <ConfigListItem
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
  visibleConfigs,
  selectedType,
  selectedChain,
  storedSearch,
  visibleItemsCount,
} = storeToRefs(configStore);

/**
 * Lazy-load, increasing visible configs count after scrolling to the bottom of the page.
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

/**
 * Get configs if they doesn't exist in store
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

/**
 * Get all providers data in one place
 */
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
  configStore.setDefaultFilters();
});

/**
 * Update filters after clicking on 'go back' & 'go forward' browser buttons.
 * If values are different - set to store value from query.
 */
watch(
  () => route.query,
  () => {
    const setIfDifferent = (queryParam, currentValue, setter) => {
      if (queryParam && currentValue.value !== queryParam) {
        setter(queryParam);
      }
    };

    setIfDifferent(route.query.type, selectedType, configStore.setSelectedType);
    setIfDifferent(
      route.query.chain,
      selectedChain,
      configStore.setSelectedChain,
    );
    setIfDifferent(
      route.query.search,
      storedSearch,
      configStore.setStoredSearch,
    );

    /**
     * If we returned to pure /config without query
     */
    const noQueryParams =
      !route.query.search && !route.query.type && !route.query.chain;

    if (noQueryParams) {
      router.push("/configs");
      configStore.setDefaultFilters();
    }
  },
);

/**
 * Setting search value, selectedType and selectedChain onMount
 */
const filterListByQuery = () => {
  const query = route.query;

  if (query.search) configStore.setStoredSearch(query.search);

  if (query.type) {
    configStore.setSelectedType(query.type);
    appStore.setHeaderTitle(query.type);
  }

  if (query.chain) configStore.setSelectedChain(query.chain);
};
</script>
