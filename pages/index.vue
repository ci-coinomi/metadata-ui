<template>
  <div class="flex pt-40">
    <div
      class="m-auto flex flex-col items-center gap-4 rounded bg-white p-6 shadow-md"
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
import { useAppStore } from "@/stores/app";
import { signin } from "~/api/user";

const router = useRouter();
const appStore = useAppStore();

const loginData = ref("");
const passwordData = ref("");
const isAuthMessage = ref("");

const formSubmitHandler = async () => {
  appStore.setCurrentUser(null);
  isAuthMessage.value = "";

  if (loginData.value && passwordData.value) {
    /* 
      Если пользователь вернулся назад на страницу авторизации в рамках старой сессии без signout то при попытке ввести
      логин и пароль сервер вернет 403, а не перезапишет токен. Код ошибки идентичен неверному логину/паролю, так что я не 
      могу ни проверить наличие токена из-за http-only, ни редиректнуть его на config, обработав уникальный для этой 
      ситуации статус.
      
      Так что приходится в качестве временного решения всегда вызывать signout, пусть она и будет вызывать ошибку, если
      токена авторизации нет и мы пытаемся войти впервые.
    */

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
    if (res === "Cors Error") {
      isAuthMessage.value = "CORS Error";
      return;
    }

    loginData.value = "";
    passwordData.value = "";
  } else {
    isAuthMessage.value = "Login and password required";
  }
};
</script>
