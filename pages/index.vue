<template>
  <div class="flex pt-40">
    <div
      class="flex p-5 flex-col gap-4 items-center border-gray-400 border m-auto rounded-md"
    >
      <h1 class="text-xl">Metadata UI</h1>
      <h2>Sign in</h2>
      <form class="flex flex-col items-center gap-4">
        <uiInputField v-model="loginData" placeholder="Login" :type="'text'" />
        <uiInputField
          v-model="passwordData"
          placeholder="Password"
          :type="'password'"
        />
        <p v-if="isAuthMessage" class="text-xs text-[#f93e3e]">
          {{ isAuthMessage }}
        </p>
        <uiButton @click.prevent="formSubmitHandler">Submit</uiButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { signin } from "~/api/user";

const router = useRouter();

const loginData = ref("");
const passwordData = ref("");
const isAuthMessage = ref("");

const formSubmitHandler = async () => {
  isAuthMessage.value = "";

  if (loginData.value && passwordData.value) {
    const res = await signin(loginData.value, passwordData.value);

    if (res === 403) {
      isAuthMessage.value = "User login or password is incorrect";
      return;
    }

    if (res === 204) {
      router.push({
        path: `/configs`,
      });
      return;
    }

    loginData.value = "";
    passwordData.value = "";
  } else {
    isAuthMessage.value = "Login and password required";
  }
};
</script>
