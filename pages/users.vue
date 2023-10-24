<template>
  <main
    class="m-auto mt-3 flex flex-col items-center justify-center gap-6 rounded bg-white p-4 shadow-md"
  >
    <modalConfirm
      v-if="isConfirmModalVisible"
      :payload="confirmModalPayload"
      @is-modal-confirmed="modalConfirmHandler"
      >{{ confirmModalText }}</modalConfirm
    >

    <modalUserData
      v-if="isUserDataModalVisible"
      :payload="userDataModalPayload"
      :usersList="usersList"
      @update-user-data="updateUserDataHandler"
    />

    <userSkeleton v-if="isLoading" />
    <div v-else class="flex w-full flex-col items-center justify-center gap-2">
      <div class="flex w-full items-center justify-between">
        <p>
          <span class="text-gray-500">Total users: </span>
          <span> {{ usersList.length }}</span>
        </p>
        <uiButton class="success" @click="onAddNewUserHandler"
          >Add user</uiButton
        >
      </div>

      <userListItem
        v-for="(user, index) in usersList"
        :key="user.username"
        :user="user"
        :class="index % 2 ? 'bg-white' : 'bg-gray-100'"
        @on-update-click="onUpdateClickHandler"
        @on-delete-click="onDeleteClickHandler"
      />
    </div>
  </main>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import { addUser, deleteUser, getUsers, updateUser } from "~/api/user";

definePageMeta({
  layout: "signedin",
});

const appStore = useAppStore();
const { $toast } = useNuxtApp();

const isLoading = ref(true);
const usersList = ref([]);

const isConfirmModalVisible = ref(false);
const confirmModalText = ref("");
const confirmModalPayload = ref(null);
const confirmModalType = ref("");

const isUserDataModalVisible = ref(false);
const userDataModalType = ref("");
const userDataModalPayload = ref(null);

// Handlers

const onDeleteClickHandler = (userName) => {
  isConfirmModalVisible.value = true;
  confirmModalType.value = "DELETE";
  confirmModalText.value = `Are you sure you want to delete user ${userName}?`;
  confirmModalPayload.value = userName;
};

const onUpdateClickHandler = (user) => {
  isUserDataModalVisible.value = true;
  userDataModalType.value = "UPDATE";
  userDataModalPayload.value = user;
};

const onAddNewUserHandler = () => {
  isUserDataModalVisible.value = true;
  userDataModalType.value = "CREATE";
};

const modalConfirmHandler = (isConfirmed, payload) => {
  isConfirmModalVisible.value = false;
  if (confirmModalType.value === "DELETE" && isConfirmed) {
    deleteUserByLogin(payload);
  }
  confirmModalPayload.value = null;
  confirmModalType.value = "";
  confirmModalText.value = "";
};

const updateUserDataHandler = (data) => {
  isUserDataModalVisible.value = false;

  if (data && userDataModalType.value === "CREATE") addNewUser(data);
  if (data && userDataModalType.value === "UPDATE")
    updateExistedUser(userDataModalPayload.value.username, data);

  userDataModalPayload.value = null;
  userDataModalType.value = "";
};

// Requests

const deleteUserByLogin = async (userName) => {
  isLoading.value = true;
  const response = await deleteUser(userName);
  isLoading.value = false;

  if (response.success) {
    $toast.success("User was deleted");
    getUsersList();
  } else {
    $toast.error(`Deleting user error, status: ${response.status}`);
  }
};

const addNewUser = async ({ username, password, role, enabled }) => {
  isLoading.value = true;
  const response = await addUser(username, password, role, enabled);
  isLoading.value = false;

  if (response.success) {
    $toast.success(`User was added`);
    getUsersList();
  } else {
    $toast.error(`Adding new user error, status: ${response.status}`);
  }
};

const updateExistedUser = async (username, { role, enabled }) => {
  isLoading.value = true;
  const response = await updateUser(username, role, enabled);
  isLoading.value = false;

  if (response.success) {
    $toast.success("User was updated");
    getUsersList();
  } else {
    $toast.error(`Updating user error, status: ${response.status}`);
  }
};

const getUsersList = async () => {
  isLoading.value = true;
  const response = await getUsers();
  if (response.success) {
    usersList.value = response.data;
  } else {
    $toast.error(`Fetching user error, status: ${response.status}`);
  }
  isLoading.value = false;
};

onMounted(() => {
  appStore.setHeaderTitle("Users");
  getUsersList();
});
</script>
