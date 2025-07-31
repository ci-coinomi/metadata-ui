<template>
  <content-loader
    viewBox="0 0 900 600"
    :speed="2"
    primary-color="#f3f3f3"
    secondary-color="#ecebeb"
    :unique-key="'coinapi-skeleton'"
  >
    <rect x="85" y="0" rx="6" ry="6" width="730" height="100" />
    <rect x="85" y="124" rx="6" ry="6" width="730" height="100" />
    <rect x="85" y="248" rx="6" ry="6" width="730" height="100" />
    <rect x="85" y="372" rx="6" ry="6" width="730" height="100" />
    <rect x="85" y="496" rx="6" ry="6" width="730" height="100" />
    <rect x="85" y="620" rx="6" ry="6" width="730" height="100" />
    <rect x="85" y="744" rx="6" ry="6" width="730" height="100" />
  </content-loader>
</template>

<script setup>
import { ContentLoader } from "vue-content-loader";
</script>
