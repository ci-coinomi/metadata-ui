<template>
  <article
    class="flex w-full items-center gap-3 rounded-md p-2 ring-1 ring-inset ring-gray-400"
  >
    <p class="w-1/3">
      <span class="text-gray-500">Name:</span>
      {{ props.user.username }}
    </p>
    <p class="w-1/3">
      <span class="text-gray-500">Role:</span>
      {{ props.user.roles.length > 1 ? "Super Admin" : "Admin" }}
    </p>
    <p class="flex w-1/3 items-center gap-1">
      <span class="text-gray-500">Status:</span>
      <UiSwitcher
        :value="props.user.enabled"
        :disabled="true"
        class="opacity-60"
      />
    </p>
    <div class="ml-auto flex items-center justify-center gap-1">
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
        :disabled="props.user.username === currentUser.username"
        class="danger ml-auto h-[34px] px-2 py-2"
        @click="onDeleteClickHandler"
      >
        <img
          src="~/assets/icons/icon-trash.svg"
          class="icon-trash h-6 w-6"
          alt="delete user"
        />
      </uiButton>
    </div>
  </article>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();

const props = defineProps({
  user: Object,
});

const emit = defineEmits(["onDeleteClick", "onUpdateClick"]);

const { currentUser } = storeToRefs(appStore);

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
