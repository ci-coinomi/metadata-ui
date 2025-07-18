import {
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNuxtApp } from "#app";

export function useAuth() {
  const { $auth } = useNuxtApp();

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

  return { login, logout, loginWithGoogle };
}
