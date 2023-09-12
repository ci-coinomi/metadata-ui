<template>
  <div
    class="popup fixed inset-0 z-30 bg-[#0D0D0D]/[.9] flex justify-center items-center p-32"
  >
    <section
      class="bg-white p-10 rounded-md flex flex-col items-center gap-6 min-h-[40vh] max-w-[900px]"
    >
      <ModalAddConfigField
        v-if="isAddFieldConfigVisible"
        @modal-handler="addConfigFieldModalHandler"
      />

      <h2 class="text-xl font-bold">Configure the new object:</h2>

      <article class="flex flex-col gap-2 w-full">
        <p v-if="configuredObject.length === 0" class="text-center">
          Select field type below:
        </p>
        <template v-else>
          <div
            v-for="(line, index) in configuredObject"
            :key="index"
            class="flex gap-2 w-full"
          >
            <UiInputField
              v-model="line[0]"
              :value="line[0]"
              class="flex-1"
              :placeholder="'Name(req)...'"
            />

            <UiInputField
              v-if="typeof line[1] === 'number' || typeof line[1] === 'string'"
              v-model="line[1]"
              class="flex-1"
              :placeholder="'Value...'"
            />
            <div
              v-else-if="typeof line[1] === 'boolean'"
              class="w-[44%] flex justify-center items-center"
            >
              <UiSwitcher v-model="line[1]" :value="line[1]" />
            </div>

            <p
              v-else-if="Array.isArray(line[1])"
              class="w-[44%] flex justify-center text-center text-gray-400"
            >
              Configuration is on the main page
            </p>

            <div
              v-else-if="isObject(line[1])"
              class="flex gap-2 w-[44%] justify-center"
            >
              <uiButton
                v-if="Object.keys(line[1]).length === 0"
                class="success h-[34px] min-w-[34px]"
                @click="onAddNewFieldBtn(index)"
              >
                Add object
              </uiButton>
              <p v-else class="flex justify-center items-center text-gray-400">
                Object was configured
              </p>
            </div>

            <uiButton
              class="danger h-[34px] min-w-[34px]"
              @click="onDeleteClickHandler(index)"
            >
              <img
                src="~/assets/icons/icon-trash.svg"
                class="w-6 h-6 icon-trash"
                alt="delete field"
              />
            </uiButton>
          </div>
        </template>
      </article>

      <div class="flex gap-2">
        <UiButton class="success" @click="onAddNewLineHandler('text')"
          >Add text/number</UiButton
        >
        <UiButton class="success" @click="onAddNewLineHandler('boolean')"
          >Add boolean</UiButton
        >
        <UiButton class="success" @click="onAddNewLineHandler('object')"
          >Add object</UiButton
        >
        <UiButton class="success" @click="onAddNewLineHandler('array')"
          >Add array</UiButton
        >
      </div>

      <div class="flex gap-4 justify-between mt-auto">
        <UiButton class="danger w-2/5" @click="onCanselHandler"
          >Cancel</UiButton
        >
        <UiButton class="success w-2/5" @click="onConfirmHandler"
          >Confirm</UiButton
        >
      </div>
    </section>
  </div>
</template>

<script setup>
const emit = defineEmits(["modal-handler"]);

const { $toast } = useNuxtApp();

const configuredObject = ref([]);
const isAddFieldConfigVisible = ref(false);
const configFieldIndex = ref(null);

const addConfigFieldModalHandler = (payload) => {
  isAddFieldConfigVisible.value = false;
  if (payload && configFieldIndex.value) {
    configuredObject.value[configFieldIndex.value][1] = payload;
  }
  configFieldIndex.value = null;
};

const onAddNewFieldBtn = (idx) => {
  isAddFieldConfigVisible.value = true;
  configFieldIndex.value = idx;
};

const onAddNewLineHandler = (type) => {
  switch (type) {
    case "text":
      configuredObject.value.push(["", ""]);
      break;
    case "boolean":
      configuredObject.value.push(["", false]);
      break;
    case "object":
      configuredObject.value.push(["", {}]);
      break;
    case "array":
      configuredObject.value.push(["", []]);
      break;
  }
};

const onCanselHandler = () => {
  emit("modal-handler");
};

const onConfirmHandler = () => {
  if (configuredObject.value.length === 0) {
    $toast.warning(`New object can not be empty`);
    return;
  }

  if (!checkFirstElementPresent(configuredObject.value)) {
    $toast.warning("Each field requires name");
    return;
  }
  const newConfigObject = Object.fromEntries(configuredObject.value);

  emit("modal-handler", newConfigObject);
};

const onDeleteClickHandler = (index) => {
  configuredObject.value.splice(index, 1);
};

const checkFirstElementPresent = (configuredObjectArray) => {
  for (const item of configuredObjectArray) {
    if (!Array.isArray(item) || item.length < 1 || item[0].trim() === "") {
      return false;
    }
  }
  return true;
};

onMounted(() => {
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>
