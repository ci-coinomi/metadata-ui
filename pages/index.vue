<template>
  <div class="flex pt-40">
    <div
      class="m-auto flex flex-col items-center gap-4 rounded bg-white p-6 shadow-md"
    >
      <h1 class="text-xl">Metadata UI</h1>

      <div v-if="isLoggedIn" class="w-[300px]">
        <h2 class="text-center">You are signed in</h2>

        <div class="mt-4 flex justify-between gap-4">
          <UiButton class="danger flex-1" @click="onLogoutHandler">
            Sign out
          </UiButton>
          <UiButton class="success flex-1" @click="toConfigsNavigateHandler">
            To configs
          </UiButton>
        </div>
      </div>

      <template v-else>
        <h2 class="text-center">Sign in</h2>

        <form class="flex flex-col items-center gap-4">
          <UiInputField
            v-model="loginData"
            placeholder="Login"
            :type="'text'"
          />
          <UiInputField
            v-model="passwordData"
            placeholder="Password"
            :type="'password'"
          />
          <p v-if="isAuthMessage" class="text-xs text-[#f93e3e]">
            {{ isAuthMessage }}
          </p>
          <UiButton @click.prevent="formSubmitHandler"> Submit </UiButton>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { signin, signout, getLoginMe } from "@/api/user";

const router = useRouter();
const appStore = useAppStore();
const { $toast } = useNuxtApp();

const loginData = ref("");
const passwordData = ref("");
const isAuthMessage = ref("");
const isLoggedIn = ref(false);

const formSubmitHandler = async () => {
  appStore.setCurrentUser(null);
  isAuthMessage.value = "";

  if (loginData.value && passwordData.value) {
    const response = await signin(loginData.value, passwordData.value);

    if (response.success) {
      router.push({
        path: `/configs`,
      });
      return;
    }

    if (response.status === 403) {
      isAuthMessage.value = "User login or password is incorrect";
    } else {
      isAuthMessage.value = response.status;
    }
  } else {
    isAuthMessage.value = "Login and password required";
  }
};

const onLogoutHandler = async () => {
  const response = await signout();
  if (!response.success) {
    $toast.error(`Logout request error, status: ${response.status}`);
    return;
  }

  router.push({
    path: `/`,
  });
  isLoggedIn.value = false;
  appStore.setCurrentUser(null);
};

const toConfigsNavigateHandler = () => {
  router.push({
    path: `/configs`,
  });
};

onMounted(async () => {
  const response = await getLoginMe();
  if (response.success) isLoggedIn.value = true;
});
</script>
