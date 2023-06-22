<template>
  <main class="flex flex-col justify-center items-center gap-6">
    <h1 class="text-2xl font-bold">Configs</h1>
    <p class="text-gray-500 text-sm">Design is just for data visualization!</p>
    <div class="flex gap-4">
      <p>Configs types are:</p>
      <div v-for="typeItem in configsTypes" :key="typeItem"> {{ typeItem }}</div>
    </div>
    <div class="flex flex-col gap-4 w-full">
      <p>Total count: {{ configs.length }}</p>
      <configListItem v-for="config in configs" :key="config.configId" :config="config" />
    </div>
  </main>
</template>
<script setup>
import { getConfigs, getConfigsTypes } from "~/api/configs";

const configs = ref([]);
const configsTypes = ref([])

definePageMeta({
  layout: "signedin",
});

onMounted(async () => {
  const configsData = await getConfigs();
  configs.value = configsData;
  const configsTypesData = await getConfigsTypes();
  configsTypes.value = configsTypesData;
});
</script>
<style></style>
