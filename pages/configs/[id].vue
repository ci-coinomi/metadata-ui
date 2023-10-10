<template>
  <main class="relative mt-3 bg-white p-4">
    <div v-if="isLoading" class="flex items-center justify-center">
      <ConfigBannerSkeleton />
    </div>
    <ConfigDetailsCard v-else :config="config" />
  </main>
</template>
<script setup>
import { getConfigs } from "~/api/configs";
import { useStore } from "~/store";

definePageMeta({
  layout: "signedin",
});

const route = useRoute();
const store = useStore();

const config = ref(null);
const isLoading = ref(true);

const fetchConfigs = async () => {
  if (store.configsList.length === 0) {
    const response = await getConfigs();
    if (!Array.isArray(response)) {
      $toast.error(`Fetching configs error, status: ${response}`);
      isLoading.value = false;
      store.setHeaderTitle("Fetching configs error");
      return null;
    }
    const configsList = response.sort((a, b) => b.configId - a.configId);
    store.setConfigsList(configsList);
  }
  config.value = cleared(
    store.configsList.find(
      (config) => config.configId === Number(route.params.id),
    ),
  );
  store.setHeaderTitle(`Config ${config.value.configName}`);
  return null;
};

onMounted(async () => {
  isLoading.value = true;
  await fetchConfigs();
  isLoading.value = false;
});
</script>
