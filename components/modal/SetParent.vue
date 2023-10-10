<template>
  <div
    class="fixed inset-0 z-30 flex items-center justify-center bg-[#0D0D0D]/[.9]"
  >
    <div class="flex flex-col gap-6 rounded-md bg-white p-10">
      <h2 class="text-center text-lg font-bold">Provide new parent name.</h2>
      <p class="text-center opacity-50">
        <span
          v-if="
            currentConfig.configType === 'PROVIDERS' ||
            currentConfig.configType === 'BANNER' ||
            currentConfig.configType === 'ECO_SETTING'
          "
        >
          Only config with Blockchain type can be passed
        </span>
        <span v-else>
          Only config with Asset or Blockchain type can be passed
        </span>
      </p>
      <div class="flex gap-1">
        <UiInputField
          v-model="textInputValue"
          type="text"
          :placeholder="'New parent name...'"
        />
        <UiButton class="warning" @click="onNullClickHandler">Null</UiButton>
      </div>
      <div class="flex justify-between gap-4">
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
const emit = defineEmits(["isModalConfirmed"]);
const props = defineProps(["configs", "currentConfig"]);

const { $toast } = useNuxtApp();

const textInputValue = ref("");

const onCanselHandler = () => {
  emit("isModalConfirmed", false);
};

const onConfirmHandler = () => {
  if (textInputValue.value.trim() === "") {
    $toast.warning("You need to enter new config name");
    return;
  }

  let newParentConfig;

  if (props.currentConfig.configType === "PROVIDERS") {
    /**
     * Searching for BLOCKCHAIN. For Providers clones.
     */
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

  if (props.currentConfig.configType === "PARTNER") {
    /**
     * Searching for BLOCKCHAIN and ASSET.
     */
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

  if (props.currentConfig.configType === "BANNER") {
    /**
     * Searching for BLOCKCHAIN.
     */
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

  if (props.currentConfig.configType === "ECO_SETTING") {
    /**
     * Searching for BLOCKCHAIN.
     */
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

  /**
   * We can set another asset but it needs to have the same BLOCKCHAIN as it was in previous parent.
   */
  /*
  if (newParentConfig.configType === "ASSET") {

    const oldParentChainConfig = getClosestChain(
      props.currentConfig.parentConfig,
    );
    if (typeof oldParentChainConfig === "string") {
      ?? 
      $toast.warning(oldParentChainConfig);
      return;
    }

    const oldParentChainConfigChildren = getChildConfigs(
      props.configs,
      oldParentChainConfig.configId,
    );

    const isNewParentHasSameChain = oldParentChainConfigChildren.find(
      (item) => item.configId === newParentConfig.configId,
    );

    if (!isNewParentHasSameChain) {
      $toast.warning("New asset parent has invalid chain");
      return;
    }
  }
  */
  // $toast.success("Parent was changed");
  emit("isModalConfirmed", newParentConfig);
};

const onNullClickHandler = () => {
  // $toast.success("Parent was set as null");
  emit("isModalConfirmed", "SET_NULL");
};

/*
const getChildConfigs = (configs, id) => {
  return configs.filter(
    (configItem) => configItem.parentConfig?.configId === id,
  );
};
*/
/*
const getClosestChain = (config, depth = 0) => {
  if (depth > 100) {
    return "Previous parent has chain of more than 100 parents and chain was not found";
  }

  if (config.configType === "BLOCKCHAIN") {
    return config;
  }

  const fullConfigObject = props.configs.find(
    (item) => item.configId === config.configId,
  );

  if (fullConfigObject.parentConfig) {
    return getClosestChain(fullConfigObject.parentConfig, depth + 1);
  } else {
    return "Previous parent chain was not found";
  }
};
*/

onMounted(() => {
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>
