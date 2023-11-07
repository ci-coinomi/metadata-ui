<!-- Deep configuration of arrays with an opportunity to create an array of object with any keys (strings) / keys (any)-->
<!-- Not in use for now -->
<!-- A bit old version -->
<template>
  <ModalAddConfigField
    v-if="isAddFieldConfigVisible"
    @modal-handler="addConfigFieldModalHandler"
  />
  <div class="flex w-full flex-col gap-2 rounded-lg border border-gray-400 p-2">
    <div class="relative inline-block w-full text-left">
      <div class="flex w-full justify-between gap-2">
        <p class="z-0 flex items-center justify-center text-gray-400">
          <span class="mr-1">Array</span>
          <span v-if="nestedArray.length === 0">(empty)</span>
        </p>

        <UiButton
          :class="isButtonsBlockVisible ? 'danger' : 'success'"
          @click="() => (isButtonsBlockVisible = !isButtonsBlockVisible)"
        >
          <span v-if="isButtonsBlockVisible">Hide</span>
          <span v-else>Show</span>
          <span class="ml-1">buttons</span>
        </UiButton>
      </div>

      <div
        v-if="isButtonsBlockVisible"
        class="absolute right-0 z-[5] mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabindex="-1"
      >
        <div class="flex w-full flex-col gap-2" role="none">
          <uiButton
            class="success h-[34px] min-w-[34px]"
            @click="onAddNewFieldHandler('TEXT')"
          >
            Add text/number
          </uiButton>
          <uiButton
            class="success h-[34px] min-w-[34px]"
            @click="onAddNewFieldHandler('BOOLEAN')"
          >
            Add boolean
          </uiButton>
          <uiButton
            class="success h-[34px] min-w-[34px]"
            @click="onAddNewFieldHandler('ARRAY')"
          >
            Add array
          </uiButton>
          <uiButton
            class="success h-[34px] min-w-[34px]"
            @click="onAddNewFieldHandler('OBJECT')"
          >
            Add object
          </uiButton>
        </div>
      </div>
    </div>

    <div
      v-for="(value, key) in nestedArray"
      :key="key"
      :class="
        isObject(value) || Array.isArray(value) ? 'items-start' : 'items-center'
      "
      class="flex w-full items-start gap-4"
    >
      <div v-if="isObject(value)" class="w-full">
        <h3 v-if="isFieldNew(key)" class="mb-2 text-center">New object</h3>
        <ConfigDefaultNestedObjectEditor
          :is-cloned="isCloned"
          :nested-object="value"
          :config-update-trigger="configUpdateTrigger"
          :original-config="originalConfig"
          :is-object-deletable="isFieldNew(key)"
          @delete-config-field="onDeleteClickHandler(key)"
        />
      </div>

      <div
        v-if="Array.isArray(value)"
        class="flex w-full flex-row-reverse justify-between gap-2 rounded-sm border p-2"
        :class="isFieldNew(key) ? 'border-[#33a370]' : 'border-gray-500'"
      >
        <uiButton
          v-if="isFieldNew(key)"
          class="danger h-[34px] min-w-[34px]"
          @click="onDeleteClickHandler(key)"
        >
          <img
            src="~/assets/icons/icon-trash.svg"
            class="icon-trash h-6 w-6"
            alt="delete field"
          />
        </uiButton>
        <div class="flex w-full flex-col gap-1">
          <ConfigDefaultNestedArrayDeepEditor
            :is-cloned="isCloned"
            :nested-array="value"
            :config-update-trigger="configUpdateTrigger"
          />
        </div>
      </div>

      <div
        v-else-if="typeof value === 'boolean'"
        class="flex w-full items-center justify-between gap-2 p-2"
        :class="isFieldNew(key) ? 'rounded-md border border-[#33a370]' : ''"
      >
        <UiSwitcher
          :value="nestedArray[key]"
          @update:value="(data) => (nestedArray[key] = data)"
        />
        <uiButton
          v-if="isFieldNew(key)"
          class="danger h-[34px] min-w-[34px]"
          @click="onDeleteClickHandler(key)"
        >
          <img
            src="~/assets/icons/icon-trash.svg"
            class="icon-trash h-6 w-6"
            alt="delete field"
          />
        </uiButton>
      </div>

      <div
        v-else-if="typeof value === 'string' || typeof value === 'number'"
        class="flex w-full items-center justify-center gap-2"
        :class="isFieldNew(key) ? 'rounded-md border border-[#33a370] p-2' : ''"
      >
        <UiInputField
          v-model="nestedArray[key]"
          type="text"
          :disabled="isFieldDisabled(key)"
        />
        <uiButton
          v-if="isFieldNew(key)"
          class="danger h-[34px] min-w-[34px]"
          @click="onDeleteClickHandler(key)"
        >
          <img
            src="~/assets/icons/icon-trash.svg"
            class="icon-trash h-6 w-6"
            alt="delete field"
          />
        </uiButton>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  nestedArray: Object,
  isCloned: Boolean,
  configUpdateTrigger: Number,
  arrayKey: String,
  originalConfig: Object,
});

const defaultNestedArray = ref(cleared(props.nestedArray));

const isAddFieldConfigVisible = ref(false);
const isButtonsBlockVisible = ref(false);

const isFieldNew = (key) => !defaultNestedArray.value[key];

const onDeleteClickHandler = (key) => {
  props.nestedArray.splice(key, 1);
};

/* List of not-editable text fields */
const isFieldDisabled = (key) => {
  const disabledFieldsArray = ["@type"];

  if (disabledFieldsArray.includes(key)) {
    return true;
  }

  if (!props.isCloned && key === "eucId") {
    return true;
  }

  return false;
};

const addConfigFieldModalHandler = (payload) => {
  isAddFieldConfigVisible.value = false;
  if (payload) {
    props.nestedArray[props.nestedArray.length] = payload;
  }
};

const onAddNewFieldHandler = (type) => {
  isButtonsBlockVisible.value = false;
  switch (type) {
    case "TEXT":
      props.nestedArray[props.nestedArray.length] = "";
      break;
    case "BOOLEAN":
      props.nestedArray[props.nestedArray.length] = false;
      break;
    case "ARRAY":
      props.nestedArray[props.nestedArray.length] = [];
      break;
    case "OBJECT":
      isAddFieldConfigVisible.value = true;
      break;
  }
};

/* Update config watcher */
watch(
  () => props.configUpdateTrigger,
  () => {
    defaultNestedArray.value = cleared(props.nestedArray);
  },
);
</script>
