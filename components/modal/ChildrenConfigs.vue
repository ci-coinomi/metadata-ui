<template>
  <div
    ref="bgRef"
    class="fixed inset-0 z-30 bg-[#0D0D0D]/[.9] py-16"
    @click="handleClickOutside"
  >
    <section
      class="bg-white p-10 rounded-md flex flex-col gap-2 w-1/2 overflow-x-auto mx-auto max-h-full"
    >
      <h2 class="text-xl text-center font-bold mb-4">Child configs:</h2>
      <a
        v-for="(config, index) in props.childConfigs"
        :key="config.configId"
        :href="`/configs/${config.configId}`"
        target="_blank"
        class="border border-gray-400 rounded-md p-2 hover:border-gray-800 flex justify-between"
        :class="index % 2 ? 'bg-white' : 'bg-gray-100'"
      >
        <p><span class="text-gray-400">Name: </span> {{ config.configName }}</p>
        <p><span class="text-gray-400">Type: </span> {{ config.configType }}</p>
      </a>
    </section>
  </div>
</template>
<script setup>
const props = defineProps(["childConfigs"]);
const emit = defineEmits(["close-modal"]);

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
