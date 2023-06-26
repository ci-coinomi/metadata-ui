<template>
  <main class="pt-10 flex flex-col justify-center items-center gap-6">
    <h1 class="text-2xl font-bold">Error 403</h1>
    <p>You have no access to this page</p>
    <div class="flex gap-4">
      <UiButton @click="onPreviousPageHandler"> To previous page </UiButton>
      <UiButton @click="onLoginPageHandler"> To login page </UiButton>
    </div>
  </main>
</template>
<script setup>
import { signout } from "~/api/user";

const router = useRouter();

const onPreviousPageHandler = () => {
  clearError();
  router.go(-2);
};

const onLoginPageHandler = async () => {
  await signout();
  clearError({ redirect: "/" });
};
</script>
