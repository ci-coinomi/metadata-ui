<template>
  <div
    class="popup fixed inset-0 z-30 bg-[#0D0D0D]/[.9] flex justify-center items-center"
  >
    <div class="bg-white p-10 rounded-md flex flex-col gap-6">
      <h2 class="text-lg text-center font-bold">{{ modalText }}</h2>
      <UiInputField
        v-if="props.modalType === 'SETCLONENAME'"
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
const props = defineProps({
  // UPDATE, SETCLONENAME, DELETE, CREATECLONE
  modalType: String,
});

const emit = defineEmits(["isModalConfirmed"]);

const { $toast } = useNuxtApp();

const modalText = ref("Are you sure?");
const cloneConfigName = ref("");

const onCanselHandler = () => {
  emit("isModalConfirmed", false);
};

const onConfirmHandler = () => {
  if (
    props.modalType === "SETCLONENAME" &&
    cloneConfigName.value.trim() === ""
  ) {
    $toast.warning(`You need to enter new config name`);
  } else {
    emit("isModalConfirmed", true, cloneConfigName.value);
  }
};

onMounted(() => {
  document.body.style.overflow = "hidden";

  switch (props.modalType) {
    case "UPDATE":
      modalText.value = "Are you sure you want to update config?";
      break;
    case "SETCLONENAME":
      modalText.value = "Provide new config name:";
      break;
    case "CREATECLONE":
      modalText.value = "Are you sure you want to save this clone?";
      break;
    case "DELETE":
      modalText.value = "Are you sure you want to delete config?";
      break;
  }
});

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>
