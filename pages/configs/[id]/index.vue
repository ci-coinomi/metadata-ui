<template>
  <main
    class="flex flex-col justify-center items-center gap-6 pb-10 relative w-3/4 m-auto bg-white p-4 shadow-md mt-3 rounded"
  >
    <configModal
      v-if="isModalVisible"
      v-model="clonedConfigName"
      :modalType="modalType"
      @is-modal-confirmed="modalConfirmHandler"
    />
    <div class="flex justify-between w-full">
      <div class="flex gap-2">
        <UiButton @click="onConfigListNavigate">
          <img
            src="~/assets/icons/icon-return.svg"
            class="w-4 h-4"
            alt="return"
          />
        </UiButton>
        <UiButton @click="onConfigImagesNavigate">Images</UiButton>
      </div>
      <div class="flex gap-2">
        <UiButton
          :class="clonedConfigName ? 'gray' : 'danger'"
          @click="onDeleteClickHandler"
        >
          <span v-if="clonedConfigName">Return without saving</span>
          <span v-else>Delete</span>
        </UiButton>
        <UiButton class="warning" @click="onUpdateClickHandler">
          <span v-if="clonedConfigName">Change clone name</span>
          <span v-else>Save changes</span>
        </UiButton>
        <UiButton v class="success" @click="onCloneClickHandler">
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
      <configNestedLine
        v-else
        :configNestedObject="configFile"
        @nested-object-updated="handleNestedObjectUpdated"
      />
    </div>
    <div class="flex gap-2">
      <UiButton
        :class="clonedConfigName ? 'gray' : 'danger'"
        @click="onDeleteClickHandler"
      >
        <span v-if="clonedConfigName">Return without saving</span>
        <span v-else>Delete</span>
      </UiButton>
      <UiButton class="warning" @click="onUpdateClickHandler">
        <span v-if="clonedConfigName">Change clone name</span>
        <span v-else>Save changes</span>
      </UiButton>
      <UiButton class="success" @click="onCloneClickHandler">
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
import { useStore } from "~/store";

definePageMeta({
  layout: "signedin",
});

const route = useRoute();
const router = useRouter();
const store = useStore();
const { $toast } = useNuxtApp();

const config = ref({});
const configFile = ref({});
const isLoading = ref(true);
const clonedConfigName = ref("");

const isModalVisible = ref(false);
const modalType = ref("");

const handleNestedObjectUpdated = (updatedObject) => {
  configFile.value = updatedObject;
};

const onUpdateClickHandler = () => {
  if (clonedConfigName.value) {
    modalType.value = "SETCLONENAME";
  } else {
    modalType.value = "UPDATE";
  }
  isModalVisible.value = true;
};

const onCloneClickHandler = () => {
  if (clonedConfigName.value) {
    modalType.value = "CREATECLONE";
  } else {
    modalType.value = "SETCLONENAME";
  }
  isModalVisible.value = true;
};

const onDeleteClickHandler = () => {
  if (clonedConfigName.value) {
    clonedConfigName.value = "";
    store.setHeaderTitle(config.value.configName);
    configFile.value = JSON.parse(config.value.configFile);
  } else {
    modalType.value = "DELETE";
    isModalVisible.value = true;
  }
};

const onConfigListNavigate = () => {
  router.push({
    name: "configs",
  });
};

const onConfigImagesNavigate = () => {
  store.setImagesParentConfig(config.value);
  router.push(`/images/${route.params.id}`);
};

const modalConfirmHandler = (isConfirmed, cloneName) => {
  isModalVisible.value = false;

  if (isConfirmed) {
    switch (modalType.value) {
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
  modalType.value = "";
};

const cloneConfigRequest = async () => {
  isLoading.value = true;
  const response = await cloneConfig(clonedConfigName.value, config.value);
  if (response.configId) {
    $toast.success(`Config was successfully cloned`);
    config.value = response;
    router.push(`/configs/${config.value.configId}`);
    configFile.value = JSON.parse(config.value.configFile);
    clonedConfigName.value = "";
  } else {
    $toast.error(`Creating clone error, status: ${response}`);
  }
  isLoading.value = false;
};

const deleteConfigRequest = async () => {
  isLoading.value = true;
  const response = await deleteConfig(config.value.configId);
  if (response === 204) {
    $toast.success(`Config was successfully deleted`);
    router.push({
      name: "configs",
    });
  } else {
    $toast.error(`Deleting config error, status: ${response}`);
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
    $toast.warning(`You need to update some fields before update`);
    return;
  }

  isLoading.value = true;
  const response = await updateConfig(config.value, updatedConfig);

  if (
    response.configFile &&
    JSON.stringify(JSON.parse(response?.configFile)) === updatedConfig
  ) {
    $toast.success(`Config was successfully updated`);
  } else {
    $toast.error(`Updating config error, status: ${response}`);
  }
  isLoading.value = false;
};

const getConfig = async () => {
  isLoading.value = true;

  const response = await getConfigById(route.params.id);
  if (response.configFile) {
    config.value = response;
    // Redirecting for collections and banners...
    if (config.value.configType === "BANNER") {
      router.push(`/configs/${route.params.id}/banner`);
    }
    if (config.value.configType === "NFT_COLLECTION") {
      router.push(`/configs/${route.params.id}/nft-collection`);
    }

    configFile.value = JSON.parse(response.configFile);
    store.setHeaderTitle(config.value.configName);
  } else {
    $toast.error(`Getting config error, status: ${response}`);
  }
  isLoading.value = false;
};

watch(isModalVisible, () => {
  isModalVisible.value
    ? (document.body.style.overflow = "hidden")
    : (document.body.style.overflow = "");
});

onMounted(() => {
  getConfig();
});
</script>
