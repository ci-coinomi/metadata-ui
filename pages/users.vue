<template>
  <main
    class="flex flex-col justify-center items-center gap-6 w-3/4 m-auto bg-white p-4 shadow-md mt-3 rounded"
  >
    <ConfirmModal
      v-if="isConfirmModalVisible"
      :type="confirmModalType"
      :payload="confirmModalPayload"
      @is-modal-confirmed="modalConfirmHandler"
      >{{ confirmModalText }}</ConfirmModal
    >

    <UserAddNewModal
      v-if="isAddNewModalVisible"
      @add-new-user="addNewModalHandler"
    />

    <userSkeleton v-if="isLoading" class="w-[75vw]" />
    <div v-else class="flex flex-col justify-center items-center gap-6 w-4/5">
      <div class="flex justify-between w-full items-center">
        <UiButton @click="onConfigsNavigateHandler">To configs</UiButton>
        <h2>Your role is {{ userRole }}</h2>
        <div>
          <uiButton @click="onAddNewUserHandler">Add user</uiButton>
        </div>
      </div>
      <p><span class="text-gray-500">Total user count: </span>4</p>

      <userListItem
        v-for="user in usersArr"
        :key="user.name"
        :user="user"
        @on-delete-click="onDeleteClickHandler"
      />
    </div>
  </main>
</template>
<script setup>
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import { useStore } from "~/store";
import { addUser, deleteUser } from "~/api/user";

definePageMeta({
  layout: "signedin",
});

const store = useStore();
const router = useRouter();
const toast = useToast();

const isLoading = ref(true);

const isConfirmModalVisible = ref(false);
const confirmModalText = ref("");
const confirmModalPayload = ref(null);
const confirmModalType = ref("");

const isAddNewModalVisible = ref(false);

const userRole = computed(() => store.userRole);

// temporarily, while we have no getAllUsers route
const usersArr = [
  { name: "Name 1", role: "ADMIN" },
  { name: "Name 2222", role: "SUPER_ADMIN" },
  { name: "Name 3", role: "ADMIN" },
];

const onConfigsNavigateHandler = () => {
  router.push({
    path: `/configs`,
  });
};

const onDeleteClickHandler = (userName) => {
  isConfirmModalVisible.value = true;
  confirmModalType.value = "delete";
  confirmModalText.value = `Are you sure you want to delete user ${userName}?`;
  confirmModalPayload.value = userName;
};

const onAddNewUserHandler = () => {
  isAddNewModalVisible.value = true;
};

const modalConfirmHandler = (type, isConfirmed, payload) => {
  isConfirmModalVisible.value = false;
  if (type === "delete" && isConfirmed) {
    deleteUserByLogin(payload);
  }
  confirmModalPayload.value = null;
  confirmModalType.value = "";
  confirmModalText.value = "";
};

const addNewModalHandler = (data) => {
  isAddNewModalVisible.value = false;
  if (!data) return;
  addNewUser(data);
};

const deleteUserByLogin = async (userName) => {
  isLoading.value = true;
  const response = await deleteUser(userName);
  isLoading.value = false;

  if (response === 204) {
    toast.open({
      message: "User was deleted",
      type: "success",
    });
  } else {
    toast.open({
      message: "Something went wrong :(",
      type: "error",
    });
  }
};

const addNewUser = async ({ username, password, role }) => {
  isLoading.value = true;
  const response = await addUser(username, password, role);
  isLoading.value = false;

  if (response === 201) {
    toast.open({
      message: "User was added",
      type: "success",
    });
  } else {
    toast.open({
      message: "Something went wrong :(",
      type: "error",
    });
  }
};

onMounted(() => {
  isLoading.value = true;
  store.setHeaderTitle(`Users`);
  isLoading.value = false;
});
</script>
