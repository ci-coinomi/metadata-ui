<template>
  <main
    class="mt-3 flex flex-col items-center justify-center gap-6 rounded bg-white p-4 shadow-md"
  >
    <modalConfirm
      v-if="isConfirmModalVisible"
      @is-modal-confirmed="modalConfirmHandler"
    >
      {{ confirmModalText }}
    </modalConfirm>

    <modalAddImage
      v-if="isAddImageModalVisibe"
      @modal-handler="modalAddImageHandler"
    />

    <ModalSetParent
      v-if="isParentModalVisible"
      :configs="storedConfigList"
      :current-config="editingConfig"
      @is-modal-confirmed="modalParentHandler"
    />

    <DesignConfigBannerSkeleton v-if="isLoading" />

    <div v-else class="flex w-full flex-col items-center justify-center gap-4">
      <div class="flex w-full items-start justify-between gap-4">
        <section v-if="editingConfig" class="w-full">
          <ConfigParentData
            :parent-data="editingConfig.parentConfig"
            :current-config-data="editingConfig"
          />
          <div class="flex items-center justify-center gap-4 p-2">
            <p class="flex-none text-gray-400">Name:</p>
            <UiInputField
              v-model="editingConfig.configName"
              :type="'text'"
              :class="nameInputClass"
            />
          </div>
          <ConfigConfiguredProvidersNestedLine
            v-if="editingConfig.configType === 'CONFIGURED_PROVIDERS'"
            :config-nested-object="fileObject"
            :is-cloned="true"
            :full-config-object="editingConfig"
          />
          <configNestedLine
            v-else
            :config-nested-object="fileObject"
            :is-cloned="true"
          />
        </section>

        <section class="flex flex-col items-center justify-center gap-4">
          <div
            v-if="configImages.length === 0"
            class="flex h-[323px] w-[250px] items-center justify-center rounded-md border shadow-md"
          >
            <UiButton class="success" @click="btnHandler.onAddNewImage">
              <img
                src="~/assets/icons/icon-add.svg"
                class="icon-add h-6 w-6"
                alt="add"
              />
            </UiButton>
          </div>
          <div v-else class="flex flex-col items-center justify-center gap-4">
            <configImageCard
              v-for="image in configImages"
              :key="image.imageId"
              :image="image"
              class="w-[250px]"
              @on-update-click="btnHandler.onUpdateImage"
              @on-delete-click="btnHandler.onDeleteImage"
            />
            <UiButton class="success" @click="btnHandler.onAddNewImage">
              <img
                src="~/assets/icons/icon-add.svg"
                class="icon-add h-6 w-6"
                alt="add"
              />
            </UiButton>
          </div>
        </section>
      </div>

      <fieldset class="flex w-2/5 justify-between gap-4">
        <uiButton
          v-if="isChangeParentButtonVisible"
          class="primary w-1/3"
          @click="btnHandler.onChangeParent"
        >
          Change parent
        </uiButton>
        <UiButton class="success w-1/3" @click="btnHandler.onSaveClone">
          Save
        </UiButton>
        <UiButton class="danger w-1/3" @click="btnHandler.onReturn">
          Cancel
        </UiButton>
      </fieldset>
    </div>
  </main>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";
import { useConfigStore } from "@/stores/configs";
import { addNewImage, getImagesByConfigId } from "@/api/images";
import {
  cloneConfig,
  getConfigs,
  getProviderGroups,
  getProviderNetworks,
  getProviderAccounts,
} from "@/api/configs";

definePageMeta({
  layout: "signedin",
});

const { $toast } = useNuxtApp();
const appStore = useAppStore();
const configStore = useConfigStore();
const router = useRouter();
const route = useRoute();

const { storedConfigList, providerGroups, providerNetworks, providerAccounts } =
  storeToRefs(configStore);

const editingConfig = ref(null);
const fileObject = ref(null);
const configImages = ref([]);
const isLoading = ref(true);
const isNameFieldUnderlined = ref(null);

const isConfirmModalVisible = ref(false);
const confirmModalText = ref(null);
const isAddImageModalVisibe = ref(false);
const addImageModalType = ref(null);
const addImageOldValue = ref(null);
const isParentModalVisible = ref(false);

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

const nameInputClass = computed(() =>
  !editingConfig.value.configName && isNameFieldUnderlined.value
    ? "warning"
    : "",
);

/* Button click handlers */
const btnHandler = {
  onChangeParent: () => {
    isParentModalVisible.value = true;
  },

  onUpdateImage: (image) => {
    addImageModalType.value = "UPDATE_IMAGE";
    addImageOldValue.value = image;
    isAddImageModalVisibe.value = true;
  },

  onDeleteImage: (image) => {
    const deletedImageIndex = configImages.value.indexOf(image);
    configImages.value.splice(deletedImageIndex, 1);
  },

  onAddNewImage: () => {
    addImageModalType.value = "ADD_NEW_IMAGE";
    isAddImageModalVisibe.value = true;
  },

  onSaveClone: () => {
    isConfirmModalVisible.value = true;
    confirmModalText.value = `Are you sure you want to create clone ${editingConfig.value.configName}?`;
  },

  onReturn: () => {
    router.push("/configs");
  },
};

/* MODAL HANDLERS */
const modalParentHandler = (payload) => {
  isParentModalVisible.value = false;
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

const modalConfirmHandler = (payload) => {
  isConfirmModalVisible.value = false;
  confirmModalText.value = null;

  if (!payload) return;

  if (!editingConfig.value.configName) {
    $toast.warning(`Config name is required`);
    isNameFieldUnderlined.value = true;
    window.scrollTo(0, 0);
    return null;
  }

  cloneConfigRequest();
};

const modalAddImageHandler = (payload) => {
  isAddImageModalVisibe.value = false;

  if (payload && addImageModalType.value === "ADD_NEW_IMAGE") {
    const newImageItem = {
      imageData: payload.data,
      imageName: payload.name,
    };
    configImages.value.push(newImageItem);
  }

  if (payload && addImageModalType.value === "UPDATE_IMAGE") {
    const newImageItem = {
      imageData: payload.data,
      imageName: payload.name,
    };
    const updatedImageIndex = configImages.value.indexOf(
      addImageOldValue.value,
    );
    configImages.value[updatedImageIndex] = newImageItem;
  }

  addImageModalType.value = null;
  addImageOldValue.value = null;
};

/* REQUESTS */

const cloneConfigRequest = async () => {
  isNameFieldUnderlined.value = null;
  isLoading.value = true;

  const newConfigObject = createNewConfigObject();
  const response = await cloneConfig(newConfigObject);

  if (!response.success) {
    $toast.error(`Creating clone error, status: ${response.status}`);
    router.push("/configs");
    isLoading.value = false;
    return;
  }

  editingConfig.value.configId = response.data.configId;
  editingConfig.value.configFile = newConfigObject.configFile;

  updateConfigList(editingConfig.value);
  $toast.success(`New config ${editingConfig.value.configName} was created`);

  if (configImages.value.length) {
    await uploadConfigImages();
  }

  router.push("/configs");
  isLoading.value = false;
};

/**
 * Uploading array of images with Promise.all + uploadSingleImageRequest and handling errors.
 */
const uploadConfigImages = async () => {
  const uploadPromises = configImages.value.map((img) =>
    uploadSingleImageRequest(img),
  );
  const imageResponses = await Promise.all(uploadPromises);

  const failedUploads = imageResponses.filter((res) => !res.success);

  if (!failedUploads.length) {
    $toast.success("All images were added successfully");
  } else {
    const uniqueStatuses = [
      ...new Set(failedUploads.map((failed) => failed.status)),
    ];
    const message = `${failedUploads.length}/${
      configImages.value.length
    } images were not loaded with statuses: ${uniqueStatuses.join(", ")}`;
    $toast.error(message);
  }
};

const uploadSingleImageRequest = async (image) => {
  const response = await addNewImage(image, editingConfig.value);
  return { ...response, imageName: image.imageName };
};

const fetchConfigImages = async (id) => {
  const response = await getImagesByConfigId(id);
  if (response.success) {
    configImages.value = response.data;
  } else {
    $toast.error(
      `Getting config ${id} images error, status: ${response.status}`,
    );
  }
};

/**
 * Get configs if they don't exist in store
 */
const fetchConfigs = async () => {
  if (storedConfigList.value.length === 0) {
    const response = await getConfigs();
    if (response.success) {
      configStore.setConfigList(response.data);
    } else {
      $toast.error(`Fetching configs error, status: ${response.status}`);
    }
  }
};

/**
 * Get all providers data in one place if they don't exist in store.
 */
const fetchProvidersData = async () => {
  if (!providerGroups.value) {
    const groupResponse = await getProviderGroups();
    if (groupResponse.success) {
      configStore.setProviderGroups(groupResponse.data);
    } else {
      $toast.error(
        `Getting provider groups error, status: ${groupResponse.status}`,
      );
    }
  }

  if (!providerNetworks.value) {
    const networksResponse = await getProviderNetworks();
    if (networksResponse.success) {
      configStore.setProviderNetworks(networksResponse.data);
    } else {
      $toast.error(
        `Getting provider networks error, status: ${networksResponse.status}`,
      );
    }
  }

  if (!providerAccounts.value) {
    const accountsResponse = await getProviderAccounts();
    if (accountsResponse.success) {
      configStore.setProviderAccounts(accountsResponse.data);
    } else {
      $toast.error(
        `Getting provider accounts error, status: ${accountsResponse.status}`,
      );
    }
  }
};

onMounted(async () => {
  appStore.setHeaderTitle("Create config");
  isLoading.value = true;

  await fetchConfigs();
  await fetchProvidersData();

  /**
   * We can reach this page by cloning exact config or by "Create Clone" button near search bar.
   * In first case we are searching for parent in storedConfigList by configId from query.
   * In second - for first element in storedConfigList with configType from query.
   */
  if (route.query.parent) {
    const parentConfig = storedConfigList.value.find(
      (item) => item.configId === Number(route.query.parent),
    );
    createDefaultCurrentConfig(parentConfig);
    fetchConfigImages(route.query.parent);
  } else if (route.query.type) {
    const firstOfType = storedConfigList.value.find(
      (item) => item.configType === route.query.type,
    );
    const emptyConfigFile = createEmptyConfigFileClone(firstOfType.configFile);
    createDefaultCurrentConfig({ ...firstOfType, configFile: emptyConfigFile });
  }

  setInitParentForConfiguredProviders();
  isLoading.value = false;
});

/* UTILS */

/**
 * Creating object we will work with. Some kind of serialization.
 */
const createDefaultCurrentConfig = (config) => {
  const processedConfigFile = processConfig(config.configFile);
  const newConfigObject = {
    configName: "",
    configType: config.configType,
    configFile: processedConfigFile,
    parentConfig: config.parentConfig,
  };

  editingConfig.value = newConfigObject;
  fileObject.value = JSON.parse(editingConfig.value.configFile);
};

/**
 * Edit configFile.
 */
const processConfig = (configFile) => {
  const serializedConfigFile = JSON.parse(configFile);
  /**
   * Removing apiVersion
   */
  if (serializedConfigFile.apiVersion) delete serializedConfigFile.apiVersion;

  /**
   * Only for configuredProviders.
   * createEmptyConfigFileClone clears all arrays and add empty string to them.
   * Empty string as value of providers array in configuredProviders is invalid.
   */
  if (
    serializedConfigFile["@type"] === "configuredProviders" &&
    serializedConfigFile.providers?.length === 1 &&
    serializedConfigFile.providers?.[0] === ""
  ) {
    serializedConfigFile.providers = [];
  }
  return JSON.stringify(serializedConfigFile);
};

/**
 * If we are creating CONFIGURED_PROVIDERS and we don't have blockchain - open modal and make user to choose blockchain.
 */
const setInitParentForConfiguredProviders = () => {
  if (
    editingConfig.value.configType === "CONFIGURED_PROVIDERS" &&
    !fileObject.value.blockchain
  ) {
    isParentModalVisible.value = true;
  }
};

/**
 * Create payload to pass it to api.cloneConfig - request.
 */
const createNewConfigObject = () => {
  const newConfigObject = {
    configName: editingConfig.value.configName,
    configFile: JSON.stringify(fileObject.value),
    configType: editingConfig.value.configType,
  };

  if (editingConfig.value.parentConfig) {
    newConfigObject.parentConfig = editingConfig.value.parentConfig;
  }

  return newConfigObject;
};

/**
 * Update storedConfigList by adding created config.
 */
const updateConfigList = (newConfig) => {
  const updatedConfigsList = [newConfig, ...storedConfigList.value];
  configStore.setConfigList(updatedConfigsList);
};
</script>
