<template>
  <div
    class="flex w-full flex-col justify-between rounded-lg border-2"
    :class="modalClass"
    @click="onGroupClickHandler"
  >
    <div class="flex items-center justify-between gap-4 p-2">
      <h2 class="text-center text-lg">
        <span class="text-gray-600">Group name:</span>
        {{ groupItem.providerGroupName }}
        <span v-if="filtredGroupItem.length === 0">(empty)</span>
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
      <p v-if="filtredGroupItem.length === 0" class="text-center">
        There are no {{ blockchain }} networks in this group
      </p>
      <template v-else>
        <div
          v-for="groupNetwork in filtredGroupItem"
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
      </template>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["groupItem", "isSelected", "blockchain"]);
const emit = defineEmits(["onGroupItemClick"]);

const networksVisible = ref(false);

const filtredGroupItem = computed(() =>
  props.groupItem.networks.filter((el) => el.network === props.blockchain),
);
const modalClass = computed(() => {
  if (filtredGroupItem.value.length === 0) {
    return "border-gray-400";
  }
  if (props.isSelected) {
    return "border-green-600  hover:border-green-700 cursor-pointer";
  } else {
    return "border-gray-400  hover:border-gray-600 cursor-pointer";
  }
});

const onGroupClickHandler = () => {
  if (filtredGroupItem.value.length > 0) {
    const objectToReturn = {
      providerGroupName: props.groupItem.providerGroupName,
      networks: filtredGroupItem.value,
    };
    emit("onGroupItemClick", objectToReturn);
  } else {
    emit("onGroupItemClick", false);
  }
};

const onShowMoreClickHandler = () => {
  networksVisible.value = !networksVisible.value;
};
</script>
