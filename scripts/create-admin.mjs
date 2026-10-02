import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Cargar variables de entorno locales
dotenv.config({ path: '.env.local' });

// Inicializar Firebase Admin
let app;
const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

try {
  if (raw) {
    app = initializeApp({ credential: cert(JSON.parse(raw)) });
  } else {
    app = initializeApp({ credential: applicationDefault() });
  }
} catch (error) {
  console.error("❌ Error inicializando Firebase Admin.");
  console.error("Asegúrate de haber ejecutado 'npx firebase login' o tener FIREBASE_SERVICE_ACCOUNT_JSON en tu .env.local");
  process.exit(1);
}

const db = getFirestore(app);

async function createAdminUser() {
  const email = "info@modularesgm.com";
  
  const userData = {
    authUid: email, // El usuario pidió que fuera el correo
    cedula: "Modulares2026",
    createdAt: "2026-09-22T02:52:04.674Z",
    email: email,
    forcePasswordChange: true,
    id: "admin_modulares",
    name: "Administracion Modulares GM",
    rank: "Administrador",
    role: "super",
    status: "active",
    username: "admin_modulares",
    updatedAt: new Date().toISOString()
  };

  try {
    // Usamos el correo como el ID del documento, como solicitaste
    await db.collection('usuarios').doc(email).set(userData);
    console.log(`✅ ¡Éxito! Usuario creado en la colección 'usuarios' con el ID del documento: ${email}`);
    
    // Si tenías un documento antiguo con el ID largo (Auth UID), te sugerimos borrarlo manualmente en la consola
    console.log("Nota: Si creaste manualmente el documento con el ID 'GdCpuHF9frbmRjytmVgydtAOQQE2', puedes borrarlo de Firestore para evitar duplicados.");
  } catch (error) {
    console.error("❌ Error al crear el usuario en Firestore:", error);
  }
}

createAdminUser();
