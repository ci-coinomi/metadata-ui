<template>
  <div class="max-w-[1440px] m-auto pt-40">Config</div>
</template>
<script setup>
import { getConfigs, getConfigsTypes } from "~/api/configs";

definePageMeta({
  layout: "signedin",
});

onMounted(async () => {
  const configs = await getConfigs();
  const configsTypes = await getConfigsTypes();
  // 403 errors :(
  console.log(configs);
  console.log(configsTypes);
});
</script>
<style></style>
