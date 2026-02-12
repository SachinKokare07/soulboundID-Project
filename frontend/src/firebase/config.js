// Firebase configuration
// Photos stored in localStorage - No Firebase Storage needed!

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6EowYigjUSKt3effsKfb8ZXcIy7OET1o",
  authDomain: "soulboundid.firebaseapp.com",
  projectId: "soulboundid",
  storageBucket: "soulboundid.firebasestorage.app",
  messagingSenderId: "259586754044",
  appId: "1:259586754044:web:6d42c4909eb64858a9de79",
  measurementId: "G-MFQ2TWE8TX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
