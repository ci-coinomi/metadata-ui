<template>
  <ModalAddImage
    v-if="imageModalVisible"
    :old-image="imageModalPayload"
    @modal-handler="addImageModalHandler"
  />

  <ModalConfirm
    v-if="confirmModalVisible"
    @is-modal-confirmed="modalConfirmHandler"
  >
    {{ confirmModalText }}
  </ModalConfirm>

  <ModalChangeParent
    v-if="changeParentModalVisible"
    :configs="storedConfigList"
    :original-config="editingConfig"
    @modal-handler="modalParentHandler"
  />

  <DesignConfigBannerSkeleton v-if="isLoading" />

  <div
    v-else
    class="flex w-full flex-col items-center justify-center gap-4 p-4"
  >
    <div class="flex w-full items-start justify-between gap-4">
      <article v-if="originalConfig" class="w-full">
        <ConfigParentData
          :parent-data="editingConfig.parentConfig"
          :current-config-data="editingConfig"
          :parent-update-trigger="configUpdateTrigger"
        />

        <ConfigConfProviderNestedObjectEditor
          v-if="originalConfig.configType === 'CONFIGURED_PROVIDERS'"
          :configNestedObject="fileObject"
          :is-cloned="false"
          :config-update-trigger="configUpdateTrigger"
          :full-config-object="originalConfig"
        />
        <ConfigDefaultNestedObjectEditor
          v-else
          :configNestedObject="fileObject"
          :is-cloned="false"
          :config-update-trigger="configUpdateTrigger"
        />
      </article>

      <div class="flex flex-col items-center justify-center gap-4">
        <div
          v-if="configImages.length === 0"
          class="flex h-[323px] w-[250px] items-center justify-center rounded-md border shadow-md"
        >
          <UiButton class="success" @click="btnHandler.onAddImage">
            <img
              src="~/assets/icons/icon-add.svg"
              class="icon-add h-6 w-6"
              alt="add"
            />
          </UiButton>
        </div>
        <div v-else class="flex flex-col items-center justify-center gap-4">
          <ConfigImageCard
            v-for="image in configImages"
            :key="image.imageId"
            :image="image"
            class="w-[250px]"
            @on-update-click="btnHandler.onUpdateImage"
            @on-delete-click="btnHandler.onDeleteImage"
          />
          <UiButton class="success" @click="btnHandler.onAddImage">
            <img
              src="~/assets/icons/icon-add.svg"
              class="icon-add h-6 w-6"
              alt="add"
            />
          </UiButton>
        </div>
      </div>
    </div>

    <fieldset class="flex w-[70%] justify-center gap-4">
      <UiButton class="success w-1/5" @click="btnHandler.onCloneConfig">
        Clone config
      </UiButton>
      <UiButton
        v-if="isChangeParentButtonVisible"
        class="primary w-1/5"
        @click="btnHandler.onChangeParent"
      >
        Change parent
      </UiButton>
      <UiButton class="warning w-1/5" @click="btnHandler.onUpdateConfig">
        Save changes
      </UiButton>
      <UiButton class="danger w-1/5" @click="btnHandler.onDeleteConfig">
        Delete
      </UiButton>
    </fieldset>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import {
  getImagesByConfigId,
  deleteImageById,
  updateImageById,
  addNewImage,
} from "~/api/images";
import { deleteConfig, updateConfig } from "~/api/configs";
import { useConfigStore } from "@/stores/configs";

const { $toast } = useNuxtApp();
const configStore = useConfigStore();
const router = useRouter();

const props = defineProps({
  originalConfig: Object,
});

const emit = defineEmits(["configUpdateEmit"]);
const { storedConfigList } = storeToRefs(configStore);

const editingConfig = ref(cleared(props.originalConfig));
const configImages = ref([]);
const fileObject = ref(null);
const isLoading = ref(false);
const isConfigUpdated = ref(false);
const configUpdateTrigger = ref(1);

const imageModalVisible = ref(false);
const imageModalType = ref(null);
const imageModalPayload = ref(null);

const confirmModalVisible = ref(false);
const confirmModalText = ref(null);
const confirmModalType = ref(null);
const confirmModalPayload = ref(null);

const changeParentModalVisible = ref(false);
const isParentUpdated = ref(false);
const defaultParentConfig = ref(cleared(props.originalConfig?.parentConfig));

const currentItemInStoreIndex = computed(() =>
  storedConfigList.value.findIndex(
    (item) => item.configId === editingConfig.value.configId,
  ),
);
const isChangeParentButtonVisible = computed(() => {
  const validConfigTypes = [
    "PARTNER",
    "PROVIDERS",
    "BANNER",
    "ECO_SETTING",
    "DAPP",
    "CONFIGURED_PROVIDERS",
  ];
  return validConfigTypes.includes(editingConfig.value.configType);
});

/* MODAL HANDLERS */

const modalParentHandler = (payload) => {
  changeParentModalVisible.value = false;
  if (!payload) return;

  if (payload === "SET_NULL") {
    editingConfig.value.parentConfig = null;
    return;
  }

  const { configId, configType, configName } = payload;
  const newParentConfig = {
    configId,
    configType,
    configName,
  };
  editingConfig.value.parentConfig = newParentConfig;
};

const addImageModalHandler = (payload) => {
  imageModalVisible.value = false;

  if (payload) {
    const { imageName, imageData } = payload;

    if (imageModalType.value === "ADD_NEW_IMAGE") {
      uploadNewImageRequest({
        imageName,
        imageData,
      });
    }

    if (imageModalType.value === "UPDATE_IMAGE") {
      confirmModalVisible.value = true;
      confirmModalText.value = "Are you sure you want to update this image?";
      confirmModalType.value = "UPDATE_IMAGE";
      confirmModalPayload.value = payload;
    }
  }

  imageModalType.value = null;
};

const modalConfirmHandler = (isConfirmed) => {
  confirmModalVisible.value = false;

  if (isConfirmed && confirmModalType.value === "DELETE_CONFIG") {
    deleteConfigRequest();
  }

  if (isConfirmed && confirmModalType.value === "DELETE_IMAGE") {
    deleteImageRequest(confirmModalPayload.value);
  }

  if (isConfirmed && confirmModalType.value === "UPDATE_IMAGE") {
    /* New and old images */
    updateImageRequest(confirmModalPayload.value, imageModalPayload.value);
  }

  if (isConfirmed && confirmModalType.value === "UPDATE_CONFIG") {
    updateConfigRequest();
  }

  confirmModalText.value = null;
  confirmModalType.value = null;
  confirmModalPayload.value = null;
  imageModalPayload.value = null;
};

/* Button handlers */
const btnHandler = {
  onChangeParent: () => {
    changeParentModalVisible.value = true;
  },

  onCloneConfig: () => {
    router.push({
      path: "/configs/create",
      query: {
        parent: editingConfig.value.configId,
      },
    });
  },

  onUpdateImage: (image) => {
    imageModalType.value = "UPDATE_IMAGE";
    imageModalVisible.value = true;
    imageModalPayload.value = image; // To track original image we want to update
  },

  onDeleteImage: (image) => {
    confirmModalType.value = "DELETE_IMAGE";
    confirmModalVisible.value = true;
    confirmModalText.value = "Are you sure you want to delete this image?";
    confirmModalPayload.value = image;
  },

  onAddImage: () => {
    imageModalType.value = "ADD_NEW_IMAGE";
    imageModalVisible.value = true;
  },

  onDeleteConfig: () => {
    confirmModalVisible.value = true;
    confirmModalType.value = "DELETE_CONFIG";
    confirmModalText.value = `Are you sure you want to delete ${editingConfig.value.configName}?`;
  },

  onUpdateConfig: () => {
    confirmModalVisible.value = true;
    confirmModalType.value = "UPDATE_CONFIG";
    confirmModalText.value = `Are you sure you want to update ${editingConfig.value.configName}?`;
  },
};

/* REQUESTS */

const updateConfigRequest = async () => {
  isLoading.value = true;

  if (!isConfigUpdated.value && !isParentUpdated.value) {
    $toast.warning(
      `No changes have been made to the config ${editingConfig.value.configName}.`,
    );
    isLoading.value = false;
    return;
  }

  const updatedConfigString = JSON.stringify(fileObject.value);
  const response = await updateConfig(editingConfig.value, updatedConfigString);

  if (!response.success) {
    $toast.error(
      `Updating config ${editingConfig.value.configName} error, status: ${response.status}`,
    );
    isLoading.value = false;
    return;
  }

  $toast.success(`Config ${editingConfig.value.configName} was updated`);
  editingConfig.value.configFile = response.data.configFile;
  defaultParentConfig.value = editingConfig.value.parentConfig;

  // Update store.configList by adding updated config...
  const updatedConfigsList = [...storedConfigList.value];
  updatedConfigsList[currentItemInStoreIndex.value] = editingConfig.value;
  configStore.setConfigList(updatedConfigsList);

  configUpdateTrigger.value += 1;
  isConfigUpdated.value = false;
  emit("configUpdateEmit", isConfigUpdated.value);
  isLoading.value = false;
};

const deleteConfigRequest = async () => {
  isLoading.value = true;

  const response = await deleteConfig(editingConfig.value.configId);

  if (response.success) {
    $toast.success("Config was successfully deleted");

    const updatedConfigsList = [
      ...storedConfigList.value.slice(0, currentItemInStoreIndex.value),
      ...storedConfigList.value.slice(currentItemInStoreIndex.value + 1),
    ];
    configStore.setConfigList(updatedConfigsList);
  } else {
    $toast.error(`Deleting config error, status: ${response.status}`);
  }

  isLoading.value = false;
};

const uploadNewImageRequest = async (image) => {
  isLoading.value = true;

  const response = await addNewImage(image, editingConfig.value);

  if (response.success) {
    await fetchConfigImages();
    $toast.success(`Image was added`);
  } else {
    $toast.error(`Uploading image error, status: ${response.status}`);
  }
  isLoading.value = false;
};

const updateImageRequest = async (newImageData, oldImage) => {
  isLoading.value = true;

  const response = await updateImageById(
    newImageData,
    oldImage.imageId,
    editingConfig.value,
  );

  if (response.success) {
    await fetchConfigImages();
    $toast.success(`Image was updated`);
  } else {
    $toast.error(`Updating image error, status: ${response.status}`);
  }

  isLoading.value = false;
};

const deleteImageRequest = async (image) => {
  isLoading.value = true;

  const response = await deleteImageById(
    image.imageId,
    editingConfig.value.configId,
  );

  if (response.success) {
    await fetchConfigImages();
    $toast.success("Image was deleted");
  } else {
    $toast.error(`Deleting image error, status: ${response.status}`);
  }

  isLoading.value = false;
};

const fetchConfigImages = async () => {
  isLoading.value = true;
  const response = await getImagesByConfigId(editingConfig.value.configId);
  if (response.success) {
    configImages.value = response.data;
  } else {
    $toast.error(
      `Getting config ${editingConfig.value.configId} images error, status: ${response.status}`,
    );
  }
  isLoading.value = false;
};

onMounted(() => {
  fileObject.value = JSON.parse(editingConfig.value.configFile);
  fetchConfigImages();
});

watch(
  () => fileObject.value,
  (newFileObjectValue) => {
    const defaultConfigFile = JSON.parse(editingConfig.value.configFile);

    isConfigUpdated.value = !areObjectsEqual(
      cleared(defaultConfigFile),
      cleared(newFileObjectValue),
    );

    emit("configUpdateEmit", isConfigUpdated.value);
  },
  {
    deep: true,
  },
);

watch(
  () => editingConfig.value?.parentConfig?.configId,
  (newParentConfigId) => {
    isParentUpdated.value =
      newParentConfigId !== defaultParentConfig.value?.configId;
  },
);
</script>
