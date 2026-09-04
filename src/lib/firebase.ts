import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from '@/lib/config';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let _auth: Auth | undefined;
export const auth = new Proxy({} as Auth, {
  get(_target, prop) {
    if (!_auth) {
      _auth = getAuth(app);
    }
    const val = (_auth as any)[prop];
    return typeof val === 'function' ? val.bind(_auth) : val;
  }
});

const db = getFirestore(app);

let storage: FirebaseStorage | undefined;
try {
  if (firebaseConfig.storageBucket) {
    storage = getStorage(app);
  }
} catch (error) {
  console.error("Firebase Storage could not be initialized:", error);
}

export { app, db, storage };

