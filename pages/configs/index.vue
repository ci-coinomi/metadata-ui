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
          @click="onConfigItemClickHandler(config.configId)"
        />
      </div>
    </div>
  </main>
</template>
<script setup>
import { getConfigs, getConfigsTypes } from "~/api/configs";
import { useStore } from "~/store";

definePageMeta({
  layout: "signedin",
});

const { $toast } = useNuxtApp();
const store = useStore();
const router = useRouter();

const configs = ref([]);
const filtredConfigs = ref([]);
const selectedType = ref("ALL");
const isLoading = ref(true);

const configTypes = computed(() => store.configTypes);

const onConfigItemClickHandler = (configId) => {
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
    $toast.error(`Fetching config types error, status: ${response}`);
  }
};

const fetchConfigs = async () => {
  const response = await getConfigs();
  if (Array.isArray(response)) {
    configs.value = response.sort((a, b) => b.configId - a.configId);
    filtredConfigs.value = configs.value;
  } else {
    $toast.error(`Fetching configs error, status: ${response}`);
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
