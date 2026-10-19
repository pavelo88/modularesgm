/**
 * Crea o actualiza el usuario Super Admin de Modulares GM.
 *
 * La contraseña NUNCA va escrita en este archivo (el repositorio es público).
 * Pásala por variable de entorno, solo en tu terminal:
 *
 *   PowerShell:  $env:SUPER_ADMIN_PASSWORD="<clave-larga-y-unica>"; node --env-file=.env scripts/create-super-admin.mjs
 *   Bash:        SUPER_ADMIN_PASSWORD='<clave-larga-y-unica>' node --env-file=.env scripts/create-super-admin.mjs
 *
 * Opcional: SUPER_ADMIN_EMAIL (por defecto info@modularesgm.com).
 * La clave no se imprime ni se guarda en Firestore; el usuario debe cambiarla en el primer acceso.
 */

import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const EMAIL = process.env.SUPER_ADMIN_EMAIL || 'info@modularesgm.com';
const PASSWORD = process.env.SUPER_ADMIN_PASSWORD;
const NAME = 'Administracion Modulares GM';
const USERNAME = 'admin_modulares';

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Faltan las variables NEXT_PUBLIC_FIREBASE_* (usa --env-file=.env).');
  process.exit(1);
}
if (!PASSWORD || PASSWORD.length < 12) {
  console.error('❌ Define SUPER_ADMIN_PASSWORD (mínimo 12 caracteres) solo en tu terminal. Ver cabecera del archivo.');
  process.exit(1);
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

async function main() {
  console.log(`→ Preparando super admin ${EMAIL}…`);
  let userCred;

  try {
    userCred = await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
    console.log('✔ Usuario existente: sesión iniciada.');
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      try {
        userCred = await createUserWithEmailAndPassword(auth, EMAIL, PASSWORD);
        console.log('✔ Usuario creado en Firebase Auth.');
      } catch (createErr) {
        if (createErr.code === 'auth/email-already-in-use') {
          console.error('❌ El correo ya existe con otra clave. Cámbiala desde Firebase Console > Authentication.');
          process.exit(1);
        }
        throw createErr;
      }
    } else {
      throw err;
    }
  }

  const user = userCred.user;
  await updateProfile(user, { displayName: NAME }).catch(() => {});

  // Perfil de equipo. No se guarda ninguna clave ni se usa la cédula como contraseña.
  await setDoc(doc(db, 'usuarios', user.uid), {
    uid: user.uid,
    name: NAME,
    email: EMAIL,
    role: 'super',
    active: true,
    forcePasswordChange: true,
    updatedAt: new Date().toISOString(),
  }, { merge: true });

  await setDoc(doc(db, 'userIndex', user.uid), { username: USERNAME, email: EMAIL }, { merge: true });

  await setDoc(doc(db, 'affiliates', USERNAME), {
    id: USERNAME,
    username: USERNAME,
    email: EMAIL,
    name: NAME,
    role: 'super',
    rank: 'Administrador',
    status: 'active',
    forcePasswordChange: true,
    authUid: user.uid,
    updatedAt: new Date().toISOString(),
  }, { merge: true });

  console.log(`✔ Super admin listo: ${EMAIL} (rol super). La clave no se muestra.`);
  await signOut(auth).catch(() => {});
}

main().catch((err) => {
  console.error('❌ Error en script:', err?.code || err?.message || err);
  process.exit(1);
});
