<template>
  <main
    class="flex flex-col justify-center items-center gap-6 m-auto bg-white p-4 shadow-md mt-3 rounded"
  >
    <section class="flex flex-col justify-center items-center gap-6 w-11/12">
      <UserSkeleton v-if="isLoading" />
      <template v-else-if="chainsList.length === 0">
        <h2 class="text-2xl">Data was not recieved</h2>
      </template>

      <template v-else>
        <article
          v-for="chain in chainsList"
          :key="chain.eucId"
          class="flex border border-black p-6 rounded-xl w-full items-center"
        >
          <h2 class="w-1/4">{{ chain.name }}</h2>
          <div class="w-1/2 flex flex-col">
            <div class="flex flex-wrap gap-1">
              <h3 class="text-gray-400">ConfigProviders:</h3>

              <div class="">
                <p
                  v-for="(provider, index) in chain.nodeProviders"
                  :key="provider"
                >
                  {{ provider }}
                  <span v-if="chain.nodeProviders.length < index">,</span>
                </p>
              </div>
            </div>
            <p>
              ApiProviders:
              <span v-for="provider in chain.apiProviders" :key="provider">
                {{ provider }},
              </span>
            </p>
          </div>
          <CoinApiBlockHeight :chainId="chain.eucId" />
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
const chainsList = ref([]);
const isLoading = ref(true);

const getCoinApiData = async () => {
  isLoading.value = true;
  const blockchainsResponse = await getBlockchains();
  const providersResponse = await getProviders();

  const chains = serializeCoinApi(
    blockchainsResponse?.blockchains,
    providersResponse?.settings,
  );
  isLoading.value = false;

  chainsList.value = chains;
  console.log(chainsList.value);
};

onMounted(async () => {
  store.setHeaderTitle(`CoinApi Status`);
  await getCoinApiData();
});
</script>
