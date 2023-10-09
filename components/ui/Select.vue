<template>
  <div class="">
    <p
      class="flex justify-start disabled:opacity-25 outline-none rounded-md border-0 py-1.5 px-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6 cursor-pointer"
      @click="onSelectedValueClick"
    >
      {{ selectedItem }}
    </p>
    <Transition name="collapse">
      <div
        v-if="isSelectOpen && selectList.length > 0"
        class="py-1.5 px-6 ring-1 ring-inset ring-gray-300 rounded-md mt-2"
      >
        <div
          v-for="(item, index) in selectList"
          :key="index"
          @click="onSelectListItemClick(item)"
        >
          {{ item }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps(["selectList", "defaultValue"]);
const emits = defineEmits([""]);

const selectedItem = ref(null);
const isSelectOpen = ref(null);

const onSelectedValueClick = () => {
  isSelectOpen.value = !isSelectOpen.value;
};

const onSelectListItemClick = (value) => {
  selectedItem.value = value;
  isSelectOpen.value = false;
};

onMounted(() => {
  selectedItem.value = props.defaultValue;
});
</script>

<style scoped>
.collapse-enter-active {
  animation: collapse reverse 200ms ease;
}

.collapse-leave-active {
  animation: collapse 200ms ease;
}

@keyframes collapse {
  from {
    max-height: 2000px;
  }

  to {
    max-height: 0px;
  }
}
</style>
