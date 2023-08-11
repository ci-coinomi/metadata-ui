<template>
  <main class="bg-white p-4 mt-3 relative">
    <UiButton class="absolute left-[-200px] top-[0px]">
      <img src="~/assets/icons/icon-return.svg" class="w-4 h-4" alt="users" />
    </UiButton>
    <div v-if="isLoading" class="flex justify-center items-center">
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
  const response = await getConfigs();
  if (!Array.isArray(response)) {
    $toast.error(`Fetching configs error, status: ${response}`);
    isLoading.value = false;
    store.setHeaderTitle("Fetching configs error");
    return null;
  }
  const configsList = response.sort((a, b) => b.configId - a.configId);
  store.setConfigsList(configsList);
  config.value = configsList.find(
    (config) => config.configId === Number(route.params.id),
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
