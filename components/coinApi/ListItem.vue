<template>
  <article
    class="flex border border-black p-6 rounded-xl w-full items-center gap-3"
  >
    <h2 class="w-1/5">{{ chain.name }}</h2>

    <div class="flex flex-1 flex-col">
      <div class="flex flex-wrap gap-1">
        <h3 class="text-gray-400">Node Providers:</h3>
        <p v-if="chain.nodeProviders.length === 0" class="text-gray-400">
          Does not exist
        </p>
        <template v-else>
          <p v-for="(provider, index) in chain.nodeProviders" :key="provider">
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
          <p v-for="(provider, index) in chain.apiProviders" :key="provider">
            {{ provider
            }}<span v-if="index + 1 < chain.apiProviders.length">,</span
            ><span v-else>.</span>
          </p>
        </template>
      </div>
    </div>

    <div class="flex w-1/5 gap-1">
      <span class="text-gray-400">Height:</span>
      <span v-if="heightValue"> {{ heightValue }}</span>
      <span v-else>Not recieved</span>
    </div>

    <div class="flex flex-1">
      <div v-if="chainsHeight && chainsHeight.length > 0">
        <div
          v-for="chainItem in chainsHeight"
          :key="chainItem.chainId"
          class="flex gap-1"
        >
          <span class="text-gray-400">ChainId:</span>{{ chainItem.chainId }},
          <span class="text-gray-400">Height:</span>{{ chainItem.height }}
        </div>
      </div>
      <div v-else class="text-gray-400">Chain IDs were not recieved</div>
    </div>
  </article>
</template>

<script setup>
import { Client } from "@stomp/stompjs";

const app = useNuxtApp();

const props = defineProps(["chain"]);

const client = ref(null);
const heightValue = ref(null);
const chainsHeight = ref(null);

onMounted(() => {
  const wssUrlString = app.$wss_api + "/" + props.chain.eucId;
  client.value = new Client({
    brokerURL: wssUrlString,
    reconnectDelay: 1000,
    heartbeatIncoming: 1000,
    heartbeatOutgoing: 1000,
    onConnect: function () {
      client.value.subscribe("/topic/blockchain/height", function (message) {
        const payload = JSON.parse(message.body);
        if (payload?.currentHeight) heightValue.value = payload.currentHeight;
        if (payload?.chainHeights)
          chainsHeight.value = payload.chainHeights.sort(
            (a, b) => Number(a.chainId) - Number(b.chainId),
          );
      });
    },
  });
  client.value.activate();
});

onBeforeUnmount(() => {
  client.value?.deactivate();
});
</script>
