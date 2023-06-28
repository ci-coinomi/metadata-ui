<template>
  <div
    class="popup fixed inset-0 z-30 bg-[#0D0D0D]/[.9] flex justify-center items-center"
  >
    <div class="bg-white p-10 rounded-md flex flex-col gap-6">
      <h2 v-if="props.payload" class="text-lg text-center font-bold">
        <span class="text-gray-500">Editing user: </span
        >{{ props.payload?.username }}
      </h2>

      <h2 v-else class="text-lg text-center font-bold">
        <span>Create user</span>
      </h2>
      <UiInputField
        v-model="username"
        type="text"
        :placeholder="'Username...'"
      />
      <UiInputField
        v-model="password"
        type="password"
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
          <option :value="'admin'">Admin</option>
          <option :value="'super_admin'">Super admin</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <p class="text-sm text-gray-500">Account status:</p>
        <label class="switch">
          <input v-model="status" type="checkbox" />
          <span class="slider"></span>
        </label>
        <p class="text-sm">{{ status ? "Enabled" : "Disabled" }}</p>
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

const emit = defineEmits(["updateUserData"]);
const props = defineProps(["payload"]);

const toast = useToast();

const username = ref(props.payload?.username || "");
const password = ref("");
const role = ref("admin");
const status = ref(props.payload?.status || true);

const onRoleSelectHandler = (evt) => {
  role.value = evt.target.value;
};

const onCanselHandler = () => {
  emit("updateUserData", false);
};

const convertRoleToRolesArr = (role) => {
  switch(role){
    case 'admin':
      return ['ADMIN']
    case 'super_admin':
      return ['ADMIN', 'SUPER_ADMIN']
  }
}

const onConfirmHandler = () => {
  if (username.value.trim() === "" || password.value.trim() === "") {
    toast.open({
      message: "You need to enter username and password...",
      type: "warning",
    });
    return;
  }

  const rolesArr = convertRoleToRolesArr(role.value)

  emit("updateUserData", {
    username: username.value,
    password: password.value,
    role: rolesArr,
    status: status.value,
  });
};

onMounted(() => {
  if (props.payload?.roles.length === 2) {
    role.value = 'super_admin'
  }
});
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
