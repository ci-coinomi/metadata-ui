<template>
  <div
    class="flex w-full flex-col gap-2 rounded-sm p-2"
    :class="configBorderStyle"
  >
    <div
      v-if="
        props.configNestedObject &&
        !props.configNestedObject.hasOwnProperty('@type')
      "
      class="flex justify-between"
    >
      <p class="text-gray-400">
        <span> Object </span>
        <span v-if="Object.entries(props.configNestedObject).length === 0">
          (empty)
        </span>
      </p>

      <UiButton
        v-if="
          !configNestedObject.accountApiKeyNames && additionalData.length > 0
        "
        class="success"
        @click="() => (configNestedObject.accountApiKeyNames = [])"
      >
        Create ApiKeys Field
      </UiButton>

      <uiButton
        v-if="isObjectDeletable"
        class="danger h-[34px] min-w-[34px]"
        @click="onObjectDeleteClick"
      >
        <img
          src="~/assets/icons/icon-trash.svg"
          class="icon-trash h-4 w-4"
          alt="delete user"
        />
      </uiButton>
    </div>
    <div
      v-for="(value, key) in configNestedObject"
      :key="key"
      :class="
        isObject(value) || Array.isArray(value) ? 'items-start' : 'items-center'
      "
      class="flex gap-4 rounded-sm py-1"
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
        <div v-if="key === 'accountApiKeyNames'" class="flex w-full gap-2">
          <div
            class="mr-auto flex w-full flex-col gap-2 rounded-md border border-gray-400 p-2"
          >
            <div
              v-for="(
                apiKey, apiKeyIndex
              ) in configNestedObject.accountApiKeyNames"
              :key="apiKey"
              class="flex w-full items-center justify-between"
            >
              {{ apiKey }}

              <UiButton
                class="danger smallPaddings"
                @click="() => onAccountApiKeyDeleteHandler(apiKeyIndex)"
              >
                <img
                  src="~/assets/icons/icon-trash.svg"
                  class="icon-trash h-4 w-4"
                  alt="delete user"
                />
              </UiButton>
            </div>
          </div>
          <UiSelect
            :selectList="availableAccountApiKeyNamesForSelect"
            :defaultValue="'Select...'"
            :notSelectable="true"
            @select-handler="(data) => props.configNestedObject[key].push(data)"
          />
        </div>

        <ConfigConfiguredProvidersNestedProvider
          v-else-if="isNestedArrayVisible(key)"
          :isCloned="isCloned"
          :configNestedObject="value"
          :configFieldType="key"
          :configUpdateTrigger="configUpdateTrigger"
          :blockchain="configNestedObject['blockchain']"
          :fullConfigObject="fullConfigObject"
          @set-blockchain="(data) => (configNestedObject.blockchain = data)"
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
      <UiInputField
        v-else-if="key === 'blockchain'"
        :model-value="configNestedObject[key]"
        type="text"
        :placeholder="'Select parent...'"
        :update-memo="configUpdateTrigger"
        :is-memo="true"
        :disabled="isFieldDisabled(key)"
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

    <article v-if="additionalData.length > 0" class="flex flex-col gap-2">
      <div
        v-for="additionalDataItem in additionalData"
        :key="additionalDataItem.id"
      >
        <h3 class="text-center">Aditional data:</h3>
        <div
          v-for="(value, key) in additionalDataItem"
          :key="key"
          class="flex items-center gap-2 py-1"
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
  blockchain: String,
  fullConfigObject: Object,
});
const emit = defineEmits(["deleteConfigField"]);

const defaultNestedObject = ref(cleared(props.configNestedObject));
const isConfigUpdated = ref(false);
const availableAccountApiKeyNamesForSelect = ref([]);

const additionalData = computed(() => {
  const additionalDataArray = [];
  defaultNestedObject.value?.networkIds?.forEach((networkId) => {
    const itemInResponse = store.providersNetworks.find(
      (item) => item.id === networkId,
    );
    if (itemInResponse) {
      additionalDataArray.push(itemInResponse);
    }

    if (itemInResponse && itemInResponse.accountApiKeyNames) {
      availableAccountApiKeyNamesForSelect.value = [
        ...itemInResponse.accountApiKeyNames,
      ];
    }
  });

  return additionalDataArray;
});

const onObjectDeleteClick = () => {
  emit("deleteConfigField");
};

const onAccountApiKeyDeleteHandler = (key) => {
  const keyNamesArray = props.configNestedObject.accountApiKeyNames;

  const updatedArray = [
    ...keyNamesArray.slice(0, key),
    ...keyNamesArray.slice(key + 1),
  ];
  props.configNestedObject.accountApiKeyNames = updatedArray;
};

const blockchainsList = computed(() =>
  store.configsList
    .filter((item) => item.configType === "BLOCKCHAIN")
    .map((item) => {
      const configFileObj = JSON.parse(item.configFile);
      return {
        name: item.configName,
        eucId: configFileObj.eucId,
      };
    }),
);

const configBorderStyle = computed(() => {
  if (props.configNestedObject?.["@type"]) return "";
  return "border border-gray-400";
});

const isNestedArrayVisible = (key) => key === "providers";
const isFieldDisabled = (key) => {
  if (
    key === "@type" ||
    key === "providerName" ||
    key === "networkIds" ||
    key === "blockchain" ||
    key === "accountApiKeyNames"
  ) {
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

watch(
  () => props.fullConfigObject?.parentConfig,
  () => {
    const parent = props.fullConfigObject?.parentConfig;
    if (parent) {
      const selectedParent = blockchainsList.value.find(
        (item) => item.name === parent.configName,
      );
      props.configNestedObject.blockchain = selectedParent.eucId;
    }
  },
);
</script>
