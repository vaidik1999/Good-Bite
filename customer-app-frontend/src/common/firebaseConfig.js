// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// My web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMXP3EqiPQEP6f91mMekTuiBTp-Uw6baE",
  authDomain: "csci5410-serverless-auth.firebaseapp.com",
  projectId: "csci5410-serverless-auth",
  storageBucket: "csci5410-serverless-auth.appspot.com",
  messagingSenderId: "730546813238",
  appId: "1:730546813238:web:ecdc9f5ebc38cd75ea1b97",
  measurementId: "G-T2N4SB22NB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);