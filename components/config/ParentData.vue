<template>
  <ModalChildrenConfigs
    v-if="isChildrenConfigVisible"
    :childConfigs="children"
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
          v-if="children.length > 0"
          class="primary w-full"
          @click="toggleChildrenModal"
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
const router = useRouter();

const props = defineProps(["parentData", "currentConfigData"]);

const children = ref([]);
const isChildrenConfigVisible = ref(false);

const toParentNavigateHandler = () => {
  store.setToParentNavigateData(props.parentData);
  if (route.path.name !== "configs") {
    router.push("/configs");
  }
};

const toggleChildrenModal = () => {
  console.log(children.value);
  isChildrenConfigVisible.value = true;
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
