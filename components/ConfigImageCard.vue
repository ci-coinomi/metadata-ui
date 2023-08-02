<template>
  <article
    class="p-4 flex flex-col gap-4 border rounded-md shadow-md w-full justify-between"
  >
    <div class="flex justify-center items-center h-[200px]">
      <img
        :src="getImageSrc(props.image)"
        class="max-w-full max-h-full h-auto self-center"
        :alt="props.image.imageName"
      />
    </div>
    <div class="flex flex-col gap-4">
      <h3 class="flex justify-center items-center break-all">
        {{ props.image.imageName }}
      </h3>
      <div class="flex justify-evenly items-center gap-1">
        <uiButton
          class="warning px-2 py-2 h-[34px]"
          @click="onUpdateClickHandler"
        >
          <img
            src="~/assets/icons/icon-update.svg"
            class="w-6 h-6 icon-update"
            alt="delete user"
          />
        </uiButton>
        <uiButton
          class="danger px-2 py-2 h-[34px]"
          @click="onDeleteClickHandler"
        >
          <img
            src="~/assets/icons/icon-trash.svg"
            class="w-6 h-6 icon-trash"
            alt="delete user"
          />
        </uiButton>
      </div>
    </div>
  </article>
</template>
<script setup>
const props = defineProps({
  image: Object,
});

const emit = defineEmits(["onDeleteClick", "onUpdateClick"]);

const onDeleteClickHandler = () => {
  emit("onDeleteClick", props.image);
};

const onUpdateClickHandler = () => {
  emit("onUpdateClick", props.image);
};

const getImageSrc = (image) => {
  const extension = image.imageName.substring(
    image.imageName.lastIndexOf(".") + 1,
  );
  const base64Prefix = "data:image/" + extension + ";base64,";
  return `${base64Prefix}${image.imageData}`;
};
</script>

<style scoped>
.icon-trash {
  filter: invert(1) grayscale(100%) brightness(200%);
  mask: url(~/assets/icons/icon-trash.svg) no-repeat center / contain;
  background-color: white;
}

.icon-update {
  filter: invert(1) grayscale(100%) brightness(200%);
  mask: url(~/assets/icons/icon-update.svg) no-repeat center / contain;
  background-color: white;
}
</style>
