<template>
  <div
    class="flex w-full flex-col gap-2 rounded-md p-2"
    :class="isDeepNestedObject ? 'border border-gray-400' : ''"
  >
    <div v-if="isDeepNestedObject" class="flex justify-between">
      <p class="text-gray-400">
        Object
        <span v-if="Object.entries(nestedObject).length === 0"> (empty) </span>
      </p>

      <uiButton
        v-if="isObjectDeletable"
        class="danger h-[34px] min-w-[34px]"
        @click="btnHandler.onObjectDelete"
      >
        <img
          src="~/assets/icons/icon-trash.svg"
          class="icon-trash h-4 w-4"
          alt="delete user"
        />
      </uiButton>
    </div>

    <div
      v-for="(value, key) in nestedObject"
      :key="key"
      class="flex gap-4 py-1"
      :class="
        isObject(value) || Array.isArray(value) ? 'items-start' : 'items-center'
      "
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
        <ConfigDefaultNestedObjectEditor
          :is-cloned="isCloned"
          :nested-object="value"
          :config-update-trigger="configUpdateTrigger"
          :original-config="originalConfig"
          :is-object-deletable="false"
        />
      </template>

      <template v-else-if="typeof value === 'boolean'">
        <UiSwitcher
          :value="nestedObject[key]"
          :update-memo="configUpdateTrigger"
          :is-memo="true"
          @update:value="(data) => (nestedObject[key] = data)"
        />
      </template>

      <template v-else-if="Array.isArray(value)">
        <ConfigDefaultNestedArrayEditor
          v-if="isPrintedAsArray(key)"
          :is-cloned="isCloned"
          :nested-array="value"
          :array-key="key"
          :config-update-trigger="configUpdateTrigger"
          :original-config="originalConfig"
        />
        <UiInputField
          v-else
          :model-value="nestedObject[key]"
          type="text"
          :update-memo="configUpdateTrigger"
          :is-memo="true"
          @input="(data) => (nestedObject[key] = data.target.value.split(','))"
        />
      </template>

      <UiInputField
        v-else
        v-model="nestedObject[key]"
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
  nestedObject: Object,
  isCloned: Boolean,
  configUpdateTrigger: Number,
  isObjectDeletable: Boolean,
  originalConfig: Object,
});

const emit = defineEmits(["deleteConfigField"]);

const defaultNestedObject = ref(cleared(props.nestedObject));

/* All level-1 nested objects have @type - field */
const isDeepNestedObject = computed(
  () =>
    props.nestedObject &&
    !Object.prototype.hasOwnProperty.call(props.nestedObject, "@type"),
);

const btnHandler = {
  onObjectDelete: () => {
    emit("deleteConfigField");
  },
};

/* Should nested array be printed as <ConfigDefaultNestedArrayEditor> or as input type "text" */
const isPrintedAsArray = (key) => {
  const arrayKeyNames = [
    "nodeProviders",
    "apiProviders",
    "configuredProviderGroups",
    "providers",
    "categories",
    "networks",
    "accounts",
    "partners",
    "conditions",
    "partnerPlatforms",
  ];
  return arrayKeyNames.includes(key);
};

/* List of not-editable text fields */
const isFieldDisabled = (key) => {
  const disabledFieldsArray = ["@type"];

  if (disabledFieldsArray.includes(key)) {
    return true;
  }

  if (!props.isCloned && key === "eucId") {
    return true;
  }

  return false;
};

/* Update config watcher */
watch(
  () => props.configUpdateTrigger,
  () => {
    defaultNestedObject.value = cleared(props.nestedObject);
  },
);
</script>
