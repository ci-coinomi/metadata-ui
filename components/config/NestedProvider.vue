<template>
  <div class="flex w-full flex-col gap-2 rounded-sm border border-gray-400 p-2">
    <UiButton
      v-if="isArrayEditable"
      class="success ml-auto"
      @click="onAddProviderHandler"
    >
      Add item
    </UiButton>
    <div
      v-for="(value, key) in props.configNestedObject"
      :key="value"
      class="flex w-full items-start gap-4 rounded-sm"
    >
      <div class="flex w-full flex-col gap-2">
        <div v-if="isFieldNew(key)" class="flex items-center justify-between">
          <h2 class="text-gray-600">New item</h2>

          <uiButton
            class="danger h-[34px] min-w-[34px]"
            @click="onDeleteClickHandler(key)"
          >
            Delete
          </uiButton>
        </div>
        <div class="flex w-full flex-col gap-2 rounded-sm">
          <configNestedLine
            :isCloned="isCloned"
            :configNestedObject="value"
            :configUpdateTrigger="configUpdateTrigger"
            :isObjectDeletable="isNextLevelObjectDeletable(configFieldType)"
            @delete-config-field="() => onDeleteNestedLineHandler(key)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  configNestedObject: Object,
  isCloned: Boolean,
  configUpdateTrigger: Number,
  configFieldType: String,
});

const defaultNestedObject = ref(cleared(props.configNestedObject));
const isArrayEditable = computed(
  () =>
    props.configFieldType === "nodeProviders" ||
    props.configFieldType === "apiProviders" ||
    props.configFieldType === "settings" ||
    props.configFieldType === "linkouts",
);

const isNextLevelObjectDeletable = (type) => {
  return type === "settings" || type === "linkouts";
};

const onDeleteNestedLineHandler = (idx) => {
  props.configNestedObject.splice(idx, 1);
};

const onAddProviderHandler = () => {
  let defaultArrayObject;

  if (
    props.configFieldType === "nodeProviders" ||
    props.configFieldType === "apiProviders"
  ) {
    defaultArrayObject = {
      name: "",
      url: "",
      visible: false,
      priority: "",
      companyName: "",
      network: "",
      supportedMethods: [],
    };
  }
  if (props.configFieldType === "settings") {
    defaultArrayObject = {
      name: "",
      color: "",
      visible: false,
      sortOrder: "",
      linkouts: [],
    };
  }
  if (props.configFieldType === "linkouts") {
    defaultArrayObject = {
      name: "",
      url: "",
      imageName: "",
      visible: false,
      sortOrder: "",
    };
  }

  props.configNestedObject.push(defaultArrayObject);
};

const isFieldNew = (key) => {
  return !defaultNestedObject.value[key];
};

const onDeleteClickHandler = (key) => {
  props.configNestedObject.splice(key, 1);
};

onMounted(() => {
  /**
   * Web-832. We adding companyName and network to all existed providers. If props was passed
   */

  if (
    props.configFieldType === "nodeProviders" ||
    props.configFieldType === "apiProviders"
  ) {
    // eslint-disable-next-line array-callback-return
    props.configNestedObject.map((item, index) => {
      if (!("companyName" in item)) {
        props.configNestedObject[index].companyName = "";
      }

      if (!("network" in item)) {
        props.configNestedObject[index].network = "";
      }
    });
  }
});

watch(
  () => props.configUpdateTrigger,
  () => {
    defaultNestedObject.value = cleared(props.configNestedObject);
  },
);
</script>
