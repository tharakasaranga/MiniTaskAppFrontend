// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTrBK40kzYKhc1LcklMAGnGSR3ZOf6AS4",
  authDomain: "mini-task-app-a28d4.firebaseapp.com",
  projectId: "mini-task-app-a28d4",
  storageBucket: "mini-task-app-a28d4.firebasestorage.app",
  messagingSenderId: "601926732483",
  appId: "1:601926732483:web:d75d079e0de862bf38b076"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);