<template>
  <ModalConfiguredProviderNetwork
    v-if="isNetworkModalVisible"
    :blockchain="blockchain"
    @is-modal-confirmed="(data) => onNetworkModalConfirmHandler(data)"
  />

  <ModalConfiguredProviderGroup
    v-if="isGroupModalVisible"
    :blockchain="blockchain"
    @is-modal-confirmed="(data) => onGroupModalConfirmHandler(data)"
  />
  <div class="flex w-full flex-col gap-2 rounded-sm border border-gray-400 p-2">
    <div class="flex items-center gap-2">
      <p v-if="!blockchain" class="text-gray-400">
        Select parent to provide blockchain
      </p>
      <UiButton
        v-if="blockchain"
        class="success ml-auto"
        @click="onAddNetworkHandler"
      >
        Add network
      </UiButton>
      <UiButton
        v-if="blockchain"
        class="success"
        @click="onAddGroupClickHandler"
      >
        Add group
      </UiButton>

      <UiButton
        v-if="!blockchain && fullConfigObject.configChain"
        class="success ml-auto"
        @click="onAddChainFromParent"
      >
        Get chain from parent
      </UiButton>
    </div>
    <div
      v-for="(value, key) in props.configNestedObject"
      :key="value"
      class="flex w-full items-start gap-4 rounded-sm"
    >
      <div class="flex w-full flex-col gap-2">
        <div
          v-if="isFieldNew(key)"
          class="flex w-full items-center justify-between"
        >
          <h2 class="w-full text-center text-lg font-bold">New provider</h2>

          <!-- <uiButton
            class="danger h-[34px] min-w-[34px]"
            @click="onDeleteClickHandler(key)"
          >
            Delete
          </uiButton> -->
        </div>
        <div class="flex w-full flex-col gap-2 rounded-sm">
          <configConfiguredProvidersNestedLine
            :isCloned="isCloned"
            :configNestedObject="value"
            :configUpdateTrigger="configUpdateTrigger"
            :update-memo="configUpdateTrigger"
            :is-memo="true"
            :blockchain="blockchain"
            :isFieldNew="isFieldNew(key)"
            :fullConfigObject="fullConfigObject"
            :isObjectDeletable="isNextLevelObjectDeletable(configFieldType)"
            @delete-config-field="() => onDeleteNestedLineHandler(key)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useConfigStore } from "@/stores/configs";

const configStore = useConfigStore();

const props = defineProps({
  configNestedObject: Object,
  isCloned: Boolean,
  configUpdateTrigger: Number,
  configFieldType: String,
  blockchain: String,
  fullConfigObject: Object,
});

const emit = defineEmits(["setBlockchain"]);
const { storedConfigList } = storeToRefs(configStore);

const defaultNestedObject = ref(cleared(props.configNestedObject));
const isConfigUpdated = ref(false);
const isNetworkModalVisible = ref(false);
const isGroupModalVisible = ref(false);

const onAddChainFromParent = () => {
  const chain = storedConfigList.value.find(
    (item) => item.configId === props.fullConfigObject.configChain.configId,
  );
  const chainConfigFileObj = JSON.parse(chain.configFile);

  emit("setBlockchain", chainConfigFileObj.eucId);
};

const isNextLevelObjectDeletable = (type) => {
  return type === "providers";
};

const onAddGroupClickHandler = () => {
  isGroupModalVisible.value = true;
};

const onAddNetworkHandler = () => {
  isNetworkModalVisible.value = true;
};

const onDeleteNestedLineHandler = (idx) => {
  props.configNestedObject.splice(idx, 1);
};

const onGroupModalConfirmHandler = (selectedGroup) => {
  isGroupModalVisible.value = false;
  if (!selectedGroup) return;
  const newNetworkObjects = selectedGroup.networks.map((item) => {
    const networkObject = {
      priority: "",
      accountApiKeyNames: [],
      providerName: item.providerName,
      networkIds: [item.id],
    };
    if (item.accountApiKeyNames) {
      networkObject.accountApiKeyNames = [...item.accountApiKeyNames];
    }
    return networkObject;
  });

  props.configNestedObject.push(...newNetworkObjects);
};

const onNetworkModalConfirmHandler = (selectedNetwork) => {
  isNetworkModalVisible.value = false;
  if (selectedNetwork) {
    const addedNetworkObject = {
      priority: "",
      providerName: selectedNetwork.providerName,
      networkIds: [selectedNetwork.id],
    };
    if (selectedNetwork.accountApiKeyNames) {
      addedNetworkObject.accountApiKeyNames = [
        ...selectedNetwork.accountApiKeyNames,
      ];
    }
    props.configNestedObject.push(addedNetworkObject);
  }
};

const isFieldNew = (key) => {
  return !defaultNestedObject.value[key];
};

// const onDeleteClickHandler = (key) => {
//   props.configNestedObject.splice(key, 1);
// };

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
