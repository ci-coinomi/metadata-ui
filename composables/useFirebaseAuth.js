import {
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { useNuxtApp } from "#app";
import { useAppStore } from "@/stores/app";

export function useAuth() {
  const { $auth } = useNuxtApp();
  const appStore = useAppStore();

  const user = ref(null);

  const login = (email, password) => {
    return signInWithEmailAndPassword($auth, email, password);
  };

  const logout = () => {
    return signOut($auth);
  };

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup($auth, provider);
  };

  onMounted(() => {
    onAuthStateChanged($auth, async (u) => {
      console.info("user", u);
      user.value = u;

      if (u) {
        const idToken = await u.getIdToken(true);
        localStorage.setItem("firebaseToken", idToken);
        appStore.setCurrentFirebaseUser(u);
      } else {
        localStorage.removeItem("firebaseToken");
        appStore.setCurrentFirebaseUser(null);
      }
    });
  });

  const isAuthenticated = computed(() => user.value);

  return { login, logout, loginWithGoogle, isAuthenticated };
}
