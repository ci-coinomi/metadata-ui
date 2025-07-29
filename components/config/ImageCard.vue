<template>
  <article
    class="flex flex-col justify-between gap-4 rounded-sm border bg-gray-100 p-4 shadow-md"
  >
    <div class="flex h-[200px] items-center justify-center">
      <img
        :src="imageAddress"
        class="h-auto max-h-[200px] max-w-[216px] self-center"
      />
    </div>
    <div class="flex flex-col gap-4">
      <!-- <h3 class="flex items-center justify-center break-all">
        {{ props.image?.imageName }}
      </h3> -->
      <div
        v-if="props.createCard"
        class="flex items-center justify-evenly gap-1"
      >
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
const emit = defineEmits(["onDeleteClick"]);
const props = defineProps({
  image: Object,
  imageAddress: String,
  createCard: {
    type: Boolean,
    default: false,
  },
});
const onDeleteClickHandler = () => {
  emit("onDeleteClick", props.image);
};

/* Images are in base64-format so we need some extra convertations */
// const getImageSrc = (image) => {
//   if (!image) return "";
//   if (image.imageUrl) return image.imageUrl;

//   if (!image.imageName) return "";
//   if (image.imageName.includes("svg")) {
//     return `data:image/svg+xml;base64,${image.imageData}`;
//   }

//   const extension = image.imageName.substring(
//     image.imageName.lastIndexOf(".") + 1,
//   );
//   const base64Prefix = "data:image/" + extension + ";base64,";
//   return `${base64Prefix}${image.imageData}`;
// };
</script>
