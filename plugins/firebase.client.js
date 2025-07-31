// plugins/firebase.client.js
import { defineNuxtPlugin } from "#app";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public;

  const app = initializeApp({
    apiKey: config.fbaseApiKey,
    authDomain: config.fbaseAuthDomain,
    projectId: config.fbaseProjectId,
    storageBucket: config.fbaseStorageBucket,
    messagingSenderId: config.fbaseMessagingSenderId,
    appId: config.fbaseAppId,
  });

  const auth = getAuth(app);

  nuxtApp.provide("auth", auth);
});
