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

  <modalTextInput
    v-if="isTextInputModalVisible"
    @is-modal-confirmed="addNameModalHandler"
  />

  <div
    class="p-4 flex justify-center items-center border-t"
    :class="isConfigUpdated ? 'border-[#d38b32]' : 'border-gray-400'"
  >
    <configBannerSkeleton v-if="isLoading" />

    <div v-else class="flex flex-col gap-4 justify-center items-center w-full">
      <div class="flex gap-4 w-full items-start justify-between">
        <div class="w-full">
          <configNestedLine :configNestedObject="configFileObj" />
        </div>
        <div class="flex flex-col gap-4 justify-center items-center">
          <div
            v-if="configImages.length === 0"
            class="flex justify-center items-center border rounded-md shadow-md w-[250px] h-[323px]"
          >
            <UiButton class="success" @click="onAddNewImageHandler">
              <img
                src="~/assets/icons/icon-add.svg"
                class="w-6 h-6 icon-add"
                alt="add"
              />
            </UiButton>
          </div>
          <div v-else class="flex justify-center gap-4 flex-col items-center">
            <ConfigImageCard
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
                class="w-6 h-6 icon-add"
                alt="add"
              />
            </UiButton>
          </div>
        </div>
      </div>

      <div class="flex w-1/2 gap-4 justify-between">
        <UiButton class="w-1/4 success" @click="onCloneConfigHandler">
          Create clone
        </UiButton>
        <UiButton class="w-1/4 warning" @click="onUpdateConfigHandler">
          Save changes
        </UiButton>
        <UiButton class="w-1/4 danger" @click="onDeleteConfigHandler">
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
import { deleteConfig, updateConfig, cloneConfig } from "~/api/configs";
import { useStore } from "~/store";

const { $toast } = useNuxtApp();
const store = useStore();

const props = defineProps({
  config: Object,
});

const emit = defineEmits(["configUpdateEmit"]);

const currentConfig = ref(props.config);
const configImages = ref([]);
const configFileObj = ref(null);
const isLoading = ref(false);
const isConfigUpdated = ref(false);

const isAddImageModalVisibe = ref(false);
const addImageModalType = ref(null);

const isConfirmModalVisible = ref(false);
const confirmModalText = ref(null);
const confirmModalType = ref(null);
const confirmModalPayload = ref(null);

const isTextInputModalVisible = ref(false);

const storedConfigList = computed(() => store.configsList);
const currentItemInStoreIndex = computed(() =>
  storedConfigList.value.findIndex(
    (item) => item.configId === currentConfig.value.configId,
  ),
);

// Modal handlers

const modalConfirmHandler = (isConfirmed) => {
  isConfirmModalVisible.value = false;

  if (confirmModalType.value === "DELETECONFIG" && isConfirmed) {
    deleteConfigRequest();
  }

  if (confirmModalType.value === "DELETEIMAGE" && isConfirmed) {
    deleteImageRequest(confirmModalPayload.value);
  }

  if (confirmModalType.value === "UPDATEIMAGE" && isConfirmed) {
    updateImageRequest(confirmModalPayload.value);
  }

  if (confirmModalType.value === "UPDATECONFIG" && isConfirmed) {
    updateConfigRequest();
  }

  confirmModalText.value = null;
  confirmModalType.value = null;
  confirmModalPayload.value = null;
};

const addImageModalHandler = (imageData) => {
  isAddImageModalVisibe.value = false;

  if (imageData && addImageModalType.value === "ADDNEWIMAGE") {
    uploadNewImageRequest(imageData);
  }

  if (imageData && addImageModalType.value === "UPDATEIMAGE") {
    isConfirmModalVisible.value = true;
    confirmModalText.value = "Are you sure you want to update this image?";
    confirmModalType.value = "UPDATEIMAGE";
    confirmModalPayload.value = imageData;
  }
  addImageModalType.value = null;
};

const addNameModalHandler = (payload) => {
  isTextInputModalVisible.value = false;
  if (payload) cloneConfigRequest(payload);
};

// Button handlers

const onCloneConfigHandler = () => {
  isTextInputModalVisible.value = true;
};

const onUpdateImageHandler = () => {
  addImageModalType.value = "UPDATEIMAGE";
  isAddImageModalVisibe.value = true;
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
  confirmModalText.value = "Are you sure you want to delete this config?";
};

const onUpdateConfigHandler = () => {
  isConfirmModalVisible.value = true;
  confirmModalType.value = "UPDATECONFIG";
  confirmModalText.value = "Are you sure you want to update this config?";
};

// Requests

const cloneConfigRequest = async (cloneName) => {
  const parentObject = {
    configFile: currentConfig.value.configFile,
    configType: currentConfig.value.configType,
  };

  const response = await cloneConfig(cloneName, parentObject);

  if (response.configId) {
    const updatedConfigsList = [...storedConfigList.value];
    updatedConfigsList.unshift(response);
    store.setConfigsList(updatedConfigsList);
    $toast.success(`Clone of ${currentConfig.value.configName} was created`);
  } else {
    $toast.error(`Creating clone error, status: ${response}`);
  }
};

const updateConfigRequest = async () => {
  if (isConfigUpdated.value) {
    const updatedConfigString = JSON.stringify(configFileObj.value);

    const response = await updateConfig(
      currentConfig.value,
      updatedConfigString,
    );

    if (!response.configFile) {
      $toast.error(
        `Updating config ${currentConfig.value.configName} error, status: ${response}`,
      );
    } else if (response.configFile !== updatedConfigString) {
      $toast.error(
        `Updating config ${currentConfig.value.configName} error. The configuration has been changed incorrectly`,
      );
    } else {
      $toast.success(`Config ${currentConfig.value.configName} was updated`);
      currentConfig.value = response;

      // Update store.configList by adding updated config...
      const updatedConfigsList = [...storedConfigList.value];
      updatedConfigsList[currentItemInStoreIndex.value] = response;
      store.setConfigsList(updatedConfigsList);

      isConfigUpdated.value = false;
      emit("configUpdateEmit", isConfigUpdated.value);
    }
  } else {
    $toast.warning(
      `No changes have been made to the config ${currentConfig.value.configName}.`,
    );
  }
};

const updateImageRequest = async (newImageData) => {
  isLoading.value = true;
  const response = await updateImageById(
    newImageData,
    configImages.value[0].imageId,
    currentConfig.value,
  );
  if (response.imageId === configImages.value[0].imageId) {
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

const uploadNewImageRequest = async (imageData) => {
  isLoading.value = true;
  const response = await addNewImage(imageData, currentConfig.value);
  if (response?.imageName === imageData.name) {
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
  configFileObj.value = JSON.parse(currentConfig.value.configFile);
  getConfigImageRequest();
});

watch(
  () => configFileObj.value,
  () => {
    /*
    We need extra-reparsing for cases when in original config price === 0.010, but after
    JSON.stringify it turns to 0.01
    */
    const stringifiedConfigFile = JSON.stringify(
      JSON.parse(currentConfig.value.configFile),
    );
    stringifiedConfigFile !== JSON.stringify(configFileObj.value)
      ? (isConfigUpdated.value = true)
      : (isConfigUpdated.value = false);
    emit("configUpdateEmit", isConfigUpdated.value);
  },
  {
    deep: true,
  },
);
</script>

<style scoped>
.icon-trash {
  filter: invert(1) grayscale(100%) brightness(200%);
  mask: url(~/assets/icons/icon-trash.svg) no-repeat center / contain;
  background-color: white;
}

.icon-add {
  filter: invert(1) grayscale(100%) brightness(200%);
  mask: url(~/assets/icons/icon-add.svg) no-repeat center / contain;
  background-color: white;
}
</style>
