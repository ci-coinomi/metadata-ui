<template>
  <main
    class="flex flex-col justify-center items-center gap-6 m-auto bg-white p-4 shadow-md mt-3 rounded"
  >
    <section class="flex flex-col justify-center items-center gap-6 w-11/12">
      <article>Article</article>
    </section>
  </main>
</template>
<script setup>
import { Client } from "@stomp/stompjs";
import { getBlockchains, getProviders } from "~/api/coinapi";
import { useStore } from "~/store";

definePageMeta({
  layout: "signedin",
});

const app = useNuxtApp();
const store = useStore();

const client = ref(null);

const getCoinApiData = async () => {
  const blockchainsResponse = await getBlockchains();
  const providersResponse = await getProviders();

  const chainsList = serializeCoinApi(
    blockchainsResponse?.blockchains,
    providersResponse?.settings,
  );

  console.log(chainsList);
};

const activateWSConnection = () => {
  client.value = new Client({
    brokerURL: app.$wss_api,
    reconnectDelay: 1000,
    heartbeatIncoming: 1000,
    heartbeatOutgoing: 1000,
    onConnect: function () {
      client.value.subscribe("/topic/blockchain/height", function (message) {
        const payload = JSON.parse(message.body);
        console.log(payload);
      });
    },
  });
  client.value.activate();
};

onMounted(async () => {
  store.setHeaderTitle(`CoinApi Status`);
  await getCoinApiData();
  activateWSConnection();
});

onBeforeUnmount(() => {
  client?.value?.deactivate();
});
</script>
