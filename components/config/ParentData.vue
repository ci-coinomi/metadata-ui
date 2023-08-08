<template>
  <article class="w-full mb-4 p-4 border border-gray-300 rounded-md">
    <h3 class="text-center text-lg">Parent config data:</h3>
    <div class="flex justify-between items-center">
      <div>
        <p>
          <span class="text-gray-400">ConfigId:</span>
          {{ props.parentData.configId }}
        </p>
        <p>
          <span class="text-gray-400">configName:</span>
          {{ props.parentData.configName }}
        </p>
        <p>
          <span class="text-gray-400">configType:</span>
          {{ props.parentData.configType }}
        </p>
      </div>
      <uiButton class="primary" @click="toParentNavigateHandler">
        To parent
      </uiButton>
    </div>
  </article>
</template>
<script setup>
import { useStore } from "~/store";

const store = useStore();
const route = useRoute();
const router = useRouter();

const props = defineProps(["parentData"]);

const toParentNavigateHandler = () => {
  store.setToParentNavigateData(props.parentData);
  if (route.path.name !== "configs") {
    router.push("/configs");
  }
};
</script>
