import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAWXGQj5aj8utKxcE4PeieSSUTX0PXy8OE",
  authDomain: "samcard-auth.firebaseapp.com",
  projectId: "samcard-auth",
  storageBucket: "samcard-auth.firebasestorage.app",
  messagingSenderId: "835314555020",
  appId: "1:835314555020:web:898ac23f7b12ac57e6c3a9",
  measurementId: "G-4MTEQ8ZFW3"
};

// Initialize Firebase (Check if already initialized)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);

// Analytics only runs in the browser
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) getAnalytics(app);
  });
}

export default app;