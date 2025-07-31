<template>
  <main class="flex flex-col items-center justify-center gap-6 pt-10">
    <h1 class="text-2xl font-bold">Access forbidden</h1>
    <p>Error 403</p>
    <template v-if="isLoggedIn">
      <p>Don't worry, you can still use Metadata UI</p>
      <div class="flex gap-4">
        <UiButton @click="onPreviousPageHandler"> Return </UiButton>
        <UiButton @click="toConfigsNavigateHandler"> Configs </UiButton>
      </div>
    </template>

    <template v-else>
      <p>You are not autorized</p>
      <UiButton @click="onLoginNavigateHandler"> To login page </UiButton>
    </template>
  </main>
</template>
<script setup>
import { useAuth } from "@/composables/useFirebaseAuth";

const { isAuthenticated } = useAuth();
const router = useRouter();

const isLoggedIn = ref(false);

const onPreviousPageHandler = () => {
  clearError();
  router.go(-1);
};

const onLoginNavigateHandler = () => {
  router.push({
    path: `/`,
  });
};

const toConfigsNavigateHandler = () => {
  router.push({
    path: `/configs`,
  });
};

watch(isAuthenticated, (value) => {
  isLoggedIn.value = value;
});
</script>
