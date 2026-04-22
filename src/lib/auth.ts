import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";


import { auth } from "@/firebase/config";

export const registerUser = async (email: string, password: string) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  
  return userCred.user;
};

export const loginUser = async (email: string, password: string) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};