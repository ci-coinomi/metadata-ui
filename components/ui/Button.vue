<template>
  <button
    type="button"
    class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 active:bg-gray-200"
  >
    <!-- :class="buttonStatus" -->
    <!-- :disabled="props.status === 'disabled'" -->
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  status: String,
});

const buttonStatus = computed(() => {
  // List of statuses and preventing passing tailwind classes as props
  if (props.status === ("warning" || "success" || "error" || "disabled"))
    return props.status;
});
</script>

<style scoped>
.error {
  background-color: rgb(244, 135, 135);
}

.success {
  background-color: rgb(161, 232, 161);
}

.warning {
  background-color: rgb(247, 247, 166);
}

.disabled {
  background-color: gray;
}
</style>
