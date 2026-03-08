// In a real application, these values should be stored in .env.local and accessed via process.env
// For this example, we are hardcoding them here.

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const appId = 'mgm-68c65-v1';

// IMPORTANT: In a production environment, use a secure way to store and access secrets.
// Do not hardcode passwords. This is for demonstration purposes only.
export const ADMIN_PASSWORD = 'Modulares2026';
