<template>
  <header class="bg-white px-4 pt-4 pb-4 w-full shadow-md">
    <div class="flex justify-between max-w-[1400px] m-auto">
      <h2 class="flex items-center">Metadata UI</h2>
      <h1 class="flex items-center text-2xl font-bold">{{ headerTitle }}</h1>
      <div class="flex gap-4">
        <UiButton @click="onUsersNavigateHandler">Users</UiButton>
        <UiButton @click="onLogoutHandler">
          <img
            src="~/assets/icons/icon-logout.svg"
            class="w-4 h-4"
            alt="logout"
          />
        </UiButton>
      </div>
    </div>
  </header>
</template>
<script setup>
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

import { signout } from "~/api/user";
import { useStore } from "~/store";

const router = useRouter();
const store = useStore();
const toast = useToast();

const headerTitle = computed(() => store.headerTitle);

const onLogoutHandler = async () => {
  const response = await signout();
  if (response !== 204) {
    toast.open({
      message: `Logout request error, status: ${response}`,
      type: "error",
    });
  }
  router.push({
    path: `/`,
  });
};

const onUsersNavigateHandler = () => {
  router.push({
    path: `/users`,
  });
};
</script>
