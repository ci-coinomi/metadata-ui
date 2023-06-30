<template>
  <content-loader
    viewBox="0 0 880 350"
    :speed="2"
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="30" y="0" rx="6" ry="6" width="50" height="30" />
    <rect x="350" y="0" rx="6" ry="6" width="150" height="30" />
    <rect x="800" y="0" rx="6" ry="6" width="50" height="30" />

    <rect x="40" y="50" rx="6" ry="6" width="250" height="300" />
    <rect x="310" y="50" rx="6" ry="6" width="250" height="300" />
    <rect x="580" y="50" rx="6" ry="6" width="250" height="300" />
  </content-loader>
</template>

<script setup>
import { ContentLoader } from "vue-content-loader";
</script>
