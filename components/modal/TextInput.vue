<template>
  <div
    class="fixed inset-0 z-30 bg-[#0D0D0D]/[.9] flex justify-center items-center"
  >
    <div class="bg-white p-10 rounded-md flex flex-col gap-6">
      <h2 class="text-lg text-center font-bold">Provide new parent name.</h2>
      <p class="text-center opacity-50">
        Only config with Asset type can be passed
      </p>
      <UiInputField
        v-model="textInputValue"
        type="text"
        :placeholder="'New parent name...'"
      />
      <div class="flex gap-4 justify-between">
        <UiButton class="danger w-2/5" @click="onCanselHandler"
          >Cancel</UiButton
        >
        <UiButton class="success w-2/5" @click="onConfirmHandler"
          >Confirm</UiButton
        >
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["isModalConfirmed"]);
const props = defineProps(["configs"]);

const { $toast } = useNuxtApp();

const textInputValue = ref("");

const onCanselHandler = () => {
  emit("isModalConfirmed", false);
};

const onConfirmHandler = () => {
  if (textInputValue.value.trim() === "") {
    $toast.warning(`You need to enter new config name`);
    return;
  }

  const newParentConfig = props.configs
    .filter((item) => item.configType === "ASSET")
    .find((item) => item.configName === textInputValue.value);

  if (!newParentConfig) {
    $toast.warning(
      `Asset with the name "${textInputValue.value}" was not found`,
    );
    return;
  }
  $toast.success(`Parent was changed`);
  emit("isModalConfirmed", newParentConfig);
};

onMounted(() => {
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>
