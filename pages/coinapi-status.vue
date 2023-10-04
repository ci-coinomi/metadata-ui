<template>
  <main
    class="flex flex-col justify-center items-center gap-6 m-auto bg-white p-4 shadow-md mt-3 rounded"
  >
    <section class="flex flex-col justify-center items-center gap-6 w-11/12">
      <CoinApiSkeleton v-if="isLoading" />
      <template v-else-if="chainsList.length === 0">
        <h2 class="text-2xl">Data was not recieved</h2>
      </template>

      <template v-else>
        <article
          v-for="chain in chainsList"
          :key="chain.eucId"
          class="flex border border-black p-6 rounded-xl w-full items-center gap-3"
        >
          <h2 class="w-1/5">{{ chain.name }}</h2>
          <div class="flex flex-1 flex-col">
            <div class="flex flex-wrap gap-1">
              <h3 class="text-gray-400">Node Providers:</h3>
              <p v-if="chain.apiProviders.length === 0" class="text-gray-400">
                Does not exist
              </p>
              <template v-else>
                <p
                  v-for="(provider, index) in chain.nodeProviders"
                  :key="provider"
                >
                  {{ provider
                  }}<span v-if="index + 1 < chain.nodeProviders.length">,</span
                  ><span v-else>.</span>
                </p>
              </template>
            </div>
            <div class="flex flex-wrap gap-1">
              <h3 class="text-gray-400">Api Providers:</h3>
              <p v-if="chain.apiProviders.length === 0" class="text-gray-400">
                Does not exist
              </p>
              <template v-else>
                <p
                  v-for="(provider, index) in chain.apiProviders"
                  :key="provider"
                >
                  {{ provider
                  }}<span v-if="index + 1 < chain.apiProviders.length">,</span
                  ><span v-else>.</span>
                </p>
              </template>
            </div>
          </div>
          <div class="w-1/5">
            <CoinApiBlockHeight :chainId="chain.eucId" />
          </div>
        </article>
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
