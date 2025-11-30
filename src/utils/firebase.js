import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendEmailVerification 
} from 'firebase/auth'
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion,
  collection,
  query,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAgGkHhRcdGatNvRsm5BQv_RerjG8qt70M",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "adjucator-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "adjucator-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "adjucator-ai.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "82725691768",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:82725691768:web:6186a5b41b8a0aa1e7688d",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-N92VEHSKDE"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

// Auth functions
export const signUp = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  await sendEmailVerification(userCredential.user)
  return userCredential
}

export const signIn = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password)
}

export const signInWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider)
}

export const logOut = async () => {
  return await signOut(auth)
}

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}

// Firestore functions
export const createUserProfile = async (userId, data) => {
  const userRef = doc(db, "users", userId)
  await setDoc(userRef, {
    ...data,
    createdAt: new Date().toISOString(),
    history: []
  }, { merge: true })
}

export const getUserProfile = async (userId) => {
  const userRef = doc(db, "users", userId)
  const userSnap = await getDoc(userRef)
  return userSnap.exists() ? userSnap.data() : null
}

export const updateUserProfile = async (userId, data) => {
  const userRef = doc(db, "users", userId)
  await updateDoc(userRef, data)
}

export const saveSession = async (userId, session) => {
  const userRef = doc(db, "users", userId)
  await updateDoc(userRef, {
    history: arrayUnion(session)
  })
}

export const checkUsernameAvailable = async (username) => {
  const usernameRef = doc(db, "usernames", username)
  const usernameSnap = await getDoc(usernameRef)
  return !usernameSnap.exists()
}

export const reserveUsername = async (username, userId) => {
  const usernameRef = doc(db, "usernames", username)
  await setDoc(usernameRef, { uid: userId })
}

export { doc, setDoc, getDoc, updateDoc, arrayUnion }
