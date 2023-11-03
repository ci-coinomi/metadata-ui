<template>
  <div
    class="flex w-full flex-col gap-2 rounded-md p-2"
    :class="isDeepNestedObject ? 'border border-gray-400' : ''"
  >
    <ModalConfProviderAddAccount
      v-if="nestedObject?.accountApiKeyNames && isAddAcountModalVisible"
      :account-list="availableAccountApiKeyNamesForSelect"
      :current-provider-list="nestedObject?.accountApiKeyNames"
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
        v-if="!nestedObject.accountApiKeyNames && networkDetails"
        class="success smallPaddings ml-auto mr-5"
        @click="() => (nestedObject.accountApiKeyNames = [])"
      >
        Create ApiKeys Field
      </UiButton>

      <UiButton
        v-if="isObjectDeletable"
        class="danger h-[34px] min-w-[34px]"
        @click="() => emit('deleteArrayItem')"
      >
        <img
          src="~/assets/icons/icon-trash.svg"
          class="icon-trash h-4 w-4"
          alt="delete user"
        />
      </UiButton>
    </div>

    <div
      v-for="(value, key) in nestedObject"
      :key="key"
      class="flex gap-4"
      :class="`${
        isObject(value) || Array.isArray(value) ? 'items-start' : 'items-center'
      } ${key === 'networkIds' ? '-mt-2' : 'py-1'}`"
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

        <template v-else-if="typeof value === 'boolean'">
          <UiSwitcher
            :value="nestedObject[key]"
            :update-memo="configUpdateTrigger"
            :is-memo="true"
            @update:value="(data) => (nestedObject[key] = data)"
          />
        </template>

        <template v-else-if="Array.isArray(value)">
          <ConfigConfProviderNestedArrayEditor
            v-if="isPrintedAsArray(key)"
            :is-cloned="isCloned"
            :nested-array="value"
            :array-key="key"
            :config-update-trigger="configUpdateTrigger"
            :original-config="originalConfig"
            :blockchain="nestedObject['blockchain']"
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

          <UiButton
            v-if="key === 'accountApiKeyNames'"
            :disabled="isManageAccountBtnDisabled"
            @click="isAddAcountModalVisible = !isAddAcountModalVisible"
          >
            Manage
          </UiButton>
        </template>

        <UiInputField
          v-else
          v-model="nestedObject[key]"
          type="text"
          :placeholder="key === 'blockchain' ? 'Select parent...' : ''"
          :update-memo="configUpdateTrigger"
          :is-memo="true"
          :disabled="isFieldDisabled(key)"
        />
      </template>
    </div>

    <div v-if="networkDetails" class="flex flex-col gap-2">
      <h3 class="text-center">Network details</h3>

      <div
        v-for="(value, key) in networkDetails"
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
</template>
<!-- 
  NetworkIds

  Each network has id-field that not displayed in template.
  NetworkIds - not-displayed disabled array in each provider in which the ID from the network is pushed automaticay.
  It can be changed only by changing the network.
-->

<!-- 
  AccountApiKeyNames

  Each Network has array of accountApiKeyNames, as well as Provider.
  Providers' AccountApiKeyNames can have only values from it's network (or empty array). 
  This values are settable from modal (in <NestedArrayEditor />). Also in this modal there is some editional read-olny data for each AccountApiKeyNames[n] wich is saved as configStore.providerAccounts. 
-->
<script setup>
import { storeToRefs } from "pinia";
import { useConfigStore } from "@/stores/configs";

const configStore = useConfigStore();
const { providerNetworks, blockchainConfigsList } = storeToRefs(configStore);

const emit = defineEmits(["deleteArrayItem"]);
const props = defineProps({
  nestedObject: Object,
  isCloned: Boolean,
  configUpdateTrigger: Number,
  isObjectDeletable: Boolean,
  originalConfig: Object,

  /* Blockchain is used for updating lists in ModalConfProviderNetwork and ModalConfProviderGroup after changing parent during creation config. */
  blockchain: String,
});

const defaultNestedObject = ref(cleared(props.nestedObject));

const isAddAcountModalVisible = ref(false);
const availableAccountApiKeyNamesForSelect = ref([]);
const networkDetails = ref(null);

/* All level-1 nested objects have @type - field */
const isDeepNestedObject = computed(
  () =>
    props.nestedObject &&
    !Object.prototype.hasOwnProperty.call(props.nestedObject, "@type"),
);

/**
 * ManageAccounts modal can not be opened in following situations:
 */
const isManageAccountBtnDisabled = computed(() => {
  if (!availableAccountApiKeyNamesForSelect.value) return true;
  if (availableAccountApiKeyNamesForSelect.value.length === 0) return true;
});

const onAddAccountModalConfirmHandler = (data) => {
  isAddAcountModalVisible.value = false;
  if (data) {
    props.nestedObject.accountApiKeyNames = data;
  }
};

/* List of not-editable text fields */
const isFieldDisabled = (key) => {
  const disabledFieldsArray = [
    "@type",
    "blockchain",
    "providerName",
    "networkIds",
    "accountApiKeyNames",
  ];

  if (disabledFieldsArray.includes(key)) {
    return true;
  }

  if (!props.isCloned && key === "eucId") {
    return true;
  }

  return false;
};

/* Should nested array be printed as <ConfigConfProviderNestedArrayEditor> or as input type "text" */
const isPrintedAsArray = (key) => {
  const arrayKeyNames = ["providers"];
  return arrayKeyNames.includes(key);
};

const nestedLineClass = (key, value) => {
  let classNames = "flex gap-4 rounded-md ";

  if (isObject(value) || Array.isArray(value)) {
    classNames += " items-start";
  } else {
    classNames += " items-center";
  }

  key !== "id" ? (classNames += " py-1") : (classNames += "");
  return classNames;
};

/**
 * Get additional read-only data from providerNetworks.
 * Also updating data for AccountApiKeyNames by adding available values for the modal.
 */
const getNetwork = () => {
  if (!providerNetworks.value || !defaultNestedObject.value?.networkIds) return;
  defaultNestedObject.value?.networkIds?.forEach((networkId) => {
    const itemInResponse = providerNetworks.value.find(
      (item) => item.id === networkId,
    );
    if (itemInResponse) {
      networkDetails.value = itemInResponse;
    }
    if (itemInResponse && itemInResponse.accountApiKeyNames) {
      availableAccountApiKeyNamesForSelect.value = [
        ...itemInResponse.accountApiKeyNames,
      ];
    }
  });
};

onMounted(() => {
  getNetwork();
});

/* Update config watcher */
watch(
  () => props.configUpdateTrigger,
  () => {
    defaultNestedObject.value = cleared(props.nestedObject);
  },
);

/**
 * Available only during config creating and for level-1 object.
 * Updating blockchain-field in object after changing the parent.
 * Also clearing providers list to make sure that all providers have valid blockchain.
 */
watch(
  () => props.originalConfig?.parentConfig,
  () => {
    if (!isDeepNestedObject.value) {
      const parent = props.originalConfig?.parentConfig;
      if (!parent) return;

      const selectedParent = blockchainConfigsList.value.find(
        (item) => item.configName === parent.configName,
      );

      props.nestedObject.blockchain = selectedParent.eucId;
      props.nestedObject.providers = [];
    }
  },
);
</script>
