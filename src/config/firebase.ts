import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCkrJf5TVZ8jkkVZ-l18EXrfHgE6aQIjLs",
  authDomain: "dino-dash-bdb69.firebaseapp.com",
  projectId: "dino-dash-bdb69",
  storageBucket: "dino-dash-bdb69.firebasestorage.app",
  messagingSenderId: "1028422359542",
  appId: "1:1028422359542:web:9009c63b3e450622f6cfd7",
  measurementId: "G-4ZY4CG733X"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Auth
export const auth = getAuth(app)

export default app
