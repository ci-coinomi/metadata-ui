<template>
  <div
    class="popup fixed inset-0 z-30 bg-[#0D0D0D]/[.9] flex justify-center items-center p-32"
  >
    <div
      class="bg-white p-10 rounded-md flex flex-col items-center gap-6 min-h-[40vh] max-w-[900px]"
    >
      <h2 class="text-lg text-center font-bold">Upload image</h2>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="flex justify-center items-center"
        @change="fileChangeHandler"
      />

      <div v-if="imageOldName" class="flex flex-col gap-2">
        <p class="text-gray-500">Image old name...</p>
        <p>{{ imageOldName }}</p>
        <UiInputField
          v-model="imageUpdatedName"
          type="text"
          :placeholder="'Image updated name...'"
        />
      </div>

      <div class="flex gap-4 justify-between mt-auto">
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
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const emit = defineEmits(["modal-handler"]);

const toast = useToast();

const fileInput = ref(null);

const imageUpdatedName = ref(null);
const imageOldName = ref("");
const imageData = ref("");

const fileChangeHandler = () => {
  const file = fileInput.value.files[0];
  if (file) {
    imageOldName.value = file.name;
    convertToBase64(file);
  }
};

const convertToBase64 = (file) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    imageData.value = reader.result;
  };
  reader.readAsDataURL(file);
};

const onCanselHandler = () => {
  emit("modal-handler", false);
};

const onConfirmHandler = () => {
  if (imageUpdatedName.value?.trim() === "") {
    toast.open({
      message: "Image title cannot contain only spaces",
      type: "warning",
    });
    imageUpdatedName.value = null;
    return;
  }

  emit("modal-handler", {
    name: imageUpdatedName.value || imageOldName.value,
    data: imageData.value,
  });
};
</script>
