<template>
  <header class="bg-white px-4 pt-4 pb-4 w-full shadow-md">
    <div class="flex justify-between max-w-[1400px] m-auto">
      <h2 class="flex items-center">Metadata UI</h2>
      <h1 class="flex items-center text-2xl font-bold">{{ headerTitle }}</h1>
      <div class="flex gap-4">
        <UiButton @click="onLogoutHandler">Sign Out</UiButton>
      </div>
    </div>
  </header>
</template>
<script setup>
import { signout } from "~/api/user";
import { useStore } from "~/store";

const router = useRouter();
const store = useStore();

const headerTitle = computed(() => store.headerTitle);

const onLogoutHandler = async () => {
  await signout();
  router.push({
    path: `/`,
  });
};
</script>
