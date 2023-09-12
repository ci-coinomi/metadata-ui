<template>
  <ModalAddConfigField
    v-if="isAddFieldConfigVisible"
    @modal-handler="addConfigFieldModalHandler"
  />

  <div class="relative inline-block text-left w-full">
    <div class="flex gap-2 w-full justify-between">
      <p class="flex justify-center items-center text-gray-600 z-0">
        <span class="mr-1">Array</span>
        <span v-if="configNestedObject.length === 0">(empty)</span>
      </p>

      <UiButton
        :class="isButtonsBlockVisible ? 'danger' : 'success'"
        @click="onToggleArrayButtonsHandler"
      >
        <span v-if="isButtonsBlockVisible">Hide</span>
        <span v-else>Show</span>
        <span class="ml-1">buttons</span>
      </UiButton>
    </div>

    <div
      v-if="isButtonsBlockVisible"
      class="absolute p-4 right-0 z-[5] mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabindex="-1"
    >
      <div class="w-full flex gap-2 flex-col" role="none">
        <uiButton
          class="success h-[34px] min-w-[34px]"
          @click="onAddNewFieldHandler('text')"
        >
          Add text/number
        </uiButton>
        <uiButton
          class="success h-[34px] min-w-[34px]"
          @click="onAddNewFieldHandler('boolean')"
        >
          Add boolean
        </uiButton>
        <uiButton
          class="success h-[34px] min-w-[34px]"
          @click="onAddNewFieldHandler('array')"
        >
          Add array
        </uiButton>
        <uiButton
          class="success h-[34px] min-w-[34px]"
          @click="onAddNewFieldHandler('object')"
        >
          Add object
        </uiButton>
      </div>
    </div>
  </div>

  <div
    v-for="(value, key) in props.configNestedObject"
    :key="key"
    :class="
      isObject(value) || Array.isArray(value) ? 'items-start' : 'items-center'
    "
    class="flex gap-4 rounded-sm w-full items-start"
  >
    <div
      v-if="isObject(value)"
      class="flex p-2 flex-row-reverse gap-2 border w-full"
      :class="isFieldNew(key) ? 'border-[#33a370]' : 'border-gray-500'"
    >
      <uiButton
        v-if="isFieldNew(key)"
        class="danger h-[34px] min-w-[34px]"
        @click="onDeleteClickHandler(key)"
      >
        <img
          src="~/assets/icons/icon-trash.svg"
          class="w-6 h-6 icon-trash"
          alt="delete field"
        />
      </uiButton>
      <div class="flex flex-col gap-2 w-full rounded-sm">
        <configNestedLine
          :isCloned="isCloned"
          :configNestedObject="value"
          :configUpdateTrigger="configUpdateTrigger"
        />
      </div>
    </div>

    <div
      v-if="Array.isArray(value)"
      class="flex flex-row-reverse gap-2 p-2 border rounded-sm w-full justify-between"
      :class="isFieldNew(key) ? 'border-[#33a370]' : 'border-gray-500'"
    >
      <uiButton
        v-if="isFieldNew(key)"
        class="danger h-[34px] min-w-[34px]"
        @click="onDeleteClickHandler(key)"
      >
        <img
          src="~/assets/icons/icon-trash.svg"
          class="w-6 h-6 icon-trash"
          alt="delete field"
        />
      </uiButton>
      <div class="flex flex-col gap-1 w-full">
        <configNestedArray
          :isCloned="isCloned"
          :configNestedObject="value"
          :configUpdateTrigger="configUpdateTrigger"
        />
      </div>
    </div>

    <div
      v-else-if="typeof value === 'boolean'"
      class="flex justify-between items-center gap-2 w-full p-2"
      :class="isFieldNew(key) ? 'border border-[#33a370] rounded-md' : ''"
    >
      <UiSwitcher
        :value="configNestedObject[key]"
        @update:value="(data) => (configNestedObject[key] = data)"
      />
      <uiButton
        v-if="isFieldNew(key)"
        class="danger h-[34px] min-w-[34px]"
        @click="onDeleteClickHandler(key)"
      >
        <img
          src="~/assets/icons/icon-trash.svg"
          class="w-6 h-6 icon-trash"
          alt="delete field"
        />
      </uiButton>
    </div>

    <div
      v-else-if="typeof value === 'string' || typeof value === 'number'"
      class="flex justify-center items-center gap-2 w-full"
      :class="isFieldNew(key) ? 'border border-[#33a370] p-2 rounded-md' : ''"
    >
      <UiInputField
        v-model="configNestedObject[key]"
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
          class="w-6 h-6 icon-trash"
          alt="delete field"
        />
      </uiButton>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  configNestedObject: Object,
  isCloned: Boolean,
  configUpdateTrigger: Number,
});

const defaultNestedObject = ref(
  JSON.parse(JSON.stringify(props.configNestedObject)),
);

const isAddFieldConfigVisible = ref(false);
const isButtonsBlockVisible = ref(false);

const onToggleArrayButtonsHandler = () => {
  isButtonsBlockVisible.value = !isButtonsBlockVisible.value;
};

const isFieldNew = (key) => {
  return !defaultNestedObject.value[key];
};

const onDeleteClickHandler = (key) => {
  props.configNestedObject.splice(key, 1);
};

const isFieldDisabled = (key) => {
  if (key === "@type") {
    return true;
  } else if (!props.isCloned && key === "eucId") {
    return true;
  } else {
    return false;
  }
};

const addConfigFieldModalHandler = (payload) => {
  isAddFieldConfigVisible.value = false;
  if (payload) {
    props.configNestedObject[props.configNestedObject.length] = payload;
  }
};

const onAddNewFieldHandler = (type) => {
  isButtonsBlockVisible.value = false;
  switch (type) {
    case "text":
      props.configNestedObject[props.configNestedObject.length] = "";
      break;
    case "boolean":
      props.configNestedObject[props.configNestedObject.length] = false;
      break;
    case "array":
      props.configNestedObject[props.configNestedObject.length] = [];
      break;
    case "object":
      isAddFieldConfigVisible.value = true;
      break;
  }
};

watch(
  () => props.configUpdateTrigger,
  () => {
    defaultNestedObject.value = JSON.parse(
      JSON.stringify(props.configNestedObject),
    );
  },
);
</script>
