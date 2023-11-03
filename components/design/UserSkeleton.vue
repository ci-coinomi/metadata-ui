<template>
  <content-loader
    viewBox="0 0 900 600"
    :speed="2"
    primary-color="#f3f3f3"
    secondary-color="#ecebeb"
  >
    <rect x="85" y="0" rx="6" ry="6" width="35" height="35" />
    <rect x="750" y="0" rx="6" ry="6" width="70" height="35" />
    <rect x="400" y="40" rx="6" ry="6" width="100" height="35" />
    <rect x="85" y="90" rx="6" ry="6" width="730" height="45" />
    <rect x="85" y="155" rx="6" ry="6" width="730" height="45" />
    <rect x="85" y="220" rx="6" ry="6" width="730" height="45" />
    <rect x="85" y="285" rx="6" ry="6" width="730" height="45" />
    <rect x="85" y="350" rx="6" ry="6" width="730" height="45" />
    <rect x="85" y="415" rx="6" ry="6" width="730" height="45" />
    <rect x="85" y="480" rx="6" ry="6" width="730" height="45" />
  </content-loader>
</template>

<script setup>
import { ContentLoader } from "vue-content-loader";
</script>
