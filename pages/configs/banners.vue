<template>
  <div class="pt-3">
    <div
      class="fixed top-[76px] right-[25px] flex flex-col items-end gap-2 bg-white p-4 shadow-md rounded"
    >
      <UiButton class="w-full success" @click="onCreateCloneHandler">
        <span>Create new</span>
      </UiButton>

      <UiButton class="w-full warning" @click="onUpdateAllHandler">
        <span>Update all</span>
      </UiButton>
    </div>
    <main
      class="flex flex-col justify-center items-center gap-6 pb-10 relative w-3/4 m-auto bg-white p-4 shadow-md rounded"
    >
      <configAddNameModal
        v-if="isAddNameModalVisible"
        v-model="clonedConfigName"
        @is-modal-confirmed="addNameModalHandler"
      />

      <!-- <imagesAddModal
        v-if="isAddImageModalVisibe"
        :payload="addImageModalPayload"
        @modal-handler="addImageModalHandler"
      /> -->

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
      </div>
      <div class="flex flex-col gap-3 w-full">
        <div v-if="isLoading" class="flex justify-center items-center">
          <configItemSkeleton class="w-[90vw]" />
        </div>

        <div v-else class="flex gap-3 flex-col">
          <article
            v-for="banner in bannersList"
            :key="banner.configId"
            class="flex flex-col gap-4 border rounded-md shadow-md p-4 justify-center items-center"
          >
            <h3 class="text-xl font-bold">{{ banner.configName }}</h3>
            <div class="flex gap-4 w-full items-center justify-center">
              <div class="w-2/3">
                <configNestedLine :configNestedObject="banner.configFileObj" />
              </div>
              <div class="flex justify-center items-center">
                <UiButton v-if="banner.image.length === 0" class="success">
                  <!-- @click="onAddNewImageHandler" -->
                  <img
                    src="~/assets/icons/icon-add.svg"
                    class="w-4 h-4 icon-add"
                    alt="add"
                  />
                </UiButton>

                <ConfigImageCard
                  v-else
                  :image="banner.image[0]"
                  class="max-w-[250px]"
                />
                <!-- @on-update-click="onUpdateImageHandler"
                    @on-delete-click="onDeleteImageHandler" -->
              </div>
              <!-- @click="onDeleteConfigHandler" -->
              <UiButton class="danger">
                <img
                  src="~/assets/icons/icon-trash.svg"
                  class="w-6 h-6 icon-trash"
                  alt="delete user"
                />
              </UiButton>
            </div>
          </article>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import {
  getConfigById,
  updateConfig,
  getConfigs,
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

const { $toast } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const store = useStore();

const isLoading = ref(true);
const bannersList = ref(null);

// Config modal
const isAddNameModalVisible = ref(false);
const clonedConfigName = ref(null);

// Images modal
const isAddImageModalVisibe = ref(false);
const addImageModalPayload = ref(null);
const addImageModalType = ref(null);

// Confirm modal
const isConfirmModalVisible = ref(false);
const confirmModalText = ref(null);
const confirmModalPayload = ref(null);
const confirmModalType = ref(null);

// const handleNestedObjectUpdated = (updatedObject) => {
//   console.log(updatedObject);
// };

const onConfigListNavigate = () => {
  router.push({
    name: "configs",
  });
};

const modalConfirmHandler = (isConfirmed) => {
  isConfirmModalVisible.value = false;

  if (confirmModalType.value === "UPDATEALLCONFIGS" && isConfirmed) {
    updateAllConfigs();
  }

  confirmModalText.value = null;
  confirmModalType.value = null;
  confirmModalPayload.value = null;
};

// Config handlers

const onCreateCloneHandler = () => {
  isAddNameModalVisible.value = true
}

const addNameModalHandler = (payload) => {
  isAddNameModalVisible.value = false;
  if (payload) cloneConfigRequest(payload);
};

const onUpdateAllHandler = () => {
  isConfirmModalVisible.value = true;
  confirmModalText.value = "Are you sure you want to update all banners?";
  confirmModalType.value = "UPDATEALLCONFIGS";
};

const updateAllConfigs = async () => {
  console.log(bannersList.value)
  const updatedConfigs = bannersList.value.filter(
    (config) =>
    // см. updateConfigRequest в [id]
      config.configFile !== JSON.stringify(config.configFileObj)
  );

  const updatePromises = updatedConfigs.map((config) => {
    console.log(config);
  });

  await Promise.all(updatePromises);
};

// Config requests
const cloneConfigRequest = async (cloneName) => {
  isLoading.value = true;

  const emptyConfigFile = createEmptyConfigFileClone();
  const parentObjectEmptyClone = {
    configFile: emptyConfigFile,
    configType: "BANNER",
  };

  const response = await cloneConfig(cloneName, parentObjectEmptyClone);
  if (response.configId) {
    $toast.success(`Config was successfully cloned`);
    await getBannersRequest();
  } else {
    $toast.error(`Creating clone error, status: ${response}`);
  }
  clonedConfigName.value = null;
  isLoading.value = false;
};

const updateConfigItem = async () => {};

// Init requests
const parseBannersConfigs = (bannersList) => {
  const parsedBannersList = bannersList.map((banner) => {
    const configFileObj = JSON.parse(banner.configFile);
    // isUpdated for tracking changes
    return { ...banner, configFileObj, isUpdated: false };
  });

  return parsedBannersList;
};

const fetchConfigImage = async (id) => {
  const response = await getImagesByConfigId(id);
  if (Array.isArray(response)) {
    return response;
  } else {
    $toast.error(`Getting banner ${id} images error, status: ${response}`);
    return [];
  }
};

const getBannersWithImagesRequest = async (bannersList) => {
  const fetchPromises = bannersList.map(async (banner) => {
    const image = await fetchConfigImage(banner.configId);
    return { ...banner, image };
  });

  const updatedBannersList = await Promise.all(fetchPromises);
  return updatedBannersList;
};

const getBannersRequest = async () => {
  isLoading.value = true;
  const response = await getConfigs();
  if (Array.isArray(response)) {
    const banners = response
      .filter((config) => config.configType === "BANNER")
      .sort((a, b) => b.configId - a.configId);
    const bannersWithImagesList = await getBannersWithImagesRequest(banners);
    const bannersWithConfigObjects = parseBannersConfigs(bannersWithImagesList);
    console.log(bannersWithConfigObjects);
    bannersList.value = bannersWithConfigObjects;
  } else {
    $toast.error(`Fetching banners error, status: ${response}`);
  }
  isLoading.value = false;
};

onMounted(async () => {
  store.setHeaderTitle(`Banners`);
  await getBannersRequest();
});

watch(isAddNameModalVisible, () => {
  isAddNameModalVisible.value
    ? (document.body.style.overflow = "hidden")
    : (document.body.style.overflow = "");
});

const createEmptyConfigFileClone = () => {
  const obj = JSON.parse(bannersList.value[0].configFile);

  const processValue = (value) => {
    if (typeof value === "boolean") {
      return false;
    } else if (typeof value === "number") {
      return 0;
    } else if (typeof value === "string" && value !== "banner") {
      return "";
    } else if (Array.isArray(value)) {
      return [""];
    } else if (typeof value === "object" && value !== null) {
      for (let key in value) {
        value[key] = processValue(value[key]);
      }
      return value;
    } else {
      return value;
    }
  };

  const processedObj = processValue(obj);
  const processedJSONString = JSON.stringify(processedObj);

  return processedJSONString;
};
</script>
<style scoped>
.icon-trash {
  filter: invert(1) grayscale(100%) brightness(200%);
  mask: url(~/assets/icons/icon-trash.svg) no-repeat center / contain;
  background-color: white;
}
</style>
