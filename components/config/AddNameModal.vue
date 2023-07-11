<template>
  <div
    class="fixed inset-0 z-30 bg-[#0D0D0D]/[.9] flex justify-center items-center"
  >
    <div class="bg-white p-10 rounded-md flex flex-col gap-6">
      <h2 class="text-lg text-center font-bold">Provide new config name:</h2>
      <UiInputField
        v-model="cloneConfigName"
        type="text"
        :placeholder="'New config name...'"
      />
      <div class="flex gap-4 justify-between">
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

const { $toast } = useNuxtApp();

const cloneConfigName = ref("");

const onCanselHandler = () => {
  emit("isModalConfirmed", false);
};

const onConfirmHandler = () => {
  if (cloneConfigName.value.trim() === "") {
    $toast.warning(`You need to enter new config name`);
  } else {
    emit("isModalConfirmed", cloneConfigName.value);
  }
};
</script>
