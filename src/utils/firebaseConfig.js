import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDl0IayhtRAc3Fi_wXFN00rwsU7tQ2LmQ4",
  authDomain: "trivia-time-39268.firebaseapp.com",
  projectId: "trivia-time-39268",
  storageBucket: "trivia-time-39268.firebasestorage.app",
  messagingSenderId: "357127277144",
  appId: "1:357127277144:web:e782a938775d1da043182d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);