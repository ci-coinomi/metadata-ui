<template>
  <modalConfiguredProviderNetwork
    v-if="isNetworkModalVisible"
    :blockchain="blockchain"
    @is-modal-confirmed="(data) => onNetworkModalConfirmHandler(data)"
  />
  <div class="flex w-full flex-col gap-2 rounded-sm border border-gray-400 p-2">
    <UiButton class="success ml-auto" @click="onAddNetworkHandler">
      Add network
    </UiButton>
    <div
      v-for="(value, key) in props.configNestedObject"
      :key="value"
      class="flex w-full items-start gap-4 rounded-sm"
    >
      <div class="flex w-full flex-col gap-2">
        <div v-if="isFieldNew(key)" class="flex items-center justify-between">
          <h2 class="text-gray-600">New provider</h2>

          <uiButton
            class="danger h-[34px] min-w-[34px]"
            @click="onDeleteClickHandler(key)"
          >
            Delete
          </uiButton>
        </div>
        <div class="flex w-full flex-col gap-2 rounded-sm">
          <configConfiguredProvidersNestedLine
            :isCloned="isCloned"
            :configNestedObject="value"
            :configUpdateTrigger="configUpdateTrigger"
            :update-memo="configUpdateTrigger"
            :is-memo="true"
            :blockchain="blockchain"
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
  blockchain: String,
});

const defaultNestedObject = ref(cleared(props.configNestedObject));
const isConfigUpdated = ref(false);
const isNetworkModalVisible = ref(false);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isNextLevelObjectDeletable = (type) => {
  // return type === "providers";
  return false;
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
