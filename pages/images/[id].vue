<template>
  <main
    class="flex flex-col justify-center items-center gap-6 w-3/4 m-auto bg-white p-4 shadow-md mt-3 rounded"
  >
    <ConfirmModal
      v-if="isConfirmModalVisible"
      @is-modal-confirmed="modalConfirmHandler"
      >{{ confirmModalText }}</ConfirmModal
    >

    <imagesAddModal
      v-if="isAddModalVisibe"
      :payload="addModalPayload"
      @modal-handler="addModalHandler"
    />

    <imagesSkeleton v-if="isLoading" class="w-[75vw]" />
    <div v-else class="flex flex-col justify-center items-center gap-6 w-full">
      <header class="flex justify-between gap-4 w-full items-center">
        <UiButton @click="onConfigNavigate">
          <img
            src="~/assets/icons/icon-return.svg"
            class="w-4 h-4"
            alt="return"
          />
        </UiButton>
        <h2>
          <span v-if="imagesList.length === 0"
            >Current config has no images</span
          >
          <span v-else>Total count: {{ imagesList.length }}</span>
        </h2>
        <UiButton class="success" @click="onAddNewImageHandler">
          <img
            src="~/assets/icons/icon-add.svg"
            class="w-4 h-4 icon-add"
            alt="add"
          />
        </UiButton>
      </header>

      <div class="grid gap-6 justify-items-center imagesPageLayout w-full">
        <ConfigImageCard
          v-for="image in imagesList"
          :key="image.imageId"
          :image="image"
          class="max-w-[300px]"
          @on-update-click="onUpdateClickHandler"
          @on-delete-click="onDeleteClickHandler"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import { useStore } from "~/store";
import {
  getImagesByConfigId,
  addNewImage,
  updateImageById,
  deleteImageById,
} from "~/api/images";
import { getConfigById } from "~/api/configs";

definePageMeta({
  layout: "signedin",
});

// const { $toast } = useNuxtApp();

const store = useStore();
const router = useRouter();
const route = useRoute();
const { $toast } = useNuxtApp()

const isLoading = ref(true);

const isConfirmModalVisible = ref(false);
const confirmModalText = ref(null);
const confirmModalPayload = ref(null);
const confirmModalType = ref(null);

const isAddModalVisibe = ref(false);
const addModalPayload = ref(null);
const addModalType = ref(null);

const parentConfig = ref(null);
const imagesList = ref([]);

// Btn Handlers
const onAddNewImageHandler = () => {
  addModalType.value = "ADDNEW";
  isAddModalVisibe.value = true;
};

const onDeleteClickHandler = (image) => {
  isConfirmModalVisible.value = true;
  confirmModalText.value = "Are you sure you want to delete this image?";
  confirmModalType.value = "DELETE";
  confirmModalPayload.value = image;
};

const onUpdateClickHandler = (image) => {
  addModalType.value = "UPDATE";
  addModalPayload.value = image;
  isAddModalVisibe.value = true;
};

const modalConfirmHandler = (isConfirmed) => {
  isConfirmModalVisible.value = false;

  if (confirmModalType.value === "DELETE" && isConfirmed) {
    deleteImage(confirmModalPayload.value);
  }
  if (confirmModalType.value === "UPDATE" && isConfirmed) {
    const { imageData, addModalPayload } = confirmModalPayload.value;
    updateImage(imageData, addModalPayload);
  }

  confirmModalText.value = null;
  confirmModalType.value = null;
  confirmModalPayload.value = null;
};

const addModalHandler = (imageData) => {
  isAddModalVisibe.value = false;

  if (imageData && addModalType.value === "ADDNEW") uploadNewImage(imageData);
  if (imageData && addModalType.value === "UPDATE") {
    isConfirmModalVisible.value = true;
    confirmModalText.value = "Are you sure you want to update this image?";
    confirmModalType.value = "UPDATE";
    confirmModalPayload.value = {
      imageData,
      addModalPayload: addModalPayload.value,
    };
  }

  addModalType.value = null;
  addModalPayload.value = null;
};

// Navigation handlers
const onConfigNavigate = () => {
  router.push(`/configs/${route.params.id}`);
};

// Fetching functions
const deleteImage = async ({ imageId }) => {
  isLoading.value = true;
  const response = await deleteImageById(imageId, parentConfig.value.configId);

  if (response === 204) {
    // $toast.success(`Image was deleted`);
    await getImages();
  } else {
    // $toast.error(`Deleting image error, status: ${response}`);
  }
  isLoading.value = false;
};

const uploadNewImage = async (imageData) => {
  isLoading.value = true;
  const response = await addNewImage(imageData, parentConfig.value);
  if (response?.imageName === imageData.name) {
    // $toast.success(`Image was added`);
    await getImages();
  } else {
    // $toast.error(`Uploading image error, status: ${response}`);
  }
  isLoading.value = false;
};

const updateImage = async (newImageData, { imageId }) => {
  isLoading.value = true;
  const response = await updateImageById(
    newImageData,
    imageId,
    parentConfig.value
  );
  if (response.imageId === imageId) {
    // $toast.success(`Image was updated`);
    await getImages();
  } else {
    // $toast.error(`Updating image error, status: ${response}`);
  }
  isLoading.value = false;
};

const getImages = async () => {
  const response = await getImagesByConfigId(route.params.id);
  if (Array.isArray(response)) {
    imagesList.value = response;
  } else {
    // $toast.error(`Getting config images error, status: ${response}`);
  }
};

const getConfig = async () => {
  const response = await getConfigById(route.params.id);
  if (response.configFile) {
    return response;
  } else {
    // $toast.error(`Getting config error, status: ${response}`);
    return "Getting config error";
  }
};

const getImagesAndParentName = async () => {
  store.setHeaderTitle(`Loading...`);
  isLoading.value = true;
  await getImages();
  if (store.imagesParentConfig) {
    parentConfig.value = store.imagesParentConfig;
  } else if (imagesList.value.length > 0) {
    parentConfig.value = imagesList.value[0].parentConfig;
  } else {
    const parentResponse = await getConfig(route.params.id);
    parentConfig.value = parentResponse;
  }
  store.setImagesParentConfig(parentConfig.value);
  store.setHeaderTitle(`Config ${parentConfig.value.configName} images`);
  isLoading.value = false;
};

// Hooks
onMounted(() => {
  getImagesAndParentName();
});

onBeforeUnmount(() => {
  store.setImagesParentConfig(null);
});
</script>

<style scoped>
.imagesPageLayout {
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
}
.icon-add {
  filter: invert(1) grayscale(100%) brightness(200%);
  mask: url(~/assets/icons/icon-add.svg) no-repeat center / contain;
  background-color: white;
}
</style>
