// firebase.js
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBHcvJ2yTUVQaQyDtMa-pfqkw1jS1TSe_s",
  authDomain: "reddit-auth-27.firebaseapp.com",
  projectId: "reddit-auth-27",
  storageBucket: "reddit-auth-27.firebasestorage.app",
  messagingSenderId: "651001079850",
  appId: "1:651001079850:web:f8cf9f98b0786c9d02fb53",
  measurementId: "G-HZ00EGW74V"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()