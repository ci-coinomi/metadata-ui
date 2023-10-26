<template>
  <main class="relative mt-3 bg-white p-4">
    <DesignConfigBannerSkeleton v-if="isLoading" />
    <ConfigEditorContainer v-else :original-config="originalConfig" />
  </main>
</template>
<script setup>
import { storeToRefs } from "pinia";
import {
  getConfigs,
  getProviderGroups,
  getProviderNetworks,
  getProviderAccounts,
} from "@/api/configs";
import { useAppStore } from "@/stores/app";
import { useConfigStore } from "@/stores/configs";

definePageMeta({
  layout: "signedin",
});

const route = useRoute();
const appStore = useAppStore();
const configStore = useConfigStore();

const { storedConfigList, providerGroups, providerNetworks, providerAccounts } =
  storeToRefs(configStore);

const originalConfig = ref(null);
const isLoading = ref(true);

/**
 * Get configs if they don't exist in store
 */
const fetchConfigs = async () => {
  if (storedConfigList.value.length === 0) {
    const response = await getConfigs();
    if (response.success) {
      configStore.setConfigList(response.data);
    } else {
      $toast.error(`Fetching configs error, status: ${response.status}`);
    }
  }
};

/**
 * Get all providers data in one place if they don't exist in store.
 */
const fetchProvidersData = async () => {
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
  isLoading.value = true;
  await fetchConfigs();
  await fetchProvidersData();

  if (storedConfigList.value.length) {
    const configFromStore = storedConfigList.value.find(
      (originalConfig) => originalConfig.configId === Number(route.params.id),
    );

    if (configFromStore) {
      originalConfig.value = cleared(configFromStore);
    }

    appStore.setHeaderTitle(`Config ${originalConfig.value.configName}`);
  } else {
    appStore.setHeaderTitle("Configs were not loaded");
  }
  isLoading.value = false;
});
</script>
