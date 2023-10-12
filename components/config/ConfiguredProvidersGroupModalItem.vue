<template>
  <div
    class="flex w-full cursor-pointer flex-col justify-between rounded-lg border-2"
    :class="
      isSelected
        ? 'border-green-600  hover:border-green-700'
        : 'border-gray-400  hover:border-gray-600'
    "
    @click="onGroupClickHandler(groupItem)"
  >
    <div class="flex items-center justify-between gap-4 p-2">
      <h2 class="text-center text-lg">
        <span class="text-gray-600">Group name:</span>
        {{ groupItem.providerGroupName }}
      </h2>
      <UiButton class="flex gap-1" @click.stop="onShowMoreClickHandler">
        <span v-if="!networksVisible">Show</span>
        <span v-if="networksVisible">Hide</span>
        more
      </UiButton>
    </div>
    <div
      v-if="networksVisible"
      class="border-t-2 border-gray-400 p-2"
      :class="isSelected ? 'border-green-600' : 'border-gray-400'"
    >
      <div
        v-for="groupNetwork in groupItem.networks"
        :key="groupNetwork.id"
        class="text-md flex w-full gap-4"
      >
        <p class="flex justify-between gap-1">
          <span class="text-gray-400">Provider name:</span>
          {{ groupNetwork.providerName }}
        </p>
        <p class="flex justify-between gap-1">
          <span class="text-gray-400">Network:</span>
          {{ groupNetwork.network }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["groupItem", "isSelected"]);
const emit = defineEmits(["onGroupItemClick"]);

const networksVisible = ref(false);

const onGroupClickHandler = () => {
  emit("onGroupItemClick", props.groupItem);
};

const onShowMoreClickHandler = () => {
  networksVisible.value = !networksVisible.value;
};
</script>

<style scoped></style>
