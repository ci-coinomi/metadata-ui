<template>
  <imagesAddModal
    v-if="isAddImageModalVisibe"
    @modal-handler="addImageModalHandler"
  />

  <ConfirmModal
    v-if="isConfirmModalVisible"
    @is-modal-confirmed="modalConfirmHandler"
    >{{ confirmModalText }}</ConfirmModal
  >

  <article
    :class="isConfigUpdated ? 'border-[#d38b32] border-2' : 'border'"
    class="rounded-md shadow-md p-4 flex justify-center items-center"
  >
    <h3 v-if="isLoading" class="h-[300px] flex justify-center items-center">Loading...</h3>
    <div v-else class="flex flex-col gap-4 justify-center items-center w-full">
      <div class="flex justify-center items-center w-full">
        <h3 class="text-xl font-bold m-auto">{{ banner.configName }}</h3>
        <UiButton class="danger" @click="onDeleteConfigHandler">
          <img
            src="~/assets/icons/icon-trash.svg"
            class="w-6 h-6 icon-trash"
            alt="delete user"
          />
        </UiButton>
      </div>
      <div class="flex gap-4 w-full items-center justify-between">
        <div class="w-2/3">
          <configNestedLine :configNestedObject="configFileObj" />
        </div>
        <div class="flex justify-center items-center">
          <div 
          v-if="bannerImage && bannerImage.length === 0"
          class="flex justify-center items-center border rounded-md shadow-md w-[250px] h-[323px]">
            <UiButton
              class="success"
              @click="onAddNewImageHandler"
            >
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
    </div>
  </article>
</template>
<script setup>
import {
  getImagesByConfigId,
  deleteImageById,
  updateImageById,
  addNewImage,
} from "~/api/images";
import { deleteConfig } from "~/api/configs";

const { $toast } = useNuxtApp();

const props = defineProps({
  banner: Object,
});

const emit = defineEmits(["updateConfigItem", "deleteConfigItem"]);

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

// Requests

const updateImageRequest = async (newImageData) => {
  isLoading.value = true;
  const response = await updateImageById(
    newImageData,
    bannerImage.value[0].imageId,
    props.banner
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
    props.banner.configId
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
  const response = await addNewImage(imageData, props.banner);
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
  const response = await getImagesByConfigId(props.banner.configId);
  if (Array.isArray(response)) {
    bannerImage.value = response;
  } else {
    $toast.error(
      `Getting banner ${props.banner.configId} images error, status: ${response}`
    );
  }
  isLoading.value = false;
};

const deleteConfigRequest = async () => {
  isLoading.value = true;
  const response = await deleteConfig(props.banner.configId);
  if (response === 204) {
    $toast.success(`Config was successfully deleted`);
    emit("deleteConfigItem", props.banner.configId);
  } else {
    $toast.error(`Deleting config error, status: ${response}`);
  }
  isLoading.value = false;
};

onMounted(() => {
  configFileObj.value = JSON.parse(props.banner.configFile);
  getConfigImageRequest();
});

watch(
  () => configFileObj.value,
  () => {
    if (props.banner.configFile !== JSON.stringify(configFileObj.value)) {
      isConfigUpdated.value = true;
      emit("updateConfigItem", {
        id: props.banner.configId,
        banner: props.banner,
        newConfigFile: JSON.stringify(configFileObj.value),
      });
    } else {
      isConfigUpdated.value = false;
    }
  },
  {
    deep: true,
  }
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
