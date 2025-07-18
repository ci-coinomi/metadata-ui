// plugins/firebase.client.js
import { defineNuxtPlugin } from "#app";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAppStore } from "@/stores/app";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public;
  const appStore = useAppStore();

  const app = initializeApp({
    apiKey: config.fbaseApiKey,
    authDomain: config.fbaseAuthDomain,
    projectId: config.fbaseProjectId,
    storageBucket: config.fbaseStorageBucket,
    messagingSenderId: config.fbaseMessagingSenderId,
    appId: config.fbaseAppId,
  });

  const auth = getAuth(app);

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("Logged in user: ", user);
      const idToken = await auth.currentUser.getIdToken(true);
      localStorage.setItem("firebaseToken", idToken);
      appStore.setCurrentFirebaseUser(user);
    } else {
      appStore.setCurrentFirebaseUser(null);
      localStorage.removeItem("firebaseToken");
    }
  });

  nuxtApp.provide("auth", auth);
});
