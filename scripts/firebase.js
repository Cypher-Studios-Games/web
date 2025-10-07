// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXJeSRZuW0MLi_sXBVf6-9y2bagajBQLY",
  authDomain: "cypher-studios.firebaseapp.com",
  projectId: "cypher-studios",
  storageBucket: "cypher-studios.firebasestorage.app",
  messagingSenderId: "116440213951",
  appId: "1:116440213951:web:9ccb11997ef15dab34d90a",
  measurementId: "G-EL8PCF4ZP2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);

// Export all items you need
export { app, auth, db, ref, set, get, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };