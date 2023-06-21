<template>
  <div class="max-w-[1440px] m-auto pt-40">
    <div
      class="flex flex-col gap-4 items-center w-2/3 md:w-1/2 xl:w-1/3 p-4 border-gray-500 border m-auto"
    >
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
const event = useRequestEvent();

const loginData = ref("");
const passwordData = ref("");
const isAuthMessage = ref("");

const formSubmitHandler = async () => {
  isAuthMessage.value = "";

  if (loginData.value && passwordData.value) {
    const res = await signin(loginData.value, passwordData.value);
    console.log(res);
    // const res = await fetchWithCookie(
    //   event,
    //   loginData.value,
    //   passwordData.value
    // );
    // console.log("Res in index", res);
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
