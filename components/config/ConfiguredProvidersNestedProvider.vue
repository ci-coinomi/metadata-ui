<template>
  <modalConfiguredProviderNetwork
    v-if="isNetworkModalVisible"
    @is-modal-confirmed="(data) => onNetworkModalConfirmHandler(data)"
  />
  <div class="p-2 flex flex-col gap-2 w-full border rounded-sm border-gray-400">
    <UiButton class="success ml-auto" @click="onAddNetworkHandler">
      Add network
    </UiButton>
    <div
      v-for="(value, key) in props.configNestedObject"
      :key="value"
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
          <configConfiguredProvidersNestedLine
            :isCloned="isCloned"
            :configNestedObject="value"
            :configUpdateTrigger="configUpdateTrigger"
            :update-memo="configUpdateTrigger"
            :is-memo="true"
            :isObjectDeletable="isNextLevelObjectDeletable(configFieldType)"
            @delete-config-field="() => onDeleteNestedLineHandler(key)"
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
  configFieldType: String,
});

const defaultNestedObject = ref(cleared(props.configNestedObject));
const isConfigUpdated = ref(false);
const isNetworkModalVisible = ref(false);

const isNextLevelObjectDeletable = (type) => {
  return type === "providers";
};

const onAddNetworkHandler = () => {
  isNetworkModalVisible.value = true;
};

const onDeleteNestedLineHandler = (idx) => {
  props.configNestedObject.splice(idx, 1);
};

const onNetworkModalConfirmHandler = (selectedNetwork) => {
  isNetworkModalVisible.value = false;
  const addedNetworkObject = {
    enabled: false,
    priority: "",
    providerName: selectedNetwork.providerName,
    networkIds: [],
  };
  addedNetworkObject.networkIds.push(selectedNetwork.id);
  props.configNestedObject.push(addedNetworkObject);
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
