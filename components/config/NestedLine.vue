<template>
  <div
    v-for="(value, key) in props.configNestedObject"
    :key="key"
    :class="!isObject(value) ? 'items-center' : ''"
    class="flex py-1 gap-4 rounded-sm"
  >
    <p class="text-gray-400">{{ key }}:</p>
    <template v-if="isObject(value)">
      <div class="pl-1 flex flex-col gap-1 w-full">
        <p class="text-gray-400">Object</p>
        <configNestedLine
          :isCloned="isCloned"
          :configNestedObject="value"
          @nested-object-updated="handleValueChange"
        />
      </div>
    </template>
    <template v-else>
      <UiSwitcher
        v-if="typeof value === 'boolean'"
        :value="configNestedObject[key]"
        @update:value="(data) => (configNestedObject[key] = data)"
      />
      <UiInputField
        v-else-if="Array.isArray(value)"
        :value="configNestedObject[key]"
        type="text"
        :disabled="key === '@type' || key === 'eucId'"
        @input="
          (data) => (configNestedObject[key] = data.target.value.split(','))
        "
      />
      <UiInputField
        v-else
        v-model="configNestedObject[key]"
        type="text"
        :disabled="isFieldDisabled(key)"
      />
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  configNestedObject: Object,
  isCloned: Boolean,
});

const emit = defineEmits(["nested-object-updated"]);

const isFieldDisabled = (key) => {
  if (key === "@type") {
    return true;
  } else if (!props.isCloned && key === "eucId") {
    return true;
  } else {
    return false;
  }
};

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
