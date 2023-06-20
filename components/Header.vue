<template>
  <div class="flex justify-between pt-5">
    <h1>Admin panel</h1>
    <div class="flex gap-4">
      <UiButton @click="onReturnHandler">Return</UiButton>
      <UiButton @click="onLogoutHandler">Sign Out (req not working)</UiButton>
    </div>
  </div>
</template>
<script setup>
import { logout } from "~/api/user";

const router = useRouter();

const onLogoutHandler = async () => {
  // Returns 401 for now, so I just console this status
  const res = await logout();
  console.log(res);
};

const onReturnHandler = () => {
  router.push({
    path: `/`,
  });
};
</script>
