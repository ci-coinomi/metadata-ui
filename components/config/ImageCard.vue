<template>
  <article
    class="flex flex-col justify-between gap-4 rounded-sm border bg-gray-100 p-4 shadow-md"
  >
    <div class="flex h-[200px] items-center justify-center">
      <img
        :src="getImageSrc(props.image)"
        class="h-auto max-h-[200px] max-w-[216px] self-center"
        :title="props.image.imageName"
      />
    </div>
    <div class="flex flex-col gap-4">
      <h3 class="flex items-center justify-center break-all">
        {{ props.image.imageName }}
      </h3>
      <div class="flex items-center justify-evenly gap-1">
        <uiButton
          class="warning h-[34px] px-2 py-2"
          @click="onUpdateClickHandler"
        >
          <img
            src="~/assets/icons/icon-update.svg"
            class="icon-update h-6 w-6"
            alt="delete user"
          />
        </uiButton>
        <uiButton
          class="danger h-[34px] px-2 py-2"
          @click="onDeleteClickHandler"
        >
          <img
            src="~/assets/icons/icon-trash.svg"
            class="icon-trash h-6 w-6"
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
  if (image.imageName.includes("svg")) {
    return `data:image/svg+xml;base64,${image.imageData}`;
  }

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
