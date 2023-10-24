<template>
  <ModalChildrenConfigs
    v-if="isChildrenConfigVisible"
    :childConfigs="children"
    @close-modal="toggleChildrenModal(false)"
  />

  <section
    class="mb-4 w-full rounded-md border p-4"
    :class="isParentUpdated ? 'border-[#d38b32]' : 'border-gray-300'"
  >
    <div class="flex items-center justify-between gap-2">
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
      <div v-else class="w-full text-center text-gray-400">
        Config has no parent
      </div>
      <div class="flex flex-col gap-2">
        <uiButton
          v-if="props.parentData"
          class="primary w-full whitespace-nowrap text-center"
          @click="toParentNavigateHandler"
        >
          To parent
        </uiButton>
        <uiButton
          v-if="children.length > 0 && route.name !== 'configs-create'"
          class="info w-full whitespace-nowrap"
          @click="toggleChildrenModal(true)"
        >
          Show children ({{ children.length }})
        </uiButton>
      </div>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useConfigStore } from "@/stores/configs";

const configStore = useConfigStore();
const route = useRoute();

const props = defineProps([
  "parentData",
  "currentConfigData",
  "parentUpdateTrigger",
]);

const { storedConfigList } = storeToRefs(configStore);
const children = ref([]);
const isChildrenConfigVisible = ref(false);
const defaultParentId = ref(props.parentData?.configId);
const isParentUpdated = computed(
  () => defaultParentId.value !== props.parentData?.configId,
);

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
    storedConfigList.value,
    props.currentConfigData.configId,
  );
  children.value = childConfigsArray;
});

watch(
  () => props.parentUpdateTrigger,
  () => {
    defaultParentId.value = props.parentData?.configId;
  },
);
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
