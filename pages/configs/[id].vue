<template>
  <main class="flex flex-col justify-center items-center gap-6">
    <h1 class="text-2xl font-bold">Config {{ config.configName }}</h1>
    <p class="text-gray-500 text-sm">Design is just for data visualization!</p>

    <div class="flex flex-col gap-3 w-full">
      <div><strong>Id:</strong> {{ config.configId }}</div>
      <div><strong>Name:</strong> {{ config.configName }}</div>
      <div><strong>Type:</strong> {{ config.configType }}</div>
      <div class="break-words">
        <strong>File:</strong> {{ config.configFile }}
      </div>
    </div>
    <UiButton @click="onReturnClickHandler">Return to config list</UiButton>
  </main>
</template>
<script setup>
import { getConfigItemById } from "~/api/configs";

definePageMeta({
  layout: "signedin",
});

const route = useRoute();
const router = useRouter();

const config = ref({});

onMounted(async () => {
  const configData = await getConfigItemById(route.params.id);
  config.value = configData;
});

const onReturnClickHandler = () => {
  router.push({
    name: "configs",
  });
};
</script>
<style></style>
