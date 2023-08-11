<template>
  <article
    class="flex flex-col ring-1 ring-inset hover:ring-2 rounded-md"
    :class="isConfigUpdated ? 'ring-[#d38b32]' : 'ring-gray-400'"
  >
    <div
      class="cursor-pointer flex gap-3 items-center justify-between w-full p-2"
      :class="borderClass"
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
      :config="config"
      @config-update-emit="configUpdatedHandler"
    />
  </article>
</template>

<script setup>
const props = defineProps({
  config: Object,
});

const isOpened = ref(false);
const isConfigUpdated = ref(false);

const borderClass = computed(() => {
  if (!isOpened.value) return "";
  let borderClassValue = "";
  isConfigUpdated.value
    ? (borderClassValue = "border-b border-[#d38b32]")
    : (borderClassValue = "border-b border-gray-400");
  return borderClassValue;
});

const toggleListItem = () => {
  isOpened.value = !isOpened.value;
  isConfigUpdated.value = false;
};

const configUpdatedHandler = (isUpdated) => {
  isConfigUpdated.value = isUpdated;
};
</script>
