<template>
  <div
    class="popup fixed inset-0 z-30 flex items-center justify-center bg-[#0D0D0D]/[.9]"
  >
    <div class="flex flex-col gap-6 rounded-md bg-white p-10">
      <h2 class="text-center text-lg font-bold"><slot /></h2>
      <div class="flex justify-between gap-4">
        <UiButton class="danger w-2/5" @click="onCanselHandler"
          >Cancel</UiButton
        >
        <UiButton class="success w-2/5" @click="onConfirmHandler"
          >Confirm</UiButton
        >
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["isModalConfirmed"]);

const onCanselHandler = () => {
  emit("isModalConfirmed", false);
};

const onConfirmHandler = () => {
  emit("isModalConfirmed", true);
};

onMounted(() => {
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>
