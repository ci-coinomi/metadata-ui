<template>
  <div class="flex w-full flex-col gap-2 rounded-lg border border-gray-400 p-2">
    <div class="flex items-center gap-2">
      <p v-if="!blockchain" class="text-gray-400">
        Select parent to provide blockchain
      </p>

      <UiButton
        v-if="!blockchain && originalConfig.configChain"
        class="success ml-auto"
        @click="onAddChainFromParent"
      >
        Get chain from parent
      </UiButton>
    </div>

    <div v-for="(value, key) in nestedArray" :key="value">
      <div class="flex w-full flex-col gap-2">
        <h2
          v-if="!defaultNestedArray[key]"
          class="w-full text-center text-lg font-bold"
        >
          New provider
        </h2>

        <ConfigConfProviderNestedObjectEditor
          :nested-object="value"
          :is-cloned="isCloned"
          :config-update-trigger="configUpdateTrigger"
          :original-config="originalConfig"
          :is-object-deletable="true"
          :blockchain="blockchain"
          @delete-array-item="() => nestedArray.splice(key, 1)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useConfigStore } from "@/stores/configs";

const configStore = useConfigStore();

const props = defineProps({
  nestedArray: Object,
  isCloned: Boolean,
  configUpdateTrigger: Number,
  arrayKey: String,
  originalConfig: Object,

  /* Blockchain is used for updating lists in ModalConfProviderNetwork and ModalConfProviderGroup after changing parent during creation config. */
  blockchain: String,
});

const emit = defineEmits(["setBlockchain"]);
const { blockchainConfigsList } = storeToRefs(configStore);

const defaultNestedArray = ref(cleared(props.nestedArray));

/**
 * If config has no blockchain but it has parentConfig - set it eucId as blockchain.
 */
const onAddChainFromParent = () => {
  const chain = blockchainConfigsList.value.find(
    (item) => item.configId === props.originalConfig.configChain.configId,
  );
  emit("setBlockchain", chain.eucId);
};

/* Update config watcher */
watch(
  () => props.configUpdateTrigger,
  () => {
    defaultNestedArray.value = cleared(props.nestedArray);
  },
);
</script>
