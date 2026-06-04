// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqUWdYSB8Hm597jnuDZB2U4QJztxZJQ20",
  authDomain: "health-tracker-e8651.firebaseapp.com",
  projectId: "health-tracker-e8651",
  storageBucket: "health-tracker-e8651.firebasestorage.app",
  messagingSenderId: "1081621764478",
  appId: "1:1081621764478:web:e538e45a35fdf9b02ffb2f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const db = getFirestore(app);
const auth = getAuth(app);

// Export instances
export { db, auth };
