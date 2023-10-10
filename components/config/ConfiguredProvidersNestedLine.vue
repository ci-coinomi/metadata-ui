<template>
  <div
    class="p-2 flex flex-col gap-2 w-full rounded-sm"
    :class="configBorderStyle"
  >
    <div
      v-if="
        props.configNestedObject &&
        !props.configNestedObject.hasOwnProperty('@type')
      "
      class="flex justify-between"
    >
      <p class="text-gray-600">
        <span> Object </span>
        <span v-if="Object.entries(props.configNestedObject).length === 0">
          (empty)
        </span>
      </p>

      <uiButton
        v-if="isObjectDeletable"
        class="danger h-[34px] min-w-[34px]"
        @click="onObjectDeleteClick"
      >
        <img
          src="~/assets/icons/icon-trash.svg"
          class="w-4 h-4 icon-trash"
          alt="delete user"
        />
      </uiButton>
    </div>
    <div
      v-for="(value, key) in configNestedObject"
      :key="key"
      :class="
        isObject(value) || Array.isArray(value) || key === 'blockchain'
          ? 'items-start'
          : 'items-center'
      "
      class="flex py-1 gap-4 rounded-sm"
    >
      <p
        :class="
          isObject(value) || Array.isArray(value)
            ? 'text-gray-600'
            : 'text-gray-400'
        "
      >
        {{ key }}
      </p>

      <template v-if="isObject(value)">
        <ConfigConfiguredProvidersNestedLine
          :isCloned="isCloned"
          :configNestedObject="value"
          :configUpdateTrigger="props.configUpdateTrigger"
        />
      </template>

      <UiSwitcher
        v-else-if="typeof value === 'boolean'"
        :value="configNestedObject[key]"
        :update-memo="configUpdateTrigger"
        :is-memo="true"
        @update:value="(data) => (configNestedObject[key] = data)"
      />

      <template v-else-if="Array.isArray(value)">
        <ConfigConfiguredProvidersNestedProvider
          v-if="isNestedArrayVisible(key)"
          :isCloned="isCloned"
          :configNestedObject="value"
          :configFieldType="key"
          :configUpdateTrigger="configUpdateTrigger"
        />
        <UiInputField
          v-else
          :model-value="configNestedObject[key]"
          type="text"
          :disabled="isFieldDisabled(key)"
          :update-memo="configUpdateTrigger"
          :is-memo="true"
          @input="
            (data) => (configNestedObject[key] = data.target.value.split(','))
          "
        />
      </template>
      <UiSelect
        v-else-if="key === 'blockchain'"
        :selectList="blockchainsList"
        :defaultValue="value"
        @select-handler="
          (selectValue) => (props.configNestedObject[key] = selectValue)
        "
      />
      <UiInputField
        v-else
        v-model="configNestedObject[key]"
        type="text"
        :update-memo="configUpdateTrigger"
        :is-memo="true"
        :disabled="isFieldDisabled(key)"
      />
    </div>

    <article v-if="editionalData.length > 0" class="flex gap-2 flex-col">
      <div
        v-for="editionalDataItem in editionalData"
        :key="editionalDataItem.id"
      >
        <h3 class="text-center">Aditional data:</h3>
        <div
          v-for="(value, key) in editionalDataItem"
          :key="key"
          class="flex gap-2 py-1 items-center"
        >
          <p
            :class="
              isObject(value) || Array.isArray(value)
                ? 'text-gray-600'
                : 'text-gray-400'
            "
          >
            {{ key }}
          </p>
          <UiSwitcher
            v-if="typeof value === 'boolean'"
            :value="value"
            disabled
            class="opacity-50"
          />
          <UiInputField
            v-else
            :model-value="value"
            type="text"
            :disabled="true"
          />
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { useStore } from "~/store";

const store = useStore();

const props = defineProps({
  configNestedObject: Object,
  isCloned: Boolean,
  configUpdateTrigger: Number,
  isObjectDeletable: Boolean,
});
const emit = defineEmits(["deleteConfigField"]);

const defaultNestedObject = ref(cleared(props.configNestedObject));
const isConfigUpdated = ref(false);

const editionalData = computed(() => {
  const editionalDataArray = [];
  defaultNestedObject.value?.networkIds?.forEach((networkId) => {
    const itemInResponse = store.providersNetworks.find(
      (item) => item.id === networkId,
    );
    if (itemInResponse) editionalDataArray.push(itemInResponse);
  });

  if (editionalDataArray) {
    console.log("Object", cleared(defaultNestedObject.value));
    console.log("EditionalData", cleared(store.providersNetworks));
  }
  return editionalDataArray;
});

const onObjectDeleteClick = () => {
  emit("deleteConfigField");
};

const blockchainsList = computed(() =>
  store.configsList
    .filter((item) => item.configType === "BLOCKCHAIN")
    .map((item) => {
      const configFileObj = JSON.parse(item.configFile);
      return configFileObj.eucId;
    }),
);

const configBorderStyle = computed(() => {
  if (props.configNestedObject?.["@type"]) return "";
  return "border border-gray-400";
});

const isNestedArrayVisible = (key) => key === "providers";
const isFieldDisabled = (key) => {
  if (key === "@type" || key === "providerName" || key === "networkIds") {
    return true;
  } else if (!props.isCloned && key === "eucId") {
    return true;
  } else {
    return false;
  }
};
const isObject = (value) => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

watch(
  () => props.configNestedObject,
  () => {
    !areObjectsEqual(
      cleared(defaultNestedObject.value),
      cleared(props.configNestedObject),
    )
      ? (isConfigUpdated.value = true)
      : (isConfigUpdated.value = false);
  },
  {
    deep: true,
  },
);

watch(
  () => props.configUpdateTrigger,
  () => {
    defaultNestedObject.value = cleared(props.configNestedObject);
    isConfigUpdated.value = false;
  },
);
</script>
