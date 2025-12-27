import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDqT8pehUMFOwSSdiQqDsZt0-wdE8AbQOA",
  authDomain: "ai-fitness-trainer-37e23.firebaseapp.com",
  projectId: "ai-fitness-trainer-37e23",
  storageBucket: "ai-fitness-trainer-37e23.firebasestorage.app",
  messagingSenderId: "33538115582",
  appId: "1:33538115582:web:aa2637c6d2c2c3e0dfe2af",
  measurementId: "G-843GPKDQ1B"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { auth, db, analytics };
