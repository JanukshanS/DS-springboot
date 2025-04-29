// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const storage = getStorage(app);

// Auth functions
export const firebaseLogin = (email, password) => 
  signInWithEmailAndPassword(auth, email, password);

export const firebaseRegister = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const firebaseLogout = () => signOut(auth);

export const firebaseSendPasswordResetEmail = (email) =>
  sendPasswordResetEmail(auth, email);

export const firebaseUpdateProfile = (profile) =>
  updateProfile(auth.currentUser, profile);

export { auth, storage };
export default app;
