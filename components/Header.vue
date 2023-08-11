<template>
  <header class="bg-white px-4 pt-4 pb-4 w-full shadow-md">
    <div class="flex justify-between max-w-[1400px] m-auto">
      <div
        class="flex gap-2 items-center cursor-pointer"
        @click="onConfigsNavigateHandler"
      >
        <img
          src="~/assets/images/euclabs-logo.png"
          class="w-7 h-7"
          alt="users"
        />
        <h2 class="flex items-center">Metadata UI</h2>
      </div>
      <h1 class="flex items-center text-2xl font-bold">{{ headerTitle }}</h1>
      <div class="flex gap-4">
        <UiButton
          v-if="route.name !== 'configs'"
          @click="onConfigsNavigateHandler"
        >
          Configs
        </UiButton>
        <UiButton
          v-if="route.name !== 'questions'"
          @click="onFaqNavigateHandler"
        >
          <img src="~/assets/icons/icon-faq.svg" class="w-4 h-4" alt="users" />
        </UiButton>
        <ClientOnly>
          <UiButton
            v-if="isSuperAdmin && route.name !== 'users'"
            @click="onUsersNavigateHandler"
          >
            <img
              src="~/assets/icons/icon-users.svg"
              class="w-4 h-4"
              alt="users"
            />
          </UiButton>
        </ClientOnly>
        <UiButton @click="onLogoutHandler">
          <img
            src="~/assets/icons/icon-logout.svg"
            class="w-4 h-4"
            alt="logout"
          />
        </UiButton>
      </div>
    </div>
  </header>
</template>
<script setup>
import { signout } from "~/api/user";
import { useStore } from "~/store";

const router = useRouter();
const route = useRoute();
const store = useStore();
const { $toast } = useNuxtApp();

const headerTitle = computed(() => store.headerTitle);
const isSuperAdmin = computed(() =>
  store.currentUser?.roles?.includes("ROLE_SUPER_ADMIN"),
);

const onConfigsNavigateHandler = () => {
  router.push({
    path: `/configs`,
  });
};

const onFaqNavigateHandler = () => {
  router.push({
    path: `/questions`,
  });
};

const onLogoutHandler = async () => {
  const response = await signout();
  if (response !== 204) {
    $toast.error(`Logout request error, status: ${response}`);
  }
  router.push({
    path: `/`,
  });
};

const onUsersNavigateHandler = () => {
  router.push({
    path: `/users`,
  });
};
</script>
