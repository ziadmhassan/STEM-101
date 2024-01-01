// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3hhett5CepIb3-tYKjrgylV-jCKmyM0c",
  authDomain: "stem-101.firebaseapp.com",
  projectId: "stem-101",
  storageBucket: "stem-101.appspot.com",
  messagingSenderId: "424947454803",
  appId: "1:424947454803:web:50a1d293473bbb48cf07a6",
  measurementId: "G-35YJVSRQY7"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
//print('Firebase Authentication Initialized');
const auth = getAuth(app);

// Initialize Firebase Authentication Providers
const googleprovider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const database = getDatabase(app);

export { auth, googleprovider, githubProvider, database };
