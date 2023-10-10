<template>
  <div
    class="fixed inset-0 z-30 bg-[#0D0D0D]/[.9] flex justify-center items-center"
  >
    <div
      ref="modalRef"
      class="bg-white px-10 py-5 rounded-md flex flex-col gap-2 items-center max-h-[75vh] overflow-x-auto"
    >
      <h2 class="text-lg text-center font-bold">Select network:</h2>
      <div
        v-for="network in networks"
        :key="network.id"
        class="flex gap-2 border border-gray-400 p-2 rounded-lg cursor-pointer w-full justify-between"
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

      <UiButton class="danger w-2/5" @click="onCanselClickHandler">
        Cancel
      </UiButton>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "~/store";

const store = useStore();

const emit = defineEmits(["isModalConfirmed"]);

const modalRef = ref();
const networks = computed(() => store.providersNetworks);

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
