<template>
  <div ref="selectRef" class="relative">
    <p
      class="flex justify-start disabled:opacity-25 outline-none rounded-md border-0 py-1.5 px-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6 cursor-pointer"
      @click="onSelectedValueClick"
    >
      {{ selectedItem }}
    </p>
    <div
      v-if="isSelectOpen && selectList.length > 0"
      class="absolute top-8 left-0 py-1.5 px-6 ring-1 ring-inset ring-gray-300 rounded-md mt-2 bg-white z-10"
    >
      <div
        v-for="(item, index) in selectList"
        :key="index"
        class="sm:text-sm sm:leading-6 text-gray-900 hover:underline cursor-pointer"
        @click="onSelectListItemClick(item)"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["selectList", "defaultValue"]);
const emit = defineEmits(["selectHandler"]);

const selectedItem = ref(null);
const isSelectOpen = ref(null);
const selectRef = ref(null);

const onSelectedValueClick = () => {
  isSelectOpen.value = !isSelectOpen.value;
};

const onSelectListItemClick = (value) => {
  selectedItem.value = value;
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
