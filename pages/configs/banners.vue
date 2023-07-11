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
          <configBannerCard
            v-for="banner in bannersList"
            :key="banner.configId"
            :banner="banner"
            @update-config-item="setUpdatedConfigItem"
            @delete-config-item="deleteConfigItem"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { updateConfig, getConfigs, cloneConfig } from "~/api/configs";

import { useStore } from "~/store";

definePageMeta({
  layout: "signedin",
});

const { $toast } = useNuxtApp();
const router = useRouter();
const store = useStore();

const isLoading = ref(true);
const bannersList = ref(null);
const updatedBannersList = ref([]);

// Config modal
const isAddNameModalVisible = ref(false);
const clonedConfigName = ref(null);

// Confirm modal
const isConfirmModalVisible = ref(false);
const confirmModalText = ref(null);
const confirmModalPayload = ref(null);
const confirmModalType = ref(null);

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

const setUpdatedConfigItem = (payload) => {
  const existingItemIndex = updatedBannersList.value.findIndex(
    (item) => item.id === payload.id
  );
  if (existingItemIndex !== -1) {
    updatedBannersList.value[existingItemIndex] = payload;
  } else {
    updatedBannersList.value.push(payload);
  }
};

const deleteConfigItem = (payload) => {
  const deletedItemIndex = bannersList.value.findIndex(
    (item) => item.configId === payload
  );
  bannersList.value.splice(deletedItemIndex, 1);
};

const onCreateCloneHandler = () => {
  isAddNameModalVisible.value = true;
};

const addNameModalHandler = (payload) => {
  isAddNameModalVisible.value = false;
  if (payload) cloneConfigRequest(payload);
};

const onUpdateAllHandler = () => {
  isConfirmModalVisible.value = true;
  confirmModalText.value = "Are you sure you want to update all banners?";
  confirmModalType.value = "UPDATEALLCONFIGS";
};

const updateAllConfigs = () => {
  isLoading.value = true;

  updatedBannersList.value.map(async (updatedConfigData) => {
    await updateConfigRequest(updatedConfigData);
  });

  isLoading.value = false;
  getBannersRequest();
};

// Requests
const updateConfigRequest = async ({ banner, newConfigFile }) => {
  const response = await updateConfig(banner, newConfigFile);

  if (!response.configFile) {
    $toast.error(
      `Updating config ${banner.configName} error, status: ${response}`
    );
  } else if (response.configFile !== newConfigFile) {
    $toast.error(
      `Updating config ${banner.configName} error. Perhaps the error is related to the parameter type.`
    );
  } else {
    $toast.success(`Config ${banner.configName} was updated`);
  }
  return response;
};

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

const getBannersRequest = async () => {
  isLoading.value = true;
  const response = await getConfigs();
  if (Array.isArray(response)) {
    bannersList.value = response
      .filter((config) => config.configType === "BANNER")
      .sort((a, b) => b.configId - a.configId);
  } else {
    $toast.error(`Fetching banners error, status: ${response}`);
  }
  isLoading.value = false;
};

onMounted(() => {
  store.setHeaderTitle(`Banners`);
  getBannersRequest();
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
      /* eslint-disable-next-line prefer-const */
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
