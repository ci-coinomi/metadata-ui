<template>
  <div
    class="popup fixed inset-0 z-30 bg-[#0D0D0D]/[.9] flex justify-center items-center"
  >
    <div class="bg-white p-10 rounded-md flex flex-col gap-6">
      <h2 class="text-lg text-center font-bold">Add new user:</h2>
      <UiInputField
        v-model="username"
        type="text"
        :placeholder="'Username...'"
      />
      <UiInputField
        v-model="password"
        type="text"
        :placeholder="'Password...'"
      />
      <div class="flex flex-col gap-1">
        <label for="role-select" class="text-sm text-gray-500"
          >Choose role:</label
        >
        <select
          id="role-select"
          v-model="role"
          class="p-1 rounded-md"
          @change="onRoleSelectHandler($event)"
        >
          <option disabled>Choose role:</option>
          <option :value="'ADMIN'">Admin</option>
          <option value="SUPER_ADMIN">Super admin</option>
        </select>
      </div>

      <div class="flex gap-4 justify-between">
        <UiButton class="danger w-2/5" @click="onCanselHandler"
          >Cancel</UiButton
        >
        <UiButton class="success w-2/5" @click="onConfirmHandler"
          >Confirm</UiButton
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const emit = defineEmits(["addNewUser"]);

const toast = useToast();

const username = ref("");
const password = ref("");
const role = ref("ADMIN");

const onRoleSelectHandler = (evt) => {
  role.value = evt.target.value;
};

const onCanselHandler = () => {
  emit("addNewUser", false);
};

const onConfirmHandler = () => {
  if (username.value.trim() === "" || password.value.trim() === "") {
    toast.open({
      message: "You need to enter username and password...",
      type: "warning",
    });
    return;
  }

  emit("addNewUser", {
    username: username.value,
    password: password.value,
    role: role.value,
  });
};
</script>
