// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTQp3GBm2TdPhEvaTkGd8GapowhLPLKvs",
  authDomain: "pokershark-9c39e.firebaseapp.com",
  projectId: "pokershark-9c39e",
  storageBucket: "pokershark-9c39e.firebasestorage.app",
  messagingSenderId: "322112649753",
  appId: "1:322112649753:web:42131c9f99dc99eed80888",
  measurementId: "G-DXR93CH8HS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
