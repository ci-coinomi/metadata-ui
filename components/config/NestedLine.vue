<template>
  <div
    class="p-2 flex flex-col gap-2 w-full rounded-sm"
    :class="configBorderStyle"
  >
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
        <configNestedLine
          :isCloned="isCloned"
          :configNestedObject="value"
          :configUpdateTrigger="props.configUpdateTrigger"
        />
      </template>

      <UiSwitcher
        v-else-if="typeof value === 'boolean'"
        :value="configNestedObject[key]"
        @update:value="(data) => (configNestedObject[key] = data)"
      />

      <template v-else-if="Array.isArray(value)">
        <configNestedProvider
          v-if="key === 'nodeProviders' || key === 'apiProviders'"
          :isCloned="isCloned"
          :configNestedObject="value"
          :configUpdateTrigger="props.configUpdateTrigger"
        />
        <UiInputField
          v-else
          :value="configNestedObject[key]"
          type="text"
          @input="
            (data) => (configNestedObject[key] = data.target.value.split(','))
          "
        />
      </template>

      <UiInputField
        v-else
        v-model="configNestedObject[key]"
        type="text"
        :disabled="isFieldDisabled(key)"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  configNestedObject: Object,
  isCloned: Boolean,
  configUpdateTrigger: Number,
});

const defaultNestedObject = ref(cleared(props.configNestedObject));

const isConfigUpdated = ref(false);

const configBorderStyle = computed(() => {
  if (props.configNestedObject?.["@type"]) return "";
  return isConfigUpdated.value
    ? "border border-[#d38b32]"
    : "border border-gray-400";
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

watch(
  () => props.configNestedObject,
  () => {
    !areObjectsEqual(
      cleared(defaultNestedObject.value),
      cleared(props.configNestedObject),
    )
      ? (isConfigUpdated.value = true)
      : (isConfigUpdated.value = false);
  },
  {
    deep: true,
  },
);

watch(
  () => props.configUpdateTrigger,
  () => {
    defaultNestedObject.value = cleared(props.configNestedObject);
    isConfigUpdated.value = false;
  },
);
</script>
