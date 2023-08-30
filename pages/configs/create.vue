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

    <modalSetParent
      v-if="isTextModalVisible"
      :configs="storedConfigList"
      :current-config="currentConfig"
      @is-modal-confirmed="modalTextHandler"
    />

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
              :current-config-data="currentConfig"
            />
            <div
              v-if="currentConfig"
              class="flex gap-4 justify-center items-center"
            >
              <p class="text-gray-400 flex-none">Clone name:</p>
              <UiInputField
                v-model="currentConfig.configName"
                :type="'text'"
                :class="nameInputClass"
              />
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
                  class="w-6 h-6 icon-add"
                  alt="add"
                />
              </UiButton>
            </div>
          </div>
        </div>

        <div class="flex w-2/5 gap-4 justify-between">
          <uiButton
            v-if="currentConfig.configType === 'PARTNER'"
            class="w-1/3 primary"
            @click="changeParentHandler"
          >
            Change parent
          </uiButton>
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
const isLoading = ref(true);
const isNameFieldUnderlined = ref(null);

const isConfirmModalVisible = ref(false);
const confirmModalText = ref(null);
const isAddImageModalVisibe = ref(false);
const addImageModalType = ref(null);
const addImageModalPayload = ref(null);
const isTextModalVisible = ref(null);

const storedConfigList = computed(() => store.configsList);
const cloneConfigData = computed(() => store.cloneConfigData);
const nameInputClass = computed(() =>
  !currentConfig.value.configName && isNameFieldUnderlined.value
    ? "warning"
    : "",
);

// Modal handlers
const modalTextHandler = (value) => {
  isTextModalVisible.value = null;
  if (value) {
    currentConfig.value.parentConfig.configId = value.configId;
    currentConfig.value.parentConfig.configType = value.configType;
    currentConfig.value.parentConfig.configName = value.configName;
  }
};

const modalConfirmHandler = (isConfirmed) => {
  isConfirmModalVisible.value = false;
  confirmModalText.value = null;

  if (isConfirmed && !currentConfig.value.configName) {
    $toast.warning(`Config name is required`);
    isNameFieldUnderlined.value = true;
    window.scrollTo(0, 0);
    return null;
  }

  if (isConfirmed && currentConfig.value.configName) cloneConfigRequest();
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

const changeParentHandler = () => {
  isTextModalVisible.value = true;
};

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
  isNameFieldUnderlined.value = null;
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
    return null;
  }

  // Adding new config to configList
  currentConfig.value.configId = response.configId;
  currentConfig.value.configFile = updatedConfigString;
  const updatedConfigsList = [...storedConfigList.value];
  updatedConfigsList.unshift(currentConfig.value);
  store.setConfigsList(updatedConfigsList);

  $toast.success(`New config ${currentConfig.value.configName} was created`);

  // Upload all images
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
  const response = await getConfigs();
  if (!Array.isArray(response)) {
    $toast.error(`Fetching configs error, status: ${response}`);
    store.setHeaderTitle(`Fetching configs error`);
    isLoading.value = false;
    return null;
  }
  const configsList = response.sort((a, b) => b.configId - a.configId);
  store.setConfigsList(configsList);
  return null;
};

// Utils

const getParentCategoryFromQuery = (queryType) => {
  const firstOfType = storedConfigList.value.filter(
    (item) => item.configType === queryType,
  )[0];
  const emptyConfigFIle = createEmptyConfigFileClone(firstOfType.configFile);
  const newConfigObject = {
    configName: "",
    configType: firstOfType.configType,
    configFile: emptyConfigFIle,
    parentConfig: firstOfType.parentConfig,
  };
  currentConfig.value = newConfigObject;
  configFileObj.value = JSON.parse(currentConfig.value.configFile);
};

const getParentConfigFormQuery = (queryParentId) => {
  const parentConfig = storedConfigList.value.filter(
    (item) => item.configId === Number(queryParentId),
  )[0];
  const newConfigObject = {
    configName: "",
    configType: parentConfig.configType,
    configFile: parentConfig.configFile,
    parentConfig: parentConfig.parentConfig,
  };
  currentConfig.value = newConfigObject;
  configFileObj.value = JSON.parse(currentConfig.value.configFile);

  moveParentOnTheFirstPlace(parentConfig, storedConfigList.value);
  getConfigImageRequest(queryParentId);
};

const getParentConfigFromStore = (cloneData) => {
  const newConfigObject = {
    configName: "",
    configType: cloneData.config.configType,
    configFile: cloneData.configFile,
    parentConfig: cloneData.parentConfig,
  };
  currentConfig.value = newConfigObject;
  configFileObj.value = JSON.parse(currentConfig.value.configFile);
  configImages.value = cloneData.configImages;

  moveParentOnTheFirstPlace(cloneData.config, storedConfigList.value);
  return null;
};

const moveParentOnTheFirstPlace = (parentConfig, configList) => {
  const parentIndexInStore = configList.findIndex(
    (item) => item.configId === parentConfig.configId,
  );
  const updatedConfigsList = [
    parentConfig,
    ...configList.slice(0, parentIndexInStore),
    ...configList.slice(parentIndexInStore + 1),
  ];
  store.setConfigsList(updatedConfigsList);
  return null;
};

onMounted(async () => {
  store.setHeaderTitle("Create clone");
  isLoading.value = true;

  if (cloneConfigData.value) {
    getParentConfigFromStore(cleared(cloneConfigData.value));
    isLoading.value = false;
    return;
  }

  if (storedConfigList.value.length === 0) await fetchConfigs();

  if (route.query.parent) {
    getParentConfigFormQuery(route.query.parent);
    isLoading.value = false;
    return;
  }

  if (route.query.type) {
    getParentCategoryFromQuery(route.query.type);
    isLoading.value = false;
  }
});
</script>
