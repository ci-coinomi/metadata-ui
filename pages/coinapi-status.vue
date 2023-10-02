<template>
  <div>Page</div>
</template>
<script setup>
import { getBlockchains, getProviders, getHeight } from "~/api/coinapi";

onMounted(async () => {
  const data = await getBlockchains();
  console.log(data);
  const data2 = await getProviders();
  console.log("Providers", data2);
  const data3 = await getHeight();
  console.log("Height", data3);
});
</script>
<style scoped></style>
