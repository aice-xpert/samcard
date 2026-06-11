import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCfQbVWDuGu15F1irW3aWlbg-EAxZawjUA",
  authDomain: "samcard-9535d.firebaseapp.com",
  projectId: "samcard-9535d",
  storageBucket: "samcard-9535d.firebasestorage.app",
  messagingSenderId: "359308262005",
  appId: "1:359308262005:web:2f8674c2ffa450d8fc163c",
  measurementId: "G-XPW11SRJW5"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) getAnalytics(app);
  });
}

export default app;