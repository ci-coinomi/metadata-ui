<template>
  <div
    class="fixed inset-0 z-30 bg-[#0D0D0D]/[.9] flex justify-center items-center"
  >
    <section class="bg-white p-10 rounded-md flex flex-col gap-6">
      <h2 class="text-lg text-center font-bold">Child configs:</h2>
      <div v-for="config in props.childConfigs" :key="config.configId" class="border border-gray-400 rounded-md p-4">
        <p class="">{{ config.configName }}</p>
        {{ config.configId }}
      </div>
    </section>
  </div>
</template>
<script setup>
const props = defineProps(["childConfigs"]);

</script>
<style scoped></style>
