<template>
  <article
    class="flex gap-3 items-center ring-1 ring-inset ring-gray-400 rounded-md p-2"
  >
    <p>
      <span class="text-gray-500">Config name:</span>
      {{ props.config.configName }}
    </p>
    <p>
      <span class="text-gray-500">Config type:</span>
      {{ props.config.configType }}
    </p>
  </article>
</template>
<script setup>
const props = defineProps({
  config: Object,
});
</script>
