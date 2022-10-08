import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgPC8sIaIiGSRzMEoYQk-5UruvLeLBE0Q",
  authDomain: "real-estate-v2-25ec1.firebaseapp.com",
  projectId: "real-estate-v2-25ec1",
  storageBucket: "real-estate-v2-25ec1.appspot.com",
  messagingSenderId: "131264269159",
  appId: "1:131264269159:web:dc3036cc946e5c4dc3fdc2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

export { auth, db, storage }