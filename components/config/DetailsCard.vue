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

  <!-- :class="isConfigUpdated ? 'ring-2 ring-[#d38b32]' : 'ring-1 ring-gray-400'" -->
  <div class="p-4 flex justify-center items-center border-t border-gray-400">
    <configBannerSkeleton v-if="isLoading" />

    <div v-else class="flex flex-col gap-4 justify-center items-center w-full">
      <div class="flex gap-4 w-full items-center justify-between">
        <div class="w-full">
          <configNestedLine :configNestedObject="configFileObj" />
        </div>
        <div class="flex justify-center items-center">
          <div
            v-if="bannerImage && bannerImage.length === 0"
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

          <ConfigImageCard
            v-else
            :image="bannerImage[0]"
            class="max-w-[250px]"
            @on-update-click="onUpdateImageHandler"
            @on-delete-click="onDeleteImageHandler"
          />
        </div>
      </div>

      <div class="flex w-1/2 gap-4 justify-between">
        <UiButton class="w-1/4 success" @click="onCloneConfigHandler">
          <span v-if="clonedConfigName">Save clone</span>
          <span v-else>Create clone</span>
        </UiButton>
        <UiButton class="w-1/4 warning" @click="onUpdateConfigHandler">
          <span v-if="clonedConfigName">Change clone name</span>
          <span v-else>Save changes</span>
        </UiButton>
        <UiButton
          class="w-1/4"
          :class="clonedConfigName ? 'gray' : 'danger'"
          @click="onDeleteConfigHandler"
        >
          <span v-if="clonedConfigName">Return without saving</span>
          <span v-else>Delete</span>
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

const props = defineProps({
  banner: Object,
});

const emit = defineEmits(["updateConfigItem", "deleteConfigItem"]);

const currentBanner = ref(props.banner);
const bannerImage = ref([]);
const configFileObj = ref(null);
const isLoading = ref(false);
const isConfigUpdated = ref(false);

const isAddImageModalVisibe = ref(false);
const addImageModalType = ref(null);

const isConfirmModalVisible = ref(false);
const confirmModalText = ref(null);
const confirmModalType = ref(null);
const confirmModalPayload = ref(null);

// Modal handlers
const modalConfirmHandler = (isConfirmed) => {
  isConfirmModalVisible.value = false;

  if (confirmModalType.value === "DELETECONFIG" && isConfirmed) {
    deleteConfigRequest();
  }

  if (confirmModalType.value === "DELETEIMAGE" && isConfirmed) {
    deleteImageRequest();
  }

  if (confirmModalType.value === "UPDATEIMAGE" && isConfirmed) {
    const imageData = confirmModalPayload.value;
    updateImageRequest(imageData);
  }

  confirmModalText.value = null;
  confirmModalType.value = null;
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

// Button handlers

const onUpdateImageHandler = () => {
  addImageModalType.value = "UPDATEIMAGE";
  isAddImageModalVisibe.value = true;
};

const onDeleteImageHandler = () => {
  confirmModalType.value = "DELETEIMAGE";
  isConfirmModalVisible.value = true;
  confirmModalText.value = "Are you sure you want to delete this image?";
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

const onUpdateConfigHandler = () => {};

// Requests

const updateConfigRequest = async () => {
  if (isConfigUpdated.value) {
    const updatedConfigString = JSON.stringify(configFileObj.value);

    const response = await updateConfig(
      currentBanner.value,
      updatedConfigString,
    );

    if (!response.configFile) {
      $toast.error(
        `Updating config ${currentBanner.value.configName} error, status: ${response}`,
      );
    } else if (response.configFile !== updatedConfigString) {
      $toast.error(
        `Updating config ${currentBanner.value.configName} error. The configuration has been changed incorrectly`,
      );
    } else {
      $toast.success(`Config ${currentBanner.value.configName} was updated`);
      currentBanner.value = response;
      isConfigUpdated.value = false;
    }
    store.setUpdateAllBannersTrigger(false);
  }
};

const updateImageRequest = async (newImageData) => {
  isLoading.value = true;
  const response = await updateImageById(
    newImageData,
    bannerImage.value[0].imageId,
    currentBanner.value,
  );
  if (response.imageId === bannerImage.value[0].imageId) {
    $toast.success(`Image was updated`);
    await getConfigImageRequest();
  } else {
    $toast.error(`Updating image error, status: ${response}`);
  }
  isLoading.value = false;
};

const deleteImageRequest = async () => {
  isLoading.value = true;

  const response = await deleteImageById(
    bannerImage.value[0].imageId,
    currentBanner.value.configId,
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
  const response = await addNewImage(imageData, currentBanner.value);
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
  const response = await getImagesByConfigId(currentBanner.value.configId);
  if (Array.isArray(response)) {
    bannerImage.value = response;
  } else {
    $toast.error(
      `Getting banner ${currentBanner.value.configId} images error, status: ${response}`,
    );
  }
  isLoading.value = false;
};

const deleteConfigRequest = async () => {
  isLoading.value = true;
  const response = await deleteConfig(currentBanner.value.configId);
  if (response === 204) {
    $toast.success(`Config was successfully deleted`);
    emit("deleteConfigItem", currentBanner.value.configId);
  } else {
    $toast.error(`Deleting config error, status: ${response}`);
  }
  isLoading.value = false;
};

onMounted(() => {
  configFileObj.value = JSON.parse(currentBanner.value.configFile);
  // getConfigImageRequest();
  console.log("BANNER LOADED!");
});

watch(
  () => configFileObj.value,
  () => {
    currentBanner.value.configFile !== JSON.stringify(configFileObj.value)
      ? (isConfigUpdated.value = true)
      : (isConfigUpdated.value = false);
  },
  {
    deep: true,
  },
);

watch(
  () => store.updateAllBannersTrigger,
  () => {
    if (store.updateAllBannersTrigger) {
      updateConfigRequest();
    }
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
