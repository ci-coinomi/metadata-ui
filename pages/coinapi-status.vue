<template>
  <div>Page</div>
</template>
<script setup>
import { getBlockchains, getProviders, getHeight } from "~/api/coinapi";
import { Client } from "@stomp/stompjs";

const client = ref(null);
const app = useNuxtApp();


onMounted(async () => {
  const data = await getBlockchains();
  console.log(data);
  const data2 = await getProviders();
  console.log("Providers", data2);
  const data3 = await getHeight();
  console.log("Height", data3);

  client.value = new Client({
    brokerURL: app.$wss_api,
    reconnectDelay: 1000,
    heartbeatIncoming: 1000,
    heartbeatOutgoing: 1000,
    onConnect: function () {
      // The return object has a method called `unsubscribe`
      // const subscription = client.value.subscribe(
      //   "/topic/blockchain/height",
      //   function (message) {
      //     const payload = JSON.parse(message.body);
      //   },
      // );

      // client.value.subscribe("/coinapi/polygon/topic/blockchain/height", function (message) {
      //   console.log('CONNECT')
      //   const payload = JSON.parse(message.body);
      //   recentBlocks.value.unshift(payload);
      //   recentBlocks.value.pop(payload);
      // });

      client.value.subscribe("/topic/blockchain/height", function (message) {
        const payload = JSON.parse(message.body);
        recentTxs.value.unshift(payload);
        recentTxs.value.pop(payload);
      });
    },
  });
  client.value.activate();
});

onBeforeUnmount(() => {
  client?.value?.deactivate();
});
</script>
<style scoped></style>
