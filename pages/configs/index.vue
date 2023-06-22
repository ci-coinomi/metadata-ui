<template>
  <main class="flex flex-col justify-center items-center gap-6">
    <h1 class="text-2xl font-bold">Configs</h1>
    <p class="text-gray-500 text-sm">Design is just for data visualization!</p>
    <div class="flex gap-4">
      <p>Configs types are:</p>
      <div v-for="typeItem in configTypes" :key="typeItem">{{ typeItem }}</div>
    </div>
    <div class="flex flex-col gap-4 w-full">
      <p>Total count: {{ configs.length }}</p>
      <configListItem
        v-for="config in configs"
        :key="config.configId"
        :config="config"
      />
    </div>
  </main>
</template>
<script setup>
import { getConfigs } from "~/api/configs";
import { useStore } from "~/store";

const store = useStore();

const configs = ref([]);
const configTypes = computed(() => store.configTypes);

definePageMeta({
  layout: "signedin",
});

onMounted(async () => {
  await store.getConfigTypes();
  const configsData = await getConfigs();
  configs.value = configsData;
});
</script>
