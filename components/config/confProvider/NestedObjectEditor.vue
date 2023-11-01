<template>
  <div
    class="flex w-full flex-col gap-2 rounded-md p-2"
    :class="configBorderStyle"
  >
    <ModalConfProviderAddAccount
      v-if="nestedObject?.accountApiKeyNames && isAddAcountModalVisible"
      :account-list="availableAccountApiKeyNamesForSelect"
      :current-provider-list="nestedObject?.accountApiKeyNames"
      :default-list="defaultNestedObject.accountApiKeyNames"
      :is-field-new="isFieldNew"
      @is-modal-confirmed="onAddAccountModalConfirmHandler"
    />

    <div v-if="isDeepNestedObject" class="flex justify-between">
      <p class="text-gray-400">
        Object
        <span v-if="Object.entries(props.nestedObject).length === 0">
          (empty)
        </span>
      </p>

      <UiButton
        v-if="!nestedObject.accountApiKeyNames && additionalData.length > 0"
        class="success smallPaddings ml-auto mr-5"
        @click="() => (nestedObject.accountApiKeyNames = [])"
      >
        Create ApiKeys Field
      </UiButton>

      <UiButton
        v-if="isObjectDeletable"
        class="danger h-[34px] min-w-[34px]"
        @click="onObjectDeleteClick"
      >
        <img
          src="~/assets/icons/icon-trash.svg"
          class="icon-trash h-4 w-4"
          alt="delete user"
        />
      </UiButton>
    </div>
    <!-- Original configProvider data -->
    <div
      v-for="(value, key) in nestedObject"
      :key="key"
      class="flex gap-4 py-1"
      :class="
        isObject(value) || Array.isArray(value) ? 'items-start' : 'items-center'
      "
    >
      <template v-if="key !== 'networkIds'">
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
          <ConfigConfProviderNestedObjectEditor
            :nested-object="value"
            :is-cloned="isCloned"
            :config-update-trigger="configUpdateTrigger"
            :original-config="originalConfig"
            :is-object-deletable="false"
          />
        </template>

        <UiSwitcher
          v-else-if="typeof value === 'boolean'"
          :value="nestedObject[key]"
          :update-memo="configUpdateTrigger"
          :is-memo="true"
          @update:value="(data) => (nestedObject[key] = data)"
        />

        <template v-else-if="Array.isArray(value)">
          <div v-if="key === 'accountApiKeyNames'" class="flex w-full gap-2">
            <UiInputField
              :model-value="nestedObject.accountApiKeyNames"
              type="text"
              disabled
              :update-memo="configUpdateTrigger"
              :is-memo="true"
            />
            <UiButton
              :disabled="isManageAccountBtnDisabled"
              @click="isAddAcountModalVisible = !isAddAcountModalVisible"
            >
              Manage
            </UiButton>
          </div>

          <ConfigConfProviderNestedArrayEditor
            v-else-if="isNestedArrayVisible(key)"
            :is-cloned="isCloned"
            :config-nested-object="value"
            :config-field-type="key"
            :config-update-trigger="configUpdateTrigger"
            :blockchain="nestedObject['blockchain']"
            :full-config-object="originalConfig"
            @set-blockchain="(data) => (nestedObject.blockchain = data)"
          />
          <UiInputField
            v-else
            :model-value="nestedObject[key]"
            type="text"
            :disabled="isFieldDisabled(key)"
            :update-memo="configUpdateTrigger"
            :is-memo="true"
            @input="
              (data) => (nestedObject[key] = data.target.value.split(','))
            "
          />
        </template>
        <UiInputField
          v-else-if="key === 'blockchain'"
          :model-value="nestedObject[key]"
          type="text"
          :placeholder="'Select parent...'"
          :update-memo="configUpdateTrigger"
          :is-memo="true"
          :disabled="isFieldDisabled(key)"
        />
        <UiInputField
          v-else
          v-model="nestedObject[key]"
          type="text"
          :update-memo="configUpdateTrigger"
          :is-memo="true"
          :disabled="isFieldDisabled(key)"
        />
      </template>
    </div>

    <!-- Additional show-only data -->
    <div v-if="additionalData.length > 0" class="flex flex-col gap-2">
      <div
        v-for="additionalDataItem in additionalData"
        :key="additionalDataItem.id"
      >
        <h3 class="text-center">Network details</h3>
        <div
          v-for="(value, key) in additionalDataItem"
          :key="key"
          :class="nestedLineClass(key, value)"
        >
          <template v-if="key !== 'id'">
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
            <div
              v-else-if="key === 'capabilities'"
              class="flex flex-col gap-2 rounded-lg border border-gray-400 p-2"
            >
              <div
                v-for="capability in value"
                :key="capability"
                class="cursor-default text-sm text-gray-400"
              >
                {{ capability }}
              </div>
            </div>
            <UiInputField
              v-else
              :model-value="value"
              type="text"
              :disabled="true"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useConfigStore } from "@/stores/configs";

const configStore = useConfigStore();
const { storedConfigList, providerNetworks } = storeToRefs(configStore);

const props = defineProps({
  blockchain: String,
  isFieldNew: Boolean,

  nestedObject: Object,
  isCloned: Boolean,
  configUpdateTrigger: Number,
  isObjectDeletable: Boolean,
  originalConfig: Object,
});
const emit = defineEmits(["deleteConfigField"]);

const defaultNestedObject = ref(cleared(props.nestedObject));
const isConfigUpdated = ref(false);
const isAddAcountModalVisible = ref(false);
const availableAccountApiKeyNamesForSelect = ref([]);

const additionalData = computed(() => {
  if (!providerNetworks.value) {
    // eslint-disable-next-line no-console
    console.error("providerNetworks were not found");
    return [];
  }

  const additionalDataArray = [];

  defaultNestedObject.value?.networkIds?.forEach((networkId) => {
    const itemInResponse = providerNetworks.value.find(
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

const onAddAccountModalConfirmHandler = (data) => {
  isAddAcountModalVisible.value = false;
  if (data) {
    props.nestedObject.accountApiKeyNames = data;
  }
};

/* All level-1 nested objects have @type - field */
const isDeepNestedObject = computed(
  () =>
    props.nestedObject &&
    !Object.prototype.hasOwnProperty.call(props.nestedObject, "@type"),
);

const blockchainsList = computed(() =>
  storedConfigList.value
    .filter((item) => item.configType === "BLOCKCHAIN")
    .map((item) => {
      const configFileObj = JSON.parse(item.configFile);
      return {
        name: item.configName,
        eucId: configFileObj.eucId,
      };
    }),
);

const isManageAccountBtnDisabled = computed(() => {
  if (!availableAccountApiKeyNamesForSelect.value) return true;
  if (availableAccountApiKeyNamesForSelect.value.length === 0) return true;
});

const configBorderStyle = computed(() => {
  if (props.nestedObject?.["@type"]) return "";
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

const nestedLineClass = (key, value) => {
  let classNames = "flex gap-4 rounded-sm ";

  if (isObject(value) || Array.isArray(value)) {
    classNames += " items-start";
  } else {
    classNames += " items-center";
  }

  key !== "id" ? (classNames += " py-1") : (classNames += "");
  return classNames;
};
const isObject = (value) => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

watch(
  () => props.nestedObject,
  () => {
    !areObjectsEqual(
      cleared(defaultNestedObject.value),
      cleared(props.nestedObject),
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
    defaultNestedObject.value = cleared(props.nestedObject);
    isConfigUpdated.value = false;
  },
);

watch(
  () => props.originalConfig?.parentConfig,
  () => {
    const parent = props.originalConfig?.parentConfig;
    if (parent) {
      const selectedParent = blockchainsList.value.find(
        (item) => item.name === parent.configName,
      );
      props.nestedObject.blockchain = selectedParent.eucId;
    }
  },
);
</script>
