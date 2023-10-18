<template>
  <article
    class="flex flex-col rounded-md border"
    :class="isConfigUpdated ? 'border-[#d38b32]' : 'border-gray-400'"
  >
    <div
      class="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md p-2"
      :class="listItemClass"
      @click="toggleListItem()"
    >
      <div class="flex items-center gap-2 overflow-x-auto p-1">
        <p>
          <span class="text-gray-500">Name:</span>
          {{ props.config.configName }}
        </p>
        <UiButton class="smallPaddings" @click.stop="onCopyNameClick">
          <img
            v-if="!copied"
            src="~/assets/icons/icon-copy.svg"
            class="h-4 w-4"
            alt="copy"
          />
          <img
            v-else
            src="~/assets/icons/icon-check.svg"
            class="h-4 w-4"
            alt="copy"
          />
        </UiButton>
      </div>
      <p class="ml-auto min-w-[175px]">
        <span class="text-gray-500">Type:</span>
        {{ props.config.configType }}
      </p>
      <img
        src="~/assets/icons/icon-arrow-right.svg"
        class="h-4 w-4 duration-150"
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
const copied = ref(false);

const listItemClass = computed(() => {
  const zebra = props.configIndex % 2 ? "bg-white" : "bg-gray-100";
  if (!isOpened.value) return zebra;
  let listItemClassValue = "";
  isConfigUpdated.value
    ? (listItemClassValue = "border-b border-[#d38b32]")
    : (listItemClassValue = "border-b border-gray-400");
  return `${zebra} ${listItemClassValue}`;
});

const onCopyNameClick = () => {
  if (!copied.value) {
    navigator.clipboard.writeText(props.config.configName);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 800);
  }
};

const toggleListItem = () => {
  isOpened.value = !isOpened.value;
  isConfigUpdated.value = false;
};

const configUpdatedHandler = (isUpdated) => {
  isConfigUpdated.value = isUpdated;
};
</script>
