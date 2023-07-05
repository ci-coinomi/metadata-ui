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
        v-if="!props.payload"
        v-model="username"
        type="text"
        :placeholder="'Username...'"
      />
      <UiInputField
        v-if="!props.payload"
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
        <UiSwitcher :value="status" @update:value="(data) => (status = data)" />
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
const emit = defineEmits(["updateUserData"]);
const props = defineProps(["payload", "usersList"]);

// const { $toast } = useNuxtApp();

const username = ref(props.payload?.username || "");
const password = ref("");
const role = ref("admin");
const status = ref(props.payload ? props.payload?.enabled : true);

const onRoleSelectHandler = (evt) => {
  role.value = evt.target.value;
};

const onCanselHandler = () => {
  emit("updateUserData", false);
};

const convertRoleToRolesArr = (role) => {
  switch (role) {
    case "admin":
      return ["ADMIN"];
    case "super_admin":
      return ["ADMIN", "SUPER_ADMIN"];
  }
};

const onConfirmHandler = () => {
  if (
    !props.payload &&
    (username.value.trim() === "" || password.value.trim() === "")
  ) {
    // $toast.warning(`You need to enter username and password`);
    return;
  }

  const usernamesArr = props.usersList.map((user) => user.username);

  if (!props.payload && usernamesArr.includes(username.value.trim())) {
    // $toast.warning(`User with the same name already exists`);
    return;
  }

  const rolesArr = convertRoleToRolesArr(role.value);

  emit("updateUserData", {
    username: username.value,
    password: password.value,
    role: rolesArr,
    enabled: status.value,
  });
};

onMounted(() => {
  if (props.payload?.roles.length === 2) {
    role.value = "super_admin";
  }
});
</script>
