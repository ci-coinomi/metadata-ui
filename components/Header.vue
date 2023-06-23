<template>
  <header class="flex justify-between pb-4">
    <h2>Metadata UI</h2>
    <div class="flex gap-4">
      <UiButton @click="onLogoutHandler">Sign Out</UiButton>
    </div>
  </header>
</template>
<script setup>
import { signout } from "~/api/user";

const router = useRouter();

const onLogoutHandler = async () => {
  await signout();
  router.push({
    path: `/`,
  });
};
</script>
