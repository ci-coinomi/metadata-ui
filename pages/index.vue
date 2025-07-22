<template>
  <div class="flex pt-40">
    <div
      class="m-auto flex min-w-[50%] flex-col items-center gap-4 rounded bg-white p-6 shadow-md"
    >
      <h1 class="text-xl">Metadata UI</h1>

      <div v-if="isLoggedIn" class="w-full">
        <h2 class="text-center text-lg">You are signed in</h2>
        <p class="mt-4 text-center">Redirecting...</p>
      </div>

      <template v-else>
        <div class="flex w-full gap-8">
          <form class="flex flex-1 flex-col items-center gap-4">
            <h2 class="text-center">Sign in (old)</h2>
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

          <form class="flex flex-1 flex-col items-center gap-4">
            <h4>Sign in (firebase)</h4>
            <UiInputField
              v-model="firebaseLogin"
              placeholder="Login"
              :type="'text'"
            />
            <UiInputField
              v-model="firebasePassword"
              placeholder="Password"
              :type="'password'"
            />

            <div class="flex gap-2">
              <UiButton @click.prevent="firebaseFormSubmitHandler">
                Submit
              </UiButton>
              <UiButton @click.prevent="onGoogle">Access via Google</UiButton>
            </div>

            <p v-if="isFirebaseAuthMessage" class="text-xs text-[#f93e3e]">
              {{ isFirebaseAuthMessage }}
            </p>
          </form>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { signin, getLoginMe } from "@/api/user";
import { useAuth } from "@/composables/useFirebaseAuth";

const { login, loginWithGoogle } = useAuth();

const router = useRouter();
const appStore = useAppStore();

const loginData = ref("");
const passwordData = ref("");
const isAuthMessage = ref("");

const firebaseLogin = ref("");
const firebasePassword = ref("");
const isFirebaseAuthMessage = ref("");

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

const firebaseFormSubmitHandler = async () => {
  appStore.setCurrentUser(null);
  isFirebaseAuthMessage.value = "";
  try {
    const response = await login(firebaseLogin.value, firebasePassword.value);
    if (response.user) {
      router.push({
        path: `/configs`,
      });
    }
  } catch (e) {
    console.error(e);
    isFirebaseAuthMessage.value = e.message;
  }
};

const onGoogle = async () => {
  isFirebaseAuthMessage.value = "";
  try {
    const response = await loginWithGoogle();
    if (response.user) {
      router.push({
        path: `/configs`,
      });
    }
  } catch (e) {
    isFirebaseAuthMessage.value = e.message;
  }
};

onMounted(async () => {
  const response = await getLoginMe();
  if (response.success) {
    isLoggedIn.value = true;
    router.push({
      path: "/configs",
    });
  }
});
</script>
