<template>
  <div
    ref="bgRef"
    class="fixed inset-0 z-30 bg-[#0D0D0D]/[.9] py-16"
    @click="handleClickOutside"
  >
    <div
      class="mx-auto flex max-h-full w-1/2 flex-col gap-2 overflow-x-auto rounded-md bg-white p-10"
    >
      <h2 class="mb-4 text-center text-xl font-bold">Child configs:</h2>
      <a
        v-for="(config, index) in childConfigs"
        :key="config.configId"
        :href="`/configs/${config.configId}`"
        target="_blank"
        class="flex justify-between rounded-md border border-gray-400 p-2 hover:border-gray-800"
        :class="index % 2 ? 'bg-white' : 'bg-gray-100'"
      >
        <p><span class="text-gray-400">Name: </span> {{ config.configName }}</p>
        <p><span class="text-gray-400">Type: </span> {{ config.configType }}</p>
      </a>
    </div>
  </div>
</template>
<script setup>
const emit = defineEmits(["close-modal"]);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  childConfigs: Array,
});

const bgRef = ref();

const handleClickOutside = (evt) => {
  if (evt.target === bgRef.value) {
    emit("close-modal", evt);
  }
};

onMounted(() => {
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>
