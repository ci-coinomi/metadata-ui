<template>
  <div
    class="p-2 flex flex-col gap-2 w-full border rounded-sm"
    :class="isConfigUpdated ? 'border-[#d38b32]' : 'border-gray-500'"
  >
    <UiButton class="success ml-auto" @click="onAddProviderHandler"
      >Add provider</UiButton
    >
    <div
      v-for="(value, key) in props.configNestedObject"
      :key="key"
      class="flex gap-4 rounded-sm w-full items-start"
    >
      <div class="w-full flex flex-col gap-2">
        <div v-if="isFieldNew(key)" class="flex justify-between items-center">
          <h2 class="text-gray-600">New provider</h2>

          <uiButton
            class="danger h-[34px] min-w-[34px]"
            @click="onDeleteClickHandler(key)"
          >
            Delete
          </uiButton>
        </div>
        <div class="flex flex-col gap-2 w-full rounded-sm">
          <configNestedLine
            :isCloned="isCloned"
            :configNestedObject="value"
            :configUpdateTrigger="configUpdateTrigger"
          />
        </div>
      </div>
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

const onAddProviderHandler = () => {
  props.configNestedObject.push({
    name: "",
    url: "",
    visible: false,
    priority: "",
    supportedMethods: "",
  });
};

const isFieldNew = (key) => {
  return !defaultNestedObject.value[key];
};

const onDeleteClickHandler = (key) => {
  props.configNestedObject.splice(key, 1);
};

watch(
  () => props.configUpdateTrigger,
  () => {
    defaultNestedObject.value = cleared(props.configNestedObject);
    isConfigUpdated.value = false;
  },
);

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
</script>
