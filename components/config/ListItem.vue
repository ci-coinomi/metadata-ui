<template>
  <article
    class="flex flex-col border rounded-md"
    :class="isConfigUpdated ? 'border-[#d38b32]' : 'border-gray-400'"
  >
    <div
      class="cursor-pointer flex gap-3 items-center justify-between w-full p-2 rounded-md"
      :class="listItemClass"
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
  configIndex: Number,
});

const isOpened = ref(false);
const isConfigUpdated = ref(false);

const listItemClass = computed(() => {
  const zebra = props.configIndex % 2 ? "bg-white" : "bg-gray-100";
  if (!isOpened.value) return zebra;
  let listItemClassValue = "";
  isConfigUpdated.value
    ? (listItemClassValue = "border-b border-[#d38b32]")
    : (listItemClassValue = "border-b border-gray-400");
  return `${zebra} ${listItemClassValue}`;
});

const toggleListItem = () => {
  isOpened.value = !isOpened.value;
  isConfigUpdated.value = false;
};

const configUpdatedHandler = (isUpdated) => {
  isConfigUpdated.value = isUpdated;
};
</script>
