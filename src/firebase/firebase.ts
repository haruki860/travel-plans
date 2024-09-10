// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCTJIyQAlC36CW6N5bO7tXc4TsIkifBpgg",
  authDomain: "travel-plans-45042.firebaseapp.com",
  projectId: "travel-plans-45042",
  storageBucket: "travel-plans-45042.appspot.com",
  messagingSenderId: "642848846007",
  appId: "1:642848846007:web:21b105ff64e012ccea1d32",
  measurementId: "G-C45KMRRFJN"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
