// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdclJdgfkgNSNhWzEt8qL4t5xyXb9LTf8",
  authDomain: "react-notes-801e2.firebaseapp.com",
  projectId: "react-notes-801e2",
  storageBucket: "react-notes-801e2.appspot.com",
  messagingSenderId: "90985240721",
  appId: "1:90985240721:web:0d0b0ba71c03d28d220730"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, 'notes')