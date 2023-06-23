<template>
  <input
    class="w-full flex justify-center disabled:opacity-25 outline-none rounded-md border-0 py-1.5 pl-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
    :placeholder="props.placeholder"
    :type="props.type"
    :value="modelValue || ''"
    @input="updateInput"
  />
</template>

<script setup>
const props = defineProps(["type", "modelValue"]);

const emit = defineEmits(["update:modelValue"]);

const updateInput = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>

<style scoped>
.danger {
  background-color: #f93e3e;
  color: #fff;
}

.success {
  background-color: #49cc90;
  color: #fff;
}

.warning {
  background-color: #fca130;
  color: #fff;
}
</style>
