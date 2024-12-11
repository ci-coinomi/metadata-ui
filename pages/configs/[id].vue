<template>
  <main class="relative mt-3 bg-white p-4">
    <DesignConfigBannerSkeleton v-if="isLoading" />
    <ConfigEditorContainer v-else :original-config="originalConfig" />
  </main>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { getConfigs } from "@/api/configs";
import { useAppStore } from "@/stores/app";
import { useConfigStore } from "@/stores/configs";

definePageMeta({
  layout: "signedin",
});

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const configStore = useConfigStore();

const { storedConfigList } = storeToRefs(configStore);

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

onMounted(async () => {
  isLoading.value = true;
  await fetchConfigs();

  if (storedConfigList.value.length) {
    const configFromStore = storedConfigList.value.find(
      (originalConfig) => originalConfig.configId === Number(route.params.id),
    );

    if (!configFromStore) {
      router.push({
        path: "/error",
      });
      return;
    }

    originalConfig.value = cleared(configFromStore);

    appStore.setHeaderTitle(`Config ${originalConfig.value.configName}`);
  } else {
    appStore.setHeaderTitle("Configs were not loaded");
  }
  isLoading.value = false;
});
</script>
