<template>
  <main
    class="flex flex-col justify-center items-center gap-6 w-3/4 m-auto bg-white p-4 shadow-md mt-3 rounded"
  >
    <!-- <ConfirmModal
      v-if="isConfirmModalVisible"
      :payload="confirmModalPayload"
      @is-modal-confirmed="modalConfirmHandler"
      >{{ confirmModalText }}</ConfirmModal
    > -->

    <imagesAddModal
      v-if="isAddModalVisibe"
      :payload="addModalPayload"
      @modal-handler="addModalHandler"
    />

    <userSkeleton v-if="isLoading" class="w-[75vw]" />
    <div v-else class="flex flex-col justify-center items-center gap-6 w-4/5">
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
        <UiButton @click="onAddNewImageHandler">
          <img src="~/assets/icons/icon-add.svg" class="w-4 h-4" alt="add" />
        </UiButton>
      </header>

      <div v-for="image in imagesList" :key="image.imageId">
        <imagesCard
          :image="image"
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

const store = useStore();
const router = useRouter();
const route = useRoute();

const isLoading = ref(true);

// const isConfirmModalVisible = ref(false);
// const confirmModalText = ref("");
// const confirmModalPayload = ref(null);
// const confirmModalType = ref("");

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
  deleteImage(image);
};

const onUpdateClickHandler = (image) => {
  addModalType.value = "UPDATE";
  addModalPayload.value = image;
  isAddModalVisibe.value = true;
};

const addModalHandler = (imageData) => {
  isAddModalVisibe.value = false;

  if (imageData && addModalType.value === "ADDNEW") uploadNewImage(imageData);
  if (imageData && addModalType.value === "UPDATE")
    updateImage(imageData, addModalPayload.value);

  addModalType.value = null;
  addModalPayload.value = null;
};

// Navigation handlers
const onConfigNavigate = () => {
  router.push(`/configs/${route.params.id}`);
};

// Fetching functions
const deleteImage = async ({ imageId }) => {
  const response = await deleteImageById(imageId, parentConfig.value.configId);
  // TODO закончить
  console.log(response);
};

const uploadNewImage = async (imageData) => {
  const response = await addNewImage(imageData, parentConfig.value);
  // TODO Blocked by CORS
  console.log(response);
};

const updateImage = async (newImageData, { imageId }) => {
  const response = await updateImageById(
    newImageData,
    imageId,
    parentConfig.value
  );
  console.log(response);
};

const getImages = async () => {
  const response = await getImagesByConfigId(route.params.id);
  imagesList.value = response;
};

const getImagesAndParentName = async () => {
  store.setHeaderTitle(`Loading...`);
  await getImages();

  if (store.imagesParentConfig) {
    parentConfig.value = store.imagesParentConfig;
  } else if (imagesList.value.length > 0) {
    parentConfig.value = imagesList.value[0].parentConfig;
  } else {
    const parentResponse = await getConfigById(route.params.id);
    parentConfig.value = parentResponse.configName;
  }

  store.setImagesParentConfig(parentConfig.value);
  store.setHeaderTitle(`Config ${parentConfig.value.configName} images`);
};

// Hooks
onMounted(() => {
  isLoading.value = true;
  getImagesAndParentName();
  isLoading.value = false;
});

onBeforeUnmount(() => {
  store.setImagesParentConfig(null);
});
</script>
