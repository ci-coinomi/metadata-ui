<template>
  <div
    class="flex w-full flex-col gap-2 rounded-sm p-2"
    :class="configBorderStyle"
  >
    <div
      v-if="
        props.configNestedObject &&
        !props.configNestedObject.hasOwnProperty('@type')
      "
      class="flex justify-between"
    >
      <p class="text-gray-400">
        <span> Object </span>
        <span v-if="Object.entries(props.configNestedObject).length === 0">
          (empty)
        </span>
      </p>

      <uiButton
        v-if="isObjectDeletable"
        class="danger h-[34px] min-w-[34px]"
        @click="onObjectDeleteClick"
      >
        <img
          src="~/assets/icons/icon-trash.svg"
          class="icon-trash h-4 w-4"
          alt="delete user"
        />
      </uiButton>
    </div>
    <div
      v-for="(value, key) in props.configNestedObject"
      :key="key"
      :class="
        isObject(value) || Array.isArray(value) ? 'items-start' : 'items-center'
      "
      class="flex gap-4 rounded-sm py-1"
    >
      <p class="text-gray-400">
        {{ key }}
      </p>

      <template v-if="isObject(value)">
        <configNestedLine
          :isCloned="isCloned"
          :configNestedObject="value"
          :configUpdateTrigger="configUpdateTrigger"
        />
      </template>

      <UiSwitcher
        v-else-if="typeof value === 'boolean'"
        :value="configNestedObject[key]"
        :update-memo="configUpdateTrigger"
        :is-memo="true"
        @update:value="(data) => (configNestedObject[key] = data)"
      />

      <template v-else-if="Array.isArray(value)">
        <configNestedProvider
          v-if="isNestedArrayVisible(key)"
          :isCloned="isCloned"
          :configNestedObject="value"
          :configFieldType="key"
          :configUpdateTrigger="configUpdateTrigger"
        />
        <UiInputField
          v-else
          :model-value="configNestedObject[key]"
          type="text"
          :update-memo="configUpdateTrigger"
          :is-memo="true"
          @input="
            (data) => (configNestedObject[key] = data.target.value.split(','))
          "
        />
      </template>

      <UiInputField
        v-else
        v-model="configNestedObject[key]"
        type="text"
        :update-memo="configUpdateTrigger"
        :is-memo="true"
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
  isObjectDeletable: Boolean,
});

const emit = defineEmits(["deleteConfigField"]);

const onObjectDeleteClick = () => {
  emit("deleteConfigField");
};

const defaultNestedObject = ref(cleared(props.configNestedObject));

const isNestedArrayVisible = (key) =>
  key === "nodeProviders" ||
  key === "apiProviders" ||
  key === "configuredProviderGroups" ||
  key === "providers" ||
  key === "settings" ||
  key === "linkouts" ||
  key === "networks" ||
  key === "accounts";

const configBorderStyle = computed(() => {
  if (props.configNestedObject?.["@type"]) return "";
  return "border border-gray-400";
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
  () => props.configUpdateTrigger,
  () => {
    defaultNestedObject.value = cleared(props.configNestedObject);
  },
);
</script>
