<template>
  <div class="w-full">
    <label
      v-if="props.label"
      :for="props.label"
      class="text-sm font-medium leading-6 text-gray-900"
      >{{ props.label }}</label
    >
    <div class="rounded-md shadow-sm">
      <input
        type="text"
        :name="props.label"
        :id="props.label"
        :class="props.status"
        class="block w-full outline-none rounded-md border-0 py-1.5 pl-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6"
        :placeholder="props.placeholder"
        @input="updateInput"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  placeholder: String,
  status: "warning" || "success" || "error" || "disabled",
});

const emit = defineEmits(["update:modelValue"]);

const updateInput = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>

<style scoped>
.error {
  background-color: rgb(245, 205, 205);
}

.success {
  background-color: rgb(206, 247, 206);
}

.warning {
  background-color: rgb(239, 239, 194);
}

.disabled {
  background-color: gray;
}
</style>
