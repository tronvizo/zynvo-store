import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBW95aReTlXIz4r34vFhEAFeyCDKMae4wc",
  authDomain: "zynvo-1.firebaseapp.com",
  projectId: "zynvo-1",
  storageBucket: "zynvo-1.firebasestorage.app",
  messagingSenderId: "1074997502273",
  appId: "1:1074997502273:web:d8b4e5bc75a4b648fc41c0",
  measurementId: "G-3NWN12WHC2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
