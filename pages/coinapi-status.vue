<template>
  <main
    class="flex flex-col justify-center items-center gap-6 m-auto bg-white p-4 shadow-md mt-3 rounded"
  >
    <section class="flex flex-col justify-center items-center gap-6 w-full">
      <CoinApiSkeleton v-if="isLoading" />
      <template v-else-if="chainsList.length === 0">
        <h2 class="text-2xl">Data was not recieved</h2>
      </template>

      <template v-else>
        <CoinApiListItem
          v-for="chain in chainsList"
          :key="chain.eucId"
          :chain="chain"
        />
      </template>
    </section>
  </main>
</template>
<script setup>
import { getBlockchains, getProviders } from "~/api/coinapi";
import { useStore } from "~/store";

definePageMeta({
  layout: "signedin",
});

const store = useStore();
const { $toast } = useNuxtApp();

const chainsList = ref([]);
const isLoading = ref(true);

const getCoinApiData = async () => {
  isLoading.value = true;
  const blockchainsResponse = await getBlockchains();
  if (!Array.isArray(blockchainsResponse?.blockchains)) {
    $toast.error(`Fetching blockchains error, status: ${blockchainsResponse}`);
  }

  const providersResponse = await getProviders();
  if (!Array.isArray(providersResponse?.settings)) {
    $toast.error(`Fetching providers error, status: ${providersResponse}`);
  }

  const chains = serializeCoinApi(
    blockchainsResponse?.blockchains,
    providersResponse?.settings,
  );
  isLoading.value = false;

  chainsList.value = chains;
};

onMounted(async () => {
  store.setHeaderTitle(`CoinApi Status`);
  await getCoinApiData();
});
</script>
