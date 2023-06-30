<template>
  <label class="switch">
    <input
      :checked="isChecked"
      type="checkbox"
      :disabled="props.disabled"
      @change="onSwitchHandler"
    />
    <span class="slider"></span>
  </label>
</template>

<script setup>
const props = defineProps({
  value: {
    type: Boolean,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const emit = defineEmits(["update:value"]);

const isChecked = ref(props.value);

const onSwitchHandler = () => {
  isChecked.value = !isChecked.value;
  emit("update:value", isChecked.value);
};
</script>

<style scoped>
.switch {
  position: relative;
  display: flex;
  align-items: center;
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
