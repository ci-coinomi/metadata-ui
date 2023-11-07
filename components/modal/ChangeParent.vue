<template>
  <div
    class="fixed inset-0 z-30 flex items-center justify-center bg-[#0D0D0D]/[.9]"
  >
    <div
      class="relative flex max-h-[90vh] flex-col gap-4 overflow-x-auto rounded-md bg-white p-10"
    >
      <UiButton
        v-if="isBlockchainOnlyValidParent"
        class="danger smallPaddings absolute right-2 top-2"
        @click="onCanselHandler"
      >
        X
      </UiButton>

      <h2 class="text-center text-xl font-bold">Provide new parent name</h2>
      <p class="text-center opacity-50">
        <span v-if="isBlockchainOnlyValidParent">
          Only config with Blockchain type can be passed
        </span>
        <span v-else>
          Only config with Asset or Blockchain type can be passed
        </span>
      </p>
      <div class="flex flex-col gap-1">
        <template v-if="isBlockchainOnlyValidParent">
          <div
            v-for="blockchain in blockchainConfigsList"
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
            class="cursor-pointer rounded-lg border border-gray-400 px-4 py-2 text-center font-black hover:border-gray-900"
            @click="onNullClickHandler"
          >
            Null
          </p>
        </template>

        <div v-else class="flex gap-1">
          <UiInputField
            v-model="textInputValue"
            type="text"
            :placeholder="'New parent name...'"
          />
          <UiButton
            v-if="originalConfig.configType !== 'CONFIGURED_PROVIDERS'"
            class="warning"
            @click="onNullClickHandler"
          >
            Null
          </UiButton>
        </div>
      </div>

      <fieldset
        v-if="!isBlockchainOnlyValidParent"
        class="flex justify-center gap-4"
      >
        <UiButton class="danger w-2/5" @click="onCanselHandler">
          Cancel
        </UiButton>
        <UiButton class="success w-2/5" @click="onConfirmHandler">
          Confirm
        </UiButton>
      </fieldset>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useConfigStore } from "@/stores/configs";

const configStore = useConfigStore();
const { $toast } = useNuxtApp();

const emit = defineEmits(["modalHandler"]);

const props = defineProps({
  originalConfig: Object,
});

const { blockchainConfigsList } = storeToRefs(configStore);

const textInputValue = ref("");

const isBlockchainOnlyValidParent = computed(() => {
  const validConfigTypes = [
    "PROVIDERS",
    "BANNER",
    "ECO_SETTING",
    "DAPP",
    "CONFIGURED_PROVIDERS",
  ];
  return validConfigTypes.includes(props.originalConfig.configType);
});

const onCanselHandler = () => {
  emit("modalHandler", false);
};

const onBlockchainClickHandler = (item) => {
  const selectedBlockchain = {
    ...item,
  };
  delete selectedBlockchain.eucId;
  emit("modalHandler", selectedBlockchain);
};

const onConfirmHandler = () => {
  const trimmedName = textInputValue.value.trim();

  if (!trimmedName) {
    $toast.warning("You need to enter new config name");
    return;
  }

  const { configType } = props.originalConfig;

  let newParentConfig;

  if (configType === "PARTNER") {
    newParentConfig = blockchainConfigsList.value.find(
      (item) =>
        item.configName === trimmedName &&
        (item.configType === "ASSET" || item.configType === "BLOCKCHAIN"),
    );

    if (!newParentConfig) {
      $toast.warning(
        `Asset or Blockchain with the name "${trimmedName}" was not found.`,
      );
      return;
    }
  }

  emit("modalHandler", newParentConfig);
};

const onNullClickHandler = () => {
  emit("modalHandler", "SET_NULL");
};

onMounted(() => {
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>
