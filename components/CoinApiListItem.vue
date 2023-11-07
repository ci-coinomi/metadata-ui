<template>
  <article class="w-full items-start rounded-lg border border-black p-6">
    <div class="flex w-full items-center gap-3">
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

      <div class="flex flex-1 flex-col">
        <div
          v-if="
            chainsHeight && chainsHeight.length > 0 && chainsHeight.length <= 3
          "
          class="w-full"
        >
          <div
            v-for="chainItem in chainsHeight"
            :key="chainItem.chainId"
            class="flex w-full gap-1"
          >
            <p class="flex w-2/5 gap-1">
              <span class="text-gray-400">ChainId:</span
              >{{ chainItem.chainId }},
            </p>
            <p class="flex w-3/5 gap-1">
              <span class="text-gray-400">Height:</span>{{ chainItem.height }}
            </p>
          </div>
        </div>

        <div
          v-if="
            chainsHeight && chainsHeight.length > 0 && chainsHeight.length > 3
          "
          class="flex w-full justify-center"
        >
          <UiButton @click="onShowMoreChainsClick">
            <span v-if="!showChains">Show chains</span>
            <span v-else>Hide chains</span>
          </UiButton>
        </div>
        <div
          v-if="!chainsHeight && zoneData"
          class="flex w-full justify-center gap-1"
        >
          <span class="text-gray-400">ZoneId:</span> {{ zoneData }}
        </div>
        <div
          v-if="(!chainsHeight || chainsHeight.length === 0) && !zoneData"
          class="text-center text-gray-400"
        >
          ZoneId or Chain IDs were not recieved
        </div>
      </div>
    </div>

    <div class="flex gap-3">
      <div class="w-1/5" />
      <div class="flex flex-1" />
      <div class="w-1/5" />
      <div class="flex flex-1">
        <Transition name="scale">
          <div v-if="showChains" class="w-full">
            <div
              v-for="chainItem in chainsHeight"
              :key="chainItem.chainId"
              class="flex w-full gap-1"
            >
              <p class="flex w-2/5 gap-1">
                <span class="text-gray-400">ChainId:</span
                >{{ chainItem.chainId }},
              </p>
              <p class="flex w-3/5 gap-1">
                <span class="text-gray-400">Height:</span>{{ chainItem.height }}
              </p>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </article>
</template>

<script setup>
import { Client } from "@stomp/stompjs";

const app = useNuxtApp();

const props = defineProps({
  chain: Object,
});

const client = ref(null);
const heightValue = ref(null);
const chainsHeight = ref(null);
const zoneData = ref(null);
const showChains = ref(false);

const onShowMoreChainsClick = () => {
  showChains.value = !showChains.value;
};

const onWsUpdateHandler = (message) => {
  const payload = JSON.parse(message.body);
  if (!payload) return;

  const { chainHeights, currentHeight, zoneId } = payload;

  if (currentHeight) heightValue.value = currentHeight;
  if (chainHeights) {
    chainsHeight.value = chainHeights.sort(
      (a, b) => Number(a.chainId) - Number(b.chainId),
    );
  }
  if (zoneId) zoneData.value = zoneId;
};

onMounted(() => {
  const wssUrlString = app.$wss_api + "/" + props.chain.eucId;
  client.value = new Client({
    brokerURL: wssUrlString,
    reconnectDelay: 1000,
    heartbeatIncoming: 1000,
    heartbeatOutgoing: 1000,
    onConnect: () => {
      client.value.subscribe("/topic/blockchain/height", onWsUpdateHandler);
    },
  });
  client.value.activate();
});

onBeforeUnmount(() => {
  client.value?.deactivate();
});
</script>

<style>
.scale-enter-active,
.scale-leave-active {
  transform-origin: top;
  transition: transform 0.3s ease-in-out;
}

.scale-enter-to,
.scale-leave-from {
  transform: scaleY(1);
}

.scale-enter-from,
.scale-leave-to {
  transform: scaleY(0);
}
</style>
