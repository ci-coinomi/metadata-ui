<template>
  <main
    class="flex flex-col justify-center items-center gap-6 bg-white p-4 mt-3 shadow-md rounded"
  >
    <modalConfirm
      v-if="isConfirmModalVisible"
      @is-modal-confirmed="modalConfirmHandler"
      >{{ confirmModalText }}</modalConfirm
    >

    <modalTextInput
      v-if="isTextInputModalVisible"
      @is-modal-confirmed="addNameModalHandler"
    />

    <modalAddImage
      v-if="isAddImageModalVisibe"
      @modal-handler="addImageModalHandler"
    />

    <div class="p-4 flex justify-center items-center w-full">
      <configBannerSkeleton v-if="isLoading" />

      <div
        v-else
        class="flex flex-col gap-4 justify-center items-center w-full"
      >
        <div class="flex gap-4 w-full items-start justify-between">
          <div class="w-full">
            <configNestedLine
              :configNestedObject="configFileObj"
              :is-cloned="true"
            />
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
          <UiButton class="w-1/4 success" @click="onSaveCloneHandler">
            Save
          </UiButton>
          <UiButton class="w-1/4 warning" @click="onChangeCloneNameHandler">
            Change name
          </UiButton>
          <UiButton class="w-1/4 danger" @click="onReturnHandler">
            Cancel
          </UiButton>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { addNewImage } from "~/api/images";
import { cloneConfig } from "~/api/configs";
import { useStore } from "~/store";

definePageMeta({
  layout: "signedin",
});

const { $toast } = useNuxtApp();
const store = useStore();
const router = useRouter();

const currentConfig = ref(null);
const configFileObj = ref(null);
const configImages = ref([]);
const isLoading = ref(false);

const isConfirmModalVisible = ref(false);
const confirmModalText = ref(null);
const isTextInputModalVisible = ref(false);
const isAddImageModalVisibe = ref(false);
const addImageModalType = ref(null);
const addImageModalPayload = ref(null);

const storedConfigList = computed(() => store.configsList);
const cloneConfigData = computed(() => store.cloneConfigData);

const modalConfirmHandler = (isConfirmed) => {
  isConfirmModalVisible.value = false;
  confirmModalText.value = null;

  if (isConfirmed) {
    cloneConfigRequest();
  }
};

const addNameModalHandler = (payload) => {
  isTextInputModalVisible.value = false;
  if (payload) {
    currentConfig.value.configName = payload;
    store.setHeaderTitle(`Clone name: ${currentConfig.value.configName}`);
  }
};

const addImageModalHandler = (newImage) => {
  isAddImageModalVisibe.value = false;

  if (newImage && addImageModalType.value === "ADDNEWIMAGE") {
    const newImageItem = {
      imageData: newImage.data,
      imageName: newImage.name,
    };
    configImages.value.push(newImageItem);
  }

  if (newImage && addImageModalType.value === "UPDATEIMAGE") {
    const newImageItem = {
      imageData: newImage.data,
      imageName: newImage.name,
    };
    const updatedImageIndex = configImages.value.indexOf(
      addImageModalPayload.value,
    );
    configImages.value[updatedImageIndex] = newImageItem;
  }
  addImageModalType.value = null;
  addImageModalPayload.value = null;
};

// Button handlers

const onUpdateImageHandler = (image) => {
  addImageModalType.value = "UPDATEIMAGE";
  addImageModalPayload.value = image;
  isAddImageModalVisibe.value = true;
};

const onDeleteImageHandler = (image) => {
  const deletedImageIndex = configImages.value.indexOf(image);
  configImages.value.splice(deletedImageIndex, 1);
};

const onAddNewImageHandler = () => {
  addImageModalType.value = "ADDNEWIMAGE";
  isAddImageModalVisibe.value = true;
};

const onSaveCloneHandler = () => {
  isConfirmModalVisible.value = true;
  confirmModalText.value = `Are you sure you want to create clone ${currentConfig.value.configName}?`;
};

const onChangeCloneNameHandler = () => {
  isTextInputModalVisible.value = true;
};

const onReturnHandler = () => {
  store.setCloneConfigData(null);
  router.push("configs");
};

// Requests

const cloneConfigRequest = async () => {
  const updatedConfigString = JSON.stringify(configFileObj.value);

  const cloneConfigPayload = {
    configName: currentConfig.value.configName,
    configFile: updatedConfigString,
    configType: currentConfig.value.configType,
    parentConfig: currentConfig.value.parentConfig,
  };
  const response = await cloneConfig(cloneConfigPayload);
  console.log(response);

  // if (response.configId) {
  //   const updatedConfigsList = [...storedConfigList.value];
  //   updatedConfigsList.unshift(response);
  //   store.setConfigsList(updatedConfigsList);
  //   $toast.success(`Clone of ${currentConfig.value.configName} was created`);
  // } else {
  //   $toast.error(`Creating clone error, status: ${response}`);
  // }
};

onMounted(() => {
  if (cloneConfigData.value) {
    const newConfigObject = {
      configName: cloneConfigData.value.cloneName,
      configType: cloneConfigData.value.parentConfig.configType,
      configFile: cloneConfigData.value.configFile,
      // We need to pass parent of parentConfig
      parentConfig: cloneConfigData.value.parentConfig?.parentConfig,
    };
    currentConfig.value = newConfigObject;
    configFileObj.value = JSON.parse(currentConfig.value.configFile);
    configImages.value = cloneConfigData.value.parentConfigImages;

    store.setHeaderTitle(`Clone name: ${currentConfig.value.configName}`);
  } else {
    store.setHeaderTitle(`Parent data is not defined`);
  }
});
</script>
