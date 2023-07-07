<template>
  <header class="bg-white px-4 pt-4 pb-4 w-full shadow-md">
    <div class="flex justify-between max-w-[1400px] m-auto">
      <h2 class="flex items-center">Metadata UI</h2>
      <h1 class="flex items-center text-2xl font-bold">{{ headerTitle }}</h1>
      <div class="flex gap-4">
        <UiButton @click="onFaqNavigateHandler">
          <img
            v-if="headerTitle === 'FAQ'"
            src="~/assets/icons/icon-return.svg"
            class="w-4 h-4"
            alt="users"
          />
          <img
            v-else
            src="~/assets/icons/icon-faq.svg"
            class="w-4 h-4"
            alt="users"
          />
        </UiButton>
        <ClientOnly>
          <UiButton v-if="isSuperAdmin" @click="onUsersNavigateHandler">
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
const store = useStore();
const { $toast } = useNuxtApp();

const headerTitle = computed(() => store.headerTitle);
const isSuperAdmin = computed(() =>
  store.currentUser?.roles?.includes("ROLE_SUPER_ADMIN")
);

const onFaqNavigateHandler = () => {
  if (headerTitle.value === "FAQ") {
    router.push({
      path: `/configs`,
    });
  } else {
    router.push({
      path: `/questions`,
    });
  }
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
