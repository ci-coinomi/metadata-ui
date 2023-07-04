<template>
  <main
    class="flex flex-col justify-center items-center gap-6 w-3/4 m-auto bg-white p-4 shadow-md mt-3 rounded"
  >
    <ConfirmModal
      v-if="isConfirmModalVisible"
      :payload="confirmModalPayload"
      @is-modal-confirmed="modalConfirmHandler"
      >{{ confirmModalText }}</ConfirmModal
    >

    <userDataModal
      v-if="isUserDataModalVisible"
      :payload="userDataModalPayload"
      :usersList="usersList"
      @update-user-data="updateUserDataHandler"
    />

    <userSkeleton v-if="isLoading" class="w-[75vw]" />
    <div v-else class="flex flex-col justify-center items-center gap-6 w-4/5">
      <div class="flex justify-between w-full items-center">
        <UiButton @click="onConfigsNavigateHandler">
          <img
            src="~/assets/icons/icon-return.svg"
            class="w-4 h-4"
            alt="logout"
          />
        </UiButton>
        <div>
          <uiButton class="success" @click="onAddNewUserHandler"
            >Add user</uiButton
          >
        </div>
      </div>
      <p>
        <span class="text-gray-500">Total users: </span>{{ usersList.length }}
      </p>

      <userListItem
        v-for="user in usersList"
        :key="user.username"
        :user="user"
        @on-update-click="onUpdateClickHandler"
        @on-delete-click="onDeleteClickHandler"
      />
    </div>
  </main>
</template>
<script setup>
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import { useStore } from "~/store";
import { addUser, deleteUser, getUsers, updateUser } from "~/api/user";

definePageMeta({
  layout: "signedin",
});

const store = useStore();
const router = useRouter();
const toast = useToast();

const isLoading = ref(true);
const usersList = ref([]);

const isConfirmModalVisible = ref(false);
const confirmModalText = ref("");
const confirmModalPayload = ref(null);
const confirmModalType = ref("");

const isUserDataModalVisible = ref(false);
const userDataModalType = ref("");
const userDataModalPayload = ref(null);

const onConfigsNavigateHandler = () => {
  router.push({
    path: `/configs`,
  });
};

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

// Fetching functions
const deleteUserByLogin = async (userName) => {
  isLoading.value = true;
  const response = await deleteUser(userName);
  isLoading.value = false;

  if (response === 204) {
    toast.open({
      message: "User was deleted",
      type: "success",
    });
    getUsersList();
  } else {
    toast.open({
      message: `Deleting user error, status: ${response}`,
      type: "error",
    });
  }
};

const addNewUser = async ({ username, password, role, enabled }) => {
  isLoading.value = true;
  const response = await addUser(username, password, role, enabled);
  isLoading.value = false;

  if (response === 201) {
    toast.open({
      message: "User was added",
      type: "success",
    });
    getUsersList();
  } else {
    toast.open({
      message: `Adding new user error, status: ${response}`,
      type: "error",
    });
  }
};

const updateExistedUser = async (username, { role, enabled }) => {
  isLoading.value = true;
  const response = await updateUser(username, role, enabled);
  isLoading.value = false;

  if (response === 200) {
    toast.open({
      message: "User was updated",
      type: "success",
    });
    getUsersList();
  } else {
    toast.open({
      message: `Updating user error, status: ${response}`,
      type: "error",
    });
  }
};

const getUsersList = async () => {
  isLoading.value = true;
  const response = await getUsers();
  if (response && Array.isArray(response)) {
    usersList.value = response;
  } else {
    toast.open({
      message: `Fetching users error, status: ${response}`,
      type: "error",
    });
  }
  isLoading.value = false;
};

onMounted(() => {
  store.setHeaderTitle(`Users`);
  getUsersList();
});
</script>
