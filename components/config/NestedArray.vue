<template>
  <ModalAddConfigField
    v-if="isAddFieldConfigVisible"
    @modal-handler="addConfigFieldModalHandler"
  />

  <div class="relative inline-block w-full text-left">
    <div class="flex w-full justify-between gap-2">
      <p class="z-0 flex items-center justify-center text-gray-600">
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
      class="absolute right-0 z-[5] mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabindex="-1"
    >
      <div class="flex w-full flex-col gap-2" role="none">
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
    class="flex w-full items-start gap-4 rounded-sm"
  >
    <div
      v-if="isObject(value)"
      class="flex w-full flex-row-reverse gap-2 border p-2"
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
      <div class="flex w-full flex-col gap-2 rounded-sm">
        <configNestedLine
          :isCloned="isCloned"
          :configNestedObject="value"
          :configUpdateTrigger="configUpdateTrigger"
        />
      </div>
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
        <configNestedArray
          :isCloned="isCloned"
          :configNestedObject="value"
          :configUpdateTrigger="configUpdateTrigger"
        />
      </div>
    </div>

    <div
      v-else-if="typeof value === 'boolean'"
      class="flex w-full items-center justify-between gap-2 p-2"
      :class="isFieldNew(key) ? 'rounded-md border border-[#33a370]' : ''"
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
          class="icon-trash h-6 w-6"
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
