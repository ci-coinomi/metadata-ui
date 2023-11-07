<template>
  <div class="flex w-full items-center justify-between gap-4">
    <div class="mr-aut flex gap-4 py-2">
      <p class="w-[135px]">
        <span class="text-gray-500">Total count: </span>
        {{ storedConfigList.length }}
      </p>
      <p class="w-[155px]">
        <span class="text-gray-500">Filtered count: </span>
        {{ filtredConfigs?.length }}
      </p>
    </div>
    <UiInputField
      v-model="search"
      :placeholder="'Search by config name...'"
      :type="'text'"
    />
    <UiButton
      v-if="isCreateEmptyConfigVisible"
      class="success whitespace-nowrap"
      @click="onCreateEmptyCloneHandler"
    >
      Create config
    </UiButton>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useConfigStore } from "@/stores/configs";

const configStore = useConfigStore();
const router = useRouter();
const route = useRoute();

const { storedConfigList, selectedType, storedSearch, filtredConfigs } =
  storeToRefs(configStore);
const search = ref(null);

/**
 * Create empty clone always available for CONFIGURED_PROVIDERS.
 * Available for config types with configs without parent.
 */
const isCreateEmptyConfigVisible = computed(() => {
  if (selectedType.value === "CONFIGURED_PROVIDERS") return true;
  if (filtredConfigs.value.length === 0) return false;
  if (filtredConfigs.value.some((el) => el.parentConfig)) return false;
  return true;
});

/**
 * Create clone handler.
 */
const onCreateEmptyCloneHandler = () => {
  router.push({
    path: "/configs/create",
    query: {
      type: selectedType.value,
    },
  });
};

/**
 * For filling inputField on first load with data from query.
 */
watch(storedSearch, () => {
  if (storedSearch.value) {
    search.value = storedSearch.value;
  }
});

/**
 * Setting search value to store (using action) and pushing them to query.
 * Removing 'search' from query if there is no searchValue.
 */
watch(search, () => {
  if (search.value) {
    configStore.setStoredSearch(search.value);
    router.push({
      name: route.name,
      query: {
        ...route.query,
        search: search.value,
      },
    });
  } else {
    const updQuery = {
      ...route.query,
    };
    delete updQuery.search;
    router.push({
      name: route.name,
      query: updQuery,
    });
  }
});
</script>
