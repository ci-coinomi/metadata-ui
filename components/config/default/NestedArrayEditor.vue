<template>
  <div class="flex w-full flex-col gap-2 rounded-md border border-gray-400 p-2">
    <UiButton
      v-if="areNewElementsAddable"
      class="success ml-auto"
      @click="btnHandler.onAddArrayElement"
    >
      Add item
    </UiButton>

    <div
      v-for="(value, key) in nestedArray"
      :key="value"
      class="flex w-full items-start gap-4 rounded-sm"
    >
      <div class="flex w-full flex-col gap-2">
        <h2 v-if="!defaultNestedObject[key]" class="text-center text-gray-600">
          New item
        </h2>

        <template v-if="isObject(value)">
          <ConfigDefaultNestedObjectEditor
            :isCloned="isCloned"
            :nested-object="value"
            :config-update-trigger="configUpdateTrigger"
            :original-config="originalConfig"
            :is-object-deletable="isNextLevelObjectDeletable(key)"
            @delete-config-field="() => btnHandler.onDeleteElementInArray(key)"
          />
        </template>

        <template v-else-if="typeof value === 'boolean'">
          <UiSwitcher
            :value="nestedArray[key]"
            :update-memo="configUpdateTrigger"
            :is-memo="true"
            @update:value="(data) => (nestedArray[key] = data)"
          />
        </template>

        <template v-else-if="Array.isArray(value)">
          <configDefaultNestedArrayEditor
            :is-cloned="isCloned"
            :nested-array="value"
            :array-key="key"
            :config-update-trigger="configUpdateTrigger"
            :original-config="originalConfig"
          />
        </template>

        <UiInputField
          v-else
          v-model="nestedArray[key]"
          type="text"
          :update-memo="configUpdateTrigger"
          :is-memo="true"
          :disabled="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  nestedArray: Object,
  isCloned: Boolean,
  configUpdateTrigger: Number,
  arrayKey: String,
  originalConfig: Object,
});

const defaultNestedObject = ref(cleared(props.nestedArray));

/* New elements can be added to provided arrayKeys */
const areNewElementsAddable = computed(() => {
  const editableKeysArray = ["nodeProviders", "apiProviders", "categories"];
  return editableKeysArray.includes(props.arrayKey);
});

/**
 * If array element is an object, whether it is deletable or not.
 * Deletable if element in array was not saved yet (for new items in array).
 * Also if array key is 'categories' (eco-settings type) - elements are always deletable, even if they were saved before.
 * For now all nested array elements were objects, so deleting new test/bool/array fields is not supported for now.
 */
const isNextLevelObjectDeletable = (key) => {
  if (!defaultNestedObject.value[key]) return true;

  const deletableTypesArray = ["categories"];
  return deletableTypesArray.includes(props.arrayKey);
};

const btnHandler = {
  onDeleteElementInArray: (index) => {
    props.nestedArray.splice(index, 1);
  },

  onAddArrayElement: () => {
    let defaultArrayObject;

    if (
      props.arrayKey === "nodeProviders" ||
      props.arrayKey === "apiProviders"
    ) {
      defaultArrayObject = {
        name: "",
        url: "",
        visible: false,
        priority: "",
        companyName: "",
        network: "",
        supportedMethods: [],
      };
    }
    if (props.arrayKey === "categories") {
      defaultArrayObject = {
        name: "",
        color: "",
        visible: false,
        sortOrder: "",
      };
    }

    props.nestedArray.push(defaultArrayObject);
  },
};

/**
 * Web-832. Needs to add companyName and network to all existed providers.
 */
onMounted(() => {
  const keysToCheck = ["nodeProviders", "apiProviders"];

  if (keysToCheck.includes(props.arrayKey)) {
    props.nestedArray.forEach((item) => {
      if (!("companyName" in item)) {
        item.companyName = "";
      }

      if (!("network" in item)) {
        item.network = "";
      }
    });
  }
});

/* Update config watcher */
watch(
  () => props.configUpdateTrigger,
  () => {
    defaultNestedObject.value = cleared(props.nestedArray);
  },
);
</script>
