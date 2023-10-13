<template>
  <div
    class="popup fixed inset-0 z-30 flex items-center justify-center bg-[#0D0D0D]/[.9] p-32"
  >
    <div
      class="flex min-h-[40vh] max-w-[900px] flex-col items-center gap-6 rounded-md bg-white p-10"
    >
      <h2 class="text-center text-lg font-bold">
        <span v-if="props.payload">Update image</span>
        <span v-else>Upload new image</span>
      </h2>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="flex items-center justify-center"
        @change="fileChangeHandler"
      />

      <div v-if="imageOldName" class="flex w-full flex-col gap-2">
        <p class="text-gray-500">Image old name:</p>
        <p>{{ imageOldName }}</p>
        <UiInputField
          v-model="imageUpdatedName"
          type="text"
          :placeholder="'Image updated name...'"
        />
      </div>

      <div class="mt-auto flex justify-between gap-4">
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
const emit = defineEmits(["modal-handler"]);
const props = defineProps(["payload"]);

const { $toast } = useNuxtApp();

const fileInput = ref(null);

const imageUpdatedName = ref(null);
const imageOldName = ref(props.payload?.imageName || "");
const imageData = ref(props.payload?.imageData || "");

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

const removeBase64Prefix = (encodedImage) => {
  const commaIndex = encodedImage.indexOf(",") + 1;
  return encodedImage.substring(commaIndex);
};

const onConfirmHandler = () => {
  if (imageUpdatedName.value?.trim() === "") {
    $toast.warning(`Image title cannot contain only spaces`);
    imageUpdatedName.value = null;
    return;
  }

  if (
    props.payload &&
    props.payload.imageData === imageData.value &&
    props.payload.imageName === (imageUpdatedName.value || imageOldName.value)
  ) {
    $toast.warning(`You have not updated image data`);
    return;
  }

  if (!imageData.value) {
    $toast.warning(`You need to upload image`);
    return;
  }

  emit("modal-handler", {
    name: imageUpdatedName.value || imageOldName.value,
    data: removeBase64Prefix(imageData.value),
  });
};

onMounted(() => {
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>
