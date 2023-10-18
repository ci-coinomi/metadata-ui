<template>
  <div
    class="fixed inset-0 z-30 flex items-center justify-center bg-[#0D0D0D]/[.9]"
  >
    <div
      ref="modalRef"
      class="box-border flex max-h-[75vh] flex-col items-center gap-2 overflow-x-auto rounded-md bg-white px-14 py-7"
    >
      <h2 class="text-center text-lg font-bold">Select group:</h2>
      <div v-if="groups.length === 0" class="text-red-600">
        Groups were not found
      </div>
      <template v-else>
        <ConfigConfiguredProvidersGroupModalItem
          v-for="group in groups"
          :key="group.providerGroupName"
          :groupItem="group"
          :blockchain="blockchain"
          :isSelected="
            selectedGroup?.providerGroupName === group.providerGroupName
          "
          @on-group-item-click="onGroupClickHandler"
        />
      </template>

      <div class="flex w-full justify-evenly gap-4">
        <UiButton class="danger w-1/3" @click="onCanselClickHandler"
          >Cancel</UiButton
        >
        <UiButton class="success w-1/3" @click="onConfirmHandler"
          >Confirm</UiButton
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "~/store";

const store = useStore();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps(["blockchain"]);
const emit = defineEmits(["isModalConfirmed"]);

const modalRef = ref();
const selectedGroup = ref(null);
const groups = computed(() => store.providersGroups);

const onCanselClickHandler = () => {
  emit("isModalConfirmed", false);
};

const onGroupClickHandler = (modalData) => {
  if (!modalData) return;
  selectedGroup.value = modalData;
};

const onConfirmHandler = () => {
  emit("isModalConfirmed", selectedGroup.value);
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
