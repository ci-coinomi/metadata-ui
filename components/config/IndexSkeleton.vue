<template>
  <content-loader
    viewBox="0 0 1024 400"
    :speed="2"
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="350" y="0" rx="6" ry="6" width="300" height="27" />
    <rect x="300" y="56" rx="6" ry="6" width="400" height="27" />
    <rect x="55" y="112" rx="6" ry="6" width="924" height="40" />
    <rect x="55" y="168" rx="6" ry="6" width="924" height="40" />
    <rect x="55" y="224" rx="6" ry="6" width="924" height="40" />
    <rect x="55" y="280" rx="6" ry="6" width="924" height="40" />
    <rect x="55" y="336" rx="6" ry="6" width="924" height="40" />
    <rect x="55" y="392" rx="6" ry="6" width="924" height="40" />
    <rect x="55" y="448" rx="6" ry="6" width="924" height="40" />
  </content-loader>
</template>

<script setup>
import { ContentLoader } from "vue-content-loader";
</script>
