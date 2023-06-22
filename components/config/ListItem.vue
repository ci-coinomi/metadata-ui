<template>
  <article class="flex flex-col gap-3 border-gray-400 border rounded-md p-4">
    <div class="flex gap-3 items-center">
      <p><span class="text-gray-500">Id:</span> {{ props.config.configId }}</p>
      <p>
        <span class="text-gray-500">Config name:</span>
        {{ props.config.configName }}
      </p>
      <p>
        <span class="text-gray-500">Config type:</span>
        {{ props.config.configType }}
      </p>
      <!-- ListItem is still to big to make it a link, so I made a button -->
      <uiButton class="ml-auto" @click="onNavigateClickHandler"
        >Navigate to config № {{ props.config.configId }}</uiButton
      >
    </div>
    <p class="break-words">
      <span class="text-gray-500">Config file: </span
      >{{ props.config.configFile }}
    </p>
  </article>
</template>
<script setup>
const props = defineProps({
  config: Object,
});

const router = useRouter();

const onNavigateClickHandler = () => {
  router.push({
    path: `/configs/${props.config.configId}`,
  });
};
</script>
