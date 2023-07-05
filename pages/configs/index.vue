<template>
  <main
    class="flex flex-col justify-center items-center gap-6 w-3/4 m-auto bg-white p-4 shadow-md mt-3 rounded"
  >
    <configIndexSkeleton v-if="isLoading" class="w-[75vw]" />
    <div v-else class="flex flex-col justify-center items-center gap-6 w-full">
      <div class="flex gap-4 items-center">
        <h4>Current type:</h4>
        <select
          v-model="selectedType"
          class="p-1 rounded-md"
          @change="onTypesSelectHandler($event)"
        >
          <option disabled>Choose the type</option>
          <option :value="'ALL'">ALL</option>
          <option
            v-for="typeItem in configTypes"
            :key="typeItem"
            :value="typeItem"
          >
            {{ typeItem }}
          </option>
        </select>
      </div>
      <div class="flex flex-col gap-4 w-4/5">
        <div class="flex gap-4 w-full justify-center">
          <p>
            <span class="text-gray-500">Total count: </span>{{ configs.length }}
          </p>
          <p>
            <span class="text-gray-500">Selected type count: </span
            >{{ filtredConfigs.length }}
          </p>
        </div>

        <configListItem
          v-for="config in filtredConfigs"
          :key="config.configId"
          :config="config"
          class="cursor-pointer hover:ring-gray-500 hover:ring-2 active:ring-gray-600"
          @click="onConfigItemClickHandler(config)"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import { getConfigs, getConfigsTypes } from "~/api/configs";
import { useStore } from "~/store";

definePageMeta({
  layout: "signedin",
});

const store = useStore();
const router = useRouter();
const toast = useToast();

const configs = ref([]);
const filtredConfigs = ref([]);
const selectedType = ref("ALL");
const isLoading = ref(true);

const configTypes = computed(() => store.configTypes);

const onConfigItemClickHandler = ({ configId, configType }) => {
  if (configType === "BANNER") {
    router.push({
      path: `/configs/${configId}/banner`,
    });
    return;
  }

  if (configType === "NFT_COLLECTION") {
    router.push({
      path: `/configs/${configId}/nft-collection`,
    });
    return;
  }

  router.push({
    path: `/configs/${configId}`,
  });
};

const onTypesSelectHandler = (evt) => {
  selectedType.value = evt.target.value;

  if (selectedType.value === "ALL") {
    filtredConfigs.value = configs.value;
    return;
  }

  filtredConfigs.value = configs.value.filter(
    (item) => item.configType === evt.target.value
  );
};

const fetchConfigTypes = async () => {
  const response = await getConfigsTypes();
  if (Array.isArray(response)) {
    store.setConfigTypes(response);
  } else {
    toast.open({
      message: `Fetching config types error, status: ${response}`,
      type: "error",
    });
  }
};

const fetchConfigs = async () => {
  const response = await getConfigs();
  if (Array.isArray(response)) {
    configs.value = response.sort((a, b) => b.configId - a.configId);
    filtredConfigs.value = configs.value;
  } else {
    toast.open({
      message: `Fetching configs error, status: ${response}`,
      type: "error",
    });
  }
};

onMounted(() => {
  isLoading.value = true;
  fetchConfigTypes();
  fetchConfigs();
  store.setHeaderTitle(`Configs`);
  isLoading.value = false;
});
</script>
