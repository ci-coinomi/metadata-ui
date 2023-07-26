<template>
  <article class="flex flex-col ring-1 ring-inset ring-gray-400 rounded-md">
    <div
      class="cursor-pointer flex gap-3 items-center justify-between w-full p-2"
      @click="toggleListItem()"
    >
      <p class="overflow-x-auto">
        <span class="text-gray-500">Name:</span>
        {{ props.config.configName }}
      </p>
      <p class="min-w-[175px] ml-auto">
        <span class="text-gray-500">Type:</span>
        {{ props.config.configType }}
      </p>
      <img
        src="~/assets/icons/icon-arrow-right.svg"
        class="w-4 h-4 duration-150"
        :class="isOpened ? 'rotate-90' : ''"
        alt="add"
      />
    </div>
    <configDetailsCard
      v-if="isOpened"
      :banner="config"
      @delete-config-item="deleteConfigItem"
    />
  </article>
</template>

<script setup>
const props = defineProps({
  config: Object,
});

const isOpened = ref(false);

// Handlers

const toggleListItem = () => {
  isOpened.value = !isOpened.value;
};
</script>
