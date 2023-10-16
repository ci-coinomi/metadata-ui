<template>
  <modalAddImage
    v-if="isAddImageModalVisibe"
    @modal-handler="addImageModalHandler"
  />

  <modalConfirm
    v-if="isConfirmModalVisible"
    @is-modal-confirmed="modalConfirmHandler"
    >{{ confirmModalText }}</modalConfirm
  >

  <modalSetParent
    v-if="isParentModalVisible"
    :configs="storedConfigList"
    :current-config="currentConfig"
    @is-modal-confirmed="modalParentHandler"
  />

  <div class="flex items-center justify-center p-4">
    <configBannerSkeleton v-if="isLoading" />

    <div v-else class="flex w-full flex-col items-center justify-center gap-4">
      <div class="flex w-full items-start justify-between gap-4">
        <div class="w-full">
          <ConfigParentData
            v-if="currentConfig"
            :parent-data="currentConfig.parentConfig"
            :current-config-data="currentConfig"
            :parentUpdateTrigger="configUpdateTrigger"
          />
          <ConfigConfiguredProvidersNestedLine
            v-if="config.configType === 'CONFIGURED_PROVIDERS'"
            :configNestedObject="configFileObj"
            :is-cloned="false"
            :configUpdateTrigger="configUpdateTrigger"
            :fullConfigObject="config"
          />
          <configNestedLine
            v-else
            :configNestedObject="configFileObj"
            :is-cloned="false"
            :configUpdateTrigger="configUpdateTrigger"
          />
        </div>
        <div class="flex flex-col items-center justify-center gap-4">
          <div
            v-if="configImages.length === 0"
            class="flex h-[323px] w-[250px] items-center justify-center rounded-md border shadow-md"
          >
            <UiButton class="success" @click="onAddNewImageHandler">
              <img
                src="~/assets/icons/icon-add.svg"
                class="icon-add h-6 w-6"
                alt="add"
              />
            </UiButton>
          </div>
          <div v-else class="flex flex-col items-center justify-center gap-4">
            <configImageCard
              v-for="image in configImages"
              :key="image.imageId"
              :image="image"
              class="w-[250px]"
              @on-update-click="onUpdateImageHandler(image)"
              @on-delete-click="onDeleteImageHandler(image)"
            />
            <UiButton class="success" @click="onAddNewImageHandler">
              <img
                src="~/assets/icons/icon-add.svg"
                class="icon-add h-6 w-6"
                alt="add"
              />
            </UiButton>
          </div>
        </div>
      </div>
      <div
        v-if="isConfigEditable(currentConfig.configType)"
        class="flex w-[70%] justify-center gap-4"
      >
        <UiButton class="success w-1/5" @click="onCloneConfigHandler">
          Clone config
        </UiButton>
        <UiButton
          v-if="
            currentConfig.configType === 'PARTNER' ||
            currentConfig.configType === 'PROVIDERS' ||
            currentConfig.configType === 'BANNER' ||
            currentConfig.configType === 'ECO_SETTING' ||
            currentConfig.configType === 'DAPP'
          "
          class="primary w-1/5"
          @click="changeParentHandler"
        >
          Change parent
        </UiButton>
        <UiButton class="warning w-1/5" @click="onUpdateConfigHandler">
          Save changes
        </UiButton>
        <UiButton class="danger w-1/5" @click="onDeleteConfigHandler">
          Delete
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getImagesByConfigId,
  deleteImageById,
  updateImageById,
  addNewImage,
} from "~/api/images";
import { deleteConfig, updateConfig } from "~/api/configs";
import { useStore } from "~/store";

const { $toast } = useNuxtApp();
const store = useStore();
const router = useRouter();

const props = defineProps({
  config: Object,
});
const emit = defineEmits(["configUpdateEmit"]);

const configUpdateTrigger = ref(1);

const currentConfig = ref(props.config);
const configImages = ref([]);
const configFileObj = ref(null);
const isLoading = ref(false);
const isConfigUpdated = ref(false);

const isAddImageModalVisibe = ref(false);
const addImageModalType = ref(null);
const imageModalPayload = ref(null);

const isConfirmModalVisible = ref(false);
const confirmModalText = ref(null);
const confirmModalType = ref(null);
const confirmModalPayload = ref(null);

const isParentModalVisible = ref(null);
const isParentUpdated = ref(false);
const defaultParentConfig = ref(props.config.parentConfig);

const storedConfigList = computed(() => store.configsList);
const currentItemInStoreIndex = computed(() =>
  storedConfigList.value.findIndex(
    (item) => item.configId === currentConfig.value.configId,
  ),
);

/**
 * Hide edit buttons for not-editable config types
 */
const isConfigEditable = (currentConfigType) =>
  !(
    currentConfigType === "CONFIGURED_PROVIDER_NETWORKS" ||
    currentConfigType === "CONFIGURED_PROVIDER_GROUPS"
  );

// Modal handlers
const modalParentHandler = (value) => {
  isParentModalVisible.value = null;

  if (value && value === "SET_NULL") {
    currentConfig.value.parentConfig = null;
    return;
  }

  if (value) {
    const { configId, configType, configName } = value;
    const newParentConfig = {
      configId,
      configType,
      configName,
    };
    currentConfig.value.parentConfig = newParentConfig;
  }
};

const modalConfirmHandler = (isConfirmed) => {
  isConfirmModalVisible.value = false;

  if (confirmModalType.value === "DELETECONFIG" && isConfirmed) {
    deleteConfigRequest();
  }

  if (confirmModalType.value === "DELETEIMAGE" && isConfirmed) {
    deleteImageRequest(confirmModalPayload.value);
  }

  if (confirmModalType.value === "UPDATEIMAGE" && isConfirmed) {
    updateImageRequest(confirmModalPayload.value, imageModalPayload.value);
  }

  if (confirmModalType.value === "UPDATECONFIG" && isConfirmed) {
    updateConfigRequest();
  }

  confirmModalText.value = null;
  confirmModalType.value = null;
  confirmModalPayload.value = null;
  imageModalPayload.value = null;
};

const addImageModalHandler = (imageData) => {
  isAddImageModalVisibe.value = false;

  if (imageData && addImageModalType.value === "ADDNEWIMAGE") {
    uploadNewImageRequest({
      imageName: imageData.name,
      imageData: imageData.data,
    });
  }

  if (imageData && addImageModalType.value === "UPDATEIMAGE") {
    isConfirmModalVisible.value = true;
    confirmModalText.value = "Are you sure you want to update this image?";
    confirmModalType.value = "UPDATEIMAGE";
    confirmModalPayload.value = imageData;
  }
  addImageModalType.value = null;
};

// Button handlers

const changeParentHandler = () => {
  isParentModalVisible.value = true;
};

const onCloneConfigHandler = () => {
  const cloneData = {
    config: currentConfig.value,
    configFile: currentConfig.value.configFile,
    configImages: configImages.value,
    parentConfig: currentConfig.value.parentConfig,
  };

  store.setCloneConfigData(cloneData);
  router.push({
    path: "/configs/create",
    query: {
      parent: currentConfig.value.configId,
    },
  });
};

const onUpdateImageHandler = (image) => {
  addImageModalType.value = "UPDATEIMAGE";
  isAddImageModalVisibe.value = true;
  imageModalPayload.value = image; // To track image we want to update
};

const onDeleteImageHandler = (image) => {
  confirmModalType.value = "DELETEIMAGE";
  isConfirmModalVisible.value = true;
  confirmModalText.value = "Are you sure you want to delete this image?";
  confirmModalPayload.value = image;
};

const onAddNewImageHandler = () => {
  addImageModalType.value = "ADDNEWIMAGE";
  isAddImageModalVisibe.value = true;
};

const onDeleteConfigHandler = () => {
  isConfirmModalVisible.value = true;
  confirmModalType.value = "DELETECONFIG";
  confirmModalText.value = `Are you sure you want to delete ${currentConfig.value.configName}?`;
};

const onUpdateConfigHandler = () => {
  isConfirmModalVisible.value = true;
  confirmModalType.value = "UPDATECONFIG";
  confirmModalText.value = `Are you sure you want to update ${currentConfig.value.configName}?`;
};

// Requests

const updateConfigRequest = async () => {
  if (isConfigUpdated.value || isParentUpdated.value) {
    const updatedConfigString = JSON.stringify(configFileObj.value);
    const response = await updateConfig(
      currentConfig.value,
      updatedConfigString,
    );

    if (!response.configFile) {
      $toast.error(
        `Updating config ${currentConfig.value.configName} error, status: ${response}`,
      );
    } else {
      $toast.success(`Config ${currentConfig.value.configName} was updated`);
      currentConfig.value.configFile = response.configFile;
      defaultParentConfig.value = currentConfig.value.parentConfig;

      // Update store.configList by adding updated config...
      const updatedConfigsList = [...storedConfigList.value];
      updatedConfigsList[currentItemInStoreIndex.value] = currentConfig.value;
      store.setConfigsList(updatedConfigsList);

      configUpdateTrigger.value += 1;

      isConfigUpdated.value = false;
      emit("configUpdateEmit", isConfigUpdated.value);
    }
  } else {
    $toast.warning(
      `No changes have been made to the config ${currentConfig.value.configName}.`,
    );
  }
};

const updateImageRequest = async (newImageData, oldImage) => {
  isLoading.value = true;

  const response = await updateImageById(
    newImageData,
    oldImage.imageId,
    currentConfig.value,
  );
  if (response.imageId === oldImage.imageId) {
    $toast.success(`Image was updated`);
    await getConfigImageRequest();
  } else {
    $toast.error(`Updating image error, status: ${response}`);
  }
  isLoading.value = false;
};

const deleteImageRequest = async (image) => {
  isLoading.value = true;

  const response = await deleteImageById(
    image.imageId,
    currentConfig.value.configId,
  );
  if (response === 204) {
    $toast.success(`Image was deleted`);
    await getConfigImageRequest();
  } else {
    $toast.error(`Deleting image error, status: ${response}`);
  }
  isLoading.value = false;
};

const uploadNewImageRequest = async (image) => {
  isLoading.value = true;
  const response = await addNewImage(image, currentConfig.value);
  if (response?.imageName === image.imageName) {
    $toast.success(`Image was added`);
    await getConfigImageRequest();
  } else {
    $toast.error(`Uploading image error, status: ${response}`);
  }
  isLoading.value = false;
};

const getConfigImageRequest = async () => {
  isLoading.value = true;
  const response = await getImagesByConfigId(currentConfig.value.configId);
  if (Array.isArray(response)) {
    configImages.value = response;
  } else {
    $toast.error(
      `Getting config ${currentConfig.value.configId} images error, status: ${response}`,
    );
  }
  isLoading.value = false;
};

const deleteConfigRequest = async () => {
  isLoading.value = true;
  const response = await deleteConfig(currentConfig.value.configId);
  if (response === 204) {
    $toast.success(`Config was successfully deleted`);

    // Updating configsList in store.
    // List in /configs.vue will be updated due to using store.configsList watcher
    const updatedConfigsList = [
      ...storedConfigList.value.slice(0, currentItemInStoreIndex.value),
      ...storedConfigList.value.slice(currentItemInStoreIndex.value + 1),
    ];
    store.setConfigsList(updatedConfigsList);
  } else {
    $toast.error(`Deleting config error, status: ${response}`);
  }

  isLoading.value = false;
};

onMounted(() => {
  // deleting top-level apiVersion field
  const objectToBePrinted = JSON.parse(currentConfig.value.configFile);
  if (objectToBePrinted.apiVersion) delete objectToBePrinted.apiVersion;
  configFileObj.value = objectToBePrinted;
  getConfigImageRequest();
});

watch(
  () => configFileObj.value,
  () => {
    /*
    We need extra-reparsing for cases when in original config price === 0.010, but after
    JSON.stringify it turns to 0.01
    */
    // Deleting apiVersion...
    const defaultConfigFile = JSON.parse(currentConfig.value.configFile);
    if (defaultConfigFile.apiVersion) delete defaultConfigFile.apiVersion;

    !areObjectsEqual(cleared(defaultConfigFile), cleared(configFileObj.value))
      ? (isConfigUpdated.value = true)
      : (isConfigUpdated.value = false);
    emit("configUpdateEmit", isConfigUpdated.value);
  },
  {
    deep: true,
  },
);

watch(
  () => currentConfig.value?.parentConfig?.configId,
  () => {
    if (
      currentConfig.value?.parentConfig?.configId !==
      defaultParentConfig.value?.configId
    ) {
      isParentUpdated.value = true;
    } else {
      isParentUpdated.value = false;
    }
  },
);
</script>

<style scoped>
.icon-add {
  filter: invert(1) grayscale(100%) brightness(200%);
  mask: url(~/assets/icons/icon-add.svg) no-repeat center / contain;
  background-color: white;
}
</style>
