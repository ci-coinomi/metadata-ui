<template>
  <ModalChildrenConfigs
    v-if="isChildrenConfigVisible"
    :childConfigs="children"
    @close-modal="toggleChildrenModal(false)"
  />

  <section class="w-full mb-4 p-4 border border-gray-300 rounded-md">
    <div class="flex justify-between items-center gap-2">
      <div v-if="parentData">
        <p>
          <span class="text-gray-400">Parent id: </span>
          {{ props.parentData.configId }}
        </p>
        <div class="hideExtraText">
          <span class="text-gray-400">Parent name: </span>
          {{ props.parentData.configName }}
        </div>
        <p>
          <span class="text-gray-400">Parent type: </span>
          {{ props.parentData.configType }}
        </p>
      </div>
      <div v-else class="text-gray-400">Config has no parent</div>
      <div class="flex flex-col gap-2">
        <uiButton
          v-if="props.parentData"
          class="primary w-full text-center"
          @click="toParentNavigateHandler"
        >
          To parent
        </uiButton>
        <uiButton
          v-if="children.length > 0 && route.name !== 'configs-create'"
          class="primary w-full"
          @click="toggleChildrenModal(true)"
        >
          Show children ({{ children.length }})
        </uiButton>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useStore } from "~/store";

const store = useStore();
const route = useRoute();

const props = defineProps(["parentData", "currentConfigData"]);

const children = ref([]);
const isChildrenConfigVisible = ref(false);

const toParentNavigateHandler = () => {
  if (process.client) {
    window.open(`/configs/${props.parentData.configId}`, "_blank");
  }
};

const toggleChildrenModal = (value) => {
  isChildrenConfigVisible.value = value;
};

const getChildConfigs = (configs, id) => {
  return configs.filter(
    (configItem) => configItem.parentConfig?.configId === id,
  );
};

onMounted(() => {
  const childConfigsArray = getChildConfigs(
    store.configsList,
    props.currentConfigData.configId,
  );
  children.value = childConfigsArray;
});
</script>

<style scoped>
.hideExtraText {
  white-space: nowrap;
  max-width: 500px;
  text-overflow: ellipsis;
  overflow: clip;
}

.hideExtraText:hover {
  white-space: normal;
}
</style>
