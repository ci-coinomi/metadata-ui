<template>
  <div
    v-for="(value, key) in props.configNestedObject"
    :key="key"
    :class="!isObject(value) ? 'items-center' : ''"
    class="flex p-1 gap-4 rounded-sm"
  >
    <p class="text-gray-400">{{ key }}:</p>
    <template v-if="isObject(value)">
      <div class="pl-1 flex flex-col gap-1 w-full">
        <p class="text-gray-400">Object</p>
        <configNestedLine
          :configNestedObject="value"
          @nested-object-updated="handleValueChange"
        />
      </div>
    </template>
    <template v-else>
      <label v-if="typeof value === 'boolean'" class="switch">
        <input v-model="configNestedObject[key]" type="checkbox" />
        <span class="slider"></span>
        {{ value }}
      </label>
      <UiInputField
        v-else
        v-model="configNestedObject[key]"
        type="text"
        :disabled="key === '@type'"
      />
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  configNestedObject: Object,
});

const emit = defineEmits(["nested-object-updated"]);

const isObject = (value) => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const handleValueChange = (key, value) => {
  emit("nested-object-updated", {
    ...props.configNestedObject,
    [key]: value,
  });
};
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 1px;
  bottom: 1px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #49cc90;
}

input:checked + .slider:before {
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(20px);
  transform: translateX(20px);
}
</style>
