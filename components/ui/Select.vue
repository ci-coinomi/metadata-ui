<template>
  <div ref="selectRef" class="relative">
    <p
      class="flex cursor-pointer justify-start rounded-md border-0 px-6 py-1.5 outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-500 disabled:opacity-25 sm:text-sm sm:leading-6"
      :class="disabled ? 'text-gray-400' : 'text-gray-900'"
      @click="onSelectedValueClick"
    >
      <span v-if="selectList.length === 0"> Empty </span>
      <span v-else>
        {{ selectedItem }}
      </span>
    </p>
    <div
      v-if="isSelectOpen && selectList.length > 0"
      class="absolute left-0 top-8 z-10 mt-2 rounded-md bg-white px-6 py-1.5 ring-1 ring-inset ring-gray-300"
    >
      <div
        v-for="(item, index) in selectList"
        :key="index"
        class="w-full cursor-pointer whitespace-nowrap text-gray-900 hover:underline sm:text-sm sm:leading-6"
        @click="onSelectListItemClick(item)"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps([
  "selectList",
  "defaultValue",
  "disabled",
  "notSelectable",
]);
const emit = defineEmits(["selectHandler"]);

const selectedItem = ref(null);
const isSelectOpen = ref(null);
const selectRef = ref(null);

const onSelectedValueClick = () => {
  if (props.disabled) return;
  isSelectOpen.value = !isSelectOpen.value;
};

const onSelectListItemClick = (value) => {
  if (!props.notSelectable) {
    selectedItem.value = value;
  }
  isSelectOpen.value = false;
  emit("selectHandler", value);
};

const handleClickOutside = (event) => {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    isSelectOpen.value = false;
  }
};

onMounted(() => {
  selectedItem.value = props.defaultValue;
  document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>
