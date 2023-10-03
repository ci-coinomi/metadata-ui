<template>
  <p>Height: {{ heightValue }}</p>
</template>
<script setup>
import { Client } from "@stomp/stompjs";

const app = useNuxtApp();

const props = defineProps(["chainId"]);
const client = ref(null);

const heightValue = ref("Not recieved");

onMounted(() => {
  const wssUrlString = app.$wss_api + "/" + props.chainId;
  client.value = new Client({
    brokerURL: wssUrlString,
    reconnectDelay: 1000,
    heartbeatIncoming: 1000,
    heartbeatOutgoing: 1000,
    onConnect: function () {
      client.value.subscribe("/topic/blockchain/height", function (message) {
        const payload = JSON.parse(message.body);
        console.log(payload);
        heightValue.value = payload.currentHeight;
      });
    },
  });
  // client.value.activate();
});

onBeforeUnmount(() => {
  client.value?.deactivate();
});
</script>
