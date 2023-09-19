<template>
  <input
    class="w-full flex justify-center disabled:opacity-25 outline-none rounded-md border-0 py-1.5 pl-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
    :class="fieldBg"
    :placeholder="props.placeholder"
    :type="props.type"
    :value="modelValue || ''"
    @input="updateInput"
  />
</template>

<script setup>
const props = defineProps([
  "type",
  "modelValue",
  "placeholder",
  "isMemo",
  "updateMemo",
]);
const emit = defineEmits(["update:modelValue"]);
/*
 * Optional. If we want to memoize default input value (for highlighting updated fields for example)
 * and reset it by changing updateMemo.
 */
const memoInput = ref(null);

const fieldBg = computed(() => {
  if (!props.isMemo) return "bg-white";

  if (Array.isArray(props.modelValue) && memoInput.value) {
    for (let i = 0; i < props?.modelValue?.length; i++) {
      if (props?.modelValue[i] !== memoInput?.value[i]) {
        return "bg-[#f5e7d0]";
      }
    }
    return "bg-white";
  }

  if (
    !Object.is(NaN, Number(props.modelValue)) &&
    !Object.is(NaN, Number(memoInput.value))
  ) {
    return Number(props.modelValue) === Number(memoInput.value)
      ? "bg-white"
      : "bg-[#f5e7d0]";
  } else {
    return props.modelValue === memoInput.value ? "bg-white" : "bg-[#f5e7d0]";
  }
});

const updateInput = (event) => {
  emit("update:modelValue", event.target.value);
};

onMounted(() => {
  if (props.isMemo) memoInput.value = props.modelValue;
});

watch(
  () => props.updateMemo,
  () => {
    if (props.updateMemo) {
      memoInput.value = props.modelValue;
    }
  },
);
</script>

<style scoped>
.danger {
  background-color: #f93e3e40;
  color: black;
}

.success {
  background-color: #49cc9137;
  color: black;
}

.warning {
  background-color: #fca0304b;
  color: black;
}
</style>
