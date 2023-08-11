<template>
  <main class="bg-white p-4 mt-3">
    <div v-if="isLoading" class="flex justify-center items-center">Loading</div>
    <ConfigDetailsCard v-else :config="config" />
  </main>
</template>
<script setup>
import { getConfigById } from "~/api/configs";

definePageMeta({
  layout: "signedin",
});

const route = useRoute();

const config = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  isLoading.value = true;
  const response = await getConfigById(route.params.id);
  config.value = response;
  console.log(response);
  isLoading.value = false;
});
</script>
<style scoped></style>
