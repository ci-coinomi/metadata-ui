import {
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { useNuxtApp } from "#app";
import { storeToRefs } from "pinia";

import { useAppStore } from "@/stores/app";

export function useAuth() {
  const { $auth } = useNuxtApp();
  const appStore = useAppStore();

  const { currentFirebaseUser, currentUserToken } = storeToRefs(appStore);

  const login = (email, password) => {
    return signInWithEmailAndPassword($auth, email, password);
  };

  const logout = () => {
    appStore.setCurrentUserToken(null);
    appStore.setCurrentFirebaseUser(null);
    return signOut($auth);
  };

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup($auth, provider);
  };

  const fetchCurrentUser = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        $auth,
        async (user) => {
          if (user) {
            if (!currentUserToken.value) {
              const idToken = await user.getIdToken(true);
              appStore.setCurrentUserToken(idToken);
            }
            appStore.setCurrentFirebaseUser(user);
          }
          unsubscribe();
          resolve(user);
        },
        (error) => {
          unsubscribe();
          reject(error);
          appStore.setCurrentUserToken(null);
          appStore.setCurrentFirebaseUser(null);
        },
      );
    });
  };

  const isAuthenticated = computed(() => currentFirebaseUser.value);

  return {
    login,
    logout,
    loginWithGoogle,
    isAuthenticated,
    fetchCurrentUser,
    currentFirebaseUser,
    currentUserToken,
  };
}
