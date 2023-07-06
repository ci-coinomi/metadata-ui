<template>
  <main
    class="flex flex-col justify-center items-center gap-6 pb-10 relative w-3/4 m-auto bg-white p-4 shadow-md mt-3 rounded"
  >
    <configModal
      v-if="isConfigModalVisible"
      v-model="clonedConfigName"
      :modalType="configModalType"
      @is-modal-confirmed="configModalConfirm"
    />

    <imagesAddModal
      v-if="isAddImageModalVisibe"
      :payload="addImageModalPayload"
      @modal-handler="addImageModalHandler"
    />

    <ConfirmModal
      v-if="isConfirmModalVisible"
      @is-modal-confirmed="modalConfirmHandler"
      >{{ confirmModalText }}</ConfirmModal
    >

    <div class="flex justify-between w-full">
      <div class="flex gap-2">
        <UiButton @click="onConfigListNavigate">
          <img
            src="~/assets/icons/icon-return.svg"
            class="w-4 h-4"
            alt="return"
          />
        </UiButton>
      </div>
      <div class="flex gap-2">
        <UiButton
          :class="clonedConfigName ? 'gray' : 'danger'"
          @click="onDeleteConfigHandler"
        >
          <span v-if="clonedConfigName">Return without saving</span>
          <span v-else>Delete</span>
        </UiButton>
        <UiButton class="warning" @click="onUpdateConfigHandler">
          <span v-if="clonedConfigName">Change clone name</span>
          <span v-else>Save changes</span>
        </UiButton>
        <UiButton v class="success" @click="onCloneConfigHandler">
          <span v-if="clonedConfigName">Save clone</span>
          <span v-else>Create clone</span>
        </UiButton>
      </div>
    </div>
    <div class="flex flex-col gap-3 w-full">
      <div><strong>Type:</strong> {{ config.configType || "loading..." }}</div>
      <div v-if="isLoading" class="flex justify-center items-center">
        <configItemSkeleton class="w-[90vw]" />
      </div>
      <div v-else class="flex gap-3">
        <div class="w-2/3">
          <configNestedLine
            :configNestedObject="configFile"
            @nested-object-updated="handleNestedObjectUpdated"
          />
        </div>

        <div class="w-1/3 flex justify-center items-center">
          <UiButton
            v-if="imagesList?.length === 0"
            class="success"
            @click="onAddNewImageHandler"
          >
            <img
              src="~/assets/icons/icon-add.svg"
              class="w-4 h-4 icon-add"
              alt="add"
            />
          </UiButton>

          <ConfigImageCard
            v-else
            :image="imagesList[0]"
            class="max-w-[250px]"
            @on-update-click="onUpdateImageHandler"
            @on-delete-click="onDeleteImageHandler"
          />
        </div>
      </div>
    </div>
    <div class="flex gap-2">
      <UiButton
        :class="clonedConfigName ? 'gray' : 'danger'"
        @click="onDeleteConfigHandler"
      >
        <span v-if="clonedConfigName">Return without saving</span>
        <span v-else>Delete</span>
      </UiButton>
      <UiButton class="warning" @click="onUpdateConfigHandler">
        <span v-if="clonedConfigName">Change clone name</span>
        <span v-else>Save changes</span>
      </UiButton>
      <UiButton class="success" @click="onCloneConfigHandler">
        <span v-if="clonedConfigName">Save clone</span>
        <span v-else>Create clone</span>
      </UiButton>
    </div>
  </main>
</template>

<script setup>
import {
  getConfigById,
  updateConfig,
  cloneConfig,
  deleteConfig,
} from "~/api/configs";
import {
  getImagesByConfigId,
  deleteImageById,
  updateImageById,
  addNewImage,
} from "~/api/images";
import { useStore } from "~/store";

definePageMeta({
  layout: "signedin",
});

const route = useRoute();
const router = useRouter();
const store = useStore();

const isLoading = ref(true);
const config = ref({});
const configFile = ref({});
const clonedConfigName = ref("");
const imagesList = ref([]);

const configModalType = ref("");
const isConfigModalVisible = ref(false);

// Images modal
const addImageModalPayload = ref(null);
const isAddImageModalVisibe = ref(false);
const addImageModalType = ref(null);

// Confirm modal
const isConfirmModalVisible = ref(false);
const confirmModalText = ref(null);
const confirmModalPayload = ref(null);
const confirmModalType = ref(null);

const handleNestedObjectUpdated = (updatedObject) => {
  configFile.value = updatedObject;
};

const onConfigListNavigate = () => {
  router.push({
    name: "configs",
  });
};

// Image handlers
const onAddNewImageHandler = () => {
  addImageModalType.value = "ADDNEW";
  isAddImageModalVisibe.value = true;
};

const addImageModalHandler = (imageData) => {
  isAddImageModalVisibe.value = false;

  if (imageData && addImageModalType.value === "ADDNEW")
    uploadNewImage(imageData);
  if (imageData && addImageModalType.value === "UPDATE") {
    isConfirmModalVisible.value = true;
    confirmModalText.value = "Are you sure you want to update this image?";
    confirmModalType.value = "UPDATE";
    confirmModalPayload.value = {
      imageData,
      addImageModalPayload: addImageModalPayload.value,
    };
  }

  addImageModalType.value = null;
  addImageModalPayload.value = null;
};

const modalConfirmHandler = (isConfirmed) => {
  isConfirmModalVisible.value = false;

  if (confirmModalType.value === "DELETE" && isConfirmed) {
    deleteImage(confirmModalPayload.value);
  }
  if (confirmModalType.value === "UPDATE" && isConfirmed) {
    const { imageData, addImageModalPayload } = confirmModalPayload.value;
    updateImage(imageData, addImageModalPayload);
  }

  confirmModalText.value = null;
  confirmModalType.value = null;
  confirmModalPayload.value = null;
};

const onUpdateImageHandler = (image) => {
  addImageModalType.value = "UPDATE";
  addImageModalPayload.value = image;
  isAddImageModalVisibe.value = true;
};

const onDeleteImageHandler = (image) => {
  isConfirmModalVisible.value = true;
  confirmModalText.value = "Are you sure you want to delete this image?";
  confirmModalType.value = "DELETE";
  confirmModalPayload.value = image;
};

// Config handlers

const onUpdateConfigHandler = () => {
  if (clonedConfigName.value) {
    configModalType.value = "SETCLONENAME";
  } else {
    configModalType.value = "UPDATE";
  }
  isConfigModalVisible.value = true;
};

const onCloneConfigHandler = () => {
  if (clonedConfigName.value) {
    configModalType.value = "CREATECLONE";
  } else {
    configModalType.value = "SETCLONENAME";
  }
  isConfigModalVisible.value = true;
};

const onDeleteConfigHandler = () => {
  if (clonedConfigName.value) {
    clonedConfigName.value = "";
    store.setHeaderTitle(config.value.configName);
    configFile.value = JSON.parse(config.value.configFile);
  } else {
    configModalType.value = "DELETE";
    isConfigModalVisible.value = true;
  }
};

const configModalConfirm = (isConfirmed, cloneName) => {
  isConfigModalVisible.value = false;

  if (isConfirmed) {
    switch (configModalType.value) {
      case "UPDATE":
        updateConfigRequest();
        break;
      case "CREATECLONE":
        cloneConfigRequest();
        break;
      case "SETCLONENAME":
        clonedConfigName.value = cloneName;
        store.setHeaderTitle(`Clone: ${clonedConfigName.value}`);
        break;
      case "DELETE":
        deleteConfigRequest();
        break;
    }
  }
  configModalType.value = "";
};

// Requests, images

const uploadNewImage = async (imageData) => {
  isLoading.value = true;
  const response = await addNewImage(imageData, config.value);
  if (response?.imageName === imageData.name) {
    // toast.open({
    //   message: "Image was added",
    //   type: "success",
    // });
    await getImages();
  } else {
    // toast.open({
    //   message: `Uploading image error, status: ${response}`,
    //   type: "error",
    // });
  }
  isLoading.value = false;
};

const getImages = async () => {
  const response = await getImagesByConfigId(route.params.id);
  if (Array.isArray(response)) {
    imagesList.value = response;
  } else {
    // toast.open({
    //   message: `Getting config images error, status: ${response}`,
    //   type: "error",
    // });
  }
};

const deleteImage = async ({ imageId }) => {
  isLoading.value = true;
  const response = await deleteImageById(imageId, config.value.configId);

  if (response === 204) {
    // toast.open({
    //   message: "Image was deleted",
    //   type: "success",
    // });
    await getImages();
  } else {
    // toast.open({
    //   message: `Deleting image error, status: ${response}`,
    //   type: "error",
    // });
  }
  isLoading.value = false;
};

const updateImage = async (newImageData, { imageId }) => {
  isLoading.value = true;
  const response = await updateImageById(newImageData, imageId, config.value);
  if (response.imageId === imageId) {
    // toast.open({
    //   message: "Image was updated",
    //   type: "success",
    // });
    await getImages();
  } else {
    // toast.open({
    //   message: `Updating image error, status: ${response}`,
    //   type: "error",
    // });
  }
  isLoading.value = false;
};

// Requests, config

const cloneConfigRequest = async () => {
  isLoading.value = true;
  const response = await cloneConfig(clonedConfigName.value, config.value);
  if (response.configId) {
    // toast.open({
    //   message: "Config was successfully cloned",
    //   type: "success",
    // });
    config.value = response;
    router.push(`/configs/${config.value.configId}/banner`);
    configFile.value = JSON.parse(config.value.configFile);
    clonedConfigName.value = "";
  } else {
    // toast.open({
    //   message: `Creating clone error, status: ${response}`,
    //   type: "error",
    // });
  }
  isLoading.value = false;
};

const deleteConfigRequest = async () => {
  isLoading.value = true;
  const response = await deleteConfig(config.value.configId);
  if (response === 204) {
    // toast.open({
    //   message: "Config was successfully deleted",
    //   type: "success",
    // });
    router.push({
      name: "configs",
    });
  } else {
    // toast.open({
    //   message: `Deleting config error, status: ${response}`,
    //   type: "error",
    // });
  }
  isLoading.value = false;
};

const updateConfigRequest = async () => {
  const updatedConfig = JSON.stringify(configFile.value);
  /* 
  We need this extra JSON-reparcing for cases when in config.value.configFile (which was recieved from BE) we have 
  "value":0.0000010, but after JSON.parse(JSON.stringify(config.value.configFile)) (configFile-object we are working with)
  it will be converted to "value":0.000001. Before such reparcing they had the same value.
  */
  if (
    updatedConfig &&
    updatedConfig === JSON.stringify(JSON.parse(config.value.configFile))
  ) {
    // toast.open({
    //   message: "You need to update some fields before update",
    //   type: "warning",
    // });
    return;
  }

  isLoading.value = true;
  const response = await updateConfig(config.value, updatedConfig);

  if (
    response.configFile &&
    JSON.stringify(JSON.parse(response?.configFile)) === updatedConfig
  ) {
    // toast.open({
    //   message: "Config was successfully updated",
    //   type: "success",
    // });
  } else {
    // toast.open({
    //   message: `Updating config error, status: ${response}`,
    //   type: "error",
    // });
  }
  isLoading.value = false;
};

const getBannerWithImage = async () => {
  store.setHeaderTitle(`Loading...`);

  isLoading.value = true;
  const bannerResponse = await getConfigById(route.params.id);

  if (bannerResponse.configFile) {
    config.value = bannerResponse;
    configFile.value = JSON.parse(bannerResponse.configFile);
    store.setHeaderTitle(`Banner ${config.value.configName}`);
  } else {
    store.setHeaderTitle(`Fetching data error`);
    // toast.open({
    //   message: `Getting config error, status: ${bannerResponse}`,
    //   type: "error",
    // });
  }

  await getImages();

  isLoading.value = false;
};

watch(isConfigModalVisible, () => {
  isConfigModalVisible.value
    ? (document.body.style.overflow = "hidden")
    : (document.body.style.overflow = "");
});

onMounted(() => {
  getBannerWithImage();
});
</script>
