<template>
  <div class="w-full">
    Height:
    <span v-if="heightValue"> {{ heightValue }}</span>
    <span v-else class="text-gray-400">Not recieved</span>
  </div>
</template>
<script setup>
import { Client } from "@stomp/stompjs";

const app = useNuxtApp();

const props = defineProps(["chainId"]);
const client = ref(null);

const heightValue = ref(null);

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
        if (payload?.currentHeight) heightValue.value = payload.currentHeight;
      });
    },
  });
  client.value.activate();
});

onBeforeUnmount(() => {
  client.value?.deactivate();
});
</script>
