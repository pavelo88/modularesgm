import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from '@/lib/config';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

let storage;
try {
  if (firebaseConfig.storageBucket) {
    storage = getStorage(app);
  }
} catch (error) {
  console.error("Firebase Storage could not be initialized:", error);
}

export { app, auth, db, storage };
