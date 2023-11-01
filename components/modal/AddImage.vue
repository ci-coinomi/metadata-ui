<template>
  <div
    class="popup fixed inset-0 z-30 flex items-center justify-center bg-[#0D0D0D]/[.9] p-32"
  >
    <div
      class="flex min-h-[40vh] max-w-[900px] flex-col items-center gap-4 rounded-md bg-white p-10"
    >
      <h2 class="text-center text-xl font-bold">
        <span v-if="oldImage">Update image</span>
        <span v-else>Upload new image</span>
      </h2>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="fileChangeHandler"
      />

      <div v-if="imageData" class="flex w-full flex-col gap-2">
        <h3 class="text-center font-bold">Image name:</h3>
        <UiInputField
          v-model="imageName"
          type="text"
          :placeholder="'New image name...'"
        />
      </div>

      <div class="mt-auto flex justify-between gap-4">
        <UiButton class="danger w-2/5" @click="onCanselHandler">
          Cancel
        </UiButton>
        <UiButton class="success w-2/5" @click="onConfirmHandler">
          Confirm
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["modal-handler"]);
const props = defineProps(["oldImage"]);

const { $toast } = useNuxtApp();

const fileInput = ref(null);
const imageName = ref(props.oldImage?.imageName || "");
const imageData = ref(props.oldImage?.imageData || "");

const fileChangeHandler = () => {
  const file = fileInput.value.files[0];
  if (file) {
    imageName.value = file.name;
    convertToBase64(file);
  }
};

const onCanselHandler = () => {
  emit("modal-handler", false);
};

const onConfirmHandler = () => {
  if (!imageData.value) {
    $toast.warning("You need to upload image");
    return;
  }

  if (!imageName.value.trim()) {
    $toast.warning("You need to provide image name");
    imageName.value = "";
    return;
  }

  if (
    props.oldImage?.imageData === imageData.value &&
    props.oldImage?.imageName === imageName.value
  ) {
    $toast.warning(`You have not updated image data`);
    return;
  }

  emit("modal-handler", {
    imageName: imageName.value,
    imageData: removeBase64Prefix(imageData.value),
  });
};

onMounted(() => {
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.body.style.overflow = "";
});

const convertToBase64 = (file) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    imageData.value = reader.result;
  };
  reader.readAsDataURL(file);
};

const removeBase64Prefix = (encodedImage) => {
  const commaIndex = encodedImage.indexOf(",") + 1;
  return encodedImage.substring(commaIndex);
};
</script>
