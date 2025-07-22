<template>
  <div class="flex pt-40">
    <div
      class="m-auto flex min-w-[30%] flex-col items-center gap-4 rounded bg-white p-6 shadow-md"
    >
      <h1 class="text-xl">Metadata UI</h1>

      <div v-if="isLoggedIn" class="w-full">
        <h2 class="text-center text-lg">You are signed in</h2>
        <p class="mt-4 text-center">Redirecting...</p>
        <UiButton class="mx-auto mt-4" @click="logout"> Logout </UiButton>
      </div>

      <template v-else>
        <div class="flex w-full">
          <form class="flex flex-1 flex-col items-center gap-4">
            <h4>Sign in</h4>
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
import { useAuth } from "@/composables/useFirebaseAuth";

const { login, loginWithGoogle, isAuthenticated, logout } = useAuth();

const router = useRouter();
const appStore = useAppStore();

const firebaseLogin = ref("");
const firebasePassword = ref("");
const isFirebaseAuthMessage = ref("");

const isLoggedIn = ref(false);

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

watch(isAuthenticated, (value) => {
  isLoggedIn.value = value;
  if (value) {
    router.push({
      path: "/configs",
    });
  }
});
</script>
