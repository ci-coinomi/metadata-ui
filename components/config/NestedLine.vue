<template>
  <div
    v-for="(value, key) in props.configNestedObject"
    :key="key"
    class="flex p-1 gap-4 rounded-sm"
  >
    <p class="text-gray-400">{{ key }}:</p>
    <template v-if="isObject(value)">
      <div class="pl-1 flex flex-col gap-1 w-full">
        <p class="text-gray-400">Object</p>
        <configNestedLine
          :configNestedObject="value"
          @nested-object-updated="handleValueChange"
        />
      </div>
    </template>
    <template v-else>
      <UiInputField v-model="configNestedObject[key]" type="text" />
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  configNestedObject: Object,
});

const emit = defineEmits(["nested-object-updated"]);

const isObject = (value) => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const handleValueChange = (key, value) => {
  emit("nested-object-updated", {
    ...props.configNestedObject,
    [key]: value,
  });
};
</script>
