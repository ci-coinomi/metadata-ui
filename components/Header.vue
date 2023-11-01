<template>
  <header class="w-full bg-white px-4 pb-4 pt-4 shadow-md">
    <div class="m-auto flex max-w-[1400px] justify-between">
      <div
        class="flex cursor-pointer items-center gap-2"
        @click="onConfigsNavigateHandler"
      >
        <img
          src="~/assets/images/euclabs-logo.png"
          class="h-7 w-7"
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
          v-if="route.name !== 'coinapi-status'"
          @click="onCoinApiStatusNavigateHandler"
        >
          Coinapi Status
        </UiButton>
        <UiButton
          v-if="route.name !== 'questions'"
          @click="onFaqNavigateHandler"
        >
          <img src="~/assets/icons/icon-faq.svg" class="h-4 w-4" alt="users" />
        </UiButton>
        <ClientOnly>
          <UiButton
            v-if="isSuperAdmin && route.name !== 'users'"
            @click="onUsersNavigateHandler"
          >
            <img
              src="~/assets/icons/icon-users.svg"
              class="h-4 w-4"
              alt="users"
            />
          </UiButton>
        </ClientOnly>
        <UiButton @click="onLogoutHandler">
          <img
            src="~/assets/icons/icon-logout.svg"
            class="h-4 w-4"
            alt="logout"
          />
        </UiButton>
      </div>
    </div>
  </header>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { signout } from "~/api/user";
import { useAppStore } from "@/stores/app";

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const { $toast } = useNuxtApp();

const { headerTitle, isSuperAdmin } = storeToRefs(appStore);

const onConfigsNavigateHandler = () => {
  appStore.setHeaderTitle("Select config type");
  router.push({
    path: `/configs`,
  });
};

const onFaqNavigateHandler = () => {
  router.push({
    path: `/questions`,
  });
};

const onCoinApiStatusNavigateHandler = () => {
  router.push({
    path: `/coinapi-status`,
  });
};

const onLogoutHandler = async () => {
  const response = await signout();
  if (!response.success) {
    $toast.error(`Logout request error, status: ${response.status}`);
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
