<template>
  <button
    type="button"
    class="flex disabled:opacity-25 justify-center items-center rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 hover:ring-gray-500 hover:ring-2 active:ring-gray-600"
  >
    <slot />
  </button>
</template>

<style scoped>
.danger {
  background-color: #f93e3e;
  color: #fff;
  box-shadow: 0 0 0;
}

.success {
  background-color: #49cc90;
  color: #fff;
}

.warning {
  background-color: #fca130;
  color: #fff;
}
</style>
