/**
 * Script para crear/actualizar el usuario Super Admin de Modulares GM.
 * 
 * Nombre: Administracion Modulares GM
 * Correo: info@modularesgm.com
 * Clave inicial: Modulares2026
 * 
 * Uso: node scripts/create-super-admin.mjs
 */

import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCdk1dBSIja_ynTEF8qwvFk66Dl3zjox-8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mgm-68c65.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mgm-68c65",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mgm-68c65.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "812491736447",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:812491736447:web:39d6f3f4cce2487475c64a",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

const EMAIL = 'info@modularesgm.com';
const PASSWORD = 'Modulares2026';
const NAME = 'Administracion Modulares GM';
const USERNAME = 'admin_modulares';

async function main() {
  console.log('🚀 Iniciando creación de Super Admin...');
  let userCred;
  let isNew = false;

  try {
    userCred = await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
    console.log('✔ Sesión iniciada con usuario existente en Firebase Auth.');
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      try {
        userCred = await createUserWithEmailAndPassword(auth, EMAIL, PASSWORD);
        isNew = true;
        console.log('✔ Nuevo usuario creado en Firebase Auth.');
      } catch (createErr) {
        if (createErr.code === 'auth/email-already-in-use') {
          console.log('ℹ El correo ya existe. Intentando actualizar perfil...');
          userCred = await signInWithEmailAndPassword(auth, EMAIL, PASSWORD).catch(() => null);
        } else {
          throw createErr;
        }
      }
    } else {
      throw err;
    }
  }

  if (userCred?.user) {
    const user = userCred.user;
    await updateProfile(user, { displayName: NAME }).catch(() => {});

    // Guardar en colección de usuarios admin
    await setDoc(doc(db, 'usuarios', user.uid), {
      uid: user.uid,
      name: NAME,
      email: EMAIL,
      role: 'super',
      cedula: PASSWORD,
      active: true,
      forcePasswordChange: true,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Guardar en colección de índice de usuarios
    await setDoc(doc(db, 'userIndex', user.uid), {
      username: USERNAME,
      email: EMAIL,
    }, { merge: true });

    // Guardar en colección de afiliados para compatibilidad
    await setDoc(doc(db, 'affiliates', USERNAME), {
      id: USERNAME,
      username: USERNAME,
      email: EMAIL,
      name: NAME,
      cedula: PASSWORD,
      role: 'super',
      rank: 'Administrador',
      status: 'active',
      forcePasswordChange: true,
      authUid: user.uid,
      createdAt: new Date().toISOString()
    }, { merge: true });

    console.log('==================================================');
    console.log('✅ SUPER ADMIN CREADO / CONFIGURADO CON ÉXITO');
    console.log(`📌 Correo:      ${EMAIL}`);
    console.log(`📌 Contraseña:  ${PASSWORD}`);
    console.log(`📌 Nombre:      ${NAME}`);
    console.log(`📌 Rol:         super`);
    console.log('📌 Cambio de clave obligatorio: SI (forcePasswordChange: true)');
    console.log('==================================================');

    await signOut(auth).catch(() => {});
  } else {
    console.error('❌ No se pudo autenticar/crear el usuario en Firebase Auth.');
  }
}

main().catch((err) => {
  console.error('❌ Error en script:', err);
  process.exit(1);
});
