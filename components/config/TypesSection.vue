<template>
  <section
    class="flex w-full flex-col items-center gap-4 rounded-md p-4 shadow-md"
  >
    <div class="w-full">
      <div v-if="configTypes.length === 0">
        <h2 class="text-center text-xl">Config types were not recieved</h2>
      </div>
      <div v-else class="grid w-full grid-cols-4 grid-rows-2 gap-4">
        <UiButton
          v-for="typeItem in configTypes"
          :key="typeItem"
          :value="typeItem"
          class="small"
          :class="typeItem === selectedType ? 'primary' : ''"
          @click="onTypesSelectHandler(typeItem)"
        >
          {{ typeItem }}
        </UiButton>
      </div>
    </div>

    <div
      v-if="!isBlockchainBlockHidden"
      class="flex w-full flex-wrap justify-center gap-4"
    >
      <UiButton
        v-for="chain in blockchains"
        :key="chain"
        :class="chain === selectedChain ? 'primary' : ''"
        class="my-auto"
        @click="onChainClickHandler(chain)"
      >
        {{ chain }}
      </UiButton>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { getConfigTypes } from "@/api/configs";
import { useConfigStore } from "@/stores/configs";
import { useAppStore } from "@/stores/app";

const configStore = useConfigStore();
const appStore = useAppStore();
const { $toast } = useNuxtApp();
const router = useRouter();
const route = useRoute();

const { configTypes, selectedType, selectedChain, blockchains } =
  storeToRefs(configStore);

const isBlockchainBlockHidden = computed(
  () => blockchains.value && blockchains.value.length === 0,
);

/* HANDLERS */

const onChainClickHandler = (chain) => {
  configStore.setSelectedChain(chain);
  configStore.setVisibleItemsCount(30);

  selectedChain.value === "all"
    ? appStore.setHeaderTitle(`${selectedType.value}`)
    : appStore.setHeaderTitle(
        `${selectedType.value}, chain ${selectedChain.value}`,
      );
  updateQueryParams();
};

const onTypesSelectHandler = (type) => {
  configStore.setDefaultFilters();
  configStore.setSelectedType(type);
  appStore.setHeaderTitle(type);
  updateQueryParams();
};

/* REQUESTS */
const fetchConfigTypes = async () => {
  if (configTypes.value.length === 0) {
    const response = await getConfigTypes();
    if (response.success) {
      configStore.setConfigTypes(response.data);
    } else {
      $toast.error(`Fetching config types error, status: ${response.status}`);
    }
  }
};

onMounted(async () => {
  await fetchConfigTypes();
});

/* OTHER */

/**
 * Push selectedChain and selectedType to query.
 */
const updateQueryParams = () => {
  const query = {
    type: selectedType.value,
  };

  if (blockchains.value?.length > 0 && !selectedChain.value)
    query.chain = "all";
  if (selectedChain.value) query.chain = selectedChain.value;

  router.push({
    name: route.name,
    query,
  });
};
</script>
