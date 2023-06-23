<template>
  <div
    v-for="(value, key) in props.myObject"
    :key="key"
    class="flex p-1 gap-4 rounded-sm"
  >
    <p class="text-gray-400">{{ key }}:</p>
    <template v-if="isObject(value)">
      <div class="pl-1 flex flex-col gap-1">
        <p class="text-gray-400">Object</p>
        <configNestedLine
          :myObject="value"
          @nested-object-updated="handleValueChange"
        />
      </div>
    </template>
    <template v-else>
      <UiInputField
        v-model="myObject[key]"
        type="text"
        :readonly="!isEditable(key)"
      />
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  myObject: Object,
});

const emit = defineEmits(["nested-object-updated"]);

const isObject = (value) => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isEditable = (key) => {
  return !key.includes("readonly");
};

const handleValueChange = (key, value) => {
  emit("nested-object-updated", {
    ...props.myObject,
    [key]: value,
  });
};
</script>
