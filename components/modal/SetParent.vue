<template>
  <div
    class="fixed inset-0 z-30 flex items-center justify-center bg-[#0D0D0D]/[.9]"
  >
    <div
      class="relative flex max-h-[90vh] flex-col gap-6 overflow-x-auto rounded-md bg-white p-10"
    >
      <h2 class="text-center text-lg font-bold">Provide new parent name.</h2>
      <p class="text-center opacity-50">
        <span v-if="isBlockchainOnlyParent">
          Only config with Blockchain type can be passed
        </span>
        <span v-else>
          Only config with Asset or Blockchain type can be passed
        </span>
      </p>
      <div class="flex flex-col gap-1">
        <template v-if="isBlockchainOnlyParent">
          <div
            v-for="blockchain in blockchainsArray"
            :key="blockchain.configId"
            class="cursor-pointer rounded-lg border border-gray-400 px-4 py-2 hover:border-gray-900"
            @click="onBlockchainClickHandler(blockchain)"
          >
            <p>
              <span class="text-gray-400">Name: </span>
              {{ blockchain.configName }}
            </p>
            <p>
              <span class="text-gray-400">EucId: </span>
              {{ blockchain.eucId }}
            </p>
          </div>
          <p
            class="cursor-pointer rounded-lg border border-gray-400 px-4 py-2 text-center hover:border-gray-900"
            @click="onNullClickHandler"
          >
            Null
          </p>
        </template>
        <div v-else class="flex gap-2">
          <UiInputField
            v-model="textInputValue"
            type="text"
            :placeholder="'New parent name...'"
          />
          <UiButton
            v-if="currentConfig.configType !== 'CONFIGURED_PROVIDERS'"
            class="warning"
            @click="onNullClickHandler"
          >
            Null
          </UiButton>
        </div>
      </div>
      <UiButton
        v-if="isBlockchainOnlyParent"
        class="danger smallPaddings absolute right-2 top-2"
        @click="onCanselHandler"
        >X
      </UiButton>
      <div v-if="!isBlockchainOnlyParent" class="flex justify-center gap-4">
        <UiButton class="danger w-2/5" @click="onCanselHandler"
          >Cancel</UiButton
        >
        <UiButton class="success w-2/5" @click="onConfirmHandler"
          >Confirm</UiButton
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useConfigStore } from "@/stores/configs";

const configStore = useConfigStore();
const { $toast } = useNuxtApp();

const emit = defineEmits(["isModalConfirmed"]);
const props = defineProps(["configs", "currentConfig"]);

const { storedConfigList } = storeToRefs(configStore);

const textInputValue = ref("");

const blockchainsArray = computed(() =>
  storedConfigList.value
    .filter((item) => item.configType === "BLOCKCHAIN")
    .map((item) => {
      const configNestedObject = JSON.parse(item.configFile);
      item.eucId = configNestedObject.eucId;
      return item;
    }),
);
const isBlockchainOnlyParent = computed(
  () =>
    props.currentConfig.configType === "PROVIDERS" ||
    props.currentConfig.configType === "BANNER" ||
    props.currentConfig.configType === "ECO_SETTING" ||
    props.currentConfig.configType === "CONFIGURED_PROVIDERS" ||
    props.currentConfig.configType === "DAPP",
);

const onCanselHandler = () => {
  emit("isModalConfirmed", false);
};

const onBlockchainClickHandler = (item) => {
  delete item.eucId;
  emit("isModalConfirmed", item);
};

const onConfirmHandler = () => {
  if (textInputValue.value.trim() === "") {
    $toast.warning("You need to enter new config name");
    return;
  }

  let newParentConfig;

  const currentConfigType = props.currentConfig.configType;
  if (
    currentConfigType === "PROVIDERS" ||
    currentConfigType === "BANNER" ||
    currentConfigType === "ECO_SETTING" ||
    currentConfigType === "CONFIGURED_PROVIDERS" ||
    currentConfigType === "DAPP"
  ) {
    newParentConfig = props.configs.find(
      (item) =>
        item.configName === textInputValue.value &&
        item.configType === "BLOCKCHAIN",
    );
    if (!newParentConfig) {
      $toast.warning(
        `Blockchain with the name "${textInputValue.value}" was not found.`,
      );
      return;
    }
  }

  if (currentConfigType === "PARTNER") {
    newParentConfig = props.configs.find(
      (item) =>
        item.configName === textInputValue.value &&
        (item.configType === "ASSET" || item.configType === "BLOCKCHAIN"),
    );
    if (!newParentConfig) {
      $toast.warning(
        `Asset or Blockchain with the name "${textInputValue.value}" was not found.`,
      );
      return;
    }
  }

  emit("isModalConfirmed", newParentConfig);
};

const onNullClickHandler = () => {
  emit("isModalConfirmed", "SET_NULL");
};

onMounted(() => {
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>
