<template>
  <content-loader
    viewBox="0 0 838 300"
    :speed="2"
    primary-color="#f3f3f3"
    secondary-color="#ecebeb"
    :unique-key="'banner-skeleton'"
  >
    <rect x="300" y="0" rx="6" ry="6" width="200" height="35" />
    <rect x="650" y="45" rx="6" ry="6" width="150" height="250" />
    <rect x="30" y="45" rx="6" ry="6" width="600" height="35" />
    <rect x="30" y="90" rx="6" ry="6" width="600" height="35" />
    <rect x="30" y="135" rx="6" ry="6" width="600" height="35" />
    <rect x="30" y="180" rx="6" ry="6" width="600" height="35" />
    <rect x="30" y="225" rx="6" ry="6" width="600" height="35" />
  </content-loader>
</template>

<script setup>
import { ContentLoader } from "vue-content-loader";
</script>
