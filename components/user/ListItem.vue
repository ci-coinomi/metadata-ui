<template>
  <article
    class="flex gap-3 items-center ring-1 ring-inset ring-gray-400 rounded-md p-2 w-full"
  >
    <p class="w-1/3">
      <span class="text-gray-500">Name:</span>
      {{ props.user.username }}
    </p>
    <p class="w-1/3">
      <span class="text-gray-500">Role:</span>
      {{ props.user.roles.length > 1 ? "Super Admin" : "Admin" }}
    </p>
    <p class="w-1/3 flex items-center gap-1">
      <span class="text-gray-500">Status:</span>
      <UiSwitcher
        :value="props.user.enabled"
        :disabled="true"
        class="opacity-60"
      />
    </p>
    <div class="ml-auto flex justify-center items-center gap-1">
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
        class="ml-auto danger px-2 py-2 h-[34px]"
        @click="onDeleteClickHandler"
      >
        <img
          src="~/assets/icons/icon-trash.svg"
          class="w-6 h-6 icon-trash"
          alt="delete user"
        />
      </uiButton>
    </div>
  </article>
</template>
<script setup>
const props = defineProps({
  user: Object,
});

const emit = defineEmits(["onDeleteClick", "onUpdateClick"]);

const onDeleteClickHandler = () => {
  emit("onDeleteClick", props.user.username);
};

const onUpdateClickHandler = () => {
  emit("onUpdateClick", props.user);
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
