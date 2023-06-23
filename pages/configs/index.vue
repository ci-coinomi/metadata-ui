<template>
  <main class="flex flex-col justify-center items-center gap-6">
    <h1 class="text-2xl font-bold">Configs</h1>
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
    <div class="flex flex-col gap-4">
      <div class="flex gap-4">
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
  </main>
</template>
<script setup>
import { getConfigs } from "~/api/configs";
import { useStore } from "~/store";

definePageMeta({
  layout: "signedin",
});

const store = useStore();
const router = useRouter();

const configs = ref([]);
const filtredConfigs = ref([]);
const selectedType = ref("ALL");

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

onMounted(async () => {
  await store.getConfigTypes();
  configs.value = await getConfigs();
  filtredConfigs.value = configs.value;
});
</script>
