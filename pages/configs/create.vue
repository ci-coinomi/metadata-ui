<template>
  <main
    class="flex flex-col justify-center items-center gap-6 bg-white p-4 mt-3 shadow-md rounded"
  >
    <modalConfirm
      v-if="isConfirmModalVisible"
      @is-modal-confirmed="modalConfirmHandler"
      >{{ confirmModalText }}</modalConfirm
    >

    <modalAddImage
      v-if="isAddImageModalVisibe"
      @modal-handler="addImageModalHandler"
    />

    <!-- <div
      v-if="!cloneConfigData"
      class="flex flex-col gap-4 justify-center items-center my-20"
    >
      <h1 class="text-3xl">Config data was passed incorrectly</h1>
      <h2>
        Probably you may have reloaded the page. Need to go back to the config
        page
      </h2>
      <UiButton class="w-1/4 primary" @click="onReturnHandler">
        Return
      </UiButton>
    </div> -->
    <div class="p-4 flex justify-center items-center w-full">
      <configBannerSkeleton v-if="isLoading" />

      <div
        v-else
        class="flex flex-col gap-4 justify-center items-center w-full"
      >
        <div class="flex gap-4 w-full items-start justify-between">
          <div class="w-full">
            <ConfigParentData
              v-if="currentConfig && currentConfig.parentConfig"
              :parent-data="currentConfig.parentConfig"
            />
            <div
              v-if="currentConfig"
              class="flex gap-4 justify-center items-center"
            >
              <p class="text-gray-400 flex-none">Clone name:</p>
              <UiInputField v-model="currentConfig.configName" :type="'text'" />
            </div>
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

        <div class="flex w-1/3 gap-4 justify-between">
          <UiButton class="w-1/3 success" @click="onSaveCloneHandler">
            Save
          </UiButton>
          <UiButton class="w-1/3 danger" @click="onReturnHandler">
            Cancel
          </UiButton>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { addNewImage, getImagesByConfigId } from "~/api/images";
import { cloneConfig, getConfigs } from "~/api/configs";
import { createEmptyConfigFileClone } from "~/utils/utilfunc";
import { useStore } from "~/store";

definePageMeta({
  layout: "signedin",
});

const { $toast } = useNuxtApp();
const store = useStore();
const router = useRouter();
const route = useRoute();

const currentConfig = ref(null);
const configFileObj = ref(null);
const configImages = ref([]);
const isLoading = ref(false);

const isConfirmModalVisible = ref(false);
const confirmModalText = ref(null);
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

const onReturnHandler = () => {
  store.setCloneConfigData(null);
  router.push("/configs");
};

// Requests

const cloneConfigRequest = async () => {
  isLoading.value = true;

  const updatedConfigString = JSON.stringify(configFileObj.value);

  const cloneConfigPayload = {
    configName: currentConfig.value.configName,
    configFile: updatedConfigString,
    configType: currentConfig.value.configType,
  };

  if (currentConfig.value.parentConfig)
    cloneConfigPayload.parentConfig = currentConfig.value.parentConfig;

  const response = await cloneConfig(cloneConfigPayload);

  if (!response.configId) {
    $toast.error(`Creating clone error, status: ${response}`);
    router.push("/configs");
    isLoading.value = false;
    return;
  }

  currentConfig.value.configId = response.configId;
  currentConfig.value.configFile = updatedConfigString;

  const updatedConfigsList = [...storedConfigList.value];
  updatedConfigsList.unshift(currentConfig.value);
  store.setConfigsList(updatedConfigsList);
  $toast.success(`Clone ${currentConfig.value.configName} was created`);

  if (configImages.value.length > 0) {
    for (const image of configImages.value) {
      await uploadImageRequest(image);
    }
  }
  router.push("/configs");
  isLoading.value = false;
};

const uploadImageRequest = async (image) => {
  const response = await addNewImage(image, currentConfig.value);
  if (response?.imageName === image.imageName) {
    $toast.success(`Image ${image.imageName} was added`);
  } else {
    $toast.error(`Uploading image error, status: ${response}`);
  }
};

const getConfigImageRequest = async (id) => {
  isLoading.value = true;
  const response = await getImagesByConfigId(id);
  if (Array.isArray(response)) {
    configImages.value = response;
  } else {
    $toast.error(`Getting config ${id} images error, status: ${response}`);
  }
  isLoading.value = false;
};

const fetchConfigs = async () => {
  isLoading.value = true;

  const response = await getConfigs();

  if (!Array.isArray(response)) {
    $toast.error(`Fetching configs error, status: ${response}`);
    store.setHeaderTitle(`Fetching configs error`);
    isLoading.value = false;
    return;
  }

  const configsList = response.sort((a, b) => b.configId - a.configId);
  store.setConfigsList(configsList);

  if (route.query.type) {
    const firstOfType = configsList.filter(
      (item) => item.configType === route.query.type,
    )[0];
    const emptyConfigFIle = createEmptyConfigFileClone(firstOfType.configFile);
    const newConfigObject = {
      configName: "",
      configType: firstOfType.configType,
      configFile: emptyConfigFIle,
    };
    currentConfig.value = newConfigObject;
    configFileObj.value = JSON.parse(currentConfig.value.configFile);
  }

  if (route.query.parent) {
    const parentConfig = configsList.filter(
      (item) => item.configId === Number(route.query.parent),
    );
    const newConfigObject = {
      configName: "",
      configType: parentConfig[0].configType,
      configFile: parentConfig[0].configFile,
    };
    currentConfig.value = newConfigObject;
    configFileObj.value = JSON.parse(currentConfig.value.configFile);
    getConfigImageRequest(parentConfig[0].configId);

    // Put parentConfig on the first place in Store to be on the top of the configs list...
    const parentIndexInStore = configsList.findIndex(
      (item) => item.configId === parentConfig[0].configId,
    );
    console.log('Index is', parentIndexInStore)
    const updatedConfigsList = [
      ...storedConfigList.value.slice(0, parentIndexInStore),
      ...storedConfigList.value.slice(parentIndexInStore + 1),
    ];
    updatedConfigsList[0] = parentConfig.value;
    console.log(updatedConfigsList)
    store.setConfigsList(updatedConfigsList);
  }

  isLoading.value = false;
};

onMounted(() => {
  store.setHeaderTitle("Create clone");

  if (cloneConfigData.value) {
    const newConfigObject = {
      configName: cloneConfigData.value.cloneName,
      configType: cloneConfigData.value.parentConfig.configType,
      configFile: cloneConfigData.value.configFile,
      // We use parent of parentConfig
      parentConfig: cloneConfigData.value.parentConfig?.parentConfig,
    };
    currentConfig.value = newConfigObject;
    configFileObj.value = JSON.parse(currentConfig.value.configFile);
    configImages.value = cloneConfigData.value.parentConfigImages;

    // Put parentConfig on the first place in Store to be on the top of the configs list...
    // if (currentConfig.value.parentConfig) {
    //   const parentIndexInStore = store.configsList.findIndex(
    //     (item) => item.configId === currentConfig.value.parentConfig.configId,
    //   );
    //   const updatedConfigsList = [
    //     ...storedConfigList.value.slice(0, parentIndexInStore),
    //     ...storedConfigList.value.slice(parentIndexInStore + 1),
    //   ];
    //   updatedConfigsList.unshift(parentConfig.value);
    //   store.setConfigsList(updatedConfigsList);
    // }
  } else {
    fetchConfigs();
  }
});
</script>
