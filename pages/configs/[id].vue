<template>
  <main class="flex flex-col justify-center items-center gap-6 pb-10">
    <div class="flex justify-between w-full">
      <UiButton @click="onConfigNavigateHandler">To config list</UiButton>
      <h1 class="text-2xl font-bold">{{ config.configName }}</h1>
      <UiButton class="warning" @click="handleSubmit">Update config</UiButton>
    </div>
    <div class="flex flex-col gap-3 w-full">
      <div><strong>Type:</strong> {{ config.configType }}</div>
      <configNestedLine
        :configNestedObject="configFile"
        @nested-object-updated="handleNestedObjectUpdated"
      />
    </div>
    <UiButton class="warning" @click="handleSubmit">Update config</UiButton>
  </main>
</template>

<script setup>
/* eslint-disable no-console */
import { getConfigItemById } from "~/api/configs";

definePageMeta({
  layout: "signedin",
});

const route = useRoute();
const router = useRouter();

const config = ref({});
const configFile = ref({});

const handleNestedObjectUpdated = (updatedObject) => {
  configFile.value = updatedObject;
};

const handleSubmit = () => {
  console.log("Source object:", JSON.parse(config.value.configFile));
  console.log("Updated object:", JSON.parse(JSON.stringify(configFile.value)));
};

const onConfigNavigateHandler = () => {
  router.push({
    name: "configs",
  });
};

onMounted(async () => {
  config.value = await getConfigItemById(route.params.id);
  configFile.value = JSON.parse(config.value.configFile);
});
</script>
<style></style>
