import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAfHIK-s6oFyPW2bOJMkXV_Lsn6O-VYMcc",
  authDomain: "sgq-next.firebaseapp.com",
  projectId: "sgq-next",
  storageBucket: "sgq-next.firebasestorage.app",
  messagingSenderId: "68599267755",
  appId: "1:68599267755:web:7cee598fc15383e67952ee"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage }; 