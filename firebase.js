// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyAQzSddh44Do-YwE_erM_T0BciQ4Zm5y0U",
  authDomain: "exam-final-1a502.firebaseapp.com",
  projectId: "exam-final-1a502",
  storageBucket: "exam-final-1a502.firebasestorage.app",
  messagingSenderId: "672664526332",
  appId: "1:672664526332:web:a570fa744ed9fc9d5fe679",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
setPersistence(auth, browserLocalPersistence);
