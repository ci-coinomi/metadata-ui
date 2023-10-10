<template>
  <main class="pt-10 flex flex-col justify-center items-center gap-6">
    <h1 class="text-2xl font-bold">Error 404</h1>
    <p>The page you are looking for doesn't exist or has been moved.</p>
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

<!-- Vercel update comment -->
