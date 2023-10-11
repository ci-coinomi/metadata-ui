<template>
  <div
    class="fixed inset-0 z-30 flex items-center justify-center bg-[#0D0D0D]/[.9]"
  >
    <div
      ref="modalRef"
      class="relative flex max-h-[75vh] flex-col items-center gap-2 overflow-x-auto rounded-md bg-white px-14 py-7"
    >
      <h2 class="text-center text-lg font-bold">Select network:</h2>
      <div v-if="networks.length === 0" class="text-red-600">
        Networks with name <b class="text-gray-900">{{ blockchain }}</b> were
        not found
      </div>
      <template v-else>
        <div
          v-for="network in networks"
          :key="network.id"
          class="flex w-full cursor-pointer justify-between gap-2 rounded-lg border border-gray-400 p-2"
          @click="onNetworkClickHandler(network)"
        >
          <p>
            <span class="text-gray-400">Provider name:</span>
            {{ network.providerName }}
          </p>
          <p>
            <span class="text-gray-400">Network:</span>
            {{ network.network }}
          </p>
        </div>
      </template>

      <UiButton
        class="danger smallPaddings absolute right-2 top-2"
        @click="onCanselClickHandler"
      >
        X
      </UiButton>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "~/store";

const store = useStore();

const props = defineProps(["blockchain"]);
const emit = defineEmits(["isModalConfirmed"]);

const modalRef = ref();
const networks = computed(() =>
  store.providersNetworks.filter((item) => item.network === props.blockchain),
);

const onCanselClickHandler = () => {
  emit("isModalConfirmed", false);
};

const onNetworkClickHandler = (network) => {
  emit("isModalConfirmed", network);
};

const handleClickOutside = (event) => {
  if (modalRef.value && !modalRef.value.contains(event.target)) {
    emit("isModalConfirmed", false);
  }
};

onMounted(() => {
  document.body.style.overflow = "hidden";
  document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  document.body.style.overflow = "";
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>
