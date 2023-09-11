<template>
  <ModalAddConfigField
    v-if="isAddFieldConfigVisible"
    @modal-handler="addConfigFieldModalHandler"
  />

  <div class="relative inline-block text-left">
    <div class="flex gap-2">
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
      class="absolute p-4 left-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
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
    class="flex gap-4 rounded-sm flex-col w-full items-start"
  >
    <div v-if="isObject(value)" class="flex gap-2 w-full">
      <div
        class="p-2 flex flex-col gap-2 w-full border border-gray-500 rounded-sm"
      >
        <configNestedLine :isCloned="isCloned" :configNestedObject="value" />
      </div>
    </div>

    <div v-if="Array.isArray(value)" class="flex gap-2">
      <div
        class="p-2 flex flex-col gap-1 w-full border border-gray-500 rounded-sm"
      >
        <configNestedArray :isCloned="isCloned" :configNestedObject="value" />
      </div>
    </div>

    <div
      v-else-if="typeof value === 'boolean'"
      class="flex justify-start items-center gap-2 w-full"
    >
      <UiSwitcher
        :value="configNestedObject[key]"
        @update:value="(data) => (configNestedObject[key] = data)"
      />
    </div>

    <div
      v-else-if="typeof value === 'string' || typeof value === 'number'"
      class="flex justify-center items-center gap-2 w-full"
    >
      <UiInputField
        v-model="configNestedObject[key]"
        type="text"
        :disabled="isFieldDisabled(key)"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  configNestedObject: Object,
  isCloned: Boolean,
});

const isAddFieldConfigVisible = ref(false);
const isButtonsBlockVisible = ref(false);

const onToggleArrayButtonsHandler = () => {
  isButtonsBlockVisible.value = !isButtonsBlockVisible.value;
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
</script>
