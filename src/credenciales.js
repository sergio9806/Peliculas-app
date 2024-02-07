// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCs8HFqSNRd3ynQjZdr9ou1z-B01JT3OgA",
  authDomain: "app-peliculas-ae149.firebaseapp.com",
  projectId: "app-peliculas-ae149",
  storageBucket: "app-peliculas-ae149.appspot.com",
  messagingSenderId: "302373735252",
  appId: "1:302373735252:web:48a5959b0466dda37356c1",
  measurementId: "G-3TM9VXLKTF"
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);
export default firebaseapp