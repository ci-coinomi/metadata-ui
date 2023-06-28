<template>
  <article
    class="flex gap-3 items-center ring-1 ring-inset ring-gray-400 rounded-md p-2 w-full"
  >
    <p>
      <span class="text-gray-500">Username:</span>
      {{ props.user.name }}
    </p>
    <p>
      <span class="text-gray-500">User role:</span>
      {{ props.user.role }}
    </p>
    <uiButton class="ml-auto danger" @click="onDeleteClickHandler">
      <img
        src="~/assets/icons/icon-trash.svg"
        class="w-4 h-4 icon-trash"
        alt="delete user"
      />
    </uiButton>
  </article>
</template>
<script setup>
const props = defineProps({
  user: Object,
});

const emit = defineEmits(["onDeleteClick"]);

const onDeleteClickHandler = () => {
  emit("onDeleteClick", props.user.name);
};
</script>

<style scoped>
.icon-trash {
  filter: invert(1) grayscale(100%) brightness(200%);
  mask: url(~/assets/icons/icon-trash.svg) no-repeat center / contain;
  background-color: white;
}
</style>
