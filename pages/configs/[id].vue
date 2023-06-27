<template>
  <main class="flex flex-col justify-center items-center gap-6 pb-10 relative">
    <configModal
      v-if="isModalVisible"
      v-model="clonedConfigName"
      :modalType="modalType"
      @is-modal-confirmed="modalConfirmHandler"
    />
    <div class="flex justify-between w-full">
      <UiButton @click="onConfigNavigateHandler">To config list</UiButton>
      <h1 v-if="clonedConfigName" class="text-2xl font-bold">
        Clone: {{ clonedConfigName }}
      </h1>
      <h1 v-else class="text-2xl font-bold">
        {{ config.configName || "Config is loading" }}
      </h1>
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

definePageMeta({
  layout: "signedin",
});

const route = useRoute();
const router = useRouter();

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
    configFile.value = JSON.parse(config.value.configFile);
  } else {
    modalType.value = "DELETE";
    isModalVisible.value = true;
  }
};

const onConfigNavigateHandler = () => {
  router.push({
    name: "configs",
  });
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
  if (response?.configId) {
    alert("Config was cloned");
    config.value = response;
    router.push(`/configs/${config.value.configId}`);
    configFile.value = JSON.parse(config.value.configFile);
    clonedConfigName.value = "";
  } else {
    alert("Something went wrong :(");
  }
  isLoading.value = false;
};

const deleteConfigRequest = async () => {
  isLoading.value = true;
  const response = await deleteConfig(config.value.configId);
  if (response === 204) {
    alert("Config was deleted");
    router.push({
      name: "configs",
    });
  } else {
    alert("Something went wrong :(");
  }
  isLoading.value = false;
};

const updateConfigRequest = async () => {
  const updatedConfig = JSON.stringify(configFile.value);
  /* 
  We need this extra JSON-reparcing for cases when in config.value.configFile we have "value":0.0000010,
  but after JSON.parse(JSON.stringify) of configFile.value it will be converted to "value":0.000001
  */
  if (updatedConfig === JSON.stringify(JSON.parse(config.value.configFile))) {
    alert("You need to update some fields before update");
    return;
  }

  isLoading.value = true;
  const response = await updateConfig(config.value, updatedConfig);

  if (JSON.stringify(JSON.parse(response?.configFile)) === updatedConfig) {
    alert("Updating was successful");
  } else {
    alert("Something went wrong :(");
  }
  isLoading.value = false;
};

watch(isModalVisible, () => {
  isModalVisible.value
    ? (document.body.style.overflow = "hidden")
    : (document.body.style.overflow = "");
});

onMounted(async () => {
  isLoading.value = true;
  config.value = await getConfigById(route.params.id);
  configFile.value = JSON.parse(config.value.configFile);
  isLoading.value = false;
});
</script>
