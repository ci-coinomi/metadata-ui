<template>
  <main
    class="m-auto mt-3 flex flex-col items-center justify-center gap-6 rounded bg-white p-4 shadow-md"
  >
    <DesignCoinApiSkeleton v-if="isLoading" />

    <h2 v-else-if="chainsList.length === 0" class="text-2xl">
      Data was not recieved
    </h2>

    <template v-else>
      <CoinApiListItem
        v-for="chain in chainsList"
        :key="chain.eucId"
        :chain="chain"
      />
    </template>
  </main>
</template>

<script setup>
import { getBlockchains, getProviders } from "~/api/coinapi";
import { useAppStore } from "@/stores/app";

definePageMeta({
  layout: "signedin",
});

const appStore = useAppStore();
const { $toast } = useNuxtApp();

const chainsList = ref([]);
const isLoading = ref(true);

const getCoinApiData = async () => {
  isLoading.value = true;

  const blockchainsResponse = await getBlockchains();
  if (!blockchainsResponse.success) {
    $toast.error(
      `Fetching blockchains error, status: ${blockchainsResponse.status}`,
    );
  }

  const providersResponse = await getProviders();
  if (!providersResponse.success) {
    $toast.error(
      `Fetching providers error, status: ${providersResponse.status}`,
    );
  }

  const chains = serializeCoinApi(
    blockchainsResponse.data.blockchains,
    providersResponse.data.settings,
  );

  isLoading.value = false;
  chainsList.value = chains;
};

onMounted(() => {
  appStore.setHeaderTitle("CoinApi Status");
  getCoinApiData();
});
</script>
