<template>
  <button
    type="button"
    class="flex disabled:opacity-25 justify-center items-center rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline outline-1 outline-gray-400 hover:outline-2 active:outline-[3px]"
  >
    <slot />
  </button>
</template>

<style scoped>
.warning,
.success,
.danger,
.gray {
  color: #fff;
}

.gray {
  background-color: #a39292;
  outline-color: #463f3f;
}
.danger {
  background-color: #f93e3e;
  outline-color: #d92a2a;
}

.success {
  background-color: #49cc90;
  outline-color: #33a370;
}

.warning {
  background-color: #fca130;
  outline-color: #d38b32;
}
</style>
