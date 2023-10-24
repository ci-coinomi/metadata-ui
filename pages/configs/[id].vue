<template>
  <main class="relative mt-3 bg-white p-4">
    <div v-if="isLoading" class="flex items-center justify-center">
      <ConfigBannerSkeleton />
    </div>
    <ConfigDetailsCard v-else :config="config" />
  </main>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { getConfigs } from "~/api/configs";
import { useAppStore } from "@/stores/app";
import { useConfigStore } from "@/stores/config";

definePageMeta({
  layout: "signedin",
});

const route = useRoute();
const appStore = useAppStore();
const configStore = useConfigStore();

const { storedConfigList } = storeToRefs(configStore);
const config = ref(null);
const isLoading = ref(true);

const fetchConfigs = async () => {
  if (storedConfigList.value.length === 0) {
    const response = await getConfigs();
    if (!Array.isArray(response)) {
      $toast.error(`Fetching configs error, status: ${response}`);
      isLoading.value = false;
      appStore.setHeaderTitle("Fetching configs error");
      return null;
    }
    const configsList = response.sort((a, b) => b.configId - a.configId);
    configStore.setConfigList(configsList);
  }
  config.value = cleared(
    storedConfigList.value.find(
      (config) => config.configId === Number(route.params.id),
    ),
  );
  appStore.setHeaderTitle(`Config ${config.value.configName}`);
  return null;
};

onMounted(async () => {
  isLoading.value = true;
  await fetchConfigs();
  isLoading.value = false;
});
</script>
