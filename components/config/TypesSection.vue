<template>
  <section class="flex flex-col items-center gap-4 rounded-md p-4 shadow-md">
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
      class="flex w-full justify-center gap-4"
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

const {
  configTypes,
  selectedType,
  selectedChain,
  blockchains,
  filtredConfigs,
} = storeToRefs(configStore);

const isBlockchainBlockHidden = computed(
  () => blockchains.value && blockchains.value.length === 0,
);

/* HANDLERS */

const onChainClickHandler = (chain) => {
  configStore.setSelectedChain(chain);
  configStore.setVisibleItemsCount(30);

  selectedChain.value === "All"
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

  getChainsFromFiltredConfigs(filtredConfigs.value);
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

/*
Push selectedChain and selectedType to query.
*/

// TODO
const updateQueryParams = async () => {
  // А может получится просто написать один вотчер?
  const query = {
    type: selectedType.value,
  };

  if (selectedChain.value) query.chain = selectedChain.value;

  await nextTick();

  router.push({
    name: route.name,
    query,
  });
};

/*
Getting every unique chain name from config.configFile.eucId's in configs array.
If we have no chain names in eucId after '@' - hide chainsBlock
If we have only one chain type in filtredConfigs - show chainsBlock and select this chain
If there are more than 1 chain in filtredConfigs - add 'All' (selected by default) and show chains in chainsBlock

For BANNER - search for parentConfig name (blockchains) or 'koala' if !parentConfig
*/

// TODO
const getChainsFromFiltredConfigs = (configs) => {
  const chainsSet = new Set();
  if (
    selectedType.value === "BANNER" ||
    selectedType.value === "DAPP" ||
    selectedType.value === "NFT_COLLECTION"
  ) {
    configs.forEach((item) => {
      const chainItem = item.parentConfig?.configName || "koala";
      if (chainItem) chainsSet.add(chainItem);
    });
  } else if (selectedType.value === "ASSET") {
    configs.forEach((item) => {
      const chainItem = getChainNameFromConfigItem(item, "eucId");
      if (chainItem) chainsSet.add(chainItem);
    });
  } else if (selectedType.value === "PARTNER") {
    configs.forEach((item) => {
      const chainItem = getChainNameFromConfigItem(item, "name");
      if (chainItem) chainsSet.add(chainItem);
    });
  }
  const chainsArray = Array.from(chainsSet);

  if (chainsArray.length === 0) {
    configStore.setSelectedChain(null);
    configStore.setBlockchains([]);
  } else if (chainsArray.length === 1) {
    configStore.setSelectedChain(chainsArray[0]);
    configStore.setBlockchains(chainsArray);
  } else {
    configStore.setSelectedChain("All");
    configStore.setBlockchains(["All", ...chainsArray]);
  }
};
</script>
