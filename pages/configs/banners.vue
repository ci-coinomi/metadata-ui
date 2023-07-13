<template>
  <div>
    <div
      class="fixed top-[76px] right-[25px] flex flex-col items-end gap-2 bg-white p-4 shadow-md rounded"
    >
      <UiButton
        class="w-full success"
        :disabled="isLoading"
        @click="onCreateCloneHandler"
      >
        <span>Create new</span>
      </UiButton>

      <UiButton
        class="w-full warning"
        :disabled="isLoading"
        @click="onUpdateAllHandler"
      >
        <span>Update all</span>
      </UiButton>
    </div>
    <main
      class="flex flex-col justify-center items-center gap-3 relative bg-white mt-3 p-4 shadow-md rounded"
    >
      <modalTextInput
        v-if="isTextInputModalVisible"
        v-model="clonedConfigName"
        @is-modal-confirmed="addNameModalHandler"
      />

      <modalConfirm
        v-if="isConfirmModalVisible"
        @is-modal-confirmed="modalConfirmHandler"
        >{{ confirmModalText }}</modalConfirm
      >

      <UiButton class="mr-auto" @click="onConfigListNavigate">
        <img
          src="~/assets/icons/icon-return.svg"
          class="w-4 h-4"
          alt="return"
        />
      </UiButton>

      <div class="flex flex-col gap-3 w-full">
        <div v-if="isLoading">
          <configBannerSkeleton />
          <configBannerSkeleton />
          <configBannerSkeleton />
        </div>

        <h2
          v-if="!isLoading && (!bannersList || bannersList.length === 0)"
          class="text-xl flex justify-center items-center"
        >
          Configs were not recieved
        </h2>

        <div class="flex gap-3 flex-col">
          <configBannerCard
            v-for="banner in bannersList"
            :key="banner.configId"
            :banner="banner"
            @delete-config-item="deleteConfigItem"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { getConfigs, cloneConfig } from "~/api/configs";

import { useStore } from "~/store";

definePageMeta({
  layout: "signedin",
});

const { $toast } = useNuxtApp();
const router = useRouter();
const store = useStore();

const isLoading = ref(true);
const bannersList = ref(null);

// Config modal
const isTextInputModalVisible = ref(false);
const clonedConfigName = ref(null);

// Confirm modal
const isConfirmModalVisible = ref(false);
const confirmModalText = ref(null);
const confirmModalType = ref(null);

const onConfigListNavigate = () => {
  router.push({
    name: "configs",
  });
};

const modalConfirmHandler = (isConfirmed) => {
  isConfirmModalVisible.value = false;

  if (confirmModalType.value === "UPDATEALLCONFIGS" && isConfirmed) {
    store.setUpdateAllBannersTrigger(true);
  }

  confirmModalText.value = null;
  confirmModalType.value = null;
};

const deleteConfigItem = (payload) => {
  const deletedItemIndex = bannersList.value.findIndex(
    (item) => item.configId === payload,
  );
  bannersList.value.splice(deletedItemIndex, 1);
};

// Handlers

const onCreateCloneHandler = () => {
  isTextInputModalVisible.value = true;
};

const addNameModalHandler = (payload) => {
  isTextInputModalVisible.value = false;
  if (payload) cloneConfigRequest(payload);
};

const onUpdateAllHandler = () => {
  isConfirmModalVisible.value = true;
  confirmModalText.value = "Are you sure you want to update all banners?";
  confirmModalType.value = "UPDATEALLCONFIGS";
};

// Requests

const cloneConfigRequest = async (cloneName) => {
  const emptyConfigFile = createEmptyConfigFileClone();
  const parentObjectEmptyClone = {
    configFile: emptyConfigFile,
    configType: "BANNER",
  };

  const response = await cloneConfig(cloneName, parentObjectEmptyClone);
  if (response.configId) {
    bannersList.value.unshift(response);
    $toast.success(`New banner was successfully created`);
  } else {
    $toast.error(`Creating clone error, status: ${response}`);
  }
  clonedConfigName.value = null;
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
