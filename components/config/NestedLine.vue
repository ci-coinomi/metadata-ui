<template>
  <p
    v-if="
      props.configNestedObject &&
      !props.configNestedObject.hasOwnProperty('@type')
    "
    class="text-gray-600"
  >
    <span> Object </span>
    <span v-if="Object.entries(props.configNestedObject).length === 0">
      (empty)
    </span>
  </p>
  {{ props.isFirstLevel }}
  <div
    v-for="(value, key) in props.configNestedObject"
    :key="key"
    :class="
      isObject(value) || Array.isArray(value) ? 'items-start' : 'items-center'
    "
    class="flex py-1 gap-4 rounded-sm"
  >
    <p
      :class="
        isObject(value) || Array.isArray(value)
          ? 'text-gray-600'
          : 'text-gray-400'
      "
    >
      {{ key }}
    </p>

    <template v-if="isObject(value)">
      <div
        class="p-2 flex flex-col gap-2 w-full border border-gray-500 rounded-sm"
      >
        <configNestedLine :isCloned="isCloned" :configNestedObject="value" />
      </div>
    </template>

    <UiSwitcher
      v-else-if="typeof value === 'boolean'"
      :value="configNestedObject[key]"
      @update:value="(data) => (configNestedObject[key] = data)"
    />

    <template v-else-if="Array.isArray(value)">
      <div
        class="p-2 flex flex-col gap-2 w-full border border-gray-500 rounded-sm"
      >
        <configNestedArray :isCloned="isCloned" :configNestedObject="value" />
      </div>
    </template>

    <UiInputField
      v-else
      v-model="configNestedObject[key]"
      type="text"
      :disabled="isFieldDisabled(key)"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  configNestedObject: Object,
  isCloned: Boolean,
});

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
</script>
