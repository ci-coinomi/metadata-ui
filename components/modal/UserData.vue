<template>
  <div
    class="popup fixed inset-0 z-30 flex items-center justify-center bg-[#0D0D0D]/[.9]"
  >
    <div class="flex flex-col gap-6 rounded-md bg-white p-10">
      <h2 v-if="selectedUser" class="text-center text-lg font-bold">
        <span class="text-gray-500">Editing user: </span>
        {{ selectedUser?.username }}
      </h2>

      <h2 v-else class="text-center text-lg font-bold">Create user</h2>

      <template v-if="!selectedUser">
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
      </template>

      <div class="flex flex-col gap-1">
        <label for="role-select" class="text-center text-sm text-gray-500">
          Choose role:
        </label>
        <select
          id="role-select"
          v-model="role"
          class="rounded-md p-1"
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

      <div class="flex justify-between gap-4">
        <UiButton class="danger w-2/5" @click="onCanselHandler">
          Cancel
        </UiButton>
        <UiButton class="success w-2/5" @click="onConfirmHandler">
          Confirm
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $toast } = useNuxtApp();
const emit = defineEmits(["modalHandler"]);

const props = defineProps({
  selectedUser: Object,
  usersList: Array,
});

const username = ref(props.selectedUser?.username || "");
const password = ref("");
const role = ref("admin");
const status = ref(props.selectedUser ? props.selectedUser?.enabled : true);

const onRoleSelectHandler = (evt) => {
  role.value = evt.target.value;
};

const onCanselHandler = () => {
  emit("modalHandler", false);
};

/**
 * Roles is response - array of strings. For superadmin access user needs to have 2 values in array, ["ADMIN", "SUPER_ADMIN"].
 */
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
    !props.selectedUser &&
    (username.value.trim() === "" || password.value.trim() === "")
  ) {
    $toast.warning(`You need to enter username and password`);
    return;
  }

  const usernamesArr = props.usersList.map((user) => user.username);

  if (!props.selectedUser && usernamesArr.includes(username.value.trim())) {
    $toast.warning(`User with the same name already exists`);
    return;
  }

  const rolesArr = convertRoleToRolesArr(role.value);

  emit("modalHandler", {
    username: username.value,
    password: password.value,
    role: rolesArr,
    enabled: status.value,
  });
};

onMounted(() => {
  if (props.selectedUser?.roles.length === 2) {
    role.value = "super_admin";
  }
});
</script>
