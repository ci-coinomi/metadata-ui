<template>
  <main class="flex flex-col items-center justify-center gap-6 pt-10">
    <h1 class="text-2xl font-bold">Access forbidden</h1>
    <p>Error 403</p>
    <p>You have no access to this page</p>
    <div class="flex gap-4">
      <UiButton @click="onPreviousPageHandler"> To previous page </UiButton>
    </div>
  </main>
</template>
<script setup>
const router = useRouter();

const onPreviousPageHandler = () => {
  clearError();
  router.go(-1);
};
</script>
